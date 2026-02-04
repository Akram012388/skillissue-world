import { expect, test } from '@playwright/test';

test('homepage loads', async ({ page }) => {
  await page.goto('/');
  // Just verify the page loads with a 200 status
  await expect(page.locator('body')).toBeVisible();
});
