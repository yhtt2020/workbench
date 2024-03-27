<template>
  <!-- <xt-button @click="onChangeFull" h="28" v-if="this.isState&&this.running" class="mr-2 tomato-timer pointer no-drag "
             :style="{'background' : 'var(--secondary-transp-bg)','border-radius':'6px',width:'auto !important',padding:'4px !important'}">
    <div class="flex items-center justify-center py-0.5">
      <div class="flex items-center justify-center w-5 h-5 mr-1">
        <Icon icon="fluent-emoji:tomato"  style="font-size: 20px;"/>
      </div>
      <span class="xt-text xt-font font-14 ">{{ displayNum(minutes) }}:{{ displayNum(seconds) }}</span>
    </div> -->
    <div style="position: absolute;" v-if="tomatoVisible" :style="{left:position.x+'px',top:position.y+'px'}">
      <TomatoTimer :isTop="true"/>
    </div>
  <!-- </xt-button> -->
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
  props: {
    position:{
      type:Object,
      default:()=>{
        return {
          x:30,
          y:60
        }
      }
    },
    tomatoVisible: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapWritableState(tomatoStore, ['hours', 'minutes', 'seconds', 'isColor', 'isState', 'running', 'isFullState']),
  },
  data () {
    return {}
  },
  mounted () {
    console.log(this.position)
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
