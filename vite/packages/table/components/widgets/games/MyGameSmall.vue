<template>
  <xt-container 
    @titleHover="goRoute"
    :header="header"
    v-model:customSize="customData.customSize"
    :envLimit="['web']"  
    :sizeList="sizeList" 
    :customData="customData" 
    :customIndex="customIndex" 
    :options="options" 
    ref="gameSmallSlot" 
    :menuList="gameMiddleBare" 
    :desk="desk"
    @delete="deleteCard">
    <template v-if="showSize.width == 2 && showSize.height == 4">
      <div v-if="defaultGame.name === 'steam'" class="w-full h-full">
        <div class="flex items-center justify-center w-full h-full" v-if="detailShow === false">
      <!-- 这是什么判断 栓q -->
          <a-spin v-if="displaySteamGame.length !== displaySteamGame.length " style="margin: 0 auto;"/>
          <div class="flex flex-col " v-else>
            <XtState  v-if="displaySteamGame.length ==0"  :state="'null'" style="width: 250px;height: 352px;" bg=""></XtState>
           <div v-for="item in displaySteamGame.slice(0,2)" @click="enterMyGameDetail(item)" class="flex flex-col mb-4 rounded-lg s-item pointer">
            <div style="height:118.53px;" >
              <img class="rounded-t-lg" :src="`https://cdn.cloudflare.steamstatic.com/steam/apps/${item.appid}/header.jpg`" style="width: 100%;height: 100%;object-fit: cover;" alt="">
            </div>
            <span  class="w-full px-3 py-3 truncate" style="max-width:207px;">{{item.name}}</span>
           </div>
          </div>
        </div>
        <MySteamDetail :steamDetail="steamDetail" :size="customData" :cpuShow="CPUShow" @closeDetail="closeGame" v-else></MySteamDetail>
      </div>
      <div v-else>
        <div class="mt-4 my-other" v-if="otherDetailShow === false">
          <div class="relative rounded-lg my-other-item pointer" v-for="item in othersteamGameList.slice(0,6)" @click="enterOtherGameDetail(item)"  style=" width: 100px; height: 100px;">
            <img :src="item.src" alt="" class="rounded-lg " style="width: 100%; height:100%; object-fit: cover;">
            <span class="px-2 py-2 truncate small-title" style="width: 100%; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px;">{{ item.title }}</span>
          </div>
        </div>
        <MyGameSmallDetail :otherGame="otherData" :size="customData"  v-else  @quitGame="closeOtherGame"></MyGameSmallDetail>
      </div>
    </template>
    <template v-else>
      <div v-if="defaultGame.name === 'steam'"  class="w-full h-full">
        <div class="flex items-center justify-center w-full h-full" v-if="detailShow === false">
          <a-spin v-if="displaySteamGame.length !== displaySteamGame.length" style="margin: 0 auto;"/>
          <div class="flex flex-wrap flex-shrink-0 w-full my-game" v-else style="gap: 16px;">
            <XtState  v-if="displaySteamGame.length ==0" :state="'null'" style="width: 538px;height: 352px;" bg=""></XtState>
            <div v-for="item in displaySteamGame.slice(0,4)" @click="enterMyGameDetail(item)"  class="flex flex-col mb-3 rounded-lg my-game-item s-item pointer">
              <div style="height:118px;">
                <img class="rounded-t-lg" :src="`https://cdn.cloudflare.steamstatic.com/steam/apps/${item.appid}/header.jpg`" style="width: 100%;height: 100%;object-fit: cover;" alt="">
               </div>
               <span  class="w-full px-3 py-3 truncate" style="max-width:207px;">{{item.name}}</span>
            </div>
          </div>
        </div>
        <MySteamDetail :steamDetail="steamDetail" :size="customData"  @closeDetail="closeGame" v-else></MySteamDetail>
      </div>
      <div v-else>
        <div class="mt-4 my-other-lg" v-if="otherDetailShow === false">
          <div class="relative rounded-lg my-other-item pointer" v-for="item in otherGameList" @click="enterOtherGameDetail(item)"  style=" width: 100px; height: 100px;">
            <img :src="item.src" alt="" class="rounded-lg " style="width: 100%; height:100%; object-fit: cover;">
            <span class="px-2 py-2 truncate small-title" style="width: 100%; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px;">{{ item.title }}</span>
          </div>
        </div>
        <MyGameSmallDetail :otherGame="otherData" :size="customData"  v-else  @quitGame="closeOtherGame"></MyGameSmallDetail>
      </div>
    </template>
  </xt-container>
  <a-drawer v-model:visible="middleShow" title="设置" placement="right" width="500">
    <!-- <template #extra>
      <div class="flex items-center justify-center w-16 h-10 rounded-lg drawer-item-bg pointer" @click="saveSize">保存</div>
    </template>  -->
    <div class="flex flex-col" style="color:var(--primary-text)">
      <!-- <HorizontalPanel :navList="sizeList"  class="mb-3 nav-list-container" bg-color="drawer-item-select-bg" v-model:selectType="defaultSize" ></HorizontalPanel> -->
      <span class="mb-8" style="font-size: 16px;font-weight: 500;">展示游戏</span>
      <span   v-for="(item,index) in showGameType"  @click="getGameType(item,index)" :class="steamIndex === index ? 'active':''" class="py-3 mb-4 text-center rounded-lg pointer change s-item show-game-time" style="color:var(--primary-text);background: var(--primary-bg);">
         {{ item.title }}
      </span>
    </div>
  </a-drawer>
