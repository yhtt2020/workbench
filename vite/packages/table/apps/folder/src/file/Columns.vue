<template>
  <div class="flex w-full h-11 items-center mb-2">
    <div class="w-8 h-8 ml-1 mr-3" style="min-width: 32px">
      <img :src="item.icon" class="w-full h-full" />
    </div>
    <div class="w-full xt-text-2 text-sm truncate">
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
