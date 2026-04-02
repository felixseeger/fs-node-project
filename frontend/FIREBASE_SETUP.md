# Firebase Persistent Storage Setup

This document explains how to configure and use Firebase for persistent workflow storage.

## Overview

The Firebase integration provides:
- **Cloud persistence** for workflows
- **Real-time synchronization** across devices
- **Offline support** with automatic sync when connection returns
- **User-based isolation** for workflow security
- **Versioning** with automatic version increments on save

## Configuration

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Firestore Database
4. Enable Authentication (optional, for user management)

### 2. Get Configuration

In your Firebase project settings, copy the web app configuration:

```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};
```

### 3. Environment Variables

Create a `.env` file in the `frontend` directory:

```bash
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=your-app-id
```

### 4. Firestore Security Rules

In Firebase Console > Firestore Database > Rules, set:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow users to read/write only their own workflows
    match /workflows/{workflowId} {
      allow read, write: if request.auth != null && resource.data.userId == request.auth.uid;
      allow create: if request.auth != null;
    }
  }
}
```

## Features

### CRUD Operations

The `workflowService.ts` provides:

- `createWorkflow(userId, workflow)` - Create new workflow
- `getWorkflow(workflowId)` - Get workflow by ID
- `updateWorkflow(workflowId, updates, userId)` - Update workflow
- `deleteWorkflow(workflowId, userId)` - Soft delete
- `permanentlyDeleteWorkflow(workflowId)` - Hard delete

### Real-time Subscriptions

```typescript
// Subscribe to workflow changes
const unsubscribe = subscribeToWorkflow(workflowId, (workflow) => {
  console.log('Workflow updated:', workflow);
});

// Subscribe to user's workflows list
const unsubscribe = subscribeToUserWorkflows(userId, (workflows) => {
  console.log('Workflows updated:', workflows);
});
```

### React Hook

```typescript
import { useFirebaseWorkflows } from './hooks/useFirebaseWorkflows';

function MyComponent() {
  const {
    workflows,
    currentWorkflow,
    isLoading,
    error,
    create,
    load,
    save,
    remove,
    duplicate,
    exportJSON,
    importJSON,
  } = useFirebaseWorkflows({
    userId: 'user_123',
    enableRealtime: true,
  });
  
  // Use the workflow functions...
}
```

### Import/Export

```typescript
// Export workflow to JSON
const json = exportWorkflowToJSON(workflow);

// Import workflow from JSON
const workflow = importWorkflowFromJSON(json);
```

### Statistics

```typescript
const stats = await getWorkflowStats(userId);
console.log(stats.totalWorkflows);  // Total workflows
console.log(stats.totalNodes);      // Total nodes across all workflows
console.log(stats.recentWorkflows); // Workflows updated in last 7 days
console.log(stats.popularNodeTypes); // Most used node types
```

## Data Structure

### Workflow Document

```typescript
{
  id: string,                    // Firestore document ID
  userId: string,                // Owner's user ID
  name: string,                  // Workflow name
  description?: string,          // Optional description
  nodes: Node[],                 // React Flow nodes
  edges: Edge[],                 // React Flow edges
  thumbnail?: string,            // Base64 thumbnail
  nodeCount: number,             // Number of nodes
  version: number,               // Auto-incremented version
  isDeleted: boolean,            // Soft delete flag
  createdAt: Timestamp,          // Creation time
  updatedAt: Timestamp,          // Last update time
  deletedAt?: Timestamp,         // Deletion time (if soft deleted)
}
```

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                      Frontend                            │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────────┐ │
│  │   App.jsx   │──│ useFirebase  │──│ workflowService│ │
│  └─────────────┘  │ Workflows    │  └────────────────┘ │
│                   └──────────────┘           │          │
└──────────────────────────────────────────────┼──────────┘
                                               │
                    ┌──────────────────────────┘
                    │ Firebase SDK
                    │ (Firestore)
                    ▼
            ┌─────────────────┐
            │  Firestore DB   │
            │  - workflows    │
            └─────────────────┘
```

## Error Handling

The integration handles:
- **Firebase not configured** - Falls back to local storage
- **Network errors** - Offline persistence queues changes
- **Permission denied** - Shows error message to user
- **Workflow not found** - Returns null gracefully

## Testing

Run tests:
```bash
npm test
```

Build for production:
```bash
npm run build
```

## Migration from Local Storage

Existing workflows in local state will continue to work. To migrate:

1. Load the workflow from local state
2. Save it using `createFirebaseWorkflow()`
3. The workflow is now persisted in Firebase

## Limitations

- Firestore has a 1MB document size limit (sufficient for most workflows)
- Real-time sync requires active internet connection
- Text search is limited (consider Algolia for advanced search)
