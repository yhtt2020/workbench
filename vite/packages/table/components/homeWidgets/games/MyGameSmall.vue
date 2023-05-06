<template>
  <HomeComponentSlot :customData="customData" :customIndex="customIndex" :options="options">
     <div class="px-1 py-1" style="position: absolute;left: 45px;top:10px" v-if="myDetailShow === false">
      我的游戏
     </div>
     <div class="px-1 py-1" style="position: absolute;left: 45px;top:10px" v-else>
      当前游戏
     </div>
     <div class="flex w-full items-center justify-center  flex-wrap mt-3 " style="margin-left: 2px;" v-if="myDetailShow === false">
         <div v-for="item in listImage" @click="enterMySmallDetail(item)" class="rounded-lg pointer relative mb-2" style="margin-right: 2px; width: 120px; height: 110px;">
           <img :src="item.src" alt="" class="rounded-lg" style="width: 100%; height:100%; object-fit: cover;">
           <span class="small-title flex items-center justify-center px-2 py-2" style="border-bottom-left-radius: 8px;">{{ item.title }}</span>
         </div>
     </div>
     <MyGameSmallDetail v-else :detailData="detailData" @quitGame="closeGameGuide"></MyGameSmallDetail>
  </HomeComponentSlot>
</template>

<script>
import HomeComponentSlot from '../HomeComponentSlot.vue'
import MyGameSmallDetail from './MyGameSmallDetail.vue'
export default {
  name:'MyGameSmall',
  components:{
    HomeComponentSlot,
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
  data(){
    return{
      options: {
        className: 'card',
        title: '',
        icon: 'game',
        type: 'games',
        epicShow: true
      },
      listImage:[
         {
          title:'小缇娜的奇幻之地',
          src:'/img/test/2.jpg'
         },
         {
          title:'小缇娜的奇幻之地',
          src:'/img/test/2.jpg'
         },
         {
          title:'FIFA 23',
          src:'/img/test/2.jpg'
         },{
          title:'双人成行',
          src:'/img/test/2.jpg'
         },
         {
          title:'艾尔登法环',
          src:'/img/test/2.jpg'
         },
         {
          title:'地平线5',
          src:'/img/test/2.jpg'
         }
      ],
      detailData:'',
      myDetailShow:false
    }
  },
  methods:{
    enterMySmallDetail(v){
      this.myDetailShow = true
      this.detailData = v
    },
    closeGameGuide(v){
      this.myDetailShow = v
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