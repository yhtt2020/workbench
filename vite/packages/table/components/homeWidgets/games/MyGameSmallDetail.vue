<template>
  <div class="flex flex-col items-center justify-center" >
    <!-- 后期根据正在运行的游戏数量进行判断,目前已多个为假数据模板 -->
    <!-- <template>
      <div class="rounded-lg " style="width: 100px; height: 100px;margin-top: 40px;">
        <img class="rounded-lg" :src="detailData.src" alt="" style="width: 100%;height: 100%; object-fit: cover;">
      </div>  
      <span class="mt-4" style="font-size: 18px; font-weight: 500; margin-bottom: 60px;">{{ detailData.title }}</span>
    </template> -->
    <a-carousel arrows class="mt-5"  :dots="false"  :after-change="imgChang"  style="width: 144px;height: 115px;" effect="fade">
      <template #prevArrow>
       <div class="custom-slick-arrow" style=" z-index: 1;left: -60px">
         <Icon icon="left-circle-fill" class="carousel-icon"></Icon>
       </div>
      </template>
      <template #nextArrow>
       <div class="custom-slick-arrow" style="right: -30px">
         <Icon icon="right-circle-fill" class="carousel-icon"></Icon>
       </div>
      </template>
      <img :src="item.src" v-for="item in detailList" class="rounded-lg" style="width:100%;height:100%;object-fit: cover;" alt="">
    </a-carousel>
    <span class="mt-2" style="font-size: 18px; font-weight: 500; margin-bottom: 60px;">{{detailList[carouselIndex].title}}</span>

    <div @click="openGameGuide" class="rounded-lg flex items-center pointer-active mb-3 s-item  pointer justify-center" style=" padding: 13px 80px;">
      <Icon icon="trophy" style="font-size: 1.429em;"></Icon>
      <span style="font-size: 16px; font-weight: 400;">游戏攻略</span>
    </div>
    <div @click="closeGame" class="rounded-lg flex items-center pointer-active s-item  pointer justify-center" style=" padding: 13px 80px;">
      <Icon icon="tuichu" style="font-size: 1.429em;"></Icon>
      <span style="font-size: 16px; font-weight: 400;">关闭游戏</span>
    </div>
  </div>
</template>

<script>
import { LeftCircleOutlined, RightCircleOutlined } from '@ant-design/icons-vue';
export default {
   name:'MyGameSmallDetail',
   props:{
    detailData:{
      type:Object,
      default:()=>[]
    }
   },
   components:{
    LeftCircleOutlined,
    RightCircleOutlined
   },
   data(){
    return{
      detailList:[
        {
          title:'FIFA 23',
          src:'/img/test/2.jpg'
        },
        {
          title:'小缇娜的奇幻之地',
          src:'/img/test/1.png'
        },
      ],
      carouselIndex:0
    }
   },
   methods:{
    // 关闭游戏
    closeGame(){
      this.$emit('quitGame',false)
    },
    imgChang(i){
     this.carouselIndex = i;
    },
    // 打开游戏攻略
    openGameGuide(){

    }
   }
}
</script>

<style lang="scss" scoped>
.pointer-active:active{
  filter: brightness(0.8);
  background:rgba(42, 42, 42, 0.25);
}

.ant-carousel :deep(.slick-slide) {
  text-align: center;
  width:100px;
  height: 100px;
  line-height: 100px;
  background: transparent;
  overflow: hidden;
}
.carousel-icon{
  width: 48px;
  height: 48px;
  opacity: 0.8;
}
.ant-carousel :deep(.slick-arrow.custom-slick-arrow) {
  width: 25px;
  height: 25px;
  font-size: 25px;

  color: #fff;
  background-color: rgba(31, 45, 61, 0.11);
  opacity: 0.3;
  z-index: 1;
}
.ant-carousel :deep(.custom-slick-arrow:before) {
  display: none;
}
.ant-carousel :deep(.custom-slick-arrow:hover) {
  opacity: 0.5;
}

.ant-carousel :deep(.slick-slide h3) {
  color: #fff;
}

.cartoon {

  animation-name: example;
  animation-duration: 4s;
  animation-iteration-count: infinite;
}

@keyframes example {
  0% {
    transform: scale(0.8) rotate3d(1, 1, 0, 0deg)
  }

  25% {
    transform: scale(0.8) rotate3d(1, 1, 0, 20deg)
  }

  50% {
    transform: scale(0.8) rotate3d(1, 1, 0, 0deg)
  }

  75% {
    transform: scale(0.8) rotate3d(-1, -1, 0, 20deg)
  }

  100% {
    transform: scale(0.8) rotate3d(1, 1, 0, 0deg)}
}
.add-button{
  position: absolute;
  bottom: 24px;
  width: 100px;
  height: 48px;
  opacity: 1;
  border-radius: 12px;
  font-size: 18px;
  background: rgba(42, 42, 42, 1);
  text-align: center;
  line-height: 48px;
}
:deep(.ant-carousel .slick-dots li) {
  width: 30px!important;

}
:deep(.ant-carousel .slick-dots li.slick-active button){
  width: 10px;
  height: 10px;
  opacity: 1;
  border-radius: 5px;
  background:  rgba(255, 255, 255, 0.4);
}
:deep(.ant-carousel .slick-dots ul){
  height: 20px;
  top: 10px;
  width: 20px!important;
}
:deep(.ant-carousel .slick-dots li button){
  width: 10px;
  height: 10px;
  opacity: 0.3;
  border-radius: 5px;
  background: rgba(255, 255, 255, 0.4);

}
:deep(.ant-carousel .slick-dots-bottom){
  width: 9px;
  left: 64px;
  bottom: -25px;
}
</style>