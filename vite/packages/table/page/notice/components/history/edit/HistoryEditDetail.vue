<template>
 <div class="w-full flex-col flex px-4 pt-4">
  <div class="flex justify-between items-center mb-4">
   <div class="flex">
     <xt-button w="32" h="32" style="border-radius: 8px;" @click="prevBack">
       <div class="flex items-center justify-center">
        <xt-new-icon icon="fluent:chevron-left-16-filled" size="20"></xt-new-icon>
       </div>
     </xt-button>
   </div>
   <div class="flex items-center ">
    <div class="flex items-center mr-3">
     <span class="xt-font xt-text font-14">To：</span>
     <xt-select style="width: 110px;" :disabled="true" v-model="msgSetting.targetType" :list="targetList"  :border="false" zIndex="1200" :borderClass="'rounded-md'"></xt-select>
    </div>
    <xt-select style="max-width: 137px;" :disabled="true" :list="list" v-model="msgSetting.noticeType" :border="false" zIndex="1200" :borderClass="'rounded-md'"></xt-select>
    <xt-button w="60" h="32" style="border-radius: 8px;" class="mx-3" type="theme">
     保存
    </xt-button>
    <xt-button w="32" h="32" style="border-radius: 8px;" @click="closeSend">
     <div class="flex items-center justify-center">
      <xt-new-icon icon="fluent:dismiss-16-filled" size="16"></xt-new-icon>
     </div>
    </xt-button>
   </div>
  </div>

  <div class="flex w-full h-full">
   <XtScrollbar  :y="true" style="height: 100%;width: 100%;">
    <a-input class="h-10 xt-bg-t-2 " v-model:value="msgSetting.title" style="border-radius: 10px;margin-bottom: 16px;border: 1px solid var(--divider) !important;" :bordered="true" placeholder="标题"></a-input>
    <a-textarea  placeholder="摘要（选填）" v-model:value="msgSetting.summary"  class="xt-bg-t-2" style="border-radius: 10px;margin-bottom: 16px;border: 1px solid var(--divider) !important;" :bordered="true" :rows="4" />
    <MsgMarkdown ref="msgRef" :msgContent="msgSetting.content"/>
   </XtScrollbar>
  </div>

  <div class="flex justify-between items-center py-3">
    <div class="flex ">
      <xt-button w="32" h="32" style="border-radius: 8px;" class="mr-3">
       <div class="flex items-center justify-center">
         <xt-new-icon icon="fluent:image-multiple-16-filled" size="16"></xt-new-icon>
       </div>
      </xt-button>

      <xt-button w="32" h="32" style="border-radius: 8px;" class="mr-3">
        <div class="flex items-center justify-center">
          <xt-new-icon icon="fluent:attach-16-filled" size="16"></xt-new-icon>
        </div>
      </xt-button>

      <xt-button w="32" h="32" style="border-radius: 8px;" class="mr-3">
        <div class="flex items-center justify-center">
          <xt-new-icon icon="fluent:link-20-filled" size="16"></xt-new-icon>
        </div>
      </xt-button>

      <xt-button w="32" h="32" style="border-radius: 8px;">
        <div class="flex items-center justify-center">
          <xt-new-icon icon="tabler:brand-bilibili" size="16"></xt-new-icon>
        </div>
      </xt-button>
    </div>
    <div class="flex items-center">
      <span class="font-14 xt-text xt-font pr-2">消息有效期:</span>
      <a-date-picker :bordered="false" v-model:value="cutOffDate" />
    </div>
  </div>
 </div>
</template>

<script setup>
import { ref,onMounted,computed,nextTick}  from 'vue';
import MsgMarkdown from '../../send/MsgMarkdown.vue';
import dayjs, { Dayjs } from 'dayjs';

const emits = defineEmits(['prev','close']);

// 通知类型
const list = ref([
  { name:'普通通知类型',value:1 },
  { name:'强制弹窗类型',value:2 }
])
// 发送目标
const targetList = ref([
  { name:'全员',value:1000 },
  { name:'小队', value:1001},
  { name:'社群',value:1002 },
  { name:'指定用户',value:1003 }
])
const msgSetting = ref({
 title:'',
 summary:'',
 targetType:1000,
 noticeType:1,
 content:'',
 cover:[{cover:'https://jxxt-1257689580.cos.ap-chengdu.myqcloud.com/wRPh-ILyc-lb45-ldQ3'}],
 Attachment:[],
 buttonLink:[],
 biliLink:[{title:'电脑副屏系统想天工作台搭配闪蛇ZB133TF便携屏',url:''}],
})

const msgRef = ref(null);
const dateFormat = ref('YYYY-MM-DD HH:mm');
const cutOffDate = ref(dayjs(`${new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()} ${new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000).toTimeString()}`),dateFormat)


// 返回上一步
const prevBack = () =>{
 emits('prev');
}

// 关闭弹窗
const closeSend = () =>{
 emits('close')
}



</script>

<style lang="scss" scoped>

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
  border-radius: 6px !important;
}
</style>
