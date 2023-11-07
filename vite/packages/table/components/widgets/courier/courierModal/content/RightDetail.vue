<template>
 <div class="w-full flex flex-col" v-if="emptyObj">
  <UpdateIcon :orderData="detail" />
  <div class="px-4 rounded-lg xt-bg-2" style="height:426px;">
   <template v-if="detail?.Traces.length === 0">
    <EmptyModal />
   </template>
   <vue-custom-scrollbar :settings="settingsScroller" style="height:426px;" v-else>
    <TimeLine :list="detail?.Traces" />
   </vue-custom-scrollbar>
  </div>
 </div>
</template>

<script>
import TimeLine from '../timeLine/index.vue'
import UpdateIcon from '../updateIcon/index.vue'
import EmptyModal from '../../EmptyModal.vue'

export default {
 props:['detail'],
 
 components:{
  TimeLine,UpdateIcon,EmptyModal
 },

 data(){
  return{
   settingsScroller: {
    useBothWheelAxes: true,
    swipeEasing: true,
    suppressScrollY: false,
    suppressScrollX: true,
    wheelPropagation: true
   },
  }
 },

 computed:{
   emptyObj(){
    return Object.keys(this.detail).length !== 0 
   }
 }
 
}
</script>

<style lang="scss" scoped>

</style>