<template>
  <xtMixMenu :menus="rightMenus" name="name">
    <div @click.stop class="flex flex-row items-center justify-center w-full mb-3 bottom-panel " id="bottom-bar"
      style="text-align: center" @contextmenu="showMenu" v-show="navigationToggle[2]">
      <!-- 快速搜索 底部 用户栏 -->
      <div v-if="(!simple || settings.enableChat) && !this.isOffline && this.bottomToggle[0]"
        class="relative flex flex-row items-center justify-between common-panel user s-bg" style="
        /* vertical-align: top; */
        margin-top: 0;
        background: var(--primary-bg);
        color: var(--primary-text);
        /* border-radius: 18px; */
        /* width: 160px; */
        border: 1px solid var(--divider);
      " :style="{height:80*(this.navSize/100)+'px',borderRadius:this.navRadius+'px'}">
        <MyAvatar :chat="true" :level="false"></MyAvatar>
        <!-- <div v-show="settings.enableChat && !simple" class="h-[40px] w-[1px] absolute" style="background-color: var(--divider);left: 80px;"></div> -->
        <div v-show="settings.enableChat" class="ml-3 pointer">
          <ChatButton></ChatButton>
        </div>
      </div>


      <!-- 快速搜索 底部栏区域 -->
      <div @drop.prevent="drop" @dragover.prevent="" class="flex flex-row items-center s-bg" style="
        display: flex;
        flex-direction: column;
        justify-content: center;
        justify-items: center;
        align-content: center;
        align-items: center;
        /* border-radius: 18px; */
        /* height: 80px; */
        max-width: 80%;
        overflow: hidden;
        margin-right: 10px;
        background: var(--primary-bg);
        color: var(--primary-text);
        z-index: 99;
        min-width: 70px;
        border: 1px solid var(--divider);
      " :style="{height:80*(this.navSize/100)+'px',borderRadius:this.navRadius+'px'}">
        <xt-task id='M0104' no='1' :mask="false" @cb="showMenu">
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
              <div class=" scroll-content"
                style="overflow-y: hidden;overflow-x: auto; flex: 1; display: flex;margin-right: 14px;" ref="content">
                <!-- <xt-task :modelValue="getStep" @cb="showMenu" :mask="false"> -->

                <div style="white-space: nowrap; display: flex; align-items: center" id="bottomContent">
                  <div v-if="footNavigationList.length <= 0" style=""></div>
                  <a-tooltip v-for="(item, index) in footNavigationList" :key="item.name" :title="item.name"
                    @mouseenter="showElement(item, index)">
                    <xt-menu :menus="iconMenus">
                      <div v-if="!(this.navList.includes(item.event) && this.isOffline)" class=" pointer"
                        :style="{ marginLeft: index === 0 ? '14px' : '20px' }"
                        style="white-space: nowrap; display: inline-block;border-radius: 18px;"
                        @click.stop="clickNavigation(item)">
                        <div style="width: 52px; height: 52px;" v-if="item.type === 'systemApp'" :style="{borderRadius:iconRadius+'px'}"
                          class="relative flex items-center justify-center ">
                          <a-avatar :size="52" shape="square" :src="item.icon" :style="{borderRadius:iconRadius+'px'}"
                            :class="{ 'shaking-element': shakeElement }"></a-avatar>
                        </div>
                        <div v-else style="width: 52px; height: 52px;"
                          class="relative flex items-center justify-center rounded-xl" :style="{background:item.bgColor || ''}">
                          <!-- {{ item.bgColor ? '' : item.name }} -->
                          <a-avatar :size="52" shape="square" :src="renderIcon(item.icon)" :style="{borderRadius:iconRadius+'px'}"
                            :class="{ 'shaking-element': shakeElement }"></a-avatar>
                        </div>
                      </div>
                    </xt-menu>
                  </a-tooltip>
                </div>

              </div>
            </div>
            <!-- <div class="mr-3"> -->
            <!-- <AddIcon v-if="this.editToggle" :position="'foot'" @addIcon="editNavigation(this.drawerMenus[0])"
            @completeEdit="completeEdit" /> -->
            <!-- </div> -->

            <!-- <a-tooltip :title="showScreen ? '运行中的分屏' : '运行中的应用'">
          <div
            @click="appChange"
            v-if="isMain"
            style="
              flex-shrink: 0;
              border-left: 1px solid var(--divider);
              width: 72px;
              height: 58px;
            "
            class="flex items-center justify-center h-2/3 pointer"
          >
            <template v-if="!showScreen">
              <navIcon
                icon="fluent:window-multiple-16-filled"
                style="
                  width: 40px;
                  height: 40px;
                  margin-left: 5px;
                  margin-top: 1px;
                "
              ></navIcon>
              <span
                style="
                  position: absolute;
                  width: 48px;
                  height: 48px;
                  text-align: center;
                  line-height: 48px;
                  font-weight: bold;
                  font-size: 18px;
                "
              >{{ runningApps.length + runningTableApps.length }}</span
              >
            </template>
            <template v-else>
              <navIcon
                icon="majesticons:monitor-line"
                style="width: 40px; height: 40px; margin-left: 2px;margin-top: 1px;"
              ></navIcon>
              <span
                style="
                  position: absolute;
                  width: 48px;
                  height: 48px;
                  text-align: center;
                  line-height: 48px;
                  font-weight: bold;
                  font-size: 18px;
                  margin-bottom: 6px;
                "
              >{{ runningScreen }}</span
              >
            </template>
          </div>
        </a-tooltip> -->
          </div>
        </xt-task>

      </div>

      <template v-if="isMain && this.bottomToggle[1] && ((!simple && isMain) || (simple && isMain))">
        <Team></Team>
      </template>
      <TaskBox v-if="this.bottomToggle[2] && (simple || !simple)"></TaskBox>
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
  </xtMixMenu>
  <!-- <a-drawer :contentWrapperStyle="{ backgroundColor: '#212121', height: '216px' }" class="drawer" :closable="true"
    placement="bottom" :visible="menuVisible" @close="onClose">
    <a-row>
      <a-col>
        <div class="flex flex-wrap items-center">
          <div @click="editNavigation(item)" class="relative btn" v-for="item in drawerMenus">
            <template v-if="item.icon == 'fluent:compose-16-regular'">
              <xt-task id='M0104' no="2" @cb="editNavigation(item)">
                <navIcon :icon="item.icon" style="font-size: 3em"></navIcon>
                <div><span>{{ item.title }}</span></div>
              </xt-task>
            </template>
            <template v-else>
              <navIcon :icon="item.icon" style="font-size: 3em"></navIcon>
              <div><span>{{ item.title }}</span></div>
            </template>

          </div>
          <div @click="clickNavigation(item)" class=" btn extra-btn" v-for="item in builtInFeatures" :key="item.name">
            <navIcon style="font-size: 3em;" :icon="item.icon"></navIcon>
            <div>
              <span>{{ item.name }}</span>
            </div>
          </div>
        </div>

      </a-col>
    </a-row>
  </a-drawer> -->



  <!-- <a-drawer :contentWrapperStyle="{ backgroundColor: '#1F1F1F', height: '11em' }" :width="120" :height="120"
    class="drawer" :closable="false" placement="bottom" :visible="menuVisible" @close="onClose">
    <a-row style="margin-top: 1em" :gutter="[20, 20]">
      <a-col>
        <div @click="editNavigation" class="relative btn">
          <Icon style="font-size: 3em" icon="tianjia1"></Icon>
          <div><span>编辑</span></div>
         <GradeSmallTip powerType="bottomNavigation" @closeDrawer="closeDrawer"></GradeSmallTip>
        </div>
      </a-col>
    </a-row>
  </a-drawer> -->

  <transition name="fade">
    <div :style="{ zIndex: componentId === 'navigationSetting' ? 100 : 90 }" v-if="quick">
      <!-- 老版 -->
      <!-- <EditNavigation @setQuick="setQuick" v-if="componentId === 'EditNavigation'"></EditNavigation> -->
      <!-- 新版 -->
      <EditNewNavigation @setQuick="setQuick" ref="editNewNavigation" v-if="componentId === 'EditNavigationIcon'">
      </EditNewNavigation>
      <navigationSetting @setQuick="setQuick" v-if="componentId === 'navigationSetting'"></navigationSetting>
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
import { appStore } from '../store'
import { cardStore } from '../store/card'
import { navStore } from '../store/nav'
import { useNavigationStore } from './desk/navigationBar/navigationStore'
import { mapWritableState, mapActions } from 'pinia'
import { useWidgetStore } from '../components/card/store'
import Template from '../../user/pages/Template.vue'
import { ThunderboltFilled } from '@ant-design/icons-vue'
import { Modal } from 'ant-design-vue'
import SidePanel from './SidePanel.vue'
import SecondPanel from './SecondPanel.vue'
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
import { moreMenus, extraRightMenu } from '../components/desk/navigationBar/index'
import navigationSetting from './desk/navigationBar/navigationSetting.vue'
import EditNewNavigation from './desk/navigationBar/EditNewNavigation.vue'
import { Notifications } from '../js/common/sessionNotice'
// import xtMenu from '../ui/components/Menu/index.vue'
import xtMixMenu from '../ui/new/mixMenu/FunMenu.vue'
import EditIcon from './desk/navigationBar/components/EditIcon/EditIcon.vue'
export default {
  name: 'BottomPanel',
  emits: ['getDelIcon'],
  components: {
    ChatButton,
    Emoji,
    MyAvatar,
    TeamTip,
    SecondPanel,
    SidePanel,
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
    EditIcon
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
          callBack: () => { this.clickNavigation(this.currentItem) },
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
          fn: () => { this.navigationToggle[2] = false },
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
      currentIndex: null,
      currentItem: null,
      delItemIcon: false,
      notifications: new Notifications(),
      tooltipVisible: true,

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
          i.icon = item.icon
          i.name = item.name
        }
      })
    })
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
      'navigationToggle'
    ]),
    ...mapWritableState(offlineStore, ["isOffline", 'navList']),
    ...mapWritableState(useWidgetStore, ['rightModel']),
    ...mapWritableState(useNavigationStore, [
      'editToggle', 'taskBoxVisible', 
      'selectNav', 'bottomToggle', 
      'popVisible', 'currentList',
       'editItem','navSize',
       'navRadius','iconRadius'
    ]),
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
          fn: () => { this.bottomToggle[2] = !this.bottomToggle[2] }
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
    }
  },
  watch: {
    footNavigationList: {
      handler(newVal, oldVal) {
        this.checkScroll()
        // this.$nextTick(()=>{
        //   console.log(this.$refs.content.offsetHeight-this.$refs.content.clientHeight>0)
        //   if(this.$refs.content.offsetHeight-this.$refs.content.clientHeight>0){
        //     this.$refs.content.style.marginTop='17px'
        //   }else{
        //     this.$refs.content.style.marginTop='0px'
        //   }
        // })
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
      console.log(newVal, oldVal);
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
    }
  },
  methods: {
    ...mapActions(teamStore, ['updateMy']),
    ...mapActions(messageStore, ['getMessageIndex']),
    ...mapActions(appStore, ['toggleFullScreen']),
    ...mapActions(navStore, [
      'setFootNavigationList',
      'sortFootNavigationList',
      'removeFootNavigationList',
    ]),
    ...mapActions(useNavigationStore, ['toggleEdit', 'toggleTaskBox']),
    // async drop (e) {
    //   let files = e.dataTransfer.files
    //   console.log(e)
    //   let filesArr = []
    //   if (files && files.length > 0) {
    //     for (let i = 0; i < files.length; i++) {
    //       filesArr.push(files[i].path)
    //     }
    //   }
    //   this.dropList =await Promise.all(filesArr.map(async(item)=>{
    //       const fileName = item.substring(item.lastIndexOf("\\") + 1);
    //       let dropFiles =await tsbApi.system.extractFileIcon(item)
    //       return {icon:`${dropFiles}`,name:`${fileName}`,path:item}
    //     }))
    //   console.log(this.dropList)
    // },
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
    clickNavigation(item) {
      if (this.editToggle) {
        // this.enableDrag()
        return
      } else {
        this.hideMenu()
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
                params: item.data,
              })
            } else {
              this.$router.push({ name: item.event })
            }
            break
          case 'coolApp':
            this.$router.push({
              name: 'app',
              params: item.data,
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
      }

    },
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
    enableDrag() {
      // if (this.sortable || !this.editToggle) {
      //   return
      // }
      // document.addEventListener('click', this.disableDrag)
      let that = this
      let drop = document.getElementById('bottomContent')
      this.sortable = Sortable.create(drop, {
        sort: true,
        animation: 150,
        delay: 50,
        delayOnTouchOnly: true,
        onStart: function (event) {
          if (that.popVisible) {
            that.notifications.NoticeToast()
          }
          let delIcon = document.getElementById('delIcon2')
          that.tooltipVisible = false
          that.delItemIcon = true
          that.$emit('getDelIcon', true)
          this.delNav = true
          if (this.delNav) {
            delIcon.ondragover = function (ev) {
              ev.preventDefault()
            }
          }
          delIcon.ondrop = function (ev) {
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
        onUpdate: function (event) {
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
        },
        onEnd: function (event) {
          that.tooltipVisible = true
          that.$emit('getDelIcon', false)
          that.popVisible = false
        },
      })
      // message.success('开始调整底部栏，点击导航外部即可终止调整。')
    },
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

.shaking-element {
  // animation: shake 0.5s infinite;
  animation: shake 1.5s cubic-bezier(0.455, 0.03, 0.515, 0.955) 2 alternate;
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
