const fs = require("fs");
const path = require("path");
const productScraper = require("./productScraper");

async function urlsSaver(data, page) {
  try {
    let productsCategory = data.page
      .split("/")
      .filter((el) => el !== "")
      .pop();
    const productsUrls = data.products.flat(Infinity);
    const jsonObj = {
      Category: productsCategory,
      urls: productsUrls,
    };
    console.log("Начинаю собирать информацию о продуктах...");
    await productScraper.scraper(jsonObj, page);
    /*
    if (!fs.existsSync(path.join(__dirname, '..', 'data', productsCategory))) {
      fs.mkdirSync(path.join(__dirname, '..', 'data', productsCategory));
    }
    fs.open(
      `${path.join(__dirname, '..', 'data', productsCategory)}/${productsCategory}.json`,
      "w",
      (err) => {
        if (err) throw err;
        fs.writeFile(
          `${path.join(__dirname, '..', 'data', productsCategory)}/${productsCategory}.json`,
          JSON.stringify(jsonObj, null, 2),
          (err) => {
            if (err) throw err;
            console.log("файл создан.", productsCategory);
            console.log("Начинаю собирать информацию о продуктах...");
            productScraper.scraper(jsonObj, page);
          }
        );
      }
    );
    */
  } catch (e) {
    throw e;
  }
}

module.exports = {
  urlsSaver,
};
