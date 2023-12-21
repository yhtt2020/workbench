<template>
  <xt-task id="firstTask" no="1" @cb="resetting">
    <!-- <xt-menu :menus="menus" style="" v-if="store.isTask"> -->
      <!-- <xt-button @click="store.firstTask = false"></xt-button> -->
      <!-- <div
        @click="store.isTaskDrawer = true"
        class="relative h-full xt-bg s-bg xt-base-btn"
        style="width: 80px; height: 80px; border-radius: 18px;border: 1px solid var(--divider);"
      >
        <img
          src="/img/task/star.png"
          style="width: 56px; height: 56px"
          alt=""
        />
        <div
          class="absolute flex overflow-hidden text-center -translate-x-1/2 rounded-md xt-text left-1/2"
          style="width: 60%; bottom: 4px; height: 20px; z-index: 9999"
        >
          <div class="xt-active-bg" :style="[progress]"></div>
          <div class="flex-1 xt-bg-2"></div>
          <div
            class="absolute -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2"
            style="width: 60px; font-size: 11px"
          >
            {{ width }}%
          </div>
        </div>
      </div> -->
    <!-- </xt-menu> -->
  </xt-task>
  <Task></Task>
</template>

<script setup>
import { reactive, ref, computed } from "vue";
import { taskStore } from "../store";
import { tasks } from "../page/primary/Primary";
import Task from "./Task.vue";
const store = taskStore();

/**
 * 首次引导任务
 */
// let firstTask = ref(false);
// if (!store.firstTask) {
//   store.step = 1;
//   store.taskID = "firstTask";
//   firstTask.value = true;
// }

/**
 * 回归主线任务
 */
const resetting = () => {
  store.firstTask = true;
  store.taskID = "M0101";
  store.step = -9;
  // firstTask.value = false;
};
// 主线任务进展
let width = ref();

const progress = computed(() => {
  let currentCount = ref(0);
  let count = ref(0);
  let flag = ref(true);
  tasks.forEach((item) => {
    item.tasks.forEach((task) => {
      if (task.id == "firstTask") return;
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
  width.value = Math.round(res);
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

<style lang="scss" scoped></style>
