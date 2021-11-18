const axios = require('axios')
const { config, api } = require('../../server-config')

axios.defaults.baseURL = config.PROD_NODE_SERVER_BASE_URL;
//axios.defaults.baseURL = config.DEV_NODE_SERVER_BASE_URL;
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
