import os
import google.genai as genai
from PIL import Image

api_key = os.environ.get("GEMINI_API_KEY")
if not api_key:
    print("No API key")
    exit(1)

client = genai.Client(api_key=api_key)

img1 = Image.open("/Users/felixseeger/Projects/Node-Project/frontend/ref/prefs_1-3.jpg")
img2 = Image.open("/Users/felixseeger/Projects/Node-Project/frontend/ref/prefs_2-3.jpg")
img3 = Image.open("/Users/felixseeger/Projects/Node-Project/frontend/ref/prefs_3-3.jpg")

response = client.models.generate_content(
    model='gemini-2.5-pro',
    contents=["Please analyze these screenshots of a 'Preferences' / 'Account' UI. I need to implement this UI in React. Tell me exactly what it looks like. What are the tabs? What is in the content area for each tab? What are the form fields, toggles, buttons, headers, and descriptions? Describe the layout, colors, and styling details.", img1, img2, img3]
)
print(response.text)
