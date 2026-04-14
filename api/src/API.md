# User Flow Backend API Documentation

Complete API reference for the user flow backend with authentication, profiles, workflows, and billing.

## Base URL

```
Development: http://localhost:3001/api
Production: https://your-domain.com/api
```

## Authentication

All authenticated endpoints require a Firebase ID token in the Authorization header:

```
Authorization: Bearer <firebase_id_token>
```

### Getting a Firebase Token

```javascript
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const auth = getAuth();
const userCredential = await signInWithEmailAndPassword(auth, email, password);
const token = await userCredential.user.getIdToken();
```

---

## Authentication Endpoints

### Verify Token

Verify a Firebase ID token and get user info.

```http
POST /api/auth/verify
Content-Type: application/json

{
  "token": "<firebase_id_token>"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "uid": "abc123",
    "email": "user@example.com",
    "displayName": "John Doe",
    "photoURL": "https://...",
    "emailVerified": true
  }
}
```

### Get Current User

Get the authenticated user's full profile.

```http
GET /api/auth/me
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "user": {
    "uid": "abc123",
    "email": "user@example.com",
    "displayName": "John Doe",
    "photoURL": "https://...",
    "emailVerified": true,
    "preferences": {
      "language": "en",
      "theme": "light",
      "emailNotifications": true
    },
    "profile": {
      "bio": "...",
      "company": "...",
      "workflowsCount": 5,
      "totalGenerations": 42
    }
  }
}
```

### Logout All Devices

Revoke all active sessions.

```http
POST /api/auth/logout
Authorization: Bearer <token>
```

### Delete Account

Permanently delete user account.

```http
DELETE /api/auth/account
Authorization: Bearer <token>
```

---

## Profile Endpoints

### Get My Profile

```http
GET /api/profile
Authorization: Bearer <token>
```

### Update Profile

```http
PUT /api/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "bio": "AI enthusiast",
  "company": "Acme Inc",
  "website": "https://example.com",
  "location": "San Francisco, CA",
  "social": {
    "twitter": "@username",
    "github": "username",
    "linkedin": "username"
  }
}
```

### Update Preferences

```http
PUT /api/profile/preferences
Authorization: Bearer <token>
Content-Type: application/json

{
  "language": "en",
  "theme": "dark",
  "emailNotifications": false
}
```

### Get Public Profile

```http
GET /api/profile/:uid/public
```

---

## Workflow Endpoints

### Create Workflow

```http
POST /api/workflows
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "My AI Pipeline",
  "description": "A workflow for generating images",
  "nodes": [
    {
      "id": "node1",
      "type": "image-gen",
      "data": { "prompt": "A beautiful sunset" },
      "x": 100,
      "y": 200
    }
  ],
  "edges": [],
  "isPublic": false,
  "tags": ["ai", "image"]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "wf_abc123",
    "uid": "user123",
    "name": "My AI Pipeline",
    "nodes": [...],
    "edges": [...],
    "isPublic": false,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### List My Workflows

```http
GET /api/workflows?limit=20&orderBy=updatedAt&order=desc
Authorization: Bearer <token>
```

**Query Parameters:**
- `limit` (optional): Number of results (1-100, default: 20)
- `cursor` (optional): Pagination cursor
- `orderBy` (optional): `createdAt`, `updatedAt`, or `name` (default: `updatedAt`)
- `order` (optional): `asc` or `desc` (default: `desc`)

### List Public Workflows

```http
GET /api/workflows/public?limit=20&tags=ai,image
```

**Query Parameters:**
- `limit` (optional): Number of results (default: 20)
- `cursor` (optional): Pagination cursor
- `tags` (optional): Comma-separated list of tags

### Get Workflow

```http
GET /api/workflows/:id
Authorization: Bearer <token>
```

**Note:** Returns public workflows without auth, private workflows only for owner.

### Update Workflow

```http
PUT /api/workflows/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Name",
  "nodes": [...],
  "edges": [...],
  "isPublic": true
}
```

### Delete Workflow

```http
DELETE /api/workflows/:id
Authorization: Bearer <token>
```

### Fork Workflow

Fork a public workflow (creates a copy owned by you).

```http
POST /api/workflows/:id/fork
Authorization: Bearer <token>
```

### Duplicate Workflow

Duplicate your own workflow.

```http
POST /api/workflows/:id/duplicate
Authorization: Bearer <token>
```

---

## Billing Endpoints

### Get Billing Info

Get subscription status, usage, and invoice history.

```http
GET /api/billing
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "subscription": {
      "plan": "pro",
      "status": {
        "active": true,
        "generationsUsed": 42,
        "generationsLimit": 500,
        "creditsRemaining": 458
      },
      "currentPeriodEnd": 1735689600
    },
    "planLimits": {
      "generationsLimit": 500,
      "workflowsLimit": 50,
      "maxResolution": "4096x4096",
      "watermark": false,
      "priority": "normal"
    },
    "usage": {
      "canUse": true,
      "remaining": 458,
      "plan": "pro"
    },
    "invoices": [...]
  }
}
```

### Create Checkout Session

Create a Stripe checkout session for subscription.

```http
POST /api/billing/checkout
Authorization: Bearer <token>
Content-Type: application/json

