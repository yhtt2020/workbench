<template>
  <div style="display: flex;flex-direction: column;height: 100vh;flex-wrap: nowrap;align-content: stretch;align-items: stretch;">
    <div style="height: auto;flex: 0">
      <!--顶部状态栏      -->
      <TopPanel v-if="!fullScreen"></TopPanel>
    </div>
    <div style="display: flex;flex-grow: 1;flex-shrink: 1;flex-basis: fit-content;overflow: hidden">
      <div v-if="!fullScreen" style="display: flex;align-content: center;align-items: center">
        <!--左侧栏区域        -->
        <SidePanel></SidePanel>
      </div>
      <div style="flex-shrink: 1;flex-grow: 1;align-items: center;align-content: center;flex-direction: column;position: relative;overflow: hidden">
        <!--主题区域，自动滚动条        -->
          <router-view></router-view>
      </div>
      <Transition name="bounce">
      <div v-if="settings.teamVisible && !fullScreen" class="h-100 trans" style="height: auto;display: flex;flex-direction: column;align-items: center;justify-content: center;position: fixed;top:50%;bottom: 0;;right: 0;z-index:120" >
           <TeamPanel ></TeamPanel>
      </div>
      </Transition>
    </div>
    <div  style="flex: 0;">
      <BottomPanel v-if="!fullScreen"></BottomPanel>
    </div>
  </div>
</template>

<script>
import SidePanel from '../components/SidePanel.vue'
import TopPanel from '../components/TopPanel.vue'
import BottomPanel from '../components/BottomPanel.vue'
import { mapWritableState } from 'pinia'
import { appStore } from '../store'
import TeamPanel from "../components/TeamPanel.vue";

export default {
  name: 'Main',
  components: {TeamPanel, BottomPanel, TopPanel, SidePanel },
  mounted () {
    this.$router.afterEach((to, from) => {
      this.routeUpdateTime = Date.now()
    })
  },
  computed: {
    ...mapWritableState(appStore, ['routeUpdateTime', 'fullScreen', 'settings', 'init'])
  },
  data () {
    return {
      scrollbarSettings: {
        useBothWheelAxes: true,
        swipeEasing: true,
        suppressScrollY: true,
        suppressScrollX: false,
        wheelPropagation: true
      },
    }
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
    transform: scale(0) translate(0,-50%);
  }
  50% {
    transform: scale(1.25) translate(0,-50%);
  }
  100% {
    transform: scale(1) translate(0,-50%);
  }
}
.trans{
  transform:translate(0,-50%);
}

</style>
