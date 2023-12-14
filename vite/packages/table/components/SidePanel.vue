<template>
  <xtMixMenu :menus="rightMenus" name="name" :menuHeight="'max-h-full'">
    <!-- style="z-index: 99" -->
    <div @click.stop @drop.prevent="drop" @dragover.prevent="" :id="currentId" style="min-height: 80px;z-index: 99;border: 1px solid var(--divider) !important;"
      class="flex flex-row justify-center box common-panel s-bg w-[80px] rounded-2xl xt-bg pt-0 pb-0 relative max-h-full side-bar"
      ref="sideContent" @contextmenu="showMenu">
      <div style="width: 52px;" class="w-full">
        <div :id="sortId"
          class="flex flex-col items-center flex-1 max-h-full scroller-wrapper hide-scrollbar xt-container"
          style="width: 56px;overflow-y:auto;display: flex;flex-direction: column;overflow-x: hidden;align-items: flex-start; ">
          <a-tooltip :title="item.name" v-for="(item, index) in navigationList" placement="right"
            @mouseenter="showElement(item, index)">
            <!-- 左右导航栏隐藏入口 -->
            <xt-menu :menus="iconMenus">
              <div :key="item.name" @click="clickNavigation(item)"
                :style="{ paddingBottom: index === navigationList.length - 1 ? '12px' : '0px' ,marginTop: index === 0 ? '12px' : '20px'}" >
                <div v-if="!(this.isOffline && this.navList.includes(item.event))" class="item-content item-nav"
                  :class="{ 'active-back': current(item) }">
                  <div class="flex items-center justify-center icon-color" v-if="item.type === 'systemApp'">
                    <a-avatar :size="52" shape="square" :src="item.icon"
                            :class="{ 'shaking-element': shakeElement }"></a-avatar>
                  </div>
                  <a-avatar v-else :size="52" shape="square" :src="renderIcon(item.icon)"
                    :class="{ 'shaking-element': shakeElement }"></a-avatar>

                </div>
              </div>
            </xt-menu>
          </a-tooltip>
        </div>

      </div>
      <div class="flex items-center justify-center -ml-12" v-if="this.navigationList.length <= 0" @click="this.editNavigation(this.drawerMenus[0])">
          <xt-new-icon icon="fluent:add-16-regular" size="28"></xt-new-icon>
      </div>

    </div>
  </xtMixMenu>
  <Common ref="common"></Common>
  <!-- <a-drawer :contentWrapperStyle="{ backgroundColor: '#212121', height: '216px' }" class="drawer" :closable="true"
    placement="bottom" :visible="menuVisible" @close="onClose">
    <a-row>
      <a-col>
        <div class="flex flex-wrap items-center">
          <div @click="editNavigation(item)" class="relative btn" v-for="item in drawerMenus">
            <navIcon :icon="item.icon" style="font-size: 3em"></navIcon>
            <div><span>{{ item.title }}</span></div>
            <GradeSmallTip powerType="bottomNavigation" @closeDrawer="closeDrawer"></GradeSmallTip>
          </div>
          <div @click="clickNavigation(item)" class="btn" v-for="item in builtInFeatures" :key="item.name">
            <navIcon style="font-size: 3em" :icon="item.icon"></navIcon>
            <div><span>{{ item.name }}</span></div>
          </div>
        </div>

      </a-col>
    </a-row>
  </a-drawer> -->

  <transition name="fade">
    <div :style="{ zIndex: componentId === 'navigationSetting' ? 100 : 90 }" v-if="quick">
      <!-- <EditNavigation @setQuick="setQuick" v-if="componentId === 'EditNavigation'"></EditNavigation> -->
      <EditNewNavigation @setQuick="setQuick" ref="editNewNavigation" v-if="componentId === 'EditNavigationIcon'"></EditNewNavigation>
        <navigationSetting @setQuick="setQuick" v-if="componentId === 'navigationSetting'" @hiedNav="hiedNav"></navigationSetting>
      </div>
    </transition>
</template>

