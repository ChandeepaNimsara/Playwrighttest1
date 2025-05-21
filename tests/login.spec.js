const { test, expect, chromium } = require("@playwright/test");

test("Valid Login", async () => {
    const browser = await chromium.launch({
        headless: false,
        args: ['--start-maximized']
    });

    const context = await browser.newContext({
        viewport: null,             // Allow full screen
        deviceScaleFactor: undefined // Remove the default scaling
    });

    const page = await context.newPage();
    await page.goto("https://opensource-demo.orangehrmlive.com/web/index.php/auth/login")
    await page.getByPlaceholder("Username").type("Admin")
    await page.getByPlaceholder("Password").type("admin123")
    await page.locator("button[type='submit']").click()
    await page.waitForTimeout(2000)
    await expect(page).toHaveURL(/.*dashboard\/index/)

    await page.waitForTimeout(800)
    await page.locator("//img[@class='oxd-userdropdown-img']").click()
    await page.waitForTimeout(2000)
    await page.getByText("Logout").click

    await browser.close();
});
