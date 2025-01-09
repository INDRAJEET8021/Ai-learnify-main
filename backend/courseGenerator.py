import google.generativeai as genai
import json
import os
from dotenv import load_dotenv

load_dotenv()

gemini_api = os.getenv('GEMINI_API')
genai.configure(api_key=gemini_api)
model = genai.GenerativeModel("gemini-1.5-flash")

def gen_roadmap(topic):
    response = model.generate_content(f"""Generate a full course roadmap for the {topic}. Provide the output in JSON format, including the course title, a list of modules, and the headings under each module. Generate 2 modules and 2 headings for each module. 
                The structure should be as follows:
                {{
                "id": "Make id of quiz by replacing spaces with - and all lowercase letters on title",
                "title": "Course Title",
                "description": "Write some description of course in 1 line or 2 line.",
                "modules": [
                    {{
                    "moduleTitle": "Module 1 Title",
                    "headings": ["Heading 1", "Heading 2", "Heading 3"]
                    }},
                    {{
                    "moduleTitle": "Module 2 Title",
                    "headings": ["Heading 1", "Heading 2", "Heading 3"]
                    }}
                ]
                }}
                """,
                generation_config=genai.GenerationConfig(
                response_mime_type="application/json"
                ),
            )
    
    fixed_response = f"[{response.text}]"

    try:
        res = json.loads(fixed_response)
        return res
    except json.JSONDecodeError as e:
        print("Error decoding JSON:", e)
        return

def gen_course(heading):
    response = model.generate_content(f"""give me full information on {heading} with as much detail as possible without using copyright material""")
    # print(response.text)
    return response.text