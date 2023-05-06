<template>
  <HomeComponentSlot :customIndex="customIndex" :customData="customData" :options="options">
      音量
  </HomeComponentSlot>
</template>

<script>
import HomeComponentSlot from '../HomeComponentSlot.vue'
export default {
  name:'Voice',
  components:{
    HomeComponentSlot
  },
  props:{
    customIndex: {
      type: Number,
      default: 0
    },
    customData: {
      type: Object,
      default: () => {}
    },
    confirmCCData: {
      type: Function,
      default: () => {}
    }
  },
  data(){
    return{
      options: {
        className: 'card',
        title: '音频',
        icon: 'sound',
        type: 'games',
      },
    }
  }
  
}
</script>

<style lang="scss" scoped>

</style>