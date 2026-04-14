# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: nodes.spec.js >> TextElementNode - can double click, type, and blur
- Location: tests/e2e/nodes.spec.js:49:1

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator:  locator('.react-flow__node-textNode [contenteditable="true"], .react-flow__node-textNode textarea').first()
Expected: visible
Received: hidden
Timeout:  5000ms

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('.react-flow__node-textNode [contenteditable="true"], .react-flow__node-textNode textarea').first()
    8 × locator resolved to <textarea rows="3" class="nodrag nopan" placeholder="Enter text..."></textarea>
      - unexpected value "hidden"

```

# Page snapshot

```yaml
- generic [ref=e4]:
  - generic [ref=e5]:
    - generic [ref=e6]:
      - button "Logo Nodespace" [ref=e8] [cursor=pointer]:
        - generic [ref=e9]:
          - img "Logo" [ref=e10]
          - generic [ref=e11]: Nodespace
        - img [ref=e12]
      - generic [ref=e14]: /
      - generic [ref=e15]: Untitled
    - generic [ref=e16]:
      - generic [ref=e17]:
        - button "Interface" [ref=e18] [cursor=pointer]
        - button "Node Editor" [ref=e19] [cursor=pointer]
      - button "Create Workflow" [ref=e20]:
        - img [ref=e21]
        - text: Create Workflow
      - button "Account" [ref=e22] [cursor=pointer]:
        - img "Account" [ref=e23]:
          - generic [ref=e24]: U
  - generic [ref=e25]:
    - generic [ref=e26]:
      - button "Private" [ref=e27] [cursor=pointer]: Private
      - generic "Available Credits" [ref=e29]:
        - img [ref=e30]
        - text: "0"
      - generic [ref=e32]: Ready
      - button "Project settings" [ref=e33] [cursor=pointer]:
        - img [ref=e34]
        - text: Project settings
      - button "Recipes" [ref=e37] [cursor=pointer]:
        - img [ref=e38]
        - text: Recipes
    - generic [ref=e41]:
      - button "👥 Collab" [ref=e42] [cursor=pointer]:
        - generic [ref=e43]: 👥
        - text: Collab
      - button "Import" [ref=e44] [cursor=pointer]:
        - img [ref=e45]
        - text: Import
      - button "Export" [ref=e47] [cursor=pointer]:
        - img [ref=e48]
        - text: Export
      - button "Share" [ref=e50] [cursor=pointer]:
        - img [ref=e51]
        - text: Share
      - generic [ref=e55]:
        - button "Save" [ref=e56] [cursor=pointer]:
          - img [ref=e57]
          - text: Save
        - button [ref=e60] [cursor=pointer]:
          - img [ref=e61]
      - button "API" [ref=e63] [cursor=pointer]:
        - img [ref=e64]
        - text: API
      - button "Keyboard Shortcuts (Cmd/Cmd+.)" [ref=e68] [cursor=pointer]:
        - img [ref=e69]
  - generic [ref=e74]:
    - generic:
      - list [ref=e76]:
        - listitem [ref=e77]:
          - button "Add Nodes" [ref=e78] [cursor=pointer]:
            - text: Add Nodes
            - img [ref=e79]
        - listitem [ref=e81]:
          - link "Uploaded Files" [ref=e82] [cursor=pointer]:
            - /url: "#"
            - text: Uploaded Files
            - img [ref=e84]
        - listitem [ref=e86]:
          - link "Workflows" [ref=e87] [cursor=pointer]:
            - /url: "#"
            - text: Workflows
            - img [ref=e89]
        - listitem [ref=e91]:
          - link "Library" [ref=e92] [cursor=pointer]:
            - /url: "#"
            - text: Library
            - img [ref=e94]
        - listitem [ref=e97]:
          - link "Community" [ref=e98] [cursor=pointer]:
            - /url: "#"
            - text: Community
            - img [ref=e100]
        - listitem [ref=e103]:
          - link "History" [ref=e104] [cursor=pointer]:
            - /url: "#"
            - text: History
            - img [ref=e106]
        - listitem [ref=e109]:
          - link "Add Text" [ref=e110] [cursor=pointer]:
            - /url: "#"
            - text: Add Text
            - img [ref=e112]
        - listitem [ref=e114]:
          - link "Add Comment" [ref=e115] [cursor=pointer]:
            - /url: "#"
            - text: Add Comment
            - img [ref=e117]
        - listitem
        - listitem [ref=e119]:
          - button "Help" [ref=e120] [cursor=pointer]:
            - text: Help
            - img [ref=e122]
        - listitem [ref=e125]
        - listitem [ref=e127]:
          - button "User Profile FS" [ref=e128] [cursor=pointer]:
            - text: User Profile
            - generic [ref=e129]: FS
      - generic:
        - generic:
          - generic:
            - img
          - textbox "Search nodes and models"
        - generic:
          - generic:
            - generic:
              - generic: Add Node
              - generic:
                - button "Text T":
                  - generic:
                    - img
                  - generic:
                    - generic: Text
                  - generic: T
                - button "Images":
                  - generic:
                    - img
                  - generic:
                    - generic: Images
                  - generic:
                    - img
                - button "Video":
                  - generic:
                    - img
                  - generic:
                    - generic: Video
                  - generic:
                    - img
            - generic:
              - generic: Utilities
              - generic:
                - button "Layer Editor L":
                  - generic:
                    - img
                  - generic:
                    - generic: Layer Editor
                  - generic: L
                - button "Assets A":
                  - generic:
                    - img
                  - generic:
                    - generic: Assets
                  - generic: A
                - button "Group Editing B":
                  - generic:
                    - img
                  - generic:
                    - generic: Group Editing
                  - generic: B
                - button "Facial Editor F":
                  - generic:
                    - img
                  - generic:
                    - generic: Facial Editor
                  - generic: F
                - button "Video Improve V":
                  - generic:
                    - img
                  - generic:
                    - generic: Video Improve
                  - generic: V
                - button "Router R":
                  - generic:
                    - img
                  - generic:
                    - generic: Router
                  - generic: R
            - generic:
              - generic: Add Source
              - generic:
                - button "Upload U":
                  - generic:
                    - img
                  - generic:
                    - generic: Upload
                  - generic: U
                - button "Add model":
                  - generic:
                    - img
                  - generic:
                    - generic: Add model
                  - generic:
                    - img
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
    - generic [ref=e130]:
      - generic [ref=e132]:
        - generic [ref=e133]: Reference Images (0)
        - button "+" [ref=e134] [cursor=pointer]
      - generic [ref=e136] [cursor=pointer]:
        - generic [ref=e138]: ✓
        - generic [ref=e139]: Drag or click to add context images
    - generic [ref=e141]:
      - button "Image" [ref=e142] [cursor=pointer]
      - button "Video" [ref=e143] [cursor=pointer]
      - button "Prompt" [ref=e144] [cursor=pointer]
      - button "Generate" [ref=e146] [cursor=pointer]:
        - text: Generate
        - img [ref=e147]
      - button "Output" [ref=e149] [cursor=pointer]
      - button "All nodes" [ref=e151] [cursor=pointer]:
        - text: All nodes
        - img [ref=e152]
      - button "All models" [ref=e155] [cursor=pointer]
      - button "Auto-layout" [ref=e157] [cursor=pointer]:
        - img [ref=e158]
      - button "Fit view" [ref=e161] [cursor=pointer]:
        - img [ref=e162]
      - generic [ref=e165]:
        - button "Run" [ref=e166] [cursor=pointer]:
          - img [ref=e167]
          - text: Run
        - button "Run options" [ref=e169] [cursor=pointer]:
          - img [ref=e170]
    - generic [ref=e173]:
      - generic [ref=e174]:
        - button "Zoom Out" [ref=e175] [cursor=pointer]:
          - img [ref=e176]
        - button "200%" [ref=e178] [cursor=pointer]:
          - generic [ref=e179]: 200%
          - img [ref=e180]
        - button "Zoom In" [ref=e182] [cursor=pointer]:
          - img [ref=e183]
      - img "Mini Map" [ref=e187]
    - button "Take Snapshot (Cmd/Ctrl+Shift+S)" [ref=e191] [cursor=pointer]:
      - img [ref=e192]
    - application [ref=e195]:
      - generic [ref=e197] [cursor=pointer]:
        - generic:
          - generic:
            - group [ref=e198]:
              - generic [ref=e199]:
                - generic [ref=e200]:
                  - generic [ref=e201]:
                    - img [ref=e202]
                    - heading "Asset" [level=3] [ref=e204]
                  - generic [ref=e205]: 0 images
                - img [ref=e208]
                - generic [ref=e210]:
                  - button "Update Asset" [ref=e211]
                  - button "Use images in Chat" [ref=e212]:
                    - img [ref=e213]
            - group [ref=e217]:
              - status "Loading node component" [ref=e218]
      - img
      - link "React Flow attribution" [ref=e252] [cursor=pointer]:
        - /url: https://reactflow.dev
        - text: React Flow
    - generic [ref=e254]:
      - generic "You" [ref=e256]: 👤
      - generic [ref=e257]: 1 collaborator online
    - button "Close chat" [ref=e258] [cursor=pointer]:
      - img [ref=e262]
    - generic [ref=e265]:
      - generic [ref=e266]:
        - generic [ref=e269]: AI Assistant
        - generic [ref=e270]:
          - button "Start new conversation" [ref=e271] [cursor=pointer]:
            - img [ref=e272]
          - button "Toggle Import/Export options" [ref=e273] [cursor=pointer]:
            - img [ref=e274]
          - button "Close chat" [ref=e278] [cursor=pointer]:
            - img [ref=e279]
      - generic [ref=e283]:
        - img [ref=e285]
        - heading "Welcome to the AI Workflow Builder" [level=3] [ref=e287]
        - paragraph [ref=e288]: Describe what you'd like to create, and I'll generate a complete node-based workflow for you.
        - generic [ref=e289]:
          - button "Image Beauty-Retouche" [ref=e290] [cursor=pointer]:
            - img [ref=e292]
            - generic [ref=e295]: Image Beauty-Retouche
          - button "Video Color-Correction Workflow" [ref=e296] [cursor=pointer]:
            - img [ref=e298]
            - generic [ref=e300]: Video Color-Correction Workflow
      - generic [ref=e302]:
        - textbox "Chat input message" [ref=e303]:
          - /placeholder: Describe what you want to create…
        - generic [ref=e304]:
          - button "Attach context image" [ref=e305] [cursor=pointer]:
            - img [ref=e306]
          - button "Take picture" [ref=e310] [cursor=pointer]:
            - img [ref=e311]
          - button "Pick from assets" [ref=e315] [cursor=pointer]:
            - img [ref=e316]
          - button "9:16" [ref=e320] [cursor=pointer]:
            - img [ref=e321]
            - generic [ref=e323]: 9:16
            - img [ref=e324]
          - button "3s" [ref=e327] [cursor=pointer]:
            - img [ref=e328]
            - generic [ref=e331]: 3s
            - img [ref=e332]
          - button "Send message" [disabled] [ref=e334]:
            - img [ref=e335]
          - button "Generate workflow" [disabled] [ref=e337]:
            - img [ref=e338]
  - button "Untitled" [ref=e342] [cursor=pointer]:
    - img [ref=e343]
    - generic [ref=e348]: Untitled
    - img [ref=e349]
