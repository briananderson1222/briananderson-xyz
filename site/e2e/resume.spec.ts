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

  test.describe('SSR and Client-side Hydration', () => {
    test('SSR rendering - initial page load has content', async ({ page }) => {
      const expected = getExpectedContent('default');

      await page.goto('/resume');

      // Verify content is immediately available (SSR rendered)
      const nameElement = page.locator('.resume-slide.current h1').first();
      await expect(nameElement).toContainText('Brian Anderson');

      const titleElement = page.locator('.resume-slide.current').first();
      await expect(titleElement).toContainText(expected.title);

      // Verify all resume slides are rendered
      const slides = page.locator('.resume-slide');
      await expect(slides).toHaveCount(3);

      // Verify variant buttons are present
      const buttons = page.locator('.variant-button');
      await expect(buttons).toHaveCount(3);
    });

    test('client-side navigation loads resume correctly', async ({ page }) => {
      const expected = getExpectedContent('default');

      // Start on homepage
      await page.goto('/');
      await expect(page).toHaveURL('/');

      // Navigate to resume via client-side navigation
      await page.click('a[href="/resume/"]');
      await expect(page).toHaveURL(/resume/);

      // Verify content loaded correctly
      await expect(page.locator('.resume-slide.current h1').first()).toContainText('Brian Anderson');
      await expect(page.locator('.resume-slide.current').first()).toContainText(expected.title);
    });

    test('hydration - variant switching works consistently', async ({ page }) => {
      // Load page directly (SSR)
      await page.goto('/resume');
      await expect(page.locator('.resume-slide.current h1').first()).toContainText('Brian Anderson');

      // Switch to ops variant (client-side)
      const opsExpected = getExpectedContent('ops');
      const buttons = page.locator('.variant-button');
      await buttons.nth(1).click();
      await page.waitForTimeout(500);

      await expect(page).toHaveURL(/\/resume\/ops(\/|\/index\.html)?$/);
      await expect(page.locator('.resume-slide.current')).toContainText(opsExpected.title);

      // Navigate away and back (tests hydration after routing)
      await page.goto('/');
      await page.goto('/resume/ops');
      await page.waitForTimeout(500);

      await expect(page.locator('.resume-slide.current')).toContainText(opsExpected.title);
    });

    test('all resume variants load correctly on direct navigation', async ({ page }) => {
      const variants = ['default', 'ops', 'builder'];

      for (const variant of variants) {
        const path = variant === 'default' ? '/resume' : `/resume/${variant}`;
        const expected = getExpectedContent(variant);

        await page.goto(path);
        await page.waitForTimeout(300);

        await expect(page.locator('.resume-slide.current h1').first()).toContainText('Brian Anderson');
        await expect(page.locator('.resume-slide.current')).toContainText(expected.title);
        await expect(page.locator('.variant-button')).toHaveCount(3);
      }
    });

    test('hydration - no console errors on resume page', async ({ page }) => {
      const errors: string[] = [];

      page.on('console', (msg) => {
        if (msg.type() === 'error') {
          const text = msg.text();
          // Filter out network errors that are not hydration issues
          if (!text.includes('ERR_NAME_NOT_RESOLVED') && !text.includes('Failed to load resource')) {
            errors.push(text);
          }
        }
      });

      await page.goto('/resume');
      await page.waitForTimeout(500);

      // Switch variants to trigger hydration
      const buttons = page.locator('.variant-button');
      await buttons.nth(1).click();
      await page.waitForTimeout(500);

      await buttons.nth(2).click();
      await page.waitForTimeout(500);

      await buttons.nth(0).click();
      await page.waitForTimeout(500);

      if (errors.length > 0) {
        console.log('Console errors found:', errors);
      }
      expect(errors.length).toBe(0);
    });

    test('all resume variants render identically on SSR and client-side hydration', async ({ page }) => {
      const variants = ['default', 'ops', 'builder'];

      for (const variant of variants) {
        const path = variant === 'default' ? '/resume' : `/resume/${variant}`;
        const expected = getExpectedContent(variant);

        // Test 1: Direct load (SSR)
        await page.goto(path);
        await page.waitForLoadState('networkidle');
        
        const ssrTitle = await page.locator('.resume-slide.current').textContent();
        expect(ssrTitle).toContain(expected.title);
        expect(ssrTitle).toContain('Brian Anderson');

        // Test 2: Navigate away and back (tests client-side hydration)
        await page.goto('/');
        await page.waitForLoadState('networkidle');
        await page.goto(path);
        await page.waitForLoadState('networkidle');
        
        const hydratedTitle = await page.locator('.resume-slide.current').textContent();
        expect(hydratedTitle).toContain(expected.title);
        expect(hydratedTitle).toContain('Brian Anderson');

        // Test 3: Verify SSR and hydration produce identical visible content
        expect(ssrTitle).toBe(hydratedTitle);

        // Test 4: Verify all variant buttons work after hydration
        const buttons = page.locator('.variant-button');
        await expect(buttons).toHaveCount(3);
        expect(await buttons.count()).toBe(3);

        // Test 5: Switch between variants to ensure hydration is working
        if (variant !== 'ops') {
          const opsExpected = getExpectedContent('ops');
          await buttons.nth(1).click();
          await page.waitForTimeout(500);
          await expect(page.locator('.resume-slide.current')).toContainText(opsExpected.title);
          
          // Navigate back to original variant
          await page.goto(path);
          await page.waitForLoadState('networkidle');
          await expect(page.locator('.resume-slide.current')).toContainText(expected.title);
        }
      }
    });

    test('resume page content consistency across hydration cycles', async ({ page }) => {
      const variant = 'default';
      const path = '/resume';
      const expected = getExpectedContent(variant);

      // Load page
      await page.goto(path);
      await page.waitForLoadState('networkidle');

      // Store initial content
      const initialSlideContent = await page.locator('.resume-slide.current').textContent();
      const initialButtonsCount = await page.locator('.variant-button').count();

      // Navigate away
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Navigate back - first hydration
      await page.goto(path);
      await page.waitForLoadState('networkidle');
      
      const firstHydrationContent = await page.locator('.resume-slide.current').textContent();
      const firstHydrationButtonsCount = await page.locator('.variant-button').count();

      expect(firstHydrationContent).toBe(initialSlideContent);
      expect(firstHydrationButtonsCount).toBe(initialButtonsCount);
      expect(firstHydrationContent).toContain(expected.title);

      // Navigate away and back again - second hydration
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      await page.goto(path);
      await page.waitForLoadState('networkidle');
      
      const secondHydrationContent = await page.locator('.resume-slide.current').textContent();
      const secondHydrationButtonsCount = await page.locator('.variant-button').count();

      expect(secondHydrationContent).toBe(initialSlideContent);
      expect(secondHydrationContent).toBe(firstHydrationContent);
      expect(secondHydrationButtonsCount).toBe(initialButtonsCount);
      expect(secondHydrationButtonsCount).toBe(firstHydrationButtonsCount);
      expect(secondHydrationContent).toContain(expected.title);
    });

    test('navigating from homepage to resume loads content (not blank)', async ({ page }) => {
      const expected = getExpectedContent('default');

      // Start at homepage
      await page.goto('/');
      await expect(page).toHaveURL('/');

      // Click the resume link in navigation (client-side navigation)
      await page.click('a[href="/resume/"]');

      // Wait for URL to update
      await expect(page).toHaveURL(/\/resume(\/|index\.html)?$/);

      // Verify content is NOT blank - check that key elements are present
      const nameElement = page.locator('.resume-slide.current h1').first();
      await expect(nameElement).toBeVisible();
      await expect(nameElement).toContainText('Brian Anderson');

      // Verify title is present
      const slideContent = page.locator('.resume-slide.current');
      await expect(slideContent).toContainText(expected.title);

      // Verify the slide is not empty (has visible text content)
      const slideText = await slideContent.textContent();
      expect(slideText?.trim().length).toBeGreaterThan(100);
    });

    test('resume content persists after navigation from homepage (no race condition)', async ({ page }) => {
      const expected = getExpectedContent('default');
      const contentChecks: Array<{ time: number; hasContent: boolean; visible: boolean; hasTitle: boolean }> = [];

      // Start at homepage
      await page.goto('/');
      await expect(page).toHaveURL('/');

      // Navigate to resume via client-side navigation
      await page.click('a[href="/resume/"]');
      await page.waitForTimeout(500); // Let navigation complete

      // Check content at multiple intervals to catch race conditions
      const checkTimes = [0, 500, 1000, 2000, 3000];

      for (const ms of checkTimes) {
        await page.waitForTimeout(ms);

        const nameElement = page.locator('.resume-slide.current h1').first();
        const isVisible = await nameElement.isVisible().catch(() => false);
        const hasText = await nameElement.count() > 0;

        let hasTitle = false;
        try {
          const slideContent = page.locator('.resume-slide.current');
          const slideText = await slideContent.textContent({ timeout: 2000 });
          hasTitle = slideText?.includes(expected.title) || false;
        } catch {
          hasTitle = false;
        }

        const hasContent = isVisible && hasText && hasTitle;
        contentChecks.push({ time: ms, hasContent, visible: isVisible, hasTitle });

        if (!hasContent) {
          // Take screenshot if content is missing
          await page.screenshot({ path: `test-results/resume-blank-${ms}ms.png`, fullPage: true });
        }
      }

      // All checks should have content
      const failedChecks = contentChecks.filter(c => !c.hasContent);
      if (failedChecks.length > 0) {
        console.log('Missing content details:', JSON.stringify(failedChecks, null, 2));
      }
      expect(failedChecks.length).toBe(0);
    });

    test('resume content does not blink or disappear after navigation', async ({ page }) => {
      const expected = getExpectedContent('default');

      // Start at homepage
      await page.goto('/');
      await expect(page).toHaveURL('/');

      // Navigate to resume
      await page.click('a[href="/resume/"]');
      await expect(page).toHaveURL(/resume/);

      // Wait for initial content
      await expect(page.locator('.resume-slide.current h1').first()).toBeVisible({ timeout: 5000 });

      // Monitor content visibility over time to detect blinking
      const samples: Array<{ time: number; visible: boolean }> = [];
      const slideElement = page.locator('.resume-slide.current');

      // Sample visibility every 200ms for 5 seconds
      const duration = 5000;
      const interval = 200;
      for (let elapsed = 0; elapsed <= duration; elapsed += interval) {
        await page.waitForTimeout(interval);

        const visible = await slideElement.isVisible().catch(() => false);
        const hasText = await slideElement.count() > 0;
        samples.push({ time: elapsed, visible: visible && hasText });
      }

      // Content should be visible at every sample point
      const invisibleSamples = samples.filter(s => !s.visible);
      if (invisibleSamples.length > 0) {
        console.log('Content invisible at times:', invisibleSamples.map(s => s.time));
      }
      expect(invisibleSamples.length).toBe(0);
    });
  });
});
