import { test as base, expect } from '@playwright/test';

export const test = base.extend({
  page: async ({ page }, use) => {
    await page.goto('/');
    
    // Set localStorage / sessionStorage early
    await page.evaluate(() => {
      window.localStorage.setItem('fs_node_tour_completed', 'true');
      window.sessionStorage.setItem('slp_shown', '1');
    });

    // Give Firebase time to initialize
    await page.waitForTimeout(3000);
    
    if (await page.locator('text="Log in"').isVisible()) {
      await page.click('text="Log in"');
      await page.waitForTimeout(2000);
    }
    
    if (await page.locator('input[placeholder="you@example.com"]').isVisible()) {
      await page.fill('input[placeholder="you@example.com"]', 'verwaltung@felixseeger.de');
      await page.fill('input[type="password"]', 'TestPass123!');
      await page.click('button:has-text("Sign In"), button[type="submit"]');
      await page.waitForTimeout(3000);
    }
    
    // Wait for EITHER the dashboard or the editor to load
    await Promise.any([
      page.getByTestId('new-project-btn').waitFor({ state: 'visible', timeout: 15000 }),
      page.locator('.react-flow').first().waitFor({ state: 'visible', timeout: 15000 })
    ]).catch((err) => console.log('Timeout waiting for page to load: ', err));
    
    await use(page);
  },
  
  editorPage: async ({ page }, use) => {
    const isEditorVisible = await page.locator('.react-flow').first().isVisible();
    
    if (!isEditorVisible) {
      let btn = page.getByTestId('new-project-btn').first();
      if (await btn.isVisible()) {
        await btn.click({ force: true }).catch(() => {});
      }
      
      let confirmBtn = page.getByTestId('new-project-modal-confirm-new').first();
      await confirmBtn.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
      if (await confirmBtn.isVisible()) {
        await confirmBtn.click({ force: true });
      }
    }
    
    await expect(page.locator('.react-flow').first()).toBeVisible({ timeout: 15000 });

    // Kill overlays inside editor
    await page.evaluate(() => {
       const kill = () => {
         document.querySelectorAll('[role="dialog"], .ms-modal-backdrop, .fixed.inset-0').forEach(el => {
           if (el.innerText && (el.innerText.includes('Welcome') || el.innerText.includes('Tour') || el.innerText.includes('AI Assistant'))) {
              el.remove();
           }
         });
         const root = document.querySelector('#root');
         if (root) {
           root.style.filter = 'none';
           root.style.pointerEvents = 'auto';
         }
       };
       kill();
       setTimeout(kill, 2000);
    });

    // Clear the canvas
    await page.locator('.react-flow__pane').click({ force: true });
    await page.keyboard.press('Control+A');
    await page.keyboard.press('Meta+A');
    await page.waitForTimeout(100);
    await page.keyboard.press('Backspace');
    await page.keyboard.press('Delete');
    await page.waitForTimeout(500);

    await use(page);
  }
});

export { expect };
