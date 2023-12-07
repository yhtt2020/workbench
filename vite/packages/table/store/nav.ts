import {defineStore} from "pinia";
import dbStorage from "./dbStorage";
// @ts-ignore
let arrData = [
  { 'type': 'systemApp', 'icon': 'shouye1', 'name': '主页', 'event': 'home' },
  { 'type': 'systemApp', 'icon': 'yingyongzhongxin', 'name': '应用管理', 'event': 'apps' },
  { 'type': 'systemApp', 'icon': 'kuaijie1', 'name': '快捷指令', 'event': 'deck' },
  { 'type': 'systemApp', 'icon': 'fluent:document-bullet-list-multiple-24-regular', 'name': '办公', 'event': 'work' },
  { 'type': 'systemApp', 'icon': 'yinle1', 'name': '音乐', 'event': 'music' },
  { 'type': 'systemApp', 'icon': 'youxishoubing', 'name': '游戏', 'event': 'gameIndex' },
  { 'type': 'systemApp', 'icon': 'fluent:chat-16-regular', 'name': '社群(开发中)', 'event': 'chat' },
  { 'type': 'systemApp', 'icon': '/logo/lock.svg', 'name': '锁定屏幕', 'event': 'lock' },
  { 'type': 'systemApp', 'icon': '/logo/fullScreen.svg', 'name': '全屏显示', 'event': 'fullscreen' },
  { 'type': 'systemApp', 'icon': 'setting', 'name': '基础设置', 'event': 'setting' }
]
export const navStore = defineStore("nav", {
  state: () => ({
    mainNavigationList: [
      {
        type: 'systemApp',
        icon: '/logo/home.svg',
        name: '桌面主页',
        event: 'home',
        tab:'home'
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
    sideNavigationList: [],
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
