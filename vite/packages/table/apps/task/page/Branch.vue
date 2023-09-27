<template>
  <template v-if="currentTask"> </template>
  <template v-else>
    <xt-title>支线任务</xt-title>
    <div class="xt-bg-2 p-3 rounded-xl">
      <xt-title type="text"
        >你可以自由选择想要了解的功能支线，完成任务即可获得对应奖励。「右键单击」任务可以选择将其「固定在左侧」，方便进行任务追踪。</xt-title
      >
    </div>
    <div
      v-for="task in tasks"
      class="flex flex-col xt-bg-2 rounded-xl mt-3 p-3"
      @click="taskClick(task)"
    >
      <xt-title m="">
        <FlagOutlined /> {{ task.chapter }}
        <template #right>1</template>
      </xt-title>
      <xt-title type="text" m="mt">
        {{ task.info }}
      </xt-title>
    </div>
  </template>
</template>

<script setup>
import { tasks } from "../config/Branch";
import { FlagOutlined } from "@ant-design/icons-vue";
console.log("tasks :>> ", tasks);
const currentTask = null;
const taskClick = (task) => {
  console.log("task :>> ", task);
};
</script>

<style lang="scss" scoped></style>
