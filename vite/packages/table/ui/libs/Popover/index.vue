<template>
  <div class="relative">
    <slot></slot>
    <div
      class="absolute xt-modal rounded-xl p-3 xt-b"
      style=""
      v-if="modelValue"
    >
      <slot name="tip"></slot>
    </div>
  </div>
</template>
<script setup>
const props = defineProps({
  modelValue: {},
});
</script>
