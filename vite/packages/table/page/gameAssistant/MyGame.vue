<template>
  <div>
  <div class="flex flex-row  items-center game-page-nav">
    <div class="flex flex-row">
      <HorizontalPanel :navList="gameNavList" v-model:selectType="gameType"></HorizontalPanel>
      <HorizontalPanel :navList="sortList" class="ml-3 main-nav"></HorizontalPanel>
    </div>
    <div class="flex flex-row ml-3">
      <div @click="openDrawer" class="s-bg pointer h-12 w-12 rounded-xl flex justify-center items-center"><Icon style="" icon="sousuo"></Icon></div>
      <div @click="openModal" class="s-bg pointer h-12 w-12 rounded-xl flex justify-center items-center ml-3"><Icon style="" icon="tianjia2"></Icon></div>
    </div>

  </div>
  <vue-custom-scrollbar :settings="settingsScroller"
                        style="height: calc(100vh - 15.8em)" class="mt-3 mr-3">
  <div class="flex flex-row flex-wrap" v-if="gameType.name==='other'&&myGameList.length>0">
    <div class="pb-3 pl-3 game-list-item flex-shrink-0" v-for="item in myGameList">
      <div class="   s-bg rounded-xl w-auto h-full ">
        <img :src="item.src" class="w-full h-full rounded-xl" style="object-fit: cover" alt="">
        <div class="game-item-title-bg w-full h-12 absolute bottom-0 flex items-center pl-3" >{{item.title}}</div>
      </div>
    </div>
  </div>
  <div class="flex flex-row flex-wrap -ml-3 content-game" v-else-if="gameType.name==='steam'&&steamGameList.length>0">
    <div class=" pl-3 pb-3 game-list-item-first flex-shrink-0 ">
      <div class="relative rounded-xl  w-auto h-full " >
        <img :src="steamGameList[0].src" class="w-full h-full rounded-xl" style="object-fit: cover" alt="">
      </div>
    </div>
  <div class="pb-3 pl-3 game-list-item flex-shrink-0" v-for="item in filterSteamGameList">
    <div class="relative rounded-xl w-auto h-full ">
      <img :src="item.src" class="w-full h-full rounded-xl" style="object-fit: cover" alt="">
      <div class="game-item-title-bg w-full h-12 absolute bottom-0 flex items-center pl-3" >{{item.title}}</div>
    </div>
  </div>

  </div>
    <div v-else>
      none
    </div>
  </vue-custom-scrollbar>
  </div>
  <Modal v-model:visibility="modalVisibility" v-show="modalVisibility">
    <div class="p-6">
        <div class="flex flex-row items-center">
          <Icon style="height: 26px;width: 26px" icon="steam"></Icon>
          <div class="flex flex-col ml-4">
            <span class="text-white">导入Steam游戏库</span>
            <span>选择你本地的Steam本地库</span>
          </div>
        </div>
      <div class="flex flex-row mt-4 mb-4">
        <div class="s-item pointer h-12 w-48 rounded-xl flex justify-center items-center">选择游戏库</div>
        <div @click="openModal" class="s-item pointer h-12 w-12 rounded-xl flex justify-center items-center ml-3"><Icon style="" icon="yiwen-xianxing"></Icon></div>
      </div>
      <div class="flex flex-row items-center">
        <Icon style="height: 26px;width: 26px" icon="game"></Icon>
        <div class="flex flex-col ml-4">
          <span class="text-white">自定义导入其他游戏</span>
          <span>手动选择游戏安装目录</span>
        </div>
      </div>
      <div class="flex flex-row mt-4">
        <div class="s-item pointer h-12 w-48 rounded-xl flex justify-center items-center">选择游戏库</div>
        <div @click="openModal" class="s-item pointer h-12 w-12 rounded-xl flex justify-center items-center ml-3"><Icon style="" icon="yiwen-xianxing"></Icon></div>
      </div>
    </div>
  </Modal>
  <a-drawer :width="500"  v-model:visible="drawerVisible" placement="right">
    <template #title>
      <div class="text-center">搜索</div>
    </template>
    <div class="hidden select-main-nav">
      <div>排序</div>
      <HorizontalPanel :navList="sortList" class="w-80 mt-3"></HorizontalPanel>
    </div>
  </a-drawer>
