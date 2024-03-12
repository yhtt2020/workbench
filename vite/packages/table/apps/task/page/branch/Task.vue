<template>
  <a-collapse
    v-for="(data, index) in taskList"
    v-model:activeKey="data.activeKey"
    class="xt-text xt-bg-2"
    expandIconPosition="right"
    :style="{
      opacity: data.finished ? 0.5 : 1,
    }"
  >
    <a-collapse-panel key="1" :show-arrow="false">
      <template #header>
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
          </div>
        </div>
      </template>
      <xt-title type="text" m="mb">{{ data.info }} </xt-title>
      <ShowReward :id="data.id" />
      <StartTask :task="data" />
    </a-collapse-panel>
  </a-collapse>

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
  if (claimRewardsList.value.includes(id) || completedList.value.includes(id)) {
    return true;
  }
  return false;
};

const taskList = ref([]);
let finishedList = [];
let notFinishedList = [];
const activeKey = ref(["0"]);
onMounted(() => {
  taskList.value = props.task.tasks.forEach((item) => {
    const isFinished = finished(item.id);
    const newItem = { ...item, finished: isFinished };
    if (activeKey.value[0] == "0" && !isFinished) {
      newItem.activeKey = "1";
      activeKey.value = ["1"];
    }
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

// 新增
:deep(.ant-collapse-content) {
  background: none;
}

:deep(.ant-collapse-content) {
  border: none !important;
}
.ant-collapse {
  border-radius: 12px;
  border: none !important;
  margin-bottom: 16px;
}
:deep(.ant-collapse-item) {
  border: none !important;
}
:deep(.ant-collapse-header) {
  color: var(--primary-text) !important;
}
:deep(.ant-collapse-content-box) {
  padding-top: 0 !important;

  color: var(--primary-text) !important;
}
</style>
