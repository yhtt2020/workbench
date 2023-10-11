<template>
  <TaskList
    v-if="currentTask"
    :task="currentTask"
    :completedTask="completedTask(currentTask.tasks)"
    @back="back()"
  />
  <template v-else>
    <xt-text type="2" class="mb-3"
      >你可以自由选择想要重新了解的功能和模块，已完成奖励不会重复发放。</xt-text
    >
    <div
      v-for="item in tasks.slice(1)"
      class="p-3 rounded-xl xt-bg-2 mb-3 cursor-pointer"
      @click="taskClick(item)"
    >
      <xt-text class="mb-2 font-medium">
        <xt-new-icon icon="fluent-emoji:star" class="mr-3" size="20" />{{
          item.chapter
        }}
        <template #right>
          {{ completedTask(item.tasks) }}
        </template>
      </xt-text>
      <xt-text type="2">{{ item.info }}</xt-text>
    </div>
  </template>
</template>

<script setup>
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { taskStore } from "../../store.ts";
import { tasks } from "./Primary.ts";
import TaskList from "./TaskList.vue";
const currentTask = ref(null);
const sotre = taskStore();
const { list } = storeToRefs(sotre);
const completedTask = (tasks) => {
  let length = tasks.length;
  let count = 0;
  tasks.forEach((item) => {
    if (list.value.includes(item.id)) {
      count++;
    }
  });

  return `${count} / ${length}`;
};
const back = () => {
  currentTask.value = null;
};
const taskClick = (item) => {
  currentTask.value = item;
};
</script>

<style lang="scss" scoped></style>