<script>
import { mapActions, mapState, mapWritableState } from "pinia";
import { useNavigationStore } from './desk/navigationBar/navigationStore'
import { navStore } from "../store/nav";
import { appStore } from '../store'
import { cardStore } from '../store/card';
import { offlineStore } from '../js/common/offline';
import { useWidgetStore } from '../components/card/store'
import Sortable from 'sortablejs';
import { message } from 'ant-design-vue';
import routerTab from '../js/common/routerTab'
import { Icon as navIcon } from '@iconify/vue';
import { renderIcon } from '../js/common/common'
import { moreMenus, extraRightMenu, rightMenus, iconMenus } from '../components/desk/navigationBar/index'
import navigationSetting from './desk/navigationBar/navigationSetting.vue'
import EditNewNavigation from './desk/navigationBar/EditNewNavigation.vue'
import EditNavigation from './bottomPanel/EditNavigation.vue';
import { Notifications } from '../js/common/sessionNotice'
import Common from './desk/navigationBar/components/Common.vue'
import xtMenu from '../ui/components/Menu/index.vue'
import xtMixMenu from '../ui/new/mixMenu/FunMenu.vue'
import _ from 'lodash-es'
export default {
  name: 'SidePanel',
  components: {
    EditNavigation,
    navIcon,
    navigationSetting,
    EditNewNavigation,
    Common,
    xtMenu,
    xtMixMenu
  },
  emits: ['getDelIcon','hiedNavBar'],
  data() {
    return {
      menuVisible: false,
      quick: false,
      delNav: false,
      sortable: null,
      dragEnable: false,
      dragEvent: null,
      drawerMenus: [...extraRightMenu, ...moreMenus],
      componentId: 'EditNavigation',
      iconMenus: [
        {
          id: 1,
          newIcon: 'fluent:open-16-regular',
          label: "打开",
          callBack: () => { this.clickNavigation(this.currentItem) },
        },
        {
          id: 2,
          label: '编辑',
          newIcon: "fluent:compose-16-regular",
          callBack: () => { this.editNavigation(this.drawerMenus[1]) },
        },
        {
          id: 3,
          label: '删除',
          newIcon: 'fluent:delete-16-regular',
          color: "#FF4D4F",
          callBack: () => { this.delCurrentIcon(this.currentIndex, this.currentItem) }
        },
        {
          id: 4,
          divider: true
        },
        {
          id: 5,
          label: '添加导航图标',
          newIcon: "fluent:add-16-regular",
          callBack: () => { this.editNavigation(this.drawerMenus[0]) },
        },
        {
          id: 6,
          label: '导航栏设置',
          newIcon: 'fluent:settings-16-regular',
          callBack: () => { this.editNavigation(this.drawerMenus[1]) }
        }
      ],
      mainMenus: [
        {
          id: 1,
          newIcon: 'fluent:add-16-regular',
          name: "添加导航图标",
          fn: () => { this.editNavigation(this.drawerMenus[0]) },
        },
        {
          id: 2,
          name: '导航栏设置',
          newIcon: 'fluent:settings-16-regular',
          fn: () => { this.editNavigation(this.drawerMenus[1]) },
        },
        {
          id: 3,
          name: '隐藏当前导航',
          newIcon: "fluent:eye-off-16-regular",
          fn: () => { this.$emit('hiedNavBar',this.currentNav)},
        },
        {
          id: 4,
          name: '更多',
          newIcon: 'fluent:more-horizontal-16-filled',
          children: []

        },
        {
          divider: true,
          id: 5
        },
        {
          type: "systemApp",
          newIcon: "fluent:lock-closed-16-regular",
          name: "锁定屏幕",
          event: "lock",
          fn: () => { this.clickNavigation(this.builtInFeatures[0]) }
        },
        {
          type: "systemApp",
          newIcon: "fluent:settings-16-regular",
          name: "基础设置",
          event: "setting",
          fn: () => { this.clickNavigation(this.builtInFeatures[1]) }
        },
        {
          type: "systemApp",
          newIcon: "fluent:full-screen-maximize-16-filled",
          name: "全屏显示",
          event: "fullscreen",
          fn: () => { this.clickNavigation(this.builtInFeatures[2]) }
        },
        {
          type: "systemApp",
          newIcon: "fluent:slide-settings-24-regular",
          name: "设备设置",
          event: "status",
          fn: () => { this.clickNavigation(this.builtInFeatures[3]) }
        }
      ],
      shakeElement: false,
      currentItem: null,
      currentIndex: null,
      currentNav: 'left',
      notifications: new Notifications()
    }
  },
  props: {
    // 当前导航列表
    navigationList: {
      type: Array,
      default: () => []
    },
    // 排序的方法
    sortNavigationList: {
      type: Function,
      default: () => { }
    },
    //要排序的容器id
    sortId: {
      type: Function,
      default: () => { }
    },
    //删除的方法
    delNavList: {
      type: Function,
      default: () => { }
    },
    // 其他开关1
    otherSwitch1: {
      type: Boolean,
      default: () => false
    },
    // 其他开关2
    otherSwitch2: {
      type: Boolean,
      default: () => false
    },
    // 其他导航列表1
    otherNavList1: {
      type: Array,
      default: () => []
    },
    // 其他导航列表2
    otherNavList2: {
      type: Array,
      default: () => []
    },
    // 删除区域的开关
    delZone: {
      type: Boolean,
      default: () => false
    }
  },
  computed: {
    ...mapWritableState(navStore, ['builtInFeatures', 'mainNavigationList', 'sideNavigationList', 'rightNavigationList', 'navigationToggle']),
    ...mapWritableState(cardStore, ['routeParams']),
    ...mapWritableState(offlineStore, ['isOffline', 'navList']),
    ...mapWritableState(useWidgetStore, ['rightModel']),
    ...mapWritableState(useNavigationStore, ['editToggle', 'selectNav', 'bottomToggle', 'popVisible', 'currentList','levelVisible']),
    ...mapWritableState(appStore, ['settings']),
    // 判断当前为左侧栏还是右侧栏，返回拖拽id
    currentId() {
      if (this.currentNav === 'left') {
        return 'left-bar'
      } else if (this.currentNav === 'right') {
        return 'right-bar'
      }
    },
    childrenMenu() {
      return [
        {
          id: 1,
          name: this.bottomToggle[0] ? '隐藏用户中心' : '显示用户中心',
          newIcon: "fluent:person-16-regular",
          fn: () => { this.bottomToggle[0] = !this.bottomToggle[0] }
        },
        {
          id: 2,
          name: this.bottomToggle[1] ? '隐藏社区助手' : '显示社区助手',
          newIcon: "fluent:people-community-16-regular",
          fn: () => { this.bottomToggle[1] = !this.bottomToggle[1] }
        },
        {
          id: 3,
          name: this.bottomToggle[2] ? '隐藏任务中心' : '显示任务中心',
          newIcon: "fluent:task-list-square-16-regular",
          fn: () => { this.bottomToggle[2] = !this.bottomToggle[2] }
        },
        {
          id: 4,
          name: this.settings.enableChat ? '隐藏社群沟通' : '显示社群沟通',
          newIcon: "fluent:chat-16-regular",
          fn: () => { this.settings.enableChat = !this.settings.enableChat }
        },
        {
          id: 5,
          name: this.levelVisible ? '隐藏等级' : '显示等级',
          newIcon: "fluent:star-16-regular",
          fn: () => { this.levelVisible = !this.levelVisible }
        },
      ]

    },
    rightMenus() {
      // const arr=[...this.mainMenus[3].children]
      this.mainMenus[3].children = [...this.childrenMenu]
      // this.mainMenus[3].children=arr
      return this.mainMenus
    }
  },
  mounted() {
    this.enableDrag()
    this.colDrop()
    // this.scrollNav('sideContent', 'scrollTop')
    if (this.navigationList === this.rightNavigationList) {
      this.currentNav = 'right'
    }
    // 防止意外退出后，导致无法点击触发
    this.editToggle = false
  },
  watch: {
    delZone(val) {
      this.delNav = val
    },
    editToggle() {
      if (this.editToggle) {
        this.enableDrag()
        this.shakeElement = true
        setTimeout(() => {
          this.shakeElement = false
        }, 2000)
      } else {
        this.disableDrag()
      }
    },
    // navigationList: {
    //   deep: true,
    //   handler(newVal, oldVal) {
    //     if (oldVal.length > newVal.length && newVal.length === 0) {
    //       console.log('触发操作');
    //     }
    //     console.log('哈哈哈，没触发吧');
    //   }
    // }

  },
  methods: {
    ...mapActions(navStore, ['removeSideNavigationList', 'removeRightNavigationList', 'setSideNavigationList', 'setRightNavigationList', 'setRightNavigationList']),
    ...mapActions(useNavigationStore, ['toggleEdit']),
    ...mapActions(appStore, ['toggleFullScreen']),
    renderIcon,
    disableDrag() {
      // if (this.sortable) {
      document.removeEventListener('click', this.disableDrag)
      // this.sortable.destroy()
      this.sortable = null
      // message.info('已中止侧栏调整')
      return
      // }
    },
    /**
     * 
     * @param {*} value 导航栏设置中关闭的导航
     */
    hiedNav(value){
      this.$emit('hiedNavBar',value)
    },
    enableDrag() {
      // if (this.sortable) {
      //   return
      // }
      let that = this
      let drop = document.getElementById(this.sortId)
      // document.addEventListener('click', this.disableDrag)

      this.sortable = Sortable.create(drop, {
        sort: true,
        animation: 150,
        delay:50,
        delayOnTouchOnly: true,
        onStart: function (event) {
          if (that.popVisible) {
            that.notifications.NoticeToast()
          }
          let delIcon = document.getElementById('delIcon2')
          that.$emit('getDelIcon', true)
          this.delNav = true
          if (this.delNav) {
            delIcon.ondragover = function (ev) {
              ev.preventDefault()
            }
          }
          delIcon.ondrop = function (ev) {
            let oneNav = that.navigationList[event.oldIndex]
            //将要删除的是否是主要功能
            if (!that.mainNavigationList.find(f => f.name === oneNav.name)) {
              that.delNavList(event.oldIndex)
              return
            }
            let sumList = []
            // 判断其他导航栏是否是打开状态，是则获取功能列表
            if (that.otherSwitch1 && that.otherSwitch2) {
              sumList = that.otherNavList1.concat(that.otherNavList2)
            } else if (that.otherSwitch1 && !that.otherSwitch2) {
              sumList = that.otherNavList1
            } else if (!that.otherSwitch1 && that.otherSwitch2) {
              sumList = that.otherNavList2
            } else {
              message.info(`导航栏中至少保留一个「${oneNav.name}」`)
              // console.log('不可删除')
              return
            }
            that.delNavigation(sumList, oneNav, event.oldIndex, that.delNavList)
          }
        },
        onUpdate: _.debounce(function (event) {
          let newIndex = event.newIndex,
            oldIndex = event.oldIndex
          let newItem = drop.children[newIndex]
          let oldItem = drop.children[oldIndex]
          // console.log('newIndex', oldItem)
          // 先删除移动的节点
          drop.removeChild(newItem)
          // 再插入移动的节点到原有节点，还原了移动的操作
          if (newIndex > oldIndex) {
            drop.insertBefore(newItem, oldItem)
          } else {
            drop.insertBefore(newItem, oldItem.nextSibling)
          }
          that.sortFootNavigationList(event)
          that.footNavigationList = that.footNavigationList.filter((item)=>item!==undefined)
          that.updateMainNav();
        }, 100),
        onEnd: function (event) {
          that.$emit('getDelIcon', false)
          that.popVisible=false
        }
      })
      // message.success('开始拖拽调整侧边栏。调整完毕后点击外部即可终止。')
    },
    current(item) {
      if (item.tab) {
        return routerTab.isActive(item.tab, 1)
      }
      if (item.data?.name) {
        return this.$route.params.name === item.data.name
      } else if (item.event) {
        return this.$route.name === item.event
      } else {
        return false
      }
    },
    clickNavigation(item) {
      if (this.editToggle) {
        this.enableDrag()
        return
      }
      switch (item.type) {
        case 'systemApp':
          if (item.event === 'fullscreen') {
            this.toggleFullScreen()
          } else if (item.event === '/status') {
            if (this.$route.path === '/status') {
              this.$router.go(-1)
            } else {
              this.$router.push({ path: '/status' })
            }
          } else if (item.data) {
            this.$router.push({
              name: 'app',
              params: item.data
            })
          } else {
            this.$router.push({ name: item.event })
          }
          break
        case 'coolApp':
          this.$router.push({
            name: 'app',
            params: item.data
          })
          break
        case 'localApp':
          require('electron').shell.openPath(item.path)
          break
        case 'lightApp':
          ipc.send('executeAppByPackage', { package: item.package })
          break
        default:
          require('electron').shell.openPath(item.path ? item.path : item.url)
      }
    },
    // scrollNav(refVal, scrollDirection) {
    //   // let content = this.$refs[refVal]
    //   // content.addEventListener('wheel', (event) => {
    //   //   event.preventDefault();
    //   //   // console.log(event)
    //   //   content[scrollDirection] += event.deltaY
    //   // });
    // },
    // 拖拽桌面图标
    async drop(e) {
      // this.modelValue=false
      const width = window.innerWidth
      let files = e.dataTransfer.files
      if (e.x <= 300) {
        this.selectNav = 'left'
      } else if (e.x > 300 && e.x < width - 300) {
        this.selectNav = 'foot'
      } else if (e.x >= width - 300) {
        this.selectNav = 'right'
      }
      let filesArr = []
      if (files && files.length > 0) {
        for (let i = 0; i < files.length; i++) {
          filesArr.push(files[i].path)
        }
      }
      this.dropList = await Promise.all(filesArr.map(async (item) => {
        const fileName = item.substring(item.lastIndexOf("\\") + 1);
        let dropFiles = await tsbApi.system.extractFileIcon(item)
        return { icon: `${dropFiles}`, name: `${fileName}`, path: item }
      }))
      this.clickRightListItem(this.dropList)
      // this.dropList.forEach((item)=>{
      //   this.setFootNavigationList(item)
      // })

      // 添加完后清空
      this.dropList = []
      // this.modelValue=true
    },
    // 添加图标的主要函数
    clickRightListItem(item, index) {
      this.activeRightItem = index
      if (this.selectNav === 'left') {
        if (item instanceof Array) {
          for (let i = 0; i < item.length; i++) {
            if (!this.sideNavigationList.find(j => j.name === item[i].name)) {
              this.updateMainNav(item[i], 'add')
              item[i].addNav = true
              this.setSideNavigationList(item[i])
            } else {
              message.info('已添加', 1)
            }
          }
          this.dropList = []
        } else {
          for (let i = 0; i < this.sideNavigationList.length; i++) {
            if (this.sideNavigationList[i].name === item.name) return message.info('已添加', 1)
          }
          this.updateMainNav(item, 'add')
          item.addNav = true
          this.setSideNavigationList(item)
          this.$nextTick(() => {
            let scrollElem = this.$refs.sideContent
            scrollElem.scrollTo({ top: scrollElem.scrollHeigth, behavior: 'smooth' })
          })
        }
      } else if (this.selectNav === 'right') {
        if (item instanceof Array) {
          for (let i = 0; i < item.length; i++) {
            if (!this.rightNavigationList.find(j => j.name === item[i].name)) {
              this.updateMainNav(item[i], 'add')
              item[i].addNav = true
              this.setRightNavigationList(item[i])
            } else {
              message.info('已添加', 1)
            }
          }
          this.dropList = []
        } else {
          for (let i = 0; i < this.rightNavigationList.length; i++) {
            if (this.rightNavigationList[i].name === item.name) return message.info('已添加', 1)
          }
          this.updateMainNav(item, 'add')
          item.addNav = true
          this.setRightNavigationList(item)
        }
      }
    },
    updateMainNav(addItem, type) {
      this.mainNavList = this.currentList.length ? this.currentList : this.navigationList
      // console.log(this.mainNavList, 'this.mainNavList')
      let sumNavList = this.sideNavigationList.concat(this.footNavigationList, this.rightNavigationList)
      if (type) {
        this.mainNavList.forEach(item => {
          if (item?.name === addItem.name) {
            if (type === 'add') {
              item.addNav = true
            } else if (type === 'del') {
              item.addNav = false
            }
          }
        })
      } else {
        for (const i in this.mainNavList) {
          let stateNav = sumNavList.some(item => item.name === this.mainNavList[i].name)
          this.mainNavList[i].addNav = stateNav
        }
      }
    },
    delCurrentIcon(currentIndex, currentItem) {
      if (!this.mainNavigationList.find(f => f.name === currentItem.name)) {
        this.delNavList(currentIndex)
        return
      }
      let arr = []
      if (this.otherSwitch1 && this.otherSwitch2) {
        arr = this.otherNavList1.concat(this.otherNavList2)
      } else if (this.otherSwitch1 && !this.otherSwitch2) {
        arr = this.otherNavList1
      } else if (!this.otherSwitch1 && this.otherSwitch2) {
        arr = this.otherNavList2
      } else {
        message.info(`导航栏中至少保留一个「${currentItem.name}」`)
        return
      }
      this.delNavigation(arr, currentItem, currentIndex, this.delNavList)
    },
    navVisible() {
      if (this.currentNav === 'left') {
        this.navigationToggle[0] = false
      } else {
        this.navigationToggle[1] = false
      }
    },
    closeDrawer() {
      this.menuVisible = false
    },
    editNavigation(item) {
      if (item.component) {
        this.componentId = item.component
        // console.log(this.componentId,'===>>1');
        if (item.component === 'EditNavigationIcon') {
          this.editToggle = true
          this.selectNav = this.currentNav
          message.success('进入编辑模式')
        }
        this.quick = true
      } else if (item.visible) {
        switch (item.tag) {
          case 'task':
            this.bottomToggle[2] = !this.bottomToggle[2]
            break;
          case 'community':
            this.bottomToggle[1] = !this.bottomToggle[1]
            break;
          case 'user':
            this.bottomToggle[0] = !this.bottomToggle[0]
            break;
          case 'chat':
            this.settings.enableChat = !this.settings.enableChat
            break;
          case 'hide':
            this.navVisible()
            break;
        }
      } else {
        return
      }

      this.menuVisible = false
    },
    showMenu() {
      if (this.rightModel === 'follow') {
        return
      }
      this.routeParams.url && ipc.send('hideTableApp', { app: JSON.parse(JSON.stringify(this.routeParams)) })
      // if(this.rightModel !=='follow'){
      this.menuVisible = true
      // this.editToggle=true
      // }

    },
    setQuick() {
      this.quick = false
      this.editToggle = false
    },
    onClose() {
      this.routeParams.url && this.$router.push({ name: 'app', params: this.routeParams })
      this.menuVisible = false
    },
    colDrop() {

    },
    delNavigation(sumList, oneNav, index, delMethod) {
      if (!this.mainNavigationList.find(item => item.name === oneNav.name)) {
        //如果不是必须的
        delMethod(index)
      } else {
        if (sumList.find(item => item.name === oneNav.name)) {
          //正常移除
          delMethod(index)
        } else {
          //不可移除
          message.info(`导航栏中至少保留一个「${oneNav.name}」`)
        }
      }
    },
    showElement(item, index) {
      // console.log(item,index,'====>>>1111');
      // this.clickNavigation(item)
      this.currentItem = item
      this.currentIndex = index
    },
  }
}
</script>

