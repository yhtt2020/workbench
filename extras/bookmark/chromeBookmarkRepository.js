const fileHelpers = require('../fileHelpers.js')

const Browser = {
  Edge : "Microsoft Edge",
  Firefox : "Firefox",
  GoogleChrome : "Google Chrome",
}

class ChromeBookmarkRepository {
  brower = Browser.GoogleChrome
  #bookmarkFilePath

  constructor(bookmarkFilePath) {
    this.#bookmarkFilePath = bookmarkFilePath
  }

  getBrowserBookmarks() {
    return new Promise((resolve, reject) => {
      fileHelpers.asyncFileExists(this.#bookmarkFilePath).then(exists => {
        if(exists) {
          fileHelpers.asyncReadFile(this.#bookmarkFilePath).then(data => {

          })
        }
      })
    })
  }
}
