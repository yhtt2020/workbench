<template>
  <xt-tab v-model="currentTab" :list="list" class="xt-bg-2 p-1 h-12 mb-3" />
  <Primary v-if="currentTab == 'Primary'" />
  <Complete v-else />
</template>

<script setup>
import { ref, reactive, computed } from "vue";
import Primary from "./Primary.vue";
import Complete from "./Complete.vue";
const currentTab = ref("Primary");
const list = ref([
  {
    name: "主线任务",
    value: "Primary",
  },
  {
    name: "已完成",
    value: "Complete",
  },
]);
</script>

<style lang="scss" scoped></style>
