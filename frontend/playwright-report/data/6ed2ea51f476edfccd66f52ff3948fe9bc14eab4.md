# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: mega-menu.spec.js >> Mega Menu >> All Models mega menu creates new nodes on canvas
- Location: tests/e2e/mega-menu.spec.js:4:3

# Error details

```
Error: expect(locator).toContainText(expected) failed

Locator: locator('.react-flow__node-universalGeneratorImage').last()
Expected substring: "Nano Banana 2"
Received string:    "Universal ImageImage inputoptionalClick or drop image0/5000DescribeImproveOutputGeneration OutputOutput image will appear here"
Timeout: 10000ms

Call log:
  - Expect "toContainText" with timeout 10000ms
  - waiting for locator('.react-flow__node-universalGeneratorImage').last()
    14 × locator resolved to <div tabindex="0" role="group" aria-roledescription="node" data-id="node_1776079761976_faqg6ypff" aria-describedby="react-flow__node-desc-1" data-testid="rf__node-node_1776079761976_faqg6ypff" class="react-flow__node react-flow__node-universalGeneratorImage nopan selectable draggable">…</div>
       - unexpected value "Universal ImageImage inputoptionalClick or drop image0/5000DescribeImproveOutputGeneration OutputOutput image will appear here"

```

# Page snapshot

