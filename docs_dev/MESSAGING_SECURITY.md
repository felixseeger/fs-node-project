# Messaging Security Documentation

## Overview

The Collaboration Hub messaging system has been hardened with multiple security layers to protect against common attacks and ensure data integrity.

## Security Measures Implemented

### 1. Access Control (Firestore Security Rules)

**Location:** `firestore.rules`

#### Message Read Access
- **Before:** `allow read: if true` (PUBLIC - any authenticated user could read all messages)
- **After:** `allow read: if isAuthenticated() && workflowIdHasAccess(resource.data.workflowId)`
- **Protection:** Only users with access to the workflow (owner, shared users, or public workflow viewers) can read messages

#### Message Creation Validation
```javascript
allow create: if isAuthenticated() 
              && request.resource.data.senderId == request.auth.uid  // Prevent spoofing
              && workflowIdHasAccess(request.resource.data.workflowId)  // Workflow access required
              && request.resource.data.text is string  // Type validation
              && request.resource.data.text.size() <= 2000  // Length limit
              && request.resource.data.type in ['message', 'system']  // Valid types only
              && request.resource.data.senderName is string  // Name required
              && request.resource.data.senderName.size() <= 100;  // Name length limit
```

#### Message Modification
- Only the message sender can update or delete their messages
- Enforced via: `resource.data.senderId == request.auth.uid`

### 2. XSS Prevention

**Location:** `frontend/src/utils/sanitization.ts`

#### sanitizeHTML()
- Strips ALL HTML tags from content
- Removes dangerous protocols (`javascript:`, `data:`)
- Removes event handlers (`onerror`, `onload`, etc.)
- Uses DOMParser for proper browser-based sanitization
- Falls back to regex stripping in SSR environments

#### Usage in Components
```typescript
// CollaborationHub.tsx - Message rendering
{sanitizeHTML(message.text)}
```

### 3. Input Validation & Sanitization

**Location:** `frontend/src/utils/sanitization.ts` - `sanitizeChatMessage()`

#### Validation Checks
1. **Required field:** Message cannot be empty or null
2. **Type checking:** Must be a string
3. **Length enforcement:** Maximum 2000 characters (configurable)
4. **HTML stripping:** All HTML tags removed
5. **Control character removal:** Null bytes and other control chars stripped
6. **Zero-width character removal:** Prevents invisible text attacks
7. **Whitespace trimming:** Leading/trailing whitespace removed

#### Usage in Components
```typescript
// CollaborationHub.tsx - Send handler
const result = sanitizeChatMessage(newMessage, 2000);
if (!result.valid) {
  showToast(result.error, 'error');
  return;
}
sendMessage(result.message);
```

### 4. Rate Limiting

**Location:** `frontend/src/hooks/useCollaboration.ts`

#### Client-Side Rate Limiting
- **Limit:** 1 message per 500ms
- **Implementation:** Timestamp-based check using `lastMessageTimeRef`
- **Feedback:** Returns `false` when rate limited, component shows error toast

#### Code Pattern
```typescript
const MESSAGE_RATE_LIMIT_MS = 500;

const sendMessage = (text: string): boolean => {
  const now = Date.now();
  if (now - lastMessageTimeRef.current < MESSAGE_RATE_LIMIT_MS) {
    return false; // Rate limited
  }
  lastMessageTimeRef.current = now;
  // ... send message
  return true;
};
```

### 5. Secret Redaction

**Location:** `frontend/src/utils/sanitization.ts`

#### Protected Patterns
The following sensitive data patterns are automatically detected and redacted:
- OpenAI API keys (`sk-...`)
- Google API keys (`AIza...`)
- GitHub tokens (`ghp_...`, `gho_...`, etc.)
- JWT tokens (`eyJ...`)
- Hex keys (32-character hex strings)
- Generic sensitive keys (`api_key`, `secret`, `token`, `password`, etc.)

#### Usage
Applied to exported chats and workflow data to prevent accidental credential exposure.

### 6. Content Moderation

**Location:** `frontend/src/utils/sanitization.ts`, `lib/api/routes/moderate.js`

