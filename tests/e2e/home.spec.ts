import { expect, test } from "@playwright/test";

test("should display home page", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle(/Abhisek/i);
});
