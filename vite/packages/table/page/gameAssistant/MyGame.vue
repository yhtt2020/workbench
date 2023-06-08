<template>
 <div v-if="fullScreen === false">
  <div>
    <div class="flex flex-row  items-center game-page-nav">
      <div class="flex flex-row" style="padding-left: 1em">
        <HorizontalPanel :navList="gameNavList" v-model:selectType="gameType"></HorizontalPanel>
        <HorizontalPanel :navList="sortList" class="ml-3 main-nav" v-model:selectType="sortType"></HorizontalPanel>
      </div>
      <div class="flex flex-row ml-3">
        <div @click="openDrawer" class="s-bg pointer h-12 w-12 rounded-lg  flex justify-center items-center"><Icon style="" icon="sousuo"></Icon></div>
        <div @click="openModal" class="s-bg pointer h-12 w-12 rounded-lg flex justify-center items-center ml-3"><Icon style="" icon="tianjia2"></Icon></div>
        <div @click="()=>{this.settingVisible = true}" class="s-bg pointer h-12 w-12 rounded-lg flex justify-center items-center ml-3"><Icon style="" icon="shezhi"></Icon></div>
        <div @click="openScreen" class="s-bg pointer h-12 w-12 rounded-lg flex justify-center items-center ml-3">
          <Icon icon="desktop"></Icon>
        </div>
      </div>

    </div>
    <vue-custom-scrollbar :settings="settingsScroller"
                     ref="gameScroll"     style="height: calc(100vh - 15.8em);padding-right: 5px;padding-left: 1em" class="pt-3 mr-3" @scroll="scrollList($event)">
    <div class="flex flex-row flex-wrap -ml-3 " v-if="gameType.name==='other'&&myGameList.length>0">