</template>

<script>
import HorizontalPanel from "../../components/HorizontalPanel.vue";
import Modal from '../../components/Modal.vue'
export default {
  name: "MyGame",
  components:{
    HorizontalPanel,
    Modal
  },
  data(){
    return {
      drawerVisible:false,
      settingsScroller: {
        useBothWheelAxes: true,
        swipeEasing: true,
        suppressScrollY: false,
        suppressScrollX: true,
        wheelPropagation: true
      },
      gameNavList:[{title:'Steam游戏',name:'steam'},{title:'其他游戏',name:'other'}],
      gameType:{title:'Steam游戏',name:'steam'},
      sortList:[{title:'最近游玩'},{title:'A-Z'}],
      myGameList:[{src:'/img/test/2.jpg'},{src:'/img/test/2.jpg'},{src:'/img/test/2.jpg'},{src:'/img/test/2.jpg'},{src:'/img/test/2.jpg'},{src:'/img/test/2.jpg'}],
      steamGameList:[{src:'/img/test/1.png',title:'双人成行'},{src:'/img/test/1.png',title:'双人成行'},{src:'/img/test/1.png',title:'双人成行'},{src:'/img/test/1.png',title:'双人成行'},{src:'/img/test/1.png',title:'双人成行'},{src:'/img/test/1.png',title:'双人成行'},{src:'/img/test/1.png',title:'双人成行'},{src:'/img/test/1.png',title:'双人成行'},],
      modalVisibility:false
    }
  },
  computed:{
      filterSteamGameList(){
        return this.steamGameList.slice(1)
      }
  },
  methods:{
    openModal(){
      this.modalVisibility = true
    },
    openDrawer(){
      this.drawerVisible = true
    }
  }
}
</script>

<style scoped>
@media screen and (max-width:1064px ){
  .main-nav{
    display: none;
  }
  .select-main-nav{
    display: block;
  }
}
.game-list-item-first{
  aspect-ratio: 478/300;
  max-width: calc(462px);
}
.game-list-item{
  aspect-ratio: 231/300;
  max-width: 231px;
}
@media screen and (max-width: 940px){
  .game-list-item-first{
    width: calc(66.66%);
  }
  .game-list-item{
    width: calc(33.33%);
  }
}
@media screen and (min-width: 940px) and (max-width: 1140px){
  .game-list-item-first{
    width: calc(50%);
  }
  .game-list-item{
    width: calc(25%);
  }
}
@media screen and (min-width: 1140px) and (max-width: 1340px){
  .game-list-item-first{
    width: calc(40%);
  }
  .game-list-item{
    width: calc(20%);
  }
}
@media screen and (min-width: 1340px)and (max-width: 1540px){
  .game-list-item-first{
    width: calc(33.33%);
  }
  .game-list-item{
    width: calc(16.66%);
  }
}

@media screen and (min-width: 1540px)and (max-width: 1740px){
  .game-list-item-first{
    width: calc(28.57%);
  }
  .game-list-item{
    width: calc(14.28%);
  }
}
@media screen and (min-width: 1740px)and (max-width: 1940px){
  .game-list-item-first{
    width: calc(25%);
  }
  .game-list-item{
    width: calc(12.5%);
  }
}
@media screen and (min-width: 1940px)and (max-width: 2140px){
  .game-list-item-first{
    width: calc(22.22%);
  }
  .game-list-item{
    width: calc(11.11%);
  }
}
@media screen and (min-width: 2140px)and (max-width: 2340px){
  .game-list-item-first{
    width: calc(20%);
  }
  .game-list-item{
    width: calc(10%);
  }
}
@media screen and (min-width: 2340px)and (max-width: 2540px){
  .game-list-item-first{
    width: calc(18.18%);
  }
  .game-list-item{
    width: calc(9.09%);
  }
}
@media screen and (min-width: 2540px)and (max-width: 2740px){
  .game-list-item-first{
    width: calc(16.66%);
  }
  .game-list-item{
    width: calc(8.33%);
  }
}
@media screen and (min-width: 2740px)and (max-width: 2940px){
  .game-list-item-first{
    width: calc(15.38%);
  }
  .game-list-item{
    width: calc(7.69%);
  }
}
</style>
