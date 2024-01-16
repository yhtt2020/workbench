<template>
  <Task
    v-if="currentTask"
    @back="back()"
    :task="currentTask"
    :icon="icon"
    :length="tasks.length"
  />
  <template v-else>
    <div style="" class="flex justify-between items-center mb-3">
      <div style="width: 200px">支线任务</div>
      <div class="flex items-center">
        <div style="width: 68px;margin-right: 45px" v-if="tasks.length <= 1">
          <Progress
            :task="tasks[0]"
            style="width: 68px; height: 20px; "
          />
        </div>
        <Exit />
      </div>
    </div>
    <div class="xt-bg-2 p-3 rounded-xl mb-3">
      <xt-title type="text"
        >你可以自由选择想要了解的功能支线，完成任务即可获得对应奖励。「右键单击」任务可以选择将其「固定在左侧」，方便进行任务追踪。</xt-title
      >
    </div>
    <template v-if="tasks.length <= 1">
      <Task @back="back()" :task="tasks[0]" :icon="icon" :length="1"
    /></template>
    <template v-else>
      <xt-menu :menus="menus" v-for="task in tasks">
        <div
          class="flex flex-col xt-bg-2 rounded-xl mt-3 p-3 cursor-pointer"
          @click="taskClick(task)"
        >
          <xt-title m="">
            <div class="flex items-center">
              <xt-new-icon :icon="icon" class="mr-3" size="20" />
              {{ task.name }}
            </div>
            <template #right
              ><Progress :task="task" style="width: 68px; height: 20px"
            /></template>
          </xt-title>
          <xt-title type="text" m="mt">
            {{ task.info }}
          </xt-title>
        </div>
      </xt-menu>
    </template>
  </template>
</template>

<script setup>
import { ref, reactive } from "vue";
import Task from "./Task.vue";
import Progress from "../../components/progress/index.vue";
import Exit from "../../components/Exit.vue";
const props = defineProps({
  tasks: {},
  icon: {},
});

const menus = reactive([
  {
    label: "固定到左侧",
    callBack: () => {},
  },
]);

const currentTask = ref(null);
const taskClick = (task) => {
  currentTask.value = task;
};

const back = () => {
  currentTask.value = null;
};
</script>

<style lang="scss" scoped></style>
