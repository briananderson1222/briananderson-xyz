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
    
    // Check that platform link has active state via aria-current
    const platformLink = page.locator('a:has-text("./platform")');
    await expect(platformLink).toHaveAttribute('aria-current', 'page');
    
    const leaderLink = page.locator('a:has-text("./leader")');
    await expect(leaderLink).not.toHaveAttribute('aria-current', 'page');
  });

  test('direct navigation to each variant loads correct content', async ({ page }) => {
    // Test default resume
    await page.goto('/resume/');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/\/resume\/?$/);
    await expect(page.locator('body')).toContainText('Strategic technology leader');
    
    // Test platform variant
    await page.goto('/resume/platform/');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('body')).toContainText('Reliability & Observability');
    await expect(page.locator('body')).not.toContainText('Strategic technology leader');
    
    // Test builder variant
    await page.goto('/resume/builder/');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('body')).toContainText('Product-focused engineering leader');
    await expect(page.locator('body')).not.toContainText('Platform Engineering');
  });

  test('print button triggers window.print', async ({ page }) => {
    await page.goto('/resume');
    
    // Set up a promise in the browser context that resolves when print is called
    const printCalledPromise = page.evaluate(() => {
      return new Promise((resolve) => {
        window.print = () => {
          resolve(true);
        };
      });
    });

    // Click the print button (the one in the header)
    await page.getByRole('button', { name: /Print/i }).first().click();
    
    // Wait for the promise to resolve, indicating print was called
    const result = await printCalledPromise;
    expect(result).toBe(true);
  });
});
