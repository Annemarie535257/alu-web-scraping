const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const fs = require('fs');
const Table = require('cli-table3'); // Import cli-table3 library
require('chromedriver');

async function scrapeSmartphones() {
    let options = new chrome.Options();
    // Uncomment the next line to run Chrome in headless mode
    // options.addArguments('--headless');

    let driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(options)
        .build();

    let scrapedData = [];

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
            scrapedData.push({ productName, productPrice });
        }

        // Generate HTML table
        const htmlTable = generateHtmlTable(scrapedData);
        // Write HTML table to a separate HTML file
        fs.writeFileSync('scraped_data.html', htmlTable);
        console.log('HTML table has been saved to scraped_data.html');
    } catch (error) {
        console.error('Scraping failed:', error);
    } finally {
        await driver.quit();
    }
}

function generateHtmlTable(data) {
    let htmlTable = '<table border="1">';
    // Add table headers
    htmlTable += '<tr><th>Product Name</th><th>Price</th></tr>';
    // Add table rows
    data.forEach(item => {
        htmlTable += `<tr><td>${item.productName}</td><td>${item.productPrice}</td></tr>`;
    });
    htmlTable += '</table>';
    return htmlTable;
}

(async function main() {
    await scrapeSmartphones();
})();
