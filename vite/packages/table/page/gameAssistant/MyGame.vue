<template>
<div>
<div class="flex flex-row  items-center game-page-nav">
  <div class="flex flex-row" style="padding-left: 1em">
    <HorizontalPanel :navList="gameNavList" v-model:selectType="gameType"></HorizontalPanel>
    <HorizontalPanel :navList="sortList" class="ml-3 main-nav"></HorizontalPanel>
  </div>
  <div class="flex flex-row ml-3">
    <div @click="openDrawer" class="s-bg pointer h-12 w-12 rounded-lg  flex justify-center items-center"><Icon style="" icon="sousuo"></Icon></div>
    <div @click="openModal" class="s-bg pointer h-12 w-12 rounded-lg flex justify-center items-center ml-3"><Icon style="" icon="tianjia2"></Icon></div>
  </div>

</div>
<vue-custom-scrollbar :settings="settingsScroller"
                 ref="gameScroll"     style="height: calc(100vh - 15.8em);padding-right: 5px;padding-left: 1em" class="pt-3 mr-3" @scroll="scrollList($event)">
<div class="flex flex-row flex-wrap -ml-3 " v-if="gameType.name==='other'&&myGameList.length>0">
  <div class="pb-3 pl-3 game-list-item flex-shrink-0 my-game-content" v-for="(item,index) in myGameList">
    <div class="relative   rounded-lg w-auto h-full pointer "  :class="hoverIndex===index?'fly':''"  @mouseenter="mouseOn(index)" @mouseleave="mouseClose" @contextmenu="openOtherDetail(item)" @click="runGame">
      <img :src="item.src" class="w-full h-full rounded-lg object-cover"  alt="">
      <div class="game-item-title-bg w-full h-12 absolute bottom-0 flex items-center pl-3" >{{item.title}}</div>
    </div>
  </div>
</div>
<div class="flex flex-row flex-wrap -ml-3 content-game " v-else-if="gameType.name==='steam'&&steamGameList.length>0">
  <div class=" pl-3 pb-3 game-list-item-first flex-shrink-0">
    <div class="relative rounded-lg  w-auto h-full " @contextmenu="openSteamDetail(steamGameList[0])">
      <img :src="steamGameList[0].src" class="w-full h-full rounded-lg object-cover"  alt="">
      <div class="game-item-title-bg first w-full h-1/4 absolute bottom-0 flex flex-row items-center pl-3"  >
        <div v-if="!gameRun" @click="runGame" class="pointer flex justify-center items-center" style="height: 80%;background: rgba(82, 196, 26, 1);aspect-ratio: 1/1;border-radius: 10px">
          <Icon style="height: 60%;width: 60%" icon="caret-right"></Icon>
        </div>
        <div v-else @click="runGame" class="pointer flex justify-center items-center" style="height: 80%;background: rgba(250, 173, 20, 1);aspect-ratio: 1/1;border-radius: 10px">
          <Icon style="height: 60%;width: 60%" icon="tuichu"></Icon>
        </div>
        <div class="flex flex-col ml-3">
          <span>{{steamGameList[0].title}}</span>
          <div class="text-xs" style="color: rgba(255, 255, 255, 0.6);">
            <span>过去两周：12小时</span>
            <span class="ml-1">总数：133小时</span>
          </div>
        </div>
       </div>
    </div>
  </div>
<div class="pb-3 pl-3 game-list-item flex-shrink-0 my-game-content" v-for="(item,index) in filterSteamGameList">
  <div class="relative rounded-lg w-auto h-full pointer" :class="hoverIndex===index?'fly':''"  @mouseenter="mouseOn(index)" @mouseleave="mouseClose" @contextmenu="openSteamDetail(item)" @click="runGame">
    <img :src="item.src" class="w-full h-full rounded-lg object-cover"  alt="">
    <div class="game-item-title-bg w-full h-12 absolute bottom-0 flex items-center pl-3" >{{item.title}}</div>
  </div>
</div>

</div>
  <div v-else>
    none
  </div>
</vue-custom-scrollbar>
</div>
<Modal v-model:visibility="modalVisibility"  v-show="modalVisibility" animationName="b-t" :blurFlag="true">
  <div class="p-6">
      <div class="flex flex-row items-center">
        <Icon style="height: 26px;width: 26px" icon="steam"></Icon>
        <div class="flex flex-col ml-4">
          <span class="text-white">导入Steam游戏库</span>
          <span>选择你本地的Steam本地库</span>
        </div>
      </div>
    <div class="flex flex-row mt-4 mb-4">
      <div class="s-item pointer h-12 w-48 rounded-lg flex justify-center items-center">选择游戏库</div>
      <div @click="openModal" class="s-item pointer h-12 w-12 rounded-lg flex justify-center items-center ml-3"><Icon style="" icon="yiwen-xianxing"></Icon></div>
    </div>
    <div class="flex flex-row items-center">
      <Icon style="height: 26px;width: 26px" icon="game"></Icon>
      <div class="flex flex-col ml-4">
        <span class="text-white">自定义导入其他游戏</span>
        <span>手动选择游戏安装目录</span>
      </div>
    </div>
    <div class="flex flex-row mt-4">
      <div class="s-item pointer h-12 w-48 rounded-lg flex justify-center items-center">选择游戏库</div>
      <div @click="openModal" class="s-item pointer h-12 w-12 rounded-lg flex justify-center items-center ml-3"><Icon style="" icon="yiwen-xianxing"></Icon></div>
    </div>
  </div>