<!--   导入的外部游戏，非steam   -->
      <div class="pb-3 pl-3 game-list-local flex-shrink-0 my-game-content" v-for="(item,index) in myGameList" >
        <div class="s-bg h-full pointer w-full rounded-lg" style="padding-top:30px" @click="openMyGame(item)" @contextmenu="openOtherDetail(item)">
          <div class="relative    mx-auto " style="height: 65px;width: 65px;" :class="hoverIndex===index?'fly':''"  @mouseenter="mouseOn(index)" @mouseleave="mouseClose"  >
            <img :src="item.icon"  class="w-full h-full rounded-lg object-cover"  alt="">
          </div>
          <div class="w-full h-12  bottom-0  mt-4 text-center text-white truncate px-3"  >{{item.name}}</div>
        </div>
      </div>
    </div>
    <div class="flex flex-row flex-wrap -ml-3 content-game " v-else-if="gameType.name==='steam'&&steamGameList.length>0">
    <!--  <div class=" pl-3 pb-3 game-list-item-first flex-shrink-0">-->
    <!--    <div class="relative rounded-lg  w-auto h-full " @contextmenu="openSteamDetail(steamGameList[0])">-->
    <!--      <img :src="'https://cdn.cloudflare.steamstatic.com/steam/apps/'+steamGameList[0].appinfo.appid+'/header.jpg'" class="w-full h-full rounded-lg object-cover"  alt="">-->
    <!--      <div class="game-item-title-bg first w-full h-1/4 absolute bottom-0 flex flex-row items-center pl-3"  >-->
    <!--        <div v-if="!gameRun" @click="runGame" class="pointer flex justify-center items-center" style="height: 80%;background: rgba(82, 196, 26, 1);aspect-ratio: 1/1;border-radius: 10px">-->
    <!--          <Icon style="height: 60%;width: 60%" icon="caret-right"></Icon>-->
    <!--        </div>-->
    <!--        <div v-else @click="runGame" class="pointer flex justify-center items-center" style="height: 80%;background: rgba(250, 173, 20, 1);aspect-ratio: 1/1;border-radius: 10px">-->
    <!--          <Icon style="height: 60%;width: 60%" icon="tuichu"></Icon>-->
    <!--        </div>-->
    <!--        <div class="flex flex-col ml-3">-->
    <!--          <span>{{steamGameList[0].appinfo.appid}}</span>-->
    <!--          <div class="text-xs" style="color: rgba(255, 255, 255, 0.6);">-->
    <!--            <span>过去两周：12小时</span>-->
    <!--            <span class="ml-1">总数：133小时</span>-->
    <!--          </div>-->
    <!--        </div>-->
    <!--       </div>-->
    <!--    </div>-->
    <!--  </div>-->
    <div class="pb-3 pl-3 game-list-item flex-shrink-0 my-game-content " v-for="(item,index) in selectSteamList">
      <div  class="relative  w-auto h-full s-bg  pointer flex flex-col " style="border-radius: 12px" :class="hoverIndex===index?'fly':''"  @mouseenter="mouseOn(index)" @mouseleave="mouseClose" @click="openSteamDetail(item)">
        <div :style="showTime?'height: calc(100% - 96px)':'height: calc(100% - 50px)'">
          <img v-if="item" style="border-radius: 12px 12px 0 0" :src="'https://cdn.cloudflare.steamstatic.com/steam/apps/'+item.appid+'/header.jpg'" class="w-full h-full  object-cover"  alt="">
        </div>

    <!--    <div class="game-item-title-bg w-full h-12 absolute bottom-0 flex items-center pl-3" >{{item.appinfo.common.name}}</div>-->
        <div  :style="showTime?'height: 96px':'height: 50px'" class="p-3 flex flex-col justify-between ">
          <span class="text-more text-white text-base " style="font-weight: 400">{{item.name}}</span>
          <span :style="showTime?'':'display:none'"  class="text-xs">过去两周：{{twoWeekTime(item.time)}}小时</span>
          <span :style="showTime?'':'display:none'"  class="text-xs">总数：{{totalTime(item.time)}}小时</span>
        </div>
      </div>

    </div>

    </div>
      <div v-else>
        <div class="text-center mt-20">
          <a-empty></a-empty>
          <a-button v-if="gameType.name==='steam'" @click="goBind" type="primary">绑定Steam账号</a-button>
          <a-button v-else @click="openModal" type="primary">导入外部游戏</a-button>
        </div>

      </div>
    </vue-custom-scrollbar>
    </div>
    <Modal v-model:visible="modalVisibility"  v-show="modalVisibility" animationName="b-t" :blurFlag="true">
      <div class="p-6" @click.stop>
    <!--      <div class="flex flex-row items-center">-->
    <!--        <Icon style="height: 26px;width: 26px" icon="steam"></Icon>-->
    <!--        <div class="flex flex-col ml-4">-->
    <!--          <span class="text-white">导入Steam游戏库</span>-->
    <!--          <span>选择你本地的Steam本地库</span>-->
    <!--        </div>-->
    <!--      </div>-->
    <!--    <div class="flex flex-row mt-4 mb-4">-->
    <!--      <div class="s-item pointer h-12 w-48 rounded-lg flex justify-center items-center">选择游戏库</div>-->
    <!--      <div @click="openModal" class="s-item pointer h-12 w-12 rounded-lg flex justify-center items-center ml-3"><Icon style="" icon="yiwen-xianxing"></Icon></div>-->
    <!--    </div>-->
        <div class="flex flex-row items-center" >
          <Icon style="height: 26px;width: 26px" icon="game"></Icon>
          <div class="flex flex-col ml-4">
            <span class="text-white" >自定义导入其他游戏</span>
            <span>手动选择游戏运行文件</span>
          </div>
        </div>
        <div class="flex flex-row mt-4">
          <div class="s-item pointer h-12 w-48 rounded-lg flex justify-center items-center"  @click.stop="openLocal">选择游戏</div>
          <div @click="openModal" class="s-item pointer h-12 w-12 rounded-lg flex justify-center items-center ml-3"><Icon style="" icon="yiwen-xianxing"></Icon></div>
        </div>
      </div>
    </Modal>
      <Modal v-model:visible="steamShow" v-show="steamShow" animationName="bounce-in" :blurFlag="true">
        <div class=" flex flex-col" style="border-radius: 12px" v-if="currentSteam">
          <div class=" relative" style="height: 188px;width: 400px" v-if="currentSteam">
            <img  :src="'https://cdn.cloudflare.steamstatic.com/steam/apps/'+currentSteam.appid+'/header.jpg'" style="border-radius: 12px 12px 0 0 " class="w-full h-full object-cover" alt="">
          </div>
          <div class="  p-4">
            <div style="user-select: text" class="text-white" >{{currentSteam.name}} {{currentSteam.appid}}</div>
            <div class="flex flex-row flex-wrap w-80">
              <div class="w-1/2 mt-3">上次游玩：{{getDateMyTime(currentSteam.time)}}</div>
              <div class="w-1/2 mt-3">总时长：{{totalTime(currentSteam.time)}}小时</div>
              <div class="w-1/2 mt-3">近两周：{{twoWeekTime(currentSteam.time)}}小时</div>
              <div class="w-1/2 mt-3">M站评分：{{currentSteam.metacritic_score||'无'}}</div>
            </div>
              <div class="flex flex-row justify-between mt-3 text-white">
                <div  class="pointer s-item flex h-10 justify-center items-center rounded-lg w-64" @click="playGame"><Icon style="" class="mr-2" icon="game"></Icon>开始游戏</div>
                <div class="pointer s-item w-10  flex justify-center items-center rounded-lg ml-4" @click="openDetail"><Icon style=""  icon="folder-open"></Icon></div>
                <div class="pointer s-item h-10 w-10 flex justify-center items-center rounded-lg ml-4" @click="deleteGame"><Icon style=""   icon="delete"></Icon></div>
            </div>
          </div>
        </div>
      </Modal>
      <Modal v-model:visible="otherShow" v-show="otherShow" animationName="bounce-in" :blurFlag="true">
