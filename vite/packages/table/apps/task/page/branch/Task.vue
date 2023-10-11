<template>
  <div>
    <xt-text class="mb-3">
      <xt-new-icon
        icon="fluent:chevron-left-16-filled"
        @click="back()"
        bgClass="xt-bg-2"
        class="mr-3"
        w="40"
      />
      {{ task.chapter }}
      <template #right>
        <Progress style="width: 68px; height: 20px" :task="task"
      /></template>
    </xt-text>
    <xt-collapse v-for="data in task.tasks">
      <template #title>
        <xt-text>
          <xt-new-icon :icon="icon" class="mr-3" size="20" />
          {{ data.title }}
        </xt-text></template
      >
      <xt-title type="text" m="mb">{{ data.info }} </xt-title>
      <xt-button
        v-if="taskState(data)"
        @click="getReceive(data)"
        style="background: #faad14 !important; width: 100%"
        >领取奖励</xt-button
      >
      <xt-button v-else @click="startTak(data)" type="theme" style="width: 100%"
        >开始任务</xt-button
      >
    </xt-collapse>
  </div>
</template>

<script setup>
import { computed, toRefs, ref, reactive } from "vue";
import { message } from "ant-design-vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";

import Progress from "../../components/progress/index.vue";
import { guide } from "./guide";

import { taskStore } from "../../store";

const store = taskStore();
const router = useRouter();
const { successBranchTask, startBranchTask } = storeToRefs(store);

const props = defineProps({
  task: {
    default: {},
  },
  icon: {},
});

const emits = defineEmits(["back"]);
const back = () => {
  console.log("111 :>> ", 111);
  emits("back");
};

// 开始任务
const startTak = (data) => {
  // 1 前置进度校验
  const { id, pre, title } = data;
  if (pre) {
    // 没完成
    if (!successBranchTask.value.includes(pre)) {
      message.info("需要完成前置任务:" + title);
      return;
    }
  }
  // 2 开始跳转指引
  startBranchTask.value.push(id);
  let currentGuide = guide[id];

  const { type, value } = guide[id];
  if (type == "router") {
    router.push({
      name: value,
    });
  }
  store.isTaskDrawer = false;
  return;
  setTimeout(() => {
    successBranchTask.value.push(id);
  }, 3000);
};
// 任务完成状态
const taskState = (data) => {
  if (successBranchTask.value.includes(data.id)) return true;
  return false;
};

// 获取奖励
const getReceive = () => {
  message.info("你已完成任务 后续可以一键领取任务奖励");
};
</script>

<style lang="scss" scoped></style>
