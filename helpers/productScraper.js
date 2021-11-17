const fs = require("fs");
const path = require("path");
const settings = require("../settings/puppeteerSettings");


async function* getDataProducts(urls, page) {
    try {
        for(let i = 0; i <= urls.length; i++) {
            await page.goto(urls[i], settings.PAGE_PUPPETEER_OPTS);
            console.log(`scraping on ${urls[i]}`);
            const imgUrls = await page.evaluate(() => Array.from(document.querySelectorAll('.Image'), element => element.src));
            //await page.evaluate(() => Array.from(document.querySelectorAll('.sc-iqsfdx'), element => element.src));
            const name = await page.$eval('.ProductHeader__title', el => el.innerText);
            const price = await page.$eval('.ProductHeader__price-default_current-price', el => el.innerText);
            const description;
        }
    } catch(e) {
        throw e;
    }
}

async function scraper(data, page) {
  try {
  if (!fs.existsSync(path.join(__dirname, "..", "data", data.Category))) {
    fs.mkdirSync(path.join(__dirname, "..", "data", data.Category));
  }
  let generator = getDataProducts(data.urls, page);
  for await(let value of generator) {

  }
  } catch(e) {
      throw e;
  }
}

module.exports = {
  scraper,
};
