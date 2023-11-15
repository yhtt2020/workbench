<template>
 <div class="flex w-full mb-5 h-10 items-center justify-center" style="position: relative;">
  <div class="flex items-center justify-center back-button" v-if="back">
   <xt-button w="40" h="40" style="border-radius: 8px;" class="category-button" @click="backButton">
    <div class="flex items-center justify-center">
     <AddIcon icon="fluent:chevron-left-16-filled" style="font-size: 1.5em;color: var(--secondary-text);"/>
    </div>
   </xt-button>
  </div>
  <span class="font-16 font-400 xt-text">{{title}}</span>
  <div class="close-button flex items-center justify-center">
   <xt-button w="40" h="40" style="border-radius: 8px;" class="category-button" @click="closeButton">
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
 props:['title','back'],

 components:{
  AddIcon
 },

 methods:{
  closeButton(){
   this.$emit('close')
  },
  backButton(){
   this.$emit('back')
  }
 }
}
</script>

<style lang="scss" scoped>
.close-button {
 position: absolute;
 top: 1px;
 right: 12px;
}

.back-button{
 position: absolute;
 top: 1px;
 left: 12px;
}
</style>