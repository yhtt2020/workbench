<template>
 <div class="w-full px-4 pb-3 pt-5 h-full flex flex-col">
   <div class="flex items-center justify-between mb-4">
     <div class="flex items-center justify-center">
       <xt-new-icon icon="fluent:send-32-regular" size="16"></xt-new-icon>
       <span class="xt-font xt-text font-14 ml-3">发消息</span>
     </div>
     <div class="flex items-center justify-end" style="width:500px;">
      <div class="flex items-center mr-3">
        <span class="xt-font xt-text font-14">To：</span>
        <xt-select style="width: 110px;" v-model="msgSetting.targetType" :list="targetList"  :border="false" zIndex="1200" :borderClass="'rounded-md'"></xt-select>
      </div>
      <xt-select style="max-width: 140px;" :list="list" v-model="msgSetting.noticeType" :border="false" zIndex="1200" :borderClass="'rounded-md'"></xt-select>
     
      <xt-dropdown :buttonVisible="true" w="70" title="发送" h="32" class="mx-3" :buttonClass="'xt-active-bg'" :placement="'bottomRight'">
        <template #sendTitle>
          <div class="flex items-center justify-center" v-if="isLoading === false">
            <span class="xt-font xt-active-text font-14 font-400 mr-2">发送</span>
            <xt-new-icon icon="fluent:chevron-down-16-regular" size="20"  :color="'var(--active-text)'"></xt-new-icon>
          </div> 
          <a-spin v-else size="small" style="color: var(--active-text) !important;"></a-spin>
        </template>

        <div class="xt-modal rounded-xl p-2 flex flex-col xt-b">
          <template v-for="item in sendList">
            <div class="px-3 py-2.5 flex xt-hover rounded-xl" @click="item.callBack">
              <xt-new-icon :icon="item.newIcon" size="20" class="mr-3"></xt-new-icon>
              <span class="xt-text-2 xt-font font-14 font-400">{{ item.name }}</span>
            </div>
          </template>
        </div>
      </xt-dropdown>
     
      <xt-button w="32" h="32" style="border-radius: 8px;" @click="closeSend">
        <div class="flex items-center justify-center">
          <xt-new-icon icon="fluent:dismiss-16-regular" size="16"></xt-new-icon>
        </div>
      </xt-button>
     </div>
   </div>

   <div class="flex-1 w-full h-4/5">
      <EditSection ref="msgEditor"/>
   </div>

   <div class="h-10 flex items-center mt-3 justify-between w-full">
     <div class="flex">
      <a-tooltip placement="top" title="图片">
        <xt-button w="32" h="32" class="xt-bg-t-2 mr-3" style="border-radius: 8px;" @click="uploadImage">
          <div class="flex items-center justify-center">
            <xt-new-icon icon="fluent:image-multiple-16-regular" size="16"></xt-new-icon>
          </div>
        </xt-button> 
      </a-tooltip>
      <a-tooltip placement="top" title="附件">
        <xt-button w="32" h="32" class="xt-bg-t-2 mr-3" style="border-radius: 8px;" @click="uploadAttachment">
          <div class="flex items-center justify-center">
            <xt-new-icon icon="fluent:attach-16-regular" size="16"></xt-new-icon>
          </div>
        </xt-button>
      </a-tooltip>
      <a-tooltip placement="top" title="链接">
        <xt-button w="32" h="32" class="xt-bg-t-2 mr-3" style="border-radius: 8px;" @click="uploadButtonLink">
          <div class="flex items-center justify-center">
            <xt-new-icon icon="fluent:link-20-filled" size="16"></xt-new-icon>
          </div>
         </xt-button>
      </a-tooltip>
      <a-tooltip placement="top" title="b站视频">
        <xt-button w="32" h="32" class="xt-bg-t-2" style="border-radius: 8px;" @click="uploadBiliLink">
          <div class="flex items-center justify-center">
            <xt-new-icon icon="tabler:brand-bilibili" size="16"></xt-new-icon>
          </div>
        </xt-button>
      </a-tooltip>
     </div>
     <div class="flex items-center justify-center">
      <span class="xt-font xt-text-2 font-14 ">消息有效期：</span>
      <a-date-picker :bordered="false" v-model:value="value1"/>
     </div>
   </div>

   <input type="file" multiple="multiple" style="display: none;" class="imgRef" @change="getMessageImg($event)">
   <input type="file" multiple="multiple" style="display: none;" class="attachmentRef" @change="getAttachmentFile($event)">
 </div>


 <AddButtonLink ref="buttonLink"/>
 <AddBiliLink ref="biliLink"/>
 <CommunitySelect ref="communityRef"/>
 <AppointUserSelect ref="appointRef"/>
 <TimingSend ref="timingRef"/>
