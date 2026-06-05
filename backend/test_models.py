import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()
api_key = os.environ.get('GEMINI_API_KEY')
print("API KEY:", api_key)

genai.configure(api_key=api_key)
try:
    for m in genai.list_models():
        if 'generateContent' in m.supported_generation_methods:
            print("Supported Model:", m.name)
except Exception as e:
    print("Error:", e)
