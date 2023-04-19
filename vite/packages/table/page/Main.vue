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
      <div>

      </div>
    </div>
    <div style="height: auto;flex: 0">
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

export default {
  name: 'Main',
  components: { BottomPanel, TopPanel, SidePanel },
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

<style scoped>

</style>