</Modal>
  <Modal v-model:visibility="steamShow" v-show="steamShow" animationName="bounce-in" :blurFlag="true">
    <div class="pl-6 pr-9 py-6 flex flex-row">
      <div class="w-52 h-72 relative">
        <img :src="currentSteam.src" class="w-full h-full rounded-lg object-cover" alt="">
        <div class="game-item-title-bg w-full h-12 absolute bottom-0 flex items-center pl-3" >{{currentSteam.title}}</div>
      </div>
      <div class="flex flex-col w-64 ml-5 justify-between">
        <div class="flex flex-row justify-between"><span>上次游玩</span><span class="text-white">3天前</span></div>
        <div class="flex flex-row justify-between"><span>总时长</span><span class="text-white">129小时</span></div>
        <div class="flex flex-row justify-between"><span>近两周</span><span class="text-white">1小时</span></div>
        <div class="flex flex-row justify-between"><span>成就</span><span class="text-white">12/29</span></div>
        <div class="flex flex-row justify-between"><span>Steam在线</span><span class="text-white">1111,2222,3333</span></div>
        <div class="flex flex-row justify-between"><span>M站评分</span><span class="text-white">9.0</span></div>
          <div class="flex flex-row justify-between mt-3">
            <div class="pointer s-item w-44 flex justify-center items-center rounded-lg"><Icon style=""  class="mr-2" icon="folder-open"></Icon>安装路径</div>
            <div class="pointer s-item w-10 h-10 flex justify-center items-center rounded-lg"><Icon style=""   icon="delete"></Icon></div>
          </div>
          <div  class="pointer s-item flex h-10 justify-center items-center rounded-lg"><Icon style="" class="mr-2" icon="game"></Icon>开始游戏</div>
        </div>
    </div>
  </Modal>
  <Modal v-model:visibility="otherShow" v-show="otherShow" animationName="bounce-in" :blurFlag="true">
    <div class="pt-12 pb-8 px-8">
      <div class="w-24 h-24 mx-auto">
        <img :src="currentSteam.src" class="w-full h-full rounded-lg object-cover" alt="">
      </div>
      <div class=" w-full h-12  flex items-center justify-center mt-3" >{{currentSteam.title}}</div>
      <div class="flex flex-col  justify-between">

        <div class="flex flex-row  mt-3">
          <div class="pointer s-item w-44 flex justify-center items-center rounded-lg mr-3"><Icon style=""  class="mr-2" icon="folder-open"></Icon>安装路径</div>
          <div class="pointer s-item w-10 h-10 flex justify-center items-center rounded-lg"><Icon style=""   icon="delete"></Icon></div>
        </div>
        <div  class="pointer s-item flex h-10 justify-center items-center rounded-lg mt-3"><Icon style="" class="mr-2" icon="game"></Icon>开始游戏</div>
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
      myGameList:[{src:'/img/test/2.jpg',title:'双人成行'},{src:'/img/test/2.jpg'},{src:'/img/test/2.jpg'},{src:'/img/test/2.jpg'},{src:'/img/test/2.jpg'},{src:'/img/test/2.jpg'}],
      steamGameList:[{src:'/img/test/1.png',title:'双人成行'},{src:'/img/test/1.png',title:'双人成行'},{src:'/img/test/1.png',title:'双人成行'},{src:'/img/test/1.png',title:'双人成行'},{src:'/img/test/1.png',title:'双人成行'},{src:'/img/test/1.png',title:'双人成行'},{src:'/img/test/1.png',title:'双人成行'},{src:'/img/test/1.png',title:'双人成行'},],
      modalVisibility:false,
      gameRun:false,
      steamShow:false,
      otherShow:false,
      currentSteam:{
        src:'',
        lastTime:0,
      },
      hoverIndex:-1
    }
  },
  computed:{
      filterSteamGameList(){
        return this.steamGameList.slice(1)
      }
  },
  methods:{
    scrollList(e){
      console.log(e.target.scrollTop>0&&e.target.scrollTop<13)
      if(e.target.scrollTop<13){
        this.$refs.gameScroll.$el.style.marginTop =  e.target.scrollTop + 'px'
      }else {
        this.$refs.gameScroll.$el.style.marginTop = '13px'
      }
    },
    mouseOn(e){
      this.hoverIndex = e
    },
    mouseClose(){
      this.hoverIndex = -1
    },
    openModal(){
      this.modalVisibility = true
    },
    openDrawer(){
      this.drawerVisible = true
    },
    runGame(){
      this.gameRun=!this.gameRun
    },
    openSteamDetail(item){
      this.currentSteam = item
      this.steamShow = true
    },
    openOtherDetail(item){
      this.currentSteam = item
      this.otherShow = true
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
