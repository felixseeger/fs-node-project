# Node Canvas Hardening Guide

## Critical Edge Cases & Fixes

### 1. Text Overflow (Long Prompts/Titles)

**Issue**: User enters 500+ character prompt → breaks layout

```jsx
// ✅ HARDENED: Add text truncation with title hover
<textarea
  className="nodrag nopan nowheel"
  style={{
    maxHeight: '200px',  // Prevent infinite growth
    resize: 'vertical',
    overflow: 'auto',
    wordWrap: 'break-word',
  }}
  maxLength={2000}      // Hard limit
  title={value}         // Show full text on hover
/>

// For displays:
<div className="line-clamp-3">  {/* CSS: max 3 lines */}
  {longText}
</div>
```

### 2. Error States - No Recovery Path

**Issue**: User sees error but can't retry. They must reload.

```jsx
// ❌ CURRENT: Just shows error
{data.outputError && <p>{data.outputError}</p>}

// ✅ HARDENED: Error with recovery action
{data.outputError && (
  <div style={{
    padding: '12px',
    background: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgb(239, 68, 68)',
    borderRadius: '6px',
    color: 'rgb(239, 68, 68)',
  }}>
    <p style={{ margin: '0 0 8px 0' }}>{data.outputError}</p>
    <button
      onClick={handleGenerate}
      disabled={isGenerating}
      style={{
        padding: '4px 12px',
        background: 'rgb(239, 68, 68)',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
      }}
    >
      Try Again
    </button>
  </div>
)}
```

### 3. Double-Click Generation

**Issue**: User clicks Generate twice → 2 API calls, 2x cost

```jsx
// ✅ HARDENED: Disable button while generating
<button
  onClick={handleGenerate}
  disabled={isGenerating}  // Prevent double-click
  style={{
    opacity: isGenerating ? 0.5 : 1,
    cursor: isGenerating ? 'not-allowed' : 'pointer',
  }}
>
  {isGenerating ? 'Generating...' : 'Generate'}
</button>
```

### 4. Network Timeouts

**Issue**: Large file upload times out silently

```javascript
// ✅ HARDENED: Add timeout + progress
export async function uploadImages(files, onProgress) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout

  try {
    const formData = new FormData();
    files.forEach((f) => formData.append('images', f));

    const res = await fetch(`${API_BASE}/api/upload-image`, {
      method: 'POST',
      body: formData,
      signal: controller.signal,
    });

    if (!res.ok) {
      throw new Error(`Upload failed: ${res.status} ${res.statusText}`);
    }

    return await res.json();
  } catch (err) {
    if (err.name === 'AbortError') {
      throw new Error('Upload timeout - check your connection and try again');
    }
    throw err;
  } finally {
    clearTimeout(timeoutId);
  }
}
```

### 5. Large File Handling

**Issue**: User uploads 100MB image → browser freezes

```jsx
// ✅ HARDENED: Validate file size before processing
const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB limit

const handleFileSelect = useCallback((files) => {
  const file = files[0];

  // Validate size
  if (file.size > MAX_FILE_SIZE) {
    update({
      outputError: `File too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Max 20MB.`
    });
    return;
  }

  // Validate format
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
    update({ outputError: 'Only JPEG, PNG, WebP supported' });
    return;
  }

  // Compress before upload
  const reader = new FileReader();
  reader.onload = async (ev) => {
    try {
      const compressed = await compressImageBase64(ev.target.result, {
        maxWidth: 2048,
        maxHeight: 2048,
        quality: 0.85,
      });
      update({ image1Url: compressed });
    } catch (err) {
      update({ outputError: `Failed to process image: ${err.message}` });
    }
  };
  reader.readAsDataURL(file);
}, [update]);
```

### 6. Empty States - No Guidance

**Issue**: User sees empty output box, doesn't know what to do

```jsx
// ✅ HARDENED: Clear empty state with next action
{!output && !error && !isLoading && (
  <div style={{
    padding: '32px 16px',
    textAlign: 'center',
    color: text.muted,
  }}>
    <svg width="24" height="24" style={{ opacity: 0.5 }}>
      {/* Appropriate icon for content type */}
    </svg>
    <p style={{ fontSize: '12px', marginTop: '8px' }}>
      {emptyText || 'Ready to generate'}
    </p>
    <p style={{ fontSize: '11px', color: text.subtle, marginTop: '4px' }}>
      Enter a prompt and click Generate
    </p>
  </div>
)}
```

