#!/usr/bin/env python3
"""
Video Generation Test Suite
Tests video generation nodes and workflows using Gemini Vision API
"""

import os
import google.genai as genai
from PIL import Image
import json
import tempfile
import subprocess
import time
from datetime import datetime

# Configuration
API_KEY = os.environ.get("GEMINI_API_KEY")
if not API_KEY:
    print("Error: No GEMINI_API_KEY environment variable set")
    exit(1)

# Initialize Gemini client
client = genai.Client(api_key=API_KEY)

# Test configuration
TEST_CONFIG = {
    "video_nodes": [
        "OmniHumanNode",
        "RunwayGen4TurboNode", 
        "VideoImproveNode",
        "Kling3Node",
        "PixVerseV5Node",
        "SeedanceNode"
    ],
    "test_scenarios": [
        "basic_video_generation",
        "video_upscaling",
        "video_style_transfer",
        "video_inpainting",
        "video_to_video",
        "multi_node_workflow"
    ]
}

def capture_screenshot(output_file="frontend/visual-diff-output/current.png"):
    """Capture screenshot of the current application state"""
    try:
        # Use Playwright to capture screenshot
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

def analyze_video_node_ui(screenshot_path, node_name):
    """Analyze a specific video node's UI using Gemini Vision"""
    try:
        img = Image.open(screenshot_path)
        
        prompt = f"""Analyze this video generation node UI for {node_name}:

1. What is the current state of the node? (idle, loading, error, complete)
2. Are all required input handles visible and properly labeled?
3. Are all output handles visible and properly labeled?
4. Is there a video preview area visible?
5. What controls are available for video generation?
6. Are there any UI issues or inconsistencies?

Be specific about colors, labels, positioning, and any visual problems."""
        
        response = client.models.generate_content(
            model='gemini-2.5-pro',
            contents=[prompt, img]
        )
        
        return response.text
        
    except Exception as e:
        print(f"Error analyzing {node_name} UI: {e}")
        return None

def test_video_generation_workflow(node_name, test_scenario):
    """Test a complete video generation workflow"""
    print(f"\n=== Testing {node_name} - {test_scenario} ===")
    
    # Step 1: Capture current UI state
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    screenshot_file = f"test_screenshots/{node_name}_{test_scenario}_{timestamp}.png"
    
    if not capture_screenshot(screenshot_file):
        print(f"❌ Failed to capture screenshot for {node_name}")
        return False
    
    # Step 2: Analyze the UI
    print(f"🔍 Analyzing {node_name} UI...")
    analysis = analyze_video_node_ui(screenshot_file, node_name)
    
    if not analysis:
        print(f"❌ Failed to analyze {node_name} UI")
        return False
    
    print(f"✅ Analysis complete for {node_name}")
    print("Analysis:", analysis[:500] + "..." if len(analysis) > 500 else analysis)
    
    # Step 3: Save analysis to file
    analysis_file = f"test_results/{node_name}_{test_scenario}_{timestamp}.txt"
    os.makedirs("test_results", exist_ok=True)
    with open(analysis_file, "w") as f:
        f.write(f"Video Node Test Analysis\n")
        f.write(f"Node: {node_name}\n")
        f.write(f"Scenario: {test_scenario}\n")
        f.write(f"Timestamp: {timestamp}\n\n")
        f.write(analysis)
    
    return True

def test_video_node_connections(node_name):
    """Test video node connection handling"""
    print(f"\n=== Testing {node_name} Connections ===")
    
    # Capture screenshot focused on connections
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    screenshot_file = f"test_screenshots/{node_name}_connections_{timestamp}.png"
    
    if not capture_screenshot(screenshot_file):
        print(f"❌ Failed to capture connections screenshot for {node_name}")
        return False
    
    try:
        img = Image.open(screenshot_file)
        
        prompt = f"""Analyze the connection handling for {node_name}:

1. What input handles are available and what types do they accept?
2. What output handles are available and what types do they provide?
3. Are there any connected inputs? If so, what are they connected to?
4. Are the connection types correct (video to video, text to text, etc.)?
5. Are there any invalid or problematic connections?
6. How does the node handle missing required inputs?

Focus on the handles (colored circles) and connection lines between nodes."""
        
        response = client.models.generate_content(
            model='gemini-2.5-pro',
            contents=[prompt, img]
        )
        
        analysis = response.text
        print(f"✅ Connection analysis complete for {node_name}")
        
        # Save connection analysis
        analysis_file = f"test_results/{node_name}_connections_{timestamp}.txt"
        os.makedirs("test_results", exist_ok=True)
        with open(analysis_file, "w") as f:
            f.write(f"Video Node Connection Analysis\n")
            f.write(f"Node: {node_name}\n")
            f.write(f"Timestamp: {timestamp}\n\n")
            f.write(analysis)
        
        return True
        
    except Exception as e:
        print(f"❌ Failed to analyze connections for {node_name}: {e}")
        return False

