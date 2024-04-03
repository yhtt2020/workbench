<template>
  <div
    style="display: flex;flex-direction: column;height: 100vh;flex-wrap: nowrap;align-content: stretch;align-items: stretch;gap:10px">
    <div v-if="!fullScreen" style="height: auto;flex: 0">
      <!--顶部状态栏      -->
      <TopPanel isHidden="true" v-if="currentNavPosition !== 'top'"></TopPanel>
      <BottomPanel 
        v-if="currentNavPosition === 'top' && loaded" :delZone="delZone" 
        @getDelIcon="getDelIcon"
        @hiedNavBar="hiedNavBar" 
        :mainClass="'top-20 right-6'">
      </BottomPanel>
    </div>
    <div :style="{ margin: fullScreen ? 0 : '-3px', padding: fullScreen ? 0 : '8px' }"
      style="display: flex;flex-grow: 1;flex-shrink: 1;flex-basis: fit-content;overflow: hidden;height: 100%;">
      <AutoHide 
        :enter="'animate__fadeInLeft'" 
        :leave="'animate__fadeOutLeft'" 
        :auto-hide-nav="this.autoHideNav.left.state">
        <div 
          ref="leftPanel" 
          v-show="sideVisible" 
          style="display: flex;align-content: center;align-items: center;height: 100%"
          >
          <!--左侧栏区域        -->
          <SidePanel 
            sortId="left" 
            :navigationList="sideNavigationList" 
            :sortNavigationList="sortSideNavigationList"
            :delNavList="removeSideNavigationList" 
            :otherSwitch1="navigationToggle[1]"
            :otherSwitch2="navigationToggle[2]" 
            :otherNavList1="rightNavigationList" 
            :otherNavList2="footNavigationList"
            @getDelIcon="getDelIcon" 
            @hiedNavBar="hiedNavBar" 
            @openFolder="openFolder">
          </SidePanel>
        </div>
      </AutoHide>
      <div :style="{ margin: fullScreen ? 0 : '-8px', padding: fullScreen ? 0 : '8px' }"
        style="flex-shrink: 1;flex-grow: 1;align-items: center;align-content: center;flex-direction: column;position: relative;overflow: hidden;">
        <!--主题区域，自动滚动条        -->
        <keep-alive>
          <router-view></router-view>
        </keep-alive>
        <!-- 删除区域 -->
        <div class="del-icon" id="delIcon2"
          v-show="delZone && this.navigationToggle[2] && currentNavPosition === 'bottom'"
          style="z-index:500;bottom: 0;right: 50%;transform: translateX(50%);width: 400px;height: 120px;">
          <xt-new-icon icon="fluent:delete-16-regular" size="32" color="red"></xt-new-icon>
        </div>
        <div class="del-icon" id="delIconTop"
          v-show="delZone && this.navigationToggle[2] && currentNavPosition === 'top'"
          style="z-index:500;top: 0;right: 50%;transform: translateX(50%);width: 400px;height: 120px;">
          <xt-new-icon icon="fluent:delete-16-regular" size="32" color="red"></xt-new-icon>
        </div>
        <div class="del-icon" id="delIcon3" v-show="delZone && this.navigationToggle[0]"
          style="z-index:500;bottom: 50%;left: 0;transform: translateY(50%);width: 120px;height: 400px;">
          <xt-new-icon icon="fluent:delete-16-regular" size="32" color="red"></xt-new-icon>
        </div>
        <div class="del-icon" id="delIcon3" v-show="delZone && this.navigationToggle[1]"
          style="z-index:500;bottom: 50%;right: 0;transform: translateY(50%);width: 120px;height: 400px;">
          <xt-new-icon icon="fluent:delete-16-regular" size="32" color="red"></xt-new-icon>
        </div>
      </div>
      <Transition name="bounce">
        <div v-if="teamVisible && !fullScreen" class="h-100 "
          style="height: auto;display: flex;flex-direction: column;align-items: center;justify-content: center;z-index:120">
          <TeamPanel></TeamPanel>
        </div>
      </Transition>
      <AutoHide 
        :enter="'animate__fadeInRight'" 
        :leave="'animate__fadeOutRight'" 
        :auto-hide-nav="this.autoHideNav.right.state">
        <div 
          ref="rightPanel" 
          v-show="rightVisible" 
          style="
            display: flex;
            align-content: center;
            align-items: center"
          >
          <!--右侧栏区域        -->
          <SidePanel 
            sortId="right" 
            :navigationList="rightNavigationList" 
            :sortNavigationList="sortRightNavigationList"
            :delNavList="removeRightNavigationList" 
            :otherSwitch1="navigationToggle[0]"
            :otherSwitch2="navigationToggle[2]" 
            :otherNavList1="leftNavigationList" 
            :otherNavList2="footNavigationList"
            @getDelIcon="getDelIcon" 
            @hiedNavBar="hiedNavBar">
          </SidePanel>
        </div>
      </AutoHide>
    </div>
    <div style="flex: 0;" id="bottom-panel">
      <BottomPanel 
        v-if="!fullScreen && loaded && currentNavPosition === 'bottom'" 
        :delZone="delZone"
        @getDelIcon="getDelIcon" 
        @hiedNavBar="hiedNavBar" 
        :mainClass="'bottom-20 right-6'">
      </BottomPanel>
    </div>
  </div>
