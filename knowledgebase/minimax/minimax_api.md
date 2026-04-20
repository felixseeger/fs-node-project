## Basic model info

Model name: minimax/video-01
Model description: Generate 6s videos with prompts or images. (Also known as Hailuo). Use a subject reference to make a video with a character and the S2V-01 model.


## Model inputs

- prompt (required): Text prompt for generation (string)
- prompt_optimizer (optional): Use prompt optimizer (boolean)
- first_frame_image (optional): First frame image for video generation. The output video will have the same aspect ratio as this image. (string)
- subject_reference (optional): An optional character reference image to use as the subject in the generated video (this will use the S2V-01 model) (string)


## Model output schema

{
  "type": "string",
  "title": "Output",
  "format": "uri"
}

If the input or output schema includes a format of URI, it is referring to a file.


## Example inputs and outputs

Use these example outputs to better understand the types of inputs the model accepts, and the types of outputs the model returns:

### Example (https://replicate.com/p/15eyanar9xrg80ckd3ytdz0hhr)

#### Input

```json
{
  "prompt": "a woman is walking through a busy Tokyo street at night, she is wearing dark sunglasses",
  "prompt_optimizer": true
}
```

#### Output

```json
"https://replicate.delivery/czjl/0BRwO64eE5xCNCunM61wjfjaozXEm6ee2fpbldrwj6fxxVO9E/tmpxql776w8.output.mp4"
```


### Example (https://replicate.com/p/5wtdazv51hrg80ckdm2tbfdp7c)

#### Input

```json
{
  "prompt": "a calm and tranquil tropical beach scene, the waves are crashing on the shore",
  "prompt_optimizer": true
}
```

#### Output

```json
"https://replicate.delivery/czjl/U5fFZk9JHqWVMStaF5pnfel0w9KYNrzOBRTn6XgA0zQ6vTqnA/tmpfnoqjvb3.output.mp4"
```


### Example (https://replicate.com/p/h6bzw0emrnrga0ckdm2tfafke8)

#### Input

```json
{
  "prompt": "a resplendent quetzal is sitting in a tree",
  "prompt_optimizer": true
}
```

#### Output

```json
"https://replicate.delivery/czjl/lKOjU1uJTSq9I9gXOymUO0ekKz5TtCWkdea4YHkVhdPY4J1TA/tmp15hm2w_j.output.mp4"
```


### Example (https://replicate.com/p/ksqgzg9mmdrge0ckdm3bsg6esm)

#### Input

```json
{
  "prompt": "an animated scene shows a dog running through long grass",
  "prompt_optimizer": true
}
```

#### Output

```json
"https://replicate.delivery/czjl/8pSDBTD6zI44ARtleIewvQEC5wMbrK7iI0mKPSBJRrKx4J1TA/tmplqk00zq0.output.mp4"
```


### Example (https://replicate.com/p/qxzw7z02tdrm80cqgzyb7g1me4)

#### Input

```json
{
  "prompt": "a woman is walking through a busy Tokyo street at night, she is wearing dark sunglasses",
  "prompt_optimizer": true
}
```

#### Output

```json
"https://replicate.delivery/xezq/sKwL789E0KrLCZFX8oVqO6dQfP952RZFhuwGRt1cyICzSNcKA/tmppyhy1cg1.mp4"
```


## Model readme

> ## video-01 from MiniMax (Hailuo video)
> 
> - [https://hailuoai.video/](https://hailuoai.video/)
> - https://www.minimaxi.com/en/news/video-01
> 
> ## Privacy policy
> 
> Data from this model is sent from Replicate to MiniMax.
> 
> Check their Privacy Policy for details:
> 
> https://intl.minimaxi.com/protocol/privacy-policy
> 
> ## Terms of Service
> 
> https://intl.minimaxi.com/protocol/terms-of-service
> 
> ## About video-01
> 
> MiniMax has officially launched its first AI-native video generation model, video-01.
> 
> This model supports the generation of high-definition videos at 720p resolution and 25fps, featuring cinematic camera movement effects. It can quickly create visually striking content based on text descriptions.
> 
> Video-01 boasts high compression rates, excellent text responsiveness, and diverse styles, while supporting native high resolution and high frame rate videos, comparable to cinematic quality.
> 
> Currently, video-01 supports generating videos up to 6 seconds long, with the next major version set to support videos up to 10 seconds long.
> 
> Video-01 offers two modes: text-to-video and image-to-video. You can choose to generate videos solely based on text descriptions or upload a reference image along with the text description to create the video.
> 
> ## About MiniMax
> 
> MiniMax is a leading global technology company and one of the pioneers of large language models (LLMs) in Asia. Our mission is to build a world where intelligence thrives with everyone.
> 
> MiniMax develops proprietary LLMs across various modalities, including a trillion-parameter MoE model, a speech model with low latency and native support for major Asian languages, as well as advanced models for music, images, and video. 
> 
> Leveraging these multi-modality general-purpose models, the MiniMax API Platform offers enterprises and developers secure, flexible, and reliable API services, enabling the rapid deployment of AI applications.
