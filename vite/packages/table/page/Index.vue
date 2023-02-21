<template>
  <template v-if="!fullScreen">
    <TopPanel></TopPanel>
    <a-row>
      <a-col>
        <SidePanel></SidePanel>
      </a-col>
      <a-col style="padding-left: 8em">
        <vue-custom-scrollbar :settings="scrollbarSettings" :key="routeUpdateTime" style="position:relative;width:calc(100vw - 9em);  border-radius: 8px;height: calc(100vh - 12em)">
          <router-view></router-view>
        </vue-custom-scrollbar>
      </a-col>
    </a-row>
    <BottomPanel></BottomPanel>
  </template>
  <template v-else>
    <router-view></router-view>
  </template>

</template>

<script>
import SidePanel from '../components/SidePanel.vue'
import TopPanel from '../components/TopPanel.vue'
import BottomPanel from '../components/BottomPanel.vue'
import {mapWritableState} from 'pinia'
import { appStore } from '../store'
export default {
  name: 'Index',
  components: { BottomPanel, TopPanel, SidePanel },
  mounted () {
    if(!this.settings.init){
      console.log(this.settings)
      this.$router.push('/wizard')
      return
    }
    this.$router.afterEach((to, from)=>{
      this.routeUpdateTime=Date.now()
      console.log(this.routeUpdateTime,'更新路由事件')
    })
  },
  computed:{
    ...mapWritableState(appStore,['routeUpdateTime','fullScreen','settings'])
  },
  data(){
    return {
      scrollbarSettings: {
        useBothWheelAxes:true,
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
