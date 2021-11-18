//本代码会同时被preoload.js合并进去
//也可以直接require进去(在非preload当中）
const config = {
  SERVER_BASE_URL: 'http://com.thisky.com',
  DEV_NODE_SERVER_BASE_URL: 'http://test.com:8001',
  PROD_NODE_SERVER_BASE_URL: 'https://work.thisky.com',
}

const appConfig = {
  client_id: 10001,
  state: 1,
  response_type: 'code',
}

const api = {
  API_URL: {
    user: {
      login: `/login?response_type=${appConfig.response_type}&client_id=${appConfig.client_id}&state=${appConfig.state}`, //登陆页面
      home: '/', //用户主页
      profile: '/user/info', //用户资料
      account: '/user/account-info', //账号信息
    },
    group: {
      index: '/groups', //群组
    },
  },
  NODE_API_URL: {
    user: {
      code: '/app/authorizeCode', //code截取url
    },
  },
  getUrl(path) {
    //const params=path.split('/')
    return config.SERVER_BASE_URL + path
  },
  getProdNodeUrl(path) {
    return config.PROD_NODE_SERVER_BASE_URL + path
  },
  getDevNodeUrl(path) {
    return config.DEV_NODE_SERVER_BASE_URL + path
  },
}
if (typeof module != 'undefined') {
  //如果不是preload中，则直接按照模块exports出去
  module.exports = { config, api }
}
