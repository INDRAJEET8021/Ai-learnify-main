from gevent import monkey
monkey.patch_all()

from flask import Flask, jsonify, request
from flask_cors import CORS
from quizGenerator import generate_quiz
from courseGenerator import gen_roadmap, gen_course
from chatbot import generate_bot_response
import json
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity, get_jwt
import os
import requests
from dotenv import load_dotenv

load_dotenv()

import cloudinary
import cloudinary.uploader
import cloudinary.api
app = Flask(__name__)
CORS(app)  # Enable CORS to allow cross-origin requests from React


# Database Configuration
# for local db
# app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://Indrajeet:12345@localhost/Ai'
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('SQLALCHEMY_DATABASE_URI')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')

# Cloudinary configuration
cloudinary.config(
    cloud_name=os.getenv('cloud_name'),
    api_key=os.getenv('api_key'),
    api_secret=os.getenv('api_secret')
)

# Initialize Extensions
db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(128), nullable=False)
    roadmap = db.Column(db.Text, nullable=True)  # Store roadmap file URL
    course = db.Column(db.Text, nullable=True)

    def __repr__(self):
        return f"<User {self.username}>"


@app.route('/api', methods=['GET'])
def api():
    return "This is /api from backend"

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('name')
    email = data.get('email')
    password = data.get('password')
    
    if User.query.filter_by(email=email).first():
        return jsonify({'error': 'Email already exists'}), 400
    
    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    new_user = User(username=username, email=email, password=hashed_password)
    
    db.session.add(new_user)
    db.session.commit()
    
    return jsonify({'message': 'User registered successfully Please Login'}), 201


@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    
    user = User.query.filter_by(email=email).first()
    
    if not user or not bcrypt.check_password_hash(user.password, password):
        return jsonify({'error': 'Invalid email or password'}), 401
    
    access_token = create_access_token(
        identity=user.email,  # Use user email as the identity
        additional_claims={"name": user.username}  # Add user.username as a separate claim
    )
    return jsonify({'message': 'Login successful', 'access_token': access_token}), 200


# @app.route('/profile', methods=['GET'])
# @jwt_required()
# def profile():
    email = get_jwt_identity()

    # Get the additional claims, which will include 'username'
    claims = get_jwt()
    username = claims.get("name")

    return jsonify({
        'username': username,
        'email': email
    }), 200

# Define the maximum number of retries and the delay between retries
MAX_RETRIES = 100

def safe_gen_course(heading, retries=MAX_RETRIES):
    """Try to call gen_course and retry if an error occurs."""
    for attempt in range(retries):
        try:
            # Attempt to generate the course description
            return gen_course(heading)
        except Exception as e:
            print(f"Error in gen_course for heading '{heading}': {e}")
            if attempt < retries - 1:
                print(f"Retrying... (Attempt {attempt + 2} of {retries})")
            else:
                print("Max retries reached. Returning empty description.")
                return "Description not available"
            
# Function to load courses from the JSON file with error handling for empty or invalid files
def load_courses(file_path):
    try:
        with open(file_path, 'r') as json_file:
            # Attempt to load the JSON data from the file
            data = json.load(json_file)
            # If the file is empty, return an empty list
            if not data:
                return []
            return data
    except FileNotFoundError:
        # If the file doesn't exist, return an empty list
        print(f"{file_path} not found. Initializing with empty data.")
        return []
    except json.JSONDecodeError:
        # If the file has invalid JSON, return an empty list
        print(f"Error decoding JSON in {file_path}. Initializing with empty data.")
        return []
    
# Function to update the JSON file with new courses
def update_courses_in_file(filename, new_courses):
    existing_courses = load_courses(filename)
    # Extend the existing data with new courses
    existing_courses.extend(new_courses)

    with open(filename, 'w') as json_file:
        json.dump(existing_courses, json_file, indent=4)
    
@app.route('/api/courses/search', methods=['GET'])
@jwt_required()
def search_courses():
    email = get_jwt_identity()
    query = request.args.get('query', '').lower()

    filtered_courses = gen_roadmap(query)

    user = User.query.filter_by(email=email).first()

    if not user.roadmap:
        try:
            with open(f'{email}_course_roadmap.json', 'w') as f:
                json.dump(filtered_courses, f)
        except Exception as e:
            print(e)
        try:
            roadmap_response = cloudinary.uploader.upload(f'{email}_course_roadmap.json', resource_type="raw")
            roadmap_url = roadmap_response['secure_url']
            user.roadmap = roadmap_url
            db.session.commit()
            os.remove(f'{email}_course_roadmap.json')
        except Exception as e:
            print(e)

    else:
        existing_roadmap={}
        try:
            roadmap_url = user.roadmap

            # Download the file content
            response = requests.get(roadmap_url)
            if response.status_code == 200:
                existing_roadmap = response.json()  # Parse the existing roadmap content
            else:
                existing_roadmap = []

            # Append new courses to the existing roadmap
            existing_roadmap.extend(filtered_courses)

            print(existing_roadmap)

            cloudinary.uploader.destroy(roadmap_url, resource_type="raw")

            # Create the updated roadmap file
            update_courses_in_file(f'{email}_course_roadmap.json', existing_roadmap)
        except Exception as e:
            print(f'Error: {e}')
        try:
            # Upload the updated roadmap to Cloudinary
            roadmap_response = cloudinary.uploader.upload(f'{email}_course_roadmap.json', resource_type="raw")
            roadmap_url = roadmap_response['secure_url']
            user.roadmap = roadmap_url  # Update the URL in the user's record
            db.session.commit()
            os.remove(f'{email}_course_roadmap.json')
        except Exception as e:
            print(f'Error: {e}')
        
    return jsonify({"courses": filtered_courses})

