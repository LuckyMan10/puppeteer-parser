const fs = require("fs");
const path = require("path");
const settings = require("../settings/puppeteerSettings");
const save = require("./saveJSON");

async function* getDescription(lengthOfPref, page) {
  try {
    const prefData = [];
    const defaultSelector =
      "#content > div.js--TabContent.TabContent.Tabs__content > div > div > div";
    for (let i = 1; i < lengthOfPref; i++) {
      const prefTitle = await page.$eval(
        `${defaultSelector}:nth-child(${i}) > h4`,
        (element) => element.innerText
      );
      const prefNames = await page.evaluate(
        (defaultSelector, i) => {
          return Array.from(
            document.querySelectorAll(
              `${defaultSelector}:nth-child(${i}) > div > div > div.Specifications__column.Specifications__column_name`
            ),
            (element) => element.innerText
          );
        },
        defaultSelector,
        i
      );
      const prefValues = await page.evaluate(
        (defaultSelector, i) => {
          return Array.from(
            document.querySelectorAll(
              `${defaultSelector}:nth-child(${i}) > div > div > div.Specifications__column.Specifications__column_value`
            ),
            (element) => element.innerText
          );
        },
        defaultSelector,
        i
      );
      function prefBlock(prefTitle, prefNames, prefValues) {
        let prefObj = {};
        prefObj.title = prefTitle;
        prefNames.forEach((el, index) => {
          prefObj[el] = prefValues[index];
        });
        return prefObj;
      }
      const result = prefBlock(prefTitle, prefNames, prefValues);
      prefData.push(result);
    }
    yield prefData;
  } catch (e) {
    throw e;
  }
}

async function* urlsChecker(urls, page) {
  try {
    const productObj = {};
    for (let i = 0; i <= urls.length; i++) {
      await page.goto(`${urls[i]}properties/`, settings.PAGE_PUPPETEER_OPTS);
      console.log(`Сейчас я на странице ${urls[i]}`);

      const imgUrls = await page.evaluate(() => {
        return Array.from(
          document.querySelectorAll(
            "div.swiper-slide.PreviewList__li.PreviewList__item > img"
          ),
          (element) => element.src
        );
      });
      const uniqImages = [...new Set(imgUrls)];
      const name = await page.$eval(
        ".ProductHeader__title",
        (el) => el.innerText
      );
      const productName = name.split(" ").slice(1).join(" ");
      const price = await page.$eval(
        ".ProductHeader__price-default_current-price",
        (el) => el.innerText
      );
      const lengthOfPref = await page.evaluate(
        () =>
          Array.from(
            document.querySelectorAll(
              "#content > div.js--TabContent.TabContent.Tabs__content > div > div > div > div.Specifications"
            )
          ).length
      );
      productObj.name = productName;
      productObj.price = price;
      productObj.images = uniqImages;
      const generator = getDescription(lengthOfPref, page);
      for await (let value of generator) {
        productObj.description = value;
      }
      yield productObj;
    }
  } catch (e) {
    throw e;
  }
}

async function scraper(data, page) {
  try {
    const { Category, urls } = data;
    const generator = urlsChecker(urls, page);
    for await (let value of generator) {
      await save.saveJSON(Category, value);
    }
  } catch (e) {
    throw e;
  }
}

module.exports = {
  scraper,
};
