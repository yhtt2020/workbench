<template>
  <div class="flex justify-between items-center text-base my-5 xt-text">
    <div>
      <slot></slot>
    </div>
    <div >
      <slot name="right"></slot>
    </div>
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
