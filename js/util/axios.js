const axios = require('axios')
const { config, api } = require('../../server-config')
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
   // console.log(config, '拦截的config')

    //config.expireInfo.token或者刷新令牌接口才走这里存在才执行下面
    if((config.hasOwnProperty('expireInfo') && config.expireInfo.token.length > 0) || config.url.includes("refreshBrowserToken")) {
      //说明此请求正在请求刷新令牌，直接return出去
			if (config.url.includes("refreshBrowserToken")) {
				return config;
			}

      //判断token是否过期
      if(config.expireInfo.expire_deadtime - new Date().getTime() <= 8000) {
        //判断refreshToken是否过期
        if(config.expireInfo.refreshExpire_deadtime - new Date().getTime() <= 8000) {
          if(config.expireInfo.inMain) {
            //在主进程中的请求时发现过期，清空用户标识
            storage.setStoragePath(global.sharedPath.extra)
            storage.clear()
            global.utilWindow.webContents.send('clearCurrentUser')
          } else {
            //在渲染进程中请求时发现过期，清空dexie的currentUser
            const {db} = require('./database.js')
            await db.system.where('name').equals('currentUser').modify({value: {
              uid: 0,
              nickname: '立即登录',
              avatar: '../../../icons/browser.ico'
            }})
          }
        }

        //是否在刷新中
        if(!isRefreshing) {
          isRefreshing = true

          axios.post(`${api.NODE_API_URL.USER.REFRESH_TOKEN}`, {
            refreshToken: config.expireInfo.refreshToken
          }).then(res => {
            if(res.code === 1000) {
              requests.forEach(cb => cb(res.data))
              requests = []
              isRefreshing = false
            } else {
              return config
            }
          })
        }

        return new Promise(resolve => {
          //继续请求
          requests.push(async user => {
            //根据进程类型执行不同的重制用户标识
            if(config.expireInfo.inMain) {
              storage.setStoragePath(global.sharedPath.extra)
              storage.setItem(`userToken`, user.token)
              storage.setItem(`refreshToken`, user.refreshToken)
              storage.setItem(`expire_deadtime`, new Date().getTime() + user.expire * 1000)
              storage.setItem(`refreshExpire_deadtime`, new Date().getTime() + user.refreshExpire * 1000)
              storage.setItem(`userInfo`, user.userInfo)
              global.utilWindow.webContents.send('remakeCurrentUser', user)
            } else {
              const {db} = require('./database.js')
              await db.system.where('name').equals('currentUser').modify({value: {
                uid: user.userInfo.uid,
                nickname: user.userInfo.nickname,
                avatar: user.userInfo.avatar,
                token: user.token,
                refreshToken: user.refreshToken,
                expire_deadtime: new Date().getTime() + user.expire * 1000,
                refreshExpire_deadtime: new Date().getTime() + user.refreshExpire * 1000,
                code: user.code
              }})
            }
            resolve(config)
          })
        })
      }
    }

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
