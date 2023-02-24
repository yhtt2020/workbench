<template>
  <div class="item">
    <div class="item-content">
      <!-- Safe zone, enter your custom markup -->
      <svg v-if="item.icon" style="width: 65px;height: 65px;margin-top: 7px" class="icon group-icon" aria-hidden="true">
        <use v-bind:xlink:href="'#icon-'+item.icon.name"></use>
      </svg>
      <div class="my-custom-content">{{item.title}}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DeckItem',
  props:['item']
}
</script>

<style scoped>

</style>
