# Build a Node-Based AI Image Pipeline Editor

Build a React 19 + Vite 8 frontend with an Express.js backend on port 3001. Use `@xyflow/react` for a drag-and-drop node canvas. The app lets users place individual nodes on the canvas and connect them manually by drawing edges between handles.

## Setup

- Read the provided API text file and extract all API keys, endpoints, parameters, and documentation
- Store all keys and secrets in a `.env` file
- Before modifying any existing file, create a timestamped backup

---

## Visual Design (Clean Dark Theme)

- Canvas background: `#1a1a1a`
- Nodes: solid dark cards — `background: #2a2a2a`, `border: 1px solid #3a3a3a`, `border-radius: 8px`
- Node header: 13px font, 600 weight, with a small colored dot indicating node type
- Text color: `#e0e0e0`
- Node hover: border lightens to `#4a4a4a`
- Node selected: blue border `#3b82f6`
- No glassmorphism, no blur, no glow effects, no animations on nodes

---

## Connection Handles

Handles are small colored circles (10x10px, round) on the sides of nodes. Inputs on the left (`Position.Left`), outputs on the right (`Position.Right`). Each handle has a **type** that determines its color and what it can connect to:

| Data Type      | Color              | Handle IDs that map to this type                                                        |
| -------------- | ------------------ | --------------------------------------------------------------------------------------- |
| `image`        | `#ec4899` (pink)   | `output`, `image-in`, `images-in`, `image_urls`, `image`, `image-out`                   |
| `text`         | `#f97316` (orange) | `prompt-in`, `prompt-out`, `analysis-in`, `analysis-out`, `text-in`, `text-out`, `adapted-in`, `adapted-prompt`, `system-in`, any ID containing `prompt`, `analysis`, or `text` |
| `aspect_ratio` | `#f59e0b` (amber)  | `aspect-ratio-in`, `aspect_ratio`, any ID containing `aspect`                           |
| `resolution`   | `#22c55e` (green)  | `resolution-in`, `resolution`, any ID containing `resolution`                           |
| `num_images`   | `#8b5cf6` (purple) | `num-images-in`, `num_images`, any ID containing `num_images` or `num-images`           |
| `any`          | `#8b5cf6` (purple) | Fallback for unrecognized IDs; connects to anything                                     |

Each handle has a small text label next to it showing what it accepts.

---

## Edge Validation & Connection Rules

```
isValidConnection(connection):
  1. if source === target → REJECT (no self-connections)
  2. resolve srcType = getHandleDataType(connection.sourceHandle)
  3. resolve tgtType = getHandleDataType(connection.targetHandle)
  4. if srcType === 'any' OR tgtType === 'any' → ACCEPT
  5. if srcType === tgtType → ACCEPT
  6. else → REJECT
```

**Valid connections:** `image↔image`, `text↔text`, `aspect_ratio↔aspect_ratio`, `resolution↔resolution`, `num_images↔num_images`, `any↔anything`.

- Edge color matches the source handle color
- Each edge has a delete button (x) at its midpoint
- Simple solid bezier curves, 2px stroke, no glow/animation

---

## How a JSON Request Becomes a Node

Now, you can examine this prompt yourself, but the basis of every node in this app is the following.

**A node is just a visual representation of the JSON body that gets sent to an API.**

That's it. That's the whole concept.

In a normal scenario — a normal app — when your user clicks a button, a JSON request gets fired off to some API in the backend, and they get an output. Visually it's dead simple: you have your inputs, your generate button, and your output. The user never sees the JSON. They never think about it.

Now, a node is just a *different* visual representation of that same API call. Instead of a button and a form, you've got a box with colored dots. Left side = what goes in. Right side = what comes out. Same data, different packaging.

So when you're building a new node, the process is:

### Step 1: Start with your API documentation

Take Nano Banana. The API docs say "send me a POST request with this JSON body":

```json
{
  "prompt": "a portrait of a woman in golden hour light",
  "webhook_url": "https://example.com/webhook",
  "resolution": "2K",
  "output_format": "png",
  "aspect_ratio": "3:4",
  "image_input": ["https://s3.amazonaws.com/my-image.jpg"]
}
```

