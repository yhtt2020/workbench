<template>
  <div class="xt-bg-2 rounded-xl p-3">
    <xt-title m="">
      <div class="flex items-center">
        <StarFilled
          aria-label="1"
          style="
            font-size: 12px;
            background: #ff4d4f;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            margin-right: 8px;
          "
        />
        {{ currentStage.chapter }}
      </div>
      <template #right>{{ stage }} / {{ currentStage.tasks.length }} </template>
    </xt-title>
    <div class="my-1">
      <a-progress :percent="progress" :show-info="false" />
    </div>
    <xt-title type="text" m=""> 当前阶段可以获得的奖励 </xt-title>
  </div>

  <xt-title>正在进行</xt-title>

  <div class="xt-bg-2 rounded-xl p-3">
    <xt-title m="">{{ currentTask.title }}</xt-title>
    <xt-title type="text">{{ currentTask.intro }}</xt-title>
    <xt-title m="">任务说明</xt-title>
    <xt-title type="text">{{ currentTask.description }}</xt-title>
    <div class="flex justify-center items-center flex-col">
      <xt-title type="text">完成奖励</xt-title>

      <xt-title type="text" v-if="currentTask.task"
        >当前任务含有操作引导</xt-title
      >
      <xt-button style="width: 100%" type="theme" @click="taskGuide(task)"
        >开始任务</xt-button
      >
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { StarFilled } from "@ant-design/icons-vue";
import { taskStore } from "../store";
const task = taskStore();
const props = defineProps({
  currentStage: {},
  currentTaskId: {},
});

// 引导任务
const emits = defineEmits(["close"]);
const taskGuide = () => {
  console.log("1 :>> ", 1);
  task.step = -1;
  if (currentTask.value.task) {
    switch (currentTask.value.type) {
      case "store":
        task.taskID = currentTask.value.id;
        // task[currentTask.value.data] = true;
        break;
      default:
        break;
    }
    task.step = 1;
    console.log("    task.step  :>> ", task.step);
    console.log("    task.taskID  :>> ", task.taskID);
  } else {
    console.log("111111111 :>> ", 111111111);
  }
  task.step = 1;
  task.taskID = "M0101";
  task.isTaskDrawer = false;
};
// 获取当前任务的下标
const stage = computed(() => {
  let index = 0;
  props.currentStage.tasks.find((item) => {
    if (props.currentTaskId === item.id) {
      return true;
    }
    index++;
    return false;
  });
  return index;
});

// 任务进度
const progress = computed(() => {
  let res = (stage.value / props.currentStage.tasks.length) * 100;
  return res;
});
// 当前任务
const currentTask = computed(() => {
  return props.currentStage.tasks[stage.value];
});
</script>

<style lang="scss" scoped></style>
