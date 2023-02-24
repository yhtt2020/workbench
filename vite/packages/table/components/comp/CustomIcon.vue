<template>
  <svg class="icon group-icon" aria-hidden="true">
    <use v-bind:xlink:href="'#icon-'+icon.name"></use>
  </svg>
</template>

<script>
export default {
  name: 'CustomIcon',
  props:['icon'],

}
</script>

<style scoped>

</style>
