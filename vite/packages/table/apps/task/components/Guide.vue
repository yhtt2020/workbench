<template>
  <div style="width: 355px">
    <div class="flex justify-between items-center mb-3 h-full">
      <div class="text-base flex items-center">任务引导</div>
      <xt-ify-icon
        @click="close()"
        size="30"
        icon="fluent:dismiss-circle-16-filled"
      />
    </div>
    <div>

      {{ currentTask?.description || currentTask?.info }}
    </div>
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
import XtIfyIcon from "../../../ui/new/IfyIcon/index";

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
