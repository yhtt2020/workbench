<template>
  <xt-menu :menus="menus" v-if="task.isTask">
    <div
      @click="task.isTaskDrawer = true"
      class="xt-bg relative s-bg xt-base-btn"
      style="width: 70px; height: 70px; border-radius: 8px"
    >
      <img src="/img/task/star.png" style="width: 56px; height: 56px" alt="" />
      <div
        class="absolute text-center xt-text rounded-md left-1/2 -translate-x-1/2 flex overflow-hidden"
        style="width: 90%; height: 20px; bottom: 4px"
      >
        <div class="xt-active-bg" style="width: 100%"></div>
        <div class="flex-1 xt-bg-2"></div>
        <div
          class="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2"
          style="width: 60px; font-size: 12px"
        >
          主线 99%
        </div>
      </div>
    </div>
  </xt-menu>

  <Task></Task>
</template>

<script setup>
import { reactive, ref } from "vue";
import { taskStore } from "../store";
import Task from "./Task.vue";
const task = taskStore();

const closeTaskBox = () => {
  task.isTask = false;
};
const menus = reactive([
  {
    label: "关闭任务中心",
    callBack: closeTaskBox,
  },
]);
</script>

<style lang="scss" scoped></style>
