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
            const jsonParsed = JSON.parse(data);
            const rootsCombined = Object.values(jsonParsed.roots).reduce((combined, currentValue) => {
              if(currentValue && currentValue.children) {
                combined.children = combined.children.concat(currentValue.children)
              }
              return combined
            }, {
              children: []
            })
            resolve(rootsCombined)
          }).catch(err => reject(`Can't read bookmarks file: ${err}`))
        } else {
          reject(`Bookmark file (${this.bookmarkFilePath}) does not exist`)
        }
      }).catch(error => reject(error))
    })
  }

}

module.exports = ChromeBookmarkRepository
