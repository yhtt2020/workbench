<template>
  <div class="flex flex-row px-5">
    <a-select
      placeholder="-"
      style="border: 1px solid rgba(255, 255, 255, 0.1);" v-model:value="selectDeskId"
      class="w-60 h-12 rounded-lg mr-3 text-xs s-bg right-nav" size="large" :bordered="false">
      <a-select-option value="0">
        主桌面
      </a-select-option>
      <a-select-option v-for="item in recentGameList" :value="item.appid">{{ item.chineseName }}</a-select-option>
    </a-select>
  </div>
  <div class="rounded-xl px-5" style="width: 100%;height: 100%">
    <template v-if="desks[selectDeskGame.appid] || selectDeskId==='0' && desks[selectDeskGame.appid] ">
      <Desk :currentDesk="desks[selectDeskGame.appid]" :settings="desks[selectDeskGame.appid].settings"></Desk>
    </template>
    <div v-else>
      <div style="margin: auto;width: 400px;margin-top: 40px">
        <p>
          <a-image :preview="false" :src="getCover(selectDeskGame.appid)"></a-image>
          <div class="mt-3 mb-3 text-lg font-bold">{{ selectDeskGame.name }}-{{ selectDeskGame.appid }}</div>
          此游戏还没有创建桌面，当您为游戏单独创建桌面后，游戏运行中，会自动为您切换至此桌面。
          点击下方按钮为此游戏创建独立桌面。
        </p>
        <a-button block size="large" @click="createDesk()" type="primary ">单独创建桌面</a-button>
      </div>

    </div>
  </div>
</template>

<script>
import {steamUserStore} from '../../store/steamUser'
import Desk from '../../components/desk/Desk.vue'
import {mapWritableState} from 'pinia'
import {getCover} from "../../js/common/game";
import {nanoid} from "nanoid";

export default {
  components: {Desk},
  computed: {
    ...mapWritableState(steamUserStore, ['desks', 'runningGame', 'recentGameList']),
    selectDeskGame() {
      let found = this.recentGameList.find(g => {
        return g.appid === this.selectDeskId
      })
      if (found) {
        return found
      } else {
        return {
          appid: '0',
          name: '主桌面',
        }
      }
    }
  },
  data() {
    return {
      selectDeskId: '0',
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
    if (Object.keys(this.desks).length > 0) {
      this.currentDesk = this.desks['0']
    } else {
      this.desks['0'] =
        {
          name: '主桌面',
          nanoid: nanoid(4),
          cards: [],
          settings: {
            cardZoom: 100,
            marginTop: 0,
            cardMargin: 5//卡片间隙
          }
        }
    }
    if(this.$route.params['appid']){
      console.log('定位')
      this.selectDeskId=this.$route.params['appid']
    }
  },
  methods: {
    getCover,
    createDesk() {
      this.desks[this.selectDeskGame.appid] = {
        name: this.selectDeskGame.name,
        nanoid: nanoid(4),
        cards: [],
        settings: {
          cardZoom: 100,
          marginTop: 0,
          cardMargin: 5//卡片间隙
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
