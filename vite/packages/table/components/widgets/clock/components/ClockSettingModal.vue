<template>
 <xt-modal full v-model="clockVisible" title="时钟设置">
  <div class="flex flex-col h-full mx-2" style="width: 500px">
   <!-- 背景框 -->
   <div class="flex flex-col xt-bg-2 p-4 rounded-lg mb-4">
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

   <div class="flex flex-col xt-bg-2 p-4 rounded-lg mb-4 " >
    <div class="flex flex-col">
      <span class="xt-text mb-3 font-16">时钟样式</span> 
      <xt-option-tab  v-model="clockSetting.currentStatus" :list="clockStyle" circle class="mb-4"  style="height: 40px;" />
    </div>
    <div class="my-4" v-if="clockSetting.currentStatus === 'font'">
      <div class="xt-bb mx-auto"></div>
    </div>
    <template v-if="clockSetting.currentStatus === 'font'">
      <div class="flex flex-col">
        <span class="xt-text font-16 mb-3">字体</span>
        <xt-select :list="clockOption" v-model="clockSetting.font" :zIndex="1200" style="z-index: 150 !important;"></xt-select>
      </div>
      <div class="my-4" >
        <div class="xt-bb mx-auto"></div>
      </div>
      <div class="flex flex-col">
        <div class="flex justify-between mb-2.5">
         <span class="xt-font xt-text font-16">秒针</span>
         <a-switch v-model:checked="clockSetting.enableSecond"/>
        </div>
        <span class="xt-font xt-text-2 font-14">
         显示秒针可能会影响性能。
        </span>
      </div>
    </template>

    <template v-else>
      <div class="grow" style="height: 400px;">
        <xt-scrollbar  :y="true" style="height: 100%;">
          <ClockStyle @updateClockStyle="updateClock"/>
        </xt-scrollbar>
      </div>
    </template>

   </div>
  </div>
 </xt-modal>
</template>

<script setup>
import { ref,watch } from "vue";
import { storeToRefs } from 'pinia';
import { clockStore } from '../hooks/clockStore';

import ClockStyle from "../clockState/ClockStyle.vue";

const emits = defineEmits(['updateClockStyle']);

const clock = clockStore();
const { clockSetting } = storeToRefs(clock);

const clockVisible = ref(false);
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
const clockStyle=[
  { name:"自定义字体",value:"font" },
  { name:"其他样式",value:"style" }
]

// 开启时钟弹窗
const openClockModal = () => {
  clockVisible.value = true;
};

const updateClock = (e) =>{
  emits('updateClockStyle',e)
}

defineExpose({
  openClockModal,
});
</script>

<style lang="scss" scoped>
</style>