# Detailed Course
@app.route('/get_module', methods=['GET'])
@jwt_required()
def get_module():
    course_id = request.args.get('course-id')
    email = get_jwt_identity()

    # Fetch the user
    user = User.query.filter_by(email=email).first()

    if not user or not user.roadmap:
        return jsonify({"error": "User or roadmap not found."}), 404

    # Check if the detailed course is already generated
    if user.course:
        response = requests.get(user.course)
        if response.status_code == 200:
            existing_course = response.json()  # Parse the existing roadmap content
        else:
            existing_course = []
        
        course = next((c for c in existing_course if c['id'].lower() == course_id.lower()), None)

        if course:
            return jsonify(course)
        
         # Download the roadmap content
        response = requests.get(user.roadmap)
        if response.status_code == 200:
            existing_roadmap = response.json()  # Parse the roadmap content
        else:
            return jsonify({"error": "Failed to fetch roadmap content."}), response.status_code
        
        course = next((c for c in existing_roadmap if c['id'].lower() == course_id.lower()), None)
        if not course:
            print("Not course")
            return jsonify({"error": "Course not found."}), 404
        
        # Prepare the detailed course
        detailed_course = {
            "title": course["title"],
            "id": course["id"],
            "modules": []
        }

        for module in course['modules']:
            module_content = {
                "moduleTitle": module["moduleTitle"],
                "headings": []
            }

            for heading in module['headings']:
                module_content['headings'].append({
                    "heading": heading,
                    "description": safe_gen_course(heading, retries=MAX_RETRIES)
                })

            detailed_course["modules"].append(module_content)

        existing_course.extend([detailed_course])

        cloudinary.uploader.destroy(user.course, resource_type="raw")

        update_courses_in_file(f'{email}_detailed_course.json', existing_course)

        try:
            # Upload the updated roadmap to Cloudinary
            course_response = cloudinary.uploader.upload(f'{email}_detailed_course.json', resource_type="raw")
            course_url = course_response['secure_url']
            user.course = course_url  # Update the URL in the user's record
            db.session.commit()
            os.remove(f'{email}_detailed_course.json')
            return jsonify(detailed_course), 200
        except Exception as e:
            print(f'Error: {e}')
            return jsonify({"error": "Failed to upload the detailed course."}), 500
      
    # Download the roadmap content
    response = requests.get(user.roadmap)
    if response.status_code == 200:
        existing_roadmap = response.json()  # Parse the roadmap content
    else:
        return jsonify({"error": "Failed to fetch roadmap content."}), response.status_code
    
    course = next((c for c in existing_roadmap if c['id'].lower() == course_id.lower()), None)
    if not course:
        print("Not course")
        return jsonify({"error": "Course not found."}), 404
    
    # Prepare the detailed course
    detailed_course = {
        "title": course["title"],
        "id": course["id"],
        "modules": []
    }

    for module in course['modules']:
        module_content = {
            "moduleTitle": module["moduleTitle"],
            "headings": []
        }

        for heading in module['headings']:
            module_content['headings'].append({
                "heading": heading,
                "description": safe_gen_course(heading, retries=MAX_RETRIES)
            })

        detailed_course["modules"].append(module_content)

    with open(f'{email}_detailed_course.json', 'w') as f:
        json.dump([detailed_course], f)

    # Upload the detailed course to Cloudinary
    try:
        detailed_response = cloudinary.uploader.upload(
            f'{email}_detailed_course.json', 
            resource_type="raw"
        )
        detailed_url = detailed_response['secure_url']
        user.course = detailed_url
        db.session.commit()
        os.remove(f'{email}_detailed_course.json')
        return jsonify(detailed_course), 200
    except Exception as e:
        print(e)
        return jsonify({"error": "Failed to upload the detailed course."}), 500

@app.route('/chat', methods=['POST'])
# @jwt_required()
def chat():
    # Get the user's message from the request
    user_message = request.json.get('message')
    
    if not user_message:
        return jsonify({'error': 'No message provided'}), 400
    
    # Generate bot response based on user input
    bot_response = generate_bot_response(user_message)
    
    # Return the response as JSON
    return jsonify({'response': bot_response})