</template>

<script>
import Widget from '../../card/Widget.vue'
import HorizontalPanel from '../../HorizontalPanel.vue';
import MySteamDetail from './MySteamDetail.vue';
import MyGameSmallDetail from './MyGameSmallDetail.vue';
import { mapActions, mapWritableState } from 'pinia';
import { cardStore } from '../../../store/card';
import { steamUserStore } from '../../../store/steamUser';
import {isHide} from '../../../page/gameAssistant/game'
import _ from 'lodash-es'
import {Icon as newIcon} from '@iconify/vue'
export default {
  name:'MyGameSmall',
  components:{
    Widget,
    HorizontalPanel,
    MySteamDetail,
    MyGameSmallDetail,
    newIcon
  },
  mounted(){
    if(!this.customData){
      this.customData={}
    }
  },
  props:{
    customIndex: {
      type: Number,
      default: 0
    },
    customData: {
      type: Object,
      default: () => {
        return {}
      }
    },
    desk:{
      type:Object
    },
    openWay:{
      type:String,
      default:'desk'
    }
  },
  emits:['delete'],
  computed:{
    ...mapWritableState(steamUserStore,['steamGameList']),
    showSize(){
      if (this.customData.customSize) {
        let arr = this.customData.customSize.split('x')
        return {
          width: arr[0],
          height: arr[1]
        }
      }else{
        return {
          width: 2,
          height: 4
        }
      }
    },
    defaultGame(){
      if(this.customData && this.customData.name){
        return this.customData
      }
      return this.showGameType[0]
    },
    displaySteamGame(){
      return this.steamGameList.filter(game=>{
        return !isHide('steam',game.appid)
      })
    },
    header(){
      return {
        title:this.myDetailShow === true ? '游戏详情' : '我的游戏',
        ifyIcon:'mdi:steam',
        titleHover: !this.myDetailShow,
        titleHoverName:'点击打开'
      }
    },
    options(){
      return {
         customDel:this.openWay === 'nav' ? true : false
      }
    }
  },
  data(){
    return{
      myDetailShow:false,
      middleShow:false,
      openCpu:false,
      steamIndex:0,
      detailShow:false,
      CPUShow:false,
      otherDetailShow:false,
      sizeList:[{value:'2x4',name:'2x4'},{value:'4x4',name:'4x4'}],
      gameMiddleBare:[ { icon: 'shezhi1', title: '设置', fn: () => {this.middleShow = true;this.$refs.gameSmallSlot.visible = false } } ],
      showGameType:[{title:'Steam游戏，按最近游玩时间顺序展示',name:'steam'},{title:'其他游戏，按最近游玩时间顺序展示(正在开发中)',name:'other'}],
      // steamCardSize:[{title:'1x2',className:'',name:'1x2'}, {title:'2x2',className:'double',name:'2x2'}],
      // defaultSize:{title:'2x2',width:2,height:2,name:'2x2'},
      steamDetail:{},

      otherGameList:[
        {title:'小缇娜的奇幻之地',src:'/img/test/1.png'},
      ],
      otherData:{},

    }
  },
  watch:{
    'defaultSize':{
      handler(){
        // // console.log(this.defaultSize);
        // this.increaseCustomComponents(this.$parent.copiedItems[0].id,{
        //   width:this.defaultSize.width,
        //   height:this.defaultSize.height
        // })
        // this.defaultSize = this.defaultSize
        // this.$emit('customEvent')
      },
      immediate:true,
    },
    customSize(newV,oldV){
      this.customData.customSize = newV
    }
  },
  methods:{
    // ...mapActions(cardStore,['increaseCustomComponents']),
    deleteCard(){
      this.$emit('delete')
    },
    getGameType(item,index){
      this.customData.name = item.name
      this.steamIndex = index
    },
    goRoute(){
      this.$router.push({
        name:'myGame'
      })
    },
    enterMyGameDetail(item){
      this.steamDetail = item
      this.myDetailShow = true
      this.detailShow = true
    },
    closeGame(){
      this.detailShow = false
      this.myDetailShow = false
    },
    enterOtherGameDetail(item){
      this.otherDetailShow = true
      this.otherData = item
    },
    closeOtherGame(){
      this.otherDetailShow = false
    }
  },
  mounted(){
    if(this.customData.customSize === undefined ){
      this.customData.customSize = '2x4'
    }
  },
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
  // display: grid;
  // grid-template-columns: repeat(2, 1fr);
  // grid-gap: 15px;
  // justify-content: center;
  // align-items: center;
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
