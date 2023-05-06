<template>
  <div class="flex w-full h-12 justify-between">
     <div class="left-flex flex items-center justify-center">
        <div class="w-12 h-12 flex items-center cursor-pointer btn-active justify-center rounded-lg" 
         style="background: rgba(42, 42, 42, 1);" @click="goBack">
          <Icon icon="xiangzuo" style="font-size:1.5em;"></Icon>
        </div>
        <span style="font-size:20px;font-weight: 500;" class="ml-4">{{ detailData.name }}</span>
     </div>
     <div class="right-flex flex items-center justify-center mr-3">
       <span class="rounded-lg btn-active cursor-pointer" style="padding: 13px 41px 12px 41px;background: rgba(42, 42, 42, 1);">Steam商店</span>
     </div>
  </div>
  <div class="flex justify-between items-center mr-7 mt-3">
    <div class="w-2/3 flex items-center justify-center">轮播内容</div>
    <div class="w-1/3 flex  flex-col">
      <span style="font-size: 16px; font-weight: 400;color: rgba(255, 255, 255, 0.85);">{{ detailData.short_description }}</span>
      <div class="flex justify-between items-center mt-4" >
        <span style="font-size: 16px; font-weight: 400; color: rgba(255, 255, 255, 0.6);">发行日期</span>
        <span style="font-size: 16px; font-weight: 400; color: rgba(255, 255, 255, 0.85);">{{ releaseDate }}</span>
      </div>
      <div class="flex justify-between items-center mt-4" >
        <span style="font-size: 16px; font-weight: 400; color: rgba(255, 255, 255, 0.6);">发行商</span>
        <span style="font-size: 16px; font-weight: 400; color: rgba(255, 255, 255, 0.85);">{{publishers}}</span>
      </div>
      <div class="flex justify-between items-center mt-4" >
        <span style="font-size: 16px; font-weight: 400; color: rgba(255, 255, 255, 0.6);">开发商</span>
        <span style="font-size: 16px; font-weight: 400; color: rgba(255, 255, 255, 0.85);">{{developers}}</span>
      </div>
      <div class="flex  items-center justify-between mt-4" >
        <span class="w-1/3" style="font-size: 16px; font-weight: 400; color: rgba(255, 255, 255, 0.6);">标签</span>
        <div class="flex items-center justify-center">
           <span v-for="item in detailData.genres"  class="rounded-lg mr-1" style="background: rgba(255, 255, 255, 0.4);padding: 2px 6px 1px 6px;">{{item.description}}</span>
        </div>
      </div>
      <span class="mt-4">语言</span>
      <div style="padding: 12px 13px; background: rgba(33, 33, 33, 1);" class="flex rounded-lg items-center justify-between mt-6">
         <div class="flex flex-col mt-1">
          <span>价格</span>
          <span>特价促销！4 月 24 日 截止</span>
         </div>
         <div class="flex flex-col">
            <span class="line-through" style="color:rgba(255, 255, 255, 0.4);">{{ oldPrice }}</span>
            <div>
               <span class="mr-2 rounded-lg" style="padding: 2px 4px 5px 4px;background: rgba(255, 77, 79, 1);"> -{{percent}}%</span>
               <span style="font-size: 18px;color:rgba(255, 77, 79, 1);font-weight: 500;">{{ newPrice }}</span>
            </div>
         </div>
      </div>
    </div>
  </div>
</template>

<script>
import { regionRange } from '../../js/axios/api';
export default {
    name:'GameDiscountDetail',
    props:['val'],
    data(){
      return{
        detailData:'',
        releaseDate:'',
        developers:'',
        publishers:'',
        oldPrice:'',
        newPrice:'',
        percent:''
      }
    },
    mounted(){
      this.getDetailVal()
    },
    methods:{
      goBack(){
        this.$router.go(-1)
      },
      getDetailVal(){
         if(this.val !== undefined){
          const getDetailData = JSON.parse(this.val)
          console.log(getDetailData.data);
          this.detailData = getDetailData.data
          this.oldPrice = getDetailData.oldPrice
          this.newPrice = getDetailData.newPrice
          this.percent = getDetailData.percent
          this.releaseDate = getDetailData.data.release_date.date
          this.developers = getDetailData.data.developers[0]
          this.publishers = getDetailData.data.publishers[0]
         }else{
           this.$router.push({name:'gameDiscount'}) 
         }
      }
    }
  }
</script>

<style lang="scss" scoped>
.btn-active:active{
  filter: brightness(0.8);
  background:rgba(42, 42, 42, 0.25);
} 
</style>