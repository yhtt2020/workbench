<template>
  <div class="flex mt-4">
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
</template>

<script>
  export default {
    name:'MyGameMiddleDetail',
    props:{
      middleDetail:{
        type:Object,
        default:()=>{}
      }
    },
    methods:{
      closeMyGameMiddleDetail(){
        this.$emit('close',false)
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