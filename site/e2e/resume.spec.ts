import { test, expect } from '@playwright/test';

test.describe('Resume Resume Functionality', () => {
  
  test('default resume loads leadership content', async ({ page }) => {
    await page.goto('/resume');
    
    // Check URL
    await expect(page).toHaveURL(/\/resume\/?$/);
    
    // Check for specific "Leader" content
    await expect(page.locator('h1')).toContainText('Brian Anderson');
    await expect(page.locator('body')).toContainText('Strategic technology leader'); 
    await expect(page.locator('body')).toContainText('Leadership & Strategy');
    
    // Check switcher is present
    await expect(page.locator('a:has-text("./leader")')).toBeVisible();
    await expect(page.locator('a:has-text("./platform")')).toBeVisible();
    await expect(page.locator('a:has-text("./builder")')).toBeVisible();
  });

  test('switching to platform variant works', async ({ page }) => {
    await page.goto('/resume');
    
    // Click the platform toggle
    await page.click('a:has-text("./platform")');
    
    // Verify URL
    await expect(page).toHaveURL(/\/resume\/platform/);
    
    // Verify Platform specific content
    await expect(page.locator('body')).toContainText('Platform Engineering');
    await expect(page.locator('body')).toContainText('Reliability & Observability');
  });

  test('switching to builder variant works', async ({ page }) => {
    await page.goto('/resume');
    
    // Click the builder toggle
    await page.click('a:has-text("./builder")');
    
    // Verify URL
    await expect(page).toHaveURL(/\/resume\/builder/);
    
    // Verify Builder specific content
    await expect(page.locator('body')).toContainText('Product-focused engineering leader');
    await expect(page.locator('body')).toContainText('Web & Mobile Frameworks');
  });

  test('direct navigation to variants works', async ({ page }) => {
    // Navigate directly to platform
    await page.goto('/resume/platform');
    await expect(page.locator('body')).toContainText('Platform Engineering');
    
    // Navigate directly to builder
    await page.goto('/resume/builder');
    await expect(page.locator('body')).toContainText('Product-focused engineering leader');
  });
  
  test('variant switcher highlights active state', async ({ page }) => {
    await page.goto('/resume/platform');
    
    // Check that platform link has the active class (bg-skin-accent)
    // We can check for the class presence. Note: Playwright class assertions can be tricky if strict.
    // Using CSS locator for the active style.
    const platformLink = page.locator('a:has-text("./platform")');
    await expect(platformLink).toHaveClass(/bg-skin-accent/);
    
    const leaderLink = page.locator('a:has-text("./leader")');
    await expect(leaderLink).not.toHaveClass(/bg-skin-accent/);
  });

  test('print button triggers window.print', async ({ page }) => {
    await page.goto('/resume');
    
    // Mock window.print to log to console
    await page.evaluate(() => {
      window.print = () => console.log('PRINT_CALLED');
    });
    
    // Set up a listener for the console message
    const consolePromise = page.waitForEvent('console', msg => msg.text() === 'PRINT_CALLED');
    
    // Click the print button (the one in the header)
    await page.locator('button:has-text("Print")').first().click();
    
    // Wait for the message to appear
    await consolePromise;
  });
});
