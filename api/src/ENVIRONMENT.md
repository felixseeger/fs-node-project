# User Flow Backend - Environment Variables

## Required Variables

### Firebase
```env
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_SERVICE_ACCOUNT={"type":"service_account",...}  # JSON string or use file
# OR place firebase-service-account.json in api/ directory
```

### Stripe (Billing)
```env
STRIPE_SECRET_KEY=sk_live_... or sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_PRO=price_...  # Stripe Price ID for Pro plan
STRIPE_PRICE_TEAM=price_...  # Stripe Price ID for Team plan
STRIPE_PRICE_ENTERPRISE=price_...  # Stripe Price ID for Enterprise plan
```

### Existing API Keys
```env
FREEPIK_API_KEY=...
ANTHROPIC_API_KEY=...
ELEVENLABS_API_KEY=...
LTX_API_KEY=...
GOOGLE_GEMINI_API_KEY=...
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

### Server Configuration
```env
NODE_ENV=development | production
PORT=3001
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
REQUEST_TIMEOUT_MS=120000
```

## Stripe Setup

1. Create products in Stripe dashboard:
   - Free plan: $0/month (no Stripe product needed)
   - Pro plan: Create product → Get Price ID → Set `STRIPE_PRICE_PRO`
   - Team plan: Create product → Get Price ID → Set `STRIPE_PRICE_TEAM`
   - Enterprise plan: Create product → Get Price ID → Set `STRIPE_PRICE_ENTERPRISE`

2. Configure webhook endpoint:
   - URL: `https://your-domain.com/api/webhooks/stripe`
   - Events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.paid`, `invoice.payment_failed`
   - Copy webhook secret to `STRIPE_WEBHOOK_SECRET`

## Firebase Setup

1. Create service account:
   - Firebase Console → Project Settings → Service Accounts
   - Generate new private key (JSON)
   - Either:
     - Place file as `api/firebase-service-account.json`, OR
     - Set JSON content as `FIREBASE_SERVICE_ACCOUNT` env var

2. Enable Firebase Authentication:
   - Enable email/password, Google, or other providers

3. Create Firestore database:
   - Firestore Console → Create database
   - Choose location (eur3 for Europe)

## Development vs Production

### Development
```env
NODE_ENV=development
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
# Use Firebase Auth emulator if needed
FIREBASE_AUTH_EMULATOR_HOST=localhost:9099
```

### Production
```env
NODE_ENV=production
ALLOWED_ORIGINS=https://your-domain.com
# Set FIREBASE_SERVICE_ACCOUNT or ensure file exists
```
