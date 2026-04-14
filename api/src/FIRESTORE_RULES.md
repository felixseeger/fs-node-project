/**
 * Firestore Security Rules for User Flow Backend
 *
 * These rules ensure data access is properly secured:
 * - Users can only access their own data
 * - Public workflows are readable by anyone
 * - Admin functions require custom claims
 */

rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
  
    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }
    
    function isAdmin() {
      return isAuthenticated() && 
             ('admin' in request.auth.token && request.auth.token.admin == true);
    }
    
    // ==========================================
    // USERS COLLECTION
    // ==========================================
    match /users/{userId} {
      // Users can read their own profile
      allow read: if isOwner(userId);
      
      // Users can create their own profile (on first sign-in)
      allow create: if isOwner(userId);
      
      // Users can update their own profile
      allow update: if isOwner(userId);
      
      // Only admins can delete users
      allow delete: if isAdmin();
      
      // Validate user data structure
      match /{document=**} {
        allow read, write: if false; // No subcollections
      }
    }
    
    // ==========================================
    // PROFILES COLLECTION
    // ==========================================
    match /profiles/{userId} {
      // Anyone can read public profile fields
      allow read: if true;
      
      // Users can create their own profile
      allow create: if isOwner(userId);
      
      // Users can update their own profile
      allow update: if isOwner(userId) && 
                     request.resource.data.keys().hasOnly([
                       'uid', 'bio', 'company', 'website', 'location', 
                       'social', 'workflowsCount', 'totalGenerations',
                       'lastActiveAt', 'createdAt', 'updatedAt'
                     ]);
      
      // Only admins can delete profiles
      allow delete: if isAdmin();
    }
    
    // ==========================================
    // WORKFLOWS COLLECTION
    // ==========================================
    match /workflows/{workflowId} {
      // Helper to check if user owns workflow
      function isWorkflowOwner() {
        return isAuthenticated() && 
               resource.data.uid == request.auth.uid;
      }
      
      function isWorkflowOwnerNew() {
        return isAuthenticated() && 
               request.resource.data.uid == request.auth.uid;
      }
      
      // Read: Public workflows or owned workflows
      allow read: if resource.data.isPublic == true || 
                     isWorkflowOwner();
      
      // Create: Must be authenticated, owner must match uid
      allow create: if isWorkflowOwnerNew() &&
                       request.resource.data.name is string &&
                       request.resource.data.name.size() > 0 &&
                       request.resource.data.name.size() <= 100;
      
      // Update: Only owner can update
      allow update: if isWorkflowOwner() &&
                       // Prevent changing ownership
                       request.resource.data.uid == resource.data.uid;
      
      // Delete: Only owner can delete
      allow delete: if isWorkflowOwner();
      
      // Validate workflow structure
      function validWorkflow() {
        return request.resource.data.keys().hasOnly([
          'uid', 'name', 'description', 'nodes', 'edges',
          'metadata', 'thumbnailUrl', 'isPublic', 'tags',
          'version', 'parentId', 'createdAt', 'updatedAt'
        ]) &&
        request.resource.data.name is string &&
        request.resource.data.name.size() <= 100 &&
        (request.resource.data.description == null || 
         request.resource.data.description is string) &&
        request.resource.data.nodes is list &&
        request.resource.data.edges is list &&
        request.resource.data.isPublic is bool;
      }
    }
    
    // ==========================================
    // SUBSCRIPTIONS COLLECTION
    // ==========================================
    match /subscriptions/{userId} {
      // Users can read their own subscription
      allow read: if isOwner(userId) || isAdmin();
      
      // Only server/admin can create/update subscriptions
      // (Should be done via Stripe webhooks or admin SDK)
      allow create, update, delete: if false;
    }
    
    // ==========================================
    // USAGE RECORDS COLLECTION
    // ==========================================
    match /usage_records/{recordId} {
      // Users can read their own usage
      allow read: if isAuthenticated() && 
                     resource.data.uid == request.auth.uid;
      
      // Only server can create usage records
      allow create: if false;
      
      // No updates or deletes allowed
      allow update, delete: if false;
    }
    
    // ==========================================
    // INVOICES COLLECTION
    // ==========================================
    match /invoices/{invoiceId} {
      // Users can read their own invoices
      allow read: if isAuthenticated() && 
                     resource.data.uid == request.auth.uid;
      
      // Only server can create invoices (via Stripe webhooks)
      allow create: if false;
      
      // No updates or deletes allowed
      allow update, delete: if false;
    }
    
    // ==========================================
    // DEFAULT DENY
    // ==========================================
    // Deny access to any collections not explicitly allowed
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
