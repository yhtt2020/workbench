<template>
  <xtMixMenu :menus="rightMenus" name="name" class="flex max-w-full">
    <!-- <xt-menu :menus="rightMenus" name="name" class="flex max-w-full"  :beforeCreate="beforeCreate"> -->
    <div @click.stop class="flex flex-row items-center justify-center w-full mb-3 bottom-panel " id="bottom-bar"
      style="text-align: center" @contextmenu="showMenu" v-show="navigationToggle[2]"
      :style="{ transform: `scale(${(this.navAttribute.navSize / 100)})` }">
      <!-- 快速搜索 底部 用户栏 -->
      <div v-if="(!simple || settings.enableChat) && !this.isOffline && this.bottomToggle[0]"
        class="relative flex flex-row items-center justify-between common-panel user s-bg" style="
        /* vertical-align: top; */
        margin-top: 0;
        background: var(--primary-bg);
        color: var(--primary-text);
        /* border-radius: 18px; */
        /* width: 160px; */
        height: 80px;
        border: 1px solid var(--divider);
      " :style="{ borderRadius: this.navAttribute.navRadius + 'px' }">
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
        height: 80px;
        max-width: 80%;
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
              <div class=" scroll-content"
                style="overflow-y: hidden;overflow-x: auto; flex: 1; display: flex;margin-right: 14px;" ref="content">
                <div style="white-space: nowrap; display: flex; align-items: center" id="bottomContent">
                  <div v-if="footNavigationList.length <= 0" style=""></div>
                  <a-tooltip v-for="(item, index) in copyFootNav" :key="item.name" :title="item.name"
                    @mouseenter="showElement(item, index)">
                    <xt-menu :menus="iconMenus">
                      <div v-if="!(this.navList.includes(item.event) && this.isOffline)"
                        class="flex items-center justify-center pointer"
                        :style="{ marginLeft: index === 0 ? '14px' : '20px' }"
                        style="white-space: nowrap; display: inline-block;border-radius: 18px;"
                        @click.stop="newOpenApp(item.type, item.value)">
                        <Team v-if="item.value === 'commun'" :item="item" :shakeElement="shakeElement"></Team>
                        <template v-else>
                          <!-- <div style="width: 52px; height: 52px;" v-if="!item.isBg"
                          :style="{ borderRadius: iconRadius + 'px', background: item.bg || '' }"
                          class="relative flex items-center justify-center ">
                          <a-avatar :size="52" shape="square" :src="item.icon"
                            :style="{ borderRadius: iconRadius + 'px' }"
                            :class="{ 'shaking-element': shakeElement }"></a-avatar>
                        </div>
                        <div v-else style="width: 52px; height: 52px;margin-top: -5px;"
                          class="relative flex items-center justify-center overflow-hidden"
                          :style="{ borderRadius: iconRadius + 'px', background: item.bg || '' }">
                          <a-avatar :size="36" shape="square" :src="renderIcon(item.icon)"
                            :style="[{ borderRadius: iconRadius + 'px' }, item.color]"
                            :class="{ 'shaking-element': shakeElement }"></a-avatar>
                        </div> -->
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
        <Team ></Team>
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
import { moreMenus, extraRightMenu } from '../components/desk/navigationBar/index'
import navigationSetting from './desk/navigationBar/navigationSetting.vue'
import EditNewNavigation from './desk/navigationBar/EditNewNavigation.vue'
import { Notifications } from '../js/common/sessionNotice'
// import xtMenu from '../ui/components/Menu/index.vue'
import xtMixMenu from '../ui/new/mixMenu/FunMenu.vue'
import EditIcon from './desk/navigationBar/components/EditIcon/EditIcon.vue'
import { startApp } from '../ui/hooks/useStartApp'
import _ from 'lodash-es'
import Avatar from './desk/navigationBar/components/Avatar.vue'
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
    Avatar
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
      tooltipVisible: true,
      isDelete: true
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
    console.log(this.copyFootNav, 'copyFootNav');
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
          i.type = item.type
          i.icon = item.icon
          i.name = item.name
          i.value = item.event
          i.mode = 'app'
        }
      })
    })
    this.footNavigationList = this.footNavigationList.map((item) => {
      console.log(item, 'item');
      switch (item.type) {
        case 'systemApp':
          return { ...item };
        case 'coolApp':
          return {
            ...item,
            mode: 'app',
            value: item.data || item.value
          };
        case 'lightApp':
          return {
            ...item,
            mode: 'link',
            value: item.package || item.value
          };
        case 'tableApp':
          return {
            ...item,
            mode: 'app',
            value: item.path || item.value
          };
        default:
          return {
            ...item,
            mode: 'link',
            type: 'default',
            value: item.url || item.value
          };
      }
    }).map((item) => ({
      ...item,
      bg: '',
      isBg: false
    }));


    console.log(this.footNavigationList, 'foot');
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
      'editItem', 'navAttribute', 'iconRadius'
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
        // {
        //   id: 5,
        //   name: this.levelVisible ? '隐藏等级' : '显示等级',
        //   newIcon: "fluent:star-16-regular",
        //   fn: () => { this.levelVisible = !this.levelVisible }
        // },
      ]

    },
    rightMenus() {
      // const arr=[...this.mainMenus[3].children]
      this.mainMenus[3].children = [...this.childrenMenu]
      // this.mainMenus[3].children=arr
      return this.mainMenus
    },
  },
  watch: {
    footNavigationList: {
      handler(newVal, oldVal) {
        if (this.footNavigationList.length > this.copyFootNav.length) {
          const target = this.updateNavList(this.footNavigationList, this.copyFootNav);
          this.copyFootNav = JSON.parse(JSON.stringify(target)).concat(this.copyFootNav);
        } else if (this.footNavigationList.length < this.copyFootNav.length) {
          const target = this.updateNavList(this.copyFootNav, this.footNavigationList);
          console.log(target, 'target[0]')
          target.forEach(element => {
            const index = this.copyFootNav.findIndex(item => {
              // 找到被删除元素在备份数据中的索引
              if (element.type === 'coolApp') {
                return item.value.url === element.value.url;
              }
              return item.value === element.value;
            });
            if (index !== -1) {
              this.copyFootNav.splice(index, 1);
            }
          })
        }
        else {
          const rearrangedCopyFootNav = [];
          // 遍历 footNavigationList，根据其顺序获取 copyFootNav 中对应元素的引用
          this.footNavigationList.forEach((item) => {
            // 在 copyFootNav 中寻找与 footNavigationList 对应的元素
            const correspondingElement = this.copyFootNav.find((copyItem) => {
              if (item.type === 'coolApp') {
                return copyItem.value.url === item.value.url;
              }
              return copyItem.value === item.value;
            });

            // 如果找到对应元素，则将其放入新数组中
            if (correspondingElement) {
              rearrangedCopyFootNav.push(correspondingElement);
            }
          });

          // 更新 copyFootNav 为重新排列后的数组
          this.copyFootNav = rearrangedCopyFootNav;

        }
        // this.copyFootNav = JSON.parse(JSON.stringify(this.footNavigationList))
        console.log(this.copyFootNav, 'footNav')
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
  },
  methods: {
    ...mapActions(teamStore, ['updateMy']),
    ...mapActions(messageStore, ['getMessageIndex']),
    ...mapActions(appStore, ['toggleFullScreen']),
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
          if (item.type === 'coolApp') {
            return item.value.url === i.value.url;
          }
          return item.value === i.value;
        });
      });
      return filteredNavList;
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
    // clickNavigation(item) {
    //   console.log(item);
    //   if (this.editToggle) {
    //     // this.enableDrag()
    //     return
    //   } else {
    //     this.hideMenu()
    //     switch (item.type) {
    //       case 'systemApp':
    //         if (item.event === 'fullscreen') {
    //           this.toggleFullScreen()
    //         } else if (item.event === '/status') {
    //           if (this.$route.path === '/status') {
    //             this.$router.go(-1)
    //           } else {
    //             this.$router.push({ path: '/status' })
    //           }
    //         } else if (item.data) {
    //           this.$router.push({
    //             name: 'app',
    //             params: item.data,
    //           })
    //         } else {
    //           this.$router.push({ name: item.event })
    //         }
    //         break
    //       case 'coolApp':
    //         this.$router.push({
    //           name: 'app',
    //           params: item.data,
    //         })
    //         break
    //       case 'localApp':
    //         require('electron').shell.openPath(item.path)
    //         break
    //       case 'lightApp':
    //         ipc.send('executeAppByPackage', { package: item.package })
    //         break
    //       default:
    //         require('electron').shell.openPath(item.path ? item.path : item.url)
    //     }
    //   }

    // },
    newOpenApp(type, value) {
      if (type === 'nav') {
        switch (value) {
          case 'task':
            this.isTaskDrawer = true
            break;
          case 'team':
            console.log(111111)
            break;
        }
      }
      startApp(type, value, this.$router)
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
          that.delNav = true
          if (that.delNav) {
            delIcon.ondragover = function (ev) {
              ev.preventDefault()
            }
          }
          delIcon.ondrop = function (ev) {
            if (!that.isDelete) return
            console.log(111111);
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
          console.log('isDelete', that.footNavigationList);
        }, 100),
        onEnd: function (event) {
          that.tooltipVisible = true
          that.$emit('getDelIcon', false)
          that.popVisible = false
          that.isDelete = true
        },
        onMove: function (event) {
          // console.log(event);
          that.isDelete = false
        },
        // onRemove: function (event) {
        //   console.log(111111111,'=====onRemove');
        // }
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
