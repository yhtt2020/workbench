import {defineStore} from "pinia";
import dbStorage from "./dbStorage";
// @ts-ignore
let arrData = [
  // 旧版底部数据
    // {
    //   icon: 'http://a.apps.vip/icons/flappy.jpg',
    //   type:'coolApp',
    //   name: 'Mlappy Bird',
    //   summary: '和小伙伴们一起飞。',
    //   needInstall: false,
    //   data: {
    //     theme: '#030c13',
    //     name: 'mlappyBird',
    //     url: 'http://bird.apps.vip/?',
    //     background: false,
    //     type:'game',
    //     scale:160
    //   }
    // },
    // {
    //   "icon": "https://res.wx.qq.com/a/wx_fed/assets/res/OTE0YTAw.png",
    //   "name": "微信",
    //   "type": "coolApp",
    //   "summary": "在副屏上使用网页版微信聊天。（已适配小屏）",
    //   "needInstall": false,
    //   "data": {
    //     "theme": "#2e3238",
    //     "name": "weixin",
    //     "url": "https://wx.qq.com",
    //     "preload": "weixin",
    //     "background": true,
    //     "node": false,
    //     "security": true
    //   }
    // },
    // {
    //   "icon": "https://s1.hdslb.com/bfs/static/jinkela/popular/assets/icon_popular.png",
    //   "name": "网页数据监控小助手",
    //   "type": "coolApp",
    //   "summary": "一个用于检测网页数据的工具，可以实时监测一个网页数据动态，并组织成可视化的报表，目前支持B站视频数据追踪。",
    //   "needInstall": false,
    //   "data": {
    //     "fullScreen": false,
    //     "theme": "#030c13",
    //     "name": "watch",
    //     "type": "system",
    //     "route": "{\"name\":\"watch\"}"
    //   }
    // },
    // {
    //   "nanoid": "2GpOXkUi",
    //   "appid": "MiXNpK",
    //   "name": "应用市场",
    //   "author": null,
    //   "package": "com.thisky.appStore",
    //   "preload": "/pages/appStore/preload.js",
    //   "logo": "https://up.apps.vip/logo/favicon.svg",
    //   "summary": "应用市场，助您发现更大的世界。",
    //   "site": null,
    //   "type": "lightApp",
    //   "url": "https://a.apps.vip/d.appStore/index.html",
    //   "circle": null,
    //   "theme_color": "#3c78d8",
    //   "user_theme_color": "#3c78d8",
    //   "create_time": 1680576621883,
    //   "update_time": 1680576621883,
    //   "account_avatar": "",
    //   "order": 0,
    //   "use_count": 0,
    //   "last_execute_time": 1680576621883,
    //   "settings": {
    //     "bounds": {
    //       "width": 1180,
    //       "height": 864
    //     },
    //     "showInSideBar": true
    //   },
    //   "unread_count": 0,
    //   "file_assign": null,
    //   "auth": null,
    //   "is_new": false,
    //   "attribute": {
    //     "isOfficial": 1,
    //     "integration": 2
    //   },
    //   "window": {
    //     "defaultType": "frameWindow",
    //     "frameWindow": {
    //       "enable": true,
    //       "width": 1180,
    //       "height": 864,
    //       "controllers": {
    //         "goBack": false,
    //         "goForward": false,
    //         "refresh": true,
    //         "home": false
    //       }
    //     },
    //     "window": {},
    //     "attach": {}
    //   },
    //   "open_source": null,
    //   "csv_url": null,
    //   "os_summary": null,
    //   "is_debug": null,
    //   "is_fav": null,
    //   "capture": "",
    //   "isSystemApp": true,
    //   "userSettings": {
    //     "auth": {
    //       "base": {
    //         "webSecure": false,
    //         "node": false
    //       },
    //       "api": {},
    //       "ability": {}
    //     },
    //     "window": "{\"defaultType\":\"frameWindow\",\"frameWindow\":{\"enable\":true,\"width\":1180,\"height\":864,\"controllers\":{\"goBack\":false,\"goForward\":false,\"refresh\":true,\"home\":false}},\"window\":{},\"attach\":{}}",
    //     "optimize": {
    //       "autoRun": false,
    //       "keepRunning": false,
    //       "showInSideBar": false
    //     }
    //   },
    //   "origin": {
    //     "nanoid": "2GpOXkUi",
    //     "appid": "MiXNpK",
    //     "name": "应用市场",
    //     "author": null,
    //     "package": "com.thisky.appStore",
    //     "preload": "/pages/appStore/preload.js",
    //     "logo": "https://up.apps.vip/logo/favicon.svg",
    //     "summary": "应用市场，助您发现更大的世界。",
    //     "site": null,
    //     "type": "web",
    //     "url": "https://a.apps.vip/d.appStore/index.html",
    //     "circle": null,
    //     "theme_color": "#3c78d8",
    //     "user_theme_color": "",
    //     "create_time": 1680576621883,
    //     "update_time": 1680576621883,
    //     "account_avatar": "",
    //     "order": 0,
    //     "use_count": 0,
    //     "last_execute_time": 1680576621883,
    //     "settings": {
    //       "bounds": {
    //         "width": 1180,
    //         "height": 864
    //       },
    //       "showInSideBar": true
    //     },
    //     "unread_count": 0,
    //     "file_assign": null,
    //     "auth": null,
    //     "is_new": false,
    //     "attribute": {
    //       "isOfficial": 1,
    //       "integration": 2
    //     },
    //     "window": {
    //       "defaultType": "frameWindow",
    //       "frameWindow": {
    //         "enable": true,
    //         "width": 1180,
    //         "height": 864,
    //         "controllers": {
    //           "goBack": false,
    //           "goForward": false,
    //           "refresh": true,
    //           "home": false
    //         }
    //       },
    //       "window": {},
    //       "attach": {}
    //     },
    //     "open_source": null,
    //     "csv_url": null,
    //     "os_summary": null,
    //     "is_debug": null,
    //     "is_fav": null,
    //     "capture": "",
    //     "isSystemApp": true,
    //     "userSettings": {
    //       "auth": {
    //         "base": {
    //           "webSecure": false,
    //           "node": false
    //         },
    //         "api": {},
    //         "ability": {}
    //       },
    //       "window": "{\"defaultType\":\"frameWindow\",\"frameWindow\":{\"enable\":true,\"width\":1180,\"height\":864,\"controllers\":{\"goBack\":false,\"goForward\":false,\"refresh\":true,\"home\":false}},\"window\":{},\"attach\":{}}",
    //       "optimize": {
    //         "autoRun": false,
    //         "keepRunning": false,
    //         "showInSideBar": false
    //       }
    //     }
    //   },
    //   "icon": "https://up.apps.vip/logo/favicon.svg"
    // },
    // {
    //   "type": "systemApp",
    //   "icon": "fluent:lock-closed-16-regular",
    //   "name": "锁定屏幕",
    //   "event": "lock"
    // },
    // {
    //   "type": "systemApp",
    //   "icon": "fluent:settings-16-regular",
    //   "name": "基础设置",
    //   "event": "setting"
    // },
    // {
    //   "type": "systemApp",
    //   "icon": "fluent:full-screen-maximize-16-filled",
    //   "name": "全屏显示",
    //   "event": "fullscreen"
    // },
    // {
    //   "type": "systemApp",
    //   "icon": "fluent:slide-settings-24-regular",
    //   "name": "设备设置",
    //   "event": "status"
    // },
    // {
    //   "type": "systemApp",
    //   "icon": "fluent:power-20-filled",
    //   "name": "电源",
    //   "event": "power"
    // },
    // 新版默认底部数据
    { 'type': 'systemApp', 'icon': 'shouye1', 'name': '主页', 'event': 'home' },
    { 'type': 'systemApp', 'icon': 'yingyongzhongxin', 'name': '应用管理', 'event': 'apps' },
    { 'type': 'systemApp', 'icon': 'kuaijie1', 'name': '快捷指令', 'event': 'deck' },
    { 'type': 'systemApp', 'icon': 'fluent:document-bullet-list-multiple-24-regular', 'name': '办公', 'event': 'work' },
    { 'type': 'systemApp', 'icon': 'yinle1', 'name': '音乐', 'event': 'music' },
    { 'type': 'systemApp', 'icon': 'youxishoubing', 'name': '游戏', 'event': 'gameIndex' },
    { 'type': 'systemApp', 'icon': 'fluent:chat-16-regular', 'name': '社群(开发中)', 'event': 'chat' },
    { 'type': 'systemApp', 'icon': 'lock', 'name': '锁定屏幕', 'event': 'lock' },
    { 'type': 'systemApp', 'icon': 'fullscreen', 'name': '全屏显示', 'event': 'fullscreen' },
    { 'type': 'systemApp', 'icon': 'setting', 'name': '基础设置', 'event': 'setting' },
]
export const navStore = defineStore("nav", {
  state: () => ({
    mainNavigationList: [
      {
        type:'systemApp',
        icon:'fluent:home-16-regular',
        name:'主页',
        event:'home',
      },
      // {
      //   type:'systemApp',
      //   icon:'fluent:settings-16-regular',
      //   name:'基础设置',
      //   event:'setting',
      //   fn:()=>{  vm.$router.push({ name: 'setting' })}
      // },
    ],
    footNavigationList: [...arrData],
    sideNavigationList: [
        // {
        //     "type": "systemApp",
        //     "icon": "fluent:home-16-regular",
        //     "name": "主页",
        //     "event": "home"
        // },
        // {
        //     "type": "systemApp",
        //     "icon": "fluent:grid-16-regular",
        //     "name": "应用管理",
        //     "event": "apps"
        // },{
        //     "type": "systemApp",
        //     "icon": "fluent:games-16-regular",
        //     "name": "游戏",
        //     "event": "gameIndex"
        // },{
        //     "type": "systemApp",
        //     "icon": "fluent:music-note-2-16-regular",
        //     "name": "音乐",
        //     "event": "music"
        // },{
        //     "type": "systemApp",
        //     "icon": "fluent:flash-16-regular",
        //     "name": "快捷指令",
        //     "event": "deck"
        // },
    ],
    rightNavigationList: [],
    builtInFeatures: [
      {
        "type": "systemApp",
        "icon": "fluent:lock-closed-16-regular",
        "name": "锁定屏幕",
        "event": "lock"
      },
      {
        "type": "systemApp",
        "icon": "fluent:settings-16-regular",
        "name": "基础设置",
        "event": "setting"
      },
      {
        "type": "systemApp",
        "icon": "fluent:full-screen-maximize-16-filled",
        "name": "全屏显示",
        "event": "fullscreen"
      },
      {
        "type": "systemApp",
        "icon": "fluent:slide-settings-24-regular",
        "name": "设备设置",
        "event": "status"
      }
    ],
    // navigationToggle: [true,false,true]
    navigationToggle: [true,false,true]
  }),
  actions: {
    removeFootNavigationList(index) {
        this.footNavigationList.splice(index, 1)
    },
    sortFootNavigationList(evt) {
        let temp = this.footNavigationList[evt.oldIndex]
        this.footNavigationList.splice(evt.oldIndex, 1)
        this.footNavigationList.splice(evt.newIndex, 0, temp)
    },
    setFootNavigationList(item) {
        this.footNavigationList.unshift(item)
    },
    removeSideNavigationList(index) {
        this.sideNavigationList.splice(index, 1)
    },
    sortSideNavigationList(evt) {
        let temp = this.sideNavigationList[evt.oldIndex]
        this.sideNavigationList.splice(evt.oldIndex, 1)
        this.sideNavigationList.splice(evt.newIndex, 0, temp)
    },
    setSideNavigationList(item) {
      let itemNav = {...item}
      // if(itemNav.name === '主页'){
      //   itemNav.icon = 'shouye1'
      // }else if(itemNav.name === '快捷指令'){
      //   itemNav.icon = 'kuaijie1'
      // }
      this.sideNavigationList.unshift(itemNav)
    },
    removeRightNavigationList(index) {
        this.rightNavigationList.splice(index, 1)
    },
    sortRightNavigationList(evt) {
        let temp = this.rightNavigationList[evt.oldIndex]
        this.rightNavigationList.splice(evt.oldIndex, 1)
        this.rightNavigationList.splice(evt.newIndex, 0, temp)
    },
    setRightNavigationList(item) {
      let itemNav = {...item}
      // if(itemNav.name === '主页'){
      //   itemNav.icon = 'shouye'
      // }else if(itemNav.name === '快捷指令'){
      //   itemNav.icon = 'kuaijie1'
      // }
      this.rightNavigationList.unshift(itemNav)
    },
    setNavigationToggle(type,val){
      switch (type) {
        case 'left':
          this.navigationToggle[0] = val
          break;
        case 'right':
            this.navigationToggle[1] = val
            break;
        case 'foot':
          this.navigationToggle[2] = val
          break;
      }
    },
    // 替换左侧导航数据
    updateLeftNavData(val){
      // console.log('更新左侧导航数据',val);
      this.sideNavigationList = val
    },
    updateBottomNavData(val){
      // console.log('更新底部导航数据',val);
      this.footNavigationList = val
    }
  },
  persist: {
    enabled: true,
    strategies: [
      {
        // 自定义存储的 key，默认是 store.$id
        // 可以指定任何 extends Storage 的实例，默认是 sessionStorage
      paths: ['sideNavigationList','footNavigationList','rightNavigationList','navigationToggle'],
        storage: dbStorage,
        // state 中的字段名，按组打包储存
      },
    ],
  },
});
