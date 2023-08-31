<template>
  <xt-popup v-model="task.isTaskDrawer" v-if="task.isTaskDrawer">
    <div class="xt-modal flex py-3 pr-3" style="width: 500px; height: 100%">
      <xt-left-menu :list="menus" last="2"></xt-left-menu>
      <div class="w-full">
        <Primary v-if="currentTask == 'Primary'"></Primary>
        <Branch v-else-if="currentTask == 'Branch'"></Branch>
        <Set v-else-if="currentTask == 'Set'"></Set>
      </div>
    </div>
  </xt-popup>
</template>

<script setup>
import { ref, watch } from "vue";
import { taskStore } from "../store";
import Primary from "./Primary.vue";
import Branch from "./Branch.vue";
import Set from "./Set.vue";
let currentTask = ref("Primary");
const task = taskStore();
console.log("task.mens :>> ", task.mens);
// 切换任务
const selectTab = (item) => {
  currentTask.value = item.value;
};

// 任务配置
const menus = ref([
  {
    icon: "message",
    value: "Primary",
    callBack: selectTab,
  },
  {
    icon: "message",
    value: "Branch",
    callBack: selectTab,
  },
  {
    icon: "shezhi1",
    value: "Set",
    callBack: selectTab,
  },
]);
</script>

<style lang="scss" scoped></style>