Six fields. That's what the API wants.

### Step 2: Sort every field into one of three buckets

Go through each field and ask yourself: *does the user touch this, or do I hardcode it?*

- `prompt` — yes, the user types it → **input handle** (orange dot)
- `image_input` — yes, the user uploads images → **input handle** (pink dot)
- `aspect_ratio` — yes, the user picks from a list → **input handle** (amber dot)
- `resolution` — yes, the user picks from a list → **input handle** (green dot)
- `output_format` — no, it's always `"png"` → **hardcoded**, hide it
- `webhook_url` — no, it's always the same URL → **hardcoded**, hide it

Four fields the user touches. Two fields you hide. That's your node.

### Step 3: You tell Claude to visualize that as a node

Give Claude this breakdown — which fields are handles, which are hardcoded — and it builds the visual node for you. Left side gets the colored input dots, right side gets the output dots, and the stuff the user never touches lives in `server.js` where nobody sees it.

```
          ┌──────────────────────────┐
          │    Nano Banana 2 Edit    │
          │                          │
  ●──────▶│  prompt-in      (orange) │
  ●──────▶│  image-in        (pink)  │──────▶● output  (pink)
  ●──────▶│  aspect-ratio-in (amber) │──────▶● prompt-out (orange)
  ●──────▶│  resolution-in  (green)  │
  ●──────▶│  num-images-in (purple)  │
          │                          │
          └──────────────────────────┘

  Left dots = what the API RECEIVES       Right dots = what the API RETURNS
  (from the JSON request body)            (from the JSON response)
```

That's the whole pattern. Every single node in this app follows it

---

## Node Types

### INPUTS (section: "Inputs")

#### 1. Request — Inputs

| Property | Value |
|----------|-------|
| **React type** | `'inputNode'` |
| **Hidden** | `true` (auto-created, not in add menu) |
| **Default data** | `{ label: 'Request - Inputs', initialFields: ['prompt'], fieldValues: {}, fieldLabels: {}, imagesByField: {} }` |

**Input handles:** None

**Output handles (right side, dynamic):** Created from `initialFields` array. Duplicate fields get `_2`, `_3` suffixes.

All possible field types and their output handle configurations:

| Field Type | Handle ID | Data Type | Color | UI Control | Default |
|------------|-----------|-----------|-------|------------|---------|
| `image_urls` | `image_urls` | `image` | `#ec4899` | Image grid upload (max 15 images) | `[]` |
| `prompt` | `prompt` | `text` | `#f97316` | Textarea | `''` |
| `aspect_ratio` | `aspect_ratio` | `aspect_ratio` | `#f59e0b` | Pill selector: `'1:1'`, `'16:9'`, `'9:16'`, `'4:3'`, `'3:4'`, `'3:2'`, `'2:3'` | `'1:1'` |
| `resolution` | `resolution` | `resolution` | `#22c55e` | Pill selector: `'1K'`, `'2K'`, `'4K'` | `'1K'` |
| `num_images` | `num_images` | `num_images` | `#8b5cf6` | Range slider 1–4 | `1` |
| `text` | `text` | `text` | `#f97316` | Textarea | `''` |

**Field display labels:** `image_urls` → "Images", `prompt` → "Prompt", `aspect_ratio` → "Aspect Ratio", `resolution` → "Resolution", `num_images` → "Num Images", `text` → "Text"

---

#### 2. Text

| Property | Value |
|----------|-------|
| **React type** | `'textNode'` |
| **Section** | Inputs |
| **Default data** | `{ label: 'Text', text: '' }` |

| Side | Handle ID | Data Type | Color | Required |
|------|-----------|-----------|-------|----------|
| Left (input) | `text-in` | `text` | `#f97316` | No |
| Right (output) | `text-out` | `text` | `#f97316` | — |

**Node body:** Textarea for text content. "Add to Input" button calls `onAddToInput('prompt', nodeId, 'text-in')` which creates an edge from InputNode's `prompt` output → this node's `text-in` input. "Unlink" reverses.

**Edge example:** `inputNode.prompt` → `textNode.text-in`

---

#### 3. Image

