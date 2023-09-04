<template>
  <xt-title>主线任务</xt-title>

  <div>
    <TaskItem
      @close="close"
      :currentStage="currentStage"
      :currentTaskId="currentTaskId"
    ></TaskItem>
  </div>
</template>

<script setup>
import { tasks } from "../config/Primary";
import TaskItem from "../components/TaskItem.vue";
import { ref } from "vue";
/**
 * 处理主线任务
 */
// 这里应该是去api请求
let currentTaskId = ref("M0102");

// 取出任务
let currentStage = tasks.find((item) => {
  return item.tasks.find((task) => {
    if (currentTaskId.value == task.id) {
      return task;
    }
  });
});
console.log("currentStage :>> ", currentStage);
</script>

<style lang="scss" scoped></style>
