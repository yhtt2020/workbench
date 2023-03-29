<template>
  <vueCustomScrollbar :settings="scrollbarSettings"
                      style="height: calc(100vh - 35px);padding: 15px;white-space: nowrap">
    <div class="card mr-3">
      <div class="line-title">互动</div>
      <div>
        <div v-for="barrage in barrages">
          {{barrage.content}}
        </div>
      </div>
      <div class="line">
        <div>有幸认识你，同好的你。</div>
        <icon icon="yonghu"/>
        在线：- 人
      </div>
      <div class="line">发表弹幕</div>
      <a-input placeholder="和大家说句话吧~"></a-input>
    </div>

    <div class="card mr-3" style="width: 400px;padding: 1em;display: inline-block;vertical-align: top">
      <GradePanel></GradePanel>
    </div>
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
import GradePanel from '../components/comp/GradePanel.vue'
import ComPanel from '../components/comp/ComPanel.vue'
import ComActionPanel from '../components/comp/ComActionPanel.vue'
import GroupPanel from '../components/comp/GroupPanel.vue'

export default {
  name: 'LevelDetail',
  components: { GroupPanel, GradePanel, ComPanel, ComActionPanel },
  data () {
    return {
      scrollbarSettings: {
        useBothWheelAxes: true,
        swipeEasing: true,
        suppressScrollY: true,
        suppressScrollX: false,
        wheelPropagation: true
      },
      barrages:[]
    }
  },
  async mounted () {
    this.CONST = tsbApi.barrage.CONST
    tsbApi.barrage.getList(this.CONST.CHANNEL.PUBLIC, 'table').then(barrages=>{
      console.log(barrages)
      this.barrages=barrages
    })

  }
}
</script>

<style scoped>

</style>
