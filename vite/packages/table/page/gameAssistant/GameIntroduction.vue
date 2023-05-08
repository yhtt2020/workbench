<template>
<div class="flex flex-row items-center " style="margin-left: 1em">
  <div class="flex flex-row">
  <a-select style="border: 1px solid rgba(255, 255, 255, 0.1);"
            class="w-60 h-12 rounded-lg mr-3 text-xs s-bg right-nav" size="large" :bordered="false" >
  </a-select>
  <HorizontalPanel  :navList="introductionSubList" v-model:selectType="introductionType"></HorizontalPanel>
  <a-select style="border: 1px solid rgba(255, 255, 255, 0.1);"
            class="w-60 h-12 ml-3 rounded-lg s-bg text-xs right-nav" size="large" :bordered="false" >
  </a-select>
  </div>
  <div class="flex flex-row ml-3">
    <div @click="openDrawer('search')" class="s-bg pointer h-12 w-12 rounded-lg flex justify-center items-center"><Icon style="" icon="sousuo"></Icon></div>
    <div @click="openDrawer('tip')" class="s-bg pointer h-12 w-12 rounded-lg flex justify-center items-center ml-3"><Icon style="" icon="tishi-xianxing"></Icon></div>
  </div>
</div>



  <vue-custom-scrollbar :settings="settingsScroller" style="height: calc(100vh - 15.8em);margin-left: 1em" class="mt-3 mr-3" >
    <div class="flex flex-row flex-wrap -ml-3 " v-if="introductionType.name==='video'">
    <div class="pb-3 pl-3 game-list-item flex-shrink-0" v-for="(item,index) in gameVideoList">
      <div class=" rounded-lg w-auto pointer "   style="height: 65.5%" >
        <img :src="item.img" class="w-full h-full rounded-lg object-cover"  alt="">
      </div>
      <div class="text-white " style="overflow:hidden;text-overflow:ellipsis;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;  ">{{item.title}}</div>
      <div class="flex flex-row justify-between items-center">
        <div>{{item.author}}</div>
        <div>{{item.date}}</div>
      </div>
    </div>
  </div>
  <div v-else>
    <div v-for="item in gameIntroductionList" style="width: calc(100vw - 275px)" class="s-bg  h-14 mb-3 rounded-xl nav-top-game flex flex-row items-center px-4 inline-block">
      <div class="round-dot mr-4 flex-shrink-0"></div>
      <div class="text-more inline-block">{{item.title}}</div>
      <div class="ml-auto flex-shrink-0">{{item.date}}</div>
    </div>
  </div>
  </vue-custom-scrollbar>
  <a-drawer :width="500"  v-model:visible="drawerVisible" placement="right">
    <template #title>
      <div class="text-center" v-if="drawerType==='search'">搜索</div>
      <div class="text-center" v-else>说明</div>
    </template>
    <a-input v-model:value="searchData" class="no-drag h-10 w-full" placeholder="搜索"  style="
    border-radius: 12px;background: rgba(42, 42, 42, 0.6);" v-if="drawerType==='search'">
      <template #prefix>
        <Icon icon="sousuo"></Icon>
      </template>
    </a-input>
    <div v-else class="px-14">
      <div>视频攻略数据均来自「Bilibili」，本应用不提供任何攻略数据</div>
      <div class="drawer-item-bg h-10 rounded-lg w-20 mx-auto flex justify-center items-center mt-3 pointer" @click="goBil">访问官网</div>
      <div class="mt-3">图文攻略数据均来自「游民星空」，本应用不提供任何攻略数据</div>
      <div class="drawer-item-bg h-10 rounded-lg w-20 mx-auto flex justify-center items-center mt-3 pointer" @click="goYm">访问官网</div>
    </div>
  </a-drawer>
</template>

<script>
import HorizontalPanel from '../../components/HorizontalPanel.vue'
export default {
  name: "GameIntroduction",
  components:{
    HorizontalPanel
  },
  data(){
    return {
      settingsScroller: {
        useBothWheelAxes: true,
        swipeEasing: true,
        suppressScrollY: false,
        suppressScrollX: true,
        wheelPropagation: true
      },
      drawerVisible:false,
      drawerType:'search',
      introductionType:{title:'视频攻略',name:'video'},
      searchData:'',
      introductionSubList:[{title:'视频攻略',name:'video'},{title:'图文攻略',name:'textImg'}],
      gameVideoList:[{img:'/img/test/1.png',title:'《小缇娜的奇幻之地》第4期：萌新入门篇-萌新怎么选《小缇娜的奇幻之地》第4期：萌新入门篇-萌新怎么选',author:'巍少Mr',date:'2022-3-29'},],
      gameIntroductionList:[{title:'视频攻略视频攻略视频攻略视频攻视频攻略视频攻略视频攻略视频攻略视频攻略视频攻略v略视频攻略视频攻略视频攻略视频攻略视频攻略',date:'2022-1-1'},{title:'视频攻略',date:'2022-1-1'},{title:'视频攻略',date:'2022-1-1'},{title:'视频攻略',date:'2022-1-1'},{title:'视频攻略',date:'2022-1-1'}]
    }
  },
  methods:{
    openDrawer(e){
      this.drawerType = e
      this.drawerVisible = true
    },
    goBil(){
      ipc.send('addTab',{url:'https://www.bilibili.com/'})
    },
    goYm(){
      ipc.send('addTab',{url:'https://www.gamersky.com/'})
    }
  },
  mounted() {
    for (let i = 0; i < 10; i++) {
      this.gameVideoList.push(this.gameVideoList[0])
    }
  }
}
</script>

<style scoped>
.nav-top-game{
  max-width: 1050px;
}
.game-list-item{
  aspect-ratio: 231/200;
  max-width: 340px;
}
@media screen and (max-width: 1226px){
  .right-nav{
  display: none;
  }
}
@media screen and (max-width: 940px){
  .game-list-item{
    width: calc(100% / 2);
  }
}
@media screen and (min-width: 940px) and (max-width: 1140px){
  .game-list-item{
    width: calc(100% / 3);
  }
}
@media screen and (min-width: 1140px) and (max-width: 1340px){
  .game-list-item{
    width: calc(100% / 4);
  }
}
@media screen and (min-width: 1340px)and (max-width: 1540px){
  .game-list-item{
    width: calc(100% / 5);
  }
}

@media screen and (min-width: 1540px)and (max-width: 1740px){
  .game-list-item{
    width: calc(100% / 6);
  }
}
@media screen and (min-width: 1740px)and (max-width: 1940px){
  .game-list-item{
    width: calc(100% / 7);
  }
}
@media screen and (min-width: 1940px)and (max-width: 2140px){
  .game-list-item{
    width: calc(100% / 8);
  }
}
@media screen and (min-width: 2140px)and (max-width: 2340px){
  .game-list-item{
    width: calc(100% / 9);
  }
}
@media screen and (min-width: 2340px)and (max-width: 2540px){
  .game-list-item{
    width: calc(100% / 10);
  }
}
@media screen and (min-width: 2540px)and (max-width: 2740px){
  .game-list-item{
    width: calc(100% / 11);
  }
}
@media screen and (min-width: 2740px)and (max-width: 2940px){
  .game-list-item{
    width: calc(100% / 12);
  }
}
</style>
