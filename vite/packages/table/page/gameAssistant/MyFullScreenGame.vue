<template>
  <div class="pt-3 drag">
    <vue-custom-scrollbar :settings="settingsScroller" style="height:calc(100vh)">
      <div class="flex flex-row rounded-lg flex-wrap mr-4">
        <div class="pb-4 pl-4 game-list-item rounded-lg flex-shrink-0 my-game-content" v-for=" item in gameList ">
          <div class="relative  w-auto h-full rounded-lg s-bg  pointer flex flex-col ">
            <div class="rounded-lg" :style="showTime?'height: calc(100% - 96px)':'height: calc(100% - 50px)'">
              <img v-if="item.appinfo" style="border-radius: 12px 12px 0 0" :src="'https://cdn.cloudflare.steamstatic.com/steam/apps/'+item.appinfo.appid+'/header.jpg'" class="w-full h-full rounded-t-lg object-cover"  alt="">
            </div>
            <div  :style="showTime?'height: 96px':'height: 50px'" class="p-3 flex flex-col justify-between ">
              <span class="text-more text-white text-base " style="font-weight: 400">{{item.appinfo?.common.name}}</span>
              <span :style="showTime?'':'display:none'"  class="text-xs">过去两周：{{twoWeekTime(item.time)}}小时</span>
              <span :style="showTime?'':'display:none'"  class="text-xs">总数：{{totalTime(item.time)}}小时</span>
            </div>
          </div>
        </div>
      </div>
      <div class="set-button flex no-drag">
        <div class="set-button-item s-bg mr-3 rounded-lg pointer">
         <Icon icon="bofang"></Icon>
        </div>
        <div  @click="openSheZhi" class="set-button-item s-bg mr-3 rounded-lg pointer">
          <Icon icon="shezhi"></Icon>
        </div>
        <div @click="closeFullScreen"  class="set-button-item s-bg rounded-lg pointer">
          <Icon icon="desktop"></Icon>
        </div>
     </div>
    </vue-custom-scrollbar>
  </div>

  <a-drawer v-model:visible="screenVisible" title="设置">
    <div class="flex justify-between mb-8">
      <span>显示游戏时长</span>
      <a-switch v-model:checked="showTime" />
    </div>
    <div class="mb-4">排序方式</div>
    <div class="flex flex-col">
      <div v-for="item in sortList" class="w-full h-full rounded-lg px-4 py-4 s-item flex justify-center mb-4">
        {{ item.title }}
      </div>
    </div>
  </a-drawer>
</template>

<script>
import {mapWritableState} from 'pinia'
import {steamUserStore} from "../../store/steamUser";
import HorizontalPanel from "../../components/HorizontalPanel.vue";
export default {
  name:'MyFullScreenGame',
  components:{
    HorizontalPanel
  },
  data(){
    return{
      settingsScroller: {
        useBothWheelAxes: true,
        swipeEasing: true,
        suppressScrollY: false,
        suppressScrollX: true,
        wheelPropagation: true
      },
      showTime:true,
      screenVisible:false,
      sortList:[{title:'最近游玩',name:'timer'},{title:'A-Z',name:'letter'}],
    }
  },
  computed:{
    ...mapWritableState(steamUserStore,['gameList','myGameList'])
  },
  methods:{
    closeFullScreen(){
      this.$emit('close')
    },
    twoWeekTime(time){
      return time? ( time.playtime_2weeks / 60 ).toFixed(1): 0
    },
    totalTime(time){
      return time? ( time.playtime_forever / 60 ).toFixed(1): 0
    },
    openSheZhi(){
      this.screenVisible = true
    }
   
  }
}
</script>

<style lang="scss" scoped>
.my-game-content{
  transform-style: preserve-3d;
  perspective: 1000px;
}
.fly{
  animation: fly .5s;
  animation-fill-mode: forwards;
  transform-origin: 50% 0 10px;
}
@keyframes fly {
  0% {

  }
  100% {
    transform: rotateX(5deg) translateZ(20px);
  }
}
@media screen and (max-width:1064px ){
  .main-nav{
    display: none;
  }
  .select-main-nav{
    display: block;
  }
}

.game-list-item{
  max-width: 404px;
}
.game-list-local{
  max-width: 300px;
  aspect-ratio: 231/300;
}
@media screen and (max-width: 840px){
  .game-list-item{
    width: calc(100% / 2);
  }
  .game-list-local{
    width: calc(100% / 3);
  }
}
@media screen and (min-width: 840px) and (max-width: 1140px){
  .game-list-item{
    width: calc(100% / 3);
  }
  .game-list-local{
    width: calc(100% / 4);
  }
}
@media screen and (min-width: 1140px) and (max-width: 1440px){
  .game-list-item{
    width: calc(100% / 4);
  }
  .game-list-local{
    width: calc(100% / 5);
  }
}
@media screen and (min-width: 1440px) and (max-width: 1740px){
  .game-list-item{
    width: calc(100% / 5);
  }
  .game-list-local{
    width: calc(100% / 6);
  }
}

@media screen and (min-width: 1740px) and (max-width: 2040px){
  .game-list-item{
    width: calc(100% / 6);
  }
  .game-list-local{
    width: calc(100% / 7);
  }
}
@media screen and (min-width: 2040px) and (max-width: 2340px){
  .game-list-item{
    width: calc(100% / 7);
  }
  .game-list-local{
    width: calc(100% / 8);
  }
}
@media screen and (min-width: 2340px) and (max-width: 2640px){
  .game-list-item{
    width: calc(100% / 8);
  }
  .game-list-local{
    width: calc(100% / 9);
  }
}
@media screen and (min-width: 2640px) and (max-width: 2940px){
  .game-list-item{
    width: calc(100% / 9);
  }
}
@media screen and (min-width: 2940px) and (max-width: 3240px){
  .game-list-item{
    width: calc(100% / 10);
  }
}
@media screen and (min-width: 3240px) and (max-width: 3540px){
  .game-list-item{
    width: calc(100% / 11);
  }
}
@media screen and (min-width: 3540px) and (max-width: 3840px){
  .game-list-item{
    width: calc(100% / 12);
  }
}
.set-button{
  position: fixed;
  bottom:18px;
  right: 18px;
}
.set-button-item{
  font-size: 2em;
  padding: 6px 14px;
}
</style>