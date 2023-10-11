<template>
  <a-drawer
    :width="512"
    :closable="false"
    style="z-index: 1000"
    placement="right"
    v-model:visible="task.isTaskDrawer"
    :bodyStyle="{ padding: ' 0 ', overflow: 'hidden !important' }"
    @closeMessage="task.isTaskDrawer = false"
  >
    <div class="xt-modal flex py-3" style="width: 500px; height: 100%">
      <xt-left-menu :list="menus" last="2" />
      <div class="w-full xt-scrollbar xt-text">
        <Primary v-if="currentTask == 'Primary'"></Primary>
        <Branch v-else-if="currentTask == 'Branch'"></Branch>
        <Activity v-else-if="currentTask == 'Activity'" />
        <Set v-else-if="currentTask == 'Set'"></Set>
      </div>
    </div>
  </a-drawer>
</template>

<script setup>
import { ref, watch } from "vue";
import { taskStore } from "../store";
import Primary from "./Primary.vue";
import Branch from "./branch/index.vue";
import Activity from "./activity/index.vue";
import Set from "./Set.vue";

let currentTask = ref("Primary");
const task = taskStore();
// 切换任务
const selectTab = (item) => {
  currentTask.value = item.value;
};

// 任务配置
const menus = ref([
  {
    // slot: "star",
    newIcon: "fluent-emoji:star",
    value: "Primary",
    title: "主线任务",
    callBack: selectTab,
  },
  {
    // slot: "flag",
    newIcon: "fluent-emoji:bullseye",
    title: "支线任务",
    value: "Branch",
    callBack: selectTab,
  },
  // {
  //   newIcon: "fluent-emoji:rainbow",
  //   value: "Activity",
  //   title: "活动任务",
  //   callBack: selectTab,
  // },
  {
    icon: "shezhi1",
    value: "Set",
    callBack: selectTab,
  },
]);
</script>

<style lang="scss" scoped></style>
./branch/index.vue
