<template>
  <div>
    <xt-title m="mb">
      <xt-base-icon icon="xiangzhuo" /> 1 <FlagOutlined @click="back()" />
      {{ task.chapter }}1
      <template #right>
        <Progress style="width: 68px; height: 20px" :task="task"></Progress
      ></template>
    </xt-title>
    <xt-collapse v-for="data in task.tasks">
      <template #title>
        <xt-title m="0">{{ data.title }} </xt-title></template
      >

      <xt-title type="text" m="mb">{{ data.info }} </xt-title>
      <xt-button
        v-if="taskState(data)"
        @click="getReceive(data)"
        type="theme"
        style="width: 100%"
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

import Progress from "../../components/progress/index.vue";
import { storeToRefs } from "pinia";
import { taskStore } from "../../store";
import { message } from "ant-design-vue";
const store = taskStore();
const { successBranchTask, startBranchTask } = storeToRefs(store);

const props = defineProps({
  task: {
    default: {},
  },
});
const currentId = ref(props.task.id);
// 开始任务
const startTak = (data) => {
  /**
   * 1获取任务ID
   * 2判断是否有前置
   * 3查询完成任务是否存在前置任务
   * 4拦截或开始
   * 5追加 转set 转arr
   */
  const { id, pre } = data;
  // 有前置
  if (pre) {
    // 没完成
    if (!successBranchTask.value.has(pre)) {
      console.log("没完成 :>> ");
      return;
    }
  }

  startBranchTask.value.add(id);
  console.log("  startBranchTask.value :>> ", startBranchTask.value);
  setTimeout(() => {
    successBranchTask.value.add(id);
  }, 3000);
};
// 任务完成状态
const taskState = (data) => {
  if (successBranchTask.value.has(data.id)) return true;
  return false;
};
/**
 * 布置任务点
 * 定位完成任务函数
 * 判断是否开启任务
 * 执行下一步
 * 抽离为action方法
 */
const getReceive = () => {
  message.info("你已完成任务 后续可以一键领取任务奖励");
};
</script>

<style lang="scss" scoped></style>
