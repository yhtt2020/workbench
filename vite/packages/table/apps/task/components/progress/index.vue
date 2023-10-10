<template>
  <div class="rounded-lg w-full h-full overflow-hidden">
    <div class="flex w-full h-full relative">
      <div class="xt-active-bg h-full" :style="[branchProgress]"></div>
      <div class="flex-1 xt-active-bg-2"></div>
      <div
        class="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-full text-center xt-text"
        style="font-size: 12px"
      >
        {{ text }} {{ progress }} %
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, toRefs, ref, reactive } from "vue";

import { storeToRefs } from "pinia";
import { taskStore } from "../../store";

const store = taskStore();
const { successBranchTask } = storeToRefs(store);
const props = defineProps({
  text: {
    default: "进度",
  },
  task: {
    default: {},
  },
});
const { task } = toRefs(props);

// 获取当前分支总长度
let branchLength = ref(task.value.tasks.length);

// 获取当前分支的所有的ID
const allTaskId = computed(() => {
  let allTaskId = reactive([]);
  task.value.tasks.forEach((item) => allTaskId.push(item.id));
  return allTaskId;
});

// 获取当前分支已完成的任务数
const successTask = computed(() => {
  let num = 0;
  allTaskId.value.forEach((item) => {
    if (successBranchTask.value.has(item)) num++;
  });
  return num;
});

// 获取当前分支完成进度
const progress = ref(0);
const branchProgress = computed(() => {
  let res = (successTask.value / branchLength.value) * 100;
  progress.value = Math.round(res);
  return {
    width: progress.value + "%",
  };
});
</script>

<style lang="scss" scoped></style>
