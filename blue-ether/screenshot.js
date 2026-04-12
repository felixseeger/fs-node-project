import { chromium } from 'playwright';
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  try {
    await page.goto('http://localhost:6007/?path=/settings/guide');
    await new Promise(r => setTimeout(r, 5000));
    await page.screenshot({ path: 'storybook2.png' });
    console.log("Screenshot 2 saved.");
  } catch (e) {
    console.error(e);
  }
  await browser.close();
})();
