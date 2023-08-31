<template>
  <xt-title>主线任务</xt-title>

  <div><TaskItem @close="close" :currentStage="currentStage" :currentTaskId="currentTaskId"></TaskItem></div>
</template>

<script setup>
import { tasks } from "../config/Primary";
import TaskItem from "../components/TaskItem.vue";
import { ref } from "vue";
let currentTaskId = ref("M0101");
let currentTask;
let currentStage = tasks.find((item) => {
  return item.tasks.find((task) => {
    if (currentTaskId.value == task.id) {
      currentTask = task;
      return task;
    }
  });
});
console.log("currentStage :>> ", currentStage);
console.log("tasks1 :>> ", currentTask);
</script>

<style lang="scss" scoped></style>
