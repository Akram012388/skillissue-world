import { expect, test } from '@playwright/test';

test.describe('Copy functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for skill cards to load
    await page.waitForLoadState('domcontentloaded');
  });

  test.describe('Copy button interaction', () => {
    test('copy button is visible on skill cards', async ({ page }) => {
      // Wait for skill cards to load
      const skillCards = page.locator('[data-testid="skill-card"]');
      await expect(skillCards.first()).toBeVisible({ timeout: 5000 });

      // Find copy button within the first skill card
      const copyButton = skillCards.first().locator('button:has-text("Copy")');
      await expect(copyButton).toBeVisible();
    });

    test('clicking copy button copies command to clipboard', async ({ page, context }) => {
      // Grant clipboard permissions
      await context.grantPermissions(['clipboard-read', 'clipboard-write']);

      // Wait for skill cards to load
      const skillCards = page.locator('[data-testid="skill-card"]');
      await expect(skillCards.first()).toBeVisible({ timeout: 5000 });

      // Get the install command text before clicking
      const commandCode = skillCards.first().locator('code');
      const expectedCommand = await commandCode.textContent();

      // Click the copy button
      const copyButton = skillCards.first().locator('button:has-text("Copy")');
      await copyButton.click();

      // Read from clipboard to verify
      const clipboardContent = await page.evaluate(() => navigator.clipboard.readText());

      // Clipboard should contain the install command
      expect(clipboardContent).toBe(expectedCommand);
    });

    test('copy button text changes to "Copied" after clicking', async ({ page, context }) => {
      // Grant clipboard permissions
      await context.grantPermissions(['clipboard-read', 'clipboard-write']);

      // Wait for skill cards to load
      const skillCards = page.locator('[data-testid="skill-card"]');
      await expect(skillCards.first()).toBeVisible({ timeout: 5000 });

      // Find and click the copy button
      const copyButton = skillCards.first().locator('button:has-text("Copy")');
      await copyButton.click();

      // Button text should change to "Copied"
      await expect(copyButton).toHaveText('Copied');
    });

    test('copy button reverts to "Copy" after timeout', async ({ page, context }) => {
      // Grant clipboard permissions
      await context.grantPermissions(['clipboard-read', 'clipboard-write']);

      // Wait for skill cards to load
      const skillCards = page.locator('[data-testid="skill-card"]');
      await expect(skillCards.first()).toBeVisible({ timeout: 5000 });

      // Click the copy button
      const copyButton = skillCards.first().locator('button:has-text("Copy")');
      await copyButton.click();

      // Verify it shows "Copied"
      await expect(copyButton).toHaveText('Copied');

      // Wait for the timeout (2 seconds as per SkillCard implementation)
      await page.waitForTimeout(2500);

      // Button should revert to "Copy"
      await expect(copyButton).toHaveText('Copy');
    });

    test('copy button has success styling when copied', async ({ page, context }) => {
      // Grant clipboard permissions
      await context.grantPermissions(['clipboard-read', 'clipboard-write']);

      // Wait for skill cards to load
      const skillCards = page.locator('[data-testid="skill-card"]');
      await expect(skillCards.first()).toBeVisible({ timeout: 5000 });

      // Click the copy button
      const copyButton = skillCards.first().locator('button:has-text("Copy")');
      await copyButton.click();

      // Button should have green/success styling
      await expect(copyButton).toHaveClass(/bg-green-100|text-green-700/);
    });
  });

  test.describe('Toast notification on copy', () => {
    test('toast appears when copy button is clicked', async ({ page, context }) => {
      // Grant clipboard permissions
      await context.grantPermissions(['clipboard-read', 'clipboard-write']);

      // Wait for skill cards to load
      const skillCards = page.locator('[data-testid="skill-card"]');
      await expect(skillCards.first()).toBeVisible({ timeout: 5000 });

      // Toast should not be visible initially
      const toast = page.locator('[data-testid="toast"]');
      await expect(toast).not.toBeVisible();

      // Click the copy button
      const copyButton = skillCards.first().locator('button:has-text("Copy")');
      await copyButton.click();

      // Toast should appear
      await expect(toast).toBeVisible({ timeout: 2000 });
    });

    test('toast shows "Copied to clipboard!" message', async ({ page, context }) => {
      // Grant clipboard permissions
      await context.grantPermissions(['clipboard-read', 'clipboard-write']);

      // Wait for skill cards to load
      const skillCards = page.locator('[data-testid="skill-card"]');
      await expect(skillCards.first()).toBeVisible({ timeout: 5000 });

      // Click the copy button
      const copyButton = skillCards.first().locator('button:has-text("Copy")');
      await copyButton.click();

      // Check toast message
      const toast = page.locator('[data-testid="toast"]');
      await expect(toast).toContainText('Copied to clipboard!');
    });

    test('toast has success styling (green)', async ({ page, context }) => {
      // Grant clipboard permissions
      await context.grantPermissions(['clipboard-read', 'clipboard-write']);

      // Wait for skill cards to load
      const skillCards = page.locator('[data-testid="skill-card"]');
      await expect(skillCards.first()).toBeVisible({ timeout: 5000 });

      // Click the copy button
      const copyButton = skillCards.first().locator('button:has-text("Copy")');
      await copyButton.click();

      // Toast should have green/success styling
      const toast = page.locator('[data-testid="toast"]');
      await expect(toast).toHaveClass(/bg-green-500/);
    });

    test('toast disappears after timeout', async ({ page, context }) => {
      // Grant clipboard permissions
      await context.grantPermissions(['clipboard-read', 'clipboard-write']);

      // Wait for skill cards to load
      const skillCards = page.locator('[data-testid="skill-card"]');
      await expect(skillCards.first()).toBeVisible({ timeout: 5000 });

      // Click the copy button
      const copyButton = skillCards.first().locator('button:has-text("Copy")');
      await copyButton.click();

      // Toast should appear
      const toast = page.locator('[data-testid="toast"]');
      await expect(toast).toBeVisible();

      // Wait for toast duration (2 seconds as per Toast implementation)
      await page.waitForTimeout(2500);

      // Toast should disappear
      await expect(toast).not.toBeVisible();
    });

    test('toast has correct accessibility attributes', async ({ page, context }) => {
      // Grant clipboard permissions
      await context.grantPermissions(['clipboard-read', 'clipboard-write']);

      // Wait for skill cards to load
      const skillCards = page.locator('[data-testid="skill-card"]');
      await expect(skillCards.first()).toBeVisible({ timeout: 5000 });

      // Click the copy button
      const copyButton = skillCards.first().locator('button:has-text("Copy")');
      await copyButton.click();

      // Check toast accessibility
      const toast = page.locator('[data-testid="toast"]');
      await expect(toast).toHaveAttribute('role', 'alert');
      await expect(toast).toHaveAttribute('aria-live', 'polite');
    });
  });

  test.describe('Copy via keyboard shortcut', () => {
    test('pressing "c" triggers copy and shows toast', async ({ page, context }) => {
      // Grant clipboard permissions
      await context.grantPermissions(['clipboard-read', 'clipboard-write']);

      // Wait for skill cards to load
      const skillCards = page.locator('[data-testid="skill-card"]');
      await expect(skillCards.first()).toBeVisible({ timeout: 5000 });

      // Blur search to enable keyboard shortcuts
      const searchBar = page.locator('[data-testid="search-bar"]');
      await searchBar.blur();

      // Toast should not be visible initially
      const toast = page.locator('[data-testid="toast"]');
      await expect(toast).not.toBeVisible();

      // Press "c" to copy
      await page.keyboard.press('c');

      // Toast should appear
      await expect(toast).toBeVisible({ timeout: 2000 });
      await expect(toast).toContainText('Copied');
    });

    test('keyboard copy uses the currently selected skill', async ({ page, context }) => {
      // Grant clipboard permissions
      await context.grantPermissions(['clipboard-read', 'clipboard-write']);

      // Wait for skill cards to load
      const skillCards = page.locator('[data-testid="skill-card"]');
      await expect(skillCards.first()).toBeVisible({ timeout: 5000 });

      const cardCount = await skillCards.count();
      if (cardCount < 2) {
        test.skip(true, 'Not enough skill cards for this test');
        return;
      }

      // Get command from the first card
      const firstCardCommand = await skillCards.first().locator('code').textContent();

      // Get command from the second card
      const secondCardCommand = await skillCards.nth(1).locator('code').textContent();

      // Blur search and navigate to second card
      const searchBar = page.locator('[data-testid="search-bar"]');
      await searchBar.blur();
      await page.keyboard.press('ArrowDown');

      // Press "c" to copy second card's command
      await page.keyboard.press('c');

      // Read clipboard
      const clipboardContent = await page.evaluate(() => navigator.clipboard.readText());

      // Should have the second card's command, not the first
      expect(clipboardContent).toBe(secondCardCommand);
      expect(clipboardContent).not.toBe(firstCardCommand);
    });
  });

  test.describe('Install command display', () => {
    test('skill card shows install command in monospace font', async ({ page }) => {
      // Wait for skill cards to load
      const skillCards = page.locator('[data-testid="skill-card"]');
      await expect(skillCards.first()).toBeVisible({ timeout: 5000 });

      // Find the code element with the command
      const commandCode = skillCards.first().locator('code');
      await expect(commandCode).toBeVisible();

      // Check it has monospace font class
      await expect(commandCode).toHaveClass(/font-mono/);
    });

    test('install command starts with claude (default agent)', async ({ page }) => {
      // Wait for skill cards to load
      const skillCards = page.locator('[data-testid="skill-card"]');
      await expect(skillCards.first()).toBeVisible({ timeout: 5000 });

      // Get the command text
      const commandCode = skillCards.first().locator('code');
      const commandText = await commandCode.textContent();

      // Default agent is Claude Code, so command should start with "claude"
      expect(commandText).toMatch(/^claude\s/);
    });
  });

  test.describe('Multiple copy operations', () => {
    test('can copy from multiple skill cards in sequence', async ({ page, context }) => {
      // Grant clipboard permissions
      await context.grantPermissions(['clipboard-read', 'clipboard-write']);

      // Wait for skill cards to load
      const skillCards = page.locator('[data-testid="skill-card"]');
      await expect(skillCards.first()).toBeVisible({ timeout: 5000 });

      const cardCount = await skillCards.count();
      if (cardCount < 2) {
        test.skip(true, 'Not enough skill cards for this test');
        return;
      }

      // Copy from first card
      const firstCopyButton = skillCards.first().locator('button:has-text("Copy")');
      await firstCopyButton.click();

      // Wait for toast to appear and disappear
      const toast = page.locator('[data-testid="toast"]');
      await expect(toast).toBeVisible();
      await page.waitForTimeout(2500);

      // Copy from second card
      const secondCopyButton = skillCards.nth(1).locator('button:has-text("Copy")');
      await secondCopyButton.click();

      // Second toast should appear
      await expect(toast).toBeVisible({ timeout: 2000 });

      // Get the second card's expected command
      const secondCardCommand = await skillCards.nth(1).locator('code').textContent();

      // Clipboard should have the second command
      const clipboardContent = await page.evaluate(() => navigator.clipboard.readText());
      expect(clipboardContent).toBe(secondCardCommand);
    });
  });
});