{
  "plan": "pro",
  "successUrl": "https://your-app.com/billing/success",
  "cancelUrl": "https://your-app.com/billing/cancel"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "sessionId": "cs_live_abc123",
    "url": "https://checkout.stripe.com/pay/cs_live_..."
  }
}
```

### Create Billing Portal Session

Create a session for managing subscription (view invoices, update payment method, cancel).

```http
POST /api/billing/portal
Authorization: Bearer <token>
Content-Type: application/json

{
  "returnUrl": "https://your-app.com/billing"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "url": "https://billing.stripe.com/p/session/..."
  }
}
```

### Cancel Subscription

Cancel subscription (access continues until end of billing period).

```http
POST /api/billing/cancel
Authorization: Bearer <token>
```

### Get Usage Records

```http
GET /api/billing/usage?limit=50&type=image_gen
Authorization: Bearer <token>
```

### Get Invoices

```http
GET /api/billing/invoices?limit=20
Authorization: Bearer <token>
```

---

## Webhooks

### Stripe Webhook

```http
POST /api/webhooks/stripe
Content-Type: application/json
Stripe-Signature: <stripe_signature>
```

**Note:** This endpoint is handled automatically by Stripe. Do not call directly.

**Supported Events:**
- `checkout.session.completed`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.paid`
- `invoice.payment_failed`

---

## Error Responses

All errors follow this format:

```json
{
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

**Common Error Codes:**
- `ROUTE_NOT_FOUND` (404): Endpoint doesn't exist
- `MISSING_TOKEN` (400): No auth token provided
- `VALIDATION_ERROR` (400): Invalid request body
- `UNAUTHORIZED` (401): Invalid or expired token
- `FORBIDDEN` (403): Insufficient permissions
- `USAGE_LIMIT_REACHED` (402): Plan limit exceeded
- `INTERNAL_ERROR` (500): Server error

---

## Rate Limiting

API endpoints are rate-limited:
- Auth endpoints: 100 requests per 15 minutes per IP
- Workflow endpoints: 1000 requests per 15 minutes per IP
- Billing endpoints: 200 requests per 15 minutes per IP

Exceeding limits returns `429 Too Many Requests`.

---

## Plan Limits

| Feature | Free | Pro | Team | Enterprise |
|---------|------|-----|------|------------|
| Generations/month | 10 | 500 | 5,000 | Unlimited |
| Workflows | 3 | 50 | Unlimited | Unlimited |
| Max Resolution | 1024x1024 | 4096x4096 | 4096x4096 | 8192x8192 |
| Watermark | Yes | No | No | No |
| Priority | Low | Normal | High | Highest |

---

## Code Examples

### JavaScript/TypeScript

```typescript
import { getAuth } from 'firebase/auth';

const api = axios.create({
  baseURL: 'http://localhost:3001/api',
});

// Add auth interceptor
api.interceptors.request.use(async (config) => {
  const auth = getAuth();
  const token = await auth.currentUser?.getIdToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Create workflow
const workflow = await api.post('/workflows', {
  name: 'My Pipeline',
  nodes: [],
  edges: [],
});

// Get billing info
const billing = await api.get('/billing');
```

### cURL

```bash
# Get current user
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3001/api/auth/me

# Create workflow
curl -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","nodes":[],"edges":[]}' \
  http://localhost:3001/api/workflows

# Get billing info
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3001/api/billing
```
