// defines schema for the browsingData database
// requires Dexie.min.js

if (typeof Dexie === 'undefined' && typeof require !== 'undefined') {
  var Dexie = require('dexie')
}

var dbErrorMessage = 'Internal error opening backing store for indexedDB.open'
var dbErrorAlertShown = false

var db = new Dexie('browsingData2')

db.version(11).stores({
  /*
  color - the main color of the page, extracted from the page icon
  pageHTML - a saved copy of the page's HTML, when it was last visited. Removed in 1.6.0, so all pages visited after then will have an empty string in this field.
  extractedText - the text content of the page, extracted from pageHTML. Unused as of 1.7.0, should be removed completely in a future version.
  searchIndex - an array of words on the page (created from extractedText), used for full-text searchIndex
  isBookmarked - whether the page is a bookmark
  extraData - other metadata about the page
  */
  places: '++id, &url, title, color, visitCount, lastVisit, pageHTML, extractedText, *searchIndex, isBookmarked, *tags, metadata',
  readingList: 'url, time, visitCount, pageHTML, article, extraData', // TODO remove this (reading list is no longer used)
  myApps:'++id,name,summary,url,icon,addTime,sort', // 我的应用表
  mySearch: '++id,name,slinkLogo,frontLink,sDefault', // 我的搜索引擎
  accounts: '++id,&uid,nickname,avatar,lastLoginTime,token,isCurrent,lastUseSpace',//本地已经登陆过的账号
  localSpaces: '++id,uid,tasks,name,lastUseTime,createTime,icon',
  system: '++id,&name,value'
})

/*system的keyalue的值备注*/
//currentUser 当前登陆的user

db.open().then(function () {
  console.log('database opened ', performance.now())
}).catch(function (error) {
  if (error.message.indexOf(dbErrorMessage) !== -1 && !dbErrorAlertShown) {
    window && window.alert && window.alert(l('multipleInstancesErrorMessage'))
    ipc.send('quit')

    dbErrorAlertShown = true
  }
})

if (typeof module !== 'undefined') {
  module.exports = { db }
}
