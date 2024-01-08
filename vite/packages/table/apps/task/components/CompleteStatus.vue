<template>
  <xt-modal :footer="0" v-model="rewardVisible">
    <div
      class="mb-4 flex justify-center items-center flex-col"
      style="width: 500px"
    >
      <xt-ify-icon icon="fluent-emoji:glowing-star" size="100" class="mb-3" />
      <div>{{ types[props.type]?.info }}</div>
      <div class="flex mt-3">
        <Reward v-for="item in currentTask.reward" v-bind="item" class="mx-1" />
      </div>
    </div>
    <div class="flex justify-between">
      <div></div>
      <xt-button
        w="80"
        h="40"
        type="theme"
        @click="rewardVisible = false"
        radius="8"
        >{{ types[props.type]?.button }}</xt-button
      >
    </div>
  </xt-modal>
</template>

<script setup>
import { ref, toRefs, computed } from "vue";
import { taskStore } from "../store";
import { storeToRefs } from "pinia";
import Reward from "./Reward.vue";

const store = taskStore();
const { taskID, currentTaskList, rewardVisible, currentId, currentType } =
  storeToRefs(store);
const props = defineProps({
  type: {
    type: String,
    default: "task",
  },
  info: {},
});

const currentTask = computed(() => {
  if (currentType.value == "M") {
    return store.getPrimaryTask(store.currentId);
  }
});
const types = {
  all: {
    info: "恭喜！你已完成所有「主线任务」，未完待续～",
    button: "完成",
  },
  chapter: {
    info: "恭喜！当前章节任务已完全部完成！",
    button: "下一章",
  },
  task: {
    info: "恭喜！任务已完成，获得以下奖励：",
    button: "完成",
  },
};
</script>

<style lang="scss" scoped></style>
