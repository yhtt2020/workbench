<template>
  <vueCustomScrollbar :settings="scrollbarSettings"
                      style="margin-left:11.5em; width: calc(100vw - 20.5em);height: calc(100vh - 35px);padding: 15px;white-space: nowrap">




    <div class="mr-3" style="width: 400px;display: inline-block;vertical-align: top;white-space: pre-wrap">
      <div class="card half" style="width: 400px;padding: 1em;display: inline-block;margin-bottom: 1em">
        <ComPanel></ComPanel>
      </div>
      <div class="card half" style="width: 400px;padding: 1em;display: inline-block">
        <ComActionPanel></ComActionPanel>
      </div>
    </div>

    <div class="card" style="width: 400px;padding: 1em;display: inline-block;margin-bottom: 1em">
      <GroupPanel></GroupPanel>
    </div>

  </vueCustomScrollbar>
</template>

<script>
import GradePanel from '../../components/comp/GradePanel.vue'
import ComPanel from '../../components/comp/ComPanel.vue'
import ComActionPanel from '../../components/comp/ComActionPanel.vue'
import GroupPanel from '../../components/comp/GroupPanel.vue'

export default {
  name: 'My',
  components: { GroupPanel, ComActionPanel, ComPanel, GradePanel },
  data(){
    return {
      hideAdmin:false,
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
.card{
  background: #252525;
}
</style>
