import { test, expect } from "@playwright/test";

test("landing page loads", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText(/Career Development Centre/i)).toBeVisible();
});

test("login page loads", async ({ page }) => {
  await page.goto("/login");
  await expect(page.getByRole("heading", { name: /Portal login/i })).toBeVisible();
});

test("admin login page loads", async ({ page }) => {
  await page.goto("/admin/login");
  await expect(page.getByRole("heading", { name: /Admin access/i })).toBeVisible();
});
