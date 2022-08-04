const ChromeBookmarkRepository = require("./chromeBookmarkRepository");
const SafariBookmarkRepository = require('./safariBookmarkRepository')
const EdgeBookmarkRepository = require('./edgeBookmarkRepository')
const BaseBookmarkRepository = require('./baseBookmarkRepository')

const bookmark = {
  oldImport(name) {
    if(name === 'chrome') {
      ChromeBookmarkRepository.newBookmarkImport()
    } else if(name === 'edge') {
      EdgeBookmarkRepository.newBookmarkImport()
    }
  },
  async htmlImport() {
    const fileRes = await BaseBookmarkRepository.readHtmlFile()
    const dealedBookmark = BaseBookmarkRepository.htmlDeal(fileRes)
    BaseBookmarkRepository.importHtml(dealedBookmark)
  }
};

module.exports = bookmark;