@app.route('/api/courses', methods=['GET'])
@jwt_required()
def get_courses():
   
    try:
        # Retrieve the user's email from the JWT token
        email = get_jwt_identity()

        # Fetch the user from the database
        user = User.query.filter_by(email=email).first()

        if not user:
            return jsonify({"error": "User not found. Please check your credentials."}), 404

        if not user.roadmap:
            return jsonify({"email": email, "courses": None}), 200
        # Fetch the roadmap content from Cloudinary
        roadmap_url = user.roadmap
        response = requests.get(roadmap_url)

        if response.status_code != 200:
            return jsonify({"error": "Failed to fetch roadmap from Cloudinary. Please try again later."}), response.status_code

        # Parse the JSON content from the roadmap file
        try:
            courses_data = response.json()  # Assuming Cloudinary contains valid JSON content
        except ValueError:
            return jsonify({"error": "Invalid roadmap format. Unable to parse the data."}), 500

        # Return the parsed courses data
        return jsonify({"email": email, "courses": courses_data}), 200

    except requests.RequestException as e:
        print(f"Request error while fetching roadmap: {e}")
        return jsonify({"error": "An error occurred while fetching the roadmap. Please try again later."}), 500

    except Exception as e:
        print(f"Unexpected error: {e}")
        return jsonify({"error": "An unexpected error occurred. Please try again later."}), 500

# Remove courses
@app.route('/api/remove_course', methods=['POST'])
@jwt_required()
def remove_course():
    try:
        email = get_jwt_identity()

        user = User.query.filter_by(email=email).first()

        if not user:
            return jsonify({"error": "User not found. Please check your credentials."}), 404

        if not user.roadmap:
            return jsonify({"error": "No roadmap found for this user."}), 400

        roadmap_url = user.roadmap
        course_url = user.course
        if user.course:
            response = requests.get(roadmap_url)

            response2 = requests.get(course_url)

            if response.status_code != 200 or response2.status_code != 200:
                return jsonify({"error": "Failed to fetch roadmap from Cloudinary. Please try again later."}), response.status_code

            try:
                roadmap_data = response.json()
            except ValueError:
                return jsonify({"error": "Invalid roadmap format. Unable to parse the data."}), 500
        
            try:
                course_data = response2.json()
            except ValueError:
                return jsonify({"error": "Invalid course format. Unable to parse the data."}), 500

            course_to_remove = request.json.get('course_title')
            if not course_to_remove:
                return jsonify({"error": "Course title is required to remove a course."}), 400

            updated_courses = [course for course in roadmap_data if course['title'] != course_to_remove]

            updated_detailed_courses = [course for course in course_data if course['title'] != course_to_remove]

            if not updated_courses:
                user.roadmap = None
                db.session.commit()

                cloudinary.uploader.destroy(roadmap_url, resource_type="raw")
        
            if not updated_detailed_courses:
                user.course = None
                db.session.commit()

                cloudinary.uploader.destroy(course_url, resource_type="raw")

            if updated_courses:
                try:
                    temp_filename = f"{email}_updated_course_roadmap.json"
                    with open(temp_filename, 'w') as temp_file:
                        json.dump(updated_courses, temp_file)

                    upload_response = cloudinary.uploader.upload(
                        temp_filename, 
                        resource_type="raw"
                    )
                    updated_roadmap_url = upload_response.get('secure_url')

                    if not updated_roadmap_url:
                        return jsonify({"error": "Failed to upload updated roadmap to Cloudinary."}), 500

                    user.roadmap = updated_roadmap_url
                    db.session.commit()

                    os.remove(temp_filename)
                except Exception as e:
                    print(f"Error while uploading updated roadmap: {e}")
                    return jsonify({"error": "Failed to update roadmap. Please try again later."}), 500
            
            if updated_detailed_courses:
                try:
                    temp_filename = f"{email}_updated_detailed_course.json"
                    with open(temp_filename, 'w') as temp_file:
                        json.dump(updated_detailed_courses, temp_file)

                    upload_response = cloudinary.uploader.upload(
                        temp_filename, 
                        resource_type="raw"
                    )
                    updated_roadmap_url = upload_response.get('secure_url')

                    if not updated_roadmap_url:
                        return jsonify({"error": "Failed to upload updated roadmap to Cloudinary."}), 500

                    user.course = updated_roadmap_url
                    db.session.commit()

                    os.remove(temp_filename)
                except Exception as e:
                    print(f"Error while uploading updated roadmap: {e}")
                    return jsonify({"error": "Failed to update roadmap. Please try again later."}), 500


        return jsonify({"message": "Course removed successfully.", "updated_courses": updated_courses}), 200

    except requests.RequestException as e:
        print(f"Request error while fetching roadmap: {e}")
        return jsonify({"error": "An error occurred while fetching the roadmap. Please try again later."}), 500

    except Exception as e:
        print(f"Unexpected error: {e}")
        return jsonify({"error": "An unexpected error occurred. Please try again later."}), 500

@app.route('/quiz', methods=['GET'])
def get_quiz():
    # Get the 'topic' query parameter
    topic = request.args.get('topic')

    quiz_data = generate_quiz(topic)
    # print(quiz_data)
    
    return jsonify(quiz_data)

if __name__ == '__main__':
    app.run(debug=True)

