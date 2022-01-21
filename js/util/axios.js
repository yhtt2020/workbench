const axios = require('axios')
const { config, api } = require('../../server-config')
const {db } = require('./database.js')
const storage = require('electron-localstorage');

//因为我这里本地环境测试就算用户注销但拿到的code是体验站上的code
//会出现退出失败，redis无法清除，本地storage也无法清除
//本地下面代码强制清除storage
//console.log(storage.getAll())
//storage.clear();

axios.defaults.baseURL = config.NODE_SERVER_BASE_URL;
//<!--强制使用node模块。-->
axios.defaults.adapter = require('axios/lib/adapters/http');

let requests = []
let isRefreshing = false

axios.interceptors.request.use(
  async config => {
    // Do something before request is sent
    console.log(config, '拦截的config')
    console.log(db.system.where('name').equals('currentUser'), 'db!!!!!!!!!')
    storage.setStoragePath(global.sharedPath.extra)
    console.log(storage.getStoragePath(), '@@@@@@@')

    // //验证token头是否存在，存在才说明这个请求是需要做无感知刷新的
    // if(config.headers.Authorization.length > 0) {
    //   //说明此请求正在请求刷新令牌，直接return出去
		// 	if (config.url.includes("refreshBrowserToken")) {
		// 		return config;
		// 	}

    //   //判断token是否过期
    //   if(config.expireInfo.expire_deadtime - new Date().getTime() <= 8000) {
    //     //判断refreshToken是否过期
    //     if(config.expireInfo.refreshExpire_deadtime - new Date().getTime() <= 8000) {
    //       if(config.expireInfo.inMain) {
    //         //在主进程中的请求时发现过期，清空用户标识
    //         storage.setStoragePath(global.sharedPath.extra)
    //         storage.clear()
    //         await db.system.where('name').equals('currentUser').modify({value: {
    //           uid: 0,
    //           nickname: '立即登录',
    //           avatar: '../../../icons/browser.ico'
    //         }})



    //       }

    //     }
    //   }

    // }

    return config;
  },
  error => {
    // Do something with request error
    return Promise.reject(error);
  }
);

// 响应拦截  401 token过期处理
axios.interceptors.response.use(
  response => {
    if (response.status >= 200 && response.status < 300) {
      if(response.data.code === 1000) {
        return response.data;
      } else if (response.data.code === 1001) {
        //有一种情况就是ipc sidePanel是not defind,需要被catch块抓出来
        try {
          //要区别axios在两种主进程环境中使用，主进程中是无法直接ipcMain.send的'ipc是引入时的简写'
          if(ipc) {
            if(response.data.message.indexOf('54003') !== -1) {
              ipc.send('message',{type:'error',config:{content: '服务器翻译繁忙!', key: Date.now()}})
            } else {
              ipc.send('message',{type:'error',config:{content: response.data.message, key: Date.now()}})
            }
          } else {
            sidePanel.get().webContents.send('message',{type:"error",config:{content: response.data.message, key: Date.now()}})
          }
          return Promise.reject(response.data)
        } catch(err) {
          return response.data
        }
      } else if (response.data.code === 1002) {
        //参数错误是属于200错误，并不reject
        return response.data
      } else {
        //console.log(response.data, 'axios拦截(全局勿删!）')
        return response
      }
      // return response.data;
    } else {
      return Promise.reject(response.data);
    }
  },
  error => {
    if(error.code === 'ENOTFOUND' && error.isAxiosError) {
      ipc ? ipc.send('message',{type:'error',config:{content: '请检查网络!', key: Date.now()}})
      : sidePanel.get().webContents.send('message',{type:"error",config:{content: '请检查网络!', key: Date.now()}})
      return ({
        code: error.code,
        error_data: error
      })
    } else {
      return Promise.reject(error)
    }
  }
);

module.exports = axios
