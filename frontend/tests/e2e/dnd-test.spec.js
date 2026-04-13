import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

test('drag and drop image', async ({ page }) => {
  await page.goto('http://localhost:5173');
  
  // Create a dummy image
  const buffer = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', 'base64');
  
  // We need to inject the drop event to the canvas
  await page.evaluate(async (base64) => {
    const dataUrl = `data:image/png;base64,${base64}`;
    const res = await fetch(dataUrl);
    const blob = await res.blob();
    const file = new File([blob], 'test.png', { type: 'image/png' });
    
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);
    
    // Find the canvas container
    const canvas = document.querySelector('.react-flow__pane');
    if (!canvas) throw new Error('Canvas not found');
    
    const dropEvent = new DragEvent('drop', {
      dataTransfer,
      bubbles: true,
      cancelable: true,
      clientX: 500,
      clientY: 500
    });
    canvas.dispatchEvent(dropEvent);
  }, buffer.toString('base64'));
  
  // Wait a bit to see if imageElement node appears
  await page.waitForTimeout(2000);
});
