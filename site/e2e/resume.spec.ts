import { test, expect } from '@playwright/test';

test.describe('Resume Resume Functionality', () => {

  test('default resume loads leadership content', async ({ page }) => {
    await page.goto('/resume');

    // Check URL (allow for index.html in static hosting)
    await expect(page).toHaveURL(/\/resume(\/|\/index\.html)?$/);

    // Check for specific "Leader" content in the first (visible) slide
    await expect(page.locator('.resume-slide.current h1').first()).toContainText('Brian Anderson');
    await expect(page.locator('.resume-slide.current').first()).toContainText('Technical Director');

    // Check switcher buttons are present - there should be 3 variant buttons
    const buttons = page.locator('.variant-button');
    await expect(buttons).toHaveCount(3);
  });

  test('switching to platform variant works', async ({ page }) => {
    await page.goto('/resume');

    // Click the platform toggle button (index 1, second button)
    const buttons = page.locator('.variant-button');
    await buttons.nth(1).click();

    // Wait for slide transition
    await page.waitForTimeout(500);

    // Verify URL (allow for index.html in static hosting)
    await expect(page).toHaveURL(/\/resume\/platform(\/|\/index\.html)?$/);

    // Verify Platform specific content in the current slide
    await expect(page.locator('.resume-slide.current')).toContainText('Platform Engineer');
    await expect(page.locator('.resume-slide.current')).toContainText('Reliability & Observability');
  });

  test('switching to builder variant works', async ({ page }) => {
    await page.goto('/resume');

    // Click the builder toggle button (index 2, third button)
    const buttons = page.locator('.variant-button');
    await buttons.nth(2).click();

    // Wait for slide transition
    await page.waitForTimeout(500);

    // Verify URL (allow for index.html in static hosting)
    await expect(page).toHaveURL(/\/resume\/builder(\/|\/index\.html)?$/);

    // Verify Builder specific content in the current slide
    await expect(page.locator('.resume-slide.current')).toContainText('Full-Stack Architect');
    await expect(page.locator('.resume-slide.current')).toContainText('Frontend Frameworks');
  });

  test('direct navigation to variants works', async ({ page }) => {
    // Navigate directly to platform
    await page.goto('/resume/platform');
    await page.waitForTimeout(500);
    await expect(page.locator('.resume-slide.current')).toContainText('Platform Engineer');

    // Navigate directly to builder
    await page.goto('/resume/builder');
    await page.waitForTimeout(500);
    await expect(page.locator('.resume-slide.current')).toContainText('Full-Stack Architect');
  });

  test('variant switcher highlights active state', async ({ page }) => {
    await page.goto('/resume/platform');

    // Wait for page to be stable
    await page.waitForTimeout(500);

    // Check that second button (platform) has active state
    const buttons = page.locator('.variant-button');
    await expect(buttons.nth(1)).toHaveAttribute('aria-current', 'page');

    // Check that first button (leader) does not have active state
    await expect(buttons.nth(0)).not.toHaveAttribute('aria-current', 'page');
  });

  test('direct navigation to each variant loads correct content', async ({ page }) => {
    // Test default resume
    await page.goto('/resume/');
    await page.waitForTimeout(500);
    await expect(page).toHaveURL(/\/resume(\/|\/index\.html)?$/);
    await expect(page.locator('.resume-slide.current')).toContainText('Technical Director');

    // Test platform variant
    await page.goto('/resume/platform/');
    await page.waitForTimeout(500);
    await expect(page.locator('.resume-slide.current')).toContainText('Reliability & Observability');

    // Test builder variant
    await page.goto('/resume/builder/');
    await page.waitForTimeout(500);
    await expect(page.locator('.resume-slide.current')).toContainText('Full-Stack Architect');
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
