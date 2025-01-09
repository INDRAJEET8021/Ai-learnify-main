import google.generativeai as genai
import json
import os
from dotenv import load_dotenv

load_dotenv()

gemini_api = os.getenv('GEMINI_API')
genai.configure(api_key=gemini_api)
model = genai.GenerativeModel("gemini-1.5-flash")

def generate_quiz(topic):
    response = model.generate_content(f"""Generate a Quiz on {topic} of 10 mcq type questions.
        Generate output in json format with structure as follows:
        {{
        "question": "Make question on topic",
        "options": "[optionA, optionB, optionC, optionD]"
        "correct": "Correct Option Name like optionA or optionB or so on..." 
        }}
        """,
        generation_config=genai.GenerationConfig(
            response_mime_type="application/json"
        ),
    )

    fixed_response = f"[{response.text}]"

    try:
        res = json.loads(fixed_response)
    except json.JSONDecodeError as e:
        print("Error decoding JSON:", e)
    return res