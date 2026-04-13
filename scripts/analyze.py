import os
import base64
from google import genai
from google.genai import types

client = genai.Client(api_key=os.environ["GOOGLE_GEMINI_API_KEY"])

with open("frontend/ref/workflow-template_card.jpg", "rb") as f:
    b64 = base64.b64encode(f.read()).decode("utf-8")

response = client.models.generate_content(
    model='gemini-2.5-flash',
    contents=[
        types.Part.from_bytes(data=b64, mime_type='image/jpeg'),
        'Analyze this UI component carefully. Is it a small card in a grid or a full detailed view? Describe its layout, styling, colors, typography, buttons, tags, icons, hover states if obvious. Provide HTML structure.'
    ]
)

print(response.text)
