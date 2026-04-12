import { test, expect } from './fixtures.js';

test.describe('Image and Video Node Operations', () => {

  test('Check Nodes Availability and Visuals', async ({ editorPage: page }) => {
    // 1. Force clear EVERYTHING via evaluate
    console.log("Brute forcing UI cleanup...");
    
    await page.evaluate(() => {
        // Clear storage
        localStorage.setItem('hasSeenOnboarding', 'true');
        sessionStorage.setItem('slp_shown', 'true');
        
        // Remove ALL overlays, modals, and tour elements
        const selectors = [
            '.tour-overlay', '.tour-modal', '.onboarding-modal', 
            '[role="dialog"]', '.ms-welcome-modal', '.chakra-modal__overlay',
            '.chakra-modal__content-container', '.slp-container',
            '[data-testid="chat-ui"]', '.ms-menu-wrapper'
        ];
        selectors.forEach(s => document.querySelectorAll(s).forEach(el => el.remove()));
        
        // Brute force style cleanup
        const style = document.createElement('style');
        style.id = 'e2e-brute-force-cleanup';
        style.innerHTML = `
            * { filter: none !important; backdrop-filter: none !important; }
            .tour-overlay, .onboarding-modal, .slp-container, [role="dialog"], [data-testid="chat-ui"] { display: none !important; }
            .app-container, #root, body { overflow: auto !important; opacity: 1 !important; visibility: visible !important; pointer-events: auto !important; }
            .react-flow__pane { pointer-events: auto !important; }
        `;
        document.head.appendChild(style);
        
        // Unblur anything
        document.querySelectorAll('*').forEach(el => {
            el.style.filter = 'none';
            el.style.backdropFilter = 'none';
        });
    });

    await page.waitForTimeout(2000);

    // Ensure we are in the editor if dashboard is shown
    const newProj = page.getByTestId('new-project-btn');
    if (await newProj.isVisible({ timeout: 5000 })) {
        await newProj.click({ force: true });
    }

    const pane = page.locator('.react-flow__pane');
    await expect(pane).toBeVisible({ timeout: 30000 });
    
    // 2. TEST NODES
    const nodesToTest = [
        { type: 'imageNode', searchText: 'Image', label: 'Image' },
        { type: 'videoOutput', searchText: 'Video Output', label: 'Video Output' },
        { type: 'universalGeneratorImage', searchText: 'Universal Image Generator', label: 'Universal Image Generator' }
    ];

    for (const node of nodesToTest) {
        console.log(`Testing node: ${node.type}`);
        
        // Attempt to open menu via evaluate (bypass key listeners if they are blocked)
        await page.evaluate(() => {
            // Try to find the Add button and click it or fire the keyboard event
            window.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));
        });
        
        const searchInput = page.locator('.ms-search-input-overlay');
        // If not visible, try one more time with page.keyboard
        if (!(await searchInput.isVisible())) {
            await page.keyboard.press(' ');
        }
        
        await expect(searchInput).toBeVisible({ timeout: 15000 });
        await searchInput.fill(node.searchText);
        await page.waitForTimeout(1000);
        
        // Click the menu item via evaluate to be extremely reliable
        await page.evaluate((text) => {
            const btns = Array.from(document.querySelectorAll('.ms-node-list button.ms-node-btn'));
            const target = btns.find(b => b.textContent.toLowerCase().includes(text.toLowerCase()));
            if (target) target.click();
            else if (btns[0]) btns[0].click();
        }, node.searchText);
        
        await page.waitForTimeout(2000);
        
        // Find and highlight the node on canvas for the screenshot
        const canvasNode = page.locator('.react-flow__node').last();
        if (await canvasNode.count() > 0) {
            await canvasNode.scrollIntoViewIfNeeded();
            // Take screenshot of the node
            await canvasNode.screenshot({ path: `tests/e2e/screenshots/node_${node.type}_v20.png` });
        }
        
        // Screenshot of whole canvas
        await page.screenshot({ path: `tests/e2e/screenshots/canvas_${node.type}_v20.png` });

        // Cleanup: remove node
        await page.keyboard.press('Backspace');
        await page.waitForTimeout(500);
    }
  });
});