</template>

<script>
import SidePanel from '../components/SidePanel.vue'
import TopPanel from '../components/TopPanel.vue'
import BottomPanel from '../components/BottomPanel.vue'
import WindowPanel from '../components/WindowPanel.vue'
import TeamPanel from '../components/team/TeamPanel.vue'
import AutoHide from '../components/desk/navigationBar/components/folder/AutoHide.vue'

import { mapActions, mapWritableState } from 'pinia'
import { appStore } from '../store'
import { teamStore } from '../store/team'
import { isMain } from '../js/common/screenUtils'
import { navStore } from '../store/nav'
import { message } from 'ant-design-vue'
import { useNavigationStore } from '../components/desk/navigationBar/navigationStore'

export default {
  name: 'Main',
  components: { TeamPanel, BottomPanel, TopPanel, SidePanel, AutoHide, WindowPanel },
  mounted() {
    this.$router.afterEach((to, from) => {
      this.routeUpdateTime = Date.now()
    })
    this.loadNav()
    window.addEventListener('mousemove', this.listenMouse)
  },
  computed: {
    fullScreen() {
      return fullScreen
    },
    ...mapWritableState(appStore, ['routeUpdateTime', 'fullScreen', 'settings', 'init']),
    ...mapWritableState(teamStore, ['teamVisible']),
    ...mapWritableState(navStore, ['sideNavigationList', 'rightNavigationList', 'navigationToggle', 'footNavigationList', 'copyRightNav', 'copySideNav', 'loaded', 'copyFootNav']),
    ...mapWritableState(useNavigationStore, ['autoHideNav', 'isLeaveBar', 'isEdge', 'currentNavPosition']),
    isMain,
    sideVisible() {
      if (this.autoHideNav.left.state) {
        if (this.isLeftEdge) {
          return true
        }
        if (this.isLeaveBar && !this.sideIsOpenFolder) {
          return false
        }
        return true
      } else {
        return this.navigationToggle[0] && !this.fullScreen
      }

    },
    rightVisible() {
      if (this.autoHideNav.right.state) {
        if (this.isRightEdge) {
          return true
        }
        if (this.isLeaveBar && !this.rightIsOpenFolder) {
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
      // 左边是否接触到边界
      isLeftEdge: false,
      // 右边是否接触到边界
      isRightEdge: false,
      // 是否进入到左侧导航栏
      isEnterLeft: false,
      // 是否进入到右侧导航栏
      isEnterRight: false
    }
  },
  methods: {
    listenMouse(e) {
      const { clientX, clientY } = e
      if (clientX < 50) {
        this.isLeftEdge = true
      } else if (clientX > window.innerWidth - 50) {
        this.isRightEdge = true
      } else {
        this.isLeftEdge = false
        this.isRightEdge = false
      }
    },
    marginLeft() {
      return marginLeft
    },
    ...mapActions(navStore, [
      'sortSideNavigationList',
      'removeSideNavigationList',
      'sortRightNavigationList',
      'removeRightNavigationList',
      'loadNav'
    ]),
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
    openFolder(value, id) {
      id === 'left' ? this.sideIsOpenFolder = value : this.rightIsOpenFolder = value
    },
  }
}
</script>
<style lang="scss" scoped>
.del-icon {
  border-radius: 16px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px dashed red;
  font-size: 18px;
  // color: var(--primary-text);
  font-weight: 500;
  position: absolute;
  z-index: 9;
  background-color: rgba(244, 58, 58, 0.5);
  color: red !important;
}
</style>
