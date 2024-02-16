const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
require('chromedriver');

async function scrapeSmartphones() {
    let options = new chrome.Options();
    // Uncomment the next line to run Chrome in headless mode
    // options.addArguments('--headless');

    let driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(options)
        .build();

    try {
        await driver.get('https://www.jumia.com.ng/smartphones/');
        await driver.wait(until.elementLocated(By.css('.-paxs.row._no-g._4cl-3cm-shs')), 10000);

        // Scrape all product names and prices
        const productElements = await driver.findElements(By.css('.-paxs.row._no-g._4cl-3cm-shs .info'));
        for (const productElement of productElements) {
            const productNameElement = await productElement.findElement(By.css('.name'));
            const productPriceElement = await productElement.findElement(By.css('.info .prc'));
            const productPrice = await productPriceElement.getText();
            const productName = await productNameElement.getText();
            console.log(`Product Name: ${productName} , Price: ${productPrice}`);
            console.log('-------------------------------------------------------------------------------------------------------------------');
        }
    } catch (error) {
        console.error('Scraping failed:', error);
    } finally {
        await driver.quit();
    }
}

(async function main() {
    await scrapeSmartphones();
})();