| Property | Value |
|----------|-------|
| **React type** | `'imageNode'` |
| **Section** | Inputs |
| **Default data** | `{ label: 'Image', images: [] }` |

| Side | Handle ID | Data Type | Color | Required |
|------|-----------|-----------|-------|----------|
| Left (input) | `image-in` | `image` | `#ec4899` | No |
| Right (output) | `image-out` | `image` | `#ec4899` | — |

**Node body:** Image grid upload (max 3 images), editable label. "Add to Input" calls `onAddToInput('image_urls', nodeId, 'image-in')`.

**Edge example:** `inputNode.image_urls` → `imageNode.image-in`

---

### LLMs (section: "LLMs")

#### 4. Claude Sonnet Vision — Image Analyzer

| Property | Value |
|----------|-------|
| **React type** | `'imageAnalyzer'` |
| **API endpoint** | `POST /api/analyze-image` |
| **Model** | `claude-sonnet-4-20250514` |
| **Default data** | `{ label: 'Claude Sonnet Vision', systemDirections: '', localPrompt: '', analysisResult: '' }` |
| **Cost** | `~$0.02 · 200 cr` |

| Side | Handle ID | Data Type | Color | Required | Notes |
|------|-----------|-----------|-------|----------|-------|
| Left (input) | `image-in` | `image` | `#ec4899` | Yes | Image to analyze |
| Left (input) | `prompt-in` | `text` | `#f97316` | No | Analysis context prompt |
| Left (input) | `system-in` | `text` | `#f97316` | No | Overrides local systemDirections |
| Right (output) | `analysis-out` | `text` | `#f97316` | — | Analysis text result |

**Node body:** Expandable `systemDirections` textarea, local `localPrompt` textarea (shows "from input" badge when connected), image preview grid, display-only `analysis` area (shows "Analyzing..." during loading).

**Edge examples:**
- `inputNode.image_urls` → `imageAnalyzer.image-in`
- `inputNode.prompt` → `imageAnalyzer.prompt-in`
- `imageAnalyzer.analysis-out` → `generator.prompt-in`

---

### IMAGE GENERATORS (section: "Image Models")

All generator nodes share React type `'generator'` and are differentiated by `data.generatorType`. They use a queue + poll execution pattern (poll `/status` every 2s, up to 90 attempts / 3 min) unless noted otherwise.

**Handle visibility rules for generators:**

| Condition | `showPrompt` | `showImageIn` | `showAspectRatio` | `showResolution` | `showNumImages` |
|-----------|:---:|:---:|:---:|:---:|:---:|
| Default (Nano Banana) | Yes | Yes | Yes | Yes | Yes |
| `kora` | Yes | **No** | Yes | Yes | Yes |

**Handle-to-InputNode field mapping (for resolving edge data):**

| Generator Handle ID | Maps to InputNode field |
|---------------------|------------------------|
| `prompt-in` | `prompt` |
| `image-in` | `image_urls` |
| `aspect-ratio-in` | `aspect_ratio` |
| `resolution-in` | `resolution` |
| `num-images-in` | `num_images` |

---

#### 5. Nano Banana 2 Edit

| Property | Value |
|----------|-------|
| **React type** | `'generator'` (no subtype / `generatorType: undefined`) |
| **API endpoint** | `POST /api/generate-image` |
| **Model** | Nano Banana 2 (Enhancor) |
| **Default data** | `{ label: 'Nano Banana 2 Edit', inputImagePreview: null, inputPrompt: '', outputImage: null, isLoading: false }` |
| **Cost** | `~$0.03 · 300 cr` |
| **Resolutions** | `'1K'`, `'2K'`, `'4K'` |
| **Aspect ratios** | `'Auto'`, `'1:1'`, `'16:9'`, `'9:16'`, `'4:3'`, `'3:4'`, `'3:2'`, `'2:3'` |

| Side | Handle ID | Data Type | Color | Required |
|------|-----------|-----------|-------|----------|
| Left (input) | `prompt-in` | `text` | `#f97316` | Yes |
| Left (input) | `image-in` | `image` | `#ec4899` | No |
| Left (input) | `aspect-ratio-in` | `aspect_ratio` | `#f59e0b` | No |
| Left (input) | `resolution-in` | `resolution` | `#22c55e` | No |
| Left (input) | `num-images-in` | `num_images` | `#8b5cf6` | No |
| Right (output) | `prompt-out` | `text` | `#f97316` | — |
| Right (output) | `output` | `image` | `#ec4899` | — |

