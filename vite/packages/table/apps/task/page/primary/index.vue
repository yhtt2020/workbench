<template>
  <div class="flex justify-center">
    <xt-option-tab
      v-model="currentTab"
      style="width: 248px; height: 32px"
      :list="list"
      class="xt-bg-t-2 p-1 h-8 mb-3"
    />
    <Exit />
  </div>
  <Primary v-if="currentTab == 'Primary'" />
  <Complete v-else />
</template>

<script setup>
import { ref, reactive, computed } from "vue";
import Primary from "./Primary.vue";
import Complete from "./Complete.vue";
import Exit from "../../components/Exit.vue";
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
