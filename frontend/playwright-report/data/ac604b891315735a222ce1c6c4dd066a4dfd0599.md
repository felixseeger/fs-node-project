# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: chat-media.spec.js >> Chat Media Operations >> VibeChat - can post generated image to chat
- Location: tests/e2e/chat-media.spec.js:5:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('.react-flow__node-generator').first()
Expected: visible
Timeout: 15000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 15000ms
  - waiting for locator('.react-flow__node-generator').first()

```

# Page snapshot

```yaml
- generic [ref=e1]:
  - generic [ref=e3]:
    - generic [ref=e4]:
      - generic [ref=e5]:
        - button "Logo Nodespace" [ref=e7] [cursor=pointer]:
          - generic [ref=e8]:
            - img "Logo" [ref=e9]
            - generic [ref=e10]: Nodespace
          - img [ref=e11]
        - generic [ref=e13]: /
        - generic [ref=e14]: Board 107
      - generic [ref=e15]:
        - generic [ref=e16]:
          - button "Interface" [ref=e17] [cursor=pointer]
          - button "Node Editor" [ref=e18] [cursor=pointer]
        - button "Account" [ref=e19] [cursor=pointer]:
          - img "Account" [ref=e20]:
            - generic [ref=e21]: U
    - generic [ref=e22]:
      - generic [ref=e23]:
        - button "Private" [ref=e24] [cursor=pointer]: Private
        - generic "Available Credits" [ref=e26]:
          - img [ref=e27]
          - text: "0"
        - generic [ref=e29]: Ready
        - button "Project settings" [ref=e30] [cursor=pointer]:
          - img [ref=e31]
          - text: Project settings
        - button "Recipes" [ref=e34] [cursor=pointer]:
          - img [ref=e35]
          - text: Recipes
      - generic [ref=e38]:
        - button "👥 Collab" [ref=e39] [cursor=pointer]:
          - generic [ref=e40]: 👥
          - text: Collab
        - button "Share" [ref=e41] [cursor=pointer]:
          - img [ref=e42]
          - text: Share
        - button "Save as Template" [ref=e45] [cursor=pointer]
        - generic [ref=e47]:
          - button "Save" [ref=e48] [cursor=pointer]:
            - img [ref=e49]
            - text: Save
          - button [ref=e52] [cursor=pointer]:
            - img [ref=e53]
        - button "API" [ref=e55] [cursor=pointer]:
          - img [ref=e56]
          - text: API
        - button "Import JSON" [ref=e60] [cursor=pointer]:
          - img [ref=e61]
        - button "Export JSON" [ref=e63] [cursor=pointer]:
          - img [ref=e64]
        - button "Take Screenshot (Cmd/Ctrl+Shift+S)" [ref=e66] [cursor=pointer]:
          - img [ref=e67]
        - button "Keyboard Shortcuts (Cmd/Cmd+.)" [ref=e70] [cursor=pointer]:
          - img [ref=e71]
    - generic [ref=e76]:
      - generic:
        - list [ref=e78]:
          - listitem [ref=e79]:
            - button "Add Nodes" [ref=e80] [cursor=pointer]:
              - text: Add Nodes
              - img [ref=e81]
          - listitem [ref=e83]:
            - link "Uploaded Files" [ref=e84] [cursor=pointer]:
              - /url: "#"
              - text: Uploaded Files
              - img [ref=e86]
          - listitem [ref=e88]:
            - link "Workflows" [ref=e89] [cursor=pointer]:
              - /url: "#"
              - text: Workflows
              - img [ref=e91]
          - listitem [ref=e93]:
            - link "Library" [ref=e94] [cursor=pointer]:
              - /url: "#"
              - text: Library
              - img [ref=e96]
          - listitem [ref=e99]:
            - link "Community" [ref=e100] [cursor=pointer]:
              - /url: "#"
              - text: Community
              - img [ref=e102]
          - listitem [ref=e105]:
            - link "History" [ref=e106] [cursor=pointer]:
              - /url: "#"
              - text: History
              - img [ref=e108]
          - listitem [ref=e111]:
            - link "Add Text" [ref=e112] [cursor=pointer]:
              - /url: "#"
              - text: Add Text
              - img [ref=e114]
          - listitem [ref=e116]:
            - link "Add Comment" [ref=e117] [cursor=pointer]:
              - /url: "#"
              - text: Add Comment
              - img [ref=e119]
          - listitem
          - listitem [ref=e121]:
            - button "Help" [ref=e122] [cursor=pointer]:
              - text: Help
              - img [ref=e124]
          - listitem [ref=e127]
          - listitem [ref=e129]:
            - button "User Profile FS" [ref=e130] [cursor=pointer]:
              - text: User Profile
              - generic [ref=e131]: FS
        - generic:
          - generic:
            - generic:
              - img
            - textbox "Search nodes and models" [active]: generator
          - generic:
            - generic:
              - button "Universal Image"
              - button "Universal Video"
        - generic:
          - generic:
            - link "Help & Resources":
              - /url: "#"
              - generic:
                - img
              - generic: Help & Resources
              - generic:
                - img
            - link "Report a bug":
              - /url: "#"
              - generic:
                - img
              - generic: Report a bug
              - generic:
                - img
            - link "Suggest a feature":
              - /url: "#"
              - generic:
                - img
              - generic: Suggest a feature
              - generic:
                - img
            - link "Keyboard shortcuts Ctrl + .":
              - /url: "#"
              - generic:
                - img
              - generic: Keyboard shortcuts
              - generic: Ctrl + .
          - generic:
            - link:
              - /url: "#"
              - img
            - link:
              - /url: "#"
              - img
            - link:
              - /url: "#"
              - img
            - link:
              - /url: "#"
              - img
          - generic:
            - link "FS V1.0":
              - /url: "#"
              - generic: FS V1.0
              - generic:
                - img
            - generic: Last updated Mar 31, 2026
      - generic [ref=e132]:
        - generic [ref=e134]:
          - generic [ref=e135]: Reference Images (0)
          - button "+" [ref=e136] [cursor=pointer]
        - generic [ref=e138] [cursor=pointer]:
          - generic [ref=e140]: ✓
          - generic [ref=e141]: Drag or click to add context images
      - generic [ref=e143]:
        - button "Image" [ref=e144] [cursor=pointer]
        - button "Video" [ref=e145] [cursor=pointer]
        - button "Prompt" [ref=e146] [cursor=pointer]
        - button "Generate" [ref=e148] [cursor=pointer]:
          - text: Generate
          - img [ref=e149]
        - button "Output" [ref=e151] [cursor=pointer]
        - button "All nodes" [ref=e153] [cursor=pointer]:
          - text: All nodes
          - img [ref=e154]
        - button "All models" [ref=e157] [cursor=pointer]
        - button "Auto-layout" [ref=e159] [cursor=pointer]:
          - img [ref=e160]
        - button "Fit view" [ref=e163] [cursor=pointer]:
          - img [ref=e164]
        - generic [ref=e167]:
          - button "Run" [ref=e168] [cursor=pointer]:
            - img [ref=e169]
            - text: Run
          - button "Run options" [ref=e171] [cursor=pointer]:
            - img [ref=e172]
      - generic [ref=e174]:
        - generic [ref=e175]:
          - button "Zoom Out" [ref=e176] [cursor=pointer]:
            - img [ref=e177]
          - generic [ref=e178]: 100%
          - button "Zoom In" [ref=e179] [cursor=pointer]:
            - img [ref=e180]
          - button "Fit View" [ref=e182] [cursor=pointer]:
            - img [ref=e183]
          - button "Center on Selected Node" [ref=e186] [cursor=pointer]:
            - img [ref=e187]
        - img "Mini Map" [ref=e192]
      - generic [ref=e194]:
        - button "Take Snapshot" [ref=e195] [cursor=pointer]
        - button "History (0)" [ref=e196] [cursor=pointer]
      - button "Health (Good)" [ref=e198] [cursor=pointer]: Health (Good)
      - generic:
        - img
      - application [ref=e200]:
        - img
        - link "React Flow attribution" [ref=e204] [cursor=pointer]:
          - /url: https://reactflow.dev
          - text: React Flow
      - generic [ref=e206]:
        - heading "Live Action Feed" [level=3] [ref=e208]: Live Action Feed
        - generic [ref=e211]: No recent activity
      - generic [ref=e212]:
        - generic "You" [ref=e214]: 👤
        - generic [ref=e215]: 1 collaborator online
      - button "Close chat" [ref=e216] [cursor=pointer]:
        - img [ref=e220]
      - generic [ref=e223]:
        - generic [ref=e224]:
          - generic [ref=e227]: AI Assistant
          - generic [ref=e228]:
            - button "Start new conversation" [ref=e229] [cursor=pointer]: ➕
            - button "Toggle Import/Export options" [ref=e230] [cursor=pointer]: 💾
            - button "Close chat" [ref=e231] [cursor=pointer]: ✕
        - generic [ref=e233]:
          - img [ref=e235]
          - heading "Welcome to the AI Workflow Builder" [level=3] [ref=e237]
          - paragraph [ref=e238]: Describe what you'd like to create, and I'll generate a complete node-based workflow for you.
          - generic [ref=e239]:
            - button "✨ Image Beauty-Retouche" [ref=e240] [cursor=pointer]:
              - generic [ref=e241]: ✨
              - generic [ref=e242]: Image Beauty-Retouche
            - button "🎬 Video Color-Correction Workflow" [ref=e243] [cursor=pointer]:
              - generic [ref=e244]: 🎬
              - generic [ref=e245]: Video Color-Correction Workflow
        - generic [ref=e247]:
          - textbox "Chat input message" [ref=e248]:
            - /placeholder: Describe what you want to create…
          - generic [ref=e249]:
            - button "Attach context image" [ref=e250] [cursor=pointer]:
              - img [ref=e251]
            - button "Pick from assets" [ref=e256] [cursor=pointer]:
              - img [ref=e257]
            - button "Start voice recognition" [ref=e259] [cursor=pointer]:
              - img [ref=e260]
            - button "Toggle tag Portrait" [pressed] [ref=e263] [cursor=pointer]:
              - img [ref=e264]
              - text: Portrait
            - button "Toggle tag 10s" [pressed] [ref=e268] [cursor=pointer]:
              - img [ref=e269]
              - text: 10s
            - button "Generate workflow" [disabled] [ref=e272]:
              - img [ref=e273]
    - button "Board 107" [ref=e277] [cursor=pointer]:
      - img [ref=e278]
      - generic [ref=e283]: Board 107
      - img [ref=e284]
  - generic [ref=e286]:
    - generic [ref=e287]:
      - heading "Welcome to FS Node Project!" [level=3] [ref=e288]
      - generic [ref=e289]: 1 of 6
    - paragraph [ref=e290]: This is a visual workspace for building AI pipelines. Let's take a quick tour to help you get started.
    - generic [ref=e291]:
      - button "Skip Tour" [ref=e292] [cursor=pointer]
      - button "Next" [ref=e294] [cursor=pointer]
