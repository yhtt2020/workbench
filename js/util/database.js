// defines schema for the browsingData database
// requires Dexie.min.js

if (typeof Dexie === 'undefined' && typeof require !== 'undefined') {
  var Dexie = require('dexie')
}

var dbErrorMessage = 'Internal error opening backing store for indexedDB.open'
var dbErrorAlertShown = false

var db = new Dexie('browsingData2')


db.version(143).stores({
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
  myApps:'++id,name,summary,url,icon,addTime,sort,listId', // 我的应用表
  mySearch: '++id,name,slinkLogo,frontLink,sDefault', // 我的搜索引擎
  accounts: '++id,&uid,nickname,avatar,lastLoginTime,code,token,isCurrent,lastUseSpace',//本地已经登录过的帐号
  localSpaces: '++id,uid,tasks,data,name,lastUseTime,createTime,icon',
  system: '++id,&name,value',
  dockApps:'++id,name,url,icon,order',
  appList:'++id,name,createTime,updateTime,order,summary,appsCount,parentId,type,path,sort',//应用列表 type:0.默认，大图标,1.小图标,2.列表  path存储路径树，便于后面查询
  standAloneApps:'++id,name,package,logo,summary,type,url,themeColor,userThemeColor,createTime,updateTime,accountAvatar,order,useCount,lastExecuteTime,settings,unreadCount,*fileAssign',
  userStats: '++id,scripts,apps,appsExecutedCounts,blockAds,tasks,tabs,webviewsInk,password,defaultBrowser,searchCounts,translateCounts,startTime,appList,myApps',  //脚本数，应用数，开启应用的次数，广告拦截数，标签组数，标签数，访问网站累计数，密码数，是否是默认浏览器，搜索数（只对用tab栏选中后输入搜索内容用默认搜索引擎进行搜索的统计），翻译次数， 此次开始时间，本地导航列表数，本地导航应用app数
  messages: '++id,messageType,title,body,indexName,timestamp',
  download:'startTime,title,total,path,url'
}).upgrade(trans=> {
  // return trans.standAloneApps.modify (item => {
  //   if(!!!item.type){
  //     item.type=0
  //   }
  // })
})
db.version(150).stores({
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
  myApps:'++id,name,summary,url,icon,addTime,sort,listId', // 我的应用表
  mySearch: '++id,name,slinkLogo,frontLink,sDefault', // 我的搜索引擎
  accounts: '++id,&uid,nickname,avatar,lastLoginTime,code,token,isCurrent,lastUseSpace',//本地已经登录过的帐号
  localSpaces: '++id,uid,tasks,name,lastUseTime,createTime,icon',
  system: '++id,&name,value',
  dockApps:'++id,name,url,icon,order',
  appList:'++id,name,createTime,updateTime,order,summary,appsCount,parentId,type,path,sort',//应用列表 type:0.默认，大图标,1.小图标,2.列表  path存储路径树，便于后面查询
  standAloneApps:'++id,name,package,logo,summary,type,url,themeColor,userThemeColor,createTime,updateTime,accountAvatar,order,useCount,lastExecuteTime,settings,unreadCount,*fileAssign',
  userStats: '++id,scripts,apps,appsExecutedCounts,blockAds,tasks,tabs,webviewsInk,password,defaultBrowser,searchCounts,translateCounts,startTime,appList,myApps',  //脚本数，应用数，开启应用的次数，广告拦截数，标签组数，标签数，访问网站累计数，密码数，是否是默认浏览器，搜索数（只对用tab栏选中后输入搜索内容用默认搜索引擎进行搜索的统计），翻译次数， 此次开始时间，本地导航列表数，本地导航应用app数
  messages: '++id,messageType,title,body,indexName,timestamp',
  download:'&startTime,title,total,path,url,doneDate,status'
}).upgrade(trans=> {
  // return trans.standAloneApps.modify (item => {
  //   if(!!!item.type){
  //     item.type=0
  //   }
  // })
})

