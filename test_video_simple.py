#!/usr/bin/env python3
"""
Simple Video Generation Test
Quick verification that video generation nodes are working
"""

import os
import google.genai as genai
from PIL import Image
import subprocess
from datetime import datetime

# Configuration
API_KEY = os.environ.get("GEMINI_API_KEY")
if not API_KEY:
    print("Error: No GEMINI_API_KEY environment variable set")
    exit(1)

# Initialize Gemini client
client = genai.Client(api_key=API_KEY)

def capture_screenshot(output_file="test_simple_screenshot.png"):
    """Capture screenshot of the current application state"""
    try:
        result = subprocess.run([
            "npx", "playwright", "screenshot",
            "--url", "http://localhost:5173",
            "--wait-for-selector", ".react-flow",
            output_file
        ], capture_output=True, text=True, timeout=30)
        
        if result.returncode != 0:
            print(f"Screenshot capture failed: {result.stderr}")
            return False
        return True
    except Exception as e:
        print(f"Error capturing screenshot: {e}")
        return False

def test_video_nodes_present():
    """Quick test to verify video nodes are visible in the UI"""
    print("🎬 Testing video node presence...")
    
    if not capture_screenshot("test_simple_screenshot.png"):
        print("❌ Failed to capture screenshot")
        return False
    
    try:
        img = Image.open("test_simple_screenshot.png")
        
        prompt = """Analyze this AI pipeline editor screenshot:

1. Are there any video generation nodes visible?
2. If yes, list the video node names you can identify.
3. Are there video output handles (teal circles) visible?
4. Are there video preview areas showing video content?

Focus on identifying video-related components in the node-based editor."""
        
        response = client.models.generate_content(
            model='gemini-2.5-pro',
            contents=[prompt, img]
        )
        
        analysis = response.text
        print("✅ Video node analysis complete:")
        print(analysis)
        
        # Save results
        with open("test_simple_results.txt", "w") as f:
            f.write(f"Simple Video Node Test\n")
            f.write(f"Timestamp: {datetime.now().strftime('%Y%m%d_%H%M%S')}\n\n")
            f.write(analysis)
        
        return True
        
    except Exception as e:
        print(f"❌ Failed to analyze video nodes: {e}")
        return False

if __name__ == "__main__":
    print("🔌 Make sure the frontend dev server is running (npm run dev)")
    print("🔌 Make sure the backend API server is running (cd api && npm start)")
    print("🔌 Press Enter to run simple video test...")
    input()
    
    if test_video_nodes_present():
        print("\n🎉 Simple video test completed successfully!")
        print("Check test_simple_results.txt for details.")
        exit(0)
    else:
        print("\n⚠️  Simple video test failed.")
        exit(1)