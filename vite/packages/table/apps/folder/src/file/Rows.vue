<template>
  <div
    class="flex flex-col items-center justify-center mx-1.5"
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
import { onBeforeUnmount } from "vue";
const props = defineProps({
  item: {},
});

onBeforeUnmount(() => {
  console.log("删除了 :>> ", 11111);
});
</script>

<style lang="scss" scoped></style>
