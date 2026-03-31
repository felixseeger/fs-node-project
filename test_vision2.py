import os
import google.genai as genai
from PIL import Image

api_key = os.environ.get("GEMINI_API_KEY")
if not api_key:
    print("No API key")
    exit(1)

client = genai.Client(api_key=api_key)
img = Image.open("frontend/ref/navbar_nodes.jpg")

response = client.models.generate_content(
    model='gemini-2.5-pro',
    contents=["Describe the UI. The user asked to 'remove close button behind Node menu'. Is there a close button anywhere in this reference image? Speculate what they might be referring to.", img]
)
print(response.text)
