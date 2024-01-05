<template>
  <div class="w-full">
    <div class="flex text-sm h-8 items-center mb-4">
      <xt-ify-icon icon="fluent-emoji:bullseye" class="mr-2" size="16" />
      每日任务
    </div>
    <div>123</div>
    <Task />
    <div class="flex text-sm h-8 items-center mb-4">
      <xt-ify-icon icon="fluent-emoji:calendar" class="mr-2" size="16" />
      每日周任务
    </div>
    <div class="flex text-sm h-8 items-center mb-4">
      <xt-ify-icon icon="fluent-emoji:crescent-moon" class="mr-2" size="16" />
      每月任务
    </div>
  </div>
</template>

<script setup>
import Task from "./Task.vue";
</script>

<style lang="scss" scoped></style>
