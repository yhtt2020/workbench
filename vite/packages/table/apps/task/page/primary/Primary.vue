<template>
  <!-- <xt-button @click="test()">任务重置</xt-button> -->
  <template v-if="store.taskID">
    <!-- 章节进度 -->
    <div class="xt-bg-2 rounded-xl px-4 pt-4 pb-3">
      <xt-text>
        <div class="flex items-center">
          <xt-new-icon icon="fluent-emoji:star" class="mr-3" size="20" />
          {{ chapter.chapter }}
        </div>
        <template #right
          >{{ stage + 1 }} / {{ chapter.tasks.length }}
        </template>
      </xt-text>
      <div class="mt-1">
        <a-progress :percent="progress" :show-info="false" />
      </div>
    </div>
    <xt-title>正在进行</xt-title>
    <div class="xt-bg-2 rounded-xl p-3">
      <xt-text m="">
        <SerialNumber :id=" stage + 1" />
        {{ currentTask.name }}</xt-text
      >
      <xt-title type="text">{{ currentTask.intro }}</xt-title>
      <xt-title m="">任务说明</xt-title>
      <xt-title type="text">{{ currentTask.description }}</xt-title>
      <div class="flex justify-center items-center flex-col">
        <xt-title type="text">完成奖励</xt-title>
        <ShowReward :id="currentTask.id" />
        <StartTask :task="currentTask" class="mt-3"></StartTask>
      </div>
    </div>
  </template>
  <div v-else class="text-center">已完成所有任务</div>
</template>

<script setup>
import StartTask from "../../components/StartTask.vue";
import SerialNumber from "../../components/SerialNumber.vue";
import { tasks } from "./Primary";
import { taskStore } from "../../store";
import { ref, reactive, computed, toRefs, onMounted } from "vue";
import ShowReward from "../../components/ShowReward.vue";
import { getAllTask } from "../../api";

const store = taskStore();

const { list, taskID, currentId, completedList, currentTaskList } =
  toRefs(store);

/**
 * 首次进入时，处理任务进度
 */
onMounted(async () => {
  let { code, data } = await getAllTask();
  if (code !== 200) return;
  currentTaskList.value = data;
  const type = "main";
  console.log("data :>> ", data);
  completedList.value = [];
  data.forEach((item) => {
    if (item.done == 1) completedList.value.push(item.name);
  });
  // 找出主线未完成任务
  let arr = data.filter((obj) => obj.type === type);

  let currentTask = arr.find((item) => {
    if (item.done == 0) return item;
  });

  if (!currentTask) {
    taskID.value = "";
    return;
  }

  taskID.value = currentTask.name;
  currentId.value = currentTask.name;
});
/**
 * 处理主线任务
 */
const test = () => {
  store.taskID = "M0105";
  store.currentId = "M0105";
  store.success = false;
  store.step = -1;
};

// 获取当前章节的所有任务
let chapter = computed(() => {
  if (!store.taskID) {
    return "";
  }
  return tasks.find((item) => {
    return item.tasks.find((task) => {
      if (store.taskID == task.id) {
        return task;
      }
    });
  });
});

// 获取当前任务的下标
const stage = computed(() => {
  let index = 0;
  chapter.value.tasks.find((item) => {
    if (store.taskID === item.id) {
      return true;
    }
    index++;
    return false;
  });
  return index;
});

// 获取任务进度
const progress = computed(() => {
  let res = (stage.value / chapter.value.tasks.length) * 100;
  return res;
});

// 获取当前任务
const currentTask = computed(() => {
  return chapter.value.tasks[stage.value];
});

const aaa = computed(() => {
  return store.getPrimaryTask("M0101");
});
</script>

<style lang="scss" scoped>
:deep(.ant-progress-inner) {
  height: 12px;
}

:deep(.ant-progress-bg) {
  height: 12px !important;
}
</style>
