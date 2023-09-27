<template>
  <template v-if="currentTask">
    <div>
      <xt-title m="">
        <xt-base-icon icon="xiangzhuo" /> 1 <FlagOutlined />
        {{ currentTask.chapter }}
        <template #right>1</template>
      </xt-title>
      <xt-collapse v-for="task in currentTask.tasks">
        <template #title> <xt-title :title="task.title"/></template>

        321 {{ task }}
      </xt-collapse>
      {{ currentTask }}
    </div>
  </template>
  <template v-else>
    <xt-title>支线任务</xt-title>
    <div class="xt-bg-2 p-3 rounded-xl">
      <xt-title type="text"
        >你可以自由选择想要了解的功能支线，完成任务即可获得对应奖励。「右键单击」任务可以选择将其「固定在左侧」，方便进行任务追踪。</xt-title
      >
    </div>
    <xt-menu :menus="menus" v-for="task in tasks">
      <div
        class="flex flex-col xt-bg-2 rounded-xl mt-3 p-3"
        @click="taskClick(task)"
      >
        <xt-title m="">
          <FlagOutlined /> {{ task.chapter }}
          <template #right>1</template>
        </xt-title>
        <xt-title type="text" m="mt">
          {{ task.info }}
        </xt-title>
      </div>
    </xt-menu>
  </template>
</template>

<script setup>
import { ref, reactive } from "vue";
import { tasks } from "../config/Branch";
import { FlagOutlined } from "@ant-design/icons-vue";

const menus = reactive([
  {
    label: "固定到左侧",
    callBack: () => {
      // store.isTask = false;
      console.log("111111111 :>> ", 111111111);
    },
  },
]);

console.log("tasks :>> ", tasks);
const currentTask = ref(null);
const taskClick = (task) => {
  currentTask.value = task;
  console.log("task :>> ", task);
};
</script>

<style lang="scss" scoped></style>
