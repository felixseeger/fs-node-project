import os
import google.genai as genai
from PIL import Image

api_key = os.environ.get("GEMINI_API_KEY")
if not api_key:
    print("No API key")
    exit(1)

client = genai.Client(api_key=api_key)
img = Image.open("frontend/visual-diff-output/current.png")

response = client.models.generate_content(
    model='gemini-2.5-pro',
    contents=["Please scan the entire image current.png for any button that looks like an X, or says Close, particularly in the left side area where the menu is. If you see a menu, look carefully behind or around it. Describe all buttons or icons on the left side of the screen.", img]
)
print(response.text)
