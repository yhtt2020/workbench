<template>
  <HomeComponentSlot :sizeList="sizeList" :customData="customData" :customIndex="customIndex" :options="options" ref="gameSmallSlot" :formulaBar="gameMiddleBare">
    <div class="px-1 py-1" style="position: absolute;left: 45px;top:10px" v-if="myDetailShow === false">
      我的游戏
    </div>
    <div class="px-1 py-1" style="position: absolute;left: 45px;top:10px" v-else>
      当前游戏
    </div>
    <template v-if="customData.width === 1 && customData.height === 2">
      <div v-if="defaultGame.name === 'steam'">
        <div class="flex items-center" v-if="detailShow === false">
          <a-spin v-if="gameList.length !== gameList.length " style="margin: 0 auto;"/>
          <div class="flex flex-col mt-3" v-else>
           <div v-for="item in gameList.slice(0,2)" @click="enterMyGameDetail(item)" class="mb-4 flex flex-col s-item pointer rounded-lg">
            <div style="height:118.53px;" v-if="item.appinfo">
              <img class="rounded-t-lg" :src="`https://cdn.cloudflare.steamstatic.com/steam/apps/${item.appinfo.appid}/header.jpg`" style="width: 100%;height: 100%;object-fit: cover;" alt="">
            </div>
            <span v-if="item.appinfo" class="px-3 py-3 w-full truncate" style="max-width:207px;">{{item.appinfo.common.name}}</span>
           </div>
          </div>
        </div>
        <MySteamDetail :steamDetail="steamDetail" :size="customData" :cpuShow="CPUShow" @closeDetail="closeGame" v-else></MySteamDetail>
      </div>
      <div v-else>
        <div class="my-other mt-4" v-if="otherDetailShow === false">
          <div class="rounded-lg my-other-item pointer relative" v-for="item in otherGameList.slice(0,6)" @click="enterOtherGameDetail(item)"  style=" width: 100px; height: 100px;">
            <img :src="item.src" alt="" class="rounded-lg " style="width: 100%; height:100%; object-fit: cover;">
            <span class="small-title  truncate px-2 py-2" style="width: 100%; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px;">{{ item.title }}</span>
          </div>
        </div>
        <MyGameSmallDetail :otherGame="otherData" :size="customData"  v-else  @quitGame="closeOtherGame"></MyGameSmallDetail>
      </div>
    </template>
    <template v-else>
      <div v-if="defaultGame.name === 'steam'">
        <div class="flex items-center" v-if="detailShow === false">
          <a-spin v-if="gameList.length !== gameList.length" style="margin: 0 auto;"/>
          <div class="my-game" v-else>
            <div v-for="item in gameList.slice(0,4)" @click="enterMyGameDetail(item)"  class="mb-3 flex my-game-item flex-col s-item pointer rounded-lg">
              <div style="height:118.53px;" v-if="item.appinfo">
                <img class="rounded-t-lg" :src="`https://cdn.cloudflare.steamstatic.com/steam/apps/${item.appinfo.appid}/header.jpg`" style="width: 100%;height: 100%;object-fit: cover;" alt="">
               </div>
               <span v-if="item.appinfo" class="px-3 py-3 w-full truncate" style="max-width:207px;">{{item.appinfo.common.name}}</span>
            </div>
          </div>
        </div>
        <MySteamDetail :steamDetail="steamDetail" :size="customData"  @closeDetail="closeGame" v-else></MySteamDetail>
      </div>
      <div v-else>
        <div class="my-other-lg mt-4" v-if="otherDetailShow === false">
          <div class="rounded-lg my-other-item pointer relative" v-for="item in otherGameList" @click="enterOtherGameDetail(item)"  style=" width: 100px; height: 100px;">
            <img :src="item.src" alt="" class="rounded-lg " style="width: 100%; height:100%; object-fit: cover;">
            <span class="small-title  truncate px-2 py-2" style="width: 100%; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px;">{{ item.title }}</span>
          </div>
        </div>
        <MyGameSmallDetail :otherGame="otherData" :size="customData"  v-else  @quitGame="closeOtherGame"></MyGameSmallDetail>
      </div>
    </template>
  </HomeComponentSlot>
  <a-drawer v-model:visible="middleShow" title="设置" placement="right" width="500">
    <template #extra>
      <div class="flex justify-center items-center rounded-lg h-10 drawer-item-bg w-16  pointer" @click="saveSize">保存</div>
    </template> 
    <div class="flex flex-col">
      <HorizontalPanel :navList="steamCardSize"  class="nav-list-container mb-3" bg-color="drawer-item-select-bg" v-model:selectType="defaultSize" ></HorizontalPanel>
      <span class="mb-8" style="font-size: 16px;color: rgba(255,255,255,0.85);font-weight: 500">展示游戏</span>
      <span @click="getGameType(item)" v-for="item in showGameType" class="mb-4  text-center pointer change drawer-item-bg rounded-lg show-game-time py-3">
         {{ item.title }}
      </span>
    </div>
  </a-drawer>
</template>

<script>
import HomeComponentSlot from '../HomeComponentSlot.vue'
import HorizontalPanel from '../../HorizontalPanel.vue';
import MySteamDetail from './MySteamDetail.vue';
import MyGameSmallDetail from './MyGameSmallDetail.vue';
import { mapActions, mapWritableState } from 'pinia';
import { cardStore } from '../../../store/card';
import { steamUserStore } from '../../../store/steamUser';
import { message } from "ant-design-vue";
import _ from 'lodash-es'

