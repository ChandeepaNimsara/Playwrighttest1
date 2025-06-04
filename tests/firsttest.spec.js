const {test, expect} = require('@playwright/test')

/*TC format
test('Launch application', async({page}) => {
}) */

 test('Launch application', async({page}) => {
    await page.goto('https://www.parasoft.com/')
    await expect(page).toHaveTitle('Automated Testing to Deliver Superior Quality Software | Parasoft')
}) 