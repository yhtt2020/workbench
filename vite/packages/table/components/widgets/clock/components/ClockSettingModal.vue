<template>
 <xt-modal full v-model="clockVisible" title="时钟设置">
  <div class="flex flex-col mx-2" style="width: 500px">
   <div class="flex flex-col xt-bg-2 p-4 rounded-lg mb-4">
    <!-- 秒针开关 -->
    <div class="flex flex-col">
     <div class="flex justify-between mb-2.5">
      <span class="xt-font xt-text font-16">秒针</span>
      <a-switch v-model:checked="clockSetting.enableSecond"/>
     </div>
     <span class="xt-font xt-text-2 font-14">
      显示秒针可能会影响性能。
     </span>
    </div>
    <!-- 分割线 -->
    <div class="my-4" >
     <div class="xt-bb mx-auto"></div>
    </div>
    <!-- 背景框 -->
    <div class="flex flex-col">
     <div class="flex justify-between mb-2.5">
      <span class="xt-font xt-text font-16">背景框</span>
      <a-switch v-model:checked="clockSetting.backgroundFrame"/>
     </div>
     <span class="xt-font xt-text-2 font-14">
      显示时钟组件的背景框。
     </span>
    </div>
   </div>

   <div class="flex flex-col xt-bg-2 p-4 rounded-lg mb-4">
    <!-- 时钟样式 -->
    <div class="flex flex-col">
      <span class="xt-text  font-16">时钟样式</span> 
    </div>
    <!-- 分割线 -->
    <div class="my-4" >
     <div class="xt-bb mx-auto"></div>
    </div>
    <!-- 字体 -->
    <div class="flex flex-col">
     <span class="xt-text font-16 mb-3">字体</span>
     <xt-select :list="clockOption" v-model="clockValue.name" :zIndex="1200" style="z-index: 150 !important;"></xt-select>
    </div>
   </div>
  </div>
 </xt-modal>
</template>

<script setup>
import { ref,watch } from "vue";
import { storeToRefs } from 'pinia';
import { clockStore } from '../hooks/clockStore';

const clock = clockStore();
const { clockSetting } = storeToRefs(clock);

const clockVisible = ref(false);
const clockValue = ref(
  {
    name:'优设标题黑',
    value:"font-family: '优设标题黑' !important;"
  }
);

const clockOption = [
  {
    name:'优设标题黑',
    value:"font-family: '优设标题黑' !important;"
  },
  {
    name:'Typefesse-Pleine',
    value:"font-family: 'Typefesse-Pleine' !important;",
  },
  {
    name:'LLPixelFun-Regular',
    value:"font-family: 'LLPixelFun-Regular' !important;"
  },
  {
    name:'Ouroboros-Regular',
    value:"font-family: 'Ouroboros-Regular' !important;"
  },
  {
    name:'Pilowlava-Regular',
    value:"font-family: 'Pilowlava-Regular' !important;"
  }
]

// 开启时钟弹窗
const openClockModal = () => {
  clockVisible.value = true;
};

// watch(()=>clockSetting.value.backgroundFrame,(newVal)=>{
//   const el = document.querySelector('.content-title');
//   if(newVal){
//     el.style = 'opacity:0 !important;'
//   }
//   else{
//     el.style = 'opacity:1 !important;'
//   }
// },{deep:true,immediate:true})

defineExpose({
  openClockModal,
});
</script>

<style lang="scss" scoped>
</style>