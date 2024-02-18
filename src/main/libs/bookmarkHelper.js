const fileHelpers = require('../../../js/extras/fileHelpers')
const { platform, homedir } = require('os')
const bookmarkHelper = {
  importEdgeBookmark () {
    const edgeBookmarksFilePath =
      platform() === 'darwin'
        ? `${homedir()}/Library/Application Support/Microsoft Edge/Default/Bookmarks`
        : `${homedir()}\\AppData\\Local\\Microsoft\\Edge\\User Data\\Default\\Bookmarks`
    return new Promise((resolve, reject) => {
      fileHelpers.asyncFileExists(edgeBookmarksFilePath).then(exists => {
        if (exists) {
          fileHelpers.asyncReadFile(edgeBookmarksFilePath).then(data => {
            const jsonParsed = JSON.parse(data)
            const rootsCombined = Object.values(jsonParsed.roots).reduce((combined, currentValue) => {
              if (currentValue && currentValue.children) {
                combined.children = combined.children.concat(currentValue.children)
              }
              return combined
            }, {
              children: []
            })
            resolve(rootsCombined)
          }).catch(err => reject(`Can't read bookmarks file: ${err}`))
        } else {
          reject(`Bookmark file (${edgeBookmarksFilePath}) does not exist`)
        }
      }).catch(error => reject(error))
    })
  },
  importChromeBookmark(){
    const chromeBookmarksFilePath =
      platform() === "darwin"
        ? `${homedir()}/Library/Application Support/Google/Chrome/Default/Bookmarks`
        : `${homedir()}\\AppData\\Local\\Google\\Chrome\\User Data\\Default\\Bookmarks`;
    return new Promise((resolve, reject) => {
      fileHelpers.asyncFileExists(chromeBookmarksFilePath).then(exists => {
        if(exists) {
          fileHelpers.asyncReadFile(chromeBookmarksFilePath).then(data => {
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
          reject(`Bookmark file (${chromeBookmarksFilePath}) does not exist`)
        }
      }).catch(error => reject(error))
    })
  }
}
module.exports=bookmarkHelper
