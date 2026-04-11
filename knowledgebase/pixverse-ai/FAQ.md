# FAQ

Below are common questions encountered when using PixVerse Platform. For any inquiries, please contact api@pixverse.ai
<AccordionGroup>
<Accordion title="How should I pass AI-Trace-id? Are there any references?">
A unique Trace must be maintained for each request in UUID format. Please refer to https://docs.python.org/3/library/uuid.html

- Please generate a new ai-trace-id for each unique request (especially **video generate**)
- Use UUID or similar unique identifier generation method
- If you use the same ai-trace-id multiple times, You won't get a new video generated


</Accordion>
<Accordion title="What should I do if my request is stuck in 'generating' status OR if the concurrent processing capacity doesn't match the displayed limit?">
1. First, check if you're using a duplicate ai-trace-id in your generation request. If so, ensure each generation request has a unique ai-trace-id to successfully retrieve the completed video.
2. Second, verify if all your requested videos have been successfully generated
</Accordion>
<Accordion title="Why is there a delay in accessing the URL after receiving the result">
After a successful generation request, it enters the generating state. You need to poll the video details and wait for the status to change from 5 (generating) to 1 (generation successful) before access. For the v3.5 model, generation typically completes within 1 minute, but please check the specific time through API requests. Currently, Turbo completes generation tasks within 15 seconds.
Status codes: 1: Generation successful; 5: Waiting for generation; 7: Content moderation failure; 8: Generation failed;
</Accordion>
<Accordion title="Are there any image upload restrictions? What are they?">
Resolution: 4000*4000, File size: 20MB
</Accordion>
<Accordion title="What does content moderation failure mean">
To ensure the security of our technical services, we have content review systems in place.
If your account makes too many requests that get moderated, we will suspend your account. If needed, you should add moderation before calling the PixVerse API, to avoid suspension.
</Accordion>
<Accordion title="Are Credits refunded for failed generations?">
We automatically refund Credits in the following cases, please use with confidence:

**Case1 : Geneartion failure**
✔️ Refund credits to user
    
**Case2 : Generation exceeds 10 minutes**
✔️ Release concurrency slot (does not refund credits)
    
**Case3 : Generation exceeds 2 hours** 
✔️ Refund credits to user  
    
**Case4 : Content fails moderation**
✔️ Refund credits to user

 
    
    
  </Accordion>
   <Accordion title="What happens if video generation never returns a response?">
1. After 10 minutes of video generation, the concurrent request quota will be released
2. At the latest after 2 hours, we will refund Credits based on the generation failure status
  </Accordion>


</AccordionGroup>