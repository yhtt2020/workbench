<template>
  <HomeComponentSlot :customData="customData" :customIndex="customIndex" :options="options">
     <div class="px-1 py-1" style="position: absolute;left: 45px;top:10px" v-if="myDetailShow === false">
      我的游戏
     </div>
     <div class="px-1 py-1" style="position: absolute;left: 45px;top:10px" v-else>
      当前游戏
     </div>
     <div class="flex flex-col items-center change justify-center" v-if="listImage.length === 0">
      <a-empty :image="simpleImage"/>
      <span class="s-item py-3 px-12 rounded-lg pointer">导入游戏</span>
     </div>
     <div class="flex w-full items-center justify-around flex-wrap mt-4" v-else-if="myDetailShow === false">
      <div class="rounded-lg pointer relative mb-5" v-for="item in listImage" @click="enterMySmallDetail(item)"  style=" width: 100px; height: 100px;">
        <img :src="item.src" alt="" class="rounded-lg " style="width: 100%; height:100%; object-fit: cover;">
        <div class="small-title  truncate px-2 py-2" style="width: 100%; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px;">{{ item.title }}</div>
      </div>
     </div>
     <MyGameSmallDetail v-else :detailData="detailData" @quitGame="closeGameGuide"></MyGameSmallDetail>
  </HomeComponentSlot>
</template>

<script>
import HomeComponentSlot from '../HomeComponentSlot.vue'
import MyGameSmallDetail from './MyGameSmallDetail.vue'
import { Empty } from 'ant-design-vue';
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
        },
        {
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
      myDetailShow:false,
      simpleImage: Empty.PRESENTED_IMAGE_SIMPLE,
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
::v-deep .ant-empty-description{
  display: none !important;
}
.change:active {
  filter: brightness(0.8);
  background: rgba(42, 42, 42, 0.25);
}
</style>