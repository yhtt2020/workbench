<template>
  <HomeComponentSlot :customData="customData" :customIndex="customIndex" :options="options">
    <div class="px-1 py-1" style="position: absolute;left: 45px;top:10px" v-if="myMiddleDetailShow === false">
      我的游戏
     </div>
     <div class="px-1 py-1" style="position: absolute;left: 45px;top:10px" v-else>
      当前游戏
     </div>
     <div class="flex w-full flex-wrap mt-3" v-if="myMiddleDetailShow === false">
        <div v-for="item in testData" @click="enterMiddleDetail(item)" class="rounded-lg pointer mr-3 relative mb-4" style="width: 124px;height: 106px;">
          <img :src="item.src" alt="" class="rounded-lg" style="width: 100%; height:100%; object-fit: cover;">
          <span class="small-title flex items-center justify-center p-1">{{ item.title }}</span>
        </div>
     </div>
     <MyGameMiddleDetail  :middleDetail="middleDetail"  @close="updateShow " v-else></MyGameMiddleDetail>
  </HomeComponentSlot>
</template>

<script>
import HomeComponentSlot from '../HomeComponentSlot.vue'
import MyGameMiddleDetail from './MyGameMiddleDetail.vue'
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
      middleDetail:''
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
</style>