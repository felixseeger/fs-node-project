## Basic model info

Model name: google/imagen-4
Model description: Google's Imagen 4 flagship model


## Model inputs

- prompt (required): Text prompt for image generation (string)
- aspect_ratio (optional): Aspect ratio of the generated image (string)
- image_size (optional): Resolution of the generated image (string)
- safety_filter_level (optional): block_low_and_above is strictest, block_medium_and_above blocks some prompts, block_only_high is most permissive but some prompts will still be blocked (string)
- output_format (optional): Format of the output image (string)


## Model output schema

{
  "type": "string",
  "title": "Output",
  "format": "uri"
}

If the input or output schema includes a format of URI, it is referring to a file.


## Example inputs and outputs

Use these example outputs to better understand the types of inputs the model accepts, and the types of outputs the model returns:

### Example (https://replicate.com/p/111arpt4pnrma0cpydtr8n0qx0)

#### Input

```json
{
  "prompt": "a graphic says \"Imagen-4 now on Replicate\", exceptional typography, pink and gold hues, photography",
  "aspect_ratio": "4:3",
  "safety_filter_level": "block_medium_and_above"
}
```

#### Output

```json
"https://replicate.delivery/xezq/ryDddTNfnFTAYabtuXweXo9ZnaaxgwPtpCXZz11Eomf7X0dpA/tmp7davvggs.png"
```


### Example (https://replicate.com/p/j1dzzbrsjsrm80cpye1r4f36sc)

#### Input

```json
{
  "prompt": "A serene, shallow pool nestled among creek rocks, with several small koi fish playfully swimming under sunlight. The water reflects a clear blue sky and tree tops above. Lush aquatic plants sway gently, clearly visible beneath the surface",
  "aspect_ratio": "16:9",
  "negative_prompt": "",
  "safety_filter_level": "block_medium_and_above"
}
```

#### Output

```json
"https://replicate.delivery/xezq/sWwLkjRMw3aCGViSIbghseT3forfnT150c8weVMF7vXgop7SB/tmpyn2tyk14.png"
```


### Example (https://replicate.com/p/32aty4sk41rm80cpye595grbrg)

#### Input

```json
{
  "prompt": "Capture an intimate close-up bathed in warm, soft, late-afternoon sunlight filtering into a quintessential 1960s kitchen. The focal point is a charmingly designed vintage package of all-purpose flour, resting invitingly on a speckled Formica countertop. The packaging itself evokes pure nostalgia: perhaps thick, slightly textured paper in a warm cream tone, adorned with simple, bold typography (a friendly serif or script) in classic red and blue \u201cALL-PURPOSE FLOUR\u201d, featuring a delightful illustration like a stylized sheaf of wheat or a cheerful baker character. In smaller bold print at the bottom of the package: \u201cNET WT 5 LBS (80 OZ) 2.27kg\u201d. Focus sharply on the package details \u2013 the slightly soft edges of the paper bag, the texture of the vintage printing, the inviting \"All-Purpose Flour\" text. Subtle hints of the 1960s kitchen frame the shot \u2013 the chrome edge of the counter gleaming softly, a blurred glimpse of a pastel yellow ceramic tile backsplash, or the corner of a vintage metal canister set just out of focus. The shallow depth of field keeps attention locked on the beautifully designed package, creating an aesthetic rich in warmth, authenticity, and nostalgic appeal.",
  "aspect_ratio": "1:1",
  "safety_filter_level": "block_medium_and_above"
}
```

#### Output

```json
"https://replicate.delivery/xezq/yMeqSFQbeqnq5EMPk8TdMUOFNIYEPTTHGEx3XbMSu1AWh6uUA/tmpb_gdvhha.png"
```


### Example (https://replicate.com/p/993wpwymwxrma0cpye6tad5xv4)

#### Input

```json
{
  "prompt": "A towering, futuristic armored knight standing against a backdrop of bright blue sky and soft, puffy white clouds. The knight is fully encased in a hyper-polished, chrome-like reflective armor that gleams with pristine clarity\u2014so reflective it captures subtle distortions of the clouds and light around it. The armor design is sleek, smooth, and seamless, evoking both medieval plate armor and high-tech sci-fi aesthetics. The helmet is full-face, with no visible eyes or features, completely blacked-out visor or void-like front, giving it a mysterious and intimidating presence. The figure wears a long, flowing cloak made of the same mirror-chrome material\u2014fluid and draped like silk, yet structured, catching the light in sharp, star-like flares across its surface. The knight stands regally, both hands resting on the pommel of a massive broadsword planted in the ground before them. The sword is symmetrical, grand, and glowing with an ethereal white light at its core. The blade emits a radiant, prismatic flare\u2014a spectrum of light beams radiating outward, refracting into rainbow hues at the edge of the light. The hilt of the sword is ornately crafted, echoing the chrome aesthetic but encrusted with subtle runes or technological etchings that glow faintly. The atmosphere is surreal, almost celestial, as if the knight is standing on a high mountaintop or floating in a divine realm. The lighting is crisp and heavenly, with intense sun reflections casting dramatic highlights across the armor and cloak, creating lens flare effects and sparkles at several points on the knight\u2019s body, especially around the shoulders, hands, and sword. The proportions of the knight are slightly exaggerated\u2014taller and broader than a human, evoking a sense of power and reverence. The entire scene is composed symmetrically, with the figure dead center, vertical, and monolithic, like a statue of an angelic guardian forged in another dimension. The mood is solemn, noble, and epic, blending themes of ancient chivalry with cosmic futurism. Unreal Engine 5 lighting 8K resolution hyperrealism cinematic wide angle lens high contrast volumetric lighting HDR reflections celestial / divine aesthetic chrome texture material standing figure centered, low-angle view for dramatic scale",
  "aspect_ratio": "1:1",
  "safety_filter_level": "block_medium_and_above"
}
```

