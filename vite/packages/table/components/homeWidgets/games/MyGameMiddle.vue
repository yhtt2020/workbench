<template>
  <HomeComponentSlot :customData="customData" :customIndex="customIndex" :options="options" ref="gameMiddleSlot"  :formulaBar="gameMiddleBare">
    <div class="px-1 py-1" style="position: absolute;left: 45px;top:10px" v-if="myMiddleDetailShow === false">
      我的游戏
     </div>
     <div class="px-1 py-1" style="position: absolute;left: 45px;top:10px" v-else>
      当前游戏
     </div>
     <div class="flex flex-col items-center change justify-center" v-if="testData.length === 0">
      <a-empty :image="simpleImage"/>
      <span class="s-item py-3 px-12 rounded-lg pointer">导入游戏</span>
     </div>
     <div class="mt-4 w-full my-game" v-else-if="myMiddleDetailShow === false">
      <div  v-for="item in testData" class="my-game-item pointer relative">
        <img :src="item.src" alt="" class="rounded-lg " @click="enterMiddleDetail(item)"  style="width: 100%; height:100%; object-fit: cover;">
        <div class="small-title w-full truncate px-2 py-2" style="max-width:100px; border-bottom-left-radius: 8px;border-bottom-right-radius: 8px;">{{ item.title }}</div>
      </div>
     </div>
     <MyGameMiddleDetail  :middleDetail="middleDetail"  @close="updateShow " v-else></MyGameMiddleDetail>
  </HomeComponentSlot>
  <a-drawer v-model:visible="middleShow" title="设置" placement="right" width="500">
    <div class="flex flex-col">
      <span class="mb-8" style="font-size: 16px;color: rgba(255,255,255,0.85);font-weight: 500">展示游戏</span>
      <span class="mb-4  text-center pointer change drawer-item-bg rounded-lg show-game-time py-3">全部游戏，按最近游玩时间顺序展示</span>
      <span class="mb-4  text-center pointer change drawer-item-bg rounded-lg show-game-time py-3">Steam游戏，按最近游玩时间顺序展示</span>
      <span class="mb-4  text-center pointer change drawer-item-bg rounded-lg show-game-time py-3">其他游戏，按最近游玩时间顺序展示</span>
    </div>
  </a-drawer>
</template>

<script>
import HomeComponentSlot from '../HomeComponentSlot.vue'
import MyGameMiddleDetail from './MyGameMiddleDetail.vue'
import { Empty } from 'ant-design-vue';
export default {
  name:'MyGameMiddle',
  components:{
    HomeComponentSlot,
    MyGameMiddleDetail
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
  data(){
    return{
      options: {
        className: 'card double',
        title: '',
        icon: 'game',
        type: 'games',
      },
      myMiddleDetailShow:false,
      testData:[
        {
          title:'小缇娜的奇幻之地',
          src:'/img/test/1.png'
         },
         {
          title:'无地之主3',
          src:'/img/test/2.jpg'
         },
         {
          title:'FIFA 23',
          src:'/img/test/2.jpg'
         },{
          title:'双人成行',
          src:'/img/test/1.png'
         },
         {
          title:'艾尔登法环',
          src:'/img/test/2.jpg'
         },
         {
          title:'黑暗之魂3',
          src:'/img/test/2.jpg'
         },
         {
          title:'只狼',
          src:'/img/test/1.png'
         },
         {
          title:'生化危机3重制版',
          src:'/img/test/1.png'
         },
         {
          title:'地平线5',
          src:'/img/test/1.png'
         },
         {
          title:'大富翁11',
          src:'/img/test/2.jpg'
         },
         {
          title:'APEX',
          src:'/img/test/2.jpg'
         },
         {
          title:'Valorant',
          src:'/img/test/1.png'
         },
         
      ],
      middleDetail:'',
      middleShow:false,
      simpleImage: Empty.PRESENTED_IMAGE_SIMPLE,
      gameMiddleBare:[
        {
          icon: 'shezhi1', title: '设置', fn: () => {
            this.middleShow = true;
            this.$refs.gameMiddleSlot.visible = false
          }
        }
      ]
    }
  },
  methods:{
    enterMiddleDetail(v){
      this.myMiddleDetailShow = true
      this.middleDetail = v
    },
    updateShow(v){
      this.myMiddleDetailShow = v
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
  width: 100px;
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