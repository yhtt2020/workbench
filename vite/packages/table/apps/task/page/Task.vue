<template>
  <xt-popup v-model="task.isTaskDrawer" v-if="task.isTaskDrawer">
    <div class="xt-modal flex py-3 pr-3" style="width: 500px; height: 100%">
      <xt-left-menu :list="menus" last="1">
        <template #star>
          <StarFilled  />
        </template>
        <template #flag>
          <FlagOutlined />
        </template>

        <template #info>
          <InfoCircleOutlined />
        </template>
      </xt-left-menu>
      <div class="w-full xt-scrollbar">
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
import {
  StarFilled,
  FlagOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons-vue";

let currentTask = ref("Primary");
const task = taskStore();
// 切换任务
const selectTab = (item) => {
  currentTask.value = item.value;
};

// 任务配置
const menus = ref([
  {
    slot: "star",
    value: "Primary",
    callBack: selectTab,
  },
  {
    slot: "flag",
    value: "Branch",
    callBack: selectTab,
  },
  // {
  //   slot: "info",
  //   value: "Branch",
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
