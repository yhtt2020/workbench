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
    console.log(result, '__ini__')
    if(result.length == 0) {
      await newtabRestore.saveToDB()
    }
  }
};

module.exports = newtabRestore
