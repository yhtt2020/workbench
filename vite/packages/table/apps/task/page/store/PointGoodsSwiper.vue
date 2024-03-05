<template>
 <swiper :spaceBetween="30" :loop="true" :autoplay="{ delay: 2500,disableOnInteraction: false,}" 
  :pagination="{clickable:true}" :modules="modules" class="mySwiper" :navigation="true"
 >
  
  <swiper-slide v-for="imgItem in swiperList">
    <xt-preview-img :imgList="swiperList" :multiple="true" :maskClose="true"  
     :controlOption="{ controlBar: true,  closeBtn: true, arrowBtn: true,}"
     :index="index" class="w-full h-full" 
    >
      <div class="w-full cursor-pointer"  style="position: relative;" :style="{height:`${height}px`}">
       <img :src="imgItem" alt="" :class="swiperClass" style="width:100%;height:100%;object-fit: cover;">
      </div> 
    </xt-preview-img>
  </swiper-slide>
</swiper>
</template>

<script>
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Pagination,Navigation } from 'swiper';

export default {
 components:{
  Swiper,SwiperSlide,
 },
 props:{
  swiperList:{
   type:Array,
   default:()=>[]
  },
  height:{
    type:Number,
    default:140,
  },
  swiperClass:{
    type:String,
    default:'rounded-tl-xl rounded-tr-xl'
  }
 },
 data(){
  return{
   // 小圆点指示器配置
    modules:[Pagination,Navigation]
  }
 }
};
</script>

<style lang="scss" scoped>
:deep(.swiper-pagination-bullet){
  background:rgba(255, 255, 255, 1) !important;
}
:deep(.swiper-pagination){
  position: absolute !important;
  bottom: 0 !important;
}

:deep(.swiper-button-next){
  color: #ffffff !important;
}

:deep(.swiper-button-prev){
  color: #ffffff !important;
}

:deep(.swiper-button-next:after){
  font-size: 24px !important;
}
:deep(.swiper-button-prev:after){
  font-size: 24px !important;
}

</style>