```yaml
- generic [ref=e1]:
  - generic [ref=e4]:
    - generic [ref=e5]:
      - generic [ref=e6]:
        - button "Logo Nodespace" [ref=e8] [cursor=pointer]:
          - generic [ref=e9]:
            - img "Logo" [ref=e10]
            - generic [ref=e11]: Nodespace
          - img [ref=e12]
        - generic [ref=e14]: /
        - generic [ref=e15]: Board 04
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
          - text: "100"
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
          - button "Zoom Out" [ref=e175] [cursor=pointer]
          - button "200%" [ref=e177] [cursor=pointer]:
            - generic [ref=e178]: 200%
            - img [ref=e179]
          - button "Zoom In" [ref=e181] [cursor=pointer]:
            - img [ref=e182]
        - img "Mini Map" [ref=e186]
      - button "Take Snapshot (Cmd/Ctrl+Shift+S)" [ref=e189] [cursor=pointer]:
        - img [ref=e190]
      - application [ref=e193]:
        - group [active] [ref=e196]:
          - generic [ref=e197]:
            - generic [ref=e198]:
              - button "Universal Image" [ref=e200]
              - generic [ref=e201]:
                - button "Lock settings" [ref=e202] [cursor=pointer]:
                  - img [ref=e203]
                - button "Download" [disabled] [ref=e206]:
                  - img [ref=e207]
            - generic [ref=e210]:
              - generic [ref=e214]:
                - generic [ref=e215] [cursor=pointer]:
                  - generic [ref=e216]:
                    - img [ref=e217]
                    - generic [ref=e221]: Image input
                    - generic [ref=e222]: optional
                  - generic [ref=e224]:
                    - img [ref=e225]
                    - generic [ref=e228]: Click or drop image
                - generic [ref=e229]:
                  - generic [ref=e230]:
                    - textbox "e.g. A cinematic shot of a neon cyberpunk city..." [ref=e231]
                    - generic [ref=e232]: 0/5000
                  - generic [ref=e233]:
                    - button "Reference (@)" [ref=e235] [cursor=pointer]:
                      - img [ref=e236]
                    - generic [ref=e239]:
                      - button "Describe" [disabled] [ref=e240]:
                        - img [ref=e241]
                        - text: Describe
                      - button "Improve" [disabled] [ref=e245]:
                        - img [ref=e246]
                        - text: Improve
                      - button [ref=e249] [cursor=pointer]:
                        - img [ref=e250]
              - generic [ref=e252]:
                - generic [ref=e254]: Output
                - generic [ref=e259]: Generation Output
                - generic [ref=e261]: Output image will appear here
        - img
        - link "React Flow attribution" [ref=e263] [cursor=pointer]:
          - /url: https://reactflow.dev
          - text: React Flow
      - generic [ref=e265]:
        - generic "You" [ref=e267]: 👤
        - generic [ref=e268]: 1 collaborator online
      - button "Close chat" [ref=e269] [cursor=pointer]:
        - img [ref=e273]
      - generic [ref=e276]:
        - generic [ref=e277]:
          - generic [ref=e280]: AI Assistant
          - generic [ref=e281]:
            - button "Start new conversation" [ref=e282] [cursor=pointer]:
              - img [ref=e283]
            - button "Toggle Import/Export options" [ref=e284] [cursor=pointer]:
              - img [ref=e285]
            - button "Close chat" [ref=e289] [cursor=pointer]:
              - img [ref=e290]
        - generic [ref=e294]:
          - img [ref=e296]
          - heading "Welcome to the AI Workflow Builder" [level=3] [ref=e298]
          - paragraph [ref=e299]: Describe what you'd like to create, and I'll generate a complete node-based workflow for you.
          - generic [ref=e300]:
            - button "Image Beauty-Retouche" [ref=e301] [cursor=pointer]:
              - img [ref=e303]
              - generic [ref=e306]: Image Beauty-Retouche
            - button "Video Color-Correction Workflow" [ref=e307] [cursor=pointer]:
              - img [ref=e309]
              - generic [ref=e311]: Video Color-Correction Workflow
        - generic [ref=e313]:
          - textbox "Chat input message" [ref=e314]:
            - /placeholder: Describe what you want to create…
          - generic [ref=e315]:
            - button "Attach context image" [ref=e316] [cursor=pointer]:
              - img [ref=e317]
            - button "Take picture" [ref=e321] [cursor=pointer]:
              - img [ref=e322]
            - button "Pick from assets" [ref=e326] [cursor=pointer]:
              - img [ref=e327]
            - button "9:16" [ref=e331] [cursor=pointer]:
              - img [ref=e332]
              - generic [ref=e334]: 9:16
              - img [ref=e335]
            - button "3s" [ref=e338] [cursor=pointer]:
              - img [ref=e339]
              - generic [ref=e342]: 3s
              - img [ref=e343]
            - button "Send message" [disabled] [ref=e345]:
              - img [ref=e346]
            - button "Generate workflow" [disabled] [ref=e348]:
              - img [ref=e349]
    - button "Board 04" [ref=e353] [cursor=pointer]:
      - img [ref=e354]
      - generic [ref=e359]: Board 04
      - img [ref=e360]
  - generic [ref=e362]:
    - generic [ref=e363]:
      - heading "Welcome to FS Node Project!" [level=3] [ref=e364]
      - generic [ref=e365]: 1 of 6
    - paragraph [ref=e366]: This is a visual workspace for building AI pipelines. Let's take a quick tour to help you get started.
    - generic [ref=e367]:
      - button "Skip Tour" [ref=e368] [cursor=pointer]
      - button "Next" [ref=e370] [cursor=pointer]
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Mega Menu', () => {
  4  |   test('All Models mega menu creates new nodes on canvas', async ({ page }) => {
  5  |     test.setTimeout(120000);
  6  |     
  7  |     await page.goto('http://localhost:5173');
  8  |     await page.waitForTimeout(2000);
  9  |     
  10 |     const desktopLogin = page.locator('.desktop-nav-login').first();
  11 |     try {
  12 |       await desktopLogin.waitFor({ state: 'visible', timeout: 2000 });
  13 |       await desktopLogin.click({ force: true });
  14 |       await page.waitForTimeout(2000);
  15 |     } catch(e) {}
  16 |     
  17 |     const emailInput = page.locator('input[placeholder="you@example.com"]');
  18 |     try {
  19 |       await emailInput.waitFor({ state: 'visible', timeout: 2000 });
  20 |       await page.fill('input[placeholder="you@example.com"]', 'testuser@nodeproject.dev');
  21 |       await page.fill('input[type="password"]', 'TestPass123!');
  22 |       await page.getByRole('button', { name: /Sign In|Log In/i }).first().click();
  23 |     } catch(e) {}
  24 | 
  25 |     const slpBtn = page.locator('.slp-ready').first();
  26 |     try {
  27 |       await slpBtn.waitFor({ state: 'visible', timeout: 25000 });
  28 |       await slpBtn.click({ force: true });
  29 |     } catch(e) {}
  30 |     
  31 |     await page.waitForTimeout(3000);
  32 | 
  33 |     const newProjBtn = page.getByTestId('new-project-btn').first();
  34 |     try {
  35 |       await newProjBtn.waitFor({ state: 'visible', timeout: 5000 });
  36 |       await newProjBtn.click({ force: true });
  37 |       
  38 |       const confirmBtn = page.getByTestId('new-project-modal-confirm-new').first();
  39 |       await confirmBtn.waitFor({ state: 'visible', timeout: 5000 });
  40 |       await confirmBtn.click({ force: true });
  41 |     } catch(e) {}
  42 |     
  43 |     await expect(page.locator('.react-flow').first()).toBeVisible({ timeout: 15000 });
  44 |     
  45 |     // Dismiss tour or assistant popups if any
  46 |     await page.evaluate(() => {
  47 |        document.querySelectorAll('[role="dialog"], .ms-modal-backdrop, .fixed.inset-0').forEach(el => {
  48 |          if (el.innerText.includes('Welcome') || el.innerText.includes('Tour') || el.innerText.includes('AI Assistant')) {
  49 |             el.remove();
  50 |          }
  51 |        });
  52 |     });
  53 | 
  54 |     const getNodesCount = async () => {
  55 |       const imgNodes = await page.locator('.react-flow__node-universalGeneratorImage').count();
  56 |       const vidNodes = await page.locator('.react-flow__node-universalGeneratorVideo').count();
  57 |       return imgNodes + vidNodes;
  58 |     };
  59 | 
  60 |     const initialCount = await getNodesCount();
  61 |     
  62 |     // 1. Click "All models" button
  63 |     const allModelsBtn = page.getByRole('button', { name: /All models/i }).first();
  64 |     await allModelsBtn.waitFor({ state: 'visible' });
  65 |     await allModelsBtn.click({ force: true });
  66 |     
  67 |     // 2. Wait for the Mega Menu portal to be visible
  68 |     const searchInput = page.getByPlaceholder(/Search models/i).first();
  69 |     await searchInput.waitFor({ state: 'visible', timeout: 5000 });
  70 | 
  71 |     // 3. Search for a specific model
  72 |     await searchInput.fill('Nano Banana 2');
  73 |     await page.waitForTimeout(500);
  74 |     
  75 |     // Click the button containing "Nano Banana 2"
  76 |     const modelButton = page.getByRole('button', { name: /Nano Banana 2/i }).first();
  77 |     await modelButton.waitFor({ state: 'visible', timeout: 5000 });
  78 |     await modelButton.click({ force: true });
  79 | 
  80 |     // 4. Verify a new node was created
  81 |     await page.waitForTimeout(1000);
  82 | 
  83 |     const newCount = await getNodesCount();
  84 |     expect(newCount).toBeGreaterThan(initialCount);
  85 | 
  86 |     const newImageNode = page.locator('.react-flow__node-universalGeneratorImage').last();
  87 |     await expect(newImageNode).toBeVisible();
> 88 |     await expect(newImageNode).toContainText('Nano Banana 2');
     |                                ^ Error: expect(locator).toContainText(expected) failed
  89 |   });
  90 | });
  91 | 
```