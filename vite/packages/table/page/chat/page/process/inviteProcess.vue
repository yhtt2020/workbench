<template>
 <div style="height: 100vh;" class="xt-modal w-full flex flex-col items-center justify-center">
  <div style="width: 600px; height: 379px;" class="flex items-center box-border flex-col xt-b justify-center rounded-xl xt-bg-2">
   <div class="flex items-center justify-center">
    <a-avatar shape="square" src="/icons/logo128.png" :size="64"></a-avatar>
   </div>
   <div class="mt-6 my-3 xt-font xt-text-2 font-16 font-400">您已被邀请加入</div>
   <div class="xt-font xt-text font-24 font-500">想天工作台官方社群</div>
   <div class="flex items-center  mt-4 justify-center" hidden="" style="width: 480px;">
    <div class="flex items-center justify-center mr-6">
     <span class="w-2.5 h-2.5 rounded-full success-bg mr-2.5"></span>
     <span>2,874 人在线</span>
    </div>
    <div class="flex items-center justify-center">
     <span class="w-2.5 h-2.5 rounded-full mr-2.5" style="background: rgba(255, 255, 255, 0.6);"></span>
     <span>2,874 人在线</span>
    </div>
   </div>
   <xt-button w="480" type="theme" class="mt-8" @click="acceptInvite">接受邀请</xt-button>
  </div>
 </div>
</template>

<script>
export default {
 data(){
  return{
   acceptVisible:false,
  }
 },

 methods:{
  // 接受邀请
  acceptInvite(){
   this.$router.push({ name:'nextProcess' })
  }
 }
}
</script>

<style lang="scss" scoped>
.box-border{
 box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.2), 0px 0px 20px 0px rgba(0,0,0,0.1), 0px 0px 40px 0px rgba(0,0,0,0.2);
}
</style>