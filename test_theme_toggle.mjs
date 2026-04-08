import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.goto('http://localhost:5173/');
  
  // Wait for the page to load
  await page.waitForTimeout(2000);
  
  // Click ThemeToggle on DesktopNavbar
  // It is a button with title="Switch to light mode" or "Switch to dark mode"
  const themeToggle = page.locator('button[title*="Switch to"]');
  
  const initialTheme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
  console.log('Initial theme:', initialTheme);
  
  // Try to click it
  try {
    await themeToggle.click({ timeout: 2000 });
    const newTheme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    console.log('New theme after click:', newTheme);
  } catch (e) {
    console.log('Failed to click:', e.message);
  }

  await browser.close();
})();
