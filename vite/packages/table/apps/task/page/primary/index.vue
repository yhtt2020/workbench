<template>
  <div class="h-full w-full flex flex-col">
    <template v-if="!temporaryStatus">
     <xt-option-tab
      v-model="currentTab"
      style="width: 248px; height: 32px"
      :list="list"
      class="xt-bg-t-2 p-1 h-8 mx-auto"
     />
     <Exit class="absolute" style="top: 12px; right: 12px" />
     <xt-scrollbar class="h-full w-full" :x="false" :y="true">
      <Primary v-if="currentTab == 'Primary'" />
      <Complete v-else />
     </xt-scrollbar> 
    </template>

    <template v-else>
      <div class="flex flex-col">
        <div class="w-full flex items-center justify-end mb-4">
         <Exit  />
        </div>
        <div class="w-full flex flex-col xt-bg-2 p-4 rounded-md">
          <div class="flex w-full">
            <xt-new-icon icon="fluent:lock-open-16-regular" size="20" class="mr-2"></xt-new-icon>
            <span class="font-16 xt-font xt-text">已解锁支线任务</span>
          </div>
          <div class="xt-text-2 xt-font font-14 my-2">
            完成支线任务，了解更多关于工作台的使用技巧，还可以获得更多丰厚奖励。
          </div>
          <div class="flex justify-start items-center">
            <xt-button h="40" style="width: auto !important;" @click="enterBranch">
              <div class="flex items-center justify-center">
               <xt-new-icon icon="fluent:chevron-left-16-regular" size="20" :color="'var(--active-bg)'"></xt-new-icon>
               <span class="xt-theme-text xt-font">详情导航栏</span>
              </div>
            </xt-button>
          </div>
        </div> 
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from "vue";
import { storeToRefs } from 'pinia';
import { taskStore } from '../../store';

import Primary from "./Primary.vue";
import Complete from "./Complete.vue";
import Exit from "../../components/Exit.vue";

const currentTab = ref("Primary");
const task = taskStore();
const { temporaryStatus } = storeToRefs(task); 

const list = ref([
  {
    name: "主线任务",
    value: "Primary",
  },
  {
    name: "已完成",
    value: "Complete",
  },
]);

// 进入支线任务
const enterBranch = () =>{
  temporaryStatus.value  = false;
}

</script>

<style lang="scss" scoped>
:deep(.ps__rail-y){
  display: none !important;
}
</style>
