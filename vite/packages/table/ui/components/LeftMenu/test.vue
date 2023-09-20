<template>
  <tippy
    v-if="item.float"
    :trigger="item.float ? 'mouseenter' : ''"
    :interactive="true"
    placement="right"
    :arrow="false"
  >
    <template #content>
      <slot name="content"> </slot>
    </template>
    这是插槽
    <slot></slot>
  </tippy>
  <slot v-else></slot>
  <!-- {{ item }} -->
</template>

<script setup>
const props = defineProps({
  item: {},
});
</script>

<style lang="scss" scoped></style>
