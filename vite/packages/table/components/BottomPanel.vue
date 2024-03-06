<template>
  <xtMixMenu :menus="mainOption" name="name" class="flex max-w-full">
    <!-- xt-main-bottom-bar 定位类不可删 -->

    <!-- 控制中心弹窗 -->
    <div class="absolute" v-if="controlVisible" style="z-index: 888" id="control" :style="{
    left: `${controlLeft}px`,
    bottom: `${(navAttribute.navSize / 100) * 100}px`,
  }">
      <ControlModal @close="controlVisible = false"></ControlModal>
    </div>

    <AutoHide>
      <div @click.stop class="flex flex-row items-center justify-center w-full mb-3 xt-main-bottom-bar bottom-panel"
        id="bottom-bar" style="text-align: center; position: relative" @contextmenu="showMenu" v-show="autoVisible"
        :style="{ zoom: `${this.navAttribute.navSize / 100}` }">
        <!-- 快速搜索 底部 用户栏 -->
        <UserBar @openControl="openControl"></UserBar>
        <!-- 快速搜索 底部栏区域 -->
        <Drop @createFile="createFile" currentId="bottom">
          <Dock 
            @edit="edit" 
            @control="openControl" 
            @getDelIcon="getDelIcon" 
            ref="dock">
          </Dock>
        </Drop>
        <keep-alive>
          <TaskBox v-if="true"></TaskBox>
        </keep-alive>
        <keep-alive>
          <Favorites v-if="true"></Favorites>
        </keep-alive>
        <Common ref="common"></Common>
      </div>
    </AutoHide>
  </xtMixMenu>

  <transition name="fade">
    <div :style="{ zIndex: componentId === 'navigationSetting' ? 100 : 90 }" v-if="quick">
      <component :is="componentId" @setQuick="setQuick"></component>
    </div>
  </transition>
</template>

<script>
import { taskStore } from '../apps/task/store'
import { appStore } from '../store'
import { navStore } from '../store/nav'
import { useDeskStore } from '../components/desk/store'
import { useNavigationStore } from './desk/navigationBar/navigationStore'
import { mapWritableState, mapActions } from 'pinia'
import { isMain } from '../js/common/screenUtils'

// import ChangeApp from './bottomPanel/ChangeApp.vue'

import TeamTip from './TeamTip.vue'
import { teamStore } from '../store/team'
import { messageStore } from '../store/message'
import { appsStore } from '../store/apps'
import { screenStore } from '../store/screen'
import TaskBox from '../apps/task/page/TaskBox.vue'
import Favorites from '../apps/favorites/page/index.vue'
import navigationData from '../js/data/tableData'
import { offlineStore } from '../js/common/offline'
import { moreMenus, extraRightMenu } from '../components/desk/navigationBar/index'
import { useMergeFolder } from '../components/desk/navigationBar/hook/mergeFolder.ts'
import navigationSetting from './desk/navigationBar/navigationSetting.vue'
import EditNewNavigation from './desk/navigationBar/EditNewNavigation.vue'
import { useNavBarStore } from './desk/navigationBar/navBar'
import xtMixMenu from '../ui/new/mixMenu/FunMenu.vue'
import EditIcon from './desk/navigationBar/components/EditIcon/EditIcon.vue'
import _ from 'lodash-es'
import { nanoid } from 'nanoid'
import Drop from './desk/navigationBar/components/folder/Drop.vue'
import { useWindowSize } from '../ui/new/drag/src/hooks/useWindowSize'
import Common from './desk/navigationBar/components/Common.vue';
import { useElementSize } from "../ui/new/drag/src/hooks/useElementSize";
import ControlModal from './desk/navigationBar/components/control/ControlModal.vue';
import { hoverRealItemId } from './desk/navigationBar/hook/hoverRealItemId'
import AutoHide from './desk/navigationBar/components/folder/AutoHide.vue'
import { mergeData } from '../ui/hooks/useDataConversion'

import UserBar from './bottomPanel/UserBar.vue'
import Dock from './bottomPanel/Dock.vue'

