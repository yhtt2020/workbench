import {defineStore} from "pinia";
import dbStorage from "./dbStorage";
import {nanoid} from "nanoid";
import _ from 'lodash-es'
import {usePlat} from "../ui/hooks/usePlat";
import {DEFAULT} from "../js/const/default";
// @ts-ignore


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
        if (usePlat('web')) {
          this.copyFootNav = [...DEFAULT.NAV_WEB]
        } else {
          this.copyFootNav = [...DEFAULT.NAV_CLIENT]
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
