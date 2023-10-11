<template>
  <Task v-if="currentTask" @back="back()" :task="currentTask" :icon="icon" />
  <template v-else>
    <xt-text class="mb-3">支线任务</xt-text>
    <div class="xt-bg-2 p-3 rounded-xl">
      <xt-title type="text"
        >你可以自由选择想要了解的功能支线，完成任务即可获得对应奖励。「右键单击」任务可以选择将其「固定在左侧」，方便进行任务追踪。</xt-title
      >
    </div>
    <xt-menu :menus="menus" v-for="task in tasks">
      <div
        class="flex flex-col xt-bg-2 rounded-xl mt-3 p-3"
        @click="taskClick(task)"
      >
        <xt-title m="">
          <div class="flex items-center">
            <xt-new-icon :icon="icon" class="mr-3"  size='20'/>
            {{ task.chapter }}
          </div>
          <template #right
            ><Progress :task="task" style="width: 68px; height: 20px"
          /></template>
        </xt-title>
        <xt-title type="text" m="mt">
          {{ task.info }}
        </xt-title>
      </div>
    </xt-menu>
  </template>
</template>

<script setup>
import { ref, reactive } from "vue";
import Task from "./Task.vue";
import Progress from "../../components/progress/index.vue";
const props = defineProps({
  tasks: {},
  icon: {},
});

const menus = reactive([
  {
    label: "固定到左侧",
    callBack: () => {
      console.log("111111111 :>> ", 111111111);
    },
  },
]);

const currentTask = ref(null);
const taskClick = (task) => {
  currentTask.value = task;
};

const back = () => {
  currentTask.value = null;
};
</script>

<style lang="scss" scoped></style>
