<template>
  <div class="flex mt-4" v-if="cardSize.className === 'card double'">
    <div class="w-1/2 rounded-lg  relative mr-5">
       <img :src="middleDetail.src" alt="" class="rounded-lg" style="width: 100%;height: 100%;object-fit: cover;">
       <span class="middle-tag rounded-md mr-2 mt-2">正在运行</span>
       <div class="detail-name w-full flex items-center rounded-b-lg px-4 py-2" style="font-size: 18px;font-weight: 600;">
          {{ middleDetail.title }}
       </div>
    </div>
    <div class="w-1/2 flex flex-col">
       <div class="flex mb-4 justify-between">
          <span class="font-color">本次游玩</span>
          <span class="font-time">3小时</span>
       </div>
       <div class="flex  mb-4 justify-between">
        <span class="font-color">总时长</span>
        <span class="font-time">128小时</span>
       </div>
       <div class="flex  mb-4 justify-between">
        <span class="font-color">近两周</span>
        <span class="font-time">9小时</span>
       </div>
       <div class="flex  mb-4 justify-between">
        <span class="font-color">成就</span>
        <span class="font-time">12/29</span>
       </div>
       <div class="flex  mb-4 justify-between">
        <span class="font-color">Steam在线</span>
        <span class="font-time">1,343,344</span>
       </div>
       <div class="flex mb-4 justify-between">
        <span class="font-color">M站评分</span>
        <span class="font-time">9.0</span>
       </div>
       <div class="flex items-center rounded-lg pointer justify-center mb-3 px-3 py-3 s-item">
        <Icon icon="trophy" style="font-size: 1.429em;"></Icon>
        <span style="font-size: 16px; font-weight: 400;">游戏攻略</span>
       </div>
       <div @click="closeMyGameMiddleDetail" class="flex items-center  rounded-lg pointer s-item justify-center px-3 py-3" >
        <Icon icon="tuichu" style="font-size: 1.429em;"></Icon>
        <span style="font-size: 16px; font-weight: 400;">关闭游戏</span>
       </div>
    </div>
  </div>
  <div class="flex flex-col mt-4 items-center justify-center" v-else>
    <!-- <template>
      
    </template> -->
    <div class="rounded-lg " style="width: 100px; height: 100px;margin-top: 40px;">
      <img class="rounded-lg" :src="middleDetail.src" alt="" style="width: 100%;height: 100%; object-fit: cover;">
    </div>  
    <span class="mt-4" style="font-size: 18px; font-weight: 500; margin-bottom: 30px;">{{ middleDetail.title }}</span>
    <!-- 后期根据正在运行的游戏数量进行判断,目前已多个为假数据模板 -->
    <!-- <a-carousel arrows class="mt-5"  :dots="false"  :after-change="imgChang"  style="width: 144px;height: 115px;" effect="fade">
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
    </a-carousel> -->
    <!-- <span class="mt-2" style="font-size: 18px; font-weight: 500; margin-bottom: 60px;">{{detailList[carouselIndex].title}}</span> -->

    <div @click="openGameGuide" class="rounded-lg flex items-center pointer-active mb-3 s-item  pointer justify-center" style=" padding: 13px 80px;">
      <Icon icon="trophy" style="font-size: 1.429em;"></Icon>
      <span style="font-size: 16px; font-weight: 400;">游戏攻略</span>
    </div>
    <div @click="closeMyGameMiddleDetail" class="rounded-lg flex items-center pointer-active s-item  pointer justify-center" style=" padding: 13px 80px;">
      <Icon icon="tuichu" style="font-size: 1.429em;"></Icon>
      <span style="font-size: 16px; font-weight: 400;">关闭游戏</span>
    </div>
  </div>
</template>

<script>
export default {
    name:'MyGameMiddleDetail',
    props:{
      middleDetail:{
        type:Object,
        default:()=>{}
      },
      cardSize:{
        type:Object,
        default:()=>{}
      }
    },
    methods:{
      closeMyGameMiddleDetail(){
        this.$emit('close')
      },
      // 打开游戏攻略
      openGameGuide(){
        // 后期需要params:{id}进行跳转
        this.$router.push({name:'gameIntroduction'})
      }
    }
  }
</script>

<style lang="scss" scoped>
.middle-tag{
  position: absolute;
  top:0;
  right: 0;
  padding: 3px 6px;
  background: rgba(82, 196, 26, 1);
}
.font-color{
  color: rgba(255, 255, 255, 0.6);
  font-size: 16px;
  font-weight: 400;
}
.font-time{
  color: rgba(255, 255, 255, 0.85);
  font-size: 16px;
  font-weight: 600;
}
.change:active {
  filter: brightness(0.8);
  background: rgba(42, 42, 42, 0.25);
}
.detail-name{
  position: absolute;
  bottom: 0;
  left: 0;
  color: rgba(255, 255, 255, 0.85);
  font-size: 12px;
  font-weight: 600;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.6) 100%);
}
</style>