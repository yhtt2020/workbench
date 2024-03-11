<template>
  <xt-collapse
    v-for="(data, index) in taskList"
    class="mb-3 opacity-50"
    :index="index"
    v-model="data.isCollapseStatus"
    :style="{
      opacity: data.finished ? 0.5 : 1,
    }"
  >
    <template #title>
      <div class="flex justify-between w-full">
        <xt-text>
          <SerialNumber :id="index + 1" />
          <span style="max-width: 280px">
            {{ data.name }}
          </span>
        </xt-text>
        <div class="flex items-center justify-center">
          <div v-if="data.finished" style="width: 46px">已完成</div>
          <ShowReward v-else :id="data.id" class="showReward-title" />
          <!-- v-else-if="!isCollapse(index, data)" -->
        </div>
      </div>
    </template>
    <xt-title type="text" m="mb">{{ data.info }} </xt-title>
    <ShowReward :id="data.id" />
    <StartTask :task="data" />
  </xt-collapse>
</template>

<script setup>
import { computed, toRefs, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import SerialNumber from "../../components/SerialNumber.vue";

import StartTask from "../../components/StartTask.vue";

import { taskStore } from "../../store";
import ShowReward from "../../components/ShowReward.vue";

const store = taskStore();
const router = useRouter();
const { claimRewardsList, completedList } = storeToRefs(store);

const props = defineProps({
  task: {
    default: {},
  },
  icon: {},
  length: {},
});

const emits = defineEmits(["back"]);
const back = () => {
  emits("back");
};

// 根据当前id来判断是否触发当前任务折叠
const isCollapse = (index, data) => {
  if (data.isCollapseStatus?.index === index) {
    if (data.isCollapseStatus?.val === "0") {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
};

const finished = (id) => {
  // successBranchTask(id);
  // claimRewardsList, completedList
  if (claimRewardsList.value.includes(id) || completedList.value.includes(id)) {
    return true;
  } else {
    return false;
  }
};

const taskList = ref([]);
let finishedList = [];
let notFinishedList = [];
onMounted(() => {
  taskList.value = props.task.tasks.forEach((item) => {
    const isFinished = finished(item.id);
    const newItem = { ...item, finished: isFinished };
    (isFinished ? finishedList : notFinishedList).push(newItem);
  });
  taskList.value = [...notFinishedList, ...finishedList];
});
</script>

<style lang="scss" scoped>
:deep(.ant-collapse-header) {
  padding: 12px 16px 12px 16px !important ;
}
:deep(.showReward-title) {
  margin-bottom: 0 !important;
  & .reward-w {
    zoom: 0.5;
  }
}
</style>
