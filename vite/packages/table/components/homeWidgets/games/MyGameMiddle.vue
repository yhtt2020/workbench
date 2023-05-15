<template>
  <HomeComponentSlot :customData="customData" :customIndex="customIndex" :options="options">
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
      simpleImage: Empty.PRESENTED_IMAGE_SIMPLE,
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
  grid-template-columns: repeat(4, 1fr);
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