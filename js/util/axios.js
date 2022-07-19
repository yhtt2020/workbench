const axios = require('axios')
const { config, api } = require('../../server-config')
const storage = require('electron-localstorage');
const { ipcRenderer: ipc } = require('electron')

//本地下面代码强制清除storage
//console.log(storage.getAll())
//storage.clear();

axios.defaults.baseURL = config.NODE_SERVER_BASE_URL;
//<!--强制使用node模块。-->
axios.defaults.adapter = require('axios/lib/adapters/http');

function execRefreshToken(config, refreshFuncList) {
  axios.post(`${api.NODE_API_URL.USER.REFRESH_TOKEN}`, {
    refreshToken: config.expireInfo.refreshToken
  }).then(res => {
    if(res.code === 1000) {
      refreshFuncList.forEach(cb => cb(res.data))
      refreshFuncList = []
      isRefreshing = false
    } else {
      ipc ? ipc.send('message',{type:'error',config:{content: '登录信息过期，请重新登录', key: Date.now()}}) : sidePanel.get().webContents.send('message',{type:"error",config:{content: '登录信息过期，请重新登录', key: Date.now()}})
    }
  }).catch(err => {
    ipc ? ipc.send('message',{type:'error',config:{content: '登录信息过期，请重新登录', key: Date.now()}}) : sidePanel.get().webContents.send('message',{type:"error",config:{content: '登录信息过期，请重新登录', key: Date.now()}})
  })
}

let refreshFuncList = []    //刷新令牌时需要操作的函数队列
let isRefreshing = false   //是否正在刷新的标记

axios.interceptors.request.use(
  async config => {
    // Do something before request is sent
    // console.log(config, '拦截的config')
    // if(config.hasOwnProperty('expireInfo')) {
    //   console.log(config.expireInfo.inMain, '是否在主进程发起的本次请求')
    // }

    //登录状态下发起的请求 或 刷新令牌接口才执行下面
    if((config.hasOwnProperty('expireInfo') && config.expireInfo && config.expireInfo.token.length > 0) || config.url.includes("refreshBrowserToken")) {

      //说明此请求正在请求刷新令牌，直接return出去
			if (config.url.includes("refreshBrowserToken")) {
				return config;
			}

      //判断token是否过期
      if(config.expireInfo.expire_deadtime - new Date().getTime() <= 8000) {
        //判断refreshToken是否过期
        if(config.expireInfo.refreshExpire_deadtime - new Date().getTime() <= 8000) {
          if(config.expireInfo.inMain) {
            //在主进程请求时发现refreshToken过期，清空storage用户标识，也要转发到渲染进程清空dexie中的用户标识
            storage.setStoragePath(global.sharedPath.extra)
            storage.clear()
            global.utilWindow.webContents.send('clearCurrentUser')
          } else {
            //在渲染进程请求时发现refreshToken过期
            ipc.send('clearStorageInfo')
          }
        }

        //是否在刷新中
        if(!isRefreshing) {
          refreshFuncList.push(async user => {
            if(config.expireInfo.inMain) {
              //根据进程类型执行不同的重制用户标识 //情况一主进程中触发的，修改主进程中storage中的用户标识，并通过ipc传到渲染进程
              storage.setStoragePath(global.sharedPath.extra)
              storage.setItem(`userToken`, user.token)
              storage.setItem(`refreshToken`, user.refreshToken)
              storage.setItem(`expire_deadtime`, new Date().getTime() + user.expire * 1000)
              storage.setItem(`refreshExpire_deadtime`, new Date().getTime() + user.refreshExpire * 1000)
              storage.setItem(`userInfo`, user.userInfo)
              global.utilWindow.webContents.send('remakeCurrentUser', user)
            } else {
              //根据进程类型执行不同的重制用户标识 //情况二渲染进程中触发的，通过ipc通知主进程去修改，并还会再发到渲染进程
              ipc.send('updateStorageInfo', user)
            }
          })

          isRefreshing = true

          execRefreshToken(config, refreshFuncList)
        }

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
      //todo else if 401  删掉凭证和数据，弹出错误
      return Promise.reject(response.data);
    }
  },
  error => {
    if(error.code === 'ENOTFOUND' && error.isAxiosError) {
      console.warn('请检查网络....')
      return ({
        code: error.code,
        error_data: error
      })
    } else {
      if(error.message.endsWith('401')){
        //此处是登录报401场景
        if(!!!window){
          console.log('主进程察觉到掉登录')
        }else{
          ipc.send('showUserWindow',{tip:'您的登录信息已过期，请重新登录。'})
          ipc.send('message',{type:'warn',config:{content:'您的登录信息已过期，请重新登录。',key:"401"}})
          //todo 通知侧边栏清理掉登录信息，以确保账号信息同步
          console.log('渲染进程掉登录')
        }
      }
      return Promise.reject(error)
    }
  }
);

module.exports = axios
