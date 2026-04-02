import os
import google.genai as genai
from PIL import Image

api_key = os.environ.get("GEMINI_API_KEY")
if not api_key:
    print("No API key")
    exit(1)

client = genai.Client(api_key=api_key)
img = Image.open("frontend/ref/update-asset.jpg")

response = client.models.generate_content(
    model='gemini-2.5-pro',
    contents=["Please analyze this screenshot of an 'Asset Update' or 'Edit Asset' modal/window. Describe its layout, colors, headers, input fields, image preview, and buttons in exact detail so I can recreate it perfectly in React with inline CSS. Pay close attention to icons, borders, paddings, and alignment.", img]
)
print(response.text)
