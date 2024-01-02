<template>
 <div class="w-full px-4 pb-3 pt-5 h-full flex flex-col">
   <div class="flex items-center justify-between">
     <div class="flex items-center justify-center">
       <xt-new-icon icon="fluent:send-32-regular" size="16"></xt-new-icon>
       <span class="xt-font xt-text font-14 ml-3">发消息</span>
     </div>
     <div class="flex items-center justify-center">

      <xt-select style="width: 127px;" :list="list" :border="false" zIndex="1200" :borderClass="'rounded-md'"></xt-select>
      <xt-button w="56" h="32" type="theme" style="border-radius: 8px;" class="mx-3" @click="send">
        <div class="flex items-center justify-center" v-if="isLoading === false" >
          <span class="xt-font xt-active-text font-14">发送</span>
        </div>
        <a-spin v-else size="small" style="color: var(--active-text) !important;"></a-spin>
      </xt-button>
      <xt-button w="32" h="32" style="border-radius: 8px;" @click="closeSend">
        <div class="flex items-center justify-center">
          <xt-new-icon icon="fluent:dismiss-16-regular" size="16"></xt-new-icon>
        </div>
      </xt-button>
     </div>
   </div>

   <div class="flex-1 w-full h-4/5">
      <EditSection />
   </div>

   <div class="h-10 flex items-center justify-between w-full">
     <div class="flex">
       <xt-button w="32" h="32" class="xt-bg-t-2 mr-3" style="border-radius: 8px;">
        <div class="flex items-center justify-center">
          <xt-new-icon icon="fluent:image-multiple-16-regular" size="16"></xt-new-icon>
        </div>
       </xt-button>
       <xt-button w="32" h="32" class="xt-bg-t-2 mr-3" style="border-radius: 8px;">
         <div class="flex items-center justify-center">
           <xt-new-icon icon="fluent:attach-16-regular" size="16"></xt-new-icon>
         </div>
       </xt-button>
       <xt-button w="32" h="32" class="xt-bg-t-2 mr-3" style="border-radius: 8px;">
        <div class="flex items-center justify-center">
          <xt-new-icon icon="fluent:link-20-filled" size="16"></xt-new-icon>
        </div>
       </xt-button>
       <xt-button w="32" h="32" class="xt-bg-t-2" style="border-radius: 8px;">
        <div class="flex items-center justify-center">
          <xt-new-icon icon="tabler:brand-bilibili" size="16"></xt-new-icon>
        </div>
       </xt-button>
     </div>
     <div class="flex items-center justify-center">
      <span class="xt-font xt-text-2 font-14 ">消息有效期：</span>
      <a-date-picker :bordered="false" v-model:value="value1"/>
     </div>
   </div>
 </div>
</template>

<script setup>
import { ref, } from 'vue';

// 导入消息发送编辑模块
import EditSection from './EditSection.vue';














import dayjs, { Dayjs } from 'dayjs';

const emits = defineEmits(['close']);
const dateFormat = 'YYYY/MM/DD';

const isLoading = ref(false);

const value1 = ref(dayjs('2024/01/29',dateFormat))

const list = ref([
  { name:'普通通知类型',value:'1' },
  { name:'强制弹窗类型',value:'2' }
])


const closeSend = () =>{
  emits('close');
}

const send = () =>{
  isLoading.value = true;
  setTimeout(()=>{
    isLoading.value = false;
  },1000)
}


</script>
 
<style lang="scss" scoped>
:deep(.ant-spin){
  & .ant-spin-dot{
    & .ant-spin-dot-item{
      background-color: var(--active-text) !important;
    }
  }
}

:deep(.ant-select-selector){
  height: 32px !important;
  & .ant-select-selection-item{
    line-height: 32px !important;
  }
}

:deep(.ant-picker .ant-picker-suffix){
  display: none !important;
}
:deep(.ant-picker.ant-picker-borderless){
  background-color: var(--secondary-transp-bg) !important;
  border-radius: 8px !important;
}
</style>