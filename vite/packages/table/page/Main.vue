<template>
  <div
    style="display: flex;flex-direction: column;height: 100vh;flex-wrap: nowrap;align-content: stretch;align-items: stretch;">
    <div style="height: auto;flex: 0">
      <!--顶部状态栏      -->
      <TopPanel isHidden="true" ></TopPanel>
    </div>
    <div :class="{ 'mt-3': !fullScreen }" :style="{ margin: fullScreen ? 0 : '-3px', padding: fullScreen ? 0 : '8px' }"
      style="display: flex;flex-grow: 1;flex-shrink: 1;flex-basis: fit-content;overflow: hidden;height: 100%;">

      <div v-if="!fullScreen && navigationToggle[0]"
        style="display: flex;align-content: center;align-items: center;height: 100%">
        <!--左侧栏区域        -->
        <SidePanel sortId="left" :navigationList="copySideNav" :sortNavigationList="sortSideNavigationList"
          :delNavList="removeSideNavigationList" :otherSwitch1="navigationToggle[1]" :otherSwitch2="navigationToggle[2]"
          :otherNavList1="rightNavigationList" :otherNavList2="footNavigationList" @getDelIcon="getDelIcon"
          @hiedNavBar="hiedNavBar"></SidePanel>
      </div>
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
      <div v-if="!fullScreen && navigationToggle[1]" style="display: flex;align-content: center;align-items: center">
        <!--右侧栏区域        -->
        <SidePanel sortId="right" :navigationList="copyRightNav" :sortNavigationList="sortRightNavigationList"
          :delNavList="removeRightNavigationList" :otherSwitch1="navigationToggle[0]" :otherSwitch2="navigationToggle[2]"
          :otherNavList1="leftNavigationList" :otherNavList2="footNavigationList" @getDelIcon="getDelIcon"
          @hiedNavBar="hiedNavBar"></SidePanel>
      </div>
    </div>
    <div style="flex: 0;">
      <BottomPanel v-if="!fullScreen" :delZone="delZone" @getDelIcon="getDelIcon" @hiedNavBar="hiedNavBar"></BottomPanel>
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

export default {
  name: 'Main',
  components: { TeamPanel, BottomPanel, TopPanel, SidePanel },
  mounted() {
    this.$router.afterEach((to, from) => {
      this.routeUpdateTime = Date.now()
    })
  },
  computed: {
    fullScreen() {
      return fullScreen
    },
    ...mapWritableState(appStore, ['routeUpdateTime', 'fullScreen', 'settings', 'init']),
    ...mapWritableState(teamStore, ['teamVisible']),
    ...mapWritableState(navStore, ['sideNavigationList', 'rightNavigationList', 'navigationToggle', 'footNavigationList','copyRightNav','copySideNav']),
    isMain
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
      delZone: false
    }
  },
  methods: {
    marginLeft() {
      return marginLeft
    },
    ...mapActions(navStore, ['sortSideNavigationList', 'removeSideNavigationList', 'sortRightNavigationList', 'removeRightNavigationList']),
    getDelIcon(val) {
      this.delZone = val
    },
    hiedNavBar(value) {
      const foot = this.navigationToggle[2] ? this.footNavigationList : [];
      const left = this.navigationToggle[0] ? this.sideNavigationList : [];
      const right = this.navigationToggle[1] ? this.rightNavigationList : [];
      const checkAndToggle = (listToCheck, toggleIndex) => {
        if (listToCheck.some((item) => item.event === 'home')) {
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
    }

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
