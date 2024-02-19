<template>
  <div class="flex flex-col">
    <div class="flex justify-between mb-4">
      <div class="flex items-center">
        <xt-ify-icon icon="fluent-emoji:rainbow" class="mr-3" size="16"></xt-ify-icon>
        <xt-text class="xt-font font-14">活动任务</xt-text>
      </div>
      <Exit />
    </div>
    <div class="w-full flex flex-col">
      <TaskUserInfo />
      <span class="mb-3 xt-font xt-text-2 font-14">任务列表</span>
      <Task :task="activeList" @back="back()"></Task>
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { computed,ref } from "vue"
import { taskStore } from "../../store.ts";
import { tasks } from '../branch/Branch';

import Exit from "../../components/Exit.vue";
import TaskUserInfo from "../../components/userinfo/TaskUserInfo.vue";
import Task from '../branch/Task.vue';


const back = ()=>{
  currentTask.value = null;
}

const activeList  = computed(()=>{
  const list = tasks.efficiency[0].tasks.filter((item)=>{ return String(item.id) === 'Z0201' });
  return {tasks:list};
})


</script>

<style lang="scss" scoped>

</style>