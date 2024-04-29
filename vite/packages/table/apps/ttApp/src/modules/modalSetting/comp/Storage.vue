<script setup lang="ts">
import { inject } from "vue";
import { storeToRefs } from "pinia";

import { useTTAppStore } from "../../../store";
const ttappStore: any = useTTAppStore();
const data = inject("data");
const clearData = () => {
  window.$ui.confirm("确定清除应用数据？", "清除后将恢复为初始安装状态", {
    type: "warning",
    ok() {
      console.log("data :>> ", data);
    },
  });
};
const deleteData = () => {
  window.$ui.confirm("确定删除应用？", "删除后将无法恢复", {
    type: "warning",
    ok() {
      console.log("data :>> ", data);
    },
  });
};
</script>

<template>
  <xt-option-box>
    <div class="flex text-sm mb-[15px] justify-between">
      <div>应用数据</div>
      <div class="tt-text-2"></div>
    </div>
  </xt-option-box>
  <xt-button class="xt-main-bg" h="32" block @click="clearData">
    <div class="tt-text-2 text-sm">清除应用数据</div>
  </xt-button>
  <div class="tt-text-2 text-xs mt-1 mb-3">
    这将会删除应用保存的数据，如个人设置偏好等，将应用恢复为初始安装状态。
  </div>
  <xt-button class="xt-main-bg" h="32" block @click="deleteData">
    <div class="tt-error text-sm">完全删除应用</div></xt-button
  >
  <div class="tt-text-2 text-xs mt-1">
    这将会完全卸载应用，同时会删除所有相关删除，此操作不可撤销。
  </div>
</template>
<style lang="scss" scoped></style>
