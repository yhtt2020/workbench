<template>
  <xtMixMenu :menus="rightMenus" name="name" class="flex max-w-full">
    <!-- <xt-menu :menus="rightMenus" name="name" class="flex max-w-full"  :beforeCreate="beforeCreate"> -->
    <!-- xt-main-bottom-bar 定位类不可删 -->
    <!-- 文件夹弹窗 -->
    <div style="position: absolute;  left: 50%; transform: translateX(-50%);z-index: 500 !important;" :style="{ bottom: `${navAttribute.navSize / 100 * 100}px` }"
      class="rounded-xl pointer ">
      <!-- <div class="w-[200px] h-[100px]" style="display: none;"></div> -->
      <Folder 
        @update:layout="updateLayout"
        @update:size="updateSize"
        :customData="customData" 
        :secondary="true" 
        v-if="folderVisible" 
        :expand="{ disabled: true }" 
        :navBar="{resize:false,sizeOption:false}" 
        :auto="true"/>
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
        /* width: 160px; */
        border: 1px solid var(--divider);
        height: 80px;
        /* padding-left: 16px !important; */
        /* padding-right: 16px !important; */
        display: flex;
        justify-content: center;
      "
        :style="{ width: this.settings.enableChat ? '160px' : '80px', paddingLeft: this.settings.enableChat ? '16px !important' : '0px !important', paddingRight: this.settings.enableChat ? '16px !important' : '0px !important', borderRadius: this.navAttribute.navRadius + 'px' }">
        <div class="flex items-center justify-between" :style="{ marginLeft: this.settings.enableChat ? '10px' : '0px' }">
          <MyAvatar :chat="true" :level="false"></MyAvatar>
          <!-- <div v-show="settings.enableChat && !simple" class="h-[40px] w-[1px] absolute" style="background-color: var(--divider);left: 80px;"></div> -->
          <div v-show="settings.enableChat" class="pl-4 pointer">
            <ChatButton></ChatButton>
          </div>
        </div>

      </div>

      <!-- 快速搜索 底部栏区域 -->
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
            <div @contextmenu="showMenu" style="height: 52px; width: 100%; overflow: hidden">
              <div class=" scroll-content" style=" flex: 1; display: flex;margin-right: 14px;" ref="content">
                <div style="white-space: nowrap; display: flex; align-items: center" id="bottomContent">
                  <div v-if="footNavigationList.length <= 0" style=""></div>
                  <a-tooltip v-for="(item, index) in copyFootNav" :key="item.name" :title="item.name"
                    @mouseenter="showElement(item, index)">
                    <xt-menu :menus="folderOptions">
                      <div v-if="!(this.navList.includes(item.event) && this.isOffline)"
                        class="flex items-center justify-center pointer"
                        :style="{ marginLeft: index === 0 ? '14px' : '20px' }"
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

      <!-- <template v-if="isMain && this.bottomToggle[1] && ((!simple && isMain) || (simple && isMain))">
        <Team  :item="this.copyFootNav[0]" :shakeElement="shakeElement"></Team>
      </template> -->
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
import { moreMenus, extraRightMenu, iconFolder } from '../components/desk/navigationBar/index'
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
    Folder
  },
  data() {
    return {
      sortable: null,

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
          fn: () => { this.$emit('hiedNavBar', 'foot') },
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
      folderItem: {}
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
    this.copyNav()
    // console.log(this.copyFootNav, 'copyFootNav');
    this.enableDrag()
    this.timerRunning = setInterval(() => {
      this.showScreen = !this.showScreen
    }, 5000)
    // let inserted=localStorage.getItem('insertBird')
    // if(!inserted){
    //   this.navigationList.unshift( {
    //     icon: 'http://a.apps.vip/icons/flappy.jpg',
    //     type:'coolApp',
    //     name: 'Mlappy Bird',
    //     summary: '和小伙伴们一起飞。',
    //     needInstall: false,
    //     data: {
    //       theme: '#030c13',
    //       name: 'mlappyBird',
    //       url: 'http://bird.apps.vip/?',
    //       background: false,
    //       type:'game',
    //       scale:160
    //     }
    //   })
    //   localStorage.setItem('insertBird','1')
    // }
    // this.enableDrag()
    this.getMessageIndex().then()
    //每3分钟刷新一次消息
    this.updateMessageTimer = setInterval(() => {
      this.getMessageIndex().then()
    }, 180000)
    let that = this
    this.checkScroll()
    // const that = this
    // window.onresize = function() {
    //   return function(){
    //     window.screenWidth = document.body.clientWidth;
    //     that.screenWidth = window.screenWidth
    //   }()
    // }
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


    // console.log(this.footNavigationList, 'foot');
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
      'navigationToggle',
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
      this.mainMenus[3].children = [...this.childrenMenu]
      // this.mainMenus[3].children=arr
      return this.mainMenus
    },
    folderOptions() {
      if(this.currentItem && this.currentItem.type === 'folder'){
        const reset={
          label:'解散文件夹',
          color: "#FF4D4F",
          newIcon:'fluent:plug-disconnected-16-regular',
          callBack:()=>{
            this.resetFolder(this.currentItem,this.currentIndex)
          }
        }
        return [...this.iconMenus,reset]
      }
      return this.iconMenus
    },
    /**
     * 通过文件夹中数据的多少来自定义大小
     */
    resize(){
      const length = this.folderList.length
      if(length<=6){
        return '2x2'
      }else if(length<=12 && length>6){
        return '3x3'
      }else if(length<=18 && length>12){
        return '4x4'
      }else{
        return '6x4'
      }
    }
  },
  watch: {
    footNavigationList: {
      handler(newVal, oldVal) {
        // if (this.footNavigationList.length > this.copyFootNav.length) {
        //   const target = this.updateNavList(this.footNavigationList, this.copyFootNav);
        //   console.log(target, 'length > copyFootNav')
        //   this.copyFootNav = JSON.parse(JSON.stringify(target)).concat(this.copyFootNav);
        // } else if (this.footNavigationList.length < this.copyFootNav.length) {
        //   const target = this.updateNavList(this.copyFootNav, this.footNavigationList);
        //   console.log(target,this.copyFootNav, 'length < copyFootNav')
        //   target.forEach(element => {
        //     const index = this.copyFootNav.findIndex(item => {
        //       // 找到被删除元素在备份数据中的索引
        //       return this.judge(item,element);
        //     });
        //     console.log(index, 'lost index');
        //     if (index !== -1) {
        //       this.copyFootNav.splice(index, 1);
        //     }
        //   })
        // }
        // else {
        //   const rearrangedCopyFootNav = [];
        //   // 遍历 footNavigationList，根据其顺序获取 copyFootNav 中对应元素的引用
        //   this.footNavigationList.forEach((item) => {
        //     // 在 copyFootNav 中寻找与 footNavigationList 对应的元素
        //     const correspondingElement = this.copyFootNav.find((copyItem) => {
        //       return this.judge(item, copyItem);
        //     });

        //     // 如果找到对应元素，则将其放入新数组中
        //     if (correspondingElement) {
        //       rearrangedCopyFootNav.push(correspondingElement);
        //     }
        //   });
        //   console.log(rearrangedCopyFootNav, 'rearrangedCopyFootNav')
        //   // 更新 copyFootNav 为重新排列后的数组
        //   this.copyFootNav = rearrangedCopyFootNav;

        // }



        this.copyFootNav = JSON.parse(JSON.stringify(this.footNavigationList))
        // console.log(this.copyFootNav, 'copyFootNav')
        // console.log(this.footNavigationList, 'footNav')
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
        if (this.bottomToggle[0] && this.bottomToggle[1] && this.bottomToggle[2]) {
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
    'customData.name':{
      handler(newV, oldV) {
        this.folderName = newV
        this.folderItem.name = newV
        // console.log('newV', newV, 'oldV', oldV)
      },
      deep:true
    }
  },
  methods: {
    ...mapActions(teamStore, ['updateMy']),
    ...mapActions(messageStore, ['getMessageIndex']),
    ...mapActions(appStore, ['toggleFullScreen', 'settings']),
    ...mapActions(navStore, [
      'setFootNavigationList',
      'sortFootNavigationList',
      'removeFootNavigationList',
      'copyNav'
    ]),
    ...mapActions(useNavigationStore, ['toggleEdit', 'toggleTaskBox']),
    updateNavList(navList, copyList) {
      const filteredNavList = navList.filter((item) => {
        return !copyList.some((i) => {
          return this.judge(item, i)
        });
      });
      return filteredNavList;
    },
    judge(ele, item) {
      if (ele.type === 'coolApp') {
        return ele.value.url === item.value.url
      } else if (ele.type === 'folder' && ele.children && item.children && item.children.length > 0 && ele.children.length > 0) {
        console.log(ele, item, 'folder is none')
        return ele.children.every((j) => {
          return item.children.every((k) => {
            return (j.type === 'coolApp' && j.value.url === k.value.url) || (j.value === k.value)
          })
        })
      } else {
        return ele.value === item.value
      }
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
    openFolder(item) {
      this.folderVisible = !this.folderVisible
      // 获取当前的文件夹
      this.folderItem = item
      this.folderList = item.children.map((i) => ({
        ...i,
        id: nanoid(6)
      }));
      this.folderName = item.name
    },
    // 更新大小尺寸
    updateSize(value) {
      this.currentItem.size = value
      console.log(value,this.currentItem,'this.currentItem')
    },
    // 更新大小尺寸
    updateLayout(value) {
      this.currentItem.layout = value
      console.log(value,this.currentItem,'this.currentItem')
    },
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
    appChange() {
      if (this.showScreen) {
        this.tab = 'screen'
        this.routeParams.url &&
          ipc.send('hideTableApp', {
            app: JSON.parse(JSON.stringify(this.routeParams)),
          })
      } else {
        this.tab = 'apps'
        this.routeParams.url &&
          ipc.send('hideTableApp', {
            app: JSON.parse(JSON.stringify(this.routeParams)),
          })
      }
      this.changeFlag = true
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
    setQuick() {
      this.quick = false
      this.editToggle = false
    },
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
    openSetting() {
      this.$router.push({ name: 'setting' })
      this.hideMenu()
    },
    openStatus() {
      this.hideMenu()
      if (this.$route.path === '/status') {
        this.$router.go(-1)
      } else {
        this.$router.push({ path: '/status' })
      }
    },
    showDetailMenu() {
      if (this.rightModel == 'follow') {
        // console.log(111)
        this.menuVisible = true
      }

    },
    power() {
      this.$router.push({ path: '/power' })
    },
    lock() {
      this.$router.push({ path: '/lock' })
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
    async setFullScreen() {
      // await tsbApi.window.isFullScreen()
      if (this.full) {
        this.full = false
        tsbApi.window.setFullScreen(false)
      } else {
        this.full = true
        tsbApi.window.setFullScreen(true)
      }
    },
    newOpenApp(type, value, item) {
      if (value === 'home' && item.home) {
        console.log(item.home, 'item.home');
        this.jumpDesk = item.home
      }
      startApp(type, value, this.$router)
    },
    // 拖拽桌面图标
    async drop(e) {
      // console.log(e,'from drop');
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
    // 添加图标的主要函数
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
    // 解散文件夹
    resetFolder(item,index){
      if(item.children){
        this.footNavigationList.splice(index,1)
        for (let index = 0; index < item.children.length; index++) {
          const element = item.children[index];
          this.footNavigationList.unshift(element)
        }
        // this.footNavigationList.push(...item.children)

      }
    },
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
        swapThreshold: 0.6,
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
        onUpdate: _.debounce(function (event) {
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
          console.log(event, originalEvent, 'move');
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
        },
        // 触发替换中发生的事件
        onChange(event) {
        },
        onUnchoose: function (event) {
          // console.log(that.defaultPosition.x, event.originalEvent.clientX, 'unchoose')
          if (!isDrag) {
            // console.log(that.copyFootNav[Math.round(((that.targetPosition.x - that.defaultPosition.x)/72) + index)], '====onEnd'); that.copyFootNav[nIndex]
            const oIndex = index
            const nIndex = Math.round(((event.originalEvent.clientX - that.defaultPosition.x) / 72) + index)
            console.log(oIndex, nIndex, '==oIndex-nIndex');
            if (oIndex === nIndex) {
              return 0
            }

            that.footNavigationList[nIndex] = that.iconFolder(that.footNavigationList, oIndex, nIndex)
            that.copyFootNav[nIndex] = that.iconFolder(that.copyFootNav, oIndex, nIndex)
            // console.log(that.footNavigationList);
            // that.footNavigationList.splice(oIndex, 1)
            // const items = that.diffItem(that.footNavigationList, that.copyFootNav)
            // console.log(items, 'items');
            that.removeFootNavigationList(oIndex)
          }
        }
      })
    },
    replaceType,
    iconFolder,
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
