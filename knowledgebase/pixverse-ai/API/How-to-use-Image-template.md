# How to use  Image template?


:::info[]
We’re excited to introduce a major update to our image templates.

Unlike video-based templates, these templates are built entirely around images. Simply upload your photos, and we’ll deliver an immersive AI-powered creative experience.

Our image templates cover a wide range of use cases, including themed content, holiday scenarios, and playful or creative effects, with more to come.
You can now access and integrate these image templates directly through our API to easily turn images into engaging AI-generated content.
:::

<Columns>
  <Column>
  <Video src="https://media.pixverse.ai/asset/template/api_image_template.mov"></Video>
  </Column>
</Columns>

<AccordionGroup>
  <Accordion title="1: Upload your image">
When uploading images, you can use image local path or image_url
https://docs.platform.pixverse.ai/upload-image-13016631e0
      
Request
```
curl --location --request POST 'https://app-api.pixverse.ai/openapi/v2/image/upload' \
--header 'API-KEY: your-api-key' \
--header 'Ai-trace-id: different-ai-trace-id-for-each-unique-request' \
--form 'image=@""'
```
Responses
```  
{
    "ErrCode": 0,
    "ErrMsg": "string",
    "Resp": {
        "img_id": 0,
        "img_url": "string"
    }
}
```

  </Accordion>
  <Accordion title="2:  Image templates generation task">
Request
```
curl --location 'https://app-api.pixverse.ai/openapi/v2/image/template/generate' \
--header 'Ai-Trace-Id: your-ai-trace-id' \
--header 'API-KEY: your-api-key' \
--header 'Content-Type: application/json' \
--data '{

  "img_ids": [0],
  "template_id": 384268229671680
}'
```
Responses
```  
{
  "ErrCode": 0,
  "ErrMsg": "string",
  "Resp": {
    "image_id": 0,
    "credit": 0
  }
}
```
  </Accordion>
    <Accordion title="3. Check generation status & download with image generation status">
Request
```
curl --location 'https://app-api.pixverse.ai/openapi/v2/image/result/{image_id}' \
--header 'Ai-trace-Id: your-ai-trace-id' \
--header 'API-KEY: your-api-key' \

        ```
Responses
```
  {
 "ErrCode": 0,
 "ErrMsg": "string",
 "Resp": {
   "create_time": "string",
   "id": 0,
   "modify_time": "string",
   "negative_prompt": "string",
   "outputHeight": 0,
   "outputWidth": 0,
   "prompt": "string",
   "resolution_ratio": 0,
   "seed": 0,
   "size": 0,
   "status": 1, // 1: Generation successful, 5: In progress, 7: Moderation failed, 8: Generation failed.
   "style": "string",
   "url": "string" // The url is accessible when status is 1.
 }
}
```
  </Accordion>
</AccordionGroup>


## Step-by-step
### Step 1 : **Get Effect ID and Details**
- Click Effect Center. and find image templates
![image.png](https://api.apidog.com/api/v1/projects/772214/resources/361336/image-preview)
- Click the effect you selected and copy the ID. 

![image.png](https://api.apidog.com/api/v1/projects/772214/resources/371311/image-preview)

### Step 2 : **Fill in template_id in generation parameters to generate image**



- 
```
{
  "img_ids": [0],
  "template_id": 384268229671680
}
```

* For multi-image templates, use img_ids; the required number of images is shown in the Effect Center.


![image.png](https://api.apidog.com/api/v1/projects/772214/resources/371312/image-preview)
```
{
  "img_ids": [0,0],
  "template_id": 384268229671680
}
```



