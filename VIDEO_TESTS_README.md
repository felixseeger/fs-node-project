# Video Generation Test Suite

This test suite provides comprehensive testing for video generation nodes and workflows in the AI Pipeline Editor.

## Overview

The video generation test suite uses Google Gemini's Vision API to analyze UI screenshots and validate:
- Video node functionality
- Connection handling
- Output quality
- Workflow integration

## Test Coverage

### Video Nodes Tested
- **OmniHumanNode** - AI avatar video generation
- **RunwayGen4TurboNode** - Runway Gen-4 Turbo video generation
- **VideoImproveNode** - Video quality improvement and alignment
- **Kling3Node** - Kling 3 video generation
- **PixVerseV5Node** - PixVerse V5 video generation
- **SeedanceNode** - Seedance video generation

### Test Scenarios
- Basic video generation workflows
- Video upscaling and enhancement
- Video style transfer
- Video inpainting
- Video-to-video transformation
- Multi-node workflow integration

## Requirements

### Environment Variables
```bash
export GEMINI_API_KEY="your_google_gemini_api_key"
```

### Dependencies
```bash
pip install google-genai pillow
```

### Services Required
- Frontend dev server running (`npm run dev`)
- Backend API server running (`cd api && npm start`)
- Playwright installed (`npx playwright install`)

## Running Tests

### Basic Test Run
```bash
python test_video_generation.py
```

### Test Output Structure
```
test_video_generation.py
├── test_screenshots/          # Captured UI screenshots
│   ├── OmniHumanNode_basic_video_generation_YYYYMMDD_HHMMSS.png
│   ├── RunwayGen4TurboNode_connections_YYYYMMDD_HHMMSS.png
│   └── ...
├── test_results/              # Analysis reports
│   ├── OmniHumanNode_basic_video_generation_YYYYMMDD_HHMMSS.txt
│   ├── video_test_report_YYYYMMDD_HHMMSS.md
│   └── ...
└── video_test_report_YYYYMMDD_HHMMSS.md  # Main test report
```

## Test Workflow

1. **Screenshot Capture** - Uses Playwright to capture the current UI state
2. **Gemini Vision Analysis** - Analyzes screenshots for:
   - Node UI state and controls
   - Connection handling and types
   - Output quality and formatting
3. **Result Generation** - Creates detailed analysis reports
4. **Report Generation** - Compiles comprehensive test report

## Test Analysis Areas

### UI State Analysis
- Current node state (idle, loading, error, complete)
- Input/output handle visibility and labeling
- Video preview area presence and functionality
- Available controls and their states

### Connection Analysis
- Input handle types and acceptance criteria
- Output handle types and provided data
- Connection validity (type matching)
- Missing required input handling
- Connection visualization

### Output Quality Analysis
- Video preview visibility and functionality
- Resolution and dimensions
- Playback controls
- Visual quality (sharpness, colors, artifacts)
- UI element overlap issues
- Format compliance

## Test Report Format

The generated test report includes:

```markdown
# Video Generation Test Report

Generated: YYYYMMDD_HHMMSS

## Summary
- Total Nodes Tested: X
- Passed: Y
- Failed: Z
- Success Rate: XX.X%

## Detailed Results

### OmniHumanNode
**Status:** PASSED

- **Basic Workflow:** PASSED
- **Connections:** PASSED  
- **Output Quality:** PASSED

### RunwayGen4TurboNode
**Status:** PASSED

- **Basic Workflow:** PASSED
- **Connections:** PASSED
- **Output Quality:** PASSED

## Test Environment
- Gemini Model: gemini-2.5-pro
- Test Scenarios: basic_video_generation, video_upscaling, ...
- Nodes Tested: OmniHumanNode, RunwayGen4TurboNode, ...
```

## Integration with Existing Tests

This test suite complements the existing vision tests:
- `test_vision.py` - General UI analysis
- `test_workflow.py` - Workflow UI validation
- `test_video_generation.py` - **Video-specific testing**

## Customizing Tests

### Adding New Video Nodes
Edit `TEST_CONFIG` in `test_video_generation.py`:

```python
TEST_CONFIG = {
    "video_nodes": [
        "OmniHumanNode",
        "RunwayGen4TurboNode", 
        "VideoImproveNode",
        "Kling3Node",
        "PixVerseV5Node",
        "SeedanceNode",
        "YourNewVideoNode"  # Add new nodes here
    ],
    # ...
}
```

### Adding Test Scenarios
Add new scenarios to the test configuration:

```python
TEST_CONFIG = {
    # ...
    "test_scenarios": [
        "basic_video_generation",
        "video_upscaling",
        "video_style_transfer",
        "video_inpainting",
        "video_to_video",
        "multi_node_workflow",
        "your_custom_scenario"  # Add new scenarios here
    ]
}
```

## Troubleshooting

### Common Issues

**Playwright not installed:**
```bash
npx playwright install
```

**Gemini API key not set:**
```bash
export GEMINI_API_KEY="your_api_key"
```

**Servers not running:**
```bash
# Terminal 1: Frontend
cd frontend && npm run dev

# Terminal 2: Backend  
cd api && npm start
```

**Screenshot capture failures:**
- Ensure the application is visible and not minimized
- Check that the React Flow canvas is loaded
- Verify Playwright has necessary permissions

## Best Practices

1. **Run tests on clean UI state** - Start each test with a fresh node setup
2. **Test one node at a time** - Avoid overlapping UI elements
3. **Review analysis reports** - Gemini provides detailed insights about UI issues
4. **Combine with manual testing** - Use automated tests to catch regressions, manual testing for edge cases
5. **Run tests regularly** - Include in CI/CD pipeline for video-related changes

## CI/CD Integration

Add to your CI pipeline:

```yaml
- name: Run Video Generation Tests
  run: |
    export GEMINI_API_KEY=${{ secrets.GEMINI_API_KEY }}
    python test_video_generation.py
  env:
    GEMINI_API_KEY: ${{ secrets.GEMINI_API_KEY }}
```

## Test Maintenance

- **Update node list** when new video nodes are added
- **Review test scenarios** periodically for relevance
- **Update Gemini prompts** as UI evolves
- **Archive old test results** to maintain performance

## License

This test suite is part of the AI Pipeline Editor project and follows the same licensing terms.