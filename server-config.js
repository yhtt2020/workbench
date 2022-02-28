//本代码会同时被preoload.js合并进去
//也可以直接require进去(在非preload当中）
let isDevelopmentMode = process.argv.some(arg=>arg==='--development-mode')
const config = {
  SERVER_BASE_URL: 'https://s.apps.vip',
  SERVER_BACKEND_URL: 'https://sad.apps.vip',
  DEV_NODE_SERVER_BASE_URL: 'http://test.com:8001',
  PROD_NODE_SERVER_BASE_URL: 'https://apps.vip',
  //NODE_SERVER_BASE_URL: isDevelopmentMode ? 'http://test.com:8001' : 'https://apps.vip',
  NODE_SERVER_BASE_URL: isDevelopmentMode ? 'https://apps.vip' : 'https://apps.vip',  //老板你本地用这个，注释上面这个
  IM:{
    API_BASE_URL:"http://im-serve.xiangtian.ren",
    WEB_SOCKET_URL:"ws://im-socket.xiangtian.ren/socket.io",
    FRONT_URL:"http://im.xiangtian.ren",
    //FRONT_URL_DEV:"http://im.xiangtian.ren",
    FRONT_URL_DEV:"http://127.0.0.1:8000",
    AUTO_LOGIN: '/auto-login',      //免登等待路由
    BOOT_ROUTE: '/boot-route'     //引导路由页面
  },
  OSX: {
    CREATE_CIRCLE: '/osapi/com/createUpdateCircle'
  }
}

const appConfig = {
  //client_id: isDevelopmentMode ? 10003 : 10001,
  client_id: isDevelopmentMode ? 10001 : 10001,     //老板你本地用这个，注释上面这个
  bind_im_id: 10002,  //lumen id
  state: 1,
  response_type: 'code',
}

const api = {
  API_URL: {
    user: {
      login: `/login?response_type=${appConfig.response_type}&client_id=${appConfig.client_id}&state=${appConfig.state}`, //登录页面
      home: '/', //用户主页
      profile: '/user/info', //用户资料
      space:'/user',//用户主页
      account: '/user/account-info', //帐号信息
      AUTO_LOGIN: '/autologin',   //短说免登跳转路由
      CIRCLE: '/forum',    //短说圈子主页
      CIRCLE_SETTING: '/user/create-edit-forum', //短说圈子设置
      CIRCLE_ADD_USER: '/user/add-user', //短说圈子添加成员
      CIRCLE_INVITELINK : '/user/invite-link', //短说圈子邀请链接
    },
    group: {
      index: '/groups', //群组
    },
  },
  NODE_API_URL: {
    USER: {
      CODE: '/app/authorizeCode', //code截取url
      REFRESH_TOKEN: '/app/refreshBrowserToken'
    },
  },
  getUrl(path) {
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
  module.exports = { config, api, appConfig }
}
