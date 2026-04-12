# Updated Firebase Firestore Security Rules

Copy and paste the rules below into your [Firebase Console](https://console.firebase.google.com/) under **Firestore Database > Rules**.

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // WORKFLOWS
    match /workflows/{workflowId} {
      // Allow users to read/write their own workflows
      allow read, write: if request.auth != null && resource.data.userId == request.auth.uid;
      // Allow creation if authenticated
      allow create: if request.auth != null;
      // Allow anyone to read public workflows
      allow read: if resource.data.isPublic == true;
      // Allow a user to read a workflow if their email is in the sharedWith array
      allow read: if request.auth != null && request.auth.token.email in resource.data.sharedWith;
    }

    // ASSETS
    match /assets/{assetId} {
      // Allow users to read/write their own assets
      allow read, write: if request.auth != null && resource.data.userId == request.auth.uid;
      // Allow creation if authenticated
      allow create: if request.auth != null;
      // MATCH THE QUERY: allows reading if it's public AND not deleted
      allow read: if resource.data.isPublic == true && resource.data.isDeleted == false;
    }

    // TEMPLATES
    match /templates/{templateId} {
      // Allow users to read/write their own templates
      allow read, write: if request.auth != null && resource.data.userId == request.auth.uid;
      // Allow creation if authenticated
      allow create: if request.auth != null;
      // MATCH THE QUERY: allows reading if it's public AND not deleted
      allow read: if resource.data.isPublic == true && resource.data.isDeleted == false;
    }
    
    // USERS
    match /users/{userId} {
      // Users can only read/write their own profile
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Troubleshooting
If you still see "Insufficient Permissions" after publishing:
1. Ensure the **Composite Index** is finished building (check the link provided in the console error).
2. Check if the query in your frontend code exactly matches the `where` clauses defined in the `allow read` rules above.