<!--   外部游戏详情弹窗     -->
        <div class="pt-12 pb-8 px-8">
          <div class="w-24 h-24 mx-auto">
            <img :src="currentGame.icon" class="w-full h-full rounded-lg object-cover" alt="">
          </div>
          <div class=" w-full h-12  flex items-center justify-center mt-3" >{{currentGame.name}}</div>
          <div class="flex flex-col  justify-between">
            <div class="flex flex-row  mt-3">
              <div @click="showMyGameDir" class="pointer s-item w-44 flex justify-center items-center rounded-lg mr-3"><Icon style=""  class="mr-2" icon="folder-open"></Icon>安装路径</div>
              <div @click="deleteMyGame" class="pointer s-item w-10 h-10 flex justify-center items-center rounded-lg"><Icon  icon="delete"></Icon></div>
            </div>
            <div @click="openMyGame(currentGame)"  class="pointer s-item flex h-10 justify-center items-center rounded-lg mt-3"><Icon style="" class="mr-2" icon="game"></Icon>开始游戏</div>
          </div>
        </div>
      </Modal>
    <a-drawer :width="500"  v-model:visible="drawerVisible" placement="right">
      <template #title>
        <div class="text-center">搜索</div>
      </template>
      <a-input
        v-model:value="selectName"
        class="rounded-lg mt-6 drawer-item-bg"
        style="height: 48px"
        placeholder=""
      >
      </a-input>
    </a-drawer>
      <a-drawer :width="500"  v-model:visible="settingVisible" placement="right">
        <template #title>
          <div class="text-center">设置</div>
        </template>
        <div class="hidden select-main-nav">
          <div>排序</div>
          <HorizontalPanel :navList="sortList" class="w-80 mt-3 "   v-model:selectType="sortType"></HorizontalPanel>
        </div>
        <div class="flex justify-between items-center mt-4">
          显示游戏时长
          <a-switch v-model:checked="showTime" />
        </div>
      </a-drawer>
 </div>
 <MyFullScreenGame v-else @close="closeScreen"></MyFullScreenGame>
</template>

