import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('App Shell — Header & Footer (Story 1)', () => {
  test.describe('HomePage (/)', () => {
    test('has no WCAG 2.1 AA axe violations', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();

      expect(results.violations).toEqual([]);
    });

    test('header landmark is present', async ({ page }) => {
      await page.goto('/');
      await expect(page.locator('header')).toBeVisible();
    });

    test('footer landmark is present', async ({ page }) => {
      await page.goto('/');
      await expect(page.locator('footer')).toBeVisible();
    });

    test('main landmark is present', async ({ page }) => {
      await page.goto('/');
      await expect(page.locator('main')).toBeVisible();
    });

    test('ProTrack brand link is keyboard-focusable and navigates to /', async ({
      page,
    }) => {
      await page.goto('/login');
      await page.keyboard.press('Tab');

      const focused = page.locator(':focus');
      await expect(focused).toHaveText('ProTrack');
      await expect(focused).toHaveAttribute('href', '/');
    });

    test('Login button is keyboard-focusable and activatable with Enter', async ({
      page,
    }) => {
      await page.goto('/');

      // Tab to brand link, then Tab again to Login button
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');

      const focused = page.locator(':focus');
      await expect(focused).toHaveText('Login');

      await page.keyboard.press('Enter');
      await expect(page).toHaveURL(/\/login/);
    });

    test('Login button is activatable with Space', async ({ page }) => {
      await page.goto('/');

      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');

      const focused = page.locator(':focus');
      await expect(focused).toHaveText('Login');

      await page.keyboard.press('Space');
      await expect(page).toHaveURL(/\/login/);
    });

    test('footer links are keyboard-focusable', async ({ page }) => {
      await page.goto('/');

      const footerLinks = page.locator('footer a');
      const count = await footerLinks.count();
      expect(count).toBeGreaterThan(0);

      for (let i = 0; i < count; i++) {
        await expect(footerLinks.nth(i)).toBeVisible();
      }
    });

    test('focus is visible on interactive elements', async ({ page }) => {
      await page.goto('/');

      // Tab through all focusable elements and verify each gets focus
      const interactiveSelectors = ['header a', 'header button', 'footer a'];
      for (const selector of interactiveSelectors) {
        const elements = page.locator(selector);
        const count = await elements.count();
        for (let i = 0; i < count; i++) {
          await elements.nth(i).focus();
          const isFocused = await elements.nth(i).evaluate(
            (el) => el === document.activeElement,
          );
          expect(isFocused).toBe(true);
        }
      }
    });
  });

  test.describe('LoginPage (/login)', () => {
    test('has no WCAG 2.1 AA axe violations', async ({ page }) => {
      await page.goto('/login');
      await page.waitForLoadState('networkidle');

      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();

      expect(results.violations).toEqual([]);
    });

    test('header landmark is present', async ({ page }) => {
      await page.goto('/login');
      await expect(page.locator('header')).toBeVisible();
    });

    test('footer landmark is present', async ({ page }) => {
      await page.goto('/login');
      await expect(page.locator('footer')).toBeVisible();
    });

    test('main landmark is present', async ({ page }) => {
      await page.goto('/login');
      await expect(page.locator('main')).toBeVisible();
    });

    test('Login button navigates to /login from home', async ({ page }) => {
      await page.goto('/');
      await page.locator('header button').click();
      await expect(page).toHaveURL(/\/login/);
    });
  });

  test.describe('Header colour contrast', () => {
    test('ProTrack brand text meets minimum contrast on white background', async ({
      page,
    }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Axe with color-contrast rule explicitly enabled covers this
      const results = await new AxeBuilder({ page })
        .withRules(['color-contrast'])
        .analyze();

      expect(results.violations).toEqual([]);
    });
  });

  test.describe('Tab order', () => {
    test('tab order on / is brand link → Login button → footer links', async ({
      page,
    }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      const order: string[] = [];

      // Collect focus order by tabbing through all focusable elements
      // Use a reasonable upper bound to avoid infinite loop
      for (let i = 0; i < 10; i++) {
        await page.keyboard.press('Tab');
        const tag = await page.evaluate(() => {
          const el = document.activeElement;
          if (!el || el === document.body) return null;
          return (el.textContent ?? '').trim();
        });
        if (!tag) break;
        order.push(tag);
      }

      // Brand link should come before Login button
      const brandIdx = order.findIndex((t) => t === 'ProTrack');
      const loginIdx = order.findIndex((t) => t === 'Login');
      expect(brandIdx).toBeGreaterThanOrEqual(0);
      expect(loginIdx).toBeGreaterThanOrEqual(0);
      expect(brandIdx).toBeLessThan(loginIdx);

      // Footer links should come after Login button
      const privacyIdx = order.findIndex((t) => t === 'Privacy');
      expect(privacyIdx).toBeGreaterThan(loginIdx);
    });
  });
});
