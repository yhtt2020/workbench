<template>
  <xtMixMenu :menus="rightMenus" name="name" class="flex max-w-full">
    <!-- <xt-menu :menus="rightMenus" name="name" class="flex max-w-full"  :beforeCreate="beforeCreate"> -->
    <!-- xt-main-bottom-bar 定位类不可删 -->
    <!-- 文件夹弹窗 -->
    <div style="position: absolute; z-index: 500 !important;"
      :style="{ left: `${this.left}px`, bottom: `${navAttribute.navSize / 100 * 100}px` }" class="rounded-xl pointer "
      id="folder">
      <Folder @clickFile="clickFile" @update:layout="updateLayout" @update:size="updateSize" :customData="customData" :customIndex="bottomKey"
        :secondary="true" v-if="folderVisible" :expand="{ disabled: true }"
        :navBar="{ resize: false, sizeOption: false, isDel: true, hierarchy: true }" :auto="true" />
      <ControlModal ref="controlRef" v-if="controlVisible" @close="controlVisible = false" :full="full" @setFull="setFull"/>
    </div>
    <div @click.stop class="flex flex-row items-center justify-center w-full mb-3 xt-main-bottom-bar bottom-panel"
      id="bottom-bar" style="text-align: center;position: relative;" @contextmenu="showMenu" v-show="navigationToggle[2]"
      :style="{ zoom: `${(this.navAttribute.navSize / 100)}` }">
      <!-- 快速搜索 底部 用户栏 -->
      <div v-if="(!simple || settings.enableChat) && !this.isOffline && this.bottomToggle[0]"
        class="relative flex flex-row items-center justify-between common-panel user s-bg" style="
        /* vertical-align: top; */
        margin-top: 0;
        background: var(--primary-bg);
        color: var(--primary-text);
        border-radius: 18px;
        border: 1px solid var(--divider);
        height: 80px;
        display: flex;
        justify-content: center;
      "
        :style="{ width: this.settings.enableChat ? '160px' : '80px', paddingLeft: this.settings.enableChat ? '16px !important' : '0px !important', paddingRight: this.settings.enableChat ? '16px !important' : '0px !important', borderRadius: this.navAttribute.navRadius + 'px' }">
        <div class="flex items-center justify-between" :style="{ marginLeft: this.settings.enableChat ? '10px' : '0px' }">
          <MyAvatar :chat="true" :level="false"></MyAvatar>
          <div v-show="settings.enableChat" class="pl-4 pointer">
            <ChatButton :tipPosition="navAttribute.navSize"></ChatButton>
          </div>
        </div>

      </div>
      <div v-if="false"
        style="position: fixed;top: 10px;background: black;color:white;z-index:99999;line-height: 14px;text-align: left;max-width: 100vw;left:0">
        <div>选中的id{{ hoverIndex }}</div>
        <div v-for="( item, index) in copyFootNav" style="margin-bottom: 5px;border-bottom: 4px solid white">
          {{ index }} {{ item.name }} {{ item.id }} {{ item.children?.length }}
        </div>
      </div>
      <!-- 快速搜索 底部栏区域 -->
      <Drop @createFile="createFile">
        <transition>
          <div v-if="hoverIndex > -1 && !skipSort && hoverRealItemId() !== dragItem?.id"
            style="position: absolute;z-index:99999999999;top:-8px;left:50%;transform: translateX(-50%) translateY(-100%)  ;"
            class="px-10 py-3 rounded-lg s-bg xt-text">松开鼠标合并</div>
        </transition>
        <div id="bottomPanel" @drop.prevent="drop" @dragover.prevent="" class="flex flex-row items-center s-bg" style="
        display: flex;
        flex-direction: column;
        justify-content: center;
        justify-items: center;
        align-content: center;
        align-items: center;
        /* border-radius: 18px; */
        height: 80px;
        max-width: 100%;
        overflow: hidden;
        margin-right: 10px;
        background: var(--primary-bg);
        color: var(--primary-text);
        z-index: 99;
        min-width: 80px;
        border: 1px solid var(--divider);
      " :style="{ borderRadius: this.navAttribute.navRadius + 'px' }">

          <xt-task id='M0104' no='1' :mask="false" @cb="showMenu" class="w-full ">
            <div style="
          display: flex;
          flex-direction: row;
          width: 100%;
          height: 52px;
          align-items: start;
          flex-wrap: nowrap;
          justify-content: center;
        ">
              <div @contextmenu="showMenu" style="height: 52px; width: 100%; overflow: hidden" class="item-content">
                <div class="w-full scroll-content" style=" flex: 1; display: flex; margin-left: 20px;margin-right: 20px"
                  ref="content">
                  <div :key="bottomKey" style="white-space: nowrap; display: flex; align-items: center;gap:20px"
                    class="w-full" id="bottomContent">

                    <div v-if="copyFootNav.length <= 0" style=""
                      class="flex items-center justify-center  w-[52px] h-[52px]"
                      @click="this.editNavigation(this.drawerMenus[0])">
                      <xt-new-icon icon="fluent:add-16-regular" size="32" class="xt-text"></xt-new-icon>
                    </div>
                    <a-tooltip v-for="(item, index) in copyFootNav" :key="item.id" :title="item.name"
                      :overlayStyle="{ zoom: `${(this.navAttribute.navSize / 100)}` }"
                      @mouseenter="showElement(item, index)">
                      <xt-menu :id="item.id" class="relative overflow-visible item-content" :menus="folderOptions">

                        <div @dragover="onDrag" @dragend="hoverIndex = -1"
                          v-if="!(this.navList.includes(item.event) && this.isOffline)"
                          class="flex items-center justify-center pointer"
                          :class="{ hover: (dragItem && item.id === hoverRealItemId() && dragItem?.id !== hoverRealItemId()) }"
                          style="white-space: nowrap; display: inline-block;border-radius: 18px;"
                          @click.stop="newOpenApp(item.type, item.value, item)">

                          <Team v-if="item.value === 'commun'" :item="item" :shakeElement="shakeElement"
                            :placement="'top'">
                          </Team>
                          <FolderVue v-else-if="item.type === 'folder'" :iconList="item.children" :item="item"
                            @click="openFolder(item)">
                          </FolderVue>
                          <template v-else>
                            <Avatar :item="item" :shakeElement="shakeElement"></Avatar>
                          </template>
                        </div>
                      </xt-menu>
                    </a-tooltip>
                  </div>

                </div>
              </div>
            </div>
          </xt-task>

        </div>
      </Drop>
      <keep-alive>
        <TaskBox v-if="true"></TaskBox>
      </keep-alive>
      <Common></Common>
    </div>

    <div id="trans" v-show="visibleTrans" style="
      position: fixed;
      left: 0;
      top: 0;
      width: 100vw;
      height: 100vh;
      background: #2c2c2c;
    ">
      <a-button @click="visibleTrans = false" style="position: fixed; left: 10px; top: 10px">取消
      </a-button>
      <iframe id="transFrame" style="width: 100vw; height: 100vh; border: none">
      </iframe>
    </div>
    <!-- </xt-menu> -->
  </xtMixMenu>

  <transition name="fade">
    <div :style="{ zIndex: componentId === 'navigationSetting' ? 100 : 90 }" v-if="quick">
      <!-- 老版 -->
      <!-- <EditNavigation @setQuick="setQuick" v-if="componentId === 'EditNavigation'"></EditNavigation> -->
      <!-- 新版 -->
      <EditNewNavigation @setQuick="setQuick" ref="editNewNavigation" v-if="componentId === 'EditNavigationIcon'">
      </EditNewNavigation>
      <navigationSetting @setQuick="setQuick" v-if="componentId === 'navigationSetting'" @hiedNav="hiedNav">
      </navigationSetting>
      <EditIcon @setQuick="setQuick" v-if="componentId === 'EditIcon'"></EditIcon>
      <!-- <component :is='componentId'></component> -->
    </div>
  </transition>

  <div class="fixed inset-0 home-blur" style="z-index: 999; background: var(--mask-background-color)" v-if="changeFlag"
    @click="closeChangeApp">
    <ChangeApp :tab="tab" @closeChangeApp="closeChangeApp" :full="full" @setFull="setFull"></ChangeApp>
  </div>
  <TeamTip :key="teamKey" v-model:visible="showTeamTip"></TeamTip>
