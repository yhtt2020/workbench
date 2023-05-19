<template>
  <HomeComponentSlot :customData="customData" :customIndex="customIndex" :options="options" ref="gameMiddleSlot"  :formulaBar="gameMiddleBare">
    <div class="px-1 py-1" style="position: absolute;left: 45px;top:10px" v-if="myMiddleDetailShow === false">
      我的游戏
     </div>
     <div class="px-1 py-1" style="position: absolute;left: 45px;top:10px" v-else>
      当前游戏
     </div>
     <template v-if="defaultGameType.name === 'steam'">
        <div class="mt-3 w-full flex justify-center" v-if="steamDetailShow === false">
          <a-spin v-if="mySteamList === undefined" style="margin: 0 auto;"/>
          <div v-else-if="defaultCardSize.className === ''">
             <div class="flex flex-col ">
                <div v-for="item in mySteamList" @click="enterSteamDetail(item)" class="mb-4 w-full flex flex-col s-item rounded-lg pointer" >
                  <div style="width:252px;height:118.53px;" class="rounded-t-lg" v-if="item.appinfo">
                    <img class="rounded-t-lg" :src="`https://cdn.cloudflare.steamstatic.com/steam/apps/${item.appinfo.appid}/header.jpg`" style="width: 100%;height: 100%;object-fit: cover;" alt="">
                  </div>
                  <span v-if="item.appinfo" class="px-3 py-3 w-full truncate" style="max-width:207px;">{{item.appinfo.common.name}}</span>
                </div>
             </div>
          </div>
          <div v-else-if="defaultCardSize.className === 'double' ">
            <a-row :gutter="[16,16]">
              <a-col :span="11.5" @click="enterSteamDetail(item)" v-for="item in mySteamList" class="flex pointer s-item flex-col rounded-lg" style="padding: 0; margin: 0 13.5px;">
                <div style="width:253px;height:119px;" class="rounded-t-lg" v-if="item.appinfo">
                  <img class="rounded-t-lg" :src="`https://cdn.cloudflare.steamstatic.com/steam/apps/${item.appinfo.appid}/header.jpg`" style="width: 100%;height: 100%;object-fit: cover;" alt="">
                </div>
                <span v-if="item.appinfo" class="px-3 py-3 w-full truncate" style="max-width:207px;">{{item.appinfo.common.name}}</span>
              </a-col>
            </a-row> 
          </div>
        </div>
        <MySteamDetail :steamDetail="steamDetailList" :cardSize="options" @closeDetail="closeGameDetail()" v-else></MySteamDetail>
     </template>
     <template v-else>
      <div class="flex flex-col items-center change justify-center" v-if="otherList.length === 0">
        <a-empty :image="simpleImage"/>
        <span class="s-item py-3 px-12 rounded-lg pointer">导入游戏</span>
       </div>
       <div class="mt-4 w-full my-game">
        <div  v-for="item in otherList" class="my-game-item pointer relative">
          <!--  @click="enterMiddleDetail(item)" -->
          <img :src="item.src" alt="" class="rounded-lg "  style="width: 100%; height:100%; object-fit: cover;">
          <div class="small-title w-full truncate px-2 py-2" style="max-width:100px; border-bottom-left-radius: 8px;border-bottom-right-radius: 8px;">{{ item.title }}</div>
        </div>
       </div>
     </template>
  </HomeComponentSlot>
  <a-drawer v-model:visible="middleShow" title="设置" placement="right" width="500">
    <div class="flex flex-col" v-if="openCpu === false">
      <HorizontalPanel :navList="steamCardSize" class="mb-2 w-full" bg-color="drawer-item-select-bg" v-model:selectType="defaultCardSize"></HorizontalPanel>
      <span class="mb-8" style="font-size: 16px;color: rgba(255,255,255,0.85);font-weight: 500">展示游戏</span>
      <span @click="getGameType(item)" v-for="item in showGameType" class="mb-4  text-center pointer change drawer-item-bg rounded-lg show-game-time py-3">
         {{ item.title }}
      </span>
    </div>
    <div class="flex justify-between" v-else>
      <span>性能显示</span>
      <a-switch v-model:checked="CPUShow" @change="isOpenCpu($event)"/>
    </div>
  </a-drawer>
