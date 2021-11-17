const axios = require('axios')
const { config, api } = require('../../server-config')
var { db } = require('./database.js')

// function getToken() {
//   const resUser = db.system.where('name').equals('currentUser').first()
//   return resUser.value.token ?? null
// }

axios.defaults.baseURL = config.NODE_SERVER_BASE_URL;
//<!--强制使用node模块。-->
axios.defaults.adapter = require('axios/lib/adapters/http');

axios.interceptors.request.use(
  config => {
    // if (getToken()) {
    //   config.headers.Authorization = `${getToken()}`
    // }
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
      return response.data;
    } else {
      return Promise.reject(response);
    }
  },
  error => {
    return Promise.reject(error);
  }
);

module.exports = axios
