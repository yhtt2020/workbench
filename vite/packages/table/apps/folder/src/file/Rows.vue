<template>
  <div
    class="flex flex-col items-center justify-center mx-1.5 xt-theme-b"
    style="width: 72px; height: 72px; margin-bottom: 7.5px"
  >
    <div class="" style="min-width: 40px; height: 40px">
      <img :src="item.icon" class="w-full h-full" />
    </div>
    <div class="w-full xt-text-2 text-sm truncate mt-1 text-center">
      {{ item.name }}
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  item: {},
});
</script>

<style lang="scss" scoped></style>
