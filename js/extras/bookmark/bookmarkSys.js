const ChromeBookmarkRepository = require("./chromeBookmarkRepository");
const SafariBookmarkRepository = require('./safariBookmarkRepository')
const EdgeBookmarkRepository = require('./edgeBookmarkRepository')

const bookmark = {
  oldImport(name) {
    if(name === 'chrome') {
      ChromeBookmarkRepository.newBookmarkImport()
    } else if(name === 'edge') {
      EdgeBookmarkRepository.newBookmarkImport()
    }
  }
};

module.exports = bookmark;
