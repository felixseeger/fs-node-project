import os
import google.genai as genai
from PIL import Image

api_key = os.environ.get("GEMINI_API_KEY")
client = genai.Client(api_key=api_key)

img2 = Image.open("/Users/felixseeger/Projects/Node-Project/frontend/ref/save workflow 3-4.jpg")
img3 = Image.open("/Users/felixseeger/Projects/Node-Project/frontend/ref/save workflow 4-4.jpg")
img4 = Image.open("/Users/felixseeger/Projects/Node-Project/frontend/ref/save workflow_3-4.jpg")

response = client.models.generate_content(
    model='gemini-2.5-pro',
    contents=["Look at the OTHER screenshots. What steps are shown? What are the titles, subtitles, buttons, and form inputs in the modals? Describe exactly the content of the modals in 3-4.jpg, 4-4.jpg, and _3-4.jpg.", img2, img3, img4]
)
print(response.text)
