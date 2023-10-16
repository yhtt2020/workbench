<template>
  <div>
    <template v-for="item in cards">
      <slot name="item" :item="item" />
    </template>
  </div>
</template>

<script setup>
const props = defineProps({
  cards: {},
});
</script>

<style lang="scss" scoped></style>
