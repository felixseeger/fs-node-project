import { v2 as cloudinary } from 'cloudinary';

function ensureCloudinaryConfig() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error('Cloudinary is not configured. Missing CLOUDINARY_CLOUD_NAME / CLOUDINARY_API_KEY / CLOUDINARY_API_SECRET.');
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });
}

export async function uploadWorkflowThumbnail(imageDataUrl, workflowId) {
  ensureCloudinaryConfig();

  const safeWorkflowId = String(workflowId || 'unknown-workflow').replace(/[^a-zA-Z0-9_-]/g, '_');
  const publicId = `workflow-${safeWorkflowId}`;

  const result = await cloudinary.uploader.upload(imageDataUrl, {
    folder: 'workflows',
    public_id: publicId,
    overwrite: true,
    invalidate: true,
    resource_type: 'image',
    format: 'png',
    tags: ['workflow-thumbnail', safeWorkflowId],
  });

  return {
    url: result.secure_url,
    publicId: result.public_id,
  };
}
