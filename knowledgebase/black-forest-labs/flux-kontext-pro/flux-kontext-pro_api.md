## Basic model info

Model name: black-forest-labs/flux-kontext-pro
Model description: A state-of-the-art text-based image editing model that delivers high-quality outputs with excellent prompt following and consistent results for transforming images through natural language


## Model inputs

- aspect_ratio (optional): Aspect ratio of the generated image. Use 'match_input_image' to match the aspect ratio of the input image. (string)
- output_format (optional): Output format for the generated image (string)
- seed (optional): Random seed. Set for reproducible generation (integer)
- prompt (required): Text description of what you want to generate, or the instruction on how to edit the given image. (string)
- input_image (optional): Image to use as reference. Must be jpeg, png, gif, or webp. (string)
- safety_tolerance (optional): Safety tolerance, 0 is most strict and 6 is most permissive. 2 is currently the maximum allowed when input images are used. (integer)
- prompt_upsampling (optional): Automatic prompt improvement (boolean)


## Model output schema

{
  "type": "string",
  "title": "Output",
  "format": "uri"
}

If the input or output schema includes a format of URI, it is referring to a file.


## Example inputs and outputs

Use these example outputs to better understand the types of inputs the model accepts, and the types of outputs the model returns:

### Example (https://replicate.com/p/ks1w6tyk9nrma0cq6ycacv92xm)

#### Input

```json
{
  "prompt": "Make this a 90s cartoon",
  "input_image": "https://replicate.delivery/pbxt/N55l5TWGh8mSlNzW8usReoaNhGbFwvLeZR3TX1NL4pd2Wtfv/replicate-prediction-f2d25rg6gnrma0cq257vdw2n4c.png",
  "aspect_ratio": "match_input_image",
  "output_format": "jpg",
  "safety_tolerance": 2
}
```

#### Output

```json
"https://replicate.delivery/xezq/83OKs6yfdoT5YCpfREnrFFbqLbfWbus8Q0e06fQ0BAMDRKamC/tmpu3nqollf.jpg"
```


### Example (https://replicate.com/p/np51x74339rme0cq70c9tavpwc)

#### Input

```json
{
  "prompt": "Remove the background",
  "input_image": "https://replicate.delivery/pbxt/N55pSqbotI3rzaKDVbWZ6rscqt3SYAs2M5e0vtp9YJQsansl/replicate-prediction-f2d25rg6gnrma0cq257vdw2n4c.png",
  "aspect_ratio": "16:9",
  "output_format": "jpg",
  "safety_tolerance": 2
}
```

#### Output

```json
"https://replicate.delivery/xezq/aheXEzy4hpXoYS2lvxLoFpP7esSDdeCsSeO4hB4qRSZhTNNTB/tmp4i5moj6n.jpg"
```


### Example (https://replicate.com/p/2qak8pz5mnrma0cq70ca1f74rw)

#### Input

```json
{
  "prompt": "make this a photo",
  "input_image": "https://replicate.delivery/pbxt/N56hgwBgzG8vtKd81daHBXdRg7GJ5Vks17uwuGlvLJCWRYt6/lofigirl-1-1000x563-1280097039.jpg",
  "aspect_ratio": "match_input_image",
  "output_format": "jpg",
  "safety_tolerance": 2
}
```

#### Output

```json
"https://replicate.delivery/xezq/QYjBmohenWRdVy8wz2Dx2eebkqMwxNT52DB6Km9d6UOjqmmpA/tmp4s2tgbcv.jpg"
```


### Example (https://replicate.com/p/7r8cr8vn15rme0cq70cv1bx0v0)

#### Input

```json
{
  "prompt": " ",
  "input_image": "https://replicate.delivery/pbxt/N5aac0dHBimjTNOYimvaYdgylQTDUigPSTMgIrzyJxClgIKn/favorite-screenshot-from-each-movie-v0-2jlw02gbtfid1.jpg",
  "aspect_ratio": "2:3",
  "output_format": "jpg",
  "safety_tolerance": 2
}
```

#### Output

```json
"https://replicate.delivery/xezq/NKcyCeiUXqTFdqeV7OsiSj6VreNTV1LAAsf6lCC0ufJxuaamC/tmp8i8r55a5.jpg"
```


### Example (https://replicate.com/p/14pr5yqe9nrma0cq70da6qn1pw)

#### Input

```json
{
  "prompt": "Replace 'joy' with 'Pro'",
  "input_image": "https://replicate.delivery/pbxt/N5i6Pma4GRn4vLnKNMfNXs2mRrzPTAzRXgzZY6fBQZmCBDnE/choose-joy.png",
  "aspect_ratio": "match_input_image",
  "output_format": "jpg",
  "safety_tolerance": 2
}
```

#### Output

```json
"https://replicate.delivery/xezq/kMdXfZiQ3yyhdSTvSuA6d2cz8gS8RWdPwRprRqSp7r2rrpZKA/tmp6jyqxjqc.jpg"
```


### Example (https://replicate.com/p/6ecbh4c8bxrm80cq70ds0s20rm)

#### Input

```json
{
  "prompt": "Change the background to a beach while keeping the person in the exact same position, scale, and pose. Maintain identical subject placement, camera angle, framing, and perspective. Only replace the environment around them",
  "input_image": "https://replicate.delivery/pbxt/N5v1sR7FeOaBYBcRLwTcbxxrmoXytMt9mKpBD3BATJlf2FZt/old-man.png",
  "aspect_ratio": "match_input_image",
  "output_format": "jpg",
  "safety_tolerance": 2
}
```