```

# Test source

```ts
  1  | import { test, expect } from './fixtures.js';
  2  | 
  3  | test.describe('Chat Media Operations', () => {
  4  | 
  5  |   test('VibeChat - can post generated image to chat', async ({ editorPage: page }) => {
  6  |     await expect(page.locator('.react-flow__pane')).toBeVisible();
  7  | 
  8  |     // 1. Create a Generator Node using Command Palette
  9  |     await page.keyboard.press(' '); // Space to open search
  10 |     const searchInput = page.locator('.ms-search-input-overlay');
  11 |     await expect(searchInput).toBeVisible({ timeout: 5000 });
  12 |     await searchInput.fill('generator');
  13 |     await page.keyboard.press('Enter');
  14 | 
  15 |     const genNode = page.locator('.react-flow__node-generator').first();
> 16 |     await expect(genNode).toBeVisible({ timeout: 15000 });
     |                           ^ Error: expect(locator).toBeVisible() failed
  17 | 
  18 |     // 2. Open Chat using Shortcut
  19 |     await page.keyboard.press('Control+c'); // Changed from metaKey for broader compatibility
  20 |     const chatInput = page.locator('textarea[placeholder*="Ask anything"]');
  21 |     await expect(chatInput).toBeVisible({ timeout: 10000 });
  22 | 
  23 |     // 3. Command to generate and post
  24 |     await chatInput.fill('Generate a test image and show it here');
  25 |     await chatInput.press('Enter');
  26 | 
  27 |     // 4. Verify image appears in chat
  28 |     const chatImage = page.locator('.ms-chat-message img').first();
  29 |     await expect(chatImage).toBeVisible({ timeout: 30000 });
  30 |     
  31 |     await page.screenshot({ path: 'tests/e2e/screenshots/chat_image_posted.png' });
  32 |   });
  33 | 
  34 |   test('VibeChat - can post generated video to chat', async ({ editorPage: page }) => {
  35 |     // Open Chat
  36 |     await page.evaluate(() => { window.dispatchEvent(new KeyboardEvent('keydown', { key: 'c', metaKey: true })); });
  37 |     const chatInput = page.locator('textarea[placeholder*="Ask anything"]');
  38 |     
  39 |     await chatInput.fill('Generate a short 5s test video and post it');
  40 |     await chatInput.press('Enter');
  41 | 
  42 |     // Verify video appears in chat
  43 |     const chatVideo = page.locator('.ms-chat-message video').first();
  44 |     await expect(chatVideo).toBeVisible({ timeout: 60000 });
  45 |     
  46 |     await page.screenshot({ path: 'tests/e2e/screenshots/chat_video_posted.png' });
  47 |   });
  48 | });
  49 | 
```