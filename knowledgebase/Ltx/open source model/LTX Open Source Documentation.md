***

## title: LTX Open Source Documentation

<iframe width="560" height="315" src="https://www.youtube.com/embed/SqraXuR3_J0" title="LTX-2.3 Open Source" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen />

## Meet LTX-2.3

LTX-2.3 is a DiT-based audio-video foundation model designed to generate synchronized video and audio within a single model. It brings together the core building blocks of modern video generation, with open weights and a focus on practical, local execution.The model supports:

**High-Fidelity Generation:** Generation of up to \~20 seconds of synchronized audio and video, with support for high resolutions and high frame rates depending on configuration and hardware. LTX-2 is designed to scale from fast iteration to high-quality outputs.

**Native Audio-Video Sync:** Dialogue, lip movement, and ambient audio are generated together in a single pass, enabling coherent speech, expressive performances, and consistent timing without external alignment steps.

**Motion Realism:** Dynamic scenes with stable motion, consistent identity, and strong frame-to-frame coherence.

**Fine-Grained Control:** LoRA-based customization, camera-aware motion logic, and multimodal inputs including text, image, video, audio, and depth for precise creative direction.

**Efficient by Design:** A compact latent space and step-distilled architecture allow LTX-2 to run efficiently on high-end consumer GPUs, making high-fidelity multimodal generation accessible without specialized infrastructure.

To learn more about **LTX-2.3 architecture**, and the research behind it, read our full [research paper](https://arxiv.org/abs/2601.03233).

## Get Started

<CardGroup cols={2}>
  <Card title="Try LTX-2.3" icon="laptop" href="https://console.ltx.video/playground/">
    Try LTX-2.3 in the API Developer Console Playground
  </Card>

  <Card title="Get Started" icon="screwdriver-wrench" href="/open-source-model/getting-started/quick-start">
    Use our Quick Start guide
  </Card>
</CardGroup>
