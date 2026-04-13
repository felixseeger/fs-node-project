import { test as base, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

let creds;
try {
  creds = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'test-credentials.json'), 'utf8'));
} catch (e) {
  creds = { email: 'test@example.com', password: 'password123' };
}

export const test = base.extend({
  page: async ({ page }, use) => {
    await page.goto('/');
    
    // Check for login
    await page.waitForTimeout(1000);
    const desktopLogin = page.locator('.desktop-nav-login').first();
    if (await desktopLogin.isVisible({ timeout: 1000 }).catch(() => false)) {
      await desktopLogin.click({ force: true }).catch(() => {});
      await page.waitForTimeout(1000);
    } else if (await page.locator('text=Log in').isVisible()) {
      await page.click('text=Log in').catch(() => {});
      await page.waitForTimeout(1000);
    }
    
    if (await page.locator('input[placeholder="you@example.com"]').isVisible()) {
      await page.fill('input[placeholder="you@example.com"]', creds.email);
      await page.fill('input[type="password"]', creds.password);
      await page.click('button[type="submit"]').catch(() => page.click('button:has-text("Sign In")'));
    }
    
    // Aggressive Modal & SLP Cleanup
    try {
      console.log('Purging onboarding...');
      await page.waitForTimeout(5000);
      
      // Inject script to permanently kill tour and SLP state
      await page.addInitScript(() => {
        window.localStorage.setItem('fs_node_tour_completed', 'true');
        window.localStorage.setItem('slp_shown', 'true');
      });

      // Clear existing UI blockers
      await page.evaluate(() => {
        const kill = () => {
          // Find all divs that might be overlays/modals
          const divs = Array.from(document.querySelectorAll('div'));
          divs.forEach(div => {
             if (div.innerText.includes('Welcome') || div.innerText.includes('Tour')) {
                div.remove();
             }
          });
          
          document.querySelectorAll('[role="dialog"], .ms-modal-backdrop, .fixed.inset-0').forEach(el => {
            el.remove();
          });
          
          const root = document.querySelector('#root');
          if (root) {
            root.style.filter = 'none';
            root.style.opacity = '1';
            root.style.pointerEvents = 'auto';
          }
          document.body.style.overflow = 'auto';
        };
        kill();
        // Keep killing for a few seconds
        const interval = setInterval(kill, 500);
        setTimeout(() => clearInterval(interval), 10000);
      });

      const slpBtn = page.locator('.slp-ready').first();
      if (await slpBtn.isVisible()) await slpBtn.click({ force: true });

    } catch(e) {
      // Ignore errors during tour dismissal
    }
    
    await page.getByTestId('new-project-btn').waitFor({ state: 'visible', timeout: 30000 });
    await use(page);
  },
  
  editorPage: async ({ page }, use) => {
    await page.getByTestId('new-project-btn').first().click({ force: true });
    
    const confirmBtn = page.getByTestId('new-project-modal-confirm-new').first();
    await confirmBtn.waitFor({ state: 'visible', timeout: 5000 });
    await confirmBtn.click({ force: true });
    
    // Ensure the AI Assistant / Tour doesn't block the editor
    await page.waitForTimeout(5000);
    await page.evaluate(() => {
       const kill = () => {
         document.querySelectorAll('[role="dialog"], .ms-modal-backdrop, .fixed.inset-0').forEach(el => {
           if (el.innerText.includes('Welcome') || el.innerText.includes('Tour') || el.innerText.includes('AI Assistant')) {
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
       const interval = setInterval(kill, 500);
       setTimeout(() => clearInterval(interval), 5000);
    });

    await expect(page.locator('.react-flow').first()).toBeVisible({ timeout: 15000 });
    await use(page);
  }
});

export { expect };
