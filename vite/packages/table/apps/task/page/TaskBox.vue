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
  <Task v-if="store.isTaskDrawer"></Task>
  <!-- 任务中心最小窗口化 -->
  <teleport to='body' >
    <div class="fixed flex justify-between pr-3 right-1/2 pointer -translate-x-1/2 left-1/2 pl-3 pt-2 pb-2 xt-main-bg rounded-md tran" v-if="store.isTaskDrawer || !store.$state.smallMize"
    style="top:150px; width: 200px;"  :class="!store.$state.smallMize?'pop':''" @click="closeMiniMize" :style="!store.$state.smallMize ? {zIndex:'1000',opacity:'1',}:{zIndex:'-1',opacity:'0',}"
    >
      <div class="w-full flex items-center justify-between">
       <div class="flex items-center justify-center">
        <xt-ify-icon icon="fluent-emoji:star" size="16" class="mr-2"></xt-ify-icon>
        <span class="xt-font xt-text font-14">任务中心</span>
       </div>
       <xt-button w="32" h="32" style="border-radius: 8px;" @click="closeMiniMize">
        <div class="flex items-center justify-center">
          <xt-ify-icon icon="fluent:full-screen-maximize-16-regular" size="16"></xt-ify-icon>
        </div>
       </xt-button>
      </div>
    </div>
  </teleport>
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
