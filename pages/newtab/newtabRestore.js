const path = require('path');
const fs = require('fs');
const Database = require('../../js/util/database.js');
window.db = Database.db;
window.globalArgs = {};
let loaded = false;
process.argv.forEach(function (arg) {
  if (arg.startsWith('--')) {
    var key = arg.split('=')[0].replace('--', '');
    var value = arg.split('=')[1];
    globalArgs[key] = value;
  }
});
if (navigator.platform === 'MacIntel') {
  window.platformType = 'mac';
} else if (navigator.platform === 'Win32') {
  window.platformType = 'windows';
} else {
  window.platformType = 'linux';
}

const newtabRestore = {
  //存入搜索引擎列表
  saveToDB: () => {
    db.mySearch.clear().then(() => {
      const searchList = [
        {
          name: '百度',
          slinkLogo: './assets/baidu.svg',
          frontLink: 'https://www.baidu.com/s?wd=',
          sDefault: 1,
        },
        {
          name: '谷歌',
          slinkLogo: './assets/google.svg',
          frontLink: 'https://www.google.com/search?q=',
          sDefault: 0,
        },
        {
          name: '必应',
          slinkLogo: './assets/bing.svg',
          frontLink: 'https://cn.bing.com/search?q=',
          sDefault: 0,
        },
        {
          name: '淘宝搜索',
          slinkLogo: './assets/taobao.svg',
          frontLink: 'http://s.taobao.com/search?q=',
          sDefault: 0,
        },
        {
          name: '天猫搜索',
          slinkLogo: './assets/tianmao.svg',
          frontLink: 'http://list.tmall.com/search_product.htm?q=',
          sDefault: 0,
        },
        {
          name: '京东商城',
          slinkLogo: './assets/jingdong.svg',
          frontLink: 'http://search.jd.com/Search?keyword=',
          sDefault: 0,
        },
        {
          name: '1688商城',
          slinkLogo: './assets/1688.svg',
          frontLink: 'https://s.1688.com/selloffer/offer_search.htm?keywords=',
          sDefault: 0,
        },
        {
          name: '知乎',
          slinkLogo: './assets/zhihu.svg',
          frontLink: 'https://www.zhihu.com/search?type=content&q=',
          sDefault: 0,
        },
        {
          name: '微博搜索',
          slinkLogo: './assets/weibo.svg',
          frontLink: 'https://s.weibo.com/?Refer=',
          sDefault: 0,
        },
        {
          name: '哔哩哔哩',
          slinkLogo: './assets/bilibili.svg',
          frontLink: 'https://search.bilibili.com/all?keyword=',
          sDefault: 0,
        },
        {
          name: '豆瓣',
          slinkLogo: './assets/douban.svg',
          frontLink: 'https://www.douban.com/search?source=suggest&q=',
          sDefault: 0,
        },
        {
          name: '优酷',
          slinkLogo: './assets/youku.svg',
          frontLink: 'https://so.youku.com/search_video/q_',
          sDefault: 0,
        },
        {
          name: 'Github',
          slinkLogo: './assets/github.svg',
          frontLink: 'https://github.com/search?utf8=%E2%9C%93&q=',
          sDefault: 0,
        }
      ];
      db.mySearch
        .bulkAdd(searchList)
        .then((rs) => console.log(rs))
        .catch((err) => console.log(err))
        .catch((err) => {
          console.log(err);
        });
    });
  },

  //从数据库读出所有的搜索引擎数据
  restoreFromDB: async () => {
    try {
      return await db.mySearch.orderBy('id').toArray();
    } catch (err) {
      console.log(err);
      return [];
    }
  },
  loadBookmarks: async(count=7)=>{
    let lastBookmarks=[]
    try{
      await db.places.orderBy('lastVisit').reverse().filter(function(place) { return place.isBookmarked }).limit(count).each(item=>{
        lastBookmarks.push({
          'title':item.title,
          'link':item.url
        })
      })
      return lastBookmarks
    }catch (err){
      console.log(err)
      return []
    }
  },
  loadHistory:async(count=4)=>{
    let todayHistory=[] //当前访问历史
    let yesterdayHistory=[]
    let dayBeforeYesterdayHistory=[]
    let beforeAllHistory=[]
    try{
      var today = new Date();
      today.setHours(0);
      today.setMinutes(0);
      today.setSeconds(0);
      today.setMilliseconds(0);
      var oneday = 1000 * 60 * 60 * 24;
      var yesterday = new Date(today - oneday);
      var dayBeforeYesterday = new Date(today - 2*oneday);
      await db.places.orderBy('lastVisit').reverse().filter(function(place) {
       if(place.lastVisit >=today.valueOf()) return true
      }).limit(count).each(item=>{
        todayHistory.push({
          'title':item.title,
          'link':item.url
        })

      })
      await db.places.orderBy('lastVisit').reverse().filter(function(place) {
        if(place.lastVisit >=yesterday.valueOf()&& place.lastVisit<today.valueOf()) return true
      }).limit(count).each(item=>{
        yesterdayHistory.push({
          'title':item.title,
          'link':item.url
        })
      })
      await db.places.orderBy('lastVisit').reverse().filter(function(place) {
        if(place.lastVisit >=dayBeforeYesterday.valueOf()&& place.lastVisit<yesterday.valueOf()) return true
      }).limit(count).each(item=>{
        dayBeforeYesterdayHistory.push({
          'title':item.title,
          'link':item.url
        })
      })
      await db.places.orderBy('lastVisit').reverse().filter(function(place) {
        if(place.lastVisit <dayBeforeYesterday.valueOf()) return true
      }).limit(count).each(item=>{
        beforeAllHistory.push({
          'title':item.title,
          'link':item.url
        })
      })

      //console.log(todayHistory)
      return [{
        time_title:'访问历史',
        info:todayHistory
      },{
        time_title:'昨天',
        info:yesterdayHistory
      },{
        time_title:'前天',
        info:dayBeforeYesterdayHistory
      }, {time_title:'前天以前',
        info:beforeAllHistory
    }]
    }catch (err){
      console.log(err)
      return []
    }


  },


  //设置默认写入接口
  saveDefaultDB: async(id) => {

    try {
      const result = await db.mySearch.where('sDefault').equals(1).modify({ sDefault: 0 })
      if(result) {
        await db.mySearch.update(id, { sDefault: 1 });
      }
    } catch(err) {
      console.log('dexie失败:' + err)
    }
  },

  //初始化mySearch数据库
  initialize: async() => {
    const result = await newtabRestore.restoreFromDB()
    //console.log(result, '__ini__')
    if(result.length == 0) {
      await newtabRestore.saveToDB()
    }
  }
};

module.exports = newtabRestore