### 7. Rate Limiting

**Issue**: API rate limit error shows but user retries immediately

```jsx
// ✅ HARDENED: Exponential backoff with retry timer
const [retryIn, setRetryIn] = useState(0);

const handleRetry = async () => {
  try {
    // ... generation code
  } catch (err) {
    if (err.status === 429) {
      // Rate limited - back off
      const delay = Math.min(30, (retryAttempts + 1) * 5); // 5s, 10s, 15s, etc.
      setRetryIn(delay);

      const timer = setInterval(() => {
        setRetryIn(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      update({
        outputError: `Rate limited. Retry in ${delay}s.`
      });
    }
  }
};

// In UI:
<button
  disabled={retryIn > 0}
>
  {retryIn > 0 ? `Retry in ${retryIn}s` : 'Try Again'}
</button>
```

### 8. Progress Indication for Long Operations

**Issue**: 60-second generation with no feedback → user thinks it hung

```jsx
// ✅ HARDENED: Show progress + time estimate
const [elapsedTime, setElapsedTime] = useState(0);

useEffect(() => {
  if (!isGenerating) return;

  const interval = setInterval(() => {
    setElapsedTime(prev => prev + 1);
  }, 1000);

  return () => clearInterval(interval);
}, [isGenerating]);

// In UI:
{isGenerating && (
  <div style={{ padding: '12px', background: 'rgba(59, 130, 246, 0.1)' }}>
    <div style={{ fontSize: '12px', color: text.primary }}>
      Generating... ({elapsedTime}s)
    </div>
    <div style={{
      height: '4px',
      background: 'rgba(59, 130, 246, 0.2)',
      borderRadius: '2px',
      marginTop: '8px',
      overflow: 'hidden',
    }}>
      <div style={{
        height: '100%',
        background: 'rgb(59, 130, 246)',
        animation: 'pulse 2s ease-in-out infinite',
        width: `${Math.min(100, (elapsedTime / estimatedTime) * 100)}%`,
      }} />
    </div>
  </div>
)}
```

### 9. Validation Before Generation

**Issue**: Missing required input → API error instead of user-friendly message

```jsx
// ✅ HARDENED: Pre-flight validation
const validateInputs = useCallback(() => {
  const errors = [];

  if (!data.inputPrompt?.trim()) {
    errors.push('Prompt is required');
  } else if (data.inputPrompt.length > 2000) {
    errors.push('Prompt too long (max 2000 characters)');
  }

  if (selectedModelsSupportImage && !image1) {
    errors.push(`${selectedModel} requires an input image`);
  }

  if (errors.length > 0) {
    update({ outputError: errors.join('\n') });
    return false;
  }

  return true;
}, [data, image1]);

const handleGenerate = useCallback(async () => {
  if (!validateInputs()) return;
  // ... generation continues
}, [validateInputs]);
```

### 10. Internationalization - Text Overflow

**Issue**: German/French translations 30% longer → break layouts

```css
/* ✅ HARDENED: Use flexible widths + wrapping */
.node-label {
  /* ❌ BAD: */
  /* width: 80px; */

  /* ✅ GOOD: */
  max-width: 150px;
  word-wrap: break-word;
  overflow-wrap: break-word;
  line-height: 1.3;
}
```

## Testing Checklist

- [ ] Upload 50MB file (should reject with clear message)
- [ ] Enter 2000+ character prompt (should truncate gracefully)
- [ ] Click Generate 5 times rapidly (should prevent double-submit)
- [ ] Force API 500 error (should show retry button)
- [ ] Disconnect internet mid-generation (should show timeout message)
- [ ] Test with RTL text (Arabic) - should layout correctly
- [ ] Test with emoji in prompts
- [ ] Generate 100+ images - check for memory leaks
- [ ] Test keyboard-only navigation (Tab/Enter to generate)
- [ ] Test with screen reader (output should be announced)

## Priority Fixes

**High** (implement immediately):
- [x] Double-click protection
- [ ] Error states with retry
- [ ] File size validation
- [ ] Timeout handling
- [ ] Validation before API call

**Medium** (implement soon):
- [ ] Progress indication
- [ ] Rate limit backoff
- [ ] Better empty states
- [ ] Text truncation

**Low** (nice to have):
- [ ] Internationalization
- [ ] Advanced analytics
- [ ] Performance metrics
