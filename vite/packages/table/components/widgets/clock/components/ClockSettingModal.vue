<template>
 <xt-modal full v-model="clockVisible" title="时钟设置">
  <div class="flex flex-col mx-2" style="width: 500px">
   <div class="flex flex-col xt-bg-2 p-4 rounded-lg mb-4">
    <!-- 秒针开关 -->
    <div class="flex flex-col">
     <div class="flex justify-between mb-2.5">
      <span class="xt-font xt-text font-16">秒针</span>
      <a-switch />
      <!-- v-model:checked="checked" -->
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
      <a-switch />
     </div>
     <span class="xt-font xt-text-2 font-14">
      显示时钟组件的背景框。
     </span>
    </div>
   </div>

   <div class="flex flex-col xt-bg-2 p-4 rounded-lg mb-4">
    <!-- 时钟样式 -->
    <div class="flex flex-col">
      <span class="xt-text  font-16">12:23</span>
      <span class="xt-text  font-16">时钟样式</span> 
     <!-- 
      xt-typefesse-pleine
      xt-llpixelfun-Regular
      xt-ouroboros-regular
      xt-pilowlava-regular
    -->
    </div>
    <!-- 分割线 -->
    <div class="my-4" >
     <div class="xt-bb mx-auto"></div>
    </div>
    <!-- 字体 -->
    <div class="flex flex-col">
     <span class="xt-text font-16 mb-3">字体</span>
     <xt-select></xt-select>
    </div>
   </div>
  </div>
 </xt-modal>
</template>

<script setup>
import { ref } from "vue";

const clockVisible = ref(false);

// 开启时钟弹窗
const openClockModal = () => {
  clockVisible.value = true;
};

defineExpose({
  openClockModal,
});
</script>

<style lang="scss" scoped>
</style>