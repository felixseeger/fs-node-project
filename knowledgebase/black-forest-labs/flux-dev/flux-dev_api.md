## Basic model info

Model name: black-forest-labs/flux-dev
Model description: A 12 billion parameter rectified flow transformer capable of generating images from text descriptions


## Model inputs

- prompt (required): Prompt for generated image (string)
- aspect_ratio (optional): Aspect ratio for the generated image (string)
- image (optional): Input image for image to image mode. The aspect ratio of your output will match this image (string)
- prompt_strength (optional): Prompt strength when using img2img. 1.0 corresponds to full destruction of information in image (number)
- num_outputs (optional): Number of outputs to generate (integer)
- num_inference_steps (optional): Number of denoising steps. Recommended range is 28-50, and lower number of steps produce lower quality outputs, faster. (integer)
- guidance (optional): Guidance for generated image. Lower values can give more realistic images. Good values to try are 2, 2.5, 3 and 3.5 (number)
- seed (optional): Random seed. Set for reproducible generation (integer)
- output_format (optional): Format of the output images (string)
- output_quality (optional): Quality when saving the output images, from 0 to 100. 100 is best quality, 0 is lowest quality. Not relevant for .png outputs (integer)
- disable_safety_checker (optional): Disable safety checker for generated images. (boolean)
- go_fast (optional): Run faster predictions with additional optimizations. (boolean)
- megapixels (optional): Approximate number of megapixels for generated image (string)


## Model output schema

{
  "type": "array",
  "items": {
    "type": "string",
    "format": "uri"
  },
  "title": "Output"
}

If the input or output schema includes a format of URI, it is referring to a file.


## Example inputs and outputs

Use these example outputs to better understand the types of inputs the model accepts, and the types of outputs the model returns:

### Example (https://replicate.com/p/pab8srw8jhrm20cj1e7s0d8kf4)

#### Input

```json
{
  "seed": 17536,
  "prompt": "womens street skateboarding final in Paris Olympics 2024",
  "go_fast": true,
  "guidance": 3.5,
  "num_outputs": 1,
  "aspect_ratio": "1:1",
  "output_format": "webp",
  "output_quality": 80,
  "prompt_strength": 0.8,
  "num_inference_steps": 28
}
```

#### Output

```json
[
  "https://replicate.delivery/yhqm/LhahE53ikx7ROteqIZ7Bgzc9wIoS76oQU8WLPPeUiCL9BiemA/out-0.webp"
]
```


### Example (https://replicate.com/p/nq7khvc4xdrm00cj1e6a72njbr)

#### Input

```json
{
  "prompt": "a tiny astronaut hatching from an egg on the moon",
  "go_fast": true,
  "guidance": 3.5,
  "num_outputs": 1,
  "aspect_ratio": "1:1",
  "output_format": "webp",
  "output_quality": 80,
  "prompt_strength": 0.8,
  "num_inference_steps": 28
}
```

#### Output

```json
[
  "https://replicate.delivery/yhqm/eGnzS3AVsry6VCfRTZEvI7aIe7Vdp2WzCgzfeWLHhGbz2P0bC/out-0.webp"
]
```


### Example (https://replicate.com/p/geeqkz2kthrm60cj1jcrgrs43g)

#### Input

```json
{
  "prompt": "a cat holding a sign that says hello world",
  "go_fast": true,
  "guidance": 3.5,
  "num_outputs": 1,
  "aspect_ratio": "1:1",
  "output_format": "webp",
  "output_quality": 80,
  "prompt_strength": 0.8,
  "num_inference_steps": 28
}
```

#### Output

```json
[
  "https://replicate.delivery/yhqm/jg3hiwcxfD2IaSemC8KFWrTEfZc55GnDKiKqkkYTncfnIZ6NB/out-0.webp"
]
```


### Example (https://replicate.com/p/ytx0wmwensrm00cj1jdax25r80)

#### Input

