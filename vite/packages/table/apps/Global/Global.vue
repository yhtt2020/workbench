<script setup lang="ts">
// 这个文件存放是所有场景都需要弹出的组件
// 记得写注释
import {
  ref,
  onMounted,
  getCurrentInstance,
  onUnmounted,
  inject,
  defineAsyncComponent,
} from "vue";
// store
import { storeToRefs } from "pinia";
import { taskStore as useTaskStore } from "../task/store";
import { useGlobalStore } from "./store";
// components
const ClaimReward = defineAsyncComponent(
  () => import("../task/components/ClaimReward.vue")
);
const SystemSet = defineAsyncComponent(() => import("../systemSet"));
const Login = defineAsyncComponent(
  () => import("../../permission/user/Login.vue")
);
import WujieModal from "../ttApp/src/modules/modal";
import { useTTAppStore } from "../ttApp/src/store";
const ttappStore: any = useTTAppStore();
const { modal } = storeToRefs(ttappStore);
// hooks
import { useLogin } from "../../permission/user/useLogin";
const tt: any = inject("tt");
const { proxy }: any = getCurrentInstance();

const taskStore: any = useTaskStore();
const { rewardVisible } = storeToRefs(taskStore);
const globalStore: any = useGlobalStore();
const { systemVisible, loginVisible, loginCb } = storeToRefs(globalStore);

const fileVisible = ref(true);
const file: any = ref(null);

const openFile = (cb?: Function) => {
  fileVisible.value = true;
  setTimeout(() => {
    file.value.click();
    file.value.onchange = function (event: any) {
      const file = event.target.files[0];
      if (!file) {
        fileVisible.value = false;
        return;
      }
      cb && cb(file);
      event.target.value = "";
      fileVisible.value = false;
    };
    // proxy.tt
  }, 10);
};
onMounted(() => {
  // 打开系统设置
  proxy.$bus.on("openSystemSet", () => {
    console.log("systemVisible.value :>> ", systemVisible.value);
    systemVisible.value = !systemVisible.value;
  });
  // 打开登录
  proxy.$bus.on("openLogin", (cb) => {
    useLogin(cb);
  });
  // 打开文件弹窗
  proxy.$bus.on("openFile", (cb) => {
    openFile(cb);
  });
});
</script>

<template>
  <!-- 无界应用 -->
  <WujieModal v-if="modal.visible" />
  <!-- 领取任务奖励 -->
  <ClaimReward v-if="rewardVisible" />
  <!-- 系统设置 -->
  <SystemSet v-if="systemVisible" />
  <!-- 登录页面 -->
  <Login v-if="loginVisible" @cb="loginCb" />
  <!-- 文件弹窗 -->
  <input v-if="fileVisible" style="display: none" ref="file" type="file" />
</template>
<style lang="scss" scoped></style>
