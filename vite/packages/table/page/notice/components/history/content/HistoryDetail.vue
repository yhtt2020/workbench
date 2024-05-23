<template>
 <div class="flex  w-full flex-col p-4" v-if="!editVisible">
  <div class="mb-4 flex justify-between items-center  w-full">
    <xt-button w="32" h="32" style="border-radius: 8px;" @click="backClick">
     <div class="flex items-center justify-center">
      <xt-new-icon icon="fluent:chevron-left-16-filled" size="20"></xt-new-icon>
     </div>
    </xt-button>
    <xt-tab :list="tabList" v-model="tabValue" class="xt-bg-2 p-1 h-8 " style="width: 248px;border-radius: 8px;"></xt-tab>
    <div class="flex items-center justify-center">
     <xt-button w="32" h="32" style="border-radius: 8px;" class="mr-3" @click="previewHistory">
       <div class="flex items-center justify-center">
        <xt-new-icon icon="fluent:compose-16-filled" size="20"></xt-new-icon>
       </div>
     </xt-button>
     <xt-button w="32" h="32" style="border-radius: 8px;" @click="closeDetail">
      <div class="flex items-center justify-center">
       <xt-new-icon icon="fluent:dismiss-16-filled" size="20"></xt-new-icon>
      </div>
     </xt-button>
    </div>
  </div>
  <template v-if="tabValue === 'content'">
    <HistoryDetailContent />
  </template>
  <template v-else>
    <ReceiveContent :isFull="isFull"/>
  </template>
 </div>


 <template v-else>
  <HistoryEditDetail @prev="editVisible = false" @close="closeDetail"/>
 </template>

</template>

<script setup>
import { ref } from 'vue';

import HistoryEditDetail from '../edit/HistoryEditDetail.vue';
import HistoryDetailContent from './HistoryDetailContent.vue';
import ReceiveContent from './ReceiveContent.vue';

const emit = defineEmits(['close','back']);
const props = defineProps({ isFull:Boolean });


const tabList = ref([
 { name:'消息内容',value:'content',},
 { name:'接收情况',value:'receive' },
]);
const tabValue  = ref('content');
const editVisible = ref(false);

// 关闭弹窗
const closeDetail = () =>{
  emit('close');
}

// 返回
const backClick = () =>{
  emit('back')
}

// 点击编辑
const previewHistory = ()=>{
  editVisible.value = true
}


</script>

<style lang="scss" scoped>

</style>
