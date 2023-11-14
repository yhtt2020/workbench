//本代码会同时被preoload.js合并进去
//也可以直接require进去(在非preload当中）
let isDevelopmentMode = process.argv.some(arg=>arg==='--development-mode')
if(typeof window!=='undefined'){
  function getWindowArgs (window) {
    window.globalArgs = {};
    process.argv.forEach(function (arg) {
      if (arg.startsWith("--")) {
        var key = arg.split("=")[0].replace("--", "");
        var value = arg.split("=")[1];
        // if(key==='saApp'){
        //   console.log(decodeURI(value))
        //   value=JSON.parse(decodeURI(value))
        // }
        globalArgs[key] = value;
      }
    });
    if (navigator.platform === "MacIntel") {
      window.platformType = "mac";
    } else if (navigator.platform === "Win32") {
      window.platformType = "windows";
    } else {
      window.platformType = "linux";
    }
    return window;
  }
  window=getWindowArgs(window)
  isDevelopmentMode='development-mode' in window.globalArgs
}
const localNode = false  //设置为true， cyx则使用本地的node配置
const localServer = false  //设置为true， cgz则使用本地的node配置 //两者不能同时为true

const config = {
  SERVER_BASE_URL: 'https://s.apps.vip',
  SERVER_BACKEND_URL: 'https://sad.apps.vip',
  DEV_NODE_SERVER_BASE_URL: 'http://test1.com:9001',
  PROD_NODE_SERVER_BASE_URL: 'https://apps.vip',
  NODE_SERVER_BASE_URL: 'https://apps.vip',
  IM:{
    API_BASE_URL:"http://im-serve.xiangtian.ren",
    WEB_SOCKET_URL:"ws://im-socket.xiangtian.ren/socket.io",
    FRONT_URL:"http://im.xiangtian.ren",
    FRONT_URL_DEV:"http://im.xiangtian.ren",
    AUTO_LOGIN: '/auto-login',      //免登等待路由
    BOOT_ROUTE: '/boot-route'     //引导路由页面
  },
  OSX: {
    CREATE_CIRCLE: '/osapi/com/createUpdateCircle'
  }
}

const appConfig = {
  client_id: 10001,
  bind_im_id: 10002,  //lumen id
  state: 1,
  response_type: 'code',
}

//cyx本地开发,则修改相应的配置项
if(localNode && isDevelopmentMode){
  //本地环境下的配置项重置
  config.NODE_SERVER_BASE_URL = 'http://test1.com:9001'
  config.DEV_NODE_SERVER_BASE_URL='http://test1.com:9001'
  appConfig.client_id=10009
}

//cgz本地开发
if(localServer && isDevelopmentMode){
  config.NODE_SERVER_BASE_URL = 'http://test.com:9001'
  config.SERVER_BASE_URL = 'http://pc2.mark.opensns.cn'  //测试站
  config.SERVER_BACKEND_URL = 'https://osxbenew.mark.opensns.cn'
  config.IM.FRONT_URL_DEV = 'http://127.0.0.1:8000'
}

const api = {
  //短说侧需要用到的api接口
  API_URL: {
    user: {
      login: `/login?response_type=${appConfig.response_type}&client_id=${appConfig.client_id}&state=${appConfig.state}`, //登录页面
      loginOrigin:'/login',
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

  //node侧需要用到的接口
  NODE_API_URL: {
    USER: {
      CODE: '/app/authorizeCode', //code截取url
      REFRESH_TOKEN: '/app/refreshBrowserToken'
    },
    //第三方应用需要调用的接口
    ENTITY_APP: {
      AUTO_LOGIN: '/app/appAutoLogin'
    }
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
