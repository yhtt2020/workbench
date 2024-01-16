<template>
  <div class="h-full w-full flex flex-col">
    <xt-option-tab
      v-model="currentTab"
      style="width: 248px; height: 32px"
      :list="list"
      class="xt-bg-t-2 p-1 h-8 mx-auto"
    />
    <Exit class="absolute" style="top: 12px; right: 12px" />
    <xt-scrollbar class="h-full w-full" :x="false" :y="true">
      <Primary v-if="currentTab == 'Primary'" />
      <Complete v-else />
    </xt-scrollbar>
  </div>
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
