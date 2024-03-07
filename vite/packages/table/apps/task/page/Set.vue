<template>
  <div class="flex flex-col">
    <div class="flex  items-center justify-between mb-2">
      <xt-title>设置</xt-title>
      <Exit />
    </div>
    <div class="xt-bg-2 p-4 rounded-xl">
      <xt-title m=""
        >显示在底部导航
  
        <template #right>
          <a-switch v-model:checked="task.isTask"></a-switch>
        </template>
      </xt-title>
      <xt-title type="text" m="mt"
        >开启后会在底部导航显示「任务中心」入口，你可以在这里快速访问。
      </xt-title>
    </div>
  </div>
</template>

<script setup>
import { taskStore } from "../store";

import Exit from "../components/Exit.vue";

const task = taskStore();
</script>

<style lang="scss" scoped></style>
