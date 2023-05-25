<template>
  <div class=" p-5 rounded-xl m-3" style="width: 95%;height: 100%">
    <Desk :currentDesk="currentDesk" :settings="currentDesk.settings"></Desk>
  </div>

</template>

<script>
import { steamUserStore } from '../../store/steamUser'
import Desk from '../../components/desk/Desk.vue'
import {mapWritableState} from 'pinia'
export default {
  components: { Desk },
  computed: {
    ...mapWritableState(steamUserStore, ['desks'])
  }, data () {
      return {
        currentDesk:{}
      }
  },
  mounted () {
    this.currentDesk=this.desks[0]
  }
}
</script>

<style lang="scss" scoped>

</style>
