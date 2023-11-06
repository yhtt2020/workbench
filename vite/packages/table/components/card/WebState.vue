<template>
  <div class="flex flex-col justify-center items-center flex-1" v-if="false">

    <Icon icon="fluent-emoji:sleeping-face" width="56" height="56" />
    <div>功能在{{ title }}端无法使用</div>
  </div>
  <slot v-else></slot>
</template>

<script setup>
import { Icon } from "@iconify/vue";
const props = defineProps({
  title: "",
})
</script>

<style lang="scss" scoped></style>
