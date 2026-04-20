## Basic model info

Model name: sczhou/codeformer
Model description: Robust face restoration algorithm for old photos / AI-generated faces


## Model inputs

- image (required): Input image (string)
- codeformer_fidelity (optional): Balance the quality (lower number) and fidelity (higher number). (number)
- background_enhance (optional): Enhance background image with Real-ESRGAN (boolean)
- face_upsample (optional): Upsample restored faces for high-resolution AI-created images (boolean)
- upscale (optional): The final upsampling scale of the image (integer)


## Model output schema

{
  "type": "string",
  "title": "Output",
  "format": "uri"
}

If the input or output schema includes a format of URI, it is referring to a file.


## Example inputs and outputs

Use these example outputs to better understand the types of inputs the model accepts, and the types of outputs the model returns:

### Example (https://replicate.com/p/3brtklnlxrh5dai63qnopzlwde)

#### Input

```json
{
  "image": "https://replicate.delivery/mgxm/9ff2825b-ad72-4aca-bf0a-a2cdf61f8068/1.png",
  "upscale": 2,
  "face_upsample": true,
  "background_enhance": true,
  "codeformer_fidelity": "0.2"
}
```

#### Output

```json
"https://replicate.delivery/mgxm/3d919864-699f-41eb-9202-67eae3cab055/output.png"
```


### Example (https://replicate.com/p/jlvo5tu4szhqdm4ixnzxtmk5oa)

#### Input

```json
{
  "image": "https://replicate.delivery/mgxm/a1daba8e-af14-4b00-86a4-69cec9619b53/04.jpg",
  "upscale": 2,
  "face_upsample": true,
  "background_enhance": true,
  "codeformer_fidelity": "0.8"
}
```

#### Output

```json
"https://replicate.delivery/mgxm/4e7adcc7-eb0d-49c9-81e5-56c041f7a9dd/output.png"
```


### Example (https://replicate.com/p/o2bjwswd6bfmfpcemfhl26j5we)

#### Input

```json
{
  "image": "https://replicate.delivery/mgxm/7534e8f1-ee01-4d66-ae40-36343e5eb44a/003.png",
  "upscale": 2,
  "face_upsample": true,
  "background_enhance": true,
  "codeformer_fidelity": "0.1"
}
```

#### Output

```json
"https://replicate.delivery/mgxm/c855fbf8-8a34-4373-93ca-bafa0c6fb70c/output.png"
```


### Example (https://replicate.com/p/4fm5bdzc2bffdkdddnel32wbfq)

#### Input

```json
{
  "image": "https://replicate.delivery/mgxm/542d64f9-1712-4de7-85f7-3863009a7c3d/03.jpg",
  "upscale": 2,
  "face_upsample": true,
  "background_enhance": true,
  "codeformer_fidelity": "0.8"
}
```

#### Output

```json
"https://replicate.delivery/mgxm/65f7c22b-c353-47c0-8d2e-733fbcb0f436/output.png"
```


### Example (https://replicate.com/p/tlm3wkg3aveyvjzmv6es65dy5m)

#### Input

```json
{
  "image": "https://replicate.delivery/mgxm/a11098b0-a18a-4c02-a19a-9a7045d68426/010.jpg",
  "upscale": 2,
  "face_upsample": true,
  "background_enhance": true,
  "codeformer_fidelity": "0.1"
}
```

#### Output

```json
"https://replicate.delivery/mgxm/5c63e499-7f07-49d7-abfe-4af11015713e/output.png"
```


### Example (https://replicate.com/p/bahjhnqssfhttn645cdifzawge)

#### Input

```json
{
  "image": "https://replicate.delivery/mgxm/7cf19c2c-e0cf-4712-9af8-cf5bdbb8d0ee/012.jpg",
  "upscale": 2,
  "face_upsample": true,
  "background_enhance": true,
  "codeformer_fidelity": "0.1"
}
```

#### Output

```json
"https://replicate.delivery/mgxm/b8fd7cea-aba2-4793-8d85-dc2cbeea9085/output.png"
```


## Model readme

> <p align="center">
>   <img src="https://user-images.githubusercontent.com/14334509/189166076-94bb2cac-4f4e-40fb-a69f-66709e3d98f5.png" height=50>
> </p>
> 
> <b><a href='https://github.com/sczhou/CodeFormer' target='_blank'>Towards Robust Blind Face Restoration with Codebook Lookup Transformer</a> (NeurIPS 2022)</b>
> [Paper](https://arxiv.org/abs/2206.11253) | [Project Page](https://shangchenzhou.com/projects/CodeFormer/) | [Video](https://youtu.be/d3VDpkXlueI)
> 
> ![visitors](https://api.infinitescript.com/badgen/count?name=sczhou/CodeFormer&ltext=Visitors&color=6dc9aa)
> 
> This web demo is for research purposes! If you want to use our CodeFormer for permanent free, you can run the [[Github Code]](https://github.com/sczhou/CodeFormer) locally or try out [[Colab Demo]](https://colab.research.google.com/drive/1m52PNveE4PBhYrecj34cnpEeiHcC5LTb?usp=sharing) instead.
> 
> ---
> 
> &nbsp;
> ☕️ **CodeFormer is a robust face restoration algorithm for old photos or AI-generated faces.**
> 🚀 **Try CodeFormer for improved stable-diffusion generation!**
> 
> 
> If CodeFormer is helpful, please help to ⭐ the [[Github Repo]](https://github.com/sczhou/CodeFormer). Thanks!
> 
> [![GitHub Stars](https://img.shields.io/github/stars/sczhou/CodeFormer?style=social)](https://github.com/sczhou/CodeFormer)
> 
> <!--
> ✉️ Contact
> If you have any questions, please feel free to reach me out at `shangchenzhou@gmail.com`.
> -->
> 
> 📋 License
> This project is licensed under <a rel="license" href="https://github.com/sczhou/CodeFormer/blob/master/LICENSE">S-Lab License 1.0</a>. Redistribution and use for non-commercial purposes should follow this license. Note that Replicate API of CodeFormer cannot be used commercially.
> 
> 
> 📝 Citation
> If our work is useful for your research, please consider citing:
> ```bibtex
> @inproceedings{zhou2022codeformer,
>     author = {Zhou, Shangchen and Chan, Kelvin C.K. and Li, Chongyi and Loy, Chen Change},
>     title = {Towards Robust Blind Face Restoration with Codebook Lookup TransFormer},
>     booktitle = {NeurIPS},
>     year = {2022}
> }
> ```
