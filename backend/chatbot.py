import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

gemini_api = os.getenv('GEMINI_API')
genai.configure(api_key=gemini_api)
model = genai.GenerativeModel("gemini-1.5-flash")

def generate_bot_response(heading):
    response = model.generate_content(f"""{heading}""")
    return response.text