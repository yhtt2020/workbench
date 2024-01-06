<template>
  <xt-button
    :title="item.title"
    @click="item.fn"
    :type="item.type"
    w="40"
    h="40"
    radius="8"
    class="floatMenu xt-bg-t-2"
    :throttleTime="0"
  >
    <xt-new-icon :icon="item.icon" class="text-2" size="20" />
  </xt-button>
</template>

<script setup>
const props = defineProps({
  item: {},
});
</script>

<style lang="scss" scoped></style>
