<template>
  <div
    class="flex justify-between items-center text-base xt-text"
    :class="titleClass"
  >
    <div>
      <slot></slot>
    </div>
    <div>
      <slot name="right"></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {},
    titleClass: {
      default: "my-4",
    },
  },
};
</script>

<style lang="scss" scoped></style>
