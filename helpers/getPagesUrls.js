const settings = require("../settings/puppeteerSettings");
const scroll = require("./autoScroll");
const saver = require("./urlsSaver");

async function* checkPages(init_url, page) {
  try {
    let isIteration = true;
    for (let i = 1; isIteration; i++) {
      await page.goto(`${init_url}?p=${i}`, settings.PAGE_PUPPETEER_OPTS);
      console.log(`page was goto: ${init_url}?p=${i}`);
      await scroll.autoScroll(page);
      const productUrls = await page.evaluate(() =>
        Array.from(
          document.querySelectorAll(
            "div.product_data__gtm-js > div:nth-child(3) > a:nth-child(1)"
          ),
          (element) => element.href
        )
      );
      if (productUrls.length !== 0) {
        yield productUrls;
      } else {
        isIteration = false;
        yield "stop";
      }
    }
  } catch (e) {
    throw e;
  }
}

async function* openPagesProducts(productPages, page) {
  try {
    const limit = Object.keys(productPages).length;
    const pagesKeys = Object.keys(productPages);
    for (let i = 0; i <= limit; i++) {
      const currentPage = productPages[pagesKeys[i]];
      console.log("Current page: ", currentPage);
      const pageCheck = await startCheckPages(currentPage, page);
      yield pageCheck;
    }
    page.close();
    return resultPages;
  } catch (e) {
    throw e;
  }
}
async function startCheckPages(init_url, page) {
  try {
    let pagesUrls = {page: init_url, products: []};
    let generator = checkPages(init_url, page);
    for await (let value of generator) {
      if (value === "stop") {
        return pagesUrls;
      }
      pagesUrls.products.push(value);
    }
    return pagesUrls;
  } catch (e) {
    throw e;
  }
}
async function startChecker(urls, browser) {
  try {
    const page = await browser.newPage();
    await page.setViewport(settings.VIEWPORT);
    let checker = openPagesProducts(urls, page);
    const pagesKeys = Object.keys(urls);
    for await (let value of checker) {
      console.log(`checking was done.`);
      console.log("result: ", value);
      console.log("saving...");
      saver.urlsSaver(value, page);
    }
  } catch (e) {
    throw e;
  }
}

module.exports = {
  startChecker,
};
