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
// components 非首次加载请使用defineAsyncComponent包裹
const ClaimReward = defineAsyncComponent(
  () => import("../task/components/ClaimReward.vue")
);
const SystemSet = defineAsyncComponent(() => import("../systemSet"));
const Login = defineAsyncComponent(
  () => import("../../permission/user/Login.vue")
);
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
    systemVisible.value = true;
  });
  // 打开登录
  proxy.$bus.on("openLogin", (cb) => {
    useLogin(cb);
  });
  // 打开文件弹窗
  proxy.$bus.on("openFile", (cb) => {
    openFile(cb);
  });

  setTimeout(() => {
    proxy.$bus.emit("openSystemSet");
    setTimeout(() => {
      proxy.$bus.emit("selectSystemNav", 7);
    }, 1000);
  }, 3000);
  // window.tt.
});

const test = () => {
  // window.tt.runTime
  // window.tt
  // console.log('proxy :>> ',);
  // console.log("test",t);
  // tt.api.
  // console.log('tt.runTime.env :>> ', tt.env(""));
  // tt
};
</script>

<template>
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
