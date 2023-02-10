<template>
  <TopPanel></TopPanel>
  <a-row>
    <a-col>
      <SidePanel></SidePanel>
    </a-col>
    <a-col style="margin-left: 8em">
      <router-view></router-view>
    </a-col>
  </a-row>
  <BottomPanel></BottomPanel>
</template>

<script>
import SidePanel from '../components/SidePanel.vue'
import TopPanel from '../components/TopPanel.vue'
import BottomPanel from '../components/BottomPanel.vue'

export default {
  name: 'Index',
  components: { BottomPanel, TopPanel, SidePanel }
}
</script>

<style scoped>

</style>