<style scoped lang="scss">
:deep(.icon) {
  fill: var(--secondary-text);
}



.item:hover {
  background: var(--active-bg) !important;

  // :deep(.icon) {
  //   // fill: var(--primary-text) !important
  // }
}

// .active-back {
//   :deep(.icon) {
//     // fill: var(--active-bg) !important
//   }
// }
.shaking-element {
  // animation: shake 0.5s infinite;
  animation: shake 1s ease-in-out;
}

@keyframes shake {
  0% {
    transform: translateY(0);
  }

  25% {
    transform: rotate3d(0, 0, 1, -15deg);
  }

  50% {
    transform: rotate3d(0, 0, 1, 15deg);
  }

  75% {
    transform: rotate3d(0, 0, 1, -15deg);
  }

  100% {
    transform: translateY(0);
  }
}

.item {
  margin: 8px;
}

.item-nav {
  width: 52px;
  height: 52px;
  // margin: 6px auto;
  // margin-top: 20px;
  display: flex;
  align-items: center;
  cursor: pointer;
  border-radius: 12px;
  // background-color: var(--secondary-transp-bg);

}

// .item-nav:last-child{
//   margin-bottom: 12px;
// }

// .item-nav:hover {
//   background: var(--active-bg);
//   .icon-color {
//     :deep(.icon) {
//       fill: rgba(255,255,255,0.9) !important;
//     }
//   }
// }
.icon-color {
  height: 52px;
  width: 52px;
}

