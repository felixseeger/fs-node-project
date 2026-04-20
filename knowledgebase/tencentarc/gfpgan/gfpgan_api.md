## Basic model info

Model name: tencentarc/gfpgan
Model description: Practical face restoration algorithm for *old photos* or *AI-generated faces*


## Model inputs

- img (required): Input (string)
- version (optional): GFPGAN version. v1.3: better quality. v1.4: more details and better identity. (string)
- scale (optional): Rescaling factor (number)


## Model output schema

{
  "type": "string",
  "title": "Output",
  "format": "uri"
}

If the input or output schema includes a format of URI, it is referring to a file.


## Example inputs and outputs

Use these example outputs to better understand the types of inputs the model accepts, and the types of outputs the model returns:

### Example (https://replicate.com/p/ffu2e6aw4barxliwxu23ydgbnu)

#### Input

```json
{
  "img": "https://replicate.delivery/mgxm/59d9390c-b415-47e0-a907-f81b0d9920f1/187400315-87a90ac9-d231-45d6-b377-38702bd1838f.jpg",
  "scale": 2,
  "version": "v1.4"
}
```

#### Output

```json
"https://replicate.delivery/mgxm/85f53415-0dc7-4703-891f-1e6f912119ad/output.png"
```


### Example (https://replicate.com/p/wdj2fedsczdtzeflmvzyu4hata)

#### Input

```json
{
  "img": "https://replicate.delivery/mgxm/9227bd4f-a945-44d7-956a-dee33c6f389f/%E4%B8%8B%E8%BD%BD.jpg",
  "scale": 2,
  "version": "v1.3"
}
```

#### Output

```json
"https://replicate.delivery/mgxm/25b4bcb2-3029-4417-8689-e5997f217ea0/output.png"
```


### Example (https://replicate.com/p/ya2he2bwmjdaxb2mg2fwj4ejn4)

#### Input

```json
{
  "img": "https://replicate.delivery/mgxm/6c1f5af2-825c-4ded-a4c1-339a58a0347c/187400981-8a58f7a4-ef61-42d9-af80-bc6234cef860.jpg",
  "scale": 2,
  "version": "v1.3"
}
```

#### Output

```json
"https://replicate.delivery/mgxm/abab834a-81ec-42f1-a415-7035ae55707a/output.png"
```


### Example (https://replicate.com/p/xpyncbsrhzavpdjjpwzwi5cf5q)

#### Input

```json
{
  "img": "https://replicate.delivery/mgxm/26d87fc6-3843-4680-9f92-9970de2e5a61/187401133-8a3bf269-5b4d-4432-b2f0-6d26ee1d3307.png",
  "scale": 2,
  "version": "v1.3"
}
```

#### Output

```json
"https://replicate.delivery/mgxm/4fbbce6e-daa9-45c0-bdf1-1c14ade7fdeb/output.png"
```


### Example (https://replicate.com/p/2j4duq3vbfbblgd7jqx5xrcngi)

#### Input

```json
{
  "img": "https://replicate.delivery/mgxm/57dae5a1-f11b-4f41-83ec-a2c9ac190c69/AAA9hAAAPYQGoP6dpAAAKT2lD.png",
  "scale": 2,
  "version": "v1.3"
}
```

#### Output

```json
"https://replicate.delivery/mgxm/9788da2f-4f0c-4107-b6de-6c9332cc3af2/output.png"
```


## Model readme

> # Replicate demo for GFPGAN
> 
> （You may need to login in to upload images~）
> 
> GFPGAN aims at developing **Practical Algorithm for Real-world Face Restoration**.
> 
> If GFPGAN is helpful, please help to ⭐ the [Github Repo](https://github.com/TencentARC/GFPGAN) and recommend it to your friends 😊
> 
> [![download](https://img.shields.io/github/downloads/TencentARC/GFPGAN/total.svg)](https://github.com/TencentARC/GFPGAN/releases)
> [![GitHub Stars](https://img.shields.io/github/stars/TencentARC/GFPGAN?style=social)](https://github.com/TencentARC/GFPGAN)
> [![arXiv](https://img.shields.io/badge/arXiv-Paper-<COLOR>.svg)](https://arxiv.org/abs/2101.04061)
> 
> ## 📧Contact
> 
> If you have any question, please email `xintao.wang@outlook.com` or `xintaowang@tencent.com`.
