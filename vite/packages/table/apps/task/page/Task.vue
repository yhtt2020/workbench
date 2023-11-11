<template>
  <a-drawer
    :width="512"
    :closable="false"
    style="z-index: 1000"
    placement="right"
    v-model:visible="store.isTaskDrawer"
    :bodyStyle="{ padding: ' 0 ', overflow: 'hidden !important' }"
    @closeMessage="task.isTaskDrawer = false"
  >
    <div class="xt-modal flex py-3" style="width: 500px; height: 100%">
      <xt-left-menu :list="menusList" :last="Offline.isOffline?3:4" model="id" />
      <div class="w-full xt-scrollbar xt-text">
        <Primary v-if="currentTask == 'Primary'" />
        <Branch
          v-else-if="currentTask == 'Branch'"
          :tasks="task"
          :key="Date.now()"
          :icon="icon"
        />
        <Activity v-else-if="currentTask == 'Activity'" />
        <Set v-else-if="currentTask == 'Set'" />

      </div>
    </div>
  </a-drawer>
</template>

<script setup>
import { ref, watch, onMounted, computed } from "vue";
import { taskStore } from "../store";
import { offlineStore } from "../../../js/common/offline";
import Primary from "./primary/index.vue";
import Branch from "./branch/index.vue";
import Activity from "./activity/index.vue";
import Set from "./Set.vue";
import { tasks } from "../page/branch/Branch.ts";
let currentTask = ref("Primary");
let task = ref([]);
let icon = ref("");
const store = taskStore();
let Offline = offlineStore()
// 切换任务
const selectTab = (item) => {
  currentTask.value = item.value;
};
// 切换不同支线
const selectBranchTab = (item) => {
  icon.value = item.newIcon;
  currentTask.value = "Branch";
  task.value = tasks[item.value];
};
const menusList = computed(()=>{
  if (Offline.isOffline) {
    let tmp = ref([])
    tmp.value = menus.value.filter(i=>{
      return i.value!='chats' && i.value!='Activity'
    })
    return tmp.value
  }else{ 
    return menus.value
  }
}) 
// 任务配置
let menus = ref([
  {
    // slot: "star",
    newIcon: "fluent-emoji:star",
    value: "Primary",
    title: "主线任务",
    callBack: selectTab,
  },
  // {
  //   newIcon: "fluent-emoji:bullseye",
  //   title: "支线任务",
  //   value: "works",
  //   callBack: selectTab,
  // },
  {
    newIcon: "fluent-emoji:rocket",
    title: "效率办公",
    value: "works",
    callBack: selectBranchTab,
  },
  {
    newIcon: "fluent-emoji:joystick",
    title: "游戏辅助",
    value: "games",
    callBack: selectBranchTab,
  },
  {
    newIcon: "fluent-emoji:thought-balloon",
    title: "社群沟通",
    value: "chats",
    callBack: selectBranchTab,
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
    title: "设置",
    callBack: selectTab,
  },
]);
</script>

<style lang="scss" scoped></style>
./branch/index.vue
