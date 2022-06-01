var places = require("places/places.js");
// var urlParser = require("util/urlParser.js");
// var settings = require("util/settings/settings.js");
const chromeBookmarkRepository = require("./chromeBookmarkRepository");
const { platform, homedir } = require("os");

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

//min老书签的模式
const oldBookmarkSys = {
  async import() {
    try {
      const chromeBookmarksFilePath =
        platform() === "darwin"
          ? `${homedir()}/Library/Application Support/Google/Chrome/Default/Bookmarks`
          : `${homedir()}\\AppData\\Local\\Google\\Chrome\\User Data\\Default\\Bookmarks`;

      const chromeBookmark = new chromeBookmarkRepository(
        chromeBookmarksFilePath
      );
      const bookmark = await chromeBookmark.getBrowserBookmarks();
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
    } catch (error) {
      console.log(error, '书签导入失败')
    }
  },
};

module.exports = oldBookmarkSys;
