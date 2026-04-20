## Basic model info

Model name: ideogram-ai/ideogram-v3-turbo
Model description: Turbo is the fastest and cheapest Ideogram v3. v3 creates images with stunning realism, creative designs, and consistent styles


## Model inputs

- prompt (required): Text prompt for image generation (string)
- aspect_ratio (optional): Aspect ratio. Ignored if a resolution or inpainting image is given. (string)
- resolution (optional): Resolution. Overrides aspect ratio. Ignored if an inpainting image is given. (string)
- magic_prompt_option (optional): Magic Prompt will interpret your prompt and optimize it to maximize variety and quality of the images generated. You can also use it to write prompts in different languages. (string)
- image (optional): An image file to use for inpainting. You must also use a mask. (string)
- mask (optional): A black and white image. Black pixels are inpainted, white pixels are preserved. The mask will be resized to match the image size. (string)
- style_type (optional): The styles help define the specific aesthetic of the image you want to generate. (string)
- style_reference_images (optional): A list of images to use as style references. (array)
- seed (optional): Random seed. Set for reproducible generation (integer)
- style_preset (optional): Apply a predefined artistic style to the generated image (V3 models only). (string)


## Model output schema

{
  "type": "string",
  "title": "Output",
  "format": "uri"
}

If the input or output schema includes a format of URI, it is referring to a file.


## Example inputs and outputs

Use these example outputs to better understand the types of inputs the model accepts, and the types of outputs the model returns:

### Example (https://replicate.com/p/00tkc0axa5rme0cpgw0szf8rsg)

#### Input

```json
{
  "prompt": "a photo of a puppy holding a sign that says \"Ideogram v3 turbo\"",
  "resolution": "None",
  "style_type": "None",
  "aspect_ratio": "3:2",
  "magic_prompt_option": "Auto"
}
```

#### Output

```json
"https://replicate.delivery/xezq/tDuIAGGzMm5UL5yynezHnpUcBgL26aWiiBiK8ITYinI3e9nUA/tmpd6k9wqxz.png"
```


### Example (https://replicate.com/p/03ds4cr8x9rmc0cpgw3v739wmm)

#### Input

```json
{
  "prompt": "beautiful bauhaus stark typographic poster saying \"Ideogram v3 on Replicate\", pink and gold",
  "resolution": "None",
  "style_type": "None",
  "aspect_ratio": "3:4",
  "magic_prompt_option": "Auto"
}
```

#### Output

```json
"https://replicate.delivery/xezq/RFyglHoiP8rsJdlutGMxyuEWr8WdnWxT4jMpQNB6xf9xBfnUA/tmp6f59n7v6.png"
```


### Example (https://replicate.com/p/kzza4w3swdrm80cphf3rd486gw)

#### Input

```json
{
  "prompt": "The text \"V3 Turbo\" in the center middle. A color film-inspired portrait of a young man looking to the side with a shallow depth of field that blurs the surrounding elements, drawing attention to his eye. The fine grain and cast suggest a high ISO film stock, while the wide aperture lens creates a motion blur effect, enhancing the candid and natural documentary style.",
  "resolution": "None",
  "style_type": "None",
  "aspect_ratio": "3:2",
  "magic_prompt_option": "Auto"
}
```

#### Output

```json
"https://replicate.delivery/xezq/WHz71UTYXvrTNNeSSZr8ZW9q6W2MwgbcKiTgqumFpBElwIUKA/tmp0s1h52uw.png"
```


### Example (https://replicate.com/p/fpjk5a3bsdrme0csfmxa21zxf0)

#### Input

```json
{
  "prompt": "color film portrait of a man looking to the side with a shallow depth of field, high ISO film grain, wide aperture motion blur effect, \"Ideogram V3 Turbo\" mechanic garage style badge on the shoulder",
  "resolution": "None",
  "style_type": "None",
  "aspect_ratio": "3:2",
  "style_preset": "None",
  "magic_prompt_option": "Auto"
}
```

#### Output

```json
"https://replicate.delivery/xezq/iUb8mQvVuCIMKJm8LRJqyeQfvV7XAKI8QhiOF0xb3ewmSfhVB/tmpzjxag9at.png"
```


### Example (https://replicate.com/p/k49h1c9e9nrma0csfmvvjs5dd8)

#### Input

```json
{
  "prompt": "renaissance painting of a chihuahua with \"Ideogram 3.0 Turbo\" on the dog contest medal, strong side light",
  "resolution": "None",
  "style_type": "None",
  "aspect_ratio": "3:2",
  "style_preset": "None",
  "magic_prompt_option": "Auto"
}
```

#### Output

```json
"https://replicate.delivery/xezq/3x9wwuoCScrlBRNbizAjU2frLnEZZ2nhxxRkSTeTuJtAmfwqA/tmpf4onl_tp.png"
```


### Example (https://replicate.com/p/w6jn2nmsthrma0csfmyv87ydm0)

#### Input

```json
{
  "prompt": "modernist typographic poster saying \"Ideogram v3 on Replicate\", pink and gold",
  "resolution": "None",
  "style_type": "None",
  "aspect_ratio": "2:3",
  "style_preset": "None",
  "magic_prompt_option": "Off"
}
```

#### Output

```json
"https://replicate.delivery/xezq/soRkAkFWkkpsHN7zRNjKH8xQ0WXy6RQqKEs2PLvdfuKR2PsKA/tmp3ze2wxrb.png"
```


## Model readme

> # Ideogram 3.0
> 
> - [Turbo](https://replicate.com/ideogram-ai/ideogram-v3-turbo): fastest and cheapest at $0.03/image
> - [Balanced](https://replicate.com/ideogram-ai/ideogram-v3-balanced): a good balance between speed and quality at $0.06/image
> - [Quality](https://replicate.com/ideogram-ai/ideogram-v3-quality): slowest but highest quality at $0.09/image
> 
> ## Overview
> 
> Ideogram 3.0 is a text-to-image model available on ideogram.ai and iOS. The model features improved image-prompt alignment, photorealism, and text rendering capabilities.
> 
> ## Key Features
> 
> ### Style References
> 
> - Upload up to 3 reference images to control generation aesthetics
> - Random style feature provides access to 4.3 billion style presets
> - Reuse styles via Style Codes
> 
> ### Text and Layout Generation
> 
> - Precise text generation for graphic design applications
> - Support for complex and lengthy text compositions
> - Enhanced typesetting capabilities
> 
> ### Visual Quality
> 
> - Sophisticated spatial compositions
> - Precise lighting and color control
> - Detailed environmental elements
> - Realistic rendering
> 
> ## Use Cases
> 
> - Graphic design
> - Advertising
> - Marketing
> - Small business branding
> - Logo creation
> - Promotional materials
> - Product photography
