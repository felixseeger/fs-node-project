# Quick Start



:::info[]
- Our API generates stunning videos based on user-uploaded prompts and images.

- The overall API call flow is:
    1. each request requires an app-key and AI-trace-id to submit a video generation task, which returns a video_id. 
    2. Through the video_id, you can get the video generation status. 
    3. When the video generation status changes from 5->1, you can download the video file through the URL.
:::




### **Prerequisites**
- PixVerse API Platform account
- API Key
### **Login**
Please log in to the PixVerse platform, register/login to your account. If you have a PixVerse consumer account, you can log in directly.
### **Set up API key**
<Steps>
  <Step title="Step 1">
      Click the Create key button in API Key section
![image.png](https://api.apidog.com/api/v1/projects/772214/resources/349391/image-preview)
      
  </Step>
  <Step title="Step 2">
      Please enter a name for your API key
![image.png](https://api.apidog.com/api/v1/projects/772214/resources/349392/image-preview)
  </Step>
  <Step title="Step 3">
      After entering the name, your API key will be displayed. Please store it securely as it will only be shown once.
![image.png](https://api.apidog.com/api/v1/projects/772214/resources/349393/image-preview)
  </Step>
</Steps>
### **Set Header Parameters**
    - API-KEY parameter: Enter the App-key created on the website
    - AI-trace-ID: Please use UUID format, ensuring a unique value for each request. If the value is too simple or identical to other request values, the effect may be incorrect or won't generate. 

:::warning[About Ai-trace-ID]
- Please generate a new ai-trace-id for each unique request (especially **video generate**)
- Use UUID or similar unique identifier generation method
- If you use the same ai-trace-id multiple times, You won't get a new video generated
:::

### **Video Generation**
<Steps>
  <Step title="Generate video through the video generation interface">
    If generation is successful, it will return success and provide a **video_id**
      
  </Step>
  <Step title="Get video generation status">
    Using the **Video_id** obtained from the generation interface, fill it in the id param parameter to get the video generation status. Status 5 indicates video is being generated, status 1 indicates video generation is complete
  </Step>
  <Step title="Poll video generation status, download video based on status changes">
    When video generation status is 1, you can download the video through the URL.
  </Step>
</Steps>
### **Main Function Call Methods**
| Text-to-Video | Image-to-Video | Effects |Transition|Lip sync|Extend
| :---: | :---: | :---: | :---: | :---: | :---: |
| 1. Submit task through text-to-video interface | 1. First upload image through the upload image interface<br><br>2. Submit task through image-to-video interface to get video | 1. When submitting video generation task, please fill in template_id |1. Upload two images(for first & last frame) through the upload image endpoint <br><br>2. Submit task through transition endpoint to get transition video| 1.Prepare a video, either generated via the PixVerse API or uploaded via the media_upload endpoint.<br><br> 2.Prepare Lipsync content, either as plain text or as an audio file uploaded via the media_upload endpoint.|1.Prepare a video, either generated via the PixVerse API or uploaded via the media_upload endpoint. 
### **Next Steps**
<CardGroup cols={3}>
  <Card title="Model&Pricing" href="https://docs.platform.pixverse.ai/model-pricing-796039m0">
    Models provided by PixVerse Platform and their respective pricing
  </Card>
  <Card title="Rate limit"  href="https://docs.platform.pixverse.ai/rate-limit-796040m0">
    Understand PixVerse Platform concurrency limits
  </Card>
  <Card title="Error codes"  href="https://docs.platform.pixverse.ai/error-codes-796041m0">
    Various error codes encountered during API usage
  </Card>
  <Card title="FAQ"  href="https://docs.platform.pixverse.ai/faq-796042m0">
    Common questions encountered during API calls
  </Card>
</CardGroup>