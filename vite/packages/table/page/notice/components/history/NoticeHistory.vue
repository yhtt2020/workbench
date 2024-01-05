<template>
 <div class="p-4 w-full flex flex-col h-full">
  <div class="w-full flex items-center justify-between">
    <div class="flex items-center justify-center">
       <xt-new-icon icon="fluent:clock-16-regular" size="16"></xt-new-icon>
       <span class="xt-font xt-text font-14 font-400 ml-3">历史消息</span>
    </div>

    <xt-tab :list="tabList" v-model="tabValue" class="xt-bg-2 p-1 h-8 mb-3" style="width: 248px;border-radius: 8px;"></xt-tab>

    <xt-button w="32" h="32" style="border-radius: 8px;" @click="closeModal">
      <div class="flex items-center justify-center">
        <xt-new-icon icon="fluent:dismiss-16-regular" size="16"></xt-new-icon>
      </div>
    </xt-button>
  </div>

  <template v-if="tabValue === 'all'">
    <HistoryAll />
  </template>

  <template v-else>
    <DraftBoxDetail />
  </template>
 </div>
</template>

<script setup>
import { ref } from "vue";


import HistoryAll from "./content/HistoryAll.vue";
import DraftBoxDetail from "./content/DraftBoxDetail.vue";


const emit = defineEmits(['close']);

const tabList  = ref([
  { name:'全部消息',value:'all' },
  { name:'草稿箱', value:'draft'}
])

const tabValue = ref('all')

const closeModal = () =>{
 emit('close')
}

</script>

<style lang="scss" scoped>
:deep(.cursor-pointer){
  border-radius: 8px !important;
}
</style>