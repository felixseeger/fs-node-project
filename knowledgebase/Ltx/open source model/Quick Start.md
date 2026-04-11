***

## title: Quick Start

Let's get started generating video!

## Choose Your Workflow

LTX-2.3 offers multiple ways to generate videos locally. We recommend starting with **ComfyUI** for the best balance of power and ease of use. If you prefer a standalone app with a built-in video editor, choose **LTX Desktop**.

<CardGroup cols={2}>
  <Card title="ComfyUI" icon="diagram-project" href="#comfyui-quick-start">
    Node-based workflow editor for maximum control and customization.
  </Card>

  <Card title="LTX Desktop" icon="desktop" href="#ltx-desktop">
    Standalone app with a built-in editor.
  </Card>
</CardGroup>

***

## ComfyUI Quick Start

ComfyUI provides an intuitive node-based interface. If you have not previously installed ComfyUI, download it here: [https://www.comfy.org/download](https://www.comfy.org/download)

### Installation

**Recommended: ComfyUI Manager**

1. Launch ComfyUI and launch **ComfyUI Manager**
2. Search for **"LTXVideo"**
3. Click **Install** on the `ComfyUI-LTXVideo` node pack
4. Restart ComfyUI

**Alternative: Manual Installation**

```bash
# Clone the repository
git clone https://github.com/Lightricks/ComfyUI-LTXVideo.git
cd ComfyUI-LTXVideo

# Set up the environment
uv sync --frozen
source .venv/bin/activate
```

For portable/embedded installations:

```bash
.\python_embeded\python.exe -m pip install -r .\ComfyUI\custom_nodes\ComfyUI-LTXVideo\requirements.txt
```

***

### Your First Video

1. **Load a workflow**: In ComfyUI, click **Load** and select an example workflow from the LTXVideo nodes
2. **Set your prompt**: Find the text encode node and enter your description
3. **Queue prompt**: Click **Queue Prompt** to generate

Video generation time will depend on your GPU and VRAM.

<CardGroup cols={2}>
  <Card title="ComfyUI Guide" icon="diagram-project" href="/open-source-model/integration-tools/comfy-ui">
    Complete guide to nodes, workflows, models, and advanced features
  </Card>
</CardGroup>

***

## LTX Desktop

LTX Desktop is an open-source desktop app for generating videos with LTX models locally on supported Windows/Linux NVIDIA GPUs, with an API mode for unsupported hardware and macOS.

Download the latest release from [https://github.com/Lightricks/LTX-Desktop/releases](https://github.com/Lightricks/LTX-Desktop/releases)

<Note>
  LTX Desktop is currently in beta.
</Note>

### Requirements

| Platform              | Generation mode  | GPU requirement                                    |
| --------------------- | ---------------- | -------------------------------------------------- |
| Windows / Linux       | Local generation | NVIDIA GPU with **≥16 GB VRAM**                    |
| macOS (Apple Silicon) | API mode only    | Requires [LTX API key](https://console.ltx.video/) |

You'll also need at least 16 GB system RAM (32 GB recommended) and **160 GB free disk space** for model weights, the Python environment, and outputs.

### Installation

1. Download the latest installer from [GitHub Releases](https://github.com/Lightricks/LTX-Desktop/releases)
2. Install and launch **LTX Desktop**
3. Complete first-run setup — you'll be prompted to accept model license terms
4. Configure text encoding (choose one):
   * **LTX API key (recommended)** — Cloud-based text encoding is free and speeds up inference.
   * **Local Text Encoder** — Enable in Settings for fully offline operation. Requires an additional model download.

***

### Your First Video

1. Enter a text prompt describing the video you want to generate
2. Click **Generate**

Generation time depends on your GPU, file resolution, and duration.

<CardGroup cols={2}>
  <Card title="LTX Desktop on GitHub" icon="desktop" href="https://github.com/Lightricks/LTX-Desktop">
    Source code, documentation, and issue tracker
  </Card>
</CardGroup>

***

## What's Next?

Now that you have LTX-2.3 running, explore these guides to get the most out of the model:

### Essential Guides

<CardGroup cols={2}>
  <Card title="Prompt Engineering" icon="pen-fancy" href="/open-source-model/usage-guides/prompting-guide">
    Learn to write prompts that generate exactly what you want
  </Card>

  <Card title="Text-to-Video" icon="video" href="/open-source-model/usage-guides/text-to-video">
    Create videos from text descriptions
  </Card>

  <Card title="Image-to-Video" icon="images" href="/open-source-model/usage-guides/image-to-video">
    Prompting with images
  </Card>
</CardGroup>

***

## Getting Help

<CardGroup cols={2}>
  <Card title="LTX Discord" icon="fa-brands fa-discord" href="https://discord.gg/ltxplatform">
    Get help from the team and community
  </Card>

  <Card title="Report Issues" icon="bug" href="https://github.com/Lightricks/">
    Found a bug? Let us know!
  </Card>
</CardGroup>
