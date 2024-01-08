<template>
 <div class="flex flex-1 w-full h-full flex-col">
  <div class="flex justify-between  xt-bg-2 rounded-xl pt-3 pb-4 px-4 mb-4">
   <div class="w-1/2 flex flex-col">
    <div class="flex justify-between">
     <span class="xt-font xt-text-2 font-14 ">发送时间</span>
     <span class="xt-font xt-text font-14 ">2023年12月26日</span>
    </div>
    <div class="flex justify-between">
     <span class="xt-font xt-text-2 font-14 ">通知形式</span>
     <span class="xt-font xt-text font-14 ">普通通知类型</span>
    </div>
    <div class="flex justify-between">
     <span class="xt-font xt-text-2 font-14 ">有效期限</span>
     <span class="xt-font xt-text font-14 ">2024年1月26日</span>
    </div>
   </div>
   <a-divider type="vertical" style="height: 92px; margin: 0 16px; border-left: 1px solid var(--divider);" />
   <div class="w-1/2 flex flex-col">
    <div class="flex justify-between">
     <span class="xt-font xt-text-2 font-14 ">发送目标</span>
     <span class="xt-font xt-text font-14 ">天天工作台官方社群</span>
    </div>
    <div class="flex justify-between">
     <span class="xt-font xt-text-2 font-14 ">已读情况</span>
     <span class="xt-font xt-text font-14 ">28 / 200</span>
    </div>
   </div>
  </div>
  
  <div class="flex flex-col" :class="full ? 'h-5/6' : 'h-3/4' ">
   <XtScrollbar  :y="true" style="height: 100%;width: 100%;">
    <div class="mb-4 flex items-center justify-between w-full">
     <div class="flex items-center justify-start pl-4" style="width: 120px;">
      <span class="xt-font xt-text-2 font-14 ">接收人</span>
     </div>
     <div class="flex items-center justify-end" style="width: 81px;">
      <span class="xt-font xt-text-2 font-14 ">消息链接</span>
     </div>
     <div class="flex items-center justify-end pr-4" style="width: 120px;">
      <span class="xt-font xt-text-2 font-14 ">已读时间</span>
     </div>
    </div>
    <div v-for="item in mockData.list" class="xt-bg-2 rounded-lg p-4 mb-3 flex justify-between items-center">
     <div class="flex items-center">
      <a-avatar :size="32" :src="item.avatar"></a-avatar> 
      <span class="ml-4 xt-font xt-text font-14">{{ item.nick }}</span>
     </div>
     <span class="xt-font xt-text-2 font-14 w-full text-center" style="max-width: 50px;">{{ item.link }}</span>
     <span class="xt-font xt-text-2 font-14 w-full text-center"  style="max-width: 110px;">{{ item.time }}</span>
    </div>
   </XtScrollbar>
  </div>
 </div>
</template>

<script setup>
import { ref,computed } from 'vue';
import mockData from '../../../libs/mockData';

const props = defineProps({
 isFull:Boolean,
})

const full = computed(()=>{
 return props.isFull
})


</script>

<style lang="scss" scoped>
</style>