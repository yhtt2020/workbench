<template>
  <div style="width: 355px">
    <div class="flex justify-between items-center mb-3 h-full">
      <div class="flex ">
        <xt-ify-icon icon="fluent-emoji:light-bulb" class="mr-1" size="22"></xt-ify-icon>
        <div class="text-base flex items-center font-16">任务提示</div>
      </div>
      <xt-ify-icon
        @click="close()"
        size="30"
        icon="fluent:dismiss-circle-16-filled" class="xt-text-2"
      />
    </div>
    <div class="my-3 xt-text-2 font-16">
      {{ currentTask?.description || currentTask?.info }}
    </div>
    <div class="flex items-center justify-center mb-3">
      <xt-title class="xt-text-2">完成奖励</xt-title>
    </div>
    <ShowReward :id="currentTask.id"/>
    <div class="flex justify-between mt-3">
      <div></div>
      <xt-button
        @click="close()"
        type="theme"
        w="84"
        h="32"
        radius="8"
        :plain="true"
        >知道了</xt-button
      >
    </div>
  </div>
</template>

<script setup>
import { ref, toRefs, computed } from "vue";
import { taskStore } from "../store";
import { storeToRefs } from "pinia";
import XtButton from "../../../ui/libs/button/index.vue";
import XtIfyIcon from "../../../ui/new/IfyIcon/index.vue";
import ShowReward from "./ShowReward.vue";

const store = taskStore();
const { taskID, currentTaskList, rewardVisible, currentId, currentType } =
  storeToRefs(store);
const currentTask = computed(() => {
  return store.getTask(currentId.value);

});
const emits = defineEmits(["close-toast"]);
const close = () => {
  emits("close-toast");
};
</script>

<style lang="scss" scoped></style>
