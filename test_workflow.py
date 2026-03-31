import os
import google.genai as genai
from PIL import Image

api_key = os.environ.get("GEMINI_API_KEY")
client = genai.Client(api_key=api_key)

img1 = Image.open("/Users/felixseeger/Projects/Node-Project/frontend/ref/save workflow 1-4.jpg")
img2 = Image.open("/Users/felixseeger/Projects/Node-Project/frontend/ref/save workflow 3-4.jpg")
img3 = Image.open("/Users/felixseeger/Projects/Node-Project/frontend/ref/save workflow 4-4.jpg")
img4 = Image.open("/Users/felixseeger/Projects/Node-Project/frontend/ref/save workflow_3-4.jpg")

response = client.models.generate_content(
    model='gemini-2.5-pro',
    contents=["Please analyze these screenshots. What is the process being shown? Describe the UI for 'Workspaces' vs 'Workflows'. Is there a 'Save as Workflow Template' modal? Describe the structure, buttons, inputs, and layouts so I can build it in React. Replace FLORA with FS workspace. Pay close attention to what 'slug/Workflow page' means and how it relates to 'slug/workspaces page'.", img1, img2, img3, img4]
)
print(response.text)