<script>
import HorizontalPanel from "../../components/HorizontalPanel.vue";
import Modal from '../../components/Modal.vue'
import MyFullScreenGame from './MyFullScreenGame.vue';
import {mapWritableState,mapActions} from "pinia";
import { appStore } from "../../store";
import {steamUserStore} from "../../store/steamUser";
import {getDateTime} from '../../util'
import {runExec} from '../../js/common/exec'
import {Modal as AntModal} from 'ant-design-vue'
export default {
  name: "MyGame",
  components:{
    HorizontalPanel,
    Modal,
    MyFullScreenGame
  },
  data(){
    return {
      showTime:true,
      drawerVisible:false,
      settingVisible:false,
      settingsScroller: {
        useBothWheelAxes: true,
        swipeEasing: true,
        suppressScrollY: false,
        suppressScrollX: true,
        wheelPropagation: true
      },
      selectName:'',
      gameNavList:[{title:'Steam游戏',name:'steam'},{title:'其他游戏',name:'other'}],
      gameType:{title:'Steam游戏',name:'steam'},
      sortList:[{title:'最近游玩',name:'timer'},{title:'A-Z',name:'letter'}],
      sortType:{title:'最近游玩',name:'timer'},
      steamGameList:[],
      modalVisibility:false,
      gameRun:false,
      steamShow:false,
      otherShow:false,
      currentSteam:{
        src:'',
        lastTime:0,
      },
      currentGame:{

      },
      hoverIndex:-1,
      screenShow:false,
    }
  },
  mounted() {
    this.steamGameList = this.gameList
    console.log(this.gameList[0])
    if(this.gameList.length>0) {
      if (this.gameList[0].appinfo) {
        console.log('重新格式化')
        this.setGameList(this.gameList)
      }
    }
  },
  computed:{
    ...mapWritableState(steamUserStore, ['gameList','myGameList']),
    ...mapWritableState(appStore,['fullScreen']),
    selectSteamList(){
      if(this.selectName.trim()!==''){
        this.steamGameList.filter((i) =>{
          if(i.appInfo){
            return i.name.toLowerCase().includes(this.selectName.toLowerCase())
          }else{
            return false
          }
        })
      }else
      return this.steamGameList
    }
  },
  methods:{
    ...mapActions(steamUserStore,['setGameList']),
    goBind(){
      this.$router.push({name:'gameSetting'})
    },
    openMyGame(item){
      require("electron").shell.openPath(item.path)
    },
   async openLocal(){
      let openPath = await tsbApi.dialog.showOpenDialog({
        title: "选择导入的代码",
        filters: [{ name: "全部", extensions: ["*"] }],
        properties: ["multiSelections"],
      });
      if(!openPath){
        return
      }
      console.log(openPath,'openPath')
     let dropFiles = await ipc.sendSync("getFilesIcon", {
       files: JSON.parse(JSON.stringify(openPath)),
     });
     console.log(dropFiles)
     this.modalVisibility=false
     dropFiles.forEach(game=>{
       this.myGameList.unshift(game)
     })
    },
    deleteGame(){
      runExec('uninstall '+ this.currentSteam.appid)
    },
    showMyGameDir(){
      require('electron').shell.showItemInFolder(this.currentGame.path)
    },
    deleteMyGame(){
      AntModal.confirm({
        centered:true,
        content:'是否确认删除游戏？此操作不可还原。',
        onOk:()=>{
          this.otherShow=false
          let foundIndex= this.myGameList.findIndex(li=>{
            return li===this.currentGame
          })
          this.myGameList.splice(foundIndex,1)

        }
      })

    },
    openDetail(){
      runExec('start steam://nav/games/details/' + this.currentSteam.appid)
    },
    playGame(){
      const protocol='steam://run/'+this.currentSteam.appid
      require('electron').shell.openExternal(protocol)
     // runExec('"C:\\Program Files (x86)\\Steam\\Steam.exe" -applaunch '+this.currentSteam.appinfo.appid+' +connect 1.2.3.4:27015')
    },
    getDateMyTime(time){
      if(time){
        const timer = getDateTime(new Date(parseInt(time.rtime_last_played) * 1000))
        return time.rtime_last_played !==0 ? timer.year+ '-' + timer.month+ '-' + timer.day:'0'
      }else{
        return 0
      }

    },
    twoWeekTime(time){
      return time? ( time.playtime_2weeks / 60 ).toFixed(1): 0
    },
    totalTime(time){
      return time? ( time.playtime_forever / 60 ).toFixed(1): 0
    },
    scrollList(e){
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
      console.log(item)
      this.currentGame=item
      this.otherShow=true
    },
    openScreen(){
      this.fullScreen = true
      document.querySelector('#secondPanel').style = 'display:none;'
      document.querySelector('.content-view').style = 'margin:0;padding:0;'
    },
    closeScreen(){
      this.fullScreen = false
      document.querySelector('#secondPanel').style = 'display:block;'
    }
  },
  watch:{
    'sortType':{
      handler(){
        if(this.sortType.name === 'letter'){
          this.selectSteamList.sort((a, b) => a.appinfo.common.name.localeCompare(b.appinfo.common.name));
        }else{
          this.selectSteamList.sort((a, b) => {
            if (a.time === undefined && a.time === undefined) {
              return 0;
            } else if (a.time === undefined) {
              return 1;
            } else if (b.time === undefined) {
              return -1;
            }
            else if (a.time !== b.time) {
              return b.time.rtime_last_played - a.time.rtime_last_played;
            }
          });
        }
      },
      immediate:true
    },

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
  max-width: 300px;
}
.game-list-local{
  max-width: 300px;
  max-height: 170px;
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
</style>
