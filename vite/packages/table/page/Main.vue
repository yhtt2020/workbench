<template>
  <div
    style="display: flex;flex-direction: column;height: 100vh;flex-wrap: nowrap;align-content: stretch;align-items: stretch;">
    <div style="height: auto;flex: 0">
      <!--顶部状态栏      -->
      <TopPanel v-if="!fullScreen"></TopPanel>
    </div>
    <div :class="{ 'mt-3': !fullScreen }"
      style="display: flex;flex-grow: 1;flex-shrink: 1;flex-basis: fit-content;overflow: hidden;height: 100%;padding: 8px;margin: -3px">
      <div v-if="!fullScreen && navigationToggle[0]" style="display: flex;align-content: center;align-items: center;height: 100%">
        <!--左侧栏区域        -->
        <SidePanel :sideNavigationList="sideNavigationList" sortId="left" :sortNavigationList="sortSideNavigationList"></SidePanel>
      </div>
      <div
        style="flex-shrink: 1;flex-grow: 1;align-items: center;align-content: center;flex-direction: column;position: relative;overflow: hidden;padding: 8px;margin: -8px;">
        <!--主题区域，自动滚动条        -->
        <router-view></router-view>
      </div>
      <Transition name="bounce">
        <div v-if="teamVisible && !fullScreen" class="h-100 "
          style="height: auto;display: flex;flex-direction: column;align-items: center;justify-content: center;z-index:120">
          <TeamPanel></TeamPanel>
        </div>
      </Transition>
      <div v-if="!fullScreen && navigationToggle[1]" style="display: flex;align-content: center;align-items: center">
        <!--右侧栏区域        -->
        <SidePanel :sideNavigationList="rightNavigationList" sortId="right" :sortNavigationList="sortRightNavigationList"></SidePanel>
      </div>
    </div>
    <div style="flex: 0;">
      <BottomPanel v-if="!fullScreen"></BottomPanel>
    </div>
  </div>
</template>

<script>
import SidePanel from '../components/SidePanel.vue'
import TopPanel from '../components/TopPanel.vue'
import BottomPanel from '../components/BottomPanel.vue'
import { mapActions,mapWritableState } from 'pinia'
import { appStore } from '../store'
import TeamPanel from "../components/team/TeamPanel.vue";
import { teamStore } from '../store/team'
import { isMain } from '../js/common/screenUtils'
import {navStore} from "../store/nav";

export default {
  name: 'Main',
  components: { TeamPanel, BottomPanel, TopPanel, SidePanel },
  mounted() {
    this.$router.afterEach((to, from) => {
      this.routeUpdateTime = Date.now()
    })
  },
  computed: {
    ...mapWritableState(appStore, ['routeUpdateTime', 'fullScreen', 'settings', 'init']),
    ...mapWritableState(teamStore, ['teamVisible']),
    ...mapWritableState(navStore,['sideNavigationList','rightNavigationList','navigationToggle']),
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
    }
  },
  methods: {
    ...mapActions(navStore, ['sortSideNavigationList', 'removeSideNavigationList', 'sortRightNavigationList', 'removeRightNavigationList']),
  }
}
</script>

<style >
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
