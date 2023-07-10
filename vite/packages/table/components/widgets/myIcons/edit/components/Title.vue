<template>
  <div class="flex justify-between items-center text-base my-4">
    <slot></slot>
    <slot name="right"></slot>
  </div>
</template>

<script>
export default {
  props: {
    title: {},
  },
};
</script>

<style lang="scss" scoped></style>
