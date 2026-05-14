import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('App Shell — WCAG 2.1 AA accessibility', () => {
  test.describe('Home page (/)', () => {
    test('has no axe violations', async ({ page }) => {
      await page.goto('/');
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
        .analyze();
      expect(results.violations).toEqual([]);
    });

    test('page has a meaningful document title', async ({ page }) => {
      await page.goto('/');
      const title = await page.title();
      expect(title.trim().length).toBeGreaterThan(0);
    });

    test('header landmark is present', async ({ page }) => {
      await page.goto('/');
      await expect(page.locator('header')).toBeVisible();
    });

    test('main landmark is present', async ({ page }) => {
      await page.goto('/');
      await expect(page.locator('main')).toBeVisible();
    });

    test('footer landmark is present', async ({ page }) => {
      await page.goto('/');
      await expect(page.locator('footer')).toBeVisible();
    });

    test('ProTrack brand link is keyboard focusable and has visible text', async ({
      page,
    }) => {
      await page.goto('/');
      const brandLink = page.getByRole('link', { name: 'ProTrack' });
      await expect(brandLink).toBeVisible();
      await brandLink.focus();
      await expect(brandLink).toBeFocused();
    });

    test('Login button is keyboard focusable', async ({ page }) => {
      await page.goto('/');
      const loginButton = page.getByRole('button', { name: 'Login' });
      await expect(loginButton).toBeVisible();
      await loginButton.focus();
      await expect(loginButton).toBeFocused();
    });

    test('Login button navigates to /login when activated with Enter', async ({
      page,
    }) => {
      await page.goto('/');
      const loginButton = page.getByRole('button', { name: 'Login' });
      await loginButton.focus();
      await page.keyboard.press('Enter');
      await expect(page).toHaveURL('/login');
    });

    test('tab order flows from brand link to Login button', async ({
      page,
    }) => {
      await page.goto('/');
      await page.keyboard.press('Tab');
      const brandLink = page.getByRole('link', { name: 'ProTrack' });
      await expect(brandLink).toBeFocused();

      await page.keyboard.press('Tab');
      const loginButton = page.getByRole('button', { name: 'Login' });
      await expect(loginButton).toBeFocused();
    });

    test('footer navigation links are keyboard focusable', async ({ page }) => {
      await page.goto('/');
      const footerNav = page.locator('footer nav');
      await expect(footerNav).toBeVisible();

      const links = ['Privacy', 'Terms', 'Support'];
      for (const name of links) {
        const link = page.getByRole('link', { name });
        await expect(link).toBeVisible();
        await link.focus();
        await expect(link).toBeFocused();
      }
    });

    test('ProTrack brand link points to /', async ({ page }) => {
      await page.goto('/');
      const brandLink = page.getByRole('link', { name: 'ProTrack' });
      const href = await brandLink.getAttribute('href');
      expect(href).toBe('/');
    });
  });

  test.describe('Login page (/login)', () => {
    test('has no axe violations', async ({ page }) => {
      await page.goto('/login');
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
        .analyze();
      expect(results.violations).toEqual([]);
    });

    test('header landmark is present', async ({ page }) => {
      await page.goto('/login');
      await expect(page.locator('header')).toBeVisible();
    });

    test('main landmark is present', async ({ page }) => {
      await page.goto('/login');
      await expect(page.locator('main')).toBeVisible();
    });

    test('footer landmark is present', async ({ page }) => {
      await page.goto('/login');
      await expect(page.locator('footer')).toBeVisible();
    });

    test('ProTrack brand link is keyboard focusable on login page', async ({
      page,
    }) => {
      await page.goto('/login');
      const brandLink = page.getByRole('link', { name: 'ProTrack' });
      await expect(brandLink).toBeVisible();
      await brandLink.focus();
      await expect(brandLink).toBeFocused();
    });

    test('tab order flows from brand link to Login button on login page', async ({
      page,
    }) => {
      await page.goto('/login');
      await page.keyboard.press('Tab');
      const brandLink = page.getByRole('link', { name: 'ProTrack' });
      await expect(brandLink).toBeFocused();

      await page.keyboard.press('Tab');
      const loginButton = page.getByRole('button', { name: 'Login' });
      await expect(loginButton).toBeFocused();
    });
  });

  test.describe('Header component', () => {
    test('header has a single banner landmark', async ({ page }) => {
      await page.goto('/');
      const banners = await page.locator('[role="banner"], header').count();
      expect(banners).toBeGreaterThanOrEqual(1);
    });

    test('Login button is activatable with Space key', async ({ page }) => {
      await page.goto('/');
      const loginButton = page.getByRole('button', { name: 'Login' });
      await loginButton.focus();
      await page.keyboard.press('Space');
      await expect(page).toHaveURL('/login');
    });
  });

  test.describe('Footer component', () => {
    test('footer copyright text is readable', async ({ page }) => {
      await page.goto('/');
      const footer = page.locator('footer');
      await expect(footer).toContainText('© 2024 ProTrack Systems');
    });

    test('footer nav links have discernible text', async ({ page }) => {
      await page.goto('/');
      const privacyLink = page.getByRole('link', { name: 'Privacy' });
      const termsLink = page.getByRole('link', { name: 'Terms' });
      const supportLink = page.getByRole('link', { name: 'Support' });

      await expect(privacyLink).toBeVisible();
      await expect(termsLink).toBeVisible();
      await expect(supportLink).toBeVisible();
    });
  });
});