```

# Test source

```ts
  1  | import { test, expect } from './fixtures.js';
  2  | 
  3  | const nodeTypesToTest = [
  4  |   'textNode', 'imageNode', 'assetNode', 'sourceMediaNode',
  5  |   'imageAnalyzer', 'generator', 'creativeUpscale', 'precisionUpscale',
  6  |   'relight', 'styleTransfer', 'removeBackground', 'fluxReimagine',
  7  |   'fluxImageExpand', 'seedreamExpand', 'ideogramExpand', 'skinEnhancer',
  8  |   'ideogramInpaint', 'changeCamera', 'kling3', 'kling3Omni',
  9  |   'kling3Motion', 'klingElementsPro', 'klingO1', 'minimaxLive',
  10 |   'wan26', 'seedance', 'ltxVideo2Pro', 'runwayGen45',
  11 |   'runwayGen4Turbo', 'runwayActTwo', 'pixVerseV5',
  12 |   'pixVerseV5Transition', 'omniHuman', 'vfx', 'creativeVideoUpscale',
  13 |   'precisionVideoUpscale', 'textToIcon', 'universalGeneratorImage',
  14 |   'quiverTextToVector', 'quiverImageToVector', 'universalGeneratorVideo',
  15 |   'musicGeneration', 'soundEffects', 'audioIsolation', 'voiceover',
  16 |   'layerEditor', 'routerNode', 'comment', 'groupEditing', 'facialEditing',
  17 |   'imageOutput', 'videoOutput', 'soundOutput'
  18 | ];
  19 | 
  20 | test('can instantiate all node types via search menu', async ({ editorPage: page }) => {
  21 |   test.setTimeout(300000); 
  22 |   const flowWrapper = page.locator('.react-flow').first();
  23 | 
  24 |   for (const type of nodeTypesToTest) {
  25 |     const searchInput = page.locator('.ms-search-input-overlay');
  26 |     
  27 |     await page.evaluate(() => { window.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' })); });
  28 |     await searchInput.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
  29 |     
  30 |     if (await searchInput.isVisible()) {
  31 |       await searchInput.fill(type);
  32 |       await page.waitForTimeout(50);
  33 |       
  34 |       const clicked = await page.evaluate(() => {
  35 |         const btn = document.querySelector('.ms-node-list button.ms-node-btn');
  36 |         if (btn) { btn.click(); return true; }
  37 |         return false;
  38 |       });
  39 |       
  40 |       if (clicked) {
  41 |         await expect(flowWrapper).toBeVisible({ timeout: 5000 });
  42 |       } else {
  43 |         await page.keyboard.press('Escape');
  44 |       }
  45 |     }
  46 |   }
  47 | });
  48 | 
  49 | test('TextElementNode - can double click, type, and blur', async ({ editorPage: page }) => {
  50 |   await page.evaluate(() => { window.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' })); });
  51 |   const searchInput = page.locator('.ms-search-input-overlay');
  52 |   await searchInput.waitFor({ state: 'visible', timeout: 5000 });
  53 |   await searchInput.fill('textNode');
  54 |   await page.waitForTimeout(100);
  55 |   await page.evaluate(() => document.querySelector('.ms-node-list button.ms-node-btn')?.click());
  56 |   
  57 |   await page.keyboard.press('Escape');
  58 |   
  59 |   const textNode = page.locator('.react-flow__node-textNode').first();
  60 |   await expect(textNode).toBeVisible({ timeout: 10000 });
  61 | 
  62 |   await textNode.dblclick({ force: true });
  63 |   
  64 |   const textContent = page.locator('.react-flow__node-textNode [contenteditable="true"], .react-flow__node-textNode textarea').first();
> 65 |   await expect(textContent).toBeVisible({ timeout: 5000 });
     |                             ^ Error: expect(locator).toBeVisible() failed
  66 |   await textContent.fill('Hello World from E2E');
  67 | 
  68 |   await page.locator('.react-flow__pane').click({ force: true });
  69 | 
  70 |   await expect(textNode).toContainText('Hello World from E2E', { timeout: 5000 });
  71 | });
  72 | 
  73 | test('AssetNode - can create and has properties', async ({ editorPage: page }) => {
  74 |   await page.evaluate(() => { window.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' })); });
  75 |   const searchInput = page.locator('.ms-search-input-overlay');
  76 |   await searchInput.waitFor({ state: 'visible', timeout: 5000 });
  77 |   await searchInput.fill('assetNode');
  78 |   await page.waitForTimeout(100);
  79 |   await page.evaluate(() => document.querySelector('.ms-node-list button.ms-node-btn')?.click());
  80 | 
  81 |   await page.keyboard.press('Escape');
  82 | 
  83 |   const assetNode = page.locator('.react-flow__node-assetNode').first();
  84 |   await expect(assetNode).toBeVisible({ timeout: 10000 });
  85 |   
  86 |   await expect(assetNode.locator('text=Upload Media')).toBeVisible({ timeout: 5000 });
  87 | });
  88 | 
```