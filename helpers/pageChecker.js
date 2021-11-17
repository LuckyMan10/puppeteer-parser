const puppeteer = require("puppeteer");
const cheerio = require("cheerio");
const fs = require("fs");
const settings = require("../settings/puppeteerSettings");
const scroll = require("./autoScroll");
const pageChecker = require("./getPagesUrls");

async function getPageContent(urls) {
  try {
    const browser = await puppeteer.launch(settings.LAUNCH_PUPPETEER_OPTS);
    const result = await pageChecker.startChecker(urls, browser);
    console.log(result);
    return result;
  } catch (e) {
    throw e;
  }
}

module.exports = {
    getPageContent
}








