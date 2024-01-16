<template>
  <xt-modal custom v-model="store.isTaskDrawer" boxClass="rounded-xl" :mask="false">
    <div class="xt-modal flex rounded-xl" style="width: 500px; height: 600px">
      <xt-left-menu
        :list="menusList"
        :last="Offline.isOffline ? 3 : 4"
        :end="1"
        model="id"
        leftClass=" 1 xt-main-bg py-3 h-full  "
        :leftStyle="{
          'border-radius': '12px 0 0 12px',
        }"
        style="border-radius: 12px 12px 12px 0"
      />
      <div class="flex flex-col w-full">
        <div class="w-full xt-scrollbar xt-text pt-3 pr-3 relative">
          <Primary v-if="currentTask == 'Primary'" />
          <Branch
            v-else-if="currentTask == 'Branch'"
            :tasks="task"
            :key="Date.now()"
            :icon="icon"
          />
          <Daily v-else-if="currentTask == 'Daily'" class="w-full xt-theme-b" />
          <Activity v-else-if="currentTask == 'Activity'" />
          <Set v-else-if="currentTask == 'Set'" />
        </div>
      </div>
    </div>
  </xt-modal>
</template>

<script setup>
import { ref, watch, onMounted, computed } from "vue";
import { storeToRefs } from "pinia";
import { taskStore } from "../store";
import { offlineStore } from "../../../js/common/offline";
import Primary from "./primary/index.vue";
import Branch from "./branch/index.vue";
import Activity from "./activity/index.vue";
import Daily from "./daily/Daily.vue";
import Set from "./Set.vue";
import { tasks } from "../page/branch/Branch.ts";
import { useToast } from "vue-toastification";

// import Exit from "../components/Exit.vue";

import { getAllTask } from "../api";
onMounted(() => {
  const toast = useToast();
  toast.clear();
  currentTask.value = "Primary";
});
let currentTask = ref("Primary");
let task = ref([]);
let icon = ref("");
const store = taskStore();

const { updateTime, currentUpdateTime, currentTaskList } = storeToRefs(store);
let Offline = offlineStore();
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
const menusList = computed(() => {
  if (Offline.isOffline) {
    let tmp = ref([]);
    tmp.value = menus.value.filter((i) => {
      return i.value != "chats" && i.value != "Activity";
    });
    return tmp.value;
  } else {
    return menus.value;
  }
});
// 任务配置
let menus = ref([
  {
    // slot: "star",
    newIcon: "fluent-emoji:star",
    value: "Primary",
    title: "主线任务",
    callBack: selectTab,
    name: "主线",
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
    value: "efficiency",
    callBack: selectBranchTab,
    name: "效率",
  },
  {
    newIcon: "fluent-emoji:joystick",
    title: "游戏辅助",
    value: "games",
    callBack: selectBranchTab,
    name: "游戏",
  },
  {
    newIcon: "fluent-emoji:thought-balloon",
    title: "社群沟通",
    value: "association",
    callBack: selectBranchTab,
    name: "社群",
  },
  //   newIcon: "fluent-emoji:bullseye",
  //   value: "Daily",
  //   title: "每日",
  //   callBack: selectTab,
  //   name: "活动",
  // },
  // {
  //   newIcon: "fluent:building-shop-16-regular",
  //   value: "Set",
  //   title: "设置",
  //   callBack: selectTab,
  // },
  {
    newIcon: "fluent:settings-16-regular",
    value: "Set",
    title: "设置",
    callBack: selectTab,
  },
]);

/**
 * 打开弹窗处理任务是否更新
 */
const updateTaskList = async () => {
  let { code, data } = await getAllTask();
  if (code !== 200) return;
  currentTaskList.value = data;
};

// if (
//   currentTaskList.value.length <= 0 ||
//   updateTime.value != currentUpdateTime.value
// ) {
//   updateTaskList();
// }
</script>

<style lang="scss" scoped></style>