#### Output

```json
"https://replicate.delivery/xezq/rfHk8YlkdNU5DipzF1duR1aMTHIo5QZYA5IwxmsjIDHiSdXKA/tmp8f2fihed.png"
```


### Example (https://replicate.com/p/ed7jzwmvqhrma0cpye79m5hb7c)

#### Input

```json
{
  "prompt": "An extremely unremarkable iPhone picture with no clear subject or framing\u2014just a careless snapshot with a slight worm's eye perspective. The photo has motion blur artifacts from being taken carelessly, and mildly overexposed from uneven sunlight. The angle is awkward, the composition nonexistent, and the overall effect is aggressively mediocre\u2014like a photo taken by accident while pulling the phone out of a pocket to take the picture.",
  "aspect_ratio": "1:1",
  "safety_filter_level": "block_medium_and_above"
}
```

#### Output

```json
"https://replicate.delivery/xezq/yBjzYOe6hZWDJiMS7wBQd0sJVdIq5xd68FioPzPrPFt7SdXKA/tmpyyt5hqii.png"
```


### Example (https://replicate.com/p/v76debbd0hrmc0cpyem83znxsr)

#### Input

```json
{
  "prompt": "gorilla riding a moped through busy italian city",
  "aspect_ratio": "9:16",
  "safety_filter_level": "block_medium_and_above"
}
```

#### Output

```json
"https://replicate.delivery/xezq/BDjH0lGVemSQVCOAaShAL0Ei4bt2g986zHTSylqjVQeWA7uUA/tmp1t4429it.png"
```


### Example (https://replicate.com/p/gsknfqbj41rmc0cpykc84cejzm)

#### Input

```json
{
  "prompt": "The text \"Imagen-4\" in front of a photo, center middle. The photo: Create a cinematic, photorealistic medium shot capturing the nostalgic warmth of a late 90s indie film. The focus is a young woman with brightly dyed pink-gold hair and freckled skin, looking directly and intently into the camera lens with a hopeful yet slightly uncertain smile, she is slightly off-center. She wears an oversized, vintage band t-shirt that says \"Replicate\" (slightly worn) over a long-sleeved striped top and simple silver stud earrings. The lighting is soft, golden hour sunlight streaming through a slightly dusty window, creating lens flare and illuminating dust motes in the air. The background shows a blurred, cluttered bedroom with posters on the wall and fairy lights, rendered with a shallow depth of field. Natural film grain, a warm, slightly muted color palette, and sharp focus on her expressive eyes enhance the intimate, authentic feel",
  "aspect_ratio": "16:9",
  "negative_prompt": "",
  "safety_filter_level": "block_medium_and_above"
}
```

#### Output

```json
"https://replicate.delivery/xezq/2PeuFC2nWd3f20jg7uW72FqT1fCt24vQ4f7btjI3RgHkeevLF/tmpdsf6a07l.png"
```


### Example (https://replicate.com/p/h2pafc8fe9rma0cpzvqtpjzvyr)

#### Input

```json
{
  "prompt": "The photo: Create a cinematic, photorealistic medium shot capturing the nostalgic warmth of a late 90s indie film. The focus is a young woman with brightly dyed pink-gold hair and freckled skin, looking directly and intently into the camera lens with a hopeful yet slightly uncertain smile, she is slightly off-center. She wears an oversized, vintage band t-shirt that says \"Replicate\" (slightly worn) over a long-sleeved striped top and simple silver stud earrings. The lighting is soft, golden hour sunlight streaming through a slightly dusty window, creating lens flare and illuminating dust motes in the air. The background shows a blurred, cluttered bedroom with posters on the wall and fairy lights, rendered with a shallow depth of field. Natural film grain, a warm, slightly muted color palette, and sharp focus on her expressive eyes enhance the intimate, authentic feel",
  "aspect_ratio": "16:9",
  "safety_filter_level": "block_medium_and_above"
}
```

#### Output

```json
"https://replicate.delivery/xezq/vfRlemVaYMuINEe8KCCmeJT6V3Dv7S45rxMhIgnST2Q7wkelC/tmp4mqrs3rp.png"
```


## Model readme

> ## Google’s Imagen 4
> 
> - [Imagen 4](https://replicate.com/google/imagen-4)
> - [Imagen 4 Ultra](https://replicate.com/google/imagen-4-ultra)
> - [Imagen 4 Fast](https://replicate.com/google/imagen-4-fast)
> 
> High-quality image generation model featuring:
> 
> - **Fine detail rendering**: Superior clarity for intricate elements like fabrics, water droplets, and animal fur
> - **Style versatility**: Excels in both photorealistic and abstract styles
> - **Resolution flexibility**: Creates images in various aspect ratios up to 2K resolution
> - **Typography improvements**: Significantly enhanced text rendering capabilities for greeting cards, posters, and comics
> - **Fast variant**: Upcoming version promises up to 10x faster generation compared to Imagen 3
