<template>
 <div class="flex  w-full flex-col p-4">
  <div class="mb-4 flex justify-between items-center  w-full">
    <xt-button w="32" h="32" style="border-radius: 8px;">
     <div class="flex items-center justify-center">
      <xt-new-icon icon="fluent:chevron-left-16-regular" size="20"></xt-new-icon>
     </div>
    </xt-button>
    <xt-tab :list="tabList" v-model="tabValue" class="xt-bg-2 p-1 h-8 " style="width: 248px;border-radius: 8px;"></xt-tab>
    <div class="flex items-center justify-center">
     <xt-button w="32" h="32" style="border-radius: 8px;" class="mr-3">
       <div class="flex items-center justify-center">
        <xt-new-icon icon="fluent:compose-16-regular" size="20"></xt-new-icon>
       </div>
     </xt-button>
     <xt-button w="32" h="32" style="border-radius: 8px;" @click="closeDetail">
      <div class="flex items-center justify-center">
       <xt-new-icon icon="fluent:dismiss-16-regular" size="20"></xt-new-icon>
      </div>
     </xt-button>
    </div>
  </div>
  <template v-if="tabValue === 'content'">
   
  </template>

  <template v-else>
   
  </template>
 </div>
</template>

<script setup>
import { ref } from 'vue';

const emit = defineEmits(['close']);

const tabList = ref([
 { name:'消息内容',value:'content',},
 { name:'接收情况',value:'receive' },
]);
const tabValue  = ref('content');

// 关闭弹窗
const closeDetail = () =>{
  emit('close');
}


</script>

<style lang="scss" scoped>

</style>