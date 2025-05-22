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
    await page.getByPlaceholder("Username").fill("Admin")
    await page.getByPlaceholder("Password").fill("admin123")
    await page.locator("button[type='submit']").click()
    await page.waitForTimeout(1800)
    await expect(page).toHaveURL(/.*dashboard\/index/)

    await page.waitForTimeout(500)

    await page.locator("//img[@class='oxd-userdropdown-img']").click()
    await page.waitForTimeout(1500)
    await page.getByText("Logout").click()

    await expect(page).toHaveURL(/.*auth\/login/)
    await page.waitForTimeout(1000)

    await browser.close();
});