#### Output

```json
"https://replicate.delivery/xezq/pEX07z5DOJooLlDVczziumyOKjZGTgU6p1v9fh5X6GcfXTzUA/tmpemtbtszq.jpg"
```


### Example (https://replicate.com/p/jcb8e9t09srme0cq70ebn00aq4)

#### Input

```json
{
  "prompt": "Using this style, a bunny, a dog and a cat are having a tea party seated around a small white table",
  "input_image": "https://replicate.delivery/pbxt/N5iHx84xgpS6jyvXeVQ7s3GAMyL6xCLsS5Kk3RhLxJOpcasc/black-and-white-style.png",
  "aspect_ratio": "match_input_image",
  "output_format": "jpg",
  "safety_tolerance": 2
}
```

#### Output

```json
"https://replicate.delivery/xezq/XSaq6jcZUAJxC9vOL41lbotfdKfFbJAYfhpf4gCPeAIpFbamC/tmpon7_4qhh.jpg"
```


### Example (https://replicate.com/p/04k7d14dbsrm80cq70eanv1hgr)

#### Input

```json
{
  "prompt": "Using this style, a panda astronaut riding a unicorn",
  "input_image": "https://replicate.delivery/pbxt/N5cepICxyaagdvULl0phi7ImdxuFz05TR2l623zqxhNR9q5Y/van-gogh.jpeg",
  "aspect_ratio": "match_input_image",
  "output_format": "jpg",
  "safety_tolerance": 2
}
```

#### Output

```json
"https://replicate.delivery/xezq/Zk6873DOWw6HCRVYh4kU3OdABAjOXqUByuXmeKl8AkigspZKA/tmp9geu7x04.jpg"
```


## Model readme

> # FLUX.1 Kontext - Text-Based Image Editing
> 
> FLUX.1 Kontext is a state-of-the-art image editing model from Black Forest Labs that allows you to edit images using text prompts. It's the best in class for text-guided image editing and offers superior results compared to other models like OpenAI's 4o/gpt-image-1.
> 
> ## Available Models
> 
> - **[FLUX.1 Kontext [dev]](https://replicate.com/black-forest-labs/flux-kontext-dev)**: Open-weight version with non-commercial license (commercial use available through Replicate)
> - **[FLUX.1 Kontext [pro]](https://replicate.com/black-forest-labs/flux-kontext-pro)**: State-of-the-art performance with high-quality outputs, great prompt following, and consistent results
> - **[FLUX.1 Kontext [max]](https://replicate.com/black-forest-labs/flux-kontext-max)**: Premium model with maximum performance and improved typography generation
> 
> ## What You Can Do
> 
> Kontext excels at:
> 
> - **Style Transfer**: Convert photos to different art styles (watercolor, oil painting, sketches)
> - **Object/Clothing Changes**: Modify hairstyles, add accessories, change colors
> - **Text Editing**: Replace text in signs, posters, and labels
> - **Background Swapping**: Change environments while preserving subjects
> - **Character Consistency**: Maintain identity across multiple edits
> 
> ## Prompting Best Practices
> 
> ### Be Specific
> 
> - Use clear, detailed language with exact colors and descriptions
> - Avoid vague terms like "make it better"
> - Name subjects directly: "the woman with short black hair" vs. "she"
> 
> ### Preserve Intentionally
> 
> - Specify what should stay the same: "while keeping the same facial features"
> - Use "maintain the original composition" to preserve layout
> - For background changes: "Change the background to a beach while keeping the person in the exact same position"
> 
> ### Text Editing Tips
> 
> - Use quotation marks: "replace 'old text' with 'new text'"
> - Stick to readable fonts
> - Match text length when possible to preserve layout
> 
> ### Style Transfer
> 
> - Be specific about artistic styles: "impressionist painting" not "artistic"
> - Reference known movements: "Renaissance" or "1960s pop art"
> - Describe key traits: "visible brushstrokes, thick paint texture"
> 
> ### Complex Edits
> 
> - Break into smaller steps for better results
> - Start simple and iterate
> - Use descriptive action verbs instead of "transform" for more control
> 
> ## Commercial Use
> 
> When using FLUX.1 Kontext on Replicate, you're free to use outputs commercially in apps, marketing, or any business use.
> 
> ## Example Applications
> 
> Check out these [specialized apps](https://replicate.com/flux-kontext-apps) built with Kontext:
> 
> - [Portrait series](https://replicate.com/flux-kontext-apps/portrait-series): Generate portrait variations from a single image
> - [Change haircut](https://replicate.com/flux-kontext-apps/change-haircut): Modify hairstyles and colors
> - [Iconic locations](https://replicate.com/flux-kontext-apps/iconic-locations): Place subjects in famous landmarks
> - [Professional headshot](https://replicate.com/flux-kontext-apps/professional-headshot): Create professional portraits
> 
> ## Tips Summary
> 
> - **Be specific** with colors, styles, and descriptions
> - **Start simple** and iterate on successful edits
> - **Preserve intentionally** by stating what to keep unchanged
> - **Use quotation marks** for exact text replacements
> - **Control composition** by specifying camera angles and framing
> - **Choose verbs carefully** - "change" vs "transform" gives different results
