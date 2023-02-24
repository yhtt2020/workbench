<template>
  <TopPanel v-if="!fullScreen"></TopPanel>
  <a-row>
    <a-col v-if="!fullScreen">
      <SidePanel></SidePanel>
    </a-col>
    <a-col :style="{'padding-left': !fullScreen?'8em':'0'}">
      <vue-custom-scrollbar
        :style="{'width':!fullScreen?'calc(100vw - 9em)':'100vw','height':fullScreen?'calc(100vw - 4em)' : 'calc(100vh - 12em)','border-radius':fullScreen?'0':'8px' }"
        :settings="scrollbarSettings" :key="routeUpdateTime" style="position:relative;  ">
        <router-view></router-view>
      </vue-custom-scrollbar>
    </a-col>
  </a-row>
  <BottomPanel v-if="!fullScreen"></BottomPanel>

</template>

<script>
import SidePanel from '../components/SidePanel.vue'
import TopPanel from '../components/TopPanel.vue'
import BottomPanel from '../components/BottomPanel.vue'
import { mapWritableState } from 'pinia'
import { appStore } from '../store'

export default {
  name: 'Index',
  components: { BottomPanel, TopPanel, SidePanel },
  mounted () {
    if (!this.init) {
      console.log(this.settings)
      this.$router.push('/wizard')
      return
    }
    this.$router.afterEach((to, from) => {
      this.routeUpdateTime = Date.now()
    })
  },
  computed: {
    ...mapWritableState(appStore, ['routeUpdateTime', 'fullScreen', 'settings', 'init'])
  },
  data(){
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
