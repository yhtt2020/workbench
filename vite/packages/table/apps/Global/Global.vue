<script setup lang="ts">
// 这个文件存放是所有场景都需要弹出的组件
import { ref, onMounted, getCurrentInstance } from "vue";
// store
import { storeToRefs } from "pinia";
import { taskStore as useTaskStore } from "../task/store";
import { useGlobalStore } from "./store";
// components
import ClaimReward from "../task/components/ClaimReward.vue";
import SystemSet from "../systemSet";

const { proxy }: any = getCurrentInstance();

const taskStore = useTaskStore();
const { rewardVisible } = storeToRefs(taskStore);
const globalStore = useGlobalStore();
const { systemVisible } = storeToRefs(globalStore);

onMounted(() => {
  proxy.$bus.on("openSystemSet", () => {
    systemVisible.value = true;
  });
});
</script>

<template>
  <!-- 领取任务奖励 -->
  <ClaimReward v-if="rewardVisible" />
  <!-- 系统设置 -->
  <SystemSet v-if="systemVisible" />
</template>
<style lang="scss" scoped></style>
