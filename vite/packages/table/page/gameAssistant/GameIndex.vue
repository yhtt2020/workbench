<template>
  <div class="rounded-xl px-5" style="width: 100%;height: 100%">
    <Desk v-if="true" :currentDesk="currentDesk" :settings="currentDesk.settings"></Desk>
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
        currentDesk:{
          cards:[],
          settings:{
            cardZoom: 100,
            marginTop: 0,
            cardMargin: 5//卡片间隙
          }
        }
      }
  },
  mounted () {
    this.currentDesk=this.desks[0]
  }
}
</script>

<style lang="scss" scoped>

</style>
