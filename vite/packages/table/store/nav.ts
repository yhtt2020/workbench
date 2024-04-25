import {defineStore} from "pinia";
import dbStorage from "./dbStorage";
import {nanoid} from "nanoid";
import _ from 'lodash-es'
import {useDev} from "../ui/hooks/useDev";
// @ts-ignore
let clientNav = [
  // 旧版底部数据
  // 新版默认底部数据
  {'type': 'systemApp', id: '1705025376', 'icon': 'shouye1', 'name': '桌面主页', 'event': 'home'},
  {'type': 'systemApp', id: '1705025377', 'icon': 'yingyongzhongxin', 'name': '应用中心', 'event': 'apps'},
  {'type': 'systemApp', id: '1705025378', 'icon': 'fluent:chat-16-regular', 'name': '社群', 'event': 'chat'},
  // { 'type': 'systemApp', 'icon': 'kuaijie1', 'name': '快捷指令', 'event': 'deck' },
  {
    'type': 'systemApp',
    id: '1705025379',
    'icon': 'fluent:document-bullet-list-multiple-24-regular',
    'name': '办公助手',
    'event': 'work'
  },
  {'type': 'systemApp', id: '1705025380', 'icon': 'youxishoubing', 'name': '游戏助手', 'event': 'gameIndex'},
  {'type': 'systemApp', id: '1705025381', 'icon': 'yinle1', 'name': '网易云音乐', 'event': 'music'},
  // { 'type': 'systemApp', 'icon': 'lock', 'name': '锁屏', 'event': 'lock' },
  {'type': 'systemApp', id: '1705025382', 'icon': 'fluent:settings-16-regular', 'name': '任务中心', 'event': 'task'},
  {'type': 'systemApp', id: '1705025383', 'icon': 'fluent:settings-16-regular', 'name': '社区中心', 'event': 'commun'},
  {'type': 'systemApp', id: '1705025384', 'icon': 'fullscreen', 'name': '全屏', 'event': 'fullscreen'},
  {'type': 'systemApp', id: '1705025385', 'icon': 'setting', 'name': '设置中心', 'event': 'setting'},
]
let webNav = [
  // web端默认

  {
    "renewTime": 20240302,
    "id": "xqBvS8",
    "icon": "/logo/home.svg",
    "iconType": "",
    "name": "桌面主页",
    "isName": true,
    "value": "home",
    "mode": "app",
    "attributeEdit": true,
    "type": "systemApp",
    "bg": "",
    "isBg": false,
    "radius": 0,
    "isRadius": true,
    "useCount": 0,
    "lastUseTime": "",
    "iconState": "cover",
    "iconShape": "square",
    "size": "1x1",
    "summary": "",
    "default": {},
    "slot": "",
    "cardData": {},
    "event": "home"
  },
  {
    "renewTime": 20240302,
    "id": "ltL7sy",
    "icon": "/logo/community.svg",
    "iconType": "",
    "name": "社群",
    "isName": true,
    "value": "chat",
    "mode": "app",
    "attributeEdit": true,
    "type": "systemApp",
    "bg": "",
    "isBg": false,
    "radius": 0,
    "isRadius": true,
    "useCount": 0,
    "lastUseTime": "",
    "iconState": "cover",
    "iconShape": "square",
    "size": "1x1",
    "summary": "",
    "default": {},
    "slot": "",
    "cardData": {},
    "event": "chat"
  },
  {
    "renewTime": 20240302,
    "id": "aBU0Te",
    "icon": "/logo/wallpaper.svg",
    "iconType": "",
    "name": "壁纸",
    "isName": true,
    "value": "my",
    "mode": "app",
    "attributeEdit": true,
    "type": "systemApp",
    "bg": "",
    "isBg": false,
    "radius": 0,
    "isRadius": true,
    "useCount": 0,
    "lastUseTime": "",
    "iconState": "cover",
    "iconShape": "square",
    "size": "1x1",
    "summary": "",
    "default": {},
    "slot": "",
    "cardData": {},
    "tab": "paper",
    "event": "my",
    "ext": ""
  },
  {
    "renewTime": 20240302,
    "id": "A6WLok",
    "icon": "/logo/todo.svg",
    "iconType": "",
    "name": "待办事项",
    "isName": true,
    "value": "todo",
    "mode": "app",
    "attributeEdit": true,
    "type": "systemApp",
    "bg": "",
    "isBg": false,
    "radius": 0,
    "isRadius": true,
    "useCount": 0,
    "lastUseTime": "",
    "iconState": "cover",
    "iconShape": "square",
    "size": "1x1",
    "summary": "",
    "default": {},
    "slot": "",
    "cardData": {},
    "event": "todo",
    "ext": ""
  },
  {
    "renewTime": 20240302,
    "id": "z_lWwa",
    "icon": "/logo/ai.svg",
    "iconType": "",
    "name": "AI助手",
    "isName": true,
    "value": "ai",
    "mode": "app",
    "attributeEdit": true,
    "type": "systemApp",
    "bg": "",
    "isBg": false,
    "radius": 0,
    "isRadius": true,
    "useCount": 0,
    "lastUseTime": "",
    "iconState": "cover",
    "iconShape": "square",
    "size": "1x1",
    "summary": "",
    "default": {},
    "slot": "",
    "cardData": {},
    "event": "ai",
    "ext": ""
  },
  {
    "renewTime": 20240302,
    "id": "mJFnsZ",
    "icon": "/logo/memorandum.svg",
    "iconType": "",
    "name": "备忘录",
    "isName": true,
    "value": "note",
    "mode": "app",
    "attributeEdit": true,
    "type": "systemApp",
    "bg": "",
    "isBg": false,
    "radius": 0,
    "isRadius": true,
    "useCount": 0,
    "lastUseTime": "",
    "iconState": "cover",
    "iconShape": "square",
    "size": "1x1",
    "summary": "",
    "default": {},
    "slot": "",
    "cardData": {},
    "event": "note",
    "ext": ""
  },
  {
    "renewTime": 20240302,
    "id": "4XwMvr",
    "icon": "/logo/task.svg",
    "iconType": "",
    "name": "任务中心",
    "isName": true,
    "value": "task",
    "mode": "app",
    "attributeEdit": true,
    "type": "systemApp",
    "bg": "",
    "isBg": false,
    "radius": 0,
    "isRadius": true,
    "useCount": 0,
    "lastUseTime": "",
    "iconState": "cover",
    "iconShape": "square",
    "size": "1x1",
    "summary": "",
    "default": {},
    "slot": "",
    "cardData": {},
    "event": "task"
  },
  {
    "id": "o2gD2n",
    "name": "哔哩哔哩",
    "summary": "干杯！",
    "icon": "https://up.apps.vip/yyscIcon/bilibili.jpg",
    "url": "https://www.bilibili.com/",
    "type": "default",
    "bg": "",
    "isBg": false,
    "mode": "app",
    "ext": "",
    "slot": "",
    "value": "https://www.bilibili.com/"
  },
  {
    "id": "mBdGYN",
    "name": "QQ邮箱",
    "summary": "为亿万用户提供高效稳定便捷的电子邮件服务。",
    "icon": "https://mail.qq.com/zh_CN/htmledition/images/favicon/qqmail_favicon_96h.png",
    "url": "https://mail.qq.com",
    "type": "default",
    "bg": "",
    "isBg": false,
    "mode": "app",
    "ext": "",
    "slot": "",
    "value": "https://mail.qq.com"
  }
]


