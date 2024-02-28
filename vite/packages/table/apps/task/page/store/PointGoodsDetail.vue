<template>
  <template v-if="!scanVisible">
    <div class="flex w-full flex-col">
      <div class="flex justify-between w-full mb-4">
        <div class="flex items-center justify-center">
          <xt-button w="32" h="32" class="flex items-center justify-center mr-2" style="border-radius: 8px;" @click="backGoodPage">
            <div class="flex items-center justify-center">
             <xt-new-icon icon="fluent:chevron-left-16-regular" class="xt-text" size="24"></xt-new-icon>
            </div>
          </xt-button>
          <span class="xt-text xt-font font-16">详情</span>
        </div>
        <Exit />
      </div>
      <div class="flex grow flex-col good-container">
        <xt-scrollbar class="w-full"  :x="false" :y="true">
         <div style="width: 404px;height: 300px;">
           <PointGoodsSwiper :swiperList="getDetailData.slider_image" :height="300" :swiperClass="'rounded-xl'"/>
         </div>
         <div style="width: 404px;" class="flex flex-col ">
           <div class="p-4 flex flex-col xt-bg-2 rounded-xl my-4">
             <div class="xt-text xt-font font-16 mb-3">
               {{ getDetailData.store_name }}
             </div>
             <div class="flex w-full justify-between">
               <div class="xt-font font-18 font-900" style="color:  #FA7B14;">
                 {{ getDetailData.price_project?.item[0]?.jifen_num}}积分
               </div>
               <div class="xt-font font-14 xt-text-2" v-if="getDetailData.sales !== 0">
                  {{ getDetailData.sales }}人已兑换
               </div>
             </div>
           </div>
           <div class="xt-bg-2 rounded-xl" style="width: 404px;" v-if="getDetailData.description !== ''">
             <div v-html="getDetailData.description" class="description-content flex flex-col p-4"></div>
           </div>
         </div>
         <div class="fixed bottom-4 flex items-center justify-center" style="width: 404px;">
           <xt-button w="404" h="40" style="border-radius: 10px; background: #FA7B14 !important;" v-if=" getDetailData.stock !== 0">
             使用{{ getDetailData.price_project?.item[0]?.jifen_num }}积分兑换
           </xt-button>
           <xt-button w="404" h="40" style="border-radius: 10px;background: var(--secondary-text)  !important;" :disabled="true" v-else>
             已兑换完
           </xt-button>
         </div>
         <div style="height: 16px;"></div>
        </xt-scrollbar>
      </div>
    </div>
  </template>
  

</template>

<script setup>
import { ref,computed,watch } from 'vue';
import { storeToRefs } from 'pinia';
import { taskStore } from '../../store';

import Exit from '../../components/Exit.vue';
import PointGoodsSwiper from './PointGoodsSwiper.vue';

const emits = defineEmits(['back']);

const task = taskStore();
const { pointGoodsDetail } = storeToRefs(task);

const props = defineProps({
   id:{
    type:Number,
   }
});
const scanVisible = ref(false);


const getDetailData = computed(()=>{
  if(pointGoodsDetail.value){
    return pointGoodsDetail.value;
  }
})

// 返回
const backGoodPage = () =>{
 emits('back');
}


</script>

<style lang="scss" scoped>
@media screen and(max-height:480px) {
 .good-container{
  height: 390px !important;
 } 
}
@media screen and(min-height:481px) and (max-height:700px){
 .good-container{
  height: 550px !important;
 } 
}
@media screen and(min-height:701px) {
 .good-container{
  height: 650px !important;
 } 
}
:deep(.ps__rail-y){
 display: none !important;
}

:deep(.description-content){
  &>p{
   margin-bottom: 16px !important;
   img{
    object-fit: cover;
    border-radius: 12px;
    margin-bottom: 12px;
    max-width:372px;
   }
  }
}

</style>