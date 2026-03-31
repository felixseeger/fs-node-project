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
    contents=["Please analyze this screenshot of a UI. The user asked to 'remove close button behind Node menu'. Look carefully at the Node menu (top left, with the Plus icon or expanded icons). Is there a 'close' button or an 'x' button or any kind of close icon visible behind it, near it, or overlapping it? Describe exactly where it is and what it looks like.", img]
)
print(response.text)
