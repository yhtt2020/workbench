<template>
  <div class="rounded-xl px-5" style="width: 95%;height: 100%">
    暂不可用，敬请期待
    <Desk v-if="false" :currentDesk="currentDesk" :settings="currentDesk.settings"></Desk>
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