db.version(151).stores({
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
  myApps:'++id,name,summary,url,icon,addTime,sort,listId', // 我的应用表
  mySearch: '++id,name,slinkLogo,frontLink,sDefault', // 我的搜索引擎
  accounts: '++id,&uid,nickname,avatar,lastLoginTime,code,token,isCurrent,lastUseSpace',//本地已经登录过的帐号
  localSpaces: '++id,uid,tasks,name,lastUseTime,createTime,icon',
  system: '++id,&name,value',
  dockApps:'++id,name,url,icon,order',
  appList:'++id,name,createTime,updateTime,order,summary,appsCount,parentId,type,path,sort',//应用列表 type:0.默认，大图标,1.小图标,2.列表  path存储路径树，便于后面查询
  standAloneApps:'++id,name,package,logo,summary,type,url,themeColor,userThemeColor,createTime,updateTime,accountAvatar,order,useCount,lastExecuteTime,settings,unreadCount,*fileAssign',
  userStats: '++id,scripts,apps,appsExecutedCounts,blockAds,tasks,tabs,webviewsInk,password,defaultBrowser,searchCounts,translateCounts,startTime,appList,myApps',  //脚本数，应用数，开启应用的次数，广告拦截数，标签组数，标签数，访问网站累计数，密码数，是否是默认浏览器，搜索数（只对用tab栏选中后输入搜索内容用默认搜索引擎进行搜索的统计），翻译次数， 此次开始时间，本地导航列表数，本地导航应用app数
  messages: '++id,messageType,title,body,indexName,timestamp',
  download:'&startTime,title,total,path,url,doneDate,status,href'
}).upgrade(trans=> {
  // return trans.standAloneApps.modify (item => {
  //   if(!!!item.type){
  //     item.type=0
  //   }
  // })
})

db.version(152).stores({
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
  myApps:'++id,name,summary,url,icon,addTime,sort,listId', // 我的应用表
  mySearch: '++id,name,slinkLogo,frontLink,sDefault', // 我的搜索引擎
  accounts: '++id,&uid,nickname,avatar,lastLoginTime,code,token,isCurrent,lastUseSpace',//本地已经登录过的帐号
  localSpaces: '++id,uid,tasks,name,lastUseTime,createTime,icon',
  system: '++id,&name,value',
  dockApps:'++id,name,url,icon,order',
  appList:'++id,name,createTime,updateTime,order,summary,appsCount,parentId,type,path,sort',//应用列表 type:0.默认，大图标,1.小图标,2.列表  path存储路径树，便于后面查询
  standAloneApps:'++id,name,package,logo,summary,type,url,themeColor,userThemeColor,createTime,updateTime,accountAvatar,order,useCount,lastExecuteTime,settings,unreadCount,*fileAssign',
  userStats: '++id,scripts,apps,appsExecutedCounts,blockAds,tasks,tabs,webviewsInk,password,defaultBrowser,searchCounts,translateCounts,startTime,appList,myApps',  //脚本数，应用数，开启应用的次数，广告拦截数，标签组数，标签数，访问网站累计数，密码数，是否是默认浏览器，搜索数（只对用tab栏选中后输入搜索内容用默认搜索引擎进行搜索的统计），翻译次数， 此次开始时间，本地导航列表数，本地导航应用app数
  messages: '++id,messageType,avatar,title,body,indexName,timestamp',
  download:'&startTime,title,total,path,url,doneDate,status,href'
}).upgrade(trans=> {
  // return trans.standAloneApps.modify (item => {
  //   if(!!!item.type){
  //     item.type=0
  //   }
  // })
})

