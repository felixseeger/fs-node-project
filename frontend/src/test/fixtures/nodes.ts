import {
  type ImageInputNodeData,
  type TextNodeData,
  type GeneratorNodeData,
  type VideoInputNodeData
} from '../../types/nodes';

export const validNodeData = {
  imageInput: {
    id: 'n1',
    label: 'Image Source',
    type: 'image',
    image: 'data:image/png;base64,iVBORw0KGgo...',
    filename: 'test-image.png',
    dimensions: { width: 512, height: 512 }
  } as ImageInputNodeData,

  textInput: {
    id: 'n2',
    label: 'Prompt Input',
    type: 'text',
    text: 'A beautiful sunny day',
    variableName: 'prompt_text'
  } as TextNodeData,

  generator: {
    id: 'n3',
    label: 'Nano Banana Generator',
    type: 'generator',
    prompt: 'A beautiful sunny day',
    model: 'nano-banana-2',
    aspectRatio: '16:9',
    numImages: 1
  } as GeneratorNodeData,

  videoInput: {
    id: 'n4',
    label: 'Video Source',
    type: 'video',
    video: 'data:video/mp4;base64,AAAA...',
    filename: 'test-video.mp4',
    duration: 12.5,
  } as VideoInputNodeData
};

export const invalidNodeData = {
  missingRequired: {
    id: 'n1',
    // missing label, type, etc.
  },
  wrongTypes: {
    id: 'n2',
    label: 123, // should be string
    type: 'text',
    text: null // should be string
  },
  outOfBounds: {
    id: 'n3',
    label: 'Gen',
    type: 'generator',
    progress: 150 // should be 0-100
  }
};
