# Backend Mapping: Firebase Storage for Workflow Templates

## Overview
Currently, workflow thumbnails are captured on the frontend, sent to an Express backend endpoint (`/api/workflow-thumbnail`), and uploaded to Cloudinary. The generated URL is then stored in the Firestore `workflows` collection. 

To support saving a "cover image screenshot" to Firebase Storage when a workflow is saved as a template, we need to transition away from Cloudinary (or add Firebase Storage alongside it) and wire up the template creation process to capture and upload these images.

## 1. Firebase Admin Setup (Backend)
Since the backend does not currently have the Firebase Admin SDK installed, we must configure it to securely upload images to Firebase Storage without exposing bucket write access publicly on the frontend.

**Dependencies to install:**
```bash
npm install firebase-admin --prefix api
```

**Environment Variables (`api/.env`):**
```env
FIREBASE_PROJECT_ID="your-project-id"
FIREBASE_CLIENT_EMAIL="your-service-account-email@..."
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."
FIREBASE_STORAGE_BUCKET="your-project-id.appspot.com"
```

**New Service (`lib/api/services/firebaseStorage.js`):**
Initialize the `firebase-admin` app and export an upload function that accepts a base64 image, converts it to a buffer, and uploads it to the `templates/` folder in your Firebase Storage bucket.

```javascript
import admin from 'firebase-admin';

export function ensureFirebaseAdmin() {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    });
  }
}

export async function uploadTemplateCover(base64DataUrl, templateId) {
  ensureFirebaseAdmin();
  const bucket = admin.storage().bucket();
  const base64Data = base64DataUrl.replace(/^data:image\/\w+;base64,/, '');
  const buffer = Buffer.from(base64Data, 'base64');
  
  const file = bucket.file(`templates/${templateId}/cover.png`);
  
  await file.save(buffer, {
    metadata: { contentType: 'image/png' },
    public: true, // Make the file publicly readable
  });

  return `https://storage.googleapis.com/${bucket.name}/${file.name}`;
}
```

## 2. API Route Configuration
We need a dedicated route to receive the screenshot from the frontend and process the upload via the new Firebase Storage service.

**New Route (`lib/api/routes/templateThumbnails.js`):**
```javascript
import { Router } from 'express';
import { generationLimiter } from '../middleware/rateLimiter.js';
import { uploadTemplateCover } from '../services/firebaseStorage.js';

const router = Router();
const MAX_DATA_URL_SIZE_BYTES = 10 * 1024 * 1024; // 10MB limit

router.post('/template-thumbnail', generationLimiter, async (req, res) => {
  try {
    const { imageDataUrl, templateId } = req.body;
    
    // ... validate payload size and format ...

    const url = await uploadTemplateCover(imageDataUrl, templateId);
    return res.json({ success: true, url });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
```

**Register the Route in `lib/api/routes/index.js`:**
```javascript
import templateThumbnails from './templateThumbnails.js';
// ...
router.use('/api', templateThumbnails);
```

## 3. Frontend Integration
When the user clicks "Save Template" in `TemplateBuilderModal.tsx`, the frontend must orchestrate capturing the screenshot, uploading it to the backend, and storing the resulting URL in Firestore.

**API Helper (`frontend/src/utils/api.js`):**
```javascript
export async function uploadTemplateThumbnail(imageDataUrl, templateId) {
  const res = await fetch(`${API_BASE}/api/template-thumbnail`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ imageDataUrl, templateId }),
  });
  return safeJson(res);
}
```

**Template Builder Modal (`frontend/src/TemplateBuilderModal.tsx`):**
Update the modal to capture the canvas right before calling `onCreated`. Since the modal needs to capture the React Flow wrapper, we can pass `reactFlowWrapper` as a prop or handle the capture in `App.tsx` where the canvas context lives.

**In `App.tsx` (the `onCreated` callback):**
```tsx
import { uploadTemplateThumbnail } from './utils/api';
import { captureCanvasViewportPngDataUrl } from './utils/canvasUtils';

// ...
onCreated={async ({ template }: any) => { 
  setShowTemplateModal(false); 
  
  try {
    // 1. Capture the screenshot
    const dataUrl = await captureCanvasViewportPngDataUrl({ 
      reactFlowWrapper: reactFlowWrapper, 
      maxWidth: 1600, 
      maxHeight: 900 
    });
    
    // 2. Upload to backend (which uploads to Firebase Storage)
    const uploadRes = await uploadTemplateThumbnail(dataUrl, template.id);
    
    if (uploadRes?.url) {
      template.coverImage = uploadRes.url; // Append the cover image URL
    }
  } catch (error) {
    console.warn("Failed to capture or upload template cover:", error);
  }

  // 3. Save to Firestore (and local storage)
  saveLocalTemplate(template); 
  if (firebaseTemplates.create) {
    firebaseTemplates.create(template).catch(err => 
      showToast(`Failed to save template: ${err.message}`)
    ); 
  }
}}
```

## 4. Firestore Database Schema
The Firestore document for templates will now naturally accommodate the `coverImage` string field. 

**Updated `Template` Interface (`frontend/src/types/template.ts` or similar):**
```typescript
interface Template {
  id: string;
  name: string;
  description: string;
  nodes: any[];
  edges: any[];
  inputs: IOPoint[];
  outputs: IOPoint[];
  coverImage?: string; // NEW FIELD
}
```

**Validation (`frontend/src/services/templateService.ts`):**
Ensure `coverImage` is passed through during serialization:
```typescript
function serializeTemplate(template: any): any {
  return {
    name: template.name || 'Untitled Template',
    description: template.description || '',
    nodes: JSON.parse(JSON.stringify(template.nodes || [])),
    edges: JSON.parse(JSON.stringify(template.edges || [])),
    inputs: JSON.parse(JSON.stringify(template.inputs || [])),
    outputs: JSON.parse(JSON.stringify(template.outputs || [])),
    coverImage: template.coverImage || null, // Include the new field
    updatedAt: serverTimestamp(),
  };
}
```

## Summary
1. The **Frontend** captures the visible React Flow canvas as a `data:image/png;base64` string.
2. It sends this string to `POST /api/template-thumbnail` with the `templateId`.
3. The **Backend** receives the payload, converts it to a buffer, and uses the `firebase-admin` SDK to upload the file to Firebase Storage.
4. The Backend responds with the public Firebase Storage URL.
5. The **Frontend** attaches the URL to the template object and saves it to the `templates` collection in Firestore.