export default {
  name:'MyGameSmall',
  components:{
    HomeComponentSlot,
    HorizontalPanel,
    MySteamDetail,
    MyGameSmallDetail
  },
  props:{
    customIndex: {
      type: Number,
      default: 0
    },
    customData: {
      type: Object,
      default: () => {}
    },
    confirmCCData: {
      type: Function,
      default: () => {}
    }
  }, 
  computed:{
    ...mapWritableState(steamUserStore,['gameList']),
    showSize(){
      if(this.customData && this.customData.mySize){
        return this.customData.mySize
      }
      return this.steamCardSize[0]
    },
    defaultGame(){
      if(this.customData && this.customData.name){
        return this.customData
      }
      return this.showGameType[0]
    },
  },
  data(){
    return{
      options: {
        className: 'card ',
        title: '',
        icon: 'game',
        type: 'games',
        epicShow: true
      },
      myDetailShow:false,
      middleShow:false,
      openCpu:false,
      detailShow:false,
      CPUShow:false,
      otherDetailShow:false,
      sizeList:[{title:'1x2',width:1,height:2,name:'1x2'},{title:'2x2',width:2,height:2,name:'2x2'}],
      gameMiddleBare:[ { icon: 'shezhi1', title: '设置', fn: () => {this.middleShow = true;this.$refs.gameSmallSlot.visible = false } } ],
      showGameType:[{title:'Steam游戏，按最近游玩时间顺序展示',name:'steam'},{title:'其他游戏，按最近游玩时间顺序展示(正在开发中)',name:'other'}],
      steamCardSize:[{title:'1x2',className:'',name:'1x2'}, {title:'2x2',className:'double',name:'2x2'}],
      defaultSize:{title:'1x2',className:'',name:'1x2'},
      steamDetail:{},

      otherGameList:[
        {title:'小缇娜的奇幻之地',src:'/img/test/1.png'},
        {title:'无地之主3',src:'/img/test/2.jpg'},
        {title:'FIFA 23',src:'/img/test/2.jpg'},
        {title:'艾尔登法环',src:'/img/test/2.jpg'},
        {title:'黑暗之魂3',src:'/img/test/2.jpg'},
        {title:'只狼',src:'/img/test/1.png'},
        {title:'生化危机3重制版', src:'/img/test/1.png'},
        {title:'地平线5',src:'/img/test/1.png'},
        {title:'大富翁11',src:'/img/test/2.jpg'},
        {title:'APEX',src:'/img/test/2.jpg'},
        {title:'Valorant',src:'/img/test/1.png'},
        {title:'双人成行',src:'/img/test/1.png'},
      ],
      otherData:{},
      
    }
  },
  mounted(){
    const {mySize,myShow} = this.customData
    if(mySize) this.defaultSize = {...this.mySize,...mySize}
    // if(myShow) this.CPUShow = myShow
  },
  watch:{
    'defaultSize':{
      handler(){
        this.options.className = 'card' + ' ' + this.defaultSize.className
        this.$emit('customEvent')
      },
      immediate:true,
    }
  },
  methods:{
    ...mapActions(cardStore,['insetSteamSize']),
    getGameType(item){
      this.customData.name = item.name
    },
    saveSize(){
      this.insetSteamSize(this.customIndex,{mySize:this.defaultSize})
      this.options.className = 'card' + ' ' + this.defaultSize.className
      message.success('保存成功')
      this.middleShow = false
    },
    enterMyGameDetail(item){
      this.steamDetail = item
      this.myDetailShow = true
      this.detailShow = true
      this.openCpu = true
      this.CPUShow = true
      this.options.className = 'card' + ' ' + this.steamCardSize[1].className
    },
    isOpenCpu(e){
      // this.insetSteamSize(this.customIndex,{myShow:e})
      if(!e){
        this.options.className = 'card' + ' ' + this.steamCardSize[0].className
      }else{
        this.options.className = 'card' + ' ' + this.steamCardSize[1].className
      }
    },
    closeGame(){
      this.options.className = 'card' + ' ' + this.showSize.className
      this.detailShow = false
      this.myDetailShow = false
      this.openCpu = false
    },
    enterOtherGameDetail(item){
      this.otherDetailShow = true
      this.otherData = item
    },
    closeOtherGame(){
      this.otherDetailShow = false
    }
  }
}
</script>

<style lang="scss" scoped>
:deep(.nav-list-container){
  display: flex;
  justify-content: space-between;
  .nav-item{
    width: 50% !important;
  }
}
.my-game{
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 15px;
  justify-content: center;
  align-items: center; 
  margin: 12px auto 0 auto;
}
.my-game-item{
  display: flex;
  justify-content: center;
  align-items: center; 
  margin: 0 auto;
}
.my-other{
  display: grid;
  grid-template-columns: repeat(2, 0.45fr);
  grid-gap: 24px;
  justify-content: center;
  align-items: center; 
  margin: 12px auto 0 auto;
}
.my-other-item{
  display: flex;
  width: 100px;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
}
.small-title{
  position: absolute;
  bottom: 0;
  left: 0;
  color: rgba(255, 255, 255, 0.85);
  font-size: 12px;
  font-weight: 600;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.6) 100%);
}
.my-other-lg{
  display: grid;
  grid-template-columns: repeat(4, 0.23fr);
  grid-gap: 24px;
  justify-content: center;
  align-items: center; 
  margin: 12px auto 0 auto;
}
</style>