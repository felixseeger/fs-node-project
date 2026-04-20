## Basic model info

Model name: luma/reframe-video
Model description: Change the aspect ratio of any video up to 30 seconds long, outputs will be 720p


## Model inputs

- aspect_ratio (optional): Aspect ratio of the output (string)
- video (optional): The video to reframe. Maximum video duration is 10 seconds. (string)
- x_end (optional): The x end of the crop bounds, in pixels. Defines the right boundary where your source will be placed in the output frame. The distance between x_start and x_end determines the resized width of your content. (integer)
- y_end (optional): The y end of the crop bounds, in pixels. Defines the bottom boundary where your source will be placed in the output frame. The distance between y_start and y_end determines the resized height of your content. (integer)
- prompt (optional): A prompt to guide the reframing generation (string)
- x_start (optional): The x start of the crop bounds, in pixels. Defines the left boundary where your source will be placed in the output frame. The distance between x_start and x_end determines the resized width of your content. (integer)
- y_start (optional): The y start of the crop bounds, in pixels. Defines the top boundary where your source will be placed in the output frame. The distance between y_start and y_end determines the resized height of your content. (integer)
- video_url (optional): URL of the video to reframe. Maximum video duration is 10 seconds. (string)
- grid_position_x (optional): The x position of the input in the grid, in pixels. Controls horizontal positioning of the source within the target output dimensions. (integer)
- grid_position_y (optional): The y position of the input in the grid, in pixels. Controls vertical positioning of the source within the target output dimensions. (integer)


## Model output schema

{
  "type": "string",
  "title": "Output",
  "format": "uri"
}

If the input or output schema includes a format of URI, it is referring to a file.


## Example inputs and outputs

Use these example outputs to better understand the types of inputs the model accepts, and the types of outputs the model returns:

### Example (https://replicate.com/p/ezzybyv675rmc0cqbs8vkzcqqc)

#### Input

```json
{
  "prompt": "A woman is standing in a room as part of a podcast show",
  "video_url": "https://replicate.delivery/pbxt/NAOh1kWFGdaSfwvwYzE7eIKypI9JB5rBs0kAb1HVeGDmmNtg/A_podcast_show_202506111026_uikpa.mp4",
  "aspect_ratio": "9:16"
}
```

#### Output

```json
"https://replicate.delivery/xezq/KSUvcJrFAHJ0IhsvD8eew2AvOesvFl85CqLfzjaMiaBfMfbNF/tmp5e959bwx.mp4"
```


### Example (https://replicate.com/p/29wcam9hqxrma0cqbtfbwfp42c)

#### Input

```json
{
  "prompt": "A woman walks through a Tokyo street market",
  "video_url": "https://replicate.delivery/pbxt/NAPypMM10m3nPgnOzINpVc1aLdr8krp3VX8oxn72TG45V28n/A_selfie_video_202506111151_iz1vy.mp4",
  "aspect_ratio": "9:16"
}
```

#### Output

```json
"https://replicate.delivery/xezq/TefqUPglzSmQwkgBR3eCizA9gFrsk6GnuAcbC7TkFJLUQirpA/tmp7168wftx.mp4"
```


## Model readme

> # Reframe video
> 
> Change the aspect ratio of any video (up to 30 seconds long or 100mb). You can use this model to change a landscape 16:9 video to a tall 9:16 one, or expand to a square, and so on.
> 
> Outputs are always 720p resolution.
> 
> It's perfect for sharing your 16:9 videos on services like TikTok, Reels, and YouTube Shorts.
>
