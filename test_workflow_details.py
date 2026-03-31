import os
import google.genai as genai
from PIL import Image

api_key = os.environ.get("GEMINI_API_KEY")
client = genai.Client(api_key=api_key)

img1 = Image.open("/Users/felixseeger/Projects/Node-Project/frontend/ref/save workflow 1-4.jpg")

response = client.models.generate_content(
    model='gemini-2.5-pro',
    contents=["Look closely at the FIRST screenshot (save workflow 1-4.jpg). Where is the 'Save as Workflow Template' button? What does it say exactly? What does the top bar say?", img1]
)
print(response.text)