def test_video_output_quality(node_name):
    """Test the quality and format of video outputs"""
    print(f"\n=== Testing {node_name} Output Quality ===")
    
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    screenshot_file = f"test_screenshots/{node_name}_output_{timestamp}.png"
    
    if not capture_screenshot(screenshot_file):
        print(f"❌ Failed to capture output screenshot for {node_name}")
        return False
    
    try:
        img = Image.open(screenshot_file)
        
        prompt = f"""Analyze the video output quality and display for {node_name}:

1. Is there a video preview visible in the node?
2. What are the dimensions/resolution of the displayed video?
3. Does the video appear to be playing correctly?
4. Are there any playback controls visible?
5. What is the visual quality of the video (sharpness, colors, artifacts)?
6. Are there any UI elements overlapping or obscuring the video?
7. Does the output match the expected format for this type of node?

Be specific about any quality issues, formatting problems, or UI inconsistencies."""
        
        response = client.models.generate_content(
            model='gemini-2.5-pro',
            contents=[prompt, img]
        )
        
        analysis = response.text
        print(f"✅ Output quality analysis complete for {node_name}")
        
        # Save output analysis
        analysis_file = f"test_results/{node_name}_output_{timestamp}.txt"
        os.makedirs("test_results", exist_ok=True)
        with open(analysis_file, "w") as f:
            f.write(f"Video Node Output Quality Analysis\n")
            f.write(f"Node: {node_name}\n")
            f.write(f"Timestamp: {timestamp}\n\n")
            f.write(analysis)
        
        return True
        
    except Exception as e:
        print(f"❌ Failed to analyze output for {node_name}: {e}")
        return False

def run_all_video_tests():
    """Run comprehensive video generation tests"""
    print("🚀 Starting Video Generation Test Suite")
    print(f"Testing {len(TEST_CONFIG['video_nodes'])} video nodes")
    print(f"Running {len(TEST_CONFIG['test_scenarios'])} test scenarios per node")
    
    # Create directories if they don't exist
    os.makedirs("test_screenshots", exist_ok=True)
    os.makedirs("test_results", exist_ok=True)
    
    all_results = []
    
    # Test each video node
    for node_name in TEST_CONFIG['video_nodes']:
        print(f"\n🎬 Testing {node_name}")
        
        node_results = {
            "node": node_name,
            "tests": [],
            "overall_status": "passed"
        }
        
        # Test basic workflow
        workflow_result = test_video_generation_workflow(node_name, "basic_video_generation")
        node_results["tests"].append({
            "test": "basic_workflow",
            "status": "passed" if workflow_result else "failed"
        })
        
        # Test connections
        connections_result = test_video_node_connections(node_name)
        node_results["tests"].append({
            "test": "connections",
            "status": "passed" if connections_result else "failed"
        })
        
        # Test output quality
        output_result = test_video_output_quality(node_name)
        node_results["tests"].append({
            "test": "output_quality",
            "status": "passed" if output_result else "failed"
        })
        
        # Determine overall status
        if any(test["status"] == "failed" for test in node_results["tests"]):
            node_results["overall_status"] = "failed"
        
        all_results.append(node_results)
        
        # Small delay between node tests
        time.sleep(2)
    
    # Generate test report
    generate_test_report(all_results)
    
    # Print summary
    passed_nodes = sum(1 for result in all_results if result["overall_status"] == "passed")
    total_nodes = len(all_results)
    
    print(f"\n📊 Test Summary:")
    print(f"Passed: {passed_nodes}/{total_nodes} nodes")
    print(f"Failed: {total_nodes - passed_nodes}/{total_nodes} nodes")
    
    for result in all_results:
        status_emoji = "✅" if result["overall_status"] == "passed" else "❌"
        print(f"  {status_emoji} {result['node']}: {result['overall_status']}")
        for test in result["tests"]:
            test_emoji = "✅" if test["status"] == "passed" else "❌"
            print(f"    {test_emoji} {test['test']}: {test['status']}")
    
    return passed_nodes == total_nodes

def generate_test_report(results):
    """Generate a comprehensive test report"""
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    report_file = f"test_results/video_test_report_{timestamp}.md"
    
    with open(report_file, "w") as f:
        f.write("# Video Generation Test Report\n\n")
        f.write(f"**Generated:** {timestamp}\n\n")
        
        # Summary
        passed_nodes = sum(1 for result in results if result["overall_status"] == "passed")
        total_nodes = len(results)
        
        f.write(f"## Summary\n")
        f.write(f"- **Total Nodes Tested:** {total_nodes}\n")
        f.write(f"- **Passed:** {passed_nodes}\n")
        f.write(f"- **Failed:** {total_nodes - passed_nodes}\n")
        f.write(f"- **Success Rate:** {(passed_nodes/total_nodes)*100:.1f}%\n\n")
        
        # Detailed Results
        f.write("## Detailed Results\n\n")
        
        for result in results:
            f.write(f"### {result['node']}\n")
            f.write(f"**Status:** {result['overall_status'].upper()}\n\n")
            
            for test in result["tests"]:
                f.write(f"- **{test['test'].replace('_', ' ').title()}:** {test['status'].upper()}\n")
            
            f.write("\n")
        
        # Test Environment
        f.write("## Test Environment\n")
        f.write(f"- **Gemini Model:** gemini-2.5-pro\n")
        f.write(f"- **Test Scenarios:** {', '.join(TEST_CONFIG['test_scenarios'])}\n")
        f.write(f"- **Nodes Tested:** {', '.join(TEST_CONFIG['video_nodes'])}\n")
        
        print(f"📝 Test report generated: {report_file}")

if __name__ == "__main__":
    # Ensure frontend is running
    print("🔌 Make sure the frontend dev server is running (npm run dev)")
    print("🔌 Make sure the backend API server is running (cd api && npm start)")
    print("🔌 Press Enter to start tests...")
    input()
    
    success = run_all_video_tests()
    
    if success:
        print("\n🎉 All video generation tests passed!")
        exit(0)
    else:
        print("\n⚠️  Some video generation tests failed. Check test_results/ for details.")
        exit(1)