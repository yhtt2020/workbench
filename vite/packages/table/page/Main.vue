<template>
  <div
    style="display: flex;flex-direction: column;height: 100vh;flex-wrap: nowrap;align-content: stretch;align-items: stretch;gap:10px">
    <div v-if="!fullScreen" style="height: auto;flex: 0">
      <!--顶部状态栏      -->
      <TopPanel isHidden="true"></TopPanel>
    </div>
    <div :style="{ margin: fullScreen ? 0 : '-3px', padding: fullScreen ? 0 : '8px' }"
      style="display: flex;flex-grow: 1;flex-shrink: 1;flex-basis: fit-content;overflow: hidden;height: 100%;">
      <!-- <AutoHide> -->
      <div v-if="this.navigationToggle[0] && !this.fullScreen"
        style="display: flex;align-content: center;align-items: center;height: 100%">
        <!--左侧栏区域        -->
        <SidePanel sortId="left" :navigationList="sideNavigationList" :sortNavigationList="sortSideNavigationList"
          :delNavList="removeSideNavigationList" :otherSwitch1="navigationToggle[1]" :otherSwitch2="navigationToggle[2]"
          :otherNavList1="rightNavigationList" :otherNavList2="footNavigationList" @getDelIcon="getDelIcon"
          @hiedNavBar="hiedNavBar" @openFolder="openFolder"></SidePanel>
      </div>
      <!-- </AutoHide> -->
      <div :style="{ margin: fullScreen ? 0 : '-8px', padding: fullScreen ? 0 : '8px' }"
        style="flex-shrink: 1;flex-grow: 1;align-items: center;align-content: center;flex-direction: column;position: relative;overflow: hidden;">
        <!--主题区域，自动滚动条        -->
        <keep-alive>
          <router-view></router-view>
        </keep-alive>
        <!-- 删除区域 -->
        <div class="del-icon" id="delIcon2" v-show="delZone" style="z-index:500"></div>
      </div>
      <Transition name="bounce">
        <div v-if="teamVisible && !fullScreen" class="h-100 "
          style="height: auto;display: flex;flex-direction: column;align-items: center;justify-content: center;z-index:120">
          <TeamPanel></TeamPanel>
        </div>
      </Transition>
      <!-- <AutoHide> -->
      <div v-if="this.navigationToggle[1] && !this.fullScreen" style="display: flex;align-content: center;align-items: center">
        <!--右侧栏区域        -->
        <SidePanel sortId="right" :navigationList="rightNavigationList" :sortNavigationList="sortRightNavigationList"
          :delNavList="removeRightNavigationList" :otherSwitch1="navigationToggle[0]" :otherSwitch2="navigationToggle[2]"
          :otherNavList1="leftNavigationList" :otherNavList2="footNavigationList" @getDelIcon="getDelIcon"
          @hiedNavBar="hiedNavBar"></SidePanel>
      </div>
      <!-- </AutoHide> -->
    </div>
    <div style="flex: 0;">
      <BottomPanel v-if="!fullScreen && loaded" :delZone="delZone" @getDelIcon="getDelIcon" @hiedNavBar="hiedNavBar">
      </BottomPanel>
    </div>
  </div>
</template>

<script>
import SidePanel from '../components/SidePanel.vue'
import TopPanel from '../components/TopPanel.vue'
import BottomPanel from '../components/BottomPanel.vue'
import { mapActions, mapWritableState } from 'pinia'
import { appStore } from '../store'
import TeamPanel from '../components/team/TeamPanel.vue'
import { teamStore } from '../store/team'
import { isMain } from '../js/common/screenUtils'
import { navStore } from '../store/nav'
import fullScreen from '../components/widgets/myIcons/icons/fullScreen.vue'
import { message } from 'ant-design-vue'
import { useNavigationStore } from '../components/desk/navigationBar/navigationStore'
import AutoHide from '../components/desk/navigationBar/components/folder/AutoHide.vue'

