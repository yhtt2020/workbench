<template>
  <div></div>
</template>

<script setup lang="ts">
import { getCurrentInstance } from 'vue';

// 全局导入
const { proxy }: any = getCurrentInstance();
// 局部导入
// import { confirm } from "../../../ui/new/confirm/index";
// 组合式API
window.$ui.confirm("麦麦麦", "我吃麦当劳，你吃麦当劳，我们都吃麦当劳", {
  ok: () => {
    console.log("111 :>> ", 111);
  },
  no: () => {
    console.log("222 :>> ", 222);
  },
  noText: null,
});

// 选项式API
// window.$ui.confirm("麦麦麦", "我吃麦当劳，你吃麦当劳，我们都吃麦当劳", {
//   ok: () => {
//     console.log("111 :>> ", 111);
//   },
//   no: () => {
//     console.log("222 :>> ", 222);
//   },
//   noText: null,
// });
</script>

<style lang="scss" scoped></style>
