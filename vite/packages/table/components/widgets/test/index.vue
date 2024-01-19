<template>
  <xt-container
    :customIndex="customIndex"
    :customData="customData"
    :size="customData.size"
  >
  {{ customData.name }}
  </xt-container>
</template>

<script setup>
const props = defineProps({
  customIndex: {},
  customData: {
    size: {},
    name:{}
  },
});
</script>

<style lang="scss" scoped></style>
