<template>
 <div class="w-full rounded-xl xt-bg-2 p-4">
   <div class="flex">
    <div class="flex mr-3 w-10 h-10">
     <a-avatar shape="square" :size="40" :src=" getSetData.avatar"/>
    </div>
    <div class="grow flex items-center justify-between">
      <div class="flex flex-col">
       <span class="xt-font font-16 font-400 xt-text">{{ getSetData.name }}</span>
       <span class="xt-font font-14 font-400 xt-text-2 truncate" style="max-width: 210px;">
        {{ getSetData.summary }}
       </span>
      </div>
      <div class="flex items-center">
       <xt-button w="64" h="40" class="xt-bg category-button mr-3" @click="editorSetting">编辑</xt-button>
       <Dropdown newIcon="fluent:more-horizontal-16-regular" :enableButton="true" :list="settingList"/>
      </div>
    </div>
   </div>
   <a-divider style="height: 2px; margin: 16px 0;width: 540px;"/>
   <div class="w-full flex  justify-between">
    <div class="flex flex-col" style="width: 266px;">
     <span class="xt-font xt-text-2 font-16 font-400 mb-2">加入方式</span>
     <span class="xt-font xt-text-2 font-14 font-400">当前社群为公开，支持外部用户自由加入。</span>
     <!-- 提交申请审核加入，或者管理员手动邀请直接加入 -->
    </div>
    <div style="width: 160px;" class="flex items-center justify-center">
     <a-select class="w-full custom-select" v-model:value="setValue" :bordered="false" style="height: 40px;">
      <a-select-option value="public">公开,自由加入</a-select-option>
      <!-- <a-select-option value="">私密,邀请加入</a-select-option> -->
     </a-select>
    </div>
   </div>
 </div>
 <CommunityEditor ref="editorRef" :no="getSetData.no" :content="getSetData"/>
</template>

<script>
import { mapActions,mapWritableState } from 'pinia';
import { communityStore } from '../../store/communityStore';
import { Icon as SettingIcon } from '@iconify/vue'

import CommunityEditor from '../../components/contact/CommunityEditor.vue';
import Dropdown from '../../components/float/Dropdown.vue';

export default {
 components:{
  SettingIcon,CommunityEditor,
  Dropdown
 },

 data(){
  return{
   settingList:[
    {
     newIcon:'fluent:delete-16-regular',title:'解散社群',color:'var(--error)',type:'deletePacket',
     callBack:()=>{
      // 解散社群todo
     }
    },
   ],
   setValue:'public',
  }
 },

 computed: {
  ...mapWritableState(communityStore,['categoryList']),
  getSetData(){
   const no = this.$route.params.no
   const setContent = this.categoryList
   return {
    no:no,
    ...setContent,
   }
  }
 },
 
 methods:{
  editorSetting(){
   this.$refs.editorRef.openEditorModal() 
  }
 }

};
</script>

<style lang="scss" scoped>

:deep(.custom-select) {
 & .ant-select-selector {
   border-radius: 8px !important;
   display: flex;
   align-items: center;
   height: 40px !important;
   background: var(--primary-bg) !important;
 }

 & .ant-select-item {
   color: var(--secondary-text) !important;
 }
}


:deep(.ant-select-selection-placeholder) {
 color: var(--secondary-text) !important;
 display: flex !important;
 align-items: center !important;
 justify-content: center !important;
}


:deep(.ant-select-selection-search) {
 display: flex !important;
 align-items: center !important;
 height: 40px !important;
}


:deep(.anticon.ant-input-clear-icon) {
 color: var(--secondary-text) !important;
}
</style>