db.version(153).stores({
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
  myApps:'++id,name,summary,url,icon,addTime,sort,listId', // 我的应用表
  mySearch: '++id,name,slinkLogo,frontLink,sDefault', // 我的搜索引擎
  accounts: '++id,&uid,nickname,avatar,lastLoginTime,code,token,isCurrent,lastUseSpace',//本地已经登录过的帐号
  localSpaces: '++id,uid,tasks,name,lastUseTime,createTime,icon',
  system: '++id,&name,value',
  dockApps:'++id,name,url,icon,order',
  appList:'++id,name,createTime,updateTime,order,summary,appsCount,parentId,type,path,sort',//应用列表 type:0.默认，大图标,1.小图标,2.列表  path存储路径树，便于后面查询
  standAloneApps:'++id,name,package,logo,summary,type,url,themeColor,userThemeColor,createTime,updateTime,accountAvatar,order,useCount,lastExecuteTime,settings,unreadCount,*fileAssign,auth',
  userStats: '++id,scripts,apps,appsExecutedCounts,blockAds,tasks,tabs,webviewsInk,password,defaultBrowser,searchCounts,translateCounts,startTime,appList,myApps',  //脚本数，应用数，开启应用的次数，广告拦截数，标签组数，标签数，访问网站累计数，密码数，是否是默认浏览器，搜索数（只对用tab栏选中后输入搜索内容用默认搜索引擎进行搜索的统计），翻译次数， 此次开始时间，本地导航列表数，本地导航应用app数
  messages: '++id,messageType,avatar,title,body,indexName,timestamp',
  download:'&startTime,title,total,path,url,doneDate,status,href'
}).upgrade(trans=> {
  // return trans.standAloneApps.modify (item => {
  //   if(!!!item.type){
  //     item.type=0
  //   }
  // })
})
db.version(154).stores({
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
  myApps:'++id,name,summary,url,icon,addTime,sort,listId', // 我的应用表
  mySearch: '++id,name,slinkLogo,frontLink,sDefault', // 我的搜索引擎
  accounts: '++id,&uid,nickname,avatar,lastLoginTime,code,token,isCurrent,lastUseSpace',//本地已经登录过的帐号
  localSpaces: '++id,uid,tasks,name,lastUseTime,createTime,icon',
  system: '++id,&name,value',
  dockApps:'++id,name,url,icon,order',
  appList:'++id,name,createTime,updateTime,order,summary,appsCount,parentId,type,path,sort',//应用列表 type:0.默认，大图标,1.小图标,2.列表  path存储路径树，便于后面查询
  standAloneApps:'++id,name,package,logo,summary,type,url,themeColor,userThemeColor,createTime,updateTime,accountAvatar,order,useCount,lastExecuteTime,settings,unreadCount,*fileAssign,auth,isNew',
  userStats: '++id,scripts,apps,appsExecutedCounts,blockAds,tasks,tabs,webviewsInk,password,defaultBrowser,searchCounts,translateCounts,startTime,appList,myApps',  //脚本数，应用数，开启应用的次数，广告拦截数，标签组数，标签数，访问网站累计数，密码数，是否是默认浏览器，搜索数（只对用tab栏选中后输入搜索内容用默认搜索引擎进行搜索的统计），翻译次数， 此次开始时间，本地导航列表数，本地导航应用app数
  messages: '++id,messageType,avatar,title,body,indexName,timestamp',
  download:'&startTime,title,total,path,url,doneDate,status,href'
}).upgrade(trans=> {
  // return trans.standAloneApps.modify (item => {
  //   if(!!!item.type){
  //     item.type=0
  //   }
  // })
})

