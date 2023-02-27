<template>
  <vueCustomScrollbar  :settings="settings"  style="height: calc(100vh - 35px);padding: 15px">
    <div class="card" style="width: 400px;padding: 1em">
      <GradePanel></GradePanel>
    </div>
  </vueCustomScrollbar>
</template>

<script>
import GradePanel from '../components/comp/GradePanel.vue'

export default {
  name: 'LevelDetail',
  components: { GradePanel }
}
</script>

<style scoped>

</style>