.icon-color:hover {
  color: rgba(255, 255, 255, 0.8) !important;
}

//.dark-model .active-back{
//  background: var(--active-secondary-bg) !important;
//}
.active-back {
  // border: 1px solid red;

  // color: var(--primary-text) !important;
  // background: var(--active-bg);

  :deep(.icon) {
    fill: rgba(255, 255, 255, 0.9) !important;
  }

  //:deep(.icon) {
  //  fill: var(white) !important;
  //}
}

.active-color {
  color: rgba(255, 255, 255, 0.8) !important;
}

.btn {
  text-align: center;
  margin-right: 12px;
  border-radius: 12px;
  width: 110px;
  height: 100px;
  padding-top: 16px;
  line-height: 30px;
  margin-bottom: 24px;
  flex-shrink: 0;
}

@media screen and (max-height: 510px) {
  .side-panel {
    zoom: 0.82;
    margin-top: 3.5em;
  }
}

@media screen and (min-height: 511px) and (max-height: 550px) {
  .side-panel {
    zoom: 0.9;
  }
}

@media screen and (min-height: 551px) and (max-height: 610px) {
  .side-panel {
    zoom: 0.9;
  }
}

.hide-scrollbar {
  &::-webkit-scrollbar {
    display: none;
    /* Chrome Safari */
  }
}
</style>