db.version(156).stores({
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
  myApps:'++id,name,summary,url,icon,addTime,sort,listId', // 我的应用表
  mySearch: '++id,name,slinkLogo,frontLink,sDefault', // 我的搜索引擎
  accounts: '++id,&uid,nickname,avatar,lastLoginTime,code,token,isCurrent,lastUseSpace',//本地已经登录过的帐号
  localSpaces: '++id,uid,tasks,name,lastUseTime,createTime,icon',
  system: '++id,&name,value',
  dockApps:'++id,name,url,icon,order',
  appList:'++id,name,createTime,updateTime,order,summary,appsCount,parentId,type,path,sort',//应用列表 type:0.默认，大图标,1.小图标,2.列表  path存储路径树，便于后面查询
  standAloneApps:'++id,name,package,logo,summary,type,url,themeColor,userThemeColor,createTime,updateTime,accountAvatar,order,useCount,lastExecuteTime,settings,unreadCount,*fileAssign,auth,isNew',
  userStats: '++id,scripts,apps,appsExecutedCounts,blockAds,tasks,tabs,webviewsInk,password,defaultBrowser,searchCounts,translateCounts,startTime,appList,myApps',  //脚本数，应用数，开启应用的次数，广告拦截数，标签组数，标签数，访问网站累计数，密码数，是否是默认浏览器，搜索数（只对用tab栏选中后输入搜索内容用默认搜索引擎进行搜索的统计），翻译次数， 此次开始时间，本地导航列表数，本地导航应用app数
  messages: '++id,messageType,avatar,title,body,indexName,timestamp',
  download:'&startTime,title,total,path,url,doneDate,status,href,addTime'
}).upgrade(trans=> {
  // return trans.standAloneApps.modify (item => {
  //   if(!!!item.type){
  //     item.type=0
  //   }
  // })
})
db.version(161).stores({
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
  myApps:'++id,name,summary,url,icon,addTime,sort,listId', // 我的应用表
  mySearch: '++id,name,slinkLogo,frontLink,sDefault', // 我的搜索引擎
  accounts: '++id,&uid,nickname,avatar,lastLoginTime,code,token,isCurrent,lastUseSpace',//本地已经登录过的帐号
  localSpaces: '++id,uid,tasks,name,lastUseTime,createTime,icon',
  system: '++id,&name,value',
  dockApps:'++id,name,url,icon,order',
  appList:'++id,name,createTime,updateTime,order,summary,appsCount,parentId,type,path,sort',//应用列表 type:0.默认，大图标,1.小图标,2.列表  path存储路径树，便于后面查询
  standAloneApps:'++id,name,package,logo,summary,type,url,themeColor,userThemeColor,createTime,updateTime,accountAvatar,order,useCount,lastExecuteTime,settings,unreadCount,*fileAssign,auth,isNew',
  userStats: '++id,scripts,apps,appsExecutedCounts,blockAds,tasks,tabs,webviewsInk,password,defaultBrowser,searchCounts,translateCounts,startTime,appList,myApps',  //脚本数，应用数，开启应用的次数，广告拦截数，标签组数，标签数，访问网站累计数，密码数，是否是默认浏览器，搜索数（只对用tab栏选中后输入搜索内容用默认搜索引擎进行搜索的统计），翻译次数， 此次开始时间，本地导航列表数，本地导航应用app数
  messages: '++id,messageType,avatar,title,body,indexName,timestamp',
  download:'&startTime,title,total,path,url,doneDate,status,href,addTime',
  taskStash:'++id,taskData,createTime,remark'
}).upgrade(trans=> {
  // return trans.standAloneApps.modify (item => {
  //   if(!!!item.type){
  //     item.type=0
  //   }
  // })
})

db.version(163).stores({
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
  myApps:'++id,name,summary,url,icon,addTime,sort,listId', // 我的应用表
  mySearch: '++id,name,slinkLogo,frontLink,sDefault', // 我的搜索引擎
  accounts: '++id,&uid,nickname,avatar,lastLoginTime,code,token,isCurrent,lastUseSpace',//本地已经登录过的帐号
  localSpaces: '++id,uid,tasks,name,lastUseTime,createTime,icon',
  system: '++id,&name,value',
  dockApps:'++id,name,url,icon,order',
  appList:'++id,name,createTime,updateTime,order,summary,appsCount,parentId,type,path,sort',//应用列表 type:0.默认，大图标,1.小图标,2.列表  path存储路径树，便于后面查询
  standAloneApps:'++id,name,package,logo,summary,type,url,themeColor,userThemeColor,createTime,updateTime,accountAvatar,order,useCount,lastExecuteTime,settings,unreadCount,*fileAssign,auth,isNew,attribute',//新增两个字段方便应用市场查找筛选
  userStats: '++id,scripts,apps,appsExecutedCounts,blockAds,tasks,tabs,webviewsInk,password,defaultBrowser,searchCounts,translateCounts,startTime,appList,myApps',  //脚本数，应用数，开启应用的次数，广告拦截数，标签组数，标签数，访问网站累计数，密码数，是否是默认浏览器，搜索数（只对用tab栏选中后输入搜索内容用默认搜索引擎进行搜索的统计），翻译次数， 此次开始时间，本地导航列表数，本地导航应用app数
  messages: '++id,messageType,avatar,title,body,indexName,timestamp',
  download:'&startTime,title,total,path,url,doneDate,status,href,addTime',
  taskStash:'++id,taskData,createTime,remark'
}).upgrade(trans=> {
  // return trans.standAloneApps.modify (item => {
  //   if(!!!item.type){
  //     item.type=0
  //   }
  // })
})

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

