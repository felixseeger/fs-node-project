# User Flow Backend

Complete backend structure for user authentication, profiles, workflows, and billing.

## Architecture

```
api/src/
├── config/           # Configuration (Firebase, etc.)
│   └── firebase.js   # Firebase Admin SDK setup
├── models/           # Data access layer (Firestore)
│   ├── user.js       # User documents
│   ├── profile.js    # User profiles
│   ├── workflow.js   # Workflow documents
│   └── subscription.js # Subscriptions, usage, invoices
├── services/         # Business logic
│   ├── authService.js     # Authentication operations
│   ├── profileService.js  # Profile management
│   ├── workflowService.js # Workflow CRUD
│   └── billingService.js  # Stripe integration
├── controllers/      # Request/response handlers
│   ├── authController.js
│   ├── profileController.js
│   ├── workflowController.js
│   └── billingController.js
├── middleware/       # Express middleware
│   ├── auth.js           # Firebase auth verification
│   ├── validation.js     # Request validation
│   └── errorHandler.js   # Error handling
├── routes/           # Route definitions
│   ├── auth.js       # /api/auth/*
│   ├── profile.js    # /api/profile/*
│   ├── workflows.js  # /api/workflows/*
│   ├── billing.js    # /api/billing/*
│   ├── webhooks.js   # /api/webhooks/*
│   └── index.js      # Route aggregator
├── types/            # Type definitions (JSDoc)
│   └── userflow.js   # User, Workflow, Subscription types
└── utils/            # Utility functions
```

## Quick Start

### 1. Install Dependencies

```bash
cd api
npm install
```

### 2. Set Environment Variables

Copy `.env.example` and fill in required values:

```bash
cp .env.example .env
```

See [ENVIRONMENT.md](./ENVIRONMENT.md) for detailed setup instructions.

### 3. Start Server

```bash
npm start
# or
node src/server.js
```

Server will start on `http://localhost:3001` (or PORT from env).

## API Endpoints

### Authentication
- `POST /api/auth/verify` - Verify Firebase token
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout all devices
- `DELETE /api/auth/account` - Delete account

### Profile
- `GET /api/profile` - Get full profile
- `PUT /api/profile` - Update profile
- `PUT /api/profile/preferences` - Update preferences
- `GET /api/profile/:uid/public` - Get public profile

### Workflows
- `POST /api/workflows` - Create workflow
- `GET /api/workflows` - List my workflows
- `GET /api/workflows/public` - List public workflows
- `GET /api/workflows/:id` - Get workflow
- `PUT /api/workflows/:id` - Update workflow
- `DELETE /api/workflows/:id` - Delete workflow
- `POST /api/workflows/:id/fork` - Fork workflow
- `POST /api/workflows/:id/duplicate` - Duplicate workflow

### Billing
- `GET /api/billing` - Get billing info
- `POST /api/billing/checkout` - Create checkout session
- `POST /api/billing/portal` - Create billing portal session
- `POST /api/billing/cancel` - Cancel subscription
- `GET /api/billing/usage` - Get usage records
- `GET /api/billing/invoices` - Get invoices

### Webhooks
- `POST /api/webhooks/stripe` - Stripe webhook handler

See [API.md](./API.md) for full API documentation.

## Firestore Security Rules

Deploy the security rules from [FIRESTORE_RULES.md](./FIRESTORE_RULES.md) to Firebase:

```bash
firebase deploy --only firestore:rules
```

## Data Model

### Collections

- **users** - User accounts (synced with Firebase Auth)
- **profiles** - Extended user profiles
- **workflows** - User workflows (can be public or private)
- **subscriptions** - User subscription status and limits
- **usage_records** - AI generation usage tracking
- **invoices** - Billing invoice history

## Authentication Flow

1. User signs in via Firebase Auth (client-side)
2. Client gets Firebase ID token: `user.getIdToken()`
3. Client sends token to backend: `Authorization: Bearer <token>`
4. Backend verifies token with Firebase Admin SDK
5. Backend ensures user exists in Firestore (creates if needed)
6. Backend attaches user to request: `req.user`

## Billing Flow

1. User clicks "Upgrade" → `POST /api/billing/checkout`
2. Backend creates Stripe Checkout Session
3. User is redirected to Stripe to complete payment
4. Stripe sends webhook to `POST /api/webhooks/stripe`
5. Backend updates subscription in Firestore
6. User's plan limits are enforced on API calls

## Usage Tracking

Each AI generation should record usage:

```javascript
import { recordGenerationUsage } from './services/billingService.js';

await recordGenerationUsage(uid, 'image_gen', 1);
```

This:
- Checks if user has remaining credits
- Creates usage record
- Updates subscription counters
- Throws error if limit reached

## Development

### Adding New Endpoints

1. Create controller in `controllers/`
2. Create route in `routes/`
3. Add validation in `middleware/validation.js`
4. Mount route in `routes/index.js`

### Adding New Models

1. Create model in `models/`
2. Add type definition in `types/userflow.js`
3. Update Firestore rules

### Testing

```bash
# Test authentication
curl -X POST http://localhost:3001/api/auth/verify \
  -H "Content-Type: application/json" \
  -d '{"token":"<firebase_token>"}'

# Test health check
curl http://localhost:3001/health
```

## Deployment

### Environment Setup

Set environment variables in your hosting platform (Cloud Run, Heroku, etc.):

- All variables from `.env`
- `NODE_ENV=production`
- `ALLOWED_ORIGINS=https://your-domain.com`

### Firebase Emulator

For local development with Firebase emulator:

```env
FIREBASE_AUTH_EMULATOR_HOST=localhost:9099
```

## Troubleshooting

### "Invalid token" errors
- Check Firebase service account is correctly configured
- Verify token is from Firebase Auth (not custom token)

### Stripe webhook not receiving events
- Check webhook URL is publicly accessible
- Verify `STRIPE_WEBHOOK_SECRET` is correct
- Check Stripe dashboard for webhook configuration

### Firestore permission denied
- Deploy Firestore rules
- Check user is authenticated
- Verify custom claims if using admin roles
