import { test, expect } from '@playwright/test';

test.describe('Smoke Tests', () => {
  test('homepage loads and has correct title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Brian Anderson/);
  });

  test('homepage has name and title', async ({ page }) => {
    await page.goto('/');
    // Check for the name in the terminal-style header or navbar
    await expect(page.locator('header')).toContainText('briananderson');
    // Check for the title in the H1
    await expect(page.locator('h1')).toContainText('Solutions Architect');
  });

  test('navigation to resume works', async ({ page }) => {
    await page.goto('/');
    await page.click('a[href="/resume/"]');
    await expect(page).toHaveURL(/\/resume/);
  });

  test('resume page loads', async ({ page }) => {
    await page.goto('/resume');
    await expect(page.locator('h1').first()).toContainText('Brian Anderson');
  });
});
