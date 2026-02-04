import { expect, test } from '@playwright/test';

test.describe('Search functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test.describe('Search bar visibility and interaction', () => {
    test('search bar is visible on page load', async ({ page }) => {
      const searchBar = page.locator('[data-testid="search-bar"]');
      await expect(searchBar).toBeVisible();
    });

    test('search bar has correct placeholder text', async ({ page }) => {
      const searchBar = page.locator('[data-testid="search-bar"]');
      await expect(searchBar).toHaveAttribute('placeholder', 'Search skills...');
    });

    test('search bar is focused by default (autoFocus)', async ({ page }) => {
      const searchBar = page.locator('[data-testid="search-bar"]');
      // Wait for page to fully load and autoFocus to take effect
      await page.waitForLoadState('domcontentloaded');
      await expect(searchBar).toBeFocused();
    });
  });

  test.describe('Search input behavior', () => {
    test('can type in search bar', async ({ page }) => {
      const searchBar = page.locator('[data-testid="search-bar"]');
      await searchBar.fill('react');
      await expect(searchBar).toHaveValue('react');
    });

    test('search results update based on query', async ({ page }) => {
      const searchBar = page.locator('[data-testid="search-bar"]');

      // Type a search query
      await searchBar.fill('test');

      // Wait for debounce (150ms) + network/render time
      await page.waitForTimeout(300);

      // Check that results text appears (shows "X results for...")
      const resultsText = page.locator('text=/\\d+ results? for/');
      await expect(resultsText).toBeVisible({ timeout: 5000 });
    });

    test('displays "no skills found" message for non-matching query', async ({ page }) => {
      const searchBar = page.locator('[data-testid="search-bar"]');

      // Search for something unlikely to exist
      await searchBar.fill('xyznonexistent123456');

      // Wait for debounce + processing
      await page.waitForTimeout(300);

      // Check for no results message
      const noResults = page.locator('text=/No skills found/');
      await expect(noResults).toBeVisible({ timeout: 5000 });
    });
  });

  test.describe('Clear search functionality', () => {
    test('clear button appears when search has value', async ({ page }) => {
      const searchBar = page.locator('[data-testid="search-bar"]');
      const clearButton = page.locator('button[aria-label="Clear search"]');

      // Initially, clear button should not be visible
      await expect(clearButton).not.toBeVisible();

      // Type something
      await searchBar.fill('test');

      // Now clear button should appear
      await expect(clearButton).toBeVisible();
    });

    test('clicking clear button clears the search', async ({ page }) => {
      const searchBar = page.locator('[data-testid="search-bar"]');
      const clearButton = page.locator('button[aria-label="Clear search"]');

      // Type something
      await searchBar.fill('test');
      await expect(searchBar).toHaveValue('test');

      // Click clear
      await clearButton.click();

      // Search should be empty
      await expect(searchBar).toHaveValue('');
    });

    test('clear button disappears after clearing', async ({ page }) => {
      const searchBar = page.locator('[data-testid="search-bar"]');
      const clearButton = page.locator('button[aria-label="Clear search"]');

      // Type and then clear
      await searchBar.fill('test');
      await clearButton.click();

      // Clear button should disappear
      await expect(clearButton).not.toBeVisible();
    });

    test('search bar retains focus after clearing via button', async ({ page }) => {
      const searchBar = page.locator('[data-testid="search-bar"]');
      const clearButton = page.locator('button[aria-label="Clear search"]');

      await searchBar.fill('test');
      await clearButton.click();

      // Focus should remain on search bar
      await expect(searchBar).toBeFocused();
    });
  });

  test.describe('URL sync with search query', () => {
    test('search query appears in URL', async ({ page }) => {
      const searchBar = page.locator('[data-testid="search-bar"]');

      await searchBar.fill('react');

      // Wait for debounce and URL update
      await page.waitForTimeout(300);

      // URL should contain the query parameter
      await expect(page).toHaveURL(/[?&]q=react/);
    });

    test('loading page with query param pre-fills search', async ({ page }) => {
      // Navigate with query param
      await page.goto('/?q=typescript');

      const searchBar = page.locator('[data-testid="search-bar"]');
      await expect(searchBar).toHaveValue('typescript');
    });
  });

  test.describe('Default homepage sections', () => {
    test('shows Hit Picks section when not searching', async ({ page }) => {
      const hitPicksSection = page.locator('text=Hit Picks');
      await expect(hitPicksSection).toBeVisible({ timeout: 5000 });
    });

    test('shows Latest Drops section when not searching', async ({ page }) => {
      const latestDropsSection = page.locator('text=Latest Drops');
      await expect(latestDropsSection).toBeVisible({ timeout: 5000 });
    });

    test('hides default sections when searching', async ({ page }) => {
      const searchBar = page.locator('[data-testid="search-bar"]');

      // Wait for initial load
      await page.waitForTimeout(500);

      // Start searching
      await searchBar.fill('test');

      // Wait for search to process
      await page.waitForTimeout(300);

      // Default sections should be hidden during search
      const hitPicksSection = page.locator('h2:has-text("Hit Picks")');
      const latestDropsSection = page.locator('h2:has-text("Latest Drops")');

      await expect(hitPicksSection).not.toBeVisible();
      await expect(latestDropsSection).not.toBeVisible();
    });
  });
});
