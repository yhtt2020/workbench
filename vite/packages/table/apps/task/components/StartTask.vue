<template>
  <!-- <p>当前任务ID： {{ task.id }}</p>
  <p>进行中任务ID： {{ startList }}</p>
  <p>可领取奖励ID： {{ claimRewardsList }}</p>
  <p>已完成任务ID： {{ completedList }}</p> -->

  <xt-button v-if="completeTask" h="40" type="success" block @click="startTask"
    >已完成，再次体验</xt-button
  >
  <xt-button
    v-else-if="getReceiveStatus"
    style="background: #faad14 !important; width: 100%"
    @click="receive()"
    h="40"
    >领取奖励</xt-button
  >
  <xt-button
    v-else-if="continueTask"
    plain
    type="theme"
    @click="startTask()"
    block
    >继续任务</xt-button
  >
  <xt-button v-else style="width: 100%" type="theme" h="40" @click="startTask"
    >开始任务</xt-button
  >
</template>

<script setup>
import { reactive, ref, getCurrentInstance, computed } from "vue";
import { useRouter } from "vue-router";
import { taskStore } from "../store";
import { useToast } from "vue-toastification";
import { storeToRefs } from "pinia";
import Guide from "./Guide.vue";
import { getReward, currentType } from "../task";

import { appStore } from "../../../store";
const { proxy } = getCurrentInstance();
const app = appStore();

// 初始化
const store = taskStore();
const { currentId, startList, claimRewardsList, completedList, rewardVisible,smallMize } =
  storeToRefs(store);
const router = useRouter();
const props = defineProps({
  task: {},
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

// 任务引导
const startTask = () => {
  startList.value.push(props.task.id);
  startList.value = [...new Set(startList.value)];
  smallMize.value = false;

  console.log("props.task.id :>> ", props.task.id);
  currentId.value = props.task.id;

  let type = currentType(props.task.id);
  if (type == "m") {
    getGuide();
  }
  const open = props.task?.open;
  if (!open) {
    router.push({
      name: "home",
    });
    return;
  }
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
  setTimeout(() => {
    store.isTaskDrawer = false;
  }, 201);
};

const continueTask = computed(() => {
  let res = startList.value.includes(props.task.id);
  return res;
});

// 领取奖励
const receive = async () => {
  currentId.value = props.task.id;
  rewardVisible.value = true;
};
const getReceiveStatus = computed(() => {
  return claimRewardsList.value.includes(props.task.id);
});

// 已完成任务
const completeTask = computed(() => {
  console.log("completedList.value :>> ", completedList.value);
  return completedList.value.includes(props.task.id);
});
</script>

<style lang="scss" scoped>
.test {
  background: red !important;
}
</style>
