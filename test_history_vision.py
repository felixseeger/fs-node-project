import os
import google.genai as genai
from PIL import Image

api_key = os.environ.get("GEMINI_API_KEY")
if not api_key:
    print("No API key")
    exit(1)

client = genai.Client(api_key=api_key)
img_path = "/Users/felixseeger/Projects/Node-Project/frontend/ref/search-history.jpg"

if not os.path.exists(img_path):
    print(f"Image not found: {img_path}")
else:
    img = Image.open(img_path)
    response = client.models.generate_content(
        model='gemini-2.5-pro',
        contents=["Please analyze this screenshot of a 'Search History' menu. Describe its location on the screen, its layout, the search bar, filters, and how the history items are displayed (images, text, metadata, layout of each item). Describe everything in detail so I can recreate it in React.", img]
    )
    print(response.text)
