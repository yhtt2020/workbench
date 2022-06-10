const fileHelpers = require('../fileHelpers.js')
const { platform, homedir } = require("os");
var places = require("../../places/places");
const ipc = require('electron').ipcRenderer

class EdgeBookmarkRepository {
  brower = "Microsoft Edge"
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

  //min旧书签方式导入
  static async oldBookmarkImport() {
    //递归处理层级书签
    function recur(arr, newarr, tag) {
      arr.forEach((e) => {
        if (e.children) {
          recur(e.children, newarr, e.name);
        } else {
          e.tag = tag ?? "";
          newarr.push(e);
        }
      });
    }

    try {
      const edgeBookmarksFilePath =
        platform() === "darwin"
          ? `${homedir()}/Library/Application Support/Microsoft Edge/Default/Bookmarks`
          : `${homedir()}\\AppData\\Local\\Microsoft\\Edge\\User Data\\Default\\Bookmarks`;

      const edgeBookmark = new EdgeBookmarkRepository(
        edgeBookmarksFilePath
      );
      const bookmark = await edgeBookmark.getBrowserBookmarks();
      console.log(bookmark);

      let newBookmark = [];
      recur(bookmark.children, newBookmark);

      //开始往db导入书签数据
      newBookmark.forEach((v) => {
        const data = {
          title: v.name,
          isBookmarked: true,
          tags: v.tag !== "" ? [v.tag] : [],
          lastVisit: Date.now(),
        };
        places.updateItem(v.url, data, () => {});
      });
      setTimeout(() => {
        ipc.send('message',{type:'success',config:{content: 'Edge书签导入成功', key: Date.now()}})
        ipc.send('afterMigration')
      }, 5000)
    } catch (error) {
      ipc.send('message',{type:'error',config:{content: `Edge书签导入失败!${error}!`, key: Date.now()}})
    }
  }

}

module.exports = EdgeBookmarkRepository
