<script setup lang="ts">
// 这个文件存放是所有场景都需要弹出的组件
// 记得写注释
import { ref, onMounted, getCurrentInstance } from "vue";
// store
import { storeToRefs } from "pinia";
import { taskStore as useTaskStore } from "../task/store";
import { useGlobalStore } from "./store";
// components
import ClaimReward from "../task/components/ClaimReward.vue";
import SystemSet from "../systemSet";
import { useLogin } from "../../permission/user/useLogin";
import Login from "../../permission/user/Login.vue";

const { proxy }: any = getCurrentInstance();

const taskStore: any = useTaskStore();
const { rewardVisible } = storeToRefs(taskStore);
const globalStore: any = useGlobalStore();
const { systemVisible, loginVisible, loginCb } = storeToRefs(globalStore);

onMounted(() => {
  // 打开系统设置
  proxy.$bus.on("openSystemSet", () => {
    systemVisible.value = true;
  });
  // 打开登录
  proxy.$bus.on("openLogin", (cb) => {
    useLogin(cb);
  });
});
</script>

<template>
  <!-- 领取任务奖励 -->
  <ClaimReward v-if="rewardVisible" />
  <!-- 系统设置 -->
  <SystemSet v-if="systemVisible" />
  <!-- 登录页面 -->
  <Login v-if="loginVisible" @cb="loginCb" />
</template>
<style lang="scss" scoped></style>
