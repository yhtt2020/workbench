<template>
 <template v-if="controlIndex === 'audio'">
  <div  class="xt-bg rounded-xl flex flex-col items-center justify-center relative" style="height:120px;width: 252px;" >
   <div class="absolute" style="top: 7px;right:-4px;" v-if="status === 'del'">
    <xt-button style="width: auto !important;" h="0">
      <div class="flex items-center justify-center">
        <xt-new-icon icon="fluent:subtract-circle-16-filled" size="20" :color="'var(--error)'"></xt-new-icon>
      </div>
    </xt-button>
   </div>
   <!-- <div class="w-14 h-14 flex items-center xt-bg-t-2 justify-center rounded-full mb-3">
    <xt-new-icon :icon="controlItem.icon" size="24"></xt-new-icon>
   </div>
   <span class="xt-text">{{controlItem.name}}</span> -->
  </div>
 </template>

 <template v-else>
  <div  class="xt-bg rounded-xl flex flex-col items-center justify-center relative" style="height: 120px;width: 120px;" >
   <div class="absolute" style="top: 7px;right:-4px;" v-if="status === 'del'">
    <xt-button style="width: auto !important;" h="0">
      <div class="flex items-center justify-center">
        <xt-new-icon icon="fluent:subtract-circle-16-filled" size="20" :color="'var(--error)'"></xt-new-icon>
      </div>
    </xt-button>
   </div>
   <div class="w-14 h-14 flex items-center xt-bg-t-2 justify-center rounded-full mb-3">
    <xt-new-icon :icon="controlItem.icon" size="24"></xt-new-icon>
   </div>
   <span class="xt-text">{{controlItem.name}}</span>
  </div>
 </template>
</template>

<script setup>

const props = defineProps({
 controlIndex:{
  type:String,
 },
 controlItem:{
  type:Object,
  default:()=>{}
 },
 status:{
  type:String,
  default:'null'
 }
})

</script>

<style lang="scss" scoped>

</style>