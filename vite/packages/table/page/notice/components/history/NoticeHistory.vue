<template>
 <div class="p-4 w-full flex flex-col h-full">
  <div class="w-full flex items-center justify-between">
    <div class="flex items-center justify-center">
       <xt-new-icon icon="fluent:clock-16-regular" size="16"></xt-new-icon>
       <span class="xt-font xt-text font-14 font-400 ml-3">历史消息</span>
    </div>
    <xt-button w="32" h="32" style="border-radius: 8px;" @click="closeModal">
      <div class="flex items-center justify-center">
        <xt-new-icon icon="fluent:dismiss-16-regular" size="16"></xt-new-icon>
      </div>
    </xt-button>
  </div>
 </div>
</template>

<script setup>

const emit = defineEmits(['close']);

const closeModal = () =>{
 emit('close')
}

</script>

<style lang="scss" scoped>

</style>