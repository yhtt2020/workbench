<template>
  <xt-menu :menus="menus" style="" v-if="store.isTask">
    {{ store.taskID }}
    <xt-button @click="store.taskID = 'M0102'"></xt-button>
    <div
      @click="store.isTaskDrawer = true"
      class="xt-bg relative s-bg h-full xt-base-btn"
      style="width: 70px; height: 70px; border-radius: 8px"
    >
      <img src="/img/task/star.png" style="width: 56px; height: 56px" alt="" />
      <div
        class="absolute text-center xt-text rounded-md left-1/2 -translate-x-1/2 flex overflow-hidden"
        style="width: 90%; bottom: 4px; height: 20px; z-index: 9999"
      >
        <div class="xt-active-bg" :style="[progress]"></div>
        <div class="flex-1 xt-bg-2"></div>
        <div
          class="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2"
          style="width: 60px; font-size: 12px"
        >
          主线 {{ width }} %
        </div>
      </div>
    </div>
  </xt-menu>

  <Task></Task>
</template>

<script setup>
import { reactive, ref, computed } from "vue";
import { taskStore } from "../store";
import { tasks } from "../config/Primary";
import Task from "./Task.vue";
const store = taskStore();

// 主线任务进展
let width = ref();

const progress = computed(() => {
  let currentCount = ref(0);
  let count = ref(0);
  let flag = ref(true);
  tasks.forEach((item) => {
    item.tasks.forEach((task) => {
      if (store.taskID == task.id) {
        flag.value = false;
      }
      if (flag.value) {
        currentCount.value++;
      }
      count.value++;
    });
  });

  let res = (currentCount.value / count.value) * 100;
  console.log("res :>> ", res);
  width.value = res;
  return {
    width: res + "%",
  };
});

const menus = reactive([
  {
    label: "关闭任务中心",
    callBack: () => {
      store.isTask = false;
    },
  },
]);
</script>

<style lang="scss" scoped>
:deep(.ant-progress-inner) {
  // border-radius: 2px !important;
}
:deep(.ant-progress-bg) {
  height: 20px !important;
}
:deep(.ant-progress-inner) {
  height: 20px;
}
</style>