**Edge examples:**
- `promptAdapter.prompt-out` → `generator.prompt-in`
- `inputNode.image_urls` → `generator.image-in`
- `inputNode.aspect_ratio` → `generator.aspect-ratio-in`
- `inputNode.resolution` → `generator.resolution-in`
- `inputNode.num_images` → `generator.num-images-in`
- `generator.output` → `response.images-in`

---

#### 6. Kora Reality

| Property | Value |
|----------|-------|
| **React type** | `'generator'` |
| **`data.generatorType`** | `'kora'` |
| **API endpoint** | `POST /api/generate-kora` |
| **Default data** | `{ label: 'Kora Reality', ..., generatorType: 'kora' }` |
| **Cost** | `~$0.05 · 500 cr` |
| **Resolutions** | `'HD'`, `'2K'` |
| **Aspect ratios** | `'Auto'`, `'1:1'`, `'16:9'`, `'9:16'`, `'4:3'`, `'3:4'`, `'3:2'`, `'2:3'` |
| **Aspect ratio mapping** | `'1:1'` → `'square'`, `'16:9'` → `'landscape16:9'`, `'9:16'` → `'portrait9:16'`, etc. |

| Side | Handle ID | Data Type | Color | Required |
|------|-----------|-----------|-------|----------|
| Left (input) | `prompt-in` | `text` | `#f97316` | Yes |
| Left (input) | `aspect-ratio-in` | `aspect_ratio` | `#f59e0b` | No |
| Left (input) | `resolution-in` | `resolution` | `#22c55e` | No |
| Left (input) | `num-images-in` | `num_images` | `#8b5cf6` | No |
| Right (output) | `prompt-out` | `text` | `#f97316` | — |
| Right (output) | `output` | `image` | `#ec4899` | — |

**No `image-in` handle** — Kora is text-to-image only, no reference images.

---

### OUTPUT / DISPLAY (section: "Output")

#### 7. Response — Output

| Property | Value |
|----------|-------|
| **React type** | `'response'` |
| **Hidden** | `true` (auto-created, not in add menu) |
| **Default data** | `{ label: 'Response · Output', outputImage: null, isLoading: false, responseFields: [] }` |

| Side | Handle ID | Data Type | Color | Required | Notes |
|------|-----------|-----------|-------|----------|-------|
| Left (input) | `images-in` | `any` | `#8b5cf6` | Yes | Accepts connections from ANY output type |

**Output handles:** None

**Node body:** Displays `responseFields` array: `[{ id, label, source: { nodeLabel, handle }, color }]`. Shows loading spinner for handles in `GENERATED_HANDLES` set (`'image'`, `'output'`). Shows JSON reference preview (`$input.handle` or `$NodeLabel.handle`) for non-generated fields. Fields are renameable.

**Edge examples:**
- `generator.output` → `response.images-in`
- `generator.prompt-out` → `response.images-in`
- `imageAnalyzer.analysis-out` → `response.images-in`

---

#### 8. Adapted Prompt

| Property | Value |
|----------|-------|
| **React type** | `'adaptedPrompt'` |
| **Hidden** | `true` (auto-created, not in add menu) |
| **Default data** | `{ adaptedPrompt: '' }` |

| Side | Handle ID | Data Type | Color | Required |
|------|-----------|-----------|-------|----------|
| Left (input) | `adapted-in` | `text` | `#f97316` | Yes |
| Right (output) | `prompt-out` | `text` | `#f97316` | — |

**Node body:** Display-only — shows the enhanced prompt text from a connected source. Rarely needed since output text handles can connect directly to a generator.

---

## Generator Type Classifications (used in GeneratorNode.jsx)

```
isKora = generatorType === 'kora'
```

---

## Important

Do not pre-build any workflows or auto-connect nodes. Just build the individual node types with their input/output handles. Users will drag them onto the canvas and connect them manually.
