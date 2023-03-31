<template>
  <a-tooltip :title="'大盘标准：'+getStand +'%'">
    <span v-if="stand" style="color: rgba(255,116,116,0.85)">↑</span>
    <span v-else style="color: #2baf2b">↓</span>
  </a-tooltip>

</template>

<script>
import dataHelper from '../../js/watch/dataHelper'
let standard = {
  like: 4,
  coin: 1,
  dm: 1,
  collect: 1,
  share: 0.2,
  reply: 0.5
}
export default {
  name: 'Arrow',
  props: ['type', 'value'],
  computed: {
    stand () {
      return dataHelper.aboveStandard(this.type, this.value, standard)
    },
    getStand(){
      return (standard[this.type]).toFixed(1)
    }
  }
}
</script>

<style scoped>

</style>
