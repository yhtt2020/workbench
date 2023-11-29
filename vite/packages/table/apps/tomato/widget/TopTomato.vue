<template>
  <xt-button @click="onChangeFull" h="28" v-if="this.isState&&this.running" class="tomato-timer pointer no-drag   mr-2 "
             :style="{'background' : 'var(--secondary-transp-bg)','border-radius':'6px',width:'auto !important',padding:'4px !important'}">
    <div class="flex items-center justify-center">
      <div class="flex items-center justify-center w-5 h-5">
        <Icon class="mr-0.5" icon="fluent-emoji:tomato"  style="font-size: 20px;"/>
      </div>
      <span class="xt-text xt-font font-14 ">{{ displayNum(minutes) }}:{{ displayNum(seconds) }}</span>
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
  background: var(--secondary-transp-bg);
  z-index: 100;
  position: relative;
}


</style>
