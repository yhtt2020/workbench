<template>
  <!-- <xt-button @click="test()">任务重置</xt-button> -->
  <template v-if="store.taskID">
    <div class="xt-bg-2 rounded-xl p-3">
      <xt-title m="">
        <div class="flex items-center">
          <xt-new-icon icon="fluent-emoji:star" class="mr-3" size="20" />
          {{ chapter.chapter }}
        </div>
        <template #right>{{ stage }} / {{ chapter.tasks.length }} </template>
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
        <div class="xt-theme-text">
          暂无任务奖励，后续完工后，我们会自动补发奖励
        </div>
        <!-- <div class="xt-theme-text">当前版本建议根据引导按钮来完成操作</div> -->
        <xt-title type="text" v-if="currentTask.guide"
          >提示：当前任务含有操作引导</xt-title
        >
        <StartTask :task="currentTask"></StartTask>
      </div>
    </div>
  </template>
  <div v-else>已完成所有任务</div>
</template>

<script setup>
import StartTask from "./StartTask.vue";

import { tasks } from "./Primary";
import { taskStore } from "../../store";
import { ref, reactive, computed } from "vue";

/**
 * 处理主线任务
 */
const test = () => {
  store.taskID = "M0101";
  store.success = false;
  store.step = -1;
};
const store = taskStore();

// 获取当前章节的所有任务
let chapter = computed(() => {
  if (!store.taskID) {
    return "";
  }
  return tasks.find((item) => {
    return item.tasks.find((task) => {
      if (store.taskID == task.id) {
        return task;
      }
    });
  });
});

// 获取当前任务的下标
const stage = computed(() => {
  let index = 0;
  console.log('  chapter.value.tasks :>> ',   chapter.value);
  chapter.value.tasks.find((item) => {
    if (store.taskID === item.id) {
      return true;
    }
    index++;
    return false;
  });
  return index;
});

// 获取任务进度
const progress = computed(() => {
  let res = (stage.value / chapter.value.tasks.length) * 100;
  return res;
});

// 获取当前任务
const currentTask = computed(() => {
  return chapter.value.tasks[stage.value];
});
</script>

<style lang="scss" scoped></style>
