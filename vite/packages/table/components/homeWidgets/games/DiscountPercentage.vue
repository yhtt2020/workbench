<template>
  <HomeComponentSlot :customIndex="customIndex" :options="options">
    <div class="w-full  cursor-pointer"  v-for="imgItem in discountList" style="height:94px;margin-bottom:0.5em;margin-top: 0.65em;position: relative;">
       <img :src="imgItem.banner_image" alt="" class="rounded-lg" style="width:100%;height:100%;object-fit: cover;">
       <div class="right-top w-14 text-center bg-black bg-opacity-70" style="border-top-left-radius: 8px;border-bottom-right-radius: 8px;">-{{imgItem.proportion}}%</div>
    </div>
    <div class=" flex rounded-md cursor-pointer" @click="discountChange" style="padding:13px 80px;background: #1f1f1f">
      <Icon icon="reload" class="animate-spin" style="font-size: 1.429em;" v-if="reloadShow === true"></Icon>
      <Icon icon="reload" style="font-size: 1.429em;" v-else></Icon>
      <span style="margin-left: 1em;">换一换</span>
     </div>
 </HomeComponentSlot>
</template>

<script>
import HomeComponentSlot from "../HomeComponentSlot.vue";
import {requestData,randomData} from '../../../js/axios/api'
import { mapWritableState,mapActions ,mapState} from 'pinia'
import {steamStore} from '../../../store/steam'
export default {
  name:'DiscountPercentage',
  props:{
    customIndex:{
      type:Number,
      default:0
    }
  },
  components:{
    HomeComponentSlot
  },
  data(){
    return{
      options:{
        className:'card',
        title:'Steam折扣推荐',
        icon:'steam',
        type:'games'
      },
      discountList:[],
      reloadShow:false
    }
  },
  computed:{
    ...mapWritableState(steamStore,['gameData'])
  },
  mounted(){
    this.getPercentage()
  },
  methods:{
    getPercentage(){
       const randomApp = randomData(this.gameData,2)
       
    },
    // 进入详情页
    goToGameDetails(id){
  
    },
    // 按钮点击切换
    discountChange(){
      this.reloadShow = true
      setTimeout(()=>{
        this.getPercentage()
        this.reloadShow = false
      },2000)
    }
  }
}
</script>

<style lang="scss" scoped>
.right-top{
  position: absolute;
  top: 0;
  left: 0;

}
</style>
