<template>
  <!-- <div class="side-panel common-panel s-bg " style=" z-index: 999;
  width: 6em;max-height: 446px;overflow: hidden;" ref="sideContent"> -->
  <!-- {{ rightMenus }} -->
  <!-- <RightMenu :menus="rightMenus"   @contextmenu="showMenu"> -->
    <div @click.stop class="flex flex-col box common-panel hide-scrollbar s-bg " 
         style="display: flex;flex-direction: row;justify-items: center;justify-content: center;
          background: var(--primary-bg); z-index: 99;width: 80px;max-height: 100%;
          overflow-x: hidden;border-radius: 18px;
          padding-top: 0;padding-bottom: 0px;position:relative;" ref="sideContent"
         @contextmenu.stop="showMenu">
      <div   style="width: 56px;"  >
        <div :id="sortId" class="flex flex-col items-center scroller-wrapper hide-scrollbar xt-container" style="width: 56px;overflow-y:auto;max-height: 100%;display: flex;flex-direction: column;overflow-x: hidden;align-items: flex-start; " >
          <a-tooltip :title="item.name" v-for="item in sideNavigationList" placement="right">
            <!-- 左右导航栏隐藏入口 -->
            <div   :key="item.name" @click.stop="clickNavigation(item)">
              <div v-if="!(this.isOffline && this.navList.includes(item.event))"  @contextmenu.stop="enableDrag"   class="item-content item-nav" :class="{ 'active-back': current(item) }">
                <!-- {{ iconMenus }} -->
                <!-- <RightMenu :menus="iconMenus" @contextmenu=""> -->
                <div class="flex items-center justify-center icon-color" v-if="item.type === 'systemApp'" >
                  <navIcon class="icon-color xt-text" :icon="item.icon" style="width:28px;height:28px;"
                           :class="{ 'active-color': current(item) }"></navIcon>
                </div>
                <a-avatar v-else :size="37" shape="square" :src="renderIcon(item.icon)"></a-avatar>
                <!-- </RightMenu> -->
              </div>
            </div>
          </a-tooltip>
          
        </div>
        <AddIcon v-if="this.editToggle" :position="'left'" @addIcon="addEdit('left')" @completeEdit="this.toggleEdit()" />
      </div>
      
    </div>
  <!-- </RightMenu> -->

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
    <div class="fixed inset-0 home-blur" style="z-index: 999" v-if="quick">
      <EditNavigation @setQuick="setQuick" v-if="componentId==='EditNavigation'"></EditNavigation>
      <navigationSetting @setQuick="setQuick" v-if="componentId==='navigationSetting'"></navigationSetting>
    </div>
  </transition>
</template>

<script>
import {mapActions, mapState,mapWritableState} from "pinia";
import {useNavigationStore} from './desk/navigationBar/navigationStore'
import { navStore } from "../store/nav";
import { cardStore } from '../store/card';
import { offlineStore } from '../js/common/offline';
import {useWidgetStore} from '../components/card/store'
import Sortable from 'sortablejs';
import { message } from 'ant-design-vue';
import routerTab from '../js/common/routerTab'
import { Icon as navIcon } from '@iconify/vue';
import {renderIcon} from '../js/common/common'
import {moreMenus,extraRightMenu,rightMenus,iconMenus} from '../components/desk/navigationBar/index'
import navigationSetting from './desk/navigationBar/navigationSetting.vue'
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
    AddIcon
  },
  data() {
    return {
      menuVisible: false,
      quick: false,
      delNav: false,
      sortable:null,
      dragEnable:false,
      dragEvent:null,
      drawerMenus:[...extraRightMenu,...moreMenus],
      componentId: 'EditNavigation',
      iconMenus,
      rightMenus,
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
      default: () => {}
    },
    //要排序的容器id
    sortId: {
      type: Function,
      default: () => {}
    },
    //删除的方法
    delNavList: {
      type: Function,
      default: () => {}
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
    ...mapWritableState(navStore, ['builtInFeatures','mainNavigationList']),
    ...mapWritableState(cardStore, ['routeParams']),
    ...mapWritableState(offlineStore, ['isOffline','navList']),
    ...mapWritableState(useWidgetStore,['rightModel']),
    ...mapWritableState(useNavigationStore,['editToggle']),
  },
  mounted() {
    this.colDrop()
  // this.scrollNav('sideContent', 'scrollTop')
  },
  watch: {
    delZone(val){
      this.delNav = val
    }
  },
  methods: {
    ...mapActions(useNavigationStore,['toggleEdit']),
    renderIcon,
    disableDrag(){
      if(this.sortable){
        document.removeEventListener('click',this.disableDrag)
        this.sortable.destroy()
        this.sortable=null
        message.info('已中止侧栏调整')
        return
      }
    },
    enableDrag(){
      if(this.sortable){
        return
      }
      let that = this
      let drop = document.getElementById(this.sortId)
      document.addEventListener('click',this.disableDrag)

      this.sortable=Sortable.create(drop,{
        sort: true,
        animation: 150,
        onStart: function (event) {
          let delIcon = document.getElementById('delIcon2')
          that.$emit('getDelIcon',true)
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
            } else{
              message.info(`导航栏中至少保留一个「${oneNav.name}」`)
              // console.log('不可删除')
              return
            }
            that.delNavigation(sumList, oneNav, event.oldIndex, that.delNavList)
          }
        },
        onUpdate:function(event){
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
          that.$emit('getDelIcon',false)
        }
      })
      message.success('开始拖拽调整侧边栏。调整完毕后点击外部即可终止。')
    },
    current(item) {
      if(item.tab){
        return routerTab.isActive(item.tab,1)
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
          require('electron').shell.openPath(item.path)
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
    closeDrawer() {
      this.menuVisible = false
    },
    editNavigation(item) {
      if(item.component){
        console.log(item)
        this.componentId=item.component
      }else if(item.visible){
        console.log(111)
      }else{
        return
      }
      this.quick = true
      this.menuVisible = false
    },
    showMenu() {
      this.routeParams.url && ipc.send('hideTableApp', { app: JSON.parse(JSON.stringify(this.routeParams)) })
      // if(this.rightModel !=='follow'){
        this.menuVisible = true
      // }
      
    },
    setQuick() {
      this.quick = false
    },
    onClose() {
      this.routeParams.url && this.$router.push({ name: 'app', params: this.routeParams })
      this.menuVisible = false
    },
    colDrop () {

    },
    delNavigation (sumList, oneNav, index, delMethod) {
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
  }
}
</script>

<style scoped lang="scss">

:deep(.icon) {
  fill: var(--secondary-text);
}



.item:hover {
  background: var(--active-bg) !important;

  :deep(.icon) {
    // fill: var(--primary-text) !important
  }
}

.active-back {
  :deep(.icon) {
    // fill: var(--active-bg) !important
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
  background-color: var(--secondary-bg);
  
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
.icon-color{
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
  background: var(--active-bg);
  :deep(.icon) {
    fill: rgba(255,255,255,0.9) !important;
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
  margin-right: 24px;
  border-radius: 12px;
  width: 110px;
  height: 100px;
  padding-top: 16px;
  line-height: 30px;
  margin-bottom: 24px;
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

.hide-scrollbar{
  &::-webkit-scrollbar {
    display: none; /* Chrome Safari */
  }
}
</style>
