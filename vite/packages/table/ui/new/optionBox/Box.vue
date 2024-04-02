<template>
  <div class="pb-4">
    <div class="px-4 pt-4 rounded-xl" style="padding-bottom:1px ;" :class="boxClass">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
// 自定义背景颜色
const props = defineProps({
  boxClass: {
    type: String,
    default: "xt-bg-2",
  }
})
</script>

<style lang="scss" scoped></style>