#### Implementation
- **Profanity Filter:** Synchronous check using `bad-words` library during input validation. Blocks messages with explicit profanity.
- **Toxicity Detection:** Asynchronous check using Google Gemini (`gemini-1.5-flash`) via the `/api/moderate` backend endpoint. Analyzes context for severe toxicity, hate speech, harassment, and abuse.
- **Fail Open:** If the backend is unavailable or the API key is missing, toxicity checking fails open to ensure chat remains functional, while profanity filtering continues to block known bad words locally.

#### Usage
Applied automatically when sending messages via `useCollaboration.ts`.

## Testing

### Security Test Files
1. **`tests/test_messaging_security.test.ts`** - Comprehensive security test suite
2. **`frontend/src/utils/__tests__/sanitization.xss.test.ts`** - XSS prevention unit tests

### Test Coverage
- ✅ XSS vector neutralization (12+ attack vectors)
- ✅ Input validation edge cases
- ✅ Length limit enforcement
- ✅ Control character removal
- ✅ Zero-width character removal
- ✅ Secret redaction for various credential formats
- ✅ Rate limiting behavior
- ✅ Content Moderation (Profanity & Toxicity)

## Threat Model

### Threats Mitigated

| Threat | Mitigation | Status |
|--------|-----------|--------|
| Cross-Site Scripting (XSS) | HTML sanitization on render | ✅ Protected |
| Message Spoofing | Firestore rules verify senderId | ✅ Protected |
| Unauthorized Access | Workflow-based access control | ✅ Protected |
| Message Flooding | Client-side rate limiting (500ms) | ✅ Protected |
| Injection Attacks | Input validation + sanitization | ✅ Protected |
| Data Leakage | Secret redaction on exports | ✅ Protected |
| Content Spoofing | Type & length validation in rules | ✅ Protected |
| Invisible Text Attacks | Zero-width character removal | ✅ Protected |
| Abusive Content | Toxicity & Profanity filtering | ✅ Protected |

### Remaining Considerations

1. **Server-Side Rate Limiting:** Currently only client-side. Consider adding Firebase Cloud Functions or App Check for additional server-side enforcement.

2. **Message Encryption:** Messages are encrypted at rest by Firebase, but end-to-end encryption is not implemented. Consider if sensitive data requires E2E encryption.

3. **Audit Logging:** Message modifications are not currently logged. Consider adding Cloud Functions to track message edits/deletions for compliance.

## Security Best Practices for Developers

### DO:
- ✅ Always use `sanitizeChatMessage()` before sending
- ✅ Always use `sanitizeHTML()` when rendering user content
- ✅ Test with the security test suite before making changes
- ✅ Keep message length limits reasonable (≤2000 chars)
- ✅ Use Firestore emulators to test security rules locally

### DON'T:
- ❌ Use `dangerouslySetInnerHTML` with user content
- ❌ Bypass sanitization for "trusted" users
- ❌ Store sensitive data in chat messages
- ❌ Disable rate limiting without alternative protections
- ❌ Modify Firestore rules without testing in emulator

## Deployment Checklist

Before deploying messaging changes:

1. [ ] Run security test suite: `npm test tests/test_messaging_security.test.ts`
2. [ ] Test Firestore rules in emulator: `firebase emulators:start`
3. [ ] Verify XSS vectors are neutralized in browser dev tools
4. [ ] Test rate limiting with rapid message sending
5. [ ] Verify access control with different user permissions
6. [ ] Check that legitimate messages still render correctly
7. [ ] Review Firestore rules for any accidental `allow read: if true`

## Incident Response

If a security issue is discovered:

1. **Immediate:** Revert the problematic change
2. **Assess:** Determine scope and impact
3. **Patch:** Implement fix with test coverage
4. **Notify:** Inform affected users if data was exposed
5. **Document:** Update this document with lessons learned

## Related Files

- `firestore.rules` - Access control rules
- `frontend/src/utils/sanitization.ts` - Sanitization utilities
- `frontend/src/components/CollaborationHub.tsx` - Chat component
- `frontend/src/hooks/useCollaboration.ts` - Rate limiting hook
- `tests/test_messaging_security.test.ts` - Security tests

## Version History

| Date | Change | Author |
|------|--------|--------|
| 2026-04-14 | Initial security hardening | Security Audit |
| 2026-04-14 | Added XSS prevention | Security Audit |
| 2026-04-14 | Added rate limiting | Security Audit |
| 2026-04-14 | Restricted message access | Security Audit |
