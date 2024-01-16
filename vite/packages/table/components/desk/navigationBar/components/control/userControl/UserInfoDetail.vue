<template>
 <div class="flex items-center w-full ml-4 mt-2">
  <div style="width: 100px;height: 100px;" class="p-3">
   <FrameAvatar :avatar-size="80" :frame-url="userinfo.frame" :avatar-url="userinfo.avatar"
                       class="w-full h-full object-fill" alt=""></FrameAvatar>
  </div>
  <div class="flex flex-col">
   <span class="xt-text font-16 xt-font mb-3">{{ userinfo.nickname }}</span>
   <div>456</div>
  </div>
 </div>
</template>

<script setup>

import FrameAvatar from '../../../../../avatar/FrameAvatar.vue';

const props = defineProps({
 userinfo:{
  type:Object,
  default:()=>{}
 }
})




</script>

<style lang="scss" scoped>

</style>