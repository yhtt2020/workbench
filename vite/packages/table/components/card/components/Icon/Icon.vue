<template>
  <svg class="icon" :style="style" aria-hidden="true">
    <use v-bind:xlink:href="'#icons-' + icon"></use>
  </svg>
</template>

<script>
export default {
  name: "Icon",
  props: ["icon", "style"],
};
</script>

<style scoped>
.icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>
