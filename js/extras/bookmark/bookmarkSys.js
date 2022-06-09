const ChromeBookmarkRepository = require("./chromeBookmarkRepository");
const SafariBookmarkRepository = require('./safariBookmarkRepository')
const EdgeBookmarkRepository = require('./edgeBookmarkRepository')

const bookmark = {
  oldImport(name) {
    if(name === 'chrome') {
      ChromeBookmarkRepository.oldBookmarkImport()
    } else if(name === 'edge') {
      EdgeBookmarkRepository.oldBookmarkImport()
    } else if(name === 'safari') {
      SafariBookmarkRepository.oldBookmarkImport()
    }
  }
};

module.exports = bookmark;