</template>

<script>
import { mapWritableState } from 'pinia'
import { steamUserStore } from '../../../store/steamUser'
import HomeComponentSlot from '../HomeComponentSlot.vue'
import HorizontalPanel from '../../HorizontalPanel.vue'
import MySteamDetail from './MySteamDetail.vue'
import _ from 'lodash-es'
import { Empty } from 'ant-design-vue';


export default {
  name:'MyGameMiddle',
  components:{
    HomeComponentSlot,
    MySteamDetail,
    HorizontalPanel
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
    defaultGameType(){
      if(this.customData && this.customData.name){
        return this.customData
      }  
      return this.showGameType[0]
    },
    mySteamList(){
      try{
        if(this.defaultCardSize.className === ''){
          const result = _.chunk(this.gameList,2)[0]
          if(result){
            return result
          }
        }else{
          const result = _.chunk(this.gameList,4)[0]
          if(result){
            return result
          }
        }
      } catch(error) {
        console.log(error);
      }
    },
  },

  data(){
    return{
      options: {
        className: 'card double',
        title: '',
        icon: 'game',
        type: 'games',
      },
      myMiddleDetailShow:false,
      middleShow:false,
      openCpu:false,
      CPUShow:true,  //默认打开状态
      steamDetailShow:false,
      gameMiddleBare:[
        {
          icon: 'shezhi1', title: '设置', fn: () => {
            this.middleShow = true;
            this.$refs.gameMiddleSlot.visible = false
          }
        }
      ],
      showGameType:[
        {title:'Steam游戏，按最近游玩时间顺序展示',name:'steam'},
        {title:'其他游戏，按最近游玩时间顺序展示',name:'other'}
      ],
      // 其他游戏列表
      otherList:[
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
      steamCardSize:[{title:'1x2',className:'',name:'1x2'}, {title:'2x2',className:'double',name:'2x2'}],
      defaultCardSize:{title:'2x2',className:'double',name:'2x2'},
      steamDetailList:[],
      simpleImage: Empty.PRESENTED_IMAGE_SIMPLE,
    }
  },

  watch:{
    defaultCardSize:{
      handler(){
        this.options.className = 'card' + ' ' + this.defaultCardSize.className
        this.$emit('customEvent')
      },
      immediate:true
    }
  },

  methods:{
    // 切换游戏类型展示
    getGameType(item){
      this.customData.name = item.name,
      this.middleShow = false
    },
    // 进入steam类型详情
    enterSteamDetail(item){
      this.steamDetailShow = true
      this.myMiddleDetailShow = true
      this.openCpu = true
      this.steamDetailList = item
    },
    // 是否显示CPU
    isOpenCpu(e){
      if(!e){
        this.options.className = 'card' + ' ' + this.steamCardSize[0].className
        this.$emit('customEvent')
      }else{
        this.options.className = 'card' + ' ' + this.steamCardSize[1].className
        this.$emit('customEvent')
      }
    },
    // 模拟游戏关闭状态
    closeGameDetail(){
      if(this.defaultCardSize.className === 'double' || this.defaultCardSize.className === ''){
        this.openCpu = false
        this.steamDetailShow = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.small-title{
  position: absolute;
  bottom: 0;
  left: 0;
  color: rgba(255, 255, 255, 0.85);
  font-size: 12px;
  font-weight: 600;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.6) 100%);
}

.my-game{
  display: grid;
  grid-template-columns: repeat(4, 0.225fr);
  grid-gap: 20px;
  justify-content: center;
  align-items: center;
}
.my-game-item{
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin:  0  auto;
}
::v-deep .ant-empty-description{
  display: none !important;
}
.change:active {
  filter: brightness(0.8);
  background: rgba(42, 42, 42, 0.25);
}

</style>