<template>
  <div class="item-content">
    <svg v-if="item.type==='icon'" style="margin-top: 7px" :style="getStyle" class="icon group-icon" aria-hidden="true">
      <use v-bind:xlink:href="'#icon-'+item.icon.name"></use>
    </svg>

    <div class="text-icon" v-if="item.type==='font'" :style="{'font-size':item.font.size+'px',color:item.font.color,'background':item.font.bgColor}">
      {{ item.font.text }}
    </div>
  </div>
</template>

<script>
import { deckStore } from '../../../store/deck'
import { mapState } from 'pinia'

export default {
  name: 'DeckItem',
  props: ['item'],
  computed: {
    ...mapState(deckStore, ['settings']),
    getStyle () {
      let width = 80
      switch (this.settings.iconSize) {
        case 'small':
          width = 40
          break
        case 'middle':
          width = 80
          break
        case 'large':
          width = 160
          break
        default:
          width = 80
      }
      return { 'font-size': width-10 + 'px' }
    }
  }
}
</script>

<style scoped>

</style>
