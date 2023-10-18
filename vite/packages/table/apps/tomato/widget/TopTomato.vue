<template>
  <xt-button @click="onChangeFull" :h="30" :w="80" v-if="this.isState&&this.running" class="tomato-timer pointer no-drag   mr-2 "
             :style="{'background' : this.isColor}">
    <div style="display: flex;justify-content: space-evenly;
        align-items: center;font-family: Oswald-SemiBold;color: rgba(255, 255, 255, 0.85);" >
      <Icon class="mr-1" icon="fluent-emoji:tomato" style="font-size: 20px;"/>
      {{ displayNum(minutes) }}:{{ displayNum(seconds) }}
    </div>
    <div style="position: absolute;left:0;top:31px" v-show="isFullState">
      <TomatoTimer :isTop="true"/>
    </div>
  </xt-button>
</template>
<script>
import { tomatoStore } from '../store'
import { mapActions, mapState, mapWritableState } from 'pinia'
import TomatoTimer from '../page/Clock.vue'
import { Icon } from '@iconify/vue'

export default {
  name: 'Promotion',
  components: {
    TomatoTimer,
    Icon,
  },
  computed: {
    ...mapWritableState(tomatoStore, ['hours', 'minutes', 'seconds', 'isColor', 'isState', 'running', 'isFullState']),
  },
  data () {
    return {}
  },
  mounted () {

  },
  watch: {},
  methods: {
    ...mapActions(tomatoStore, ['onChangeFull']),
    // 时间格式
    displayNum (num) {
      if (num < 10) {
        return '0' + num
      } else {
        return num
      }
    },
  },
}
</script>

<style scoped>

.tomato-timer {
  background: #E7763E;
  z-index: 100;
  position: relative;
}


</style>
