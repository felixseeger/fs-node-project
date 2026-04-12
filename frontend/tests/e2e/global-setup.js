import { chromium } from '@playwright/test';

export default async function globalSetup(config) {
  const { baseURL, storageState } = config.projects[0].use;
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    // Skip SLP
    await page.addInitScript(() => {
      sessionStorage.setItem('slp_shown', '1');
    });

    await page.goto(baseURL);
    await page.waitForTimeout(1000);
    
    let html = await page.content();
    if (html.includes('Log in') && !html.includes('Email Address')) {
      await page.click('text=Log in');
    }
    
    await page.waitForTimeout(1000);
    html = await page.content();
    
    if (html.includes('Sign in') || html.includes('Welcome Back') || html.includes('Create your account')) {
      const testEmail = process.env.TEST_USER_EMAIL || 'testuser@nodeproject.dev';
      const testPassword = process.env.TEST_USER_PASSWORD || 'TestPass123!';
      
      // If we are on Sign Up, switch to Sign In
      if (html.includes('Create your account')) {
        try {
          await page.click('text=Sign in', { timeout: 2000 });
          await page.waitForTimeout(1000);
        } catch(e) { /* ignore */ }
      }
      
      // Fill the login form
      await page.fill('input[placeholder="you@example.com"]', testEmail);
      await page.fill('input[type="password"]', testPassword);
      
      await page.click('button:has-text("Sign In"), button:has-text("Log in")');
      
      // Wait for dashboard to ensure auth cookies are written
      await page.getByTestId('new-project-btn').waitFor({ state: 'visible', timeout: 15000 });
    }
    
    // Save storage state into the file specified in config
    await page.context().storageState({ path: storageState });
    console.log('✅ Global auth setup complete');
  } catch (err) {
    console.error('❌ Failed global setup:', err.message);
    throw err;
  } finally {
    await browser.close();
  }
}