import { test, expect } from '@playwright/test';

test.describe('Smoke Tests', () => {
  test('homepage loads and has correct title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Brian Anderson/);
  });

  test('homepage has name and title', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toContainText('Brian Anderson');
  });

  test('navigation to resume works', async ({ page }) => {
    await page.goto('/');
    await page.click('text=./view_resume.pdf');
    await expect(page).toHaveURL(/\/resume/);
  });

  test('resume page loads', async ({ page }) => {
    await page.goto('/resume');
    await expect(page.locator('h1')).toContainText('Brian Anderson');
  });
});