```json
{
  "prompt": "Three magical wizards standing on a yellow table, each holding a sign. On the left, a wizard in black robes holds a sign that says \u2018AI\u2019; in the middle, a witch in red robes holds a sign that says \u2018is\u2019; and on the right, a wizard in blue robes holds a sign that says \u2018cool\u2019",
  "go_fast": true,
  "guidance": 3.5,
  "num_outputs": 1,
  "aspect_ratio": "1:1",
  "output_format": "webp",
  "output_quality": 80,
  "prompt_strength": 0.8,
  "num_inference_steps": 28
}
```

#### Output

```json
[
  "https://replicate.delivery/yhqm/aC8cKHxl6nqfJ6h6ZANs6cjHGKe8BDrT7FqScrslK1QXTmemA/out-0.webp"
]
```


### Example (https://replicate.com/p/yga9jbf0ghrma0cpycs9qvvj3w)

#### Input

```json
{
  "prompt": "black forest gateau cake spelling out the words \"FLUX DEV\", tasty, food photography, dynamic shot",
  "go_fast": true,
  "guidance": 3.5,
  "megapixels": "1",
  "num_outputs": 1,
  "aspect_ratio": "1:1",
  "output_format": "webp",
  "output_quality": 80,
  "prompt_strength": 0.8,
  "num_inference_steps": 28
}
```

#### Output

```json
[
  "https://replicate.delivery/xezq/pvkq4S7Nx96bCdxUEK51fDCFx1Msf5UDJWItRW9VNeByPydpA/out-0.webp"
]
```


## Model readme

> ![](https://tjzk.replicate.delivery/markdownx/44d3556c-2848-45d3-8bbb-8be67da8ba3e.jpg)
> 
> `FLUX.1 [dev]` is a 12 billion parameter rectified flow transformer capable of generating images from text descriptions.
> For more information, please read our [blog post](https://blackforestlabs.ai/announcing-black-forest-labs/).
> 
> # Key Features
> 1. Cutting-edge output quality, second only to our state-of-the-art model `FLUX.1 [pro]`.
> 2. Competitive prompt following, matching the performance of closed source alternatives .
> 3. Trained using guidance distillation, making `FLUX.1 [dev]` more efficient.
> 4. Open weights to drive new scientific research, and empower artists to develop innovative workflows.
> 5. Generated outputs can be used for personal, scientific, and commercial purposes as described in the [flux-1-dev-non-commercial-license](https://huggingface.co/black-forest-labs/FLUX.1-dev/blob/main/LICENSE.md).
> 
> # Usage
> We provide a reference implementation of `FLUX.1 [dev]`, as well as sampling code, in a dedicated [github repository](https://github.com/black-forest-labs/flux).
> Developers and creatives looking to build on top of `FLUX.1 [dev]` are encouraged to use this as a starting point.
> 
> ## ComfyUI
> `FLUX.1 [dev]` is also available in [Comfy UI](https://github.com/comfyanonymous/ComfyUI) for local inference with a node-based workflow.
> 
> # Limitations
> - This model is not intended or able to provide factual information.
> - As a statistical model this checkpoint might amplify existing societal biases.
> - The model may fail to generate output that matches the prompts.
> - Prompt following is heavily influenced by the prompting-style.
> 
> # Out-of-Scope Use
> The model and its derivatives may not be used
> 
> - In any way that violates any applicable national, federal, state, local or international law or regulation.
> - For the purpose of exploiting, harming or attempting to exploit or harm minors in any way; including but not limited to the solicitation, creation, acquisition, or dissemination of child exploitative content.
> - To generate or disseminate verifiably false information and/or content with the purpose of harming others.
> - To generate or disseminate personal identifiable information that can be used to harm an individual.
> - To harass, abuse, threaten, stalk, or bully individuals or groups of individuals.
> - To create non-consensual nudity or illegal pornographic content.
> - For fully automated decision making that adversely impacts an individual's legal rights or otherwise creates or modifies a binding, enforceable obligation.
> - Generating or facilitating large-scale disinformation campaigns.
> 
> # Accelerated Inference
> We provide a `go_fast` flag within the API which toggles a version of flux-schnell optimized for inference. Currently this version is a compiled fp8 quantization with an optimized attention kernel. We'll update the model and this documentation as we develop further enhancements. 
>
