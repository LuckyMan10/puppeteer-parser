const cheerio = require("cheerio");
const puppeteer = require("./helpers/pageChecker");
const urls = require("./urlData");

async function main(pageUrls) {
  try {
    await puppeteer.getPageContent(pageUrls);
    console.log('Кажется я все.')
    return null;
  } catch (e) {
    console.log(e);
  }
}
main(urls);