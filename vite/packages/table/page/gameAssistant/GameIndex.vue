<template>
  <div class="flex flex-row px-5">
    <a-select
      placeholder="-"
      style="border: 1px solid rgba(255, 255, 255, 0.1);" v-model:value="runningGame.appid"
      class="w-60 h-12 rounded-lg mr-3 text-xs s-bg right-nav" size="large" :bordered="false">
      <a-select-option value="0">
        主桌面
      </a-select-option>
      <a-select-option v-for="item in recentGameList" :value="item.appid">{{ item.title }}</a-select-option>
    </a-select>
  </div>
  <div class="rounded-xl px-5" style="width: 100%;height: 100%">
    <Desk :currentDesk="currentDesk" :settings="currentDesk.settings"></Desk>
  </div>

</template>

<script>
import {steamUserStore} from '../../store/steamUser'
import Desk from '../../components/desk/Desk.vue'
import {mapWritableState} from 'pinia'

export default {
  components: {Desk},
  computed: {
    ...mapWritableState(steamUserStore, ['desks', 'runningGame', 'recentGameList'])
  },
  data() {
    return {
      currentDesk: {
        cards: [],
        settings: {
          cardZoom: 100,
          marginTop: 0,
          cardMargin: 5//卡片间隙
        }
      }
    }
  },
  mounted() {
    this.currentDesk = this.desks[0]
  }
}
</script>

<style lang="scss" scoped>

</style>
