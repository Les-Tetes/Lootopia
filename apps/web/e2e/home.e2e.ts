import { expect, test } from '@playwright/test';

test("la page d'accueil affiche le titre Lootopia", async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveTitle('Lootopia');
  await expect(page.getByRole('heading', { level: 1, name: 'Lootopia' })).toBeVisible();
});
