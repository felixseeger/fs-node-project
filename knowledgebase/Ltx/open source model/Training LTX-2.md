***

## title: Training LTX-2

The LTX-2 Trainer enables researchers and advanced users to fine-tune LTX-2 models on custom datasets. You can train LoRAs, perform full fine-tuning, or create video-to-video transformations (IC-LoRA).

## Who Should Use the Trainer?

The trainer is designed primarily for:

* **Researchers** exploring video generation model training techniques
* **Advanced users** building specialized video generation models

## Requirements

Before starting, ensure you have:

* **LTX-2.3 Model Checkpoint** - Local `.safetensors` file
* **Gemma Text Encoder** - Local Gemma model directory ([download from HuggingFace](https://huggingface.co/google/gemma-3-12b-it-qat-q4_0-unquantized/))
* **Linux with CUDA** - CUDA 13+ recommended
* **Nvidia H100 GPU with 80GB+ VRAM** - Lower VRAM may work with gradient checkpointing and reduced resolutions

## Additional Documentation

For comprehensive training documentation, including setup instructions, dataset preparation guides, configuration options, and troubleshooting, visit the [LTX-2 Trainer GitHub repository](https://github.com/Lightricks/LTX-2/tree/main/packages/ltx-trainer).

The GitHub documentation includes:

* **Quick Start Guide** - Get training in minutes
* **Dataset Preparation** - Video preprocessing and captioning
* **Training Modes** - Detailed explanations of each training approach
* **Configuration Reference** - All available training parameters
* **Troubleshooting** - Solutions to common issues
* **Utility Scripts** - Tools for dataset management
