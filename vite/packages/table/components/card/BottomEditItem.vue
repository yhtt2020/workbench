<template>
  <div
    class="w-24 h-24 mr-4 option"
    @click="
      () => {
        item.fn();
      }
    "
  >
    <xt-new-icon size="40" v-if="item.newIcon" :icon="item.newIcon" />
    <Icon class="icon" v-else-if="item.icon" :icon="item.icon"></Icon>
    {{ item.title }}
  </div>
</template>

<script setup>
const props = defineProps({
  item: {},
});
</script>

<style lang="scss" scoped></style>
