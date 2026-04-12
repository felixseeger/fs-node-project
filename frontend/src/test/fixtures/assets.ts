export const validAssets = {
  simpleImage: {
    name: 'Hero Image',
    description: 'Main hero image for landing page',
    images: ['data:image/png;base64,iVBORw0KGgo...'],
    tags: ['hero', 'landing', 'v1'],
    category: 'ui',
    isPublic: true,
  },
  multipleImages: {
    name: 'Gallery Assets',
    description: 'Various thumbnails for the gallery section',
    images: [
      'data:image/jpeg;base64,/9j/4AAQSkZJRg...',
      'data:image/jpeg;base64,/9j/4AAQSkZJRh...'
    ],
    tags: ['gallery', 'thumbnails'],
    category: 'components',
    metadata: {
      generatedBy: 'Nano Banana',
      prompt: 'A futuristic city skyline',
      seed: 12345
    }
  },
  minimal: {
    name: 'Draft Icon',
    images: ['https://example.com/placeholder.png']
  }
};

export const invalidAssets = {
  missingName: {
    description: 'No name provided',
    images: ['data:image/png;base64,iVBOR...']
  },
  missingImages: {
    name: 'Empty Asset',
    description: 'This asset has no images',
    images: [] // empty array
  },
  invalidImagesType: {
    name: 'Wrong Image Type',
    images: 'not-an-array' // string instead of array
  },
  nameTooLong: {
    name: 'A'.repeat(101), // over 100 chars
    images: ['data:image/png;base64,abc']
  },
  descriptionTooLong: {
    name: 'Valid Name',
    description: 'A'.repeat(501), // over 500 chars
    images: ['data:image/png;base64,abc']
  },
  tooManyImages: {
    name: 'Too Many Images',
    images: Array(51).fill('data:image/png;base64,abc') // over 50 images
  }
};
