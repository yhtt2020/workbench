<template>
  <!-- <div class="side-panel common-panel s-bg " style=" z-index: 999;
  width: 6em;max-height: 446px;overflow: hidden;" ref="sideContent"> -->
  <RightMenu :menus="rightMenus" class="flex max-h-full">
    <div @click.stop class="flex flex-row justify-center box common-panel s-bg w-[80px] rounded-2xl xt-bg pt-0 pb-0 relative max-h-full" style="z-index: 99" ref="sideContent" @contextmenu="showMenu">
      <div style="width: 56px;padding-bottom: 3px;" class="w-full">
        <div :id="sortId" class="flex flex-col items-center flex-1 max-h-full scroller-wrapper hide-scrollbar xt-container"
          style="width: 56px;overflow-y:auto;display: flex;flex-direction: column;overflow-x: hidden;align-items: flex-start; ">
          <a-tooltip :title="item.name" v-for="(item,index) in sideNavigationList" placement="right" @mouseenter="showElement(item,index)">
            <!-- 左右导航栏隐藏入口 -->
            <!-- {{ index }} -->
            <RightMenu :menus="iconMenus">
              <div :key="item.name" @click="clickNavigation(item)">
                <div v-if="!(this.isOffline && this.navList.includes(item.event))" class="item-content item-nav"
                  :class="{ 'active-back': current(item) }">
                  <div class="flex items-center justify-center icon-color" v-if="item.type === 'systemApp'">
                    <navIcon class="icon-color xt-text" :icon="item.icon" style="width:28px;height:28px;"
                      :class="{ 'active-color': current(item), 'shaking-element': shakeElement }"></navIcon>
                  </div>
                  <a-avatar v-else :size="40" shape="square" :src="renderIcon(item.icon)"
                    :class="{ 'shaking-element': shakeElement }"></a-avatar>

                </div>
              </div>
            </RightMenu>
          </a-tooltip>
        </div>
        <!-- <div class="mt-3">
          <AddIcon v-if="this.editToggle" :position="'left'" @addIcon="editNavigation(this.drawerMenus[0])" @completeEdit="completeEdit" />
        </div> -->
      </div>


    </div>
  </RightMenu>

    <a-drawer :contentWrapperStyle="{ backgroundColor: '#212121', height: '216px' }" class="drawer" :closable="true"
      placement="bottom" :visible="menuVisible" @close="onClose">
      <a-row>
        <a-col>
          <div class="flex items-center">
            <div @click="editNavigation(item)" class="relative btn" v-for="item in drawerMenus">
              <!-- <Icon style="font-size: 3em" icon="tianjia1"></Icon> -->
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
    </a-drawer>

    <transition name="fade">
      <div class="fixed inset-0 home-blur" :style="{zIndex: componentId === 'navigationSetting'? 100 : 90}" v-if="quick">
        <!-- <EditNavigation @setQuick="setQuick" v-if="componentId === 'EditNavigation'"></EditNavigation> -->
        <EditNewNavigation @setQuick="setQuick" v-if="componentId === 'EditNavigationIcon'"></EditNewNavigation>
        <navigationSetting @setQuick="setQuick" v-if="componentId === 'navigationSetting'"></navigationSetting>
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
import RightMenu from "../components/desk/Rightmenu.vue";
import AddIcon from './desk/navigationBar/components/AddIcon.vue'
import EditNavigation from './bottomPanel/EditNavigation.vue';
export default {
  name: 'SidePanel',
  components: {
    EditNavigation,
    navIcon,
    navigationSetting,
    RightMenu,
    AddIcon,
    EditNewNavigation
  },
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
          name: "打开",
          fn: () => { this.clickNavigation(this.currentItem) },
        },
        {
          id: 2,
          name: '编辑',
          newIcon: "fluent:compose-16-regular",
          fn: () => { this.editNavigation(this.drawerMenus[1]) },
        },
        {
          id: 3,
          name: '删除',
          newIcon: 'fluent:delete-16-regular',
          color: "#FF4D4F",
          fn: () => {this.currentList==='right'?this.removeRightNavigationList(this.currentIndex):this.removeSideNavigationList(this.currentIndex) }
        },
        {
          id: 4,
          divider: true
        },
        {
          id: 5,
          name: '添加导航图标',
          newIcon: "fluent:add-16-regular",
          fn: () => { this.editNavigation(this.drawerMenus[0]) },
        },
        {
          id: 6,
          name: '导航栏设置',
          newIcon: 'fluent:settings-16-regular',
          fn: () => { this.editNavigation(this.drawerMenus[2]) }
        }
      ],
      rightMenus: [
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
          fn: () => { this.editNavigation(this.drawerMenus[2]) },
        },
        {
          id: 3,
          name: '隐藏当前导航',
          newIcon: "fluent:eye-off-16-regular",
          fn: () => { this.navVisible() },
        },
        
        {
          id: 4,
          name: '更多',
          newIcon: 'fluent:more-horizontal-16-filled',
          children: [
            {
              id: 1,
              name: '显示用户中心',
              newIcon: "fluent:person-16-regular",
              fn: () => {this.bottomToggle[0]=!this.bottomToggle[0] }
            },
            {
              id: 2,
              name: '显示社区助手',
              newIcon: "fluent:people-community-16-regular",
              fn: () => {this.bottomToggle[1]=!this.bottomToggle[1] }
            },
            {
              id: 3,
              name: '显示任务中心',
              newIcon: "fluent:task-list-square-16-regular",
              fn: () => {this.bottomToggle[2]=!this.bottomToggle[2] }
            },
            {
              id: 4,
              name: '显示社群沟通',
              newIcon: "fluent:chat-16-regular",
              fn: () => {this.settings.enableChat=!this.settings.enableChat }
            },
          ]

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
      shakeElement:false,
      currentItem: null,
      currentIndex:null,
      currentList:'left',
    }
  },
  props: {
    // 当前导航列表
    sideNavigationList: {
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
    ...mapWritableState(navStore, ['builtInFeatures', 'mainNavigationList','sideNavigationList','rightNavigationList','navigationToggle']),
    ...mapWritableState(cardStore, ['routeParams']),
    ...mapWritableState(offlineStore, ['isOffline', 'navList']),
    ...mapWritableState(useWidgetStore, ['rightModel']),
    ...mapWritableState(useNavigationStore, ['editToggle', 'selectNav','bottomToggle']),
    ...mapWritableState(appStore,['settings'])
    
  },
  mounted() {
    this.enableDrag()
    this.colDrop()
    // this.scrollNav('sideContent', 'scrollTop')
    if(this.sideNavigationList===this.rightNavigationList){
      this.currentList='right'
    }
  },
  watch: {
    delZone(val) {
      this.delNav = val
    },
    editToggle() {
      if (this.editToggle) {
        this.enableDrag()
        this.shakeElement=true
        setTimeout(()=>{
          this.shakeElement=false
        },2000)
      } else {
        this.disableDrag()
      }
    }
  },
  methods: {
    ...mapActions(navStore, ['removeSideNavigationList','removeRightNavigationList']),
    ...mapActions(useNavigationStore, ['toggleEdit']),
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
        onStart: function (event) {
          let delIcon = document.getElementById('delIcon2')
          that.$emit('getDelIcon', true)
          this.delNav = true
          if (this.delNav) {
            delIcon.ondragover = function (ev) {
              ev.preventDefault()
            }
          }
          delIcon.ondrop = function (ev) {
            let oneNav = that.sideNavigationList[event.oldIndex]
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
        onUpdate: function (event) {
          let newIndex = event.newIndex,
            oldIndex = event.oldIndex
          let newItem = drop.children[newIndex]
          let oldItem = drop.children[oldIndex]

          // 先删除移动的节点
          drop.removeChild(newItem)
          // 再插入移动的节点到原有节点，还原了移动的操作
          if (newIndex > oldIndex) {
            drop.insertBefore(newItem, oldItem)
          } else {
            drop.insertBefore(newItem, oldItem.nextSibling)
          }
          that.sortNavigationList(event)
        },
        onEnd: function (event) {
          that.$emit('getDelIcon', false)
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
            if (this.full) {
              this.full = false
              tsbApi.window.setFullScreen(false)
            } else {
              this.full = true
              tsbApi.window.setFullScreen(true)
            }
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
    navVisible(){
      if(this.currentList==='left'){
        this.navigationToggle[0]=false
      }else{
        this.navigationToggle[1]=false
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
          this.selectNav = this.currentList
          message.success('进入编辑模式')
        } else if (item.component === 'editNavigation') {
          this.componentId = ''
          this.editToggle = true
          this.selectNav = this.currentList
        }
        // console.log(this.componentId,'===>>2');
        this.quick = true
      } else if (item.visible) {
        switch (item.tag) {
          case 'task':
            this.toggleTaskBox()
            break;
          case 'community':
            console.log(111)
            break;
          case 'user':
            console.log(2222)
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
    completeEdit() {
      this.toggleEdit()
      this.setQuick()
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
    showElement(item,index){
      // console.log(item,index,'====>>>1111');
      // this.clickNavigation(item)
      this.currentItem=item
      this.currentIndex=index
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
  width: 56px;
  height: 56px;
  // margin: 6px auto;
  margin-top: 12px;
  display: flex;
  align-items: center;
  cursor: pointer;
  border-radius: 12px;
  background-color: var(--secondary-transp-bg);

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
  height: 34px;
  width: 34px;
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