export default {
  name: 'Main',
  components: { TeamPanel, BottomPanel, TopPanel, SidePanel,AutoHide },
  mounted() {
    this.$router.afterEach((to, from) => {
      this.routeUpdateTime = Date.now()
    })
    this.loadNav()
  },
  computed: {
    fullScreen() {
      return fullScreen
    },
    ...mapWritableState(appStore, ['routeUpdateTime', 'fullScreen', 'settings', 'init']),
    ...mapWritableState(teamStore, ['teamVisible']),
    ...mapWritableState(navStore, ['sideNavigationList', 'rightNavigationList', 'navigationToggle', 'footNavigationList', 'copyRightNav', 'copySideNav', 'loaded', 'copyFootNav']),
    ...mapWritableState(useNavigationStore, ['customOpenNav', 'isLeaveBar','isEdge']),
    isMain,
    sideVisible() {
      if (this.customOpenNav) {
        if (this.isEdge) {
          return true
        }
        if (this.isLeaveBar  && !this.sideIsOpenFolder) {
          return false
        }
        return true
      } else {
        return this.navigationToggle[0] && !this.fullScreen
      }

    },
    rightVisible() {
      if (this.customOpenNav) {
        if (this.isEdge) {
          return true
        }
        if (this.isLeaveBar  && !this.rightIsOpenFolder) {
          return false
        }
        return true
      } else {
        return this.navigationToggle[1] && !this.fullScreen
      }
    },
  },
  data() {
    return {
      scrollbarSettings: {
        useBothWheelAxes: true,
        swipeEasing: true,
        suppressScrollY: true,
        suppressScrollX: false,
        wheelPropagation: true
      },
      delZone: false,
      // 侧边栏是否打开文件夹
      sideIsOpenFolder: false,
      // 右边栏是否打开文件夹
      rightIsOpenFolder: false,
    }
  },
  methods: {
    marginLeft() {
      return marginLeft
    },
    ...mapActions(navStore, ['sortSideNavigationList', 'removeSideNavigationList', 'sortRightNavigationList', 'removeRightNavigationList', 'loadNav']),
    getDelIcon(val) {
      this.delZone = val
    },
    hiedNavBar(value) {
      const foot = this.navigationToggle[2] ? this.copyFootNav : [];
      const left = this.navigationToggle[0] ? this.sideNavigationList : [];
      const right = this.navigationToggle[1] ? this.rightNavigationList : [];
      const checkAndToggle = (listToCheck, toggleIndex) => {
        if (listToCheck.some((item) => item.value === 'home')) {
          this.navigationToggle[toggleIndex] = false;
          return;
        }
        this.navigationToggle[toggleIndex] = true;
        message.info('至少保留一个主页图标');
      };

      if (value === 'foot') {
        checkAndToggle([...left, ...right], 2);
      } else if (value === 'left') {
        checkAndToggle([...right, ...foot], 0);
      } else if (value === 'right') {
        checkAndToggle([...left, ...foot], 1);
      }
    },
    handleMouseEnter(e) {
      if (this.customOpenNav) {
        this.isLeaveBar = false
        console.log('=========>>>>>>>鼠标离开了', this.isLeaveBar, this.controlVisible, this.folderVisible)
      }
    },
    handleMouseLeave(e) {
      if (this.customOpenNav) {
        this.isLeaveBar = true
        console.log('===========>>>>>>>>鼠标进入了', this.isLeaveBar, e.y,)
      }
    },
    openFolder(value,id) {
      id === 'left' ? this.sideIsOpenFolder = value : this.rightIsOpenFolder = value
      console.log(value,id,'<<<<<<<<<<<========main')
    },
  }
}
</script>

<style>
.bounce-enter-active {
  animation: bounce-in 0.5s;
}

.bounce-leave-active {
  animation: bounce-in 0.5s reverse;
}

@keyframes bounce-in {
  0% {
    transform: scale(0);
  }

  50% {
    transform: scale(1.25);
  }

  100% {
    transform: scale(1);
  }
}
</style>
<style lang="scss" scoped>
.del-icon {
  width: 100%;
  height: 100%;
  // opacity: 0.5;
  // background: var(--secondary-bg);
  // backdrop-filter: blur(8px);
  // border: 1px dashed rgba(255, 255, 255, 0.4);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  color: var(--primary-text);
  font-weight: 500;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 9;
}
</style>
