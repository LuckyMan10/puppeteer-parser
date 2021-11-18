const fs = require("fs");
const path = require("path");
const util = require("util");

async function saveJSON(Category, value) {
  const makeDir = util.promisify(fs.mkdir);
  const openFile = util.promisify(fs.open);
  const writeFile = util.promisify(fs.writeFile);
  let fileName = value.name;
  if(fileName.includes('/')) {
    fileName = fileName.replace(/\//g, ' ');
  }
  console.log("Сохраняю файл...");
  if (!fs.existsSync(path.join(__dirname, "..", "data", fileName))) {
    await makeDir(path.join(__dirname, "..", "data", fileName));
  }
  await writeFile(
    `${path.join(__dirname, "..", "data", fileName)}/${fileName}.json`,
    JSON.stringify(value, null, 2),
    (err) => {
      if (err) throw err;
      console.log("файл сохранен.", fileName);
    }
  );
}

module.exports = {
  saveJSON,
};
