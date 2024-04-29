<!-- 社群成员管理页面 -->
<template>
  <div class="w-full h-full flex flex-col">
    <div
      style="width: 572px"
      class="flex mb-3 items-center h-10 justify-between"
    >
      <xt-option-tab
        :list="memberTab"
        v-model="currentTab"
        :circle="true"
        style="height: 40px;width: 304px;"
      />


    </div>

    <div class="flex flex-col flex-grow " style="width: 572px;height: calc(100vh - 100px / 1.25);">

    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const memberTab = ref([
  {
    name: "成员管理(23)",
    value: "manage",
  },
  {
    name: "申请审核(12)",
    value: "apply",
  },
]);

const currentTab = ref('manage');

</script>

<style lang="scss" scoped>
</style>
