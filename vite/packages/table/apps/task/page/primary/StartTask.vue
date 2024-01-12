<template>
  <!-- 任务按钮 -->
  {{ startList }}
  <xt-button v-if="continueTask" plain type="theme" @click="startTask()" block
    >继续任务</xt-button
  >
  <xt-button
    v-else-if="isFirst && store.success"
    style="background: #faad14 !important; width: 100%"
    @click="receive()"
    h="40"
    >领取奖励</xt-button
  >
  <xt-button v-else style="width: 100%" type="theme" h="40" @click="startTask"
    >开始任务</xt-button
  >
</template>

<script setup>
import { reactive, ref, getCurrentInstance, computed } from "vue";
import { useRouter } from "vue-router";
import { guide } from "../../../../ui/components/Task/guide";
import { lastGuide } from "./lastGuide";
import { endGuide } from "./endGuide";
import { taskStore } from "../../store";
import { useToast } from "vue-toastification";
import { storeToRefs } from "pinia";
import Guide from "../../components/Guide.vue";

import { appStore } from "../../../../store";
const { proxy } = getCurrentInstance();
const app = appStore();

import { getAllTask, completeTask } from "../../api";
// 初始化
const store = taskStore();
const { currentId, startList } = storeToRefs(store);
const router = useRouter();
const props = defineProps({
  task: {},
  isFirst: {
    default: true,
  },
});
const getGuide = () => {
  const toast = useToast();
  toast(
    {
      component: Guide,
    },
    {
      position: "top-right",
      icon: false,
      closeOnClick: false,
      closeButton: false,
      pauseOnFocusLoss: true,
      pauseOnHover: true,
      timeout: 0,
      toastClassName: "notice-toast",
    }
  );
};

// 任务步骤初始化
const init = () => {
  store.step = 1;
  store.isTaskDrawer = false;
};

// 任务引导
const startTask = () => {
  startList.value.push(props.task.id);
  startList.value = [...new Set(startList.value)];
  currentId.value = props.task.id;
  getGuide();
  const open = props.task.open;
  open.forEach((item) => {
    if (item.type === "router") {
      router.push({
        name: item.value,
      });
    }
    if (item.type === "bus") {
      setTimeout(() => {
        proxy.$bus.emit(item.value);
      }, 200);
    }
  });

  store.isTaskDrawer = false;
};

const continueTask = computed(() => {
  let res = startList.value.includes(props.task.id);
  return res;
});

// 领取奖励
const receive = async () => {
  store.list.push(store.taskID);
  store.success = false;
  let fn = endGuide[store.taskID];
  store.taskID = props.task.suf;
  fn && fn();
  // 1 查询任务状态
  // 2 是否领取 差ID
  const { data, code } = await completeTask({
    taskName: store.taskID,
    uid: app.userInfo.uid,
  });
  if (code !== 200) {
  }
  console.log("res :>> ", data, code);
};
</script>

<style lang="scss" scoped>
.test {
  background: red !important;
}
</style>