// @ts-ignore
export const navStore = defineStore("nav", {
  state: () => ({
    mainNavigationList: [
      {
        type: 'systemApp',
        icon: '/logo/home.svg',
        name: '桌面主页',
        value: 'home',
        tab: 'home'
      },
      // {
      //   type:'systemApp',
      //   icon:'fluent:settings-16-regular',
      //   name:'基础设置',
      //   event:'setting',
      //   fn:()=>{  vm.$router.push({ name: 'setting' })}
      // },
    ],
    footNavigationList: [],
    sideNavigationList: [],
    rightNavigationList: [],
    copyFootNav: [],
    copySideNav: [],
    copyRightNav: [],
    builtInFeatures: [
      {
        "type": "systemApp",
        "icon": "fluent:lock-closed-16-regular",
        "name": "锁定屏幕",
        "value": "lock"
      },
      {
        "type": "systemApp",
        "icon": "fluent:settings-16-regular",
        "name": "基础设置",
        "value": "setting"
      },
      {
        "type": "systemApp",
        "icon": "fluent:full-screen-maximize-16-filled",
        "name": "全屏显示",
        "value": "fullscreen"
      },
      {
        "type": "systemApp",
        "icon": "fluent:slide-settings-24-regular",
        "name": "设备设置",
        "value": "status"
      }
    ],
    // navigationToggle: [true,false,true]
    navigationToggle: [false, false, true],
    loaded: false,
    init: false,//是否初始化过了
    // 底部导航栏最多图标数
    maxItemNum: null,
    // 导航栏初始化
    leftNavInit: false,
    rightNavInit: false,
    footNavInit: false,
  }),
  actions: {
    fixData(nav) {
      const newNav = _.cloneDeep(nav)
      let isFixed = false
      let fixedArray = []
      for (const icon of newNav) {
        if (!icon) {
          //自身已经出问题了
          isFixed = true
          continue
        }
        if (!icon.id) {
          isFixed = true
          icon.id = nanoid(6)
          fixedArray.push(icon)
          continue
        }
        if (nav.some(n => {
          return n.id === icon.id
        })) {
          //存在同id，则重新更新id
          isFixed = true
          icon.id = nanoid(6)
        }
        fixedArray.push(icon)
      }
      return {
        fixed: isFixed,
        fixedArray
      }
    },
    loadNav() {
      // console.log('执行loadNav')
      if (!this.init) {
        console.log('检测到未初始化')
        if (useDev('h5')) {
          console.log('检测到h5')
          this.copyFootNav = [...webNav]
        } else {
          console.log('检测到client')
          this.copyFootNav = [...clientNav]
        }

        this.init = true
      }
      if (!this.loaded) {
        let fixedRs = this.fixData(this.copyFootNav)
        if (fixedRs.fixed) {
          this.copyFootNav = fixedRs.fixedArray
        }
        //this.copyFootNav = []//JSON.parse(JSON.stringify(this.footNavigationList))
        // this.copySideNav = JSON.parse(JSON.stringify(this.sideNavigationList))
        // this.copyRightNav = JSON.parse(JSON.stringify(this.rightNavigationList))
        this.updateType(this.sideNavigationList)
        this.updateType(this.rightNavigationList)
        this.loaded = true
      }
    },
    updateType(list) {
      list.forEach(element => {
        element.id = element.id || nanoid(6)
      });
    },
    removeFootNavigationList(index) {
      this.copyFootNav.splice(index, 1)
    },
    sortFootNavigationList(evt) {
      let temp = this.copyFootNav[evt.oldIndex]
      this.copyFootNav.splice(evt.oldIndex, 1)
      this.copyFootNav.splice(evt.newIndex, 0, temp)
    },
    setFootNavigationList(item) {
      // 当元素个数大于限制数时，将无法添加
      // if(this.maxItemNum >= this.footNavigationList.length){
      if (!item.id) {
        item.id = nanoid(6)
      }
      this.copyFootNav.unshift(item)
      // }
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
      if (!item.id) {
        item.id = nanoid(6)
      }
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
      if (!item.id) {
        item.id = nanoid(6)
      }
      let itemNav = {...item}
      // if(itemNav.name === '主页'){
      //   itemNav.icon = 'shouye'
      // }else if(itemNav.name === '快捷指令'){
      //   itemNav.icon = 'kuaijie1'
      // }
      this.rightNavigationList.unshift(itemNav)
    },
    setNavigationToggle(type, val) {
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
    updateLeftNavData(val) {
      // console.log('更新左侧导航数据',val);
      this.sideNavigationList = val
    },
    updateBottomNavData(val) {
      // console.log('更新底部导航数据',val);
      this.footNavigationList = val
    }
  },
  // getters: {
  //   copyFootNav: state => [...state.footNavigationList],
  //   copySideNav: state => [...state.sideNavigationList],
  //   copyRightNav: state => [...state.rightNavigationList],
  // },
  persist: {
    enabled: true,
    strategies: [
      {
        // 自定义存储的 key，默认是 store.$id
        // 可以指定任何 extends Storage 的实例，默认是 sessionStorage
        paths: ['sideNavigationList', 'footNavigationList', 'rightNavigationList', 'navigationToggle', 'copyFootNav', 'copySideNav', 'copyRightNav', 'copyFlag', 'init', 'leftNavInit', 'rightNavInit', 'footNavInit'],
        storage: dbStorage,
        // state 中的字段名，按组打包储存
      },
    ],
  },
});
