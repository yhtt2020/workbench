<template>
  <TopPanel></TopPanel>
  <a-row>
    <a-col>
      <SidePanel></SidePanel>
    </a-col>
    <a-col style="padding-left: 8em">
      <vue-custom-scrollbar :settings="settings" :key="routeUpdateTime" style="position:relative;width:calc(100vw - 9em);  border-radius: 8px;height: calc(100vh - 12em)">
      <router-view></router-view>
      </vue-custom-scrollbar>
    </a-col>
  </a-row>
  <BottomPanel></BottomPanel>
</template>

<script>
import SidePanel from '../components/SidePanel.vue'
import TopPanel from '../components/TopPanel.vue'
import BottomPanel from '../components/BottomPanel.vue'
import vueCustomScrollbar from "../../../src/components/vue-scrollbar.vue";
import {mapWritableState} from 'pinia'
import { appStore } from '../store'
export default {
  name: 'Index',
  components: { BottomPanel, TopPanel, SidePanel,vueCustomScrollbar },
  mounted () {
    this.$router.afterEach((to, from)=>{
      this.routeUpdateTime=Date.now()
      console.log(this.routeUpdateTime,'更新路由事件')
    })
  },
  computed:{
    ...mapWritableState(appStore,['routeUpdateTime'])
  },
  data(){
    return {
      settings: {
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