import { useFullscreen } from '@vueuse/core'
const {
  //是否全屏状态
  isFullscreen,
  //切换全屏
  toggle
} = useFullscreen()
export default {
  name: 'BottomPanel',
  emits: ['getDelIcon', 'hiedNavBar'],
  components: {
    Dock,
    TeamTip,
    TaskBox,
    navigationSetting,
    EditNewNavigation,
    xtMixMenu,
    EditIcon,
    Drop,
    Common,
    ControlModal,
    AutoHide,
    Favorites,
    UserBar,
  },
  data() {
    return {
      dragItem: null,
      hoverIndex: -1,//当前选中的项目（排除gap）
      debug: false,
      tab: 'screen',

      quick: false,
      leftNav: false,
      rightNav: false,
      delNav: false,
      //screenWidth: document.body.clientWidth
      drawerMenus: [...extraRightMenu, ...moreMenus],
      componentId: 'EditNavigationIcon',
      mainMenus: [
        {
          id: 1,
          newIcon: 'fluent:add-16-regular',
          name: '添加导航图标',
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
          name: '关闭当前导航',
          newIcon: 'fluent:eye-off-16-regular',
          fn: () => { this.$emit('hiedNavBar', 'foot') },
        },
        {
          id: 4,
          name: '清空当前导航栏',
          newIcon: 'fluent:circle-off-16-regular',
          fn: () => { this.clearAll() },
        },
        {
          id: 8,
          name: '更多',
          newIcon: 'fluent:more-horizontal-16-filled',
          children: []

        },
        {
          divider: true,
          id: 12
        },
        {
          id: 13,
          type: 'systemApp',
          newIcon: 'fluent:lock-closed-16-regular',
          name: '锁定屏幕',
          event: 'lock',
          fn: () => { this.$refs.dock.newOpenApp(this.builtInFeatures[0]) }
        },
        {
          id: 14,
          type: 'systemApp',
          newIcon: 'fluent:settings-16-regular',
          name: '基础设置',
          event: 'setting',
          fn: () => { this.$refs.dock.newOpenApp(this.builtInFeatures[1]) }
        },
        {
          id: 15,
          type: 'systemApp',
          newIcon: 'fluent:full-screen-maximize-16-filled',
          name: '全屏显示',
          event: 'fullscreen',
          fn: () => { this.$refs.dock.newOpenApp(this.builtInFeatures[2]) }
        },
        {
          id: 16,
          type: 'systemApp',
          newIcon: 'fluent:slide-settings-24-regular',
          name: '设备设置',
          event: 'status',
          fn: () => { this.$refs.dock.newOpenApp(this.builtInFeatures[3]) }
        }
      ],
      // 弹窗显示
      noticeFlag: true,
      addIconFlag: false,
      left: 0,
      parentSize: 0,
      // 控制中心弹窗
      controlVisible: false,
      controlLeft: 100,
      skipSimple: false,
      parentHeight: 0,
      hoverTabs: false,
      delZone: false,
    }
  },
  props: {
  },
  unmounted() {
    window.removeEventListener('mousemove', that.listenMouse)
  },
  mounted() {
    this.$bus.on('stopHide', () => { this.hoverTabs = true })
    this.$bus.on('startHide', () => { this.hoverTabs = false })
    if (!this.bottomInit) {
      navigationData.systemAppList.forEach((item) => {
        this.copyFootNav.forEach((i) => {
          if (item.event === i.event) {
            i.type = 'systemApp'
            i.icon = item.icon
            i.name = item.name
            i.value = item.event
            i.mode = 'app'
          }
        })
      })
    }
    // 图标整体替换格式方法
    this.copyFootNav = this.copyFootNav.map((item) => this.mergeData(item))
    this.bottomInit = true
    //对id进行强制修复
    this.copyFootNav.forEach(item => {
      if (!item.id) {
        item.id = nanoid(6)
      }
    })
    this.noticeFlag = true

    this.useWindowSize((size) => {
      // 获取最大可添加图标个数
      const windowWidth = size.width.value
      const windowHeight = size.height.value
      this.parentSize = windowWidth
      this.parentHeight = windowHeight
      this.maxItemNum = Math.round((windowWidth - 240) / 72)
      const width = windowWidth / (240 + this.copyFootNav.length * 72)
      this.navAttribute.navSize = width.toFixed(2) * 100
      this.navAttribute.navSize = this.navAttribute.navSize < 100 ? this.navAttribute.navSize : 100
    }, 200)
    window.addEventListener('mousemove', this.listenMouse)
  },
  computed: {
    ...mapWritableState(appStore, ['userInfo', 'settings', 'lvInfo', 'simple']),
    ...mapWritableState(appsStore, ['runningApps', 'runningTableApps']),
    ...mapWritableState(teamStore, ['team', 'teamVisible']),
    ...mapWritableState(screenStore, ['screens']),
    ...mapWritableState(navStore, [
      'footNavigationList',
      'builtInFeatures',
      'sideNavigationList',
      'rightNavigationList',
      'mainNavigationList',
      'navigationToggle', 'maxItemNum', 'init',
      'copyFootNav', 'copySideNav', 'copyRightNav'
    ]),
    ...mapWritableState(offlineStore, ['isOffline', 'navList']),
    ...mapWritableState(useNavigationStore, [
      'editToggle', 'taskBoxVisible',
      'selectNav', 'bottomToggle',
      'popVisible', 'currentList',
      'editItem', 'navAttribute', 'iconRadius', 'jumpDesk', 'customOpenNav', 'isLeaveBar', 'isEdge', 'bottomInit'
    ]),
    ...mapWritableState(taskStore, ['isTask', 'isTaskDrawer']),
    ...mapWritableState(useDeskStore, ['isEnterBar']),

    ...mapWritableState(useNavBarStore, ['isEnterDesk']),

    isMain() {
      return isMain()
    },
    childrenMenu() {
      return [
        {
          id: 1,
          name: this.bottomToggle[0] ? '隐藏用户中心' : '显示用户中心',
          newIcon: 'fluent:person-16-regular',
          fn: () => { this.bottomToggle[0] = !this.bottomToggle[0] }
        },
        {
          id: 2,
          name: this.bottomToggle[1] ? '隐藏社区助手' : '显示社区助手',
          newIcon: 'fluent:people-community-16-regular',
          fn: () => { this.bottomToggle[1] = !this.bottomToggle[1] }
        },
        {
          id: 3,
          name: this.bottomToggle[2] ? '隐藏任务中心' : '显示任务中心',
          newIcon: 'fluent:task-list-square-16-regular',
          fn: () => { this.bottomToggle[2] = !this.bottomToggle[2], this.isTask = !this.isTask }
        },
        {
          id: 4,
          name: this.settings.enableChat ? '隐藏社群沟通' : '显示社群沟通',
          newIcon: 'fluent:chat-16-regular',
          fn: () => { this.settings.enableChat = !this.settings.enableChat }
        },
      ]

    },
    rightMenus() {
      this.mainMenus[4].children = [...this.childrenMenu]
      return this.mainMenus
    },
    mainOption() {
      const custom = {
        id: 5,
        name: this.customOpenNav ? '关闭自动隐藏' : '开启自动隐藏',
        newIcon: 'fluent:eye-off-16-regular',
        fn: () => { this.customOpenNav = !this.customOpenNav }
      }
      let arr = [...this.rightMenus, custom]
      return arr.sort((a, b) => a.id - b.id)
    },

    autoVisible() {
      if (this.customOpenNav) {
        if (this.isEdge || this.hoverTabs) {
          return true
        }
        if (this.isLeaveBar && !this.controlVisible && !this.folderVisible) {
          return false
        }
        return true
      } else {
        return this.navigationToggle[2]
      }

    },
  },
  watch: {
    delZone(val) {
      this.delNav = val
      this.$emit('getDelIcon', val)
    },
    navigationToggle: {
      immediate: true,
      deep: true,
      handler(val) {
        this.leftNav = val[0]
        this.rightNav = val[1]
      },
    },
    simple(newVal, oldVal) {
      if (newVal && !oldVal) {
        // 当 simple 从关闭变为开启时，关闭所有 bottomToggle
        this.bottomToggle[0] = false
        this.bottomToggle[1] = false
        this.bottomToggle[2] = false
      } else if (!newVal && oldVal) {
        // 当 simple 从开启变为关闭时，开启所有 bottomToggle
        if (this.skipSimple) {
          this.bottomToggle[0] = true
        } else {
          this.bottomToggle[0] = true
          this.bottomToggle[1] = true
          this.bottomToggle[2] = true
        }

      }
    },
    bottomToggle: {
      deep: true,
      handler(newV, oldV) {
        if ((this.bottomToggle[0] && this.bottomToggle[1] && this.bottomToggle[2]) || this.bottomToggle[0]) {
          this.simple = false
          this.skipSimple = true
        } else if (!this.bottomToggle[0] && !this.bottomToggle[1] && !this.bottomToggle[2]) {
          this.simple = true
        }
      }
    },
    isTask() {
      if (this.isTask) {
        this.bottomToggle[2] = true
      } else {
        this.bottomToggle[2] = false
      }
    },
  },
  methods: {
    useElementSize,
    ...mapActions(teamStore, ['updateMy']),
    ...mapActions(messageStore, ['getMessageIndex']),
    ...mapActions(appStore, ['toggleFullScreen', 'settings']),
    ...mapActions(navStore, [
      'fixData',
      'setFootNavigationList',
      'sortFootNavigationList',
      'removeFootNavigationList',

    ]),
    ...mapActions(useNavigationStore, ['toggleEdit', 'toggleTaskBox']),
    mergeData,
    listenMouse(e) {
      if (e.x < 50 || e.x > (this.parentSize - 50) || e.y > (this.parentHeight - 50)) {
        this.isEdge = true
      } else {
        setTimeout(() => {
          this.isEdge = false
        }, 800);
      }
    },

    /**
     * 清空当前导航栏
     */
    clearAll() {
      this.$bus.emit('clearAll', 'foot')
    },
    /**
     * 隐藏导航
     */
    hiedNav(value) {
      this.$emit('hiedNavBar', value)
    },
    /**
     * 打开菜单选项
     * @param {*} item
     */
    editNavigation(item) {
      if (item.component) {
        this.componentId = item.component
        if (item.component === 'EditNewNavigation') {
          this.editToggle = true
          this.selectNav = 'foot'
        }
        this.quick = true
      }
    },

    edit(value) {
      this.componentId = value
      this.quick = true
    },

    getDelIcon(value) {
      this.delZone = value
    },
    /**
     * 关闭弹窗
     */
    setQuick() {
      this.quick = false
      this.editToggle = false
    },
    createFile(item, x) {
      const bottom = document.querySelector('#bottomPanel')
      const rect = bottom.getBoundingClientRect()
      const index = Math.round((x.x - rect.x) / (72 * this.navAttribute.navSize / 100))
      this.dragItem = null
      if (this.copyFootNav[this.hoverIndex]?.type === 'folder') {
        const merged = this.useMergeFolder(this.copyFootNav, item, this.copyFootNav.find(i => {
          return i.id === this.hoverRealItemId('bottomContent', this.hoverIndex)
        }))
        this.copyFootNav.splice(this.copyFootNav.findIndex(i => {
          return i.id === this.hoverRealItemId('bottomContent', this.hoverIndex)
        }), 1, merged)
        this.copyFootNav = this.copyFootNav.filter(i => {
          return i.id !== item.id
        })
      }
      else {
        this.copyFootNav.splice(index, 0, _.cloneDeep(item))
      }
      // 从外部拖拽元素到导航栏，跳过合并提示
      this.hoverIndex = -1

    },
    hoverRealItemId,
    useWindowSize,
    useMergeFolder,

    //  点击头像框打开控制中心
    openControl(event) {
      this.controlVisible = !this.controlVisible;
      this.controlLeft = event.clientX - 274 < 0 ? 0 : event.clientX - 274
    },


  },

}
</script>

<style lang="scss" scoped>
.bottom-panel {
  :deep(.icon) {
    fill: var(--primary-text);
  }
}

.common-panel {
  margin-bottom: 0;
}

.icon-bg {
  background-color: var(--secondary-transp-bg);
}

.delete-icon {
  width: 14px;
  height: 14px;
  color: #ff4d4f;
  position: absolute;
  top: 5px;
  right: 5px;
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

.status-text {
  font-size: 1.5em;
  line-height: 3em;
  height: 3em;
  width: 6em;
  text-align: center;
}

.bottom-panel .common-panel {
  padding: 0.2em 0.8em 0.2em 0.8em !important;
}

.scroll-content {
  :last-child {
    margin-right: 0;
  }
}

.hover {
  opacity: 0.5;
}
</style>
./bottomPanel/Dock.vue/index.ts