## Basic model info

Model name: topazlabs/video-upscale
Model description: Video Upscaling from Topaz Labs


## Model inputs

- video (required): Video file to upscale (string)
- target_resolution (optional): Target resolution (string)
- target_fps (optional): Target FPS (choose from 15-60fps) (integer)


## Model output schema

{
  "type": "string",
  "title": "Output",
  "format": "uri"
}

If the input or output schema includes a format of URI, it is referring to a file.


## Example inputs and outputs

Use these example outputs to better understand the types of inputs the model accepts, and the types of outputs the model returns:

### Example (https://replicate.com/p/7x0ejn1bcsrme0cpde7te5a8ag)

#### Input

```json
{
  "video": "https://replicate.delivery/xezq/qw2eM2fXGov7KEvNJTUUV3SX6oolPyPDGk0u2HJa3lYpBf5oA/R8_Wan_00001.mp4",
  "target_fps": 60,
  "target_resolution": "4k"
}
```

#### Output

```json
"https://replicate.delivery/xezq/xpjUUlHfIF3EAqyRs33xfBHJ67bYVgT7oWsxzNkk3z4dkNmUA/tmppx3u94ba.mp4"
```


### Example (https://replicate.com/p/6he0w3qn9drme0cpdph8es5sb0)

#### Input

```json
{
  "video": "https://replicate.delivery/pbxt/MtoB5g5BBNKpiz25927ZmkdwImZatwOXUCjVAWqH8UCQbuot/test.mp4",
  "target_fps": 60,
  "target_resolution": "4k"
}
```

#### Output

```json
"https://replicate.delivery/xezq/FupTeWdMqftm7EKBkjqYce5LLrtE7KhU1ofgbVeKneNLRhlJF/tmpt3q7b60s.mp4"
```


### Example (https://replicate.com/p/vc39g1qj6nrmc0cpdrzsh34j3c)

#### Input

```json
{
  "video": "https://replicate.delivery/xezq/rCzhfcqW5jWlBC9wbqoM5h35bdRApWt86FLaBbEzjKNeu6cUA/R8_Wan_00001.mp4",
  "target_fps": 60,
  "target_resolution": "4k"
}
```

#### Output

```json
"https://replicate.delivery/xezq/Yf6JR7TVhoWdUCFqCyvWMhQHtpeyfjwB9zKkE6GKZbxlLxMpA/tmp35d3x7dc.mp4"
```


### Example (https://replicate.com/p/exvrbaat7srm80cq0jtaccy2j8)

#### Input

```json
{
  "video": "https://replicate.delivery/pbxt/N4DkZkhajsO7UekfBAyTNngDNuHJY8GT04cbMDaM9LPcSJBe/flower-face.mp4",
  "target_fps": 60,
  "target_resolution": "4k"
}
```

#### Output

```json
"https://replicate.delivery/xezq/iNtMrLrE09LtApqdiiprBdPoUxbG7ZUgxCqqXaxgSAdtOAMF/tmp95j4j6ut.mp4"
```


### Example (https://replicate.com/p/dk1tenvqzxrmc0cq8d08k9b17c)

#### Input

```json
{
  "video": "https://replicate.delivery/pbxt/N8X2VIuePxg9JyNpTslqqZ9Rvrjwm45bNPAmjDAPHiyQida1/MPEG-4%20movie%205.mp4",
  "target_fps": 60,
  "target_resolution": "4k"
}
```

#### Output

```json
"https://replicate.delivery/xezq/aNElLd06Db7JEFVklfkJqcwOsS1gsqkR0lMs8ARTIwGFkAaKA/tmp6v5tl927.mp4"
```


### Example (https://replicate.com/p/xn8rszvcz9rma0cqpbmthhmyc8)

#### Input

```json
{
  "video": "https://replicate.delivery/pbxt/NGECsr1BBhTnUOdBrmoQZbkvMNGVhBH5ac4q52VGbQEyWWMf/replicate-prediction-e6hb0em2n1rma0cqpbmbvjye5w.mp4",
  "target_fps": 60,
  "target_resolution": "1080p"
}
```

#### Output

```json
"https://replicate.delivery/xezq/LYOpfltD3i0fgUPazRrebeRDkUGY7mFhp4oSmmBzD6HZkpsTB/tmpnhev3wqj.mp4"
```


## Model readme

> Professional-grade video upscaling powered by AI, from Topaz Labs.
> 
> This upscaler supports 720p, 1080p, and 4k resolution upscaling and fps up to 60.
