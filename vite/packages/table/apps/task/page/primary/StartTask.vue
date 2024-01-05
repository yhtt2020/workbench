<template>
  <!-- 任务弹窗 -->
  <xt-message
    @ok="ok()"
    @no="no()"
    v-model="data.visible"
    :text="data.text"
  ></xt-message>
  <!-- 任务按钮 -->
  <xt-button
    v-if="isFirst && store.success"
    style="background: #faad14 !important; width: 100%"
    @click="receive()"
    h="40"
    >领取奖励</xt-button
  >
  <xt-button v-else style="width: 100%" type="theme" @click="taskGuide()" h="40"
    >开始任务</xt-button
  >
</template>

<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { guide } from "../../../../ui/components/Task/guide";
import { lastGuide } from "./lastGuide";
import { endGuide } from "./endGuide";
import { taskStore } from "../../store";
// C:\Users\16110\Desktop\demo1 (2)\browser\vite\packages\table\store.ts
import { appStore } from "../../../../store";

const app = appStore();

import { getAllTask, completeTask } from "../../api";
// 初始化
const store = taskStore();
const router = useRouter();
const props = defineProps({
  task: {},
  isFirst: {
    default: true,
  },
});
const data = reactive({
  visible: false,
  text: "",
});

// 任务步骤初始化
const init = () => {
  store.step = 1;
  store.isTaskDrawer = false;
};

// 任务引导
const taskGuide = () => {
  let currentTask = guide[store.taskID][0];
  switch (currentTask.type) {
    case "router":
      init();
      router.push({
        name: currentTask.value,
      });
      break;
    case "message":
      data.text = currentTask.value;
      data.visible = true;
      break;
    case "router message":
      data.text = currentTask.value;
      data.visible = true;
      break;

    default:
      break;
  }
};

const ok = () => {
  router.push({
    name: "home",
  });
  store.isTaskDrawer = false;
  //  这里执行fn
  let fn = lastGuide[store.taskID];
  data.visible = false;
  fn && fn();
  init();
};

const no = () => {
  data.visible = false;
};

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

<style lang="scss" scoped></style>
