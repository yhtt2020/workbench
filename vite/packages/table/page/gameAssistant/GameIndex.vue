<template>
  <div v-if="!fullScreen" class="  px-5" style="display: flex">
    <div class="game-tabs flex flex-row mb-3">
      <div @click="setSelectDeskId('0')" :class="{'tab-active':selectDeskId==='0'}" class="pr-3 home game-tab s-bg  ">
        <icon class="icon" style="font-size: 22px" icon="desktop"></icon>
        主桌面
      </div>
      <div  :class="{'tab-active':selectDeskId===item.appid}" @click="setSelectDeskId(item.appid)" style="width: 140px;" class="truncate pr-3 game-tab s-bg" v-for="(item,index) in recentGameList.slice(0,3)">
        <a-avatar  class="mr-1 icon" :size="22" :src="getClientIcon(item.appid,item.clientIcon)"></a-avatar>
        <span class="">{{ item.chineseName }}</span>
        <div v-if="runningGame.appid===item.appid" style="border-bottom: 3px solid #ffffff"></div>
      </div>
      <div @click="showMore" v-if="recentGameList.length>3" class="game-tab s-bg more" >
        <icon class="icon"  style="font-size: 22px" icon="gengduo1"></icon>
        更多
      </div>
    </div>

    <!--    <a-select-->
    <!--      placeholder="-"-->
    <!--      style="border: 1px solid rgba(255, 255, 255, 0.1);" v-model:value="selectDeskId"-->
    <!--      class="w-60 h-12 rounded-lg mr-3 text-xs s-bg right-nav" size="large" :bordered="false">-->
    <!--      <a-select-option v-for="item in recentGameList" :value="item.appid">{{ item.chineseName }}</a-select-option>-->
    <!--    </a-select>-->
    <div >
      <div @click="setFullScreen" class="s-bg no-drag pointer h-10 w-10 rounded-md flex justify-center items-center ml-3"><Icon  style="font-size: 18px" icon="fullscreen"></Icon></div>
    </div>
  </div>
  <div v-if="fullScreen" class="no-drag">
    <div style="position: absolute;right: 10px;top: 10px;z-index: 999">
      <div @click="setFullScreen(false)" class="s-bg no-drag pointer h-10 w-10 rounded-md flex justify-center items-center ml-3"><Icon  style="font-size: 18px" icon="quxiaoquanping_huaban"></Icon></div>
    </div>
  </div>
<!-- 卡片桌面  -->
  <div class="rounded-xl" style="width: 100%;height: 0;flex: 1" :class="{'px-5':!fullScreen}">
    <template v-if="(desks[selectDeskGame.appid] || selectDeskId==='0') && desks[selectDeskGame.appid] ">
      <Desk :currentDesk="desks[selectDeskGame.appid]" :settings="desks[selectDeskGame.appid].settings"></Desk>
    </template>
    <div v-else>
      <div class="s-bg p-5 rounded-md" style="margin: auto;width: 400px;margin-top: 40px">
        <p>
          <a-image class="rounded-md" :preview="false" :src="getCover(selectDeskGame.appid)"></a-image>
          <div class="mt-3 mb-3 text-lg font-bold">{{ selectDeskGame.chineseName }}-{{ selectDeskGame.appid }}</div>
          此游戏还没有创建桌面，当您为游戏单独创建桌面后，游戏运行中，会自动为您切换至此桌面。
          点击下方按钮为此游戏创建独立桌面。
        </p>
        <a-row :gutter="15">
          <a-col :span="12">
            <a-button block size="large" @click="createDesk()" type="primary ">创建空白桌面</a-button>
          </a-col>
          <a-col :span="12">
            <a-button  block size="large" @click="createMainDesk()">基于主桌面创建</a-button>
          </a-col>
        </a-row>
      </div>

    </div>
  </div>
  <GameListDrawer :activeId="selectDeskId" :items="recentGameList.slice(3)" @visibleChanged="" @valueChanged="(event)=>{this.selectDeskId=event.appid}" v-model:visible="recentVisible"></GameListDrawer>

</template>

<script>
import {steamUserStore} from '../../store/steamUser'
import Desk from '../../components/desk/Desk.vue'
import {mapWritableState} from 'pinia'
import {getClientIcon, getCover} from "../../js/common/game";
import {nanoid} from "nanoid";
import GameListDrawer from "../../components/game/GameListDrawer.vue";
import { appStore } from '../../store'
import { useToast} from 'vue-toastification'
const toast=useToast()
export default {
  components: {GameListDrawer, Desk},
  computed: {
    ...mapWritableState(steamUserStore, ['desks', 'runningGame','recentGameList']),
    ...mapWritableState(appStore,['fullScreen']),
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
      recentVisible: false,
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
      if (this.$route.params['appid']) {
        let appid=this.$route.params['appid']
        if(!this.desks[appid]){
          toast('当前游戏还没有独立桌面，默认使用主桌面。')
        }else{
          setTimeout(()=>{
            this.selectDeskId = this.$route.params['appid']
          },500)
        }


      }else{
        this.currentDesk = this.desks['0']
        this.selectDeskId ='0'
      }
    } else {
      //如果还没有桌面
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
      this.currentDesk = this.desks['0']
      this.selectDeskId ='0'
    }

  },
  methods: {
    getClientIcon,
    getCover,
    setSelectDeskId(id){
      this.selectDeskId=id
    },
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
    },
    createMainDesk(){
      this.desks[this.selectDeskGame.appid] = {
        name: this.selectDeskGame.name,
        nanoid: nanoid(4),
        cards: this.desks['0'].cards,
        settings: this.desks['0'].settings
      }
    },
    showMore() {
      this.recentVisible = true
    },
    setFullScreen(flag=true){
      this.fullScreen=flag
    }
  }
}
</script>

<style lang="scss" scoped>
.game-tabs {
  .game-tab {
    .icon{
      margin-top: -1px;
      vertical-align: text-top;
    }
    cursor: pointer;

    &.tab-active, &:hover {
      opacity: 1;
      font-weight: bold;
    }

    opacity: 0.5;
    line-height: 42px;
    font-size: 15px;
    min-width: 150px;
    border-radius: 4px;
    margin-right: 10px;
    text-align: left;
    padding-left: 10px;
    padding-right: 10px;
  }
  .more{
    min-width:80px
  }
  .home{
    min-width: 90px;
  }
}
</style>
