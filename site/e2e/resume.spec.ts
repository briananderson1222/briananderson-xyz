import { test, expect } from '@playwright/test';
import { getExpectedContent } from './helpers/resumeHelper';

test.describe('Resume Resume Functionality', () => {

  test('default resume loads leadership content', async ({ page }) => {
    const expected = getExpectedContent('default');

    await page.goto('/resume');

    // Check URL (allow for index.html in static hosting)
    await expect(page).toHaveURL(/\/resume(\/|\/index\.html)?$/);

    // Check for name and title from YAML
    await expect(page.locator('.resume-slide.current h1').first()).toContainText('Brian Anderson');
    await expect(page.locator('.resume-slide.current').first()).toContainText(expected.title);

    // Check first skill category from YAML
    await expect(page.locator('.resume-slide.current')).toContainText(expected.skillCategory);

    // Check switcher buttons are present - there should be 3 variant buttons
    const buttons = page.locator('.variant-button');
    await expect(buttons).toHaveCount(3);
  });

  test('switching to ops variant works', async ({ page }) => {
    const expected = getExpectedContent('ops');

    await page.goto('/resume');

    // Click ops toggle button (index 1, second button)
    const buttons = page.locator('.variant-button');
    await buttons.nth(1).click();

    // Wait for slide transition
    await page.waitForTimeout(500);

    // Verify URL (allow for index.html in static hosting)
    await expect(page).toHaveURL(/\/resume\/ops(\/|\/index\.html)?$/);

    // Verify Ops specific content from YAML
    await expect(page.locator('.resume-slide.current')).toContainText(expected.title);
    await expect(page.locator('.resume-slide.current')).toContainText(expected.skillCategory);
  });

  test('switching to builder variant works', async ({ page }) => {
    const expected = getExpectedContent('builder');

    await page.goto('/resume');

    // Click the builder toggle button (index 2, third button)
    const buttons = page.locator('.variant-button');
    await buttons.nth(2).click();

    // Wait for slide transition
    await page.waitForTimeout(500);

    // Verify URL (allow for index.html in static hosting)
    await expect(page).toHaveURL(/\/resume\/builder(\/|\/index\.html)?$/);

    // Verify Builder specific content from YAML
    await expect(page.locator('.resume-slide.current')).toContainText(expected.title);
    await expect(page.locator('.resume-slide.current')).toContainText(expected.skillCategory);
  });

  test('direct navigation to variants works', async ({ page }) => {
    // Navigate directly to ops
    const opsExpected = getExpectedContent('ops');
    await page.goto('/resume/ops');
    await page.waitForTimeout(500);
    await expect(page.locator('.resume-slide.current')).toContainText(opsExpected.title);

    // Navigate directly to builder
    const builderExpected = getExpectedContent('builder');
    await page.goto('/resume/builder');
    await page.waitForTimeout(500);
    await expect(page.locator('.resume-slide.current')).toContainText(builderExpected.title);
  });

  test('variant switcher highlights active state', async ({ page }) => {
    await page.goto('/resume/ops');

    // Wait for page to be stable
    await page.waitForTimeout(500);

    // Check that second button (ops) has active state
    const buttons = page.locator('.variant-button');
    await expect(buttons.nth(1)).toHaveAttribute('aria-current', 'page');

    // Check that first button (leader) does not have active state
    await expect(buttons.nth(0)).not.toHaveAttribute('aria-current', 'page');
  });

  test('direct navigation to each variant loads correct content', async ({ page }) => {
    // Test default resume
    const defaultExpected = getExpectedContent('default');
    await page.goto('/resume/');
    await page.waitForTimeout(500);
    await expect(page).toHaveURL(/\/resume(\/|\/index\.html)?$/);
    await expect(page.locator('.resume-slide.current')).toContainText(defaultExpected.title);

    // Test ops variant
    const opsExpected = getExpectedContent('ops');
    await page.goto('/resume/ops/');
    await page.waitForTimeout(500);
    await expect(page.locator('.resume-slide.current')).toContainText(opsExpected.skillCategory);

    // Test builder variant
    const builderExpected = getExpectedContent('builder');
    await page.goto('/resume/builder/');
    await page.waitForTimeout(500);
    await expect(page.locator('.resume-slide.current')).toContainText(builderExpected.title);
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
