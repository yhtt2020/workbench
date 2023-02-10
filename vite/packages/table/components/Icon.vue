<template>
  <svg class="icon" :style="style" aria-hidden="true">
    <use v-bind:xlink:href="icon"></use>
  </svg>

</template>

<script>
export default {
  name: 'Icon',
  props:['icon','style']
}
</script>

<style scoped>

</style>
