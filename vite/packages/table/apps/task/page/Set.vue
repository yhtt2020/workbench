<template>
  <xt-title>设置</xt-title>
  <div class="xt-bg-2 p-4 rounded-xl">
    <xt-title m=""
      >显示在底部导航

      <template #right>
        <a-switch v-model:checked="task.isTask"></a-switch>
      </template>
    </xt-title>
    <xt-title type="text" m="mt"
      >开启后会在底部导航右侧显示「任务中心」入口，你可以在这里快速访问。
    </xt-title>
  </div>
</template>

<script setup>
import { taskStore } from "../store";
const task = taskStore();
</script>

<style lang="scss" scoped></style>
