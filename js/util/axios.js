const axios = require('axios')
const { config, api } = require('../../server-config')
//const storage = require('electron-localstorage');

//因为我这里本地环境测试就算用户注销但拿到的code是体验站上的code
//会出现退出失败，redis无法清除，本地storage也无法清除
//本地下面代码强制清除storage
//console.log(storage.getAll())
//storage.clear();

axios.defaults.baseURL = config.PROD_NODE_SERVER_BASE_URL;
//axios.defaults.baseURL = config.DEV_NODE_SERVER_BASE_URL;
//axios.defaults.baseURL = 'http://127.0.0.1:8001'
//<!--强制使用node模块。-->
axios.defaults.adapter = require('axios/lib/adapters/http');

axios.interceptors.request.use(
  config => {
    // Do something before request is sent
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
        console.log(response.data, 'axios拦截(全局勿删!）')
      }
      // return response.data;
    } else {
      return Promise.reject(response.data);
    }
  },
  error => {
    return Promise.reject(error);
  }
);

module.exports = axios
