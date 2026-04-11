# How to use Effects?


:::info[]
Effects is PixVerse's signature feature, allowing you to transform your images/creative ideas into stunning effects with just one click

:::

<Columns>
  <Column>
  <Video src="https://media.pixverse.ai/asset/template/特效.mp4"></Video>
  </Column>
</Columns>

### Step 1 : **Get Effect ID and Details**
- Click Effect Center
![image.png](https://api.apidog.com/api/v1/projects/772214/resources/361336/image-preview)
- Click the effect you selected and copy the ID
![image.png](https://api.apidog.com/api/v1/projects/772214/resources/361339/image-preview)

### Step 2 : **Fill in template_id in generation parameters to generate video**
https://docs.platform.pixverse.ai/image-to-video-generation-13016633e0
- Taking **image-to-video or extend** as an example, you need to add template_id and prompt to the parameters. The Prompt can be the effect name
- If you use **text-to-video**, we will reference the Prompt and generate the special effect. If you use image-to-video, we will generate the special effect based on the uploaded image.
- Example body: 
```
{
  "duration": 5,
  "img_id": 0,
  "model": "v4.5",
  "motion_mode": "normal",
  "negative_prompt": "string",
  "prompt": "Muscle Surge",
  "quality": "540p",
  "seed": 0,
  "template_id": 308621408717184,
}
```

* For multi-image templates, use img_ids; the required number of images is shown in the Effect Center.

![image.png](https://api.apidog.com/api/v1/projects/772214/resources/363600/image-preview)

```
{
  "duration": 5,
  "img_ids": [0,0]
  "model": "v4.5",
  "motion_mode": "normal",
  "negative_prompt": "string",
  "prompt": "Muscle Surge",
  "quality": "540p",
  "seed": 0,
  "template_id": 308621408717184,
}
```
