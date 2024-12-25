<template>
  <Task v-if="store.isTaskDrawer"></Task>
  <!-- 任务中心最小窗口化 -->
  <teleport to='body' >
    <div class="fixed flex justify-between pr-3 right-1/2 pointer -translate-x-1/2 left-1/2 pl-3 pt-2 pb-2 xt-main-bg rounded-md tran" v-if="store.isTaskDrawer || !store.$state.smallMize"
    style="top:150px; width: 200px; height: 60px;"  :class="!store.$state.smallMize?'pop':''" @click="closeMiniMize" :style="!store.$state.smallMize ? {zIndex:'10100',opacity:'1'}:{zIndex:'-1',opacity:'0'}"
    >
      <div class="w-full flex items-center justify-between">
       <div class="flex items-center justify-center">
        <xt-ify-icon icon="fluent-emoji:star" size="16" class="mr-2"></xt-ify-icon>
        <span class="xt-font xt-text font-14">任务中心</span>
       </div>
       <xt-button w="32" h="32" style="border-radius:8px;" @click="closeMiniMize">
        <div class="flex items-center justify-center">
          <xt-ify-icon icon="fluent:full-screen-maximize-16-regular" size="16"></xt-ify-icon>
        </div>
       </xt-button>
      </div>
    </div>
  </teleport>
</template>

<script setup>
import { reactive, ref } from "vue";
import { taskStore } from "../store";
import Task from "./Task.vue";

const store = taskStore();


const closeMiniMize = () =>{
  store.smallMize = true;
  store.isTaskDrawer = true;
}
</script>

<style lang="scss" scoped>
.tran {
  transition: all 0.2s ease-in-out;
}


.pop {
  position: fixed;
  top: 84% !important;
  left:88% !important;
  width: 200px !important;
}

</style>
