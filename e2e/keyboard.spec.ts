import { expect, test } from '@playwright/test';

test.describe('Keyboard navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for initial page load and skills to render
    await page.waitForLoadState('domcontentloaded');
  });

  test.describe('Search focus shortcuts', () => {
    test('pressing "/" focuses the search bar', async ({ page }) => {
      const searchBar = page.locator('[data-testid="search-bar"]');

      // First blur the search bar (it may have autoFocus)
      await searchBar.blur();
      await expect(searchBar).not.toBeFocused();

      // Press "/" to focus search
      await page.keyboard.press('/');

      // Search bar should now be focused
      await expect(searchBar).toBeFocused();
    });

    test('"/" does not trigger when already typing in search', async ({ page }) => {
      const searchBar = page.locator('[data-testid="search-bar"]');

      // Focus and type in search bar
      await searchBar.focus();
      await searchBar.fill('test');

      // Press "/" while typing - should add "/" to input, not refocus
      await page.keyboard.type('/');

      // The "/" should be added to the input value
      await expect(searchBar).toHaveValue('test/');
    });

    test('pressing "Escape" clears search and blurs', async ({ page }) => {
      const searchBar = page.locator('[data-testid="search-bar"]');

      // Type something in the search bar
      await searchBar.fill('test query');
      await expect(searchBar).toHaveValue('test query');
      await expect(searchBar).toBeFocused();

      // Press Escape
      await page.keyboard.press('Escape');

      // Search should be cleared and blurred
      await expect(searchBar).toHaveValue('');
      await expect(searchBar).not.toBeFocused();
    });

    test('pressing "Escape" works even when search is already empty', async ({ page }) => {
      const searchBar = page.locator('[data-testid="search-bar"]');

      // Focus search bar with "/"
      await searchBar.blur();
      await page.keyboard.press('/');
      await expect(searchBar).toBeFocused();

      // Press Escape to blur
      await page.keyboard.press('Escape');

      // Should blur without errors
      await expect(searchBar).not.toBeFocused();
    });
  });

  test.describe('Arrow key navigation', () => {
    test('arrow down selects next skill card', async ({ page }) => {
      // Wait for skill cards to load
      const skillCards = page.locator('[data-testid="skill-card"]');
      await expect(skillCards.first()).toBeVisible({ timeout: 5000 });

      // Get the count of skill cards
      const cardCount = await skillCards.count();
      if (cardCount < 2) {
        test.skip(true, 'Not enough skill cards for navigation test');
        return;
      }

      // Blur the search to enable keyboard navigation
      const searchBar = page.locator('[data-testid="search-bar"]');
      await searchBar.blur();

      // First card should be selected by default (has ring styling)
      const firstCard = skillCards.first();
      await expect(firstCard).toHaveClass(/ring-2/);

      // Press arrow down
      await page.keyboard.press('ArrowDown');

      // Second card should now be selected
      const secondCard = skillCards.nth(1);
      await expect(secondCard).toHaveClass(/ring-2/);
    });

    test('arrow up selects previous skill card', async ({ page }) => {
      // Wait for skill cards to load
      const skillCards = page.locator('[data-testid="skill-card"]');
      await expect(skillCards.first()).toBeVisible({ timeout: 5000 });

      const cardCount = await skillCards.count();
      if (cardCount < 2) {
        test.skip(true, 'Not enough skill cards for navigation test');
        return;
      }

      // Blur the search and navigate down first
      const searchBar = page.locator('[data-testid="search-bar"]');
      await searchBar.blur();

      await page.keyboard.press('ArrowDown');

      // Second card should be selected
      const secondCard = skillCards.nth(1);
      await expect(secondCard).toHaveClass(/ring-2/);

      // Press arrow up
      await page.keyboard.press('ArrowUp');

      // First card should be selected again
      const firstCard = skillCards.first();
      await expect(firstCard).toHaveClass(/ring-2/);
    });

    test('arrow navigation wraps around at boundaries', async ({ page }) => {
      // Wait for skill cards to load
      const skillCards = page.locator('[data-testid="skill-card"]');
      await expect(skillCards.first()).toBeVisible({ timeout: 5000 });

      const cardCount = await skillCards.count();
      if (cardCount === 0) {
        test.skip(true, 'No skill cards available for navigation test');
        return;
      }

      // Blur the search
      const searchBar = page.locator('[data-testid="search-bar"]');
      await searchBar.blur();

      // First card is selected, press up to wrap to last
      await page.keyboard.press('ArrowUp');

      // Last card should be selected (wrap around)
      const lastCard = skillCards.last();
      await expect(lastCard).toHaveClass(/ring-2/);
    });

    test('arrow keys do not work when typing in search', async ({ page }) => {
      const searchBar = page.locator('[data-testid="search-bar"]');

      // Focus search and type
      await searchBar.focus();
      await searchBar.fill('test');

      // Press arrow keys - cursor should move in input, not skill selection
      await page.keyboard.press('ArrowDown');

      // Verify search still has focus and value
      await expect(searchBar).toBeFocused();
      await expect(searchBar).toHaveValue('test');
    });
  });

  test.describe('Copy command shortcut ("c")', () => {
    test('pressing "c" copies the selected skill command to clipboard', async ({
      page,
      context,
    }) => {
      // Grant clipboard permissions
      await context.grantPermissions(['clipboard-read', 'clipboard-write']);

      // Wait for skill cards to load
      const skillCards = page.locator('[data-testid="skill-card"]');
      await expect(skillCards.first()).toBeVisible({ timeout: 5000 });

      // Blur the search to enable "c" shortcut
      const searchBar = page.locator('[data-testid="search-bar"]');
      await searchBar.blur();

      // Press "c" to copy
      await page.keyboard.press('c');

      // Check that toast appears indicating copy success
      const toast = page.locator('[data-testid="toast"]');
      await expect(toast).toBeVisible({ timeout: 3000 });
      await expect(toast).toContainText(/copied/i);
    });

    test('"c" does not copy when typing in an input', async ({ page }) => {
      const searchBar = page.locator('[data-testid="search-bar"]');

      // Focus search and type "c"
      await searchBar.focus();
      await page.keyboard.type('c');

      // "c" should be in the input, not trigger copy
      await expect(searchBar).toHaveValue('c');

      // Toast should NOT appear
      const toast = page.locator('[data-testid="toast"]');
      await expect(toast).not.toBeVisible();
    });
  });

  test.describe('Go to repo shortcut ("g")', () => {
    test('pressing "g" opens the skill repo in new tab', async ({ page, context }) => {
      // Wait for skill cards to load
      const skillCards = page.locator('[data-testid="skill-card"]');
      await expect(skillCards.first()).toBeVisible({ timeout: 5000 });

      // Blur the search to enable "g" shortcut
      const searchBar = page.locator('[data-testid="search-bar"]');
      await searchBar.blur();

      // Listen for new page (tab) to open
      const newPagePromise = context.waitForEvent('page');

      // Press "g" to go to repo
      await page.keyboard.press('g');

      // Verify a new page/tab was opened
      const newPage = await newPagePromise;
      await newPage.waitForLoadState();

      // URL should be a GitHub repo URL
      expect(newPage.url()).toMatch(/github\.com/);
    });

    test('"g" does not trigger when typing in search', async ({ page }) => {
      const searchBar = page.locator('[data-testid="search-bar"]');

      // Focus and type "g" in search
      await searchBar.focus();
      await page.keyboard.type('g');

      // "g" should be in input, not trigger navigation
      await expect(searchBar).toHaveValue('g');
    });
  });

  test.describe('Keyboard hints display', () => {
    test('keyboard hints are visible on the page', async ({ page }) => {
      // Check that keyboard hints are displayed
      const searchHint = page.locator('text=/\\/.*Search/');
      await expect(searchHint).toBeVisible({ timeout: 5000 });

      const copyHint = page.locator('text=/c.*Copy/');
      await expect(copyHint).toBeVisible();

      const navigateHint = page.locator('text=/Navigate/');
      await expect(navigateHint).toBeVisible();
    });
  });
});
