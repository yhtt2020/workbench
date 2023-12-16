<template>
  <xt-button @click="close" w="32" h="32" style="border-radius:8px; margin-right: 0 !important;" class="xt-bg-2" >
   <div class="flex items-center justify-center">
     <CloseIcon icon="fluent:dismiss-16-regular" style="font-size: 1rem;"/>
   </div>
  </xt-button>
</template>

<script setup>
import { getCurrentInstance } from 'vue';
import { Icon as CloseIcon } from '@iconify/vue';

const { proxy } = getCurrentInstance();

const close = ()=>{
 proxy.$mit.emit('closePaper');
}

</script>

<style lang="scss" scoped>

</style>