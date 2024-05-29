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
  watch,
} from "vue";
// store
import { storeToRefs } from "pinia";
import { taskStore as useTaskStore } from "../task/store";
import { useGlobalStore } from "./store";
// 检查当前网络状态
import { useNetwork } from "@vueuse/core";
const {
  isOnline,
  offlineAt,
  downlink,
  downlinkMax,
  effectiveType,
  saveData,
  type,
} = useNetwork();

// 领取任务奖励
const ClaimReward = defineAsyncComponent(
  () => import("../task/components/ClaimReward.vue")
);
const taskStore: any = useTaskStore();
const { rewardVisible } = storeToRefs(taskStore);
import { aiStore } from "../../store/ai";
// ai初始化
const ai: any = aiStore();
ai.init();
// 系统设置弹窗
const SystemSet = defineAsyncComponent(() => import("../systemSet"));

// 无界应用弹窗
import WujieModal from "../ttApp/src/modules/modal";
import { useTTAppStore } from "../ttApp/src/store";
const ttappStore: any = useTTAppStore();
const { modal } = storeToRefs(ttappStore);

import { useWuJieBus } from "../ttApp/src/modules/wujie/useWuJieBus";
useWuJieBus();
// 新应用中心
import AppCenter from "../appCenter";
import { useAppCenterStore } from "../appCenter/src/store";
const appCenterStore: any = useAppCenterStore();
const { visible } = storeToRefs(appCenterStore);
import AppModal from "../appModal";
console.log("AppModal :>> ", AppModal);
import TTAppModal from "../appModal/src/AppModal.vue";
// 登录弹窗
const Login = defineAsyncComponent(
  () => import("../../permission/user/Login.vue")
);
import { useLogin } from "../../permission/user/useLogin";

const tt: any = inject("tt");
const { proxy }: any = getCurrentInstance();

const globalStore: any = useGlobalStore();
const { systemVisible, loginVisible, loginCb } = storeToRefs(globalStore);
import { useUpdateUserInfo } from "../../permission/user/useUserPermit";
import { usePermissionStore } from "../../permission/store";

const usePermission = usePermissionStore()
const { currentEnv } = storeToRefs(usePermissionStore);
// 网络情况判断
watch(()=>isOnline.value, (newValue, oldValue) => {
  if(newValue){
    // 上线
    if(usePermission.isOffline) usePermission.setOffline(false)
  }else{
    // 掉线
    usePermission.setOffline(true)
  }
})
// 文件弹窗
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
import { useAppModal } from "../../hooks";
let timer;
onMounted(() => {
  const { initApp } = useAppModal("");
  initApp()
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
  if (isOnline && !window.$useEnv("guest")) {
    // 补充尝试登录
    // 添加重连定时器 目前 五分钟重连一次
    timer = setInterval(() => {
      if (currentEnv != "offline") {
        clearInterval(timer);
        timer = null;
      }
      useUpdateUserInfo();
    }, 300000);
  }
});
</script>

<template>
  <!-- 新应用中心 -->
  <AppCenter v-if="visible" />
  <!-- 无界应用 -->
  <WujieModal v-if="modal.visible" />
  <!-- 系统弹窗应用 -->
  <AppModal />
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
