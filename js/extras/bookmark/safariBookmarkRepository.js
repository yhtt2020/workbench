const fileHelpers = require('../fileHelpers.js')
const plist = require('plist');
const { homedir } = require("os");
var places = require("../../places/places");

class SafariBookmarkRepository {
  brower = "Safari"
  #bookmarkFilePath

  constructor(bookmarkFilePath) {
    this.#bookmarkFilePath = bookmarkFilePath
  }

  getBrowserBookmarks() {
    return new Promise((resolve, reject) => {
      fileHelpers.asyncFileExists(this.#bookmarkFilePath).then(exists => {
        if(exists) {
          fileHelpers.asyncReadFile(this.#bookmarkFilePath).then(data => {
            const jsonParsed = plist.parse(data)
            resolve(jsonParsed)
            // const jsonParsed = JSON.parse(data);
            // const rootsCombined = Object.values(jsonParsed.roots).reduce((combined, currentValue) => {
            //   if(currentValue && currentValue.children) {
            //     combined.children = combined.children.concat(currentValue.children)
            //   }
            //   return combined
            // }, {
            //   children: []
            // })
            // resolve(rootsCombined)
          }).catch(err => reject(`Can't read bookmarks file: ${err}`))
        } else {
          reject(`Bookmark file (${this.bookmarkFilePath}) does not exist`)
        }
      }).catch(error => reject(error))
    })
  }

  //min旧书签方式导入
  static async oldBookmarkImport() {
    const safariBookmarksFilePath = `${homedir()}/Library/Safari/Bookmarks.plist`

    const safariBookmark = new SafariBookmarkRepository(safariBookmarksFilePath)

    const bookmark = await safariBookmark.getBrowserBookmarks()
    console.log(bookmark, '!!!!!!!!!')
  }

}

module.exports = SafariBookmarkRepository
