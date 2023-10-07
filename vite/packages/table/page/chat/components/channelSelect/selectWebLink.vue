<template>
  <div class="flex flex-col my-3" style="width:500px;" v-if="classShow === false">
   <div class="flex w-full mb-5 h-10 items-center justify-center" style="position: relative;">
    <div class="back-button w-10 h-10 flex items-center rounded-lg pointer active-button justify-center" style="background: var(--secondary-bg);" @click="backChannel">
     <LeftOutlined style="font-size: 1.25em;"></LeftOutlined>
    </div>
    <span class="font-16-400" style="color:var(--primary-text);">自定义网页链接</span>
    <div class="close-channel w-10 h-10 flex items-center rounded-lg pointer active-button justify-center"  style="background: var(--secondary-bg);" @click="closeChannel">
     <CloseOutlined  style="font-size: 1.25em;"/>
    </div>
   </div>
 
   <div class="flex flex-col px-6">
    <div class="p-4 flex rounded-lg flex-col mb-4" style="background: var(--secondary-bg);">
     <span class="font-16-400 mb-2.5" style="color:var(--primary-text);">操作指南</span>
     <span class="font-14-400" style="color:var(--secondary-text)">
      输入带有“https://”或“http://”前缀的，完整的网页地址。支持选择点击链接后的打开方式，默认使用工作台设置。
     </span>
    </div>
 
    <a-input class="h-10" v-model:value="linkName" spellcheck="false" style="border-radius: 8px; margin-bottom: 12px;" placeholder="链接名称" />
 
    <!-- <a-input class="h-10" v-model:value="link" spellcheck="false" style="border-radius: 12px;" placeholder="请输入" /> -->
    
    <a-input-group compact>
      <a-select v-model:value="requestProtocol" style="width:40%;">
        <a-select-option value="https">https</a-select-option>
        <a-select-option value="http">http</a-select-option>
      </a-select>
      <a-input v-model:value="link" placeholder="请输入" spellcheck="false" style="width: 60%;height:40px !important;border-top-right-radius: 8px !important;border-bottom-right-radius:8px;" />
    </a-input-group>

    <span class="font-16-400 my-4" style="color:var(--primary-text);">链接打开方式</span>
    <RadioTab :navList="linkType" v-model:selectType="defaultType"></RadioTab>
    <span class="font-14-400 my-4" style="color:var(--secondary-text)">当前工作台内链接默认使用“内部浏览器”打开。</span>
    <div class="flex items-center justify-end">
     <XtButton style="width: 64px;height:40px;margin-right: 12px;" @click="closeChannel">取消</XtButton>
     <XtButton style="width: 64px;height:40px; background: var(--active-bg);color:var(--active-text);" @click="submitSelect">选择</XtButton>
    </div>
   </div>
  </div>
 
  <SelectClassification v-else :no="no"  :type="type" :data="{name:linkName,props:webLink}" @classBack="classShow = false"></SelectClassification>
 </template>
 
 <script>
 import { defineComponent, reactive,toRefs,ref } from 'vue'
 import { CloseOutlined,LeftOutlined } from '@ant-design/icons-vue'
 
 import RadioTab from '../../../../components/RadioTab.vue'
 import SelectClassification from './selectClassification.vue'
 
 export default defineComponent({
 
  props:['no','type'],
 
  components:{
   CloseOutlined,LeftOutlined,RadioTab,SelectClassification,
  },
 
  setup (props,ctx) {

   const data = reactive({
    linkType:[
     { title:'默认',name:'default'},
     { title:'内部浏览器',name:'inter' },
     { title:'系统浏览器',name:'system' }
    ],
    defaultType:{},
    link:'',
    linkName:'',
    classShow:false,
    requestProtocol:'https'
 
   })
   

   const webLink = ref()

   // 关闭
   const closeChannel = () => {
    ctx.emit('close')
   }
 
   // 返回
   const backChannel = () =>{
    ctx.emit('back')
   }
 
   // 选择分类
   const submitSelect = () =>{
    if(data.link !== '' && data.linkName !== ''){
      webLink.value = `${data.requestProtocol}://${data.link}`
      data.classShow = true
    }
   }
 
   return {
    webLink,
    ...toRefs(data),
    closeChannel,backChannel,submitSelect,
   }
  }
 })
 </script>
 
 <style lang="scss" scoped>
 
 .font-16-400{
  font-family: PingFangSC-Regular;
  font-size: 16px;
  font-weight: 400;
 }
 
 .close-channel{
  position: absolute;
  top:1px;
  right:12px;
 }
 
 .active-button{
  &:active{
   filter: brightness(0.8);
   opacity: 0.8;
  }
  &:hover{
   opacity: 0.8;
  }
 }
 
 .font-14-400{
  font-family: PingFangSC-Regular;
  font-size: 14px;
  font-weight: 400;
 }
 
 .back-button{
  position: absolute;
  top: 1px ;
  left: 12px;
 }
 
 :deep(.ant-input){
  color: var(--secondary-text) !important;
  font-size: 1.15em;
  &::placeholder{
    color: var(--secondary-text) !important;
  }
 }

 :deep(.ant-select .ant-select-selector){
  height:40px !important;
  border-top-left-radius: 8px !important;
  border-bottom-left-radius: 8px !important;
 }
 :deep(.ant-select-selection-item){
  line-height: 40px !important;
 }
 </style>
 