***

## title: Using ComfyUI with LTX-2

Use LTX-2 in ComfyUI with visual node-based workflows. This is the recommended way to work with LTX-2 for most users.

## Why ComfyUI?

ComfyUI provides the best balance of power and ease of use for LTX-2:

* **Visual workflows** - See your entire generation pipeline
* **Pre-built examples** - Start with working templates
* **Real-time experimentation** - Iterate quickly on parameters
* **Advanced features** - Access all LoRAs, control models, and tools
* **No coding required** - Drag, drop, and connect nodes

## Installation

### Prerequisites

Before you begin setting up an LTX-2 workflow in ComfyUI, make sure you have:

* **ComfyUI** installed ([Download here](https://www.comfy.org/download))
* **CUDA-compatible GPU** with 32GB+ VRAM
* **100GB+ free disk space** for models and cache
* **Python 3.10+** (usually included with ComfyUI)

### Recommended: ComfyUI Manager

This is the easiest method and handles dependencies automatically.

1. Open ComfyUI
2. Click the **Manage Extensions** button (or press `Ctrl+M`)
3. Select **Install Custom Nodes**
4. Search for **"LTXVideo"**
5. Click **Install** next to `ComfyUI-LTXVideo`
6. Wait for installation to complete
7. **Restart ComfyUI**

The nodes will appear in your node menu under the "LTXVideo" category.

### Alternative: Manual Installation

For more control:

```bash
# Navigate to ComfyUI custom nodes directory
cd ComfyUI/custom_nodes

# Clone the repository
git clone https://github.com/Lightricks/ComfyUI-LTXVideo.git

# Install requirements
cd ComfyUI-LTXVideo
pip install -r requirements.txt
```

**For portable/embedded ComfyUI installations:**

```bash
.\python_embeded\python.exe -m pip install -r .\ComfyUI\custom_nodes\ComfyUI-LTXVideo\requirements.txt
```

After installation, restart ComfyUI to load the new nodes.

### Verifying Installation

After restarting ComfyUI:

1. Right-click in the canvas
2. Navigate to **Add Node** → **LTXVideo**
3. You should see categories like:
   * `LTXVideo/loaders`
   * `LTXVideo/samplers`
   * `LTXVideo/conditioning`
   * `LTXVideo/utils`

If you don't see these, check the ComfyUI console for error messages.

## Models

### Automatic Download (Recommended)

The LTX-2 nodes will automatically download required models on first use.
Simply load a workflow and click "Queue Prompt" - the nodes will handle downloading.

### Manual Download

If you prefer to download models manually or need offline installation:

#### Base Models

Download from [Hugging Face](https://huggingface.co/Lightricks/LTX-2.3):

**For beginners (recommended):**

```bash
# 22B Distilled model
huggingface-cli download Lightricks/LTX-2.3 \
  --include "ltx-2.3-22b-distilled.safetensors" \
  --local-dir ComfyUI/models/checkpoints/LTX-Video
```

**For maximum quality:**

```bash
# 22B Full model
huggingface-cli download Lightricks/LTX-2.3 \
  --include "ltx-2.3-22b-dev.safetensors" \
  --local-dir ComfyUI/models/checkpoints/LTX-Video
```

#### Text Encoder

Install the Gemma 3 encoder using ComfyUI Manager:

1. Open ComfyUI Manager
2. Search for **"gemma-3-12b-it"**
3. Install the model

Or download manually from [Hugging Face](https://huggingface.co/google/gemma-3-12b-it-qat-q4_0-unquantized).

## Loading and Using Workflows

### Loading a Workflow

1. In ComfyUI, click **Load** (or press `Ctrl+O`)
2. Navigate to `custom_nodes/ComfyUI-LTXVideo/example_workflows/`
3. Select a `.json` workflow file
4. Click **Open**

### Modifying Parameters

Click any node to see its parameters in the sidebar:

1. **Text prompts**: Click text encode nodes
2. **Generation settings**: Click sampler nodes
3. **Output settings**: Click save nodes

### Running a Workflow

1. Configure your prompt and settings
2. Click **Queue Prompt** (or press `Ctrl+Enter`)
3. Watch the progress bar
4. Find output in your `ComfyUI/output/` folder

### Installing Missing Nodes

When you load a workflow with missing nodes:

1. ComfyUI will show a warning dialog
2. Click **Install Missing Custom Nodes**
3. ComfyUI Manager will install automatically
4. Restart ComfyUI after installation

Or install manually:

```bash
cd ComfyUI/custom_nodes
git clone [repository-url]
cd [node-folder]
pip install -r requirements.txt
```

## Example Workflows

The `ComfyUI-LTXVideo` installation includes comprehensive example workflows. Find them at:

```
ComfyUI/custom_nodes/ComfyUI-LTXVideo/example_workflows/
```

### Workflow Tips

**Starting a new project:**

1. Load a basic workflow first
2. Test with low resolution (480×720)
3. Use fewer frames (41-81) for speed
4. Increase quality once satisfied

**Memory management:**

* Close unused workflows
* Clear cache between large generations
* Use FP8 models for VRAM savings
* Process in batches if generating multiple videos

**Iteration workflow:**

1. Start with distilled model (fast)
2. Iterate on prompt and composition
3. Switch to full model for final render
4. Use upscaler for highest quality

## Troubleshooting

### Nodes Not Appearing

**Issue:** LTXVideo nodes don't show up after installation

**Solutions:**

* Verify installation in `ComfyUI/custom_nodes/ComfyUI-LTXVideo/`
* Check ComfyUI console for errors during startup
* Reinstall requirements: `pip install -r requirements.txt`
* Restart ComfyUI completely (close and reopen, not just refresh)
* Try manual installation method if ComfyUI Manager failed
* Check Python version (should be 3.10+)

### Workflow Errors

**Issue:** Workflow loads but shows red nodes or errors

**Solutions:**

* **Missing nodes**: Click "Install Missing Custom Nodes" in the error dialog
* **Update ComfyUI**: Make sure you're on the latest version
* **Update LTXVideo nodes**:
  ```bash
  cd ComfyUI/custom_nodes/ComfyUI-LTXVideo
  git pull
  pip install -r requirements.txt --upgrade
  ```
* **Check model paths**: Verify models are in correct locations
* **Incompatible workflow**: Some older workflows may need updates for newer node versions

### Missing Dependencies

**Issue:** Workflow requires additional custom nodes

**Solutions:**

* ComfyUI will show a list of missing nodes when loading
* Click **"Install Missing Custom Nodes"** button
* Common dependencies:
  * ComfyUI-VideoHelperSuite (video processing)
  * ComfyUI-Manager (node management)
  * ComfyUI-Impact-Pack (advanced features)
* Restart ComfyUI after installing dependencies

### Model Loading Errors

**Issue:** Models fail to load or show errors in console

**Solutions:**

* Verify model files aren't corrupted (check file sizes)
* Ensure models are in correct directories:
  * Checkpoints: `ComfyUI/models/checkpoints/`
  * VAE: `ComfyUI/models/vae/`
  * LoRAs: `ComfyUI/models/loras/`
* Try re-downloading the model
* Check that you have the correct model version for your nodes
* Look for specific error messages in the ComfyUI console

## Advanced Features

### Custom Workflow Creation

Build your own workflows by combining nodes:

1. Start with a [template](https://github.com/Lightricks/ComfyUI-LTXVideo/tree/master/example_workflows)
2. Add/remove nodes as needed
3. Connect nodes with click-and-drag
4. Save your workflow for reuse

**Common node patterns:**

**Basic generation:**

```
Model Loader → Text Encode → Sampler → VAE Decode → Save
```

**Image-to-video:**

```
Load Image → Image Conditioning → Sampler → VAE Decode → Save
```

**With upscaling:**

```
Sampler → Upscaler → Sampler → VAE Decode -> Save
```

### Integration with Other Nodes

LTXVideo nodes work with:

* **Image processing nodes**: Pre-process inputs
* **Video nodes**: Post-process outputs
* **Batch nodes**: Automate workflows

### Getting Help

<CardGroup cols={3}>
  <Card title="LTX Discord" icon="fa-brands fa-discord" href="https://discord.gg/ltxplatform">
    Ask questions and get support for LTX-2
  </Card>

  <Card title="ComfyUI Discord" icon="fa-brands fa-discord" href="https://discord.gg/comfyorg">
    Ask questions and get support for ComfyUI
  </Card>

  <Card title="GitHub Issues" icon="fa-brands fa-github" href="https://github.com/Lightricks/ComfyUI-LTXVideo/issues">
    Report bugs or request features
  </Card>
</CardGroup>
