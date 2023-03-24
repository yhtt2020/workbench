<template>
  <a-tooltip :title="'大盘标准：'+getStand +'%'">
    <span v-if="stand" style="color: red">↑</span>
    <span v-else style="color: green">↓</span>
  </a-tooltip>

</template>

<script>
import dataHelper from '../../js/watch/dataHelper'
let standard = {
  like: 4,
  coin: 1,
  dm: 1,
  collect: 1,
  share: 1,
  reply: 1
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
