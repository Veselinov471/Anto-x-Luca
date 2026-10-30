import { test, expect } from "@playwright/test";

async function dismissConsent(page: import("@playwright/test").Page) {
  const cookieDialog = page.locator('[role="dialog"]').filter({
    has: page.getByRole("button", { name: /необходим|Necessary|Приемам|Accept/i }),
  });
  if (await cookieDialog.isVisible().catch(() => false)) {
    await cookieDialog.getByRole("button").first().click();
  }
}

test("product CTA opens waitlist modal", async ({ page }) => {
  await page.goto("/");
  await dismissConsent(page);

  await page.locator("#collection").scrollIntoViewIfNeeded();
  await page.getByRole("button", { name: "Искам този модел" }).first().click();

  const modal = page.getByRole("dialog", { name: /Ранен достъп за този модел/i });
  await expect(modal).toBeVisible();
  await expect(modal.locator('input[name="preferredProducts"][value="PRODUCT_01"]')).toBeChecked();

  await modal.getByRole("button", { name: "Затвори" }).click();
  await expect(modal).toHaveCount(0);
});

test("Bulgarian landing → waitlist", async ({ page }) => {
  await page.goto("/");
  await dismissConsent(page);

  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Италианска елегантност",
  );

  await page.locator("#waitlist").scrollIntoViewIfNeeded();
  await page.locator('#waitlist input[name="email"]').fill(`test+${Date.now()}@example.com`);
  await page.locator('#waitlist input[name="preferredProducts"][value="PRODUCT_01"]').check();
  await page.locator('#waitlist input[name="consentMarketing"]').check();
  await page.locator("#waitlist").getByRole("button", { name: "Искам ранен достъп" }).click();
  await expect(page.locator("#waitlist").getByRole("status")).toContainText("Записани сте", {
    timeout: 15_000,
  });
});

test("English landing → waitlist", async ({ page }) => {
  await page.goto("/en");
  await dismissConsent(page);

  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Italian elegance",
  );

  await page.locator("#waitlist").scrollIntoViewIfNeeded();
  await page.locator('#waitlist input[name="email"]').fill(`test+en+${Date.now()}@example.com`);
  await page.locator('#waitlist input[name="preferredProducts"][value="PRODUCT_02"]').check();
  await page.locator('#waitlist input[name="consentMarketing"]').check();
  await page.locator("#waitlist").getByRole("button", { name: "Get early access" }).click();
  await expect(page.locator("#waitlist").getByRole("status")).toContainText("You’re on the list", {
    timeout: 15_000,
  });
});

test("euro prices visible", async ({ page }) => {
  await page.goto("/#collection");
  await dismissConsent(page);
  await expect(page.locator("#collection")).toContainText("€");
  await expect(page.locator("#collection")).not.toContainText("лв");
});
