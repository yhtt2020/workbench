<template>
 <div class="flex w-full mb-5 h-10 items-center justify-center" style="position: relative;">
  <span class="font-16 font-400 xt-text">{{title}}</span>
  <div class="close-channel flex items-center justify-center">
   <xt-button w="40" h="40" class="category-button" @click="closeButton">
    <div class="flex items-center justify-center">
     <AddIcon icon="fluent:dismiss-16-filled" style="font-size: 1.25em;color: var(--secondary-text);"/>
    </div>
   </xt-button>
  </div>
 </div>
</template>

<script>
import { Icon as AddIcon } from '@iconify/vue'
export default {
 props:['title'],

 components:{
  AddIcon
 },

 methods:{
  closeButton(){
   this.$emit('close')
  }
 }
}
</script>

<style lang="scss" scoped>
.close-channel {
 position: absolute;
 top: 1px;
 right: 12px;
}
</style>