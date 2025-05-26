const { test, expect, chromium } = require("@playwright/test");

// Common test wrapper
async function runTest(testLogic) {
  const browser = await chromium.launch({ headless: false });

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });

  const page = await context.newPage();

  // Log browser console output
  page.on('console', msg => {
    console.log(`Console Log [${msg.type()}]: ${msg.text()}`);
  });

  // Open login page
  await page.goto("https://opensource-demo.orangehrmlive.com/web/index.php/auth/login");
  await page.waitForTimeout(3000); // Optional: for visibility during manual watching

  // Run actual test logic
  await testLogic(page);

  await browser.close();
}

test.describe("Login Test Cases", () => {

  test("TC1 - Valid Login", async () => {
    await runTest(async (page) => {
      await page.getByPlaceholder("Username").fill("Admin");
      await page.getByPlaceholder("Password").fill("admin123");
      await page.waitForTimeout(2000);
      await page.locator("button[type='submit']").click();
      await expect(page).toHaveURL(/.*dashboard\/index/);

      await page.locator("//img[@class='oxd-userdropdown-img']").click();
      await page.waitForTimeout(2000);
      await page.getByText("Logout").click();
      await expect(page).toHaveURL(/.*auth\/login/);
    });
  });

  test("TC2 - Invalid Login username/password", async () => {
    await runTest(async (page) => {
      await page.getByPlaceholder("Username").fill("abc");
      await page.getByPlaceholder("Password").fill("admin");
      await page.waitForTimeout(2000);
      await page.locator("button[type='submit']").click();
      await expect(page.locator(".oxd-alert-content-text")).toBeVisible();
    });
  });

  test("TC3 - Valid username and invalid password", async () => {
    await runTest(async (page) => {
      await page.getByPlaceholder("Username").fill("Admin");
      await page.getByPlaceholder("Password").fill("WrongPass");
      await page.waitForTimeout(2000);
      await page.locator("button[type='submit']").click();

      const alert = page.locator(".oxd-alert-content-text");
      await expect(alert).toBeVisible({ timeout: 10000 }); // wait up to 10s
      await expect(alert).toHaveText("Invalid credentials");
    });
  });

  test("TC4 - Invalid username and valid password", async () => {
    await runTest(async (page) => {
      await page.getByPlaceholder("Username").fill("WrongUsername");
      await page.getByPlaceholder("Password").fill("admin123");
      await page.waitForTimeout(2000);
      await page.locator("button[type='submit']").click();

      const alert = page.locator(".oxd-alert-content-text");
      await expect(alert).toBeVisible({ timeout: 10000 }); // wait up to 10s
      await expect(alert).toHaveText("Invalid credentials");
    });
  });

  test("TC5 - Empty username and password", async () => {
    await runTest(async (page) => {
      await page.waitForTimeout(2000);
      await page.locator("button[type='submit']").click();
  
      const alerts = page.locator(".oxd-input-field-error-message");
  
      // First check the number of validation messages
      await expect(alerts).toHaveCount(2);
  
      // Check each one individually
      await expect(alerts.nth(0)).toBeVisible();
      await expect(alerts.nth(1)).toBeVisible();
  
      // Optional: check if both have text 'Required'
      await expect(alerts.nth(0)).toHaveText("Required");
      await expect(alerts.nth(1)).toHaveText("Required");
    });
  });
  

});
