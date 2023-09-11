<template>
  <!-- 任务弹窗 -->
  <xt-message
    @ok="ok()"
    @no="no()"
    v-model="data.visible"
    :text="data.text"
  ></xt-message>
  <!-- 任务按钮 -->
  <xt-button style="width: 100%" type="theme" @click="taskGuide()"
    >开始任务</xt-button
  >
  <div></div>
</template>

<script setup>
import { reactive, ref } from "vue";
import { taskStore } from "../store";
import { useRouter } from "vue-router";
import { guide } from "../../../ui/components/Task/guide";

import {cardStore} from "../../../store/card"

console.log('111 :>> ', 111);
const card = cardStore()
let res = card.getCurrentDesk()
console.log('res :>> ', res);
// 初始化
const store = taskStore();
const router = useRouter();
const props = defineProps({
  task: {},
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
    default:
      break;
  }
};

const ok = () => {
  store.isTaskDrawer = false;
  init();
};

const no = () => {
  data.visible = false;
};
</script>

<style lang="scss" scoped></style>
