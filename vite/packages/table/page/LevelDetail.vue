<template>
  <vueCustomScrollbar  :settings="scrollbarSettings"  style="height: calc(100vh - 35px);padding: 15px;white-space: nowrap">
    <div class="card" style="width: 400px;padding: 1em;display: inline-block;margin-right: 2em;vertical-align: top">
      <GradePanel></GradePanel>
    </div>
    <div style="width: 400px;display: inline-block;vertical-align: top;margin-right: 1em;white-space: pre-wrap">
      <div class="card" style="width: 400px;padding: 1em;display: inline-block;margin-bottom: 1em">
        <ComPanel></ComPanel>
      </div>
      <div class="card" style="width: 400px;padding: 1em;display: inline-block">
        <ComActionPanel></ComActionPanel>
      </div>
    </div>

    <div class="card" style="width: 400px;padding: 1em;display: inline-block;margin-bottom: 1em">
      <GroupPanel></GroupPanel>
    </div>

  </vueCustomScrollbar>
</template>

<script>
import GradePanel from '../components/comp/GradePanel.vue'
import ComPanel from '../components/comp/ComPanel.vue'
import ComActionPanel from '../components/comp/ComActionPanel.vue'
import GroupPanel from '../components/comp/GroupPanel.vue'
export default {
  name: 'LevelDetail',
  components: { GroupPanel, GradePanel ,ComPanel,ComActionPanel},
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
