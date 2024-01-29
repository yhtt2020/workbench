<template>
  <div class="flex flex-col items-center justify-center mr-3">
    <div class="xt-title-font text-lg" style="font-size: 20px">
      {{ id }}
    </div>
    <div
      style="background: #fa7b14; border-radius: 6px; height: 3px; width: 9px"
    ></div>
  </div>
</template>

<script setup>
const props = defineProps({
  id: {},
});
</script>

<style lang="scss" scoped></style>