</template>

<script setup>
import { ref,watch,computed } from 'vue';
import { storeToRefs } from 'pinia';
import { noticeStore } from '../../store/noticeStore';
import { fileUpload } from '../../../../components/card/hooks/imageProcessing';
import { teamStore } from '../../../../store/team';
import dayjs, { Dayjs } from 'dayjs';
import { message } from 'ant-design-vue'


// 导入消息发送编辑模块
import EditSection from './EditSection.vue';
import AddButtonLink from '../add/AddButtonLink.vue';
import AddBiliLink from '../add/AddBiliLink.vue';
import CommunitySelect from '../userselect/CommunitySelect.vue';
import AppointUserSelect from '../userselect/AppointUserSelect.vue';
import TimingSend from './TimingSend.vue';

const emits = defineEmits(['close']);


const notice = noticeStore();
const { msgSetting } = storeToRefs(notice);
const teams = teamStore()
const { team } = storeToRefs(teams);

// 通知类型
const list = ref([
  { name:'普通通知类型',value:'1' },
  { name:'强制弹窗类型',value:'2' }
])
// 发送目标
const targetList = ref([
  { name:'全员',value:1000 },
  { name:'小队', value:1001},
  { name:'社群',value:1002 },
  { name:'指定用户',value:1003 }
])

const timingRef = ref(null);

const sendList = ref([
  {
    newIcon:'fluent:send-32-regular',name:'立即发送',
    callBack:()=>{
     
    }, 
  },
  {
    newIcon:'fluent:clock-16-regular',name:'定时发送',
    callBack:()=>{
      timingRef.value.openTimeModal()
    },
  },
  {
    newIcon:'fluent:compose-16-regular',name:'保存草稿',
    callBack:()=>{
      notice.createNotice()
    },
  }
])


// 通过计算属性根据当前
const getCurrentDay = computed(()=>{
  let currentDate = new Date();
  currentDate.setDate(currentDate.getDate() + 30);
  let year = currentDate.getFullYear();
  let month = currentDate.getMonth() + 1;
  let day = currentDate.getDate();
  return  `${year}/${month > 10 ? month : '0' + month }/${day > 10 ? day : '0' + day }`;
})
const dateFormat = 'YYYY/MM/DD';
const value1 = ref(dayjs(`${getCurrentDay.value}`,dateFormat))


const isLoading = ref(false); 
const msgEditor = ref(null);
const buttonLink = ref(null);
const biliLink = ref(null);
const communityRef = ref(null);
const appointRef = ref(null);


/**事件处理方法**/
// 发送
const send = () =>{
  notice.createNotice()
  // isLoading.value = true;
  // setTimeout(()=>{
  //   isLoading.value = false;
  // },1000)
}


// 弹窗关闭
const closeSend = () =>{
  emits('close');
}


// 图片上传
const uploadImage = async() =>{
  document.querySelector('.imgRef').click();
}
const getMessageImg = async(evt) =>{
  const fileList = evt.target.files;
  if(msgSetting.value.cover.length === 3){
    message.info('只能上传三张图片')
    evt.preventDefault();
  }
  else {
    if(fileList.length <= 3){
      for(const file of fileList){
       const res = await fileUpload(file);
       msgSetting.value.cover.push({cover:res})
      }
    }
  }
}


// 上传附件
const uploadAttachment = async() =>{
  document.querySelector('.attachmentRef').click();
} 
const getAttachmentFile = async(evt) =>{
  const fileList = evt.target.files;
  for(const item of fileList){
    msgSetting.value.attachments.push({href:await fileUpload(item),title:item.name}) 
  }
}


// 链接上传
const uploadButtonLink = () =>{
  buttonLink.value.openButtonModal()
}


// b站视频链接
const uploadBiliLink = () =>{
  biliLink.value.openBiliModal();
}


// 通过watch来判断是否为社群和指定用户
watch(()=>msgSetting.value.targetType,(newVal)=>{
  if(newVal === 1002){
    communityRef.value.openCommunitySelect();
  }
  else if(newVal === 1003) {
    appointRef.value.openAppointModal()
  }
},)
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

:deep(.ant-image-mask-info){
  display: none !important;
}
.xt-hover{
  &:hover{
    background-color: var(--active-secondary-bg) !important;
  }
}
</style>