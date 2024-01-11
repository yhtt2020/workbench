<template>
  <xtMixMenu :menus="rightMenus" name="name" class="flex max-w-full">
    <!-- <xt-menu :menus="rightMenus" name="name" class="flex max-w-full"  :beforeCreate="beforeCreate"> -->
    <!-- xt-main-bottom-bar 定位类不可删 -->
    <!-- 文件夹弹窗 -->
    <div style="position: absolute; z-index: 500 !important;"
      :style="{ left: `${this.left}px`, bottom: `${navAttribute.navSize / 100 * 100}px` }" class="rounded-xl pointer "
      id="folder">
      <Folder
        @clickFile="clickFile"
        @update:layout="updateLayout"
        @update:size="updateSize"
        :customData="customData"
        :secondary="true"
        v-if="folderVisible"
        :expand="{ disabled: true }"
        :navBar="{ resize: false, sizeOption: false,isDel:true,hierarchy:true }"
        :auto="true" />
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
            <ChatButton></ChatButton>
          </div>
        </div>

      </div>
      <div v-if="false" style="position: fixed;top: 10px;background: black;color:white;z-index:99999;line-height: 14px;text-align: left;">
        <div>导航栏调试数据：</div>
        <div v-for="( item,index) in copyFootNav" style="margin-bottom: 5px;border-bottom: 4px solid white">
          {{index}} {{JSON.stringify(item)}}
        </div>
      </div>
      <!-- 快速搜索 底部栏区域 -->
      <!-- <Drop @createFile="createFile"> -->
      <div id="bottomPanel" @drop.prevent="drop" @dragover.prevent="" class="flex flex-row items-center s-bg" style="
        display: flex;
        flex-direction: column;
        justify-content: center;
        justify-items: center;
        align-content: center;
        align-items: center;
        /* border-radius: 18px; */
        height: 80px;
        max-width: 90%;
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
              <div class=" scroll-content" style=" flex: 1; display: flex; margin-left: 20px;margin-right: 20px" ref="content">
                <div :key="bottomKey" style="white-space: nowrap; display: flex; align-items: center;gap:20px" id="bottomContent">
                  <div v-if="footNavigationList.length <= 0" style=""
                    class="flex items-center justify-center w-full h-full mt-6 ml-6"
                    @click="this.editNavigation(this.drawerMenus[0])">
                    <xt-new-icon icon="fluent:add-16-regular" size="32" class="xt-text"></xt-new-icon>
                  </div>
                  <a-tooltip v-for="(item, index) in copyFootNav" :key="item.id" :title="item.name+item.id"
                    :overlayStyle="{ zoom: `${(this.navAttribute.navSize / 100)}` }"
                    @mouseenter="showElement(item, index)">
                    <xt-menu class="item-content" :menus="folderOptions">
                      <div v-if="!(this.navList.includes(item.event) && this.isOffline)"
                        class="flex items-center justify-center pointer"
                        style="white-space: nowrap; display: inline-block;border-radius: 18px;"
                        @click.stop="newOpenApp(item.type, item.value, item)">
                        <Team v-if="item.value === 'commun'" :item="item" :shakeElement="shakeElement" :placement="'top'">
                        </Team>
                        <FolderVue v-else-if="item.type === 'folder'" :iconList="item.children" @click="openFolder(item)">
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
      <!-- </Drop> -->
      <keep-alive>
        <TaskBox v-if="true"></TaskBox>
      </keep-alive>
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
import { offlineStore } from "../js/common/offline";
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
import { nanoid } from "nanoid";
import Drop from '../apps/folder/src/components/Drop.vue'
import { useWindowSize } from '../ui/new/drag/src/hooks/useWindowSize'
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
    Drop
  },
  data() {
    return {
      sortable: null,
      bottomKey:Date.now(),

      debug:false,
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
          label: "打开",
          callBack: () => { this.newOpenApp(this.currentItem.type, this.currentItem.value) },
        },
        {
          id: 2,
          label: '编辑',
          newIcon: "fluent:compose-16-regular",
          callBack: () => { this.editIcon(this.currentItem) },
        },
        {
          id: 3,
          label: '删除',
          newIcon: 'fluent:delete-16-regular',
          color: "#FF4D4F",
          callBack: () => { this.delCurrentIcon(this.currentIndex, this.currentItem) }
        },
        {
          id: 5,
          divider: true
        },
        {
          id: 6,
          label: '添加导航图标',
          newIcon: "fluent:add-16-regular",
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
          fn: () => { this.$emit('hiedNavBar', 'foot') },
        },
        {
          id: 8,
          name: "清空当前导航栏",
          newIcon: "fluent:circle-off-16-regular",
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
          type: "systemApp",
          newIcon: "fluent:lock-closed-16-regular",
          name: "锁定屏幕",
          event: "lock",
          fn: () => { this.newOpenApp(this.builtInFeatures[0].type, this.builtInFeatures[0].value) }
        },
        {
          type: "systemApp",
          newIcon: "fluent:settings-16-regular",
          name: "基础设置",
          event: "setting",
          fn: () => { this.newOpenApp(this.builtInFeatures[1].type, this.builtInFeatures[1].value) }
        },
        {
          type: "systemApp",
          newIcon: "fluent:full-screen-maximize-16-filled",
          name: "全屏显示",
          event: "fullscreen",
          fn: () => { this.newOpenApp(this.builtInFeatures[2].type, this.builtInFeatures[2].value) }
        },
        {
          type: "systemApp",
          newIcon: "fluent:slide-settings-24-regular",
          name: "设备设置",
          event: "status",
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
    // this.popVisible=true
    this.loadNav()
    this.enableDrag()
    this.timerRunning = setInterval(() => {
      this.showScreen = !this.showScreen
    }, 5000)
    this.getMessageIndex().then()
    //每3分钟刷新一次消息
    this.updateMessageTimer = setInterval(() => {
      this.getMessageIndex().then()
    }, 180000)
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
      this.footNavigationList.forEach((i) => {
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
    this.footNavigationList = this.replaceType(this.footNavigationList)

    this.noticeFlag = true

    this.useWindowSize((size) => {
      // 获取最大可添加图标个数
      const windowWidth = size.width.value
      this.parentSize = windowWidth
      this.maxItemNum = Math.round((windowWidth - 240) / 72)
      // if (this.footNavigationList.length > this.maxItemNum) {
      const width = windowWidth / (240 + this.footNavigationList.length * 72)
      this.navAttribute.navSize = width.toFixed(2) * 100
      this.navAttribute.navSize < 100 ? this.navAttribute.navSize : this.navAttribute.navSize = 100
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
    ...mapWritableState(offlineStore, ["isOffline", 'navList']),
    ...mapWritableState(useWidgetStore, ['rightModel']),
    ...mapWritableState(useNavigationStore, [
      'editToggle', 'taskBoxVisible',
      'selectNav', 'bottomToggle',
      'popVisible', 'currentList',
      'editItem', 'navAttribute', 'iconRadius', 'jumpDesk'
    ]),
    ...mapWritableState(taskStore, ['isTask', 'isTaskDrawer']),
    // ...mapWritableState(cardStore, ['navigationList', 'routeParams']),

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
          fn: () => { this.bottomToggle[2] = !this.bottomToggle[2], this.isTask = !this.isTask }
        },
        {
          id: 4,
          name: this.settings.enableChat ? '隐藏社群沟通' : '显示社群沟通',
          newIcon: "fluent:chat-16-regular",
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
    }
  },
  watch: {
    copyFootNav: {
      handler(newVal, oldVal) {
        console.log('检测到底部导航栏变化,newval=',_.cloneDeep(newVal),'oldval=',_.cloneDeep(oldVal),'footNav=',_.cloneDeep(this.footNavigationList),'copy=',_.cloneDeep(this.copyFootNav))
        // if (this.footNavigationList.length > this.copyFootNav.length) {
        //   const target = this.updateNavList(this.footNavigationList, this.copyFootNav);
        //   // console.log(target, 'length > copyFootNav')
        //   // this.copyFootNav = JSON.parse(JSON.stringify(target)).concat(this.copyFootNav);
        //   for (let i = 0; i < target.length; i++) {
        //     const index = this.footNavigationList.findIndex(item => {
        //       return this.judge(item, target[i]);
        //     })
        //     this.copyFootNav.splice(index, 0, JSON.parse(JSON.stringify(target[i])));
        //   }
        //
        // } else if (this.footNavigationList.length < this.copyFootNav.length) {
        //   const target = this.updateNavList(this.copyFootNav, this.footNavigationList);
        //   //console.log(target, 'length < copyFootNav')
        //   const list = target.map(element => {
        //     return this.copyFootNav.findIndex(item => {
        //       // 找到被删除元素在备份数据中的索引
        //       return this.judge(item, element);
        //     });
        //   })
        //   //console.log(list, this.copyFootNav, 'list')
        //   this.copyFootNav = this.copyFootNav.filter((item, index) => { return list.indexOf(index) === -1 })
        // }
        // else {
        //   const rearrangedCopyFootNav = [];
        //   // 遍历 footNavigationList，根据其顺序获取 copyFootNav 中对应元素的引用
        //   // this.footNavigationList.forEach((item) => {
        //   //   // 在 copyFootNav 中寻找与 footNavigationList 对应的元素
        //   //   const correspondingElement = this.copyFootNav.find((copyItem) => {
        //   //     return this.judge(item, copyItem);
        //   //   });
        //
        //   //   // 如果找到对应元素，则将其放入新数组中
        //   //   if (correspondingElement) {
        //   //     rearrangedCopyFootNav.push(correspondingElement);
        //   //   }
        //   // });
        //   for (let i = 0; i < this.footNavigationList.length; i++) {
        //     const item = this.copyFootNav.find((copyItem) => {
        //       return this.judge(this.footNavigationList[i], copyItem);
        //     })
        //     if (item) {
        //       rearrangedCopyFootNav.push(item)
        //     }
        //   }
        //   // 更新 copyFootNav 为重新排列后的数组
        //   // this.copyFootNav.splice(0, this.copyFootNav.length, ...rearrangedCopyFootNav);
        //   this.copyFootNav = [...rearrangedCopyFootNav]
        //   // this.copyFootNav = JSON.parse(JSON.stringify(rearrangedCopyFootNav))
        //   //console.log(this.copyFootNav,'this---exchange')
        // }
        // this.updateIcon(this.footNavigationList, this.copyFootNav)

        console.log('合并修改完成后的新数组',_.cloneDeep(this.copyFootNav))

        // 防止数据同步失败，导致导航栏数据无法同步，导致数据错位
        // this.$nextTick(() => {
        //   const target = this.updateNavList(this.copyFootNav, this.footNavigationList);
        //   if (target.length > 0) {
        //     message.error('导航栏数据自动调整失败，将手动调整导航栏')
        //     this.copyFootNav = JSON.parse(JSON.stringify(this.footNavigationList))
        //   }
        // })
        // 获取最大可添加图标个数
        const windowWidth = window.innerWidth
        this.maxItemNum = Math.round((windowWidth - 240) / 72)
        // console.log(this.maxItemNum, 'this.maxItemNum', windowWidth, 'windowWidth')
        // let flag = true
        if (this.copyFootNav.length > this.maxItemNum && this.maxItemNum !== null) {
          // console.log(this.maxItemNum, 'maxItemNum')
          if (this.noticeFlag) {
            this.$xtConfirm('最多只能添加' + this.maxItemNum + '个', '若继续添加将缩小导航栏', {
              onOk: () => {
                const width = window.innerWidth / (240 + this.copyFootNav.length * 72)
                this.navAttribute.navSize = width
              }
            })
          }
          const width = window.innerWidth / (240 + this.copyFootNav.length * 72)
          this.navAttribute.navSize = width.toFixed(2) * 100
          this.noticeFlag = false
        }
        //console.log(this.copyFootNav, 'copyFootNav')
        //console.log(this.footNavigationList, 'footNav')
        // if (this.copyFootNav.length === 0 && this.copyFootNav.length > 0) {
        //   this.copyFootNav = JSON.parse(JSON.stringify(this.copyFootNav))
        // }
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
        this.bottomToggle[0] = false;
        this.bottomToggle[1] = false;
        this.bottomToggle[2] = false;
      } else if (!newVal && oldVal) {
        // 当 simple 从开启变为关闭时，开启所有 bottomToggle
        this.bottomToggle[0] = true;
        this.bottomToggle[1] = true;
        this.bottomToggle[2] = true;
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
    ...mapActions(teamStore, ['updateMy']),
    ...mapActions(messageStore, ['getMessageIndex']),
    ...mapActions(appStore, ['toggleFullScreen', 'settings']),
    ...mapActions(navStore, [
      'setFootNavigationList',
      'sortFootNavigationList',
      'removeFootNavigationList',
      'loadNav'
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
        });
      });
      return filteredNavList;
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
      for (let i = this.footNavigationList.length - 1; i >= 0; --i) {
        this.removeFootNavigationList(i, 1);
        // console.log(this.footNavigationList, 'footNavigationList');
      }
    },
    /**
     * 判断元素是否相同
     * @param {*} ele
     * @param {*} item
     */
    judge(ele, item) {
      //增加地址相等判断
      if(ele===item){
        return true
      }
      if (ele.type === 'coolApp') {
        return ele.value.url === item.value.url
      } else if (ele.id && item.id) {
        return ele.id === item.id
      } else {
        return ele.value === item.value
      }
    },
    closeFolder() {
      this.folderVisible = false;
      // console.log(1111)
    },
    editIcon(item) {
      this.quick = true
      this.componentId = 'EditIcon'
      this.editItem = item
    },
    async toggleTeam() {
      await this.updateMy(0)
      if (this.team.status === false) {
        this.teamKey = Date.now()
        this.showTeamTip = true
      } else {
        this.teamVisible = !this.teamVisible
      }
    },
    /**
     * 打开文件夹
     */
    openFolder(item) {
      // 获取当前的文件夹
      this.folderItem = item
      this.folderList = item.children.map((i) => ({
        ...i,
        id: nanoid(6)
      }));
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
    checkScroll() {
      // this.$nextTick(() => {
      //   if (this.$refs.content.offsetHeight - this.$refs.content.clientHeight > 0) {
      //     this.$refs.content.style.marginTop = '17px'
      //   } else {
      //     this.$refs.content.style.marginTop = '0px'
      //   }
      // })
    },
    goMy() {
      this.$router.push({ name: 'socialMy' })
    },
    ...mapActions(appStore, ['setUser']),
    setFull(value) {
      this.full = value
    },
    // appChange() {
    //   if (this.showScreen) {
    //     this.tab = 'screen'
    //     this.routeParams.url &&
    //       ipc.send('hideTableApp', {
    //         app: JSON.parse(JSON.stringify(this.routeParams)),
    //       })
    //   } else {
    //     this.tab = 'apps'
    //     this.routeParams.url &&
    //       ipc.send('hideTableApp', {
    //         app: JSON.parse(JSON.stringify(this.routeParams)),
    //       })
    //   }
    //   this.changeFlag = true
    // },
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
            this.navigationToggle[2] = false
            break;
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
    // closeEdit(){
    //   this.editBar=false
    // },
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
        message.loading(`打开「${item.name}」...`)
      }
    },
    /**
     * 打开应用
     * @param {*} type 图标类型
     * @param {*} value 打开路径
     * @param {*} item 图标详细信息
     */
    newOpenApp(type, value, item) {
      this.msgNotice(item)
      if (value === 'home' && item.home) {
        this.jumpDesk = item.home
      }
      startApp(type, value, this.$router)
      type !== 'folder' ? this.folderVisible = false : ''
    },
    /**
     * 拖拽桌面图标
     * @param {*} e
     */
    async drop(e) {
      // console.log(e,'from drop');
      // this.modelValue=false
      // const width = window.innerWidth
      let files = e.dataTransfer.files
      // if (e.x <= 300) {
      //   this.selectNav = 'left'
      // } else if (e.x > 300 && e.x < width - 300) {
      //   this.selectNav = 'foot'
      // } else if (e.x >= width - 300) {
      //   this.selectNav = 'right'
      // }
      let filesArr = []
      if (files && files.length > 0) {
        for (let i = 0; i < files.length; i++) {
          filesArr.push(files[i].path)
        }
      }
      this.dropList = await Promise.all(filesArr.map(async (item) => {
        const fileName = item.substring(item.lastIndexOf("\\") + 1);
        let dropFiles = await tsbApi.system.extractFileIcon(item)
        return {
          icon: `${dropFiles}`,
          name: `${fileName}`,
          value: item,
          type: 'tableApp',
          bg: '',
          isBg: false,
          mode: "app"
        }
      }))
      this.clickRightListItem(this.dropList)
      // this.dropList.forEach((item)=>{
      //   this.setFootNavigationList(item)
      // })

      // 添加完后清空
      this.dropList = []
      // this.modelValue=true
    },
    /**
     * 添加图标
     * @param {*} item
     * @param {*} index
     */
    clickRightListItem(item, index) {
      this.activeRightItem = index
      //   this.editFlag = false
      if (this.selectNav === 'foot') {
        if (item instanceof Array) {
          for (let i = 0; i < item.length; i++) {
            if (!this.footNavigationList.find(j => j.name === item[i].name)) {
              this.updateMainNav(item[i], 'add')
              item[i].addNav = true
              this.setFootNavigationList(item[i])
            } else {
              message.info('已添加', 1)
            }
          }
          this.dropList = []
        } else {
          for (let i = 0; i < this.footNavigationList.length; i++) {
            if (this.footNavigationList[i].name === item.name) return message.info('已添加', 1)
          }
          this.updateMainNav(item, 'add')
          item.addNav = true
          this.setFootNavigationList(item)
          this.$nextTick(() => {
            let scrollElem = this.$refs.content
            scrollElem.scrollTo({ left: scrollElem.scrollWidth, behavior: 'smooth' })
          })
        }
      }
    },
    /**
     * 更新图标选择状态
     * @param {*} addItem
     * @param {*} type
     */
    updateMainNav(addItem, type) {
      this.mainNavList = this.currentList.length ? this.currentList : this.footNavigationList
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
    completeEdit() {
      this.toggleEdit()
      this.setQuick()
    },
    disableDrag() {
      // if (this.sortable) {
      document.removeEventListener('click', this.disableDrag)
      // this.sortable.destroy()
      this.sortable = null
      // message.info('已中止导航栏调整')
      // }
    },
    /**
     * 解散文件夹和切换文件夹
     * @param {*} item
     * @param {*} index
     */
    resetFolder(item, index) {
      if (item.children.length>0) {
        if (item.children.length + this.copyFootNav.length > this.maxItemNum) {
          this.$xtConfirm('最多只能添加' + this.maxItemNum + '个', '若继续添加将缩小导航栏', {
            onOk: () => {
              return true
            }
          })
        }
        this.copyFootNav.splice(index, 1,...item.children)
        // console.log(this.footNavigationList, 'foot',this.copyFootNav,'copy')
        // this.$nextTick(() => {
        //   // for (let i = 0; i < item.children.length; i++) {
        //   //   const element = item.children[i];
        //   //   this.copyFootNav.splice(index + i, 0, element)
        //   // }
        //
        //   // this.copyFootNav = this.updateIcon(this.footNavigationList, this.copyFootNav)
        //   // console.log(this.footNavigationList, 'foot', this.copyFootNav, 'copy')
        // })

        if (this.folderId == item.id) {
          this.closeFolder()
        }


      }
    },
    updateIcon,
    createFile(item) {
      console.log(item, 'from drop')
    },
    /**
     * sortable拖拽函数
     */
    enableDrag() {
      let that = this
      let drop = document.getElementById('bottomContent')
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
            let oneNav = that.footNavigationList[event.oldIndex]
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
        onUpdate: _.debounce( (event)=> {
          //拖拽排序后，更新数据
          console.log('移动event=',event)
          let cur=this.copyFootNav.splice(event.oldIndex, 1)[0]
          this.copyFootNav.splice(event.newIndex,0,cur)
          const newArray = this.copyFootNav.slice(0);
          this.copyFootNav = [];
          this.bottomKey=Date.now()
          this.$nextTick(() => {
            this.copyFootNav = newArray;
            this.enableDrag()
          });

          return
          that.isDelete = false
          let newIndex = event.newIndex,
            oldIndex = event.oldIndex
          let newItem = drop.children[newIndex]
          let oldItem = drop.children[oldIndex]
          // console.log('newIndex', event)
          // 先删除移动的节点
          drop.removeChild(newItem)
          // 再插入移动的节点到原有节点，还原了移动的操作
          if (newIndex > oldIndex) {
            drop.insertBefore(newItem, oldItem)
          } else {
            drop.insertBefore(newItem, oldItem.nextSibling)
          }
          that.sortFootNavigationList(event)
          that.footNavigationList = that.footNavigationList.filter((item) => item !== undefined)
          that.updateMainNav();
          // console.log('isDelete', that.footNavigationList);
        }, 100),
        onEnd: function (event) {
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
          isDrag = true
          that.isDelete = false
          return true
        },
        onChoose: function (event) {
          index = event.oldIndex
          that.defaultPosition = {
            x: event.originalEvent.clientX,
            y: event.originalEvent.clientY,
          }
          // console.log(that.defaultPosition)
        },
        // 触发替换中发生的事件
        onChange(event) {
        },
        /**
         * 合并文件夹操作
         * @param event
         * @returns {number}
         */
        onUnchoose: function (event) {
          // console.log(that.defaultPosition.x, event.originalEvent.clientX, 'unchoose')
          if (!isDrag) {
            // console.log(that.copyFootNav[Math.round(((that.targetPosition.x - that.defaultPosition.x)/72) + index)], '====onEnd'); that.copyFootNav[nIndex]
            const oIndex = index
            const nIndex = Math.round(((event.originalEvent.clientX - that.defaultPosition.x) / 72) + index)
            // console.log(oIndex, nIndex, '==oIndex-nIndex');
            if (oIndex === nIndex) {
              return 0
            }

            // that.footNavigationList[nIndex] = that.mergeIconFolder(that.footNavigationList, oIndex, nIndex)
            // that.copyFootNav[nIndex] = that.mergeIconFolder(that.copyFootNav, oIndex, nIndex)
            const merged = that.mergeIconFolder(that.copyFootNav, oIndex, nIndex)
            that.copyFootNav.splice(nIndex, 1, merged)
            that.copyFootNav.splice(oIndex,1)
            this.bottomKey=Date.now()
            // that.footNavigationList.splice(nIndex, 1, target)
            // const item = that.mergeIconFolder(that.copyFootNav, oIndex, nIndex)
            // that.copyFootNav.splice(nIndex, 1, item)
            // const id = that.footNavigationList[nIndex].id
            //that.copyFootNav[nIndex].id = id
           // console.log(target, 'target',  that.copyFootNav, 'that.copyFootNav')
            //that.removeFootNavigationList(oIndex)
          }
        }
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
      const draggableSize = this.currentItem.size ? this.currentItem.size.split('x') : this.resize.split('x');
      // 视图大小
      let vW = this.parentSize
      // 元素坐标
      let posX = Number((this.defaultPosition.x).toFixed(0));
      // 元素大小
      let menuW = draggableSize[0] * 144
      // console.log(vW,posX,menuW, 'vW');
      posX = posX > vW - menuW ? vW - menuW : posX;
      // console.log(posX, 'posX')
      this.left = posX;
    }
  },
  provide() {
    return {
      data: {
        ...this.defaultFolderData,
        model: 'custom',
      }
    };
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


//
//@media screen and (max-height: 510px) {
//  .bottom-panel {
//    zoom:0.9;
//
//  }
//  .chat{
//    display: none;
//  }
//  .user-info{
//    width: 100%;
//  }
//  .user{
//    width: 12.5em;
//  }
//}
//@media screen and (min-height: 511px) and (max-height: 550px) {
//  .bottom-panel{
//    zoom:0.9;
//
//  }
//  .chat{
//    display: none;
//  }
//  .user-info{
//    width: 100%;
//  }
//  .user{
//    width: 12.5em;
//  }
//}
//@media screen and (min-height: 551px) and (max-height: 610px) {
//  .bottom-panel {
//    zoom: 0.9;
//  }
//  .chat{
//    display: none;
//  }
//  .user-info{
//    width: 100%;
//  }
//  .user{
//    width: 12.5em;
//  }
//}

.scroll-content {
  :last-child {
    margin-right: 0;
  }
}
</style>
