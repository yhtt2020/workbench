<template>
  <div style="width: 355px">
    <div class="flex justify-between items-center mb-3 h-full">
      <div class="text-base flex items-center">
        <xt-ify-icon size="24" icon="fluent-emoji:star" class="mr-2" />
        任务已完成！
      </div>

      <xt-ify-icon
        @click="close()"
        size="28"
        icon="fluent:dismiss-circle-16-filled"
      />
    </div>
    <div>
      已完成「 {{ currentTask?.name }}」任务，
      {{ status ? "感谢再次体验" : "点击领取奖励" }}。
    </div>
    <div class="flex justify-between mt-3">
      <div></div>
      <xt-button
        @click="claimReward()"
        type="theme"
        w="84"
        h="32"
        radius="8"
        :plain="true"
      >
        {{ status ? "确定" : "立即领取" }}
      </xt-button>
    </div>
  </div>
</template>

<script setup>
import { ref, toRefs, computed, onMounted ,onBeforeMount} from "vue";
import { taskStore } from "../store";
import { storeToRefs } from "pinia";
import XtButton from "../../../ui/libs/button/index.vue";
import XtIfyIcon from "../../../ui/new/IfyIcon/index";

import { getTaskStatus } from "../api";
onBeforeMount(() => {
  taskStatus();
});
const status = ref(0);
const taskStatus = async () => {
  let { data } = await getTaskStatus({
    taskName: currentId.value,
  });
  status.value = data.done;
};

const store = taskStore();
const { taskID, currentTaskList, rewardVisible, currentId, claimRewardsList } =
  storeToRefs(store);

const currentTask = computed(() => {
  return store.getTask(currentId.value);
});

const emits = defineEmits(["close-toast"]);

const close = () => {
  emits("close-toast");
};

const claimReward = () => {
  emits("close-toast");
  rewardVisible.value = true;
};
</script>

<style lang="scss" scoped></style>