</template>

<script>
import PanelButton from './PanelButton.vue'
import { taskStore } from '../apps/task/store'
import { appStore } from '../store'
import { cardStore } from '../store/card'
import { navStore } from '../store/nav'
import { useDeskStore } from '../components/desk/store'
import { useNavigationStore } from './desk/navigationBar/navigationStore'
import { mapWritableState, mapActions } from 'pinia'
import { useWidgetStore } from '../components/card/store'
import Template from '../../user/pages/Template.vue'
import { ThunderboltFilled } from '@ant-design/icons-vue'
import { Modal } from 'ant-design-vue'
// import SidePanel from './SidePanel.vue'
// import SecondPanel from './SecondPanel.vue'
import GradeSmallTip from './GradeSmallTip.vue'
import { isMain } from '../js/common/screenUtils'

import EditNavigation from './bottomPanel/EditNavigation.vue'
import ChangeApp from './bottomPanel/ChangeApp.vue'
import ScrolX from './ScrolX.vue'

import TeamTip from './TeamTip.vue'
import { teamStore } from '../store/team'
import { messageStore } from '../store/message'
import { appsStore } from '../store/apps'
import { screenStore } from '../store/screen'
import { renderIcon } from '../js/common/common'
import MyAvatar from './small/MyAvatar.vue'
import Team from './bottomPanel/Team.vue'
import Sortable from 'sortablejs'
import { message } from 'ant-design-vue'
import TaskBox from '../apps/task/page/TaskBox.vue'
import Emoji from './comp/Emoji.vue'
import ChatButton from './bottomPanel/ChatButton.vue'
import { Icon as navIcon } from '@iconify/vue'
import navigationData from '../js/data/tableData'
import { offlineStore } from '../js/common/offline'
import { moreMenus, extraRightMenu, mergeIconFolder, updateIcon } from '../components/desk/navigationBar/index'
import { replaceType } from '../components/desk/navigationBar/hook/replaceType'
import navigationSetting from './desk/navigationBar/navigationSetting.vue'
import EditNewNavigation from './desk/navigationBar/EditNewNavigation.vue'
import { Notifications } from '../js/common/sessionNotice'
// import xtMenu from '../ui/components/Menu/index.vue'
import xtMixMenu from '../ui/new/mixMenu/FunMenu.vue'
import EditIcon from './desk/navigationBar/components/EditIcon/EditIcon.vue'
import { startApp } from '../ui/hooks/useStartApp'
import _ from 'lodash-es'
import Avatar from './desk/navigationBar/components/Avatar.vue'
import FolderVue from './desk/navigationBar/components/folder/Folder.vue'
import Folder from '../apps/folder'
import { defaultFolderData } from '../apps/folder/src/components/options'
import { nanoid } from 'nanoid'
// import Drop from '../apps/folder/src/components/Drop.vue'
import Drop from './desk/navigationBar/components/folder/Drop.vue'
import { useWindowSize, } from '../ui/new/drag/src/hooks/useWindowSize'
import Common from './desk/navigationBar/components/Common.vue';
import { useElementSize } from "../ui/new/drag/src/hooks/useElementSize";
import ControlModal from './desk/navigationBar/components/control/ControlModal.vue';


export default {
  name: 'BottomPanel',
  emits: ['getDelIcon', 'hiedNavBar'],
  components: {
    ChatButton,
    Emoji,
    MyAvatar,
    TeamTip,
    // SecondPanel,
    // SidePanel,
    Template,
    PanelButton,
    ThunderboltFilled,
    EditNavigation,
    ChangeApp,
    ScrolX,
    GradeSmallTip,
    Team,
    TaskBox,
    navIcon,
    navigationSetting,
    EditNewNavigation,
    xtMixMenu,
    EditIcon,
    Avatar,
    FolderVue,
    Folder,
    Drop,
    Common,
    ControlModal,
  },
  data() {
    return {
      dragItem: null,
      targetItem: null,
      cancelUpdate: false,
      sortable: null,
      bottomKey: Date.now(),
      hoverIndex: -1,//当前选中的项目（排除gap）
      debug: false,
      tab: 'screen',

      lastTime: 0,
      visibleTrans: false,
      full: false,
      //显示小组提示
      showTeamTip: false,
      teamKey: Date.now(),
      updateMessageTimer: null,

      timer: null,

      tipped: false,
      menuVisible: false,
      quick: false,
      scrollbarSettings: {
        useBothWheelAxes: true,
        swipeEasing: true,
        suppressScrollY: true,
        suppressScrollX: false,
        wheelPropagation: true,
      },
      changeFlag: false,
      timerRunning: false,
      showScreen: false,
      leftNav: false,
      rightNav: false,
      delNav: false,
      //screenWidth: document.body.clientWidth
      drawerMenus: [...extraRightMenu, ...moreMenus],
      componentId: 'EditNavigationIcon',
      // editBar:false，
      dropList: [],
      iconMenus: [
        {
          id: 1,
          newIcon: 'fluent:open-16-regular',
          label: '打开',
          callBack: () => { this.newOpenApp(this.currentItem.type, this.currentItem.value) },
        },
        {
          id: 2,
          label: '编辑',
          newIcon: 'fluent:compose-16-regular',
          callBack: () => { this.editIcon(this.currentItem) },
        },
        {
          id: 3,
          label: '删除',
          newIcon: 'fluent:delete-16-regular',
          color: '#FF4D4F',
          callBack: () => { this.delCurrentIcon(this.currentIndex, this.currentItem) }
        },
        {
          id: 5,
          divider: true
        },
        {
          id: 6,
          label: '添加导航图标',
          newIcon: 'fluent:add-16-regular',
          callBack: () => { this.editNavigation(this.drawerMenus[0]) },
        },
        {
          id: 7,
          label: '导航栏设置',
          newIcon: 'fluent:settings-16-regular',
          callBack: () => { this.editNavigation(this.drawerMenus[1]) }
        }
      ],
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
          name: '隐藏当前导航',
          newIcon: 'fluent:eye-off-16-regular',
          fn: () => { this.$emit('hiedNavBar', 'foot') },
        },
        {
          id: 8,
          name: '清空当前导航栏',
          newIcon: 'fluent:circle-off-16-regular',
          fn: () => { this.clearAll() },
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
          type: 'systemApp',
          newIcon: 'fluent:lock-closed-16-regular',
          name: '锁定屏幕',
          event: 'lock',
          fn: () => { this.newOpenApp(this.builtInFeatures[0].type, this.builtInFeatures[0].value) }
        },
        {
          type: 'systemApp',
          newIcon: 'fluent:settings-16-regular',
          name: '基础设置',
          event: 'setting',
          fn: () => { this.newOpenApp(this.builtInFeatures[1].type, this.builtInFeatures[1].value) }
        },
        {
          type: 'systemApp',
          newIcon: 'fluent:full-screen-maximize-16-filled',
          name: '全屏显示',
          event: 'fullscreen',
          fn: () => { this.newOpenApp(this.builtInFeatures[2].type, this.builtInFeatures[2].value) }
        },
        {
          type: 'systemApp',
          newIcon: 'fluent:slide-settings-24-regular',
          name: '设备设置',
          event: 'status',
          fn: () => { this.newOpenApp(this.builtInFeatures[3].type, this.builtInFeatures[3].value) }
        }
      ],
      shakeElement: false,
      currentIndex: null,
      currentItem: null,
      delItemIcon: false,
      notifications: new Notifications(),
      isDelete: true,
      // 当图标变为不可替换时
      isBorder: false,
      targetPosition: { x: 0, y: 0 },
      defaultPosition: { x: 0, y: 0 },
      defaultFolderData,
      folderVisible: false,
      folderList: [],
      folderName: '文件夹',
      customData: {},
      folderItem: {},
      folderId: '',
      // 弹窗显示
      noticeFlag: true,
      left: 0,
      parentSize: 0,
      // 控制中心弹窗
      controlVisible:false,
      skipSort: false,
    }
  },
  props: {
    delZone: {
      type: Boolean,
      default: () => false,
    },
  },
  unmounted() {
    let that = this
    window.removeEventListener('resize', that.checkScroll)
    clearInterval(this.updateMessageTimer)
    if (this.timerRunning) {
      clearInterval(this.timerRunning)
    }
  },
  mounted() {
    // this.$bus.on('M0105',() => { this.editNavigation(this.drawerMenus[0]) })
    // this.$bus.on('Z0401',() => {
    //     console.log('Z0401 :>> ', 332222);
    //       this.showTeamTip = true
    //      })
    this.$bus.on('Z0402',async () => {
      await this.updateMy(0)
      this.teamVisible = true
    })

    this.$bus.on('M0105',() => { this.editNavigation(this.drawerMenus[0]) })
    this.$bus.on('Z0401',() => {   this.showTeamTip = true })
    // this.popVisible=true

    this.enableDrag()
    this.timerRunning = setInterval(() => {
      this.showScreen = !this.showScreen
    }, 5000)
    // this.getMessageIndex().then()
    // //每3分钟刷新一次消息
    // this.updateMessageTimer = setInterval(() => {
    //   this.getMessageIndex().then()
    // }, 180000)
    let that = this
    this.checkScroll()
    window.addEventListener('resize', that.checkScroll)
    let content = this.$refs.content
    content.addEventListener('wheel', (event) => {
      event.preventDefault()
      // console.log('wheel',event)
      content.scrollLeft += event.deltaY
    })
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
    // 图标整体替换格式方法
    this.copyFootNav = this.replaceType(this.copyFootNav)

    this.noticeFlag = true

    this.useWindowSize((size) => {
      // 获取最大可添加图标个数
      const windowWidth = size.width.value
      this.parentSize = windowWidth
      this.maxItemNum = Math.round((windowWidth - 240) / 72)
      // if (this.footNavigationList.length > this.maxItemNum) {
      const width = windowWidth / (240 + this.copyFootNav.length * 72)
      this.navAttribute.navSize = width.toFixed(2) * 100
      this.navAttribute.navSize = this.navAttribute.navSize < 100 ? this.navAttribute.navSize : 100
      // }
      // console.log(this.navAttribute.navSize, 'size')
    }, 200)
  },
  computed: {
    ...mapWritableState(appStore, ['userInfo', 'settings', 'lvInfo', 'simple']),
    ...mapWritableState(appsStore, ['runningApps', 'runningTableApps']),
    ...mapWritableState(teamStore, ['team', 'teamVisible']),
    ...mapWritableState(screenStore, ['screens']),
    ...mapWritableState(cardStore, ['routeParams']),
    ...mapWritableState(navStore, [
      'footNavigationList',
      'builtInFeatures',
      'navigationToggle',
      'sideNavigationList',
      'rightNavigationList',
      'mainNavigationList',
      'navigationToggle', 'maxItemNum',
      'copyFootNav', 'copySideNav', 'copyRightNav'
    ]),
    ...mapWritableState(offlineStore, ['isOffline', 'navList']),
    ...mapWritableState(useWidgetStore, ['rightModel']),
    ...mapWritableState(useNavigationStore, [
      'editToggle', 'taskBoxVisible',
      'selectNav', 'bottomToggle',
      'popVisible', 'currentList',
      'editItem', 'navAttribute', 'iconRadius', 'jumpDesk'
    ]),
    ...mapWritableState(taskStore, ['isTask', 'isTaskDrawer']),
    // ...mapWritableState(cardStore, ['navigationList', 'routeParams']),
    ...mapWritableState(useDeskStore, ['isEnterBar']),

    isMain() {
      return isMain()
    },
    runningScreen() {
      let count = 0
      this.screens.forEach((s) => {
        if (s.running) {
          count++
        }
      })
      return count
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
      // const arr=[...this.mainMenus[3].children]
      this.mainMenus[4].children = [...this.childrenMenu]
      // this.mainMenus[3].children=arr
      return this.mainMenus
    },
    folderOptions() {
      if (this.currentItem && this.currentItem.type === 'folder') {
        const reset = {
          id: 4,
          label: '解散文件夹',
          newIcon: 'fluent:circle-off-16-regular',
          callBack: () => {
            this.resetFolder(this.currentItem, this.currentIndex)
          }
        }
        let arr = [...this.iconMenus, reset]
        return arr.sort((a, b) => a.id - b.id)
      }
      return this.iconMenus
    },
    /**
     * 通过文件夹中数据的多少来自定义大小
     */
    resize() {
      const length = this.folderList.length
      if (length <= 6) {
        return '2x2'
      } else if (length <= 12 && length > 6) {
        return '3x3'
      } else if (length <= 18 && length > 12) {
        return '4x4'
      } else {
        return '6x4'
      }
    },
    /**
     * 防止一次性添加过多导致图标截断
     */
    showList() {
      return this.copyFootNav.slice(0, this.maxItemNum)
    },

  },
  watch: {
    copyFootNav: {
      handler(newVal, oldVal) {
        // let fixedRs=this.fixData(newVal)
        // if(fixedRs.fixed){
        //   this.copyFootNav=fixedRs.fixedArray
        // }
        // console.log(111111111,'form copyFootNav',this.copyFootNav)
        // 获取最大可添加图标个数
        const windowWidth = window.innerWidth
        this.maxItemNum = Math.round((windowWidth - 240) / 72 )
        // console.log(this.maxItemNum, 'this.maxItemNum', windowWidth, 'windowWidth')
        // let flag = true
        if (this.copyFootNav.length > this.maxItemNum && this.maxItemNum !== null) {
          // console.log(this.maxItemNum, 'maxItemNum')
          if (this.noticeFlag) {
            this.$xtConfirm('最多只能添加' + this.maxItemNum + '个', '若继续添加将缩小导航栏', {
              onOk: () => {
                const width = window.innerWidth / (240 + this.copyFootNav.length * 72 )
                this.navAttribute.navSize = width
              }
            })
          }
          const width = window.innerWidth / (240 + this.copyFootNav.length * 72 )
          this.navAttribute.navSize = width.toFixed(2) * 100
          this.noticeFlag = false
        }
        this.syncBottomPanel()
      },
      immediate: true,
      deep: true,
    },
    delZone(val) {
      this.delNav = val
    },
    navigationToggle: {
      immediate: true,
      deep: true,
      handler(val) {
        this.leftNav = val[0]
        this.rightNav = val[1]
      },
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
    simple(newVal, oldVal) {
      if (newVal && !oldVal) {
        // 当 simple 从关闭变为开启时，关闭所有 bottomToggle
        this.bottomToggle[0] = false
        this.bottomToggle[1] = false
        this.bottomToggle[2] = false
      } else if (!newVal && oldVal) {
        // 当 simple 从开启变为关闭时，开启所有 bottomToggle
        this.bottomToggle[0] = true
        this.bottomToggle[1] = true
        this.bottomToggle[2] = true
      }
    },
    bottomToggle: {
      deep: true,
      handler(newV, oldV) {
        if ((this.bottomToggle[0] && this.bottomToggle[1] && this.bottomToggle[2]) || this.bottomToggle[0]) {
          this.simple = false
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
    folderList() {
      this.customData = {
        ...this.defaultFolderData,
        list: this.folderList,
        size: this.currentItem.size || this.resize,
        name: this.folderName,
        layout: this.currentItem.layout || 'rows',
      }
    },
    'customData.list': {
      handler(newV, oldV) {
        // console.log('newV', newV, 'oldV', oldV)
        const list = [...newV]
        this.folderItem.children = list
      },
      deep: true,

    },
    'customData.name': {
      handler(newV, oldV) {
        this.folderName = newV
        this.folderItem.name = newV
        // console.log('newV', newV, 'oldV', oldV)
      },
      deep: true
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
    /**
     * 找出不相同元素
     * @param {*} navList
     * @param {*} copyList
     */
    updateNavList(navList, copyList) {
      const filteredNavList = navList.filter((item) => {
        return !copyList.some((i) => {
          return this.judge(item, i)
        })
      })
      return filteredNavList
    },
    /**
     * 取出当前鼠标指针所对应的数组内的元素的真实id，采用视图查找，所以是精准的
     * @returns {string}
     */
    hoverRealItemId() {
      // if (this.isEnterBar) return
      let parent = document.getElementById('bottomContent')
      if (!parent) {
        return ''
      }
      if (this.hoverIndex < 0) {
        return
      }
      let i = 0
      for (const child of parent.children) {
        if (i === this.hoverIndex) {
          if (child) {
            return child.id
          }
        }
        i++
      }
      return ''
    },
    /**
     * 点击文件夹子图标
     * @param {*} item
     */
    clickFile(item) {
      this.folderVisible = false
      this.msgNotice(item)
    },
    /**
     * 清空当前导航栏
     */
    clearAll() {
      this.copyFootNav = []
    },
    closeFolder() {
      this.folderVisible = false
      // console.log(1111)
    },
    editIcon(item) {
      this.quick = true
      this.componentId = 'EditIcon'
      this.editItem = item
      if (item.default) return
      item.default = {
        name: item.name,
        icon: item.icon
      }
      console.log(item.default, 'item.default')
    },

    /**
     * 打开文件夹
     */
    openFolder(item) {
      // 获取当前的文件夹
      this.folderItem = item
      this.folderList = item.children.map((i) => ({
        ...i,
        id: nanoid(6),
        default: i.default ? i.default : { name: i.name, icon: i.icon }
      }))
      this.folderName = item.name
      this.resetElementPosition()
      if (!this.folderVisible) {
        this.folderVisible = true
      } else if (this.folderVisible && this.currentItem.id && this.folderId === this.currentItem.id) {
        this.folderVisible = false
      } else {
        console.log(this.currentItem.id, this.folderId, 'this.currentItem.id, this.folderId')
        this.customData = {
          ...this.defaultFolderData,
          list: this.folderList,
          size: this.currentItem.size || this.resize,
          name: this.folderName,
          layout: this.currentItem.layout || 'rows',
        }
      }
      this.folderId = item.id
    },
    /**
     * 更新大小尺寸
     * @param {*} value
     */
    updateSize(value) {
      this.currentItem.size = value
      this.resetElementPosition()
    },
    /**
     * 更新图标排序方式
     * @param {*} value
     */
    updateLayout(value) {
      this.currentItem.layout = value
    },
    /**
     * 隐藏导航
     */
    hiedNav(value) {
      this.$emit('hiedNavBar', value)
    },
    showElement(item, index) {
      // console.log(item,index,'====>>>1111');
      // this.clickNavigation(item)
      this.currentItem = item
      this.currentIndex = index
    },
    closeDrawer() {
      this.menuVisible = false
    },
    checkScroll() {},
    goMy() {
      this.$router.push({ name: 'socialMy' })
    },
    ...mapActions(appStore, ['setUser']),
    setFull(value) {
      this.full = value
    },
    closeChangeApp() {
      this.routeParams.url &&
        setTimeout(() => {
          this.$router.push({ name: 'app', params: this.routeParams })
        }, 400)
      this.changeFlag = false
    },
    showMenu() {
      if (this.rightModel === 'follow') {
        return
      }
      this.routeParams.url &&
        ipc.send('hideTableApp', {
          app: JSON.parse(JSON.stringify(this.routeParams)),
        })
      this.menuVisible = true
    },
    hideMenu() {
      this.menuVisible = false
    },
    onClose() {
      this.routeParams.url &&
        this.$router.push({ name: 'app', params: this.routeParams })
      this.menuVisible = false
    },
    /**
     * 打开菜单选项
     * @param {*} item
     */
    editNavigation(item) {
      if (item.component) {
        this.componentId = item.component
        // console.log(this.componentId,'===>>1');
        if (item.component === 'EditNavigationIcon') {
          this.editToggle = true
          this.selectNav = 'foot'
          message.success('进入编辑模式')
        }
        // console.log(this.componentId,'===>>2');
        this.quick = true
      } else if (item.visible) {
        switch (item.tag) {
          case 'task':
            this.bottomToggle[2] = !this.bottomToggle[2]
            break
          case 'community':
            this.bottomToggle[1] = !this.bottomToggle[1]
            break
          case 'user':
            this.bottomToggle[0] = !this.bottomToggle[0]
            break
          case 'chat':
            this.settings.enableChat = !this.settings.enableChat
            break
          case 'hide':
            this.navigationToggle[2] = false
            break
        }
      } else {
        return
      }

      this.menuVisible = false
    },
    /**
     * 关闭弹窗
     */
    setQuick() {
      this.quick = false
      this.editToggle = false
    },
    /**
     * 删除图标判断
     * @param {*} currentIndex 当前删除图标索引
     * @param {*} currentItem 当前删除图标
     */
    delCurrentIcon(currentIndex, currentItem) {
      if (!this.mainNavigationList.find(f => f.name === currentItem.name)) {
        this.removeFootNavigationList(currentIndex)
        return
      }
      let arr = []
      if (this.navigationToggle[0] && this.navigationToggle[1]) {
        arr = this.sideNavigationList.concat(this.rightNavigationList)
      } else if (this.navigationToggle[0] && !this.navigationToggle[1]) {
        arr = this.sideNavigationList
      } else if (!this.navigationToggle[0] && this.navigationToggle[1]) {
        arr = this.rightNavigationList
      } else {
        message.info(`导航栏中至少保留一个「${currentItem.name}」`)
        return
      }
      this.delNavigation(arr, currentItem, currentIndex, this.removeFootNavigationList)
    },
    transFile() {
      //this.visibleTrans=true
      //document.getElementById('transFrame').src='https://szfilehelper.weixin.qq.com/'
      // console.log('发送消息')
      ipc.send('executeAppByPackage', { package: 'com.thisky.fileHelper' })
      this.$router.push({
        name: 'app',
        params: {
          theme: '#2c2c2c',
          name: 'fileHelper',
          url: 'https://szfilehelper.weixin.qq.com/',
          preload: 'fileHelper',
          background: false,
        },
      })
    },
    /**
     * 打开桌面应用提示
     * @param {*} item 当前图标
     */
    msgNotice(item) {
      if (item.type === 'tableApp') {
        message.loading({content:`打开「${item.name}」...`
        ,key:'tipRun'})
      }
    },
    /**
     * 打开应用
     * @param {*} type 图标类型
     * @param {*} value 打开路径
     * @param {*} item 图标详细信息
     */
    async newOpenApp(type, value, item) {
      if(value === 'control'){
        this.controlVisible = !this.controlVisible;
        this.resetElementPosition()
      }
      if (item) this.msgNotice(item)
      if (value === 'home' && item.home) {
        this.jumpDesk = item.home
      }
      let rs= await startApp(type, value, this.$router)
      if(!rs){
        message.error({content:`打开「${item.name}」失败`
          ,key:'tipRun'})
      }
      type !== 'folder' ? this.folderVisible = false : ''

    },
    completeEdit() {
      this.toggleEdit()
      this.setQuick()
    },
    disableDrag() {
      // if (this.sortable) {
      document.removeEventListener('click', this.disableDrag)
      // this.sortable.destroy()
      this.sortable = null
    },
    /**
     * 解散文件夹和切换文件夹
     * @param {*} item
     * @param {*} index
     */
    resetFolder(item, index) {
      if (item.children.length > 0) {
        if (item.children.length + this.copyFootNav.length > this.maxItemNum) {
          this.$xtConfirm('最多只能添加' + this.maxItemNum + '个', '若继续添加将缩小导航栏', {
            onOk: () => {
              return true
            }
          })
        }
        this.copyFootNav.splice(index, 1, ...item.children)

        if (this.folderId == item.id) {
          this.closeFolder()
        }

      }
    },
    updateIcon,
    createFile(item, x) {
      this.skipSort = true
      const bottom = document.querySelector('#bottomPanel')
      const rect = bottom.getBoundingClientRect()
      const index = Math.round((x.x - rect.x) / (72 * this.navAttribute.navSize / 100))
      console.log(index, item, 'index');
      this.dragItem = null
      if (this.copyFootNav[this.hoverIndex]?.type === 'folder') {
        const merged = this.mergeIconFolder(this.copyFootNav, item ,this.copyFootNav.find(i => {
          return i.id === this.hoverRealItemId()
        }))
        this.copyFootNav.splice(this.copyFootNav.findIndex(i => {
          return i.id === this.hoverRealItemId()
        }), 1, merged)
        this.copyFootNav = this.copyFootNav.filter(i => {
          return i.id !== item.id
        })
      }
      else{
       this.copyFootNav.splice(index, 0, _.cloneDeep(item))
      }
      // 从外部拖拽元素到导航栏，跳过合并提示
      this.hoverIndex = -1

    },
    /**
     * sortable拖拽函数
     */
    enableDrag() {
      console.log('触发一次重置 ')
      if (this.sortable) {
        console.log('先清理 ')
        this.sortable.destroy()
      }
      let that = this
      let drop = document.getElementById('bottomContent')
      if (!drop) {
        console.error('更新底部导航栏失败，元素不存在')
        return
      }
      let index = null
      // let isTimer = false
      let isDrag = false
      this.sortable = Sortable.create(drop, {
        sort: true,
        animation: 150,
        delay: 50,
        delayOnTouchOnly: true,
        // 设置交换区域的阈值
        swapThreshold: 0.4,
        // 反向拖拽
        invertSwap: true,
        //
        onStart: function (event) {
          that.cancelUpdate = false
          console.log('onStart')
          that.dragItem = that.copyFootNav[event.oldIndex]
          console.log('启动拖拽的元素', that.dragItem)
          if (that.popVisible) {
            that.notifications.NoticeToast()
          }
          let delIcon = document.getElementById('delIcon2')
          that.delItemIcon = true
          that.$emit('getDelIcon', true)
          that.delNav = true
          if (that.delNav) {
            delIcon.ondragover = function (ev) {
              ev.preventDefault()
            }
          }
          delIcon.ondrop = function (ev) {
            if (!that.isDelete) return
            // console.log(111111);
            that.delItemIcon = false
            let oneNav = that.copyFootNav[event.oldIndex]
            //将要删除的是否是主要功能
            if (!that.mainNavigationList.find((f) => f.name === oneNav.name)) {
              that.removeFootNavigationList(event.oldIndex)
              return
            }
            let sumList = []
            // 判断其他导航栏是否是打开状态，是则获取功能列表
            if (that.leftNav && that.rightNav) {
              sumList = that.sideNavigationList.concat(
                that.rightNavigationList
              )
            } else if (that.leftNav && !that.rightNav) {
              sumList = that.sideNavigationList
            } else if (!that.leftNav && that.rightNav) {
              sumList = that.rightNavigationList
            } else {
              message.info(`导航栏中至少保留一个「${oneNav.name}」`)
              // console.log('不可删除')
              return
            }
            that.delNavigation(
              sumList,
              oneNav,
              event.oldIndex,
              that.removeFootNavigationList
            )
          }
        },
        onUpdate: _.debounce((event) => {
          if (that.cancelUpdate) {
            //如果执行过合并，这里就不需要刷新顺序了。
            return
          }
          console.log('onUpdate')
          //拖拽排序后，更新数据
          console.log('移动event=', event)
          let cur = this.copyFootNav.splice(event.oldIndex, 1)[0]
          if (!cur) {
            console.error('移动失败，无法获取到元素')
            return
          }
          this.copyFootNav.splice(event.newIndex, 0, cur)
          return
        }, 100),
        onEnd: function (event) {
          console.log('onEnd')
          // console.log(event.originalEvent.clientX, event, 'to end X Y ');
          that.$emit('getDelIcon', false)
          //
          that.popVisible = false
          // 删除
          that.isDelete = true
          index = null
          that.isBorder = false
          isDrag = false
          // console.log('isDelete', that.footNavigationList);
          // console.log(that.copyFootNav,'copyFootNav');

        },
        onMove: function (event, originalEvent) {
          // console.log(event, originalEvent, 'move');
          console.log('onMove')
          isDrag = true
          that.isDelete = false
          const moveLeft = event.originalEvent.clientX
          const panelLeft = that.defaultPosition.x
          const relativePos = (moveLeft - panelLeft) % 72
          const isGap = relativePos <= 20 && relativePos >= 0
          console.log('isGap=', isGap, relativePos)
          return true
        },
        onChoose: function (event) {
          console.log('onChoose')
          index = event.oldIndex
          that.defaultPosition = {
            x: event.originalEvent.clientX,
            y: event.originalEvent.clientY,
          }
          // console.log(that.defaultPosition)
        },
        onSort: function (event) {
          console.log('onSort', event)
          console.log('item', that.copyFootNav[event.newIndex])
        },
        // 触发替换中发生的事件
        onChange(event) {
          console.log('onChange', event, that.copyFootNav[event.newIndex])
          console.log('item')
        },
        /**
         * 合并文件夹操作
         * @param event
         * @returns {number}
         */
        onUnchoose: function (event) {
          if (that.hoverRealItemId() && that.hoverRealItemId() !== that.dragItem?.id) {
            //存在目标，且不等于自身，符合合并条件，则执行合并
            const merged = that.mergeIconFolder(that.copyFootNav, that.dragItem, that.copyFootNav.find(item => {
              return item.id === that.hoverRealItemId()
            }))
            that.copyFootNav.splice(that.copyFootNav.findIndex(item => {
              return item.id === that.hoverRealItemId()
            }), 1, merged)
            that.copyFootNav = that.copyFootNav.filter(item => {
              return item.id !== that.dragItem.id
            })
            //执行合并后，因为更改了数组，已经自动触发了重置数组，所以不需要再执行update，数据也是正确的
            that.cancelUpdate = true
          }
          that.hoverIndex = -1
          return
        }
      })
    },
    /**
     * 自动根据当前位置获取到要合并的位置
     * @param currentLeft
     * @returns {{gap: boolean, index: number}|number}
     */
    getHoverIndex(currentLeft) {
      const panelLeft = document.getElementById('bottomContent').getBoundingClientRect().left * (this.navAttribute.navSize / 100)
      const relativePos = (currentLeft - panelLeft) % (72 * this.navAttribute.navSize / 100)
      const isGap = !(relativePos <= (42 * this.navAttribute.navSize / 100) && relativePos >= (10 * this.navAttribute.navSize / 100))
      let nIndex = Math.floor((currentLeft - panelLeft + 20) / (72 * this.navAttribute.navSize / 100))
      if (nIndex > this.copyFootNav.length - 1) {
        //超出
        return 0
      }
      if (isGap) {
        return {
          gap: true,
          index: nIndex
        }
      } else {
        return {
          gap: false,
          index: nIndex
        }
      }
    },
    /**
     * 更新底部导航栏，包括刷新和启动拖拽
     */
    syncBottomPanel() {
      this.bottomKey = Date.now()
      this.$nextTick(() => {
        this.enableDrag()
        this.skipSort = false
      })
    },
    useWindowSize,
    replaceType,
    mergeIconFolder,
    renderIcon,
    delNavigation(sumList, oneNav, index, delMethod) {
      if (!this.mainNavigationList.find((item) => item.name === oneNav.name)) {
        //如果不是必须的
        delMethod(index)
      } else {
        if (sumList.find((item) => item.name === oneNav.name)) {
          //正常移除
          delMethod(index)
        } else {
          //不可移除
          message.info(`导航栏中至少保留一个「${oneNav.name}」`)
        }
      }
    },
    /**
     * 重置元素位置
     */
    resetElementPosition() {
      const draggableSize = this.currentItem.size ? this.currentItem.size.split('x') : this.resize.split('x')
      // 视图大小
      let vW = this.parentSize
      // 元素坐标
      let posX = Number((this.defaultPosition.x).toFixed(0))
      // 元素大小
      let menuW = draggableSize[0] * 144
        // let menuW = draggableSize[0] * 140
      // console.log(vW,posX,menuW, 'vW');
        if(this.currentItem.value === 'control'){
          posX = posX > vW - menuW ? vW - menuW : posX - 274;
        }
        else {
        posX = posX > vW - (menuW / 2) ? vW - menuW : (posX - menuW / 2 < 0 ? 0 : posX - menuW / 2);
      // console.log(posX, 'posX')
        }
      this.left = posX
      console.log(posX, 'posX')
    },
    onDrag: function (e) {
      let hoverRs = this.getHoverIndex(e.x)
      if (hoverRs.gap) {
        this.hoverIndex = -1
      } else {
        this.hoverIndex = hoverRs.index
      }
    }
  },

}
</script>
<style></style>
<style lang="scss" scoped>
.dragging {
  // pointer-events: none !important;
  background-color: red;
}

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
  color: #FF4D4F;
  position: absolute;
  top: 5px;
  right: 5px;
}

.cursor-style {
  cursor: url('/img/test/load-ail.png'), pointer;
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

.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
