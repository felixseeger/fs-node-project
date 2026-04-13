# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: nodes.spec.js >> AssetNode - can create and has properties
- Location: tests/e2e/nodes.spec.js:73:1

# Error details

```
TimeoutError: locator.waitFor: Timeout 15000ms exceeded.
Call log:
  - waiting for getByTestId('new-project-btn') to be visible

```

# Page snapshot

```yaml
- generic [ref=e4]:
  - generic [ref=e5]:
    - button "Logo" [ref=e7] [cursor=pointer]:
      - img "Logo" [ref=e8]
    - heading "Welcome back" [level=2] [ref=e9]
    - paragraph [ref=e10]: Sign in to your account to continue
    - generic [ref=e11]:
      - generic [ref=e12]:
        - generic [ref=e13]: Email
        - textbox "you@example.com" [ref=e15]: verwaltung@felixseeger.de
      - generic [ref=e16]:
        - generic [ref=e17]: Password
        - generic [ref=e18]:
          - textbox "Your password" [ref=e19]: TestPass123!
          - button "Show" [ref=e20] [cursor=pointer]
      - generic [ref=e21]: Error (auth/too-many-requests).
      - button "Forgot password?" [ref=e23] [cursor=pointer]
      - button "Sign In" [ref=e24] [cursor=pointer]
    - generic [ref=e27]: or continue with
    - generic [ref=e29]:
      - button "G Google" [ref=e30] [cursor=pointer]:
        - generic [ref=e31]: G
        - text: Google
      - button "☍ GitHub" [ref=e32] [cursor=pointer]:
        - generic [ref=e33]: ☍
        - text: GitHub
    - paragraph [ref=e34]:
      - text: Don't have an account?
      - button "Sign up" [ref=e35] [cursor=pointer]
  - generic: Felix Seeger © 2026
```

# Test source

```ts
  1  | import { test as base, expect } from '@playwright/test';
  2  | 
  3  | export const test = base.extend({
  4  |   page: async ({ page }, use) => {
  5  |     await page.goto('/');
  6  |     
  7  |     // Give Firebase time to initialize
  8  |     await page.waitForTimeout(5000);
  9  |     
  10 |     if (await page.locator('text="Log in"').isVisible()) {
  11 |       await page.click('text="Log in"');
  12 |       await page.waitForTimeout(2000);
  13 |     }
  14 |     
  15 |     if (await page.locator('input[placeholder="you@example.com"]').isVisible()) {
  16 |       await page.fill('input[placeholder="you@example.com"]', 'verwaltung@felixseeger.de');
  17 |       await page.fill('input[type="password"]', 'TestPass123!');
  18 |       await page.click('button:has-text("Sign In"), button[type="submit"]');
  19 |       await page.waitForTimeout(5000);
  20 |     }
  21 |     
  22 |     await page.evaluate(() => {
  23 |       window.localStorage.setItem('fs_node_tour_completed', 'true');
  24 |       window.sessionStorage.setItem('slp_shown', '1');
  25 |     });
  26 |     
> 27 |     await page.getByTestId('new-project-btn').waitFor({ state: 'visible', timeout: 15000 });
     |                                               ^ TimeoutError: locator.waitFor: Timeout 15000ms exceeded.
  28 |     await use(page);
  29 |   },
  30 |   
  31 |   editorPage: async ({ page }, use) => {
  32 |     let btn = page.getByTestId('new-project-btn').first();
  33 |     await btn.click({ force: true }).catch(() => {});
  34 |     
  35 |     let confirmBtn = page.getByTestId('new-project-modal-confirm-new').first();
  36 |     await confirmBtn.waitFor({ state: 'visible', timeout: 5000 });
  37 |     await confirmBtn.click({ force: true });
  38 |     
  39 |     await expect(page.locator('.react-flow').first()).toBeVisible({ timeout: 15000 });
  40 | 
  41 |     // Kill overlays again inside editor
  42 |     await page.evaluate(() => {
  43 |        const kill = () => {
  44 |          document.querySelectorAll('[role="dialog"], .ms-modal-backdrop, .fixed.inset-0').forEach(el => {
  45 |            if (el.innerText && (el.innerText.includes('Welcome') || el.innerText.includes('Tour') || el.innerText.includes('AI Assistant'))) {
  46 |               el.remove();
  47 |            }
  48 |          });
  49 |          const root = document.querySelector('#root');
  50 |          if (root) {
  51 |            root.style.filter = 'none';
  52 |            root.style.pointerEvents = 'auto';
  53 |          }
  54 |        };
  55 |        kill();
  56 |        setTimeout(kill, 2000);
  57 |     });
  58 | 
  59 |     await use(page);
  60 |   }
  61 | });
  62 | 
  63 | export { expect };
  64 | 
```