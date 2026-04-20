## Basic model info

Model name: black-forest-labs/flux-1.1-pro
Model description: Faster, better FLUX Pro. Text-to-image model with excellent image quality, prompt adherence, and output diversity.


## Model inputs

- aspect_ratio (optional): Aspect ratio for the generated image (string)
- output_format (optional): Format of the output images. (string)
- seed (optional): Random seed. Set for reproducible generation (integer)
- width (optional): Width of the generated image in text-to-image mode. Only used when aspect_ratio=custom. Must be a multiple of 32 (if it's not, it will be rounded to nearest multiple of 32). Note: Ignored in img2img and inpainting modes. (integer)
- height (optional): Height of the generated image in text-to-image mode. Only used when aspect_ratio=custom. Must be a multiple of 32 (if it's not, it will be rounded to nearest multiple of 32). Note: Ignored in img2img and inpainting modes. (integer)
- prompt (required): Text prompt for image generation (string)
- image_prompt (optional): Image to use with Flux Redux. This is used together with the text prompt to guide the generation towards the composition of the image_prompt. Must be jpeg, png, gif, or webp. (string)
- output_quality (optional): Quality when saving the output images, from 0 to 100. 100 is best quality, 0 is lowest quality. Not relevant for .png outputs (integer)
- safety_tolerance (optional): Safety tolerance, 1 is most strict and 6 is most permissive (integer)
- prompt_upsampling (optional): Automatically modify the prompt for more creative generation (boolean)


## Model output schema

{
  "type": "string",
  "title": "Output",
  "format": "uri"
}

If the input or output schema includes a format of URI, it is referring to a file.


## Example inputs and outputs

Use these example outputs to better understand the types of inputs the model accepts, and the types of outputs the model returns:

### Example (https://replicate.com/p/0s78r9y3tdrge0cjf05sxnjg8w)

#### Input

```json
{
  "prompt": "a beautiful mystical landscape photo with the text \"FLUX 1.1 [Pro]\", subtle beauty, must say \"1.1\", incorporate blueberries",
  "aspect_ratio": "1:1",
  "output_format": "webp",
  "output_quality": 80,
  "safety_tolerance": 2,
  "prompt_upsampling": true
}
```

#### Output

```json
"https://replicate.delivery/czjl/jf91x1a9ZJRYY6u6E83jNUq7CMHR7lEVFOiJ3BdfmwxyYeKnA/output.webp"
```


### Example (https://replicate.com/p/11yss2r0gnrge0cjf05rk4np6r)

#### Input

```json
{
  "prompt": "black forest gateau cake spelling out the words \"FLUX 1.1 Pro\", tasty, food photography",
  "aspect_ratio": "1:1",
  "output_format": "webp",
  "output_quality": 80,
  "safety_tolerance": 2,
  "prompt_upsampling": true
}
```

#### Output

```json
"https://replicate.delivery/czjl/HQZ89fz0ogUSJi2RLpuTyYERDsOKRsbNNJwLMOHdGIEAMvyJA/output.webp"
```


### Example (https://replicate.com/p/hxvjgf8hmhrge0ckcmdbr6k0km)

#### Input

```json
{
  "prompt": "black forest gateau cake spelling out the words \"FLUX 1 . 1 Pro\", tasty, food photography",
  "aspect_ratio": "1:1",
  "output_format": "webp",
  "output_quality": 80,
  "safety_tolerance": 2,
  "prompt_upsampling": true
}
```

#### Output

```json
"https://replicate.delivery/czjl/XetPfMnnBtnyLUNiNcnl2Hneyeo8AsfsOl2AG5Znql5f3VK9E/tmpuv7lgrx7.jpg"
```


## Model readme

> **FLUX1.1 [pro]** provides six times faster generation than its predecessor [FLUX.1 [pro]](https://replicate.com/black-forest-labs/flux-pro) while also improving image quality, prompt adherence, and diversity.
> 
> * Superior Speed and Efficiency: Faster generation times and reduced latency, enabling more efficient workflows. FLUX1.1 [pro] provides an ideal tradeoff between image quality and inference speed.
> * Improved Performance: FLUX1.1 [pro] has been introduced and tested under the codename "blueberry" into the [Artificial Analysis image arena](https://artificialanalysis.ai/text-to-image/arena), a popular benchmark for text-to-image models. It surpasses all other models on the leaderboard, achieving the highest overall Elo score.
> 
> Read the announcement from Black Forest Labs [here](https://blackforestlabs.ai/announcing-flux-1-1-pro-and-the-bfl-api/).
> 
> All public FLUX.1 models are based on a hybrid architecture of [multimodal](https://arxiv.org/abs/2403.03206) and [parallel diffusion transformer](https://arxiv.org/abs/2302.05442) blocks and scaled to 12B parameters. We improve over previous state-of-the-art diffusion models by building on [flow matching](https://arxiv.org/abs/2210.02747), a general and conceptually simple method for training generative models, which includes diffusion as a special case. In addition, we increase model performance and improve hardware efficiency by incorporating [rotary positional embeddings](https://arxiv.org/abs/2104.09864) and [parallel attention layers](https://arxiv.org/abs/2302.05442).
