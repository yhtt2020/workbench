<template>
 <div class="flex flex-col my-3" style="width:500px;" v-if="classShow === false">
  <div class="flex w-full mb-5 h-10 items-center justify-center" style="position: relative;">
   <div class="back-button w-10 h-10 flex items-center rounded-lg pointer active-button justify-center" style="background: var(--secondary-bg);" @click="backChannel">
    <WebLinKIcon icon="fluent:chevron-left-16-filled" style="font-size: 1.5rem;color:var(--secondary-text);"/>
   </div>
   <span class="font-16-400" style="color:var(--primary-text);">自定义网页链接</span>
   <div class="close-channel w-10 h-10 flex items-center rounded-lg pointer active-button justify-center"  style="background: var(--secondary-bg);" @click="closeChannel">
    <WebLinKIcon icon="fluent:dismiss-16-filled" style="font-size: 1.25rem;color:var(--secondary-text);" />
   </div>
  </div>

  <div class="flex flex-col px-6">
   <div class="p-4 flex rounded-lg flex-col mb-4" style="background: var(--secondary-bg);">
    <span class="font-16-400 mb-2.5" style="color:var(--primary-text);">操作指南</span>
    <span class="font-14-400" style="color:var(--secondary-text)">
     输入带有“https://”或“http://”前缀的，完整的网页地址。支持选择点击链接后的打开方式，默认使用工作台设置。
    </span>
   </div>

   <a-input class="h-10" v-model:value="linkName" ref="linkNameRef" spellcheck="false" style="border-radius: 8px; margin-bottom: 12px;" placeholder="链接名称" />

   <!-- <a-input class="h-10" v-model:value="link" spellcheck="false" style="border-radius: 12px;" placeholder="请输入" /> -->
   
   <a-input-group compact>
     <a-select v-model:value="requestProtocol" style="width:20%;">
       <a-select-option value="https">https</a-select-option>
       <a-select-option value="http">http</a-select-option>
     </a-select>
     <a-input v-model:value="link" ref="linkRef" placeholder="请输入" spellcheck="false" style="width: 80%;height:40px !important;border-top-right-radius: 8px !important;border-bottom-right-radius:8px;" />
   </a-input-group>

   <span class="font-16-400 my-4" style="color:var(--primary-text);">链接打开方式</span>
   <RadioTab :navList="openType" class="my-3" v-model:selectType="defaultOpen"></RadioTab>
   <template v-if="defaultOpen.openMethod === 'outerOpen'">
     <RadioTab  :navList="linkType" v-model:selectType="defaultType"></RadioTab>
   </template>
   <!-- <span class="font-14-400 my-4" style="color:var(--secondary-text)">当前工作台内链接默认使用“内部浏览器”打开。</span> -->
   
   <div class="flex items-center justify-end my-3">
    <XtButton style="width: 64px;height:40px;margin-right: 12px;" @click="closeChannel">取消</XtButton>
    <XtButton style="width: 64px;height:40px; background: var(--active-bg);color:var(--active-text);" @click="submitSelect">选择</XtButton>
   </div>
  </div>
 </div>

 <SelectClassification v-else :no="no"  :type="type" :data="{name:linkName,props:webLink}" @classBack="classShow = false"></SelectClassification>
</template>

<script>
import { mapActions,mapWritableState } from 'pinia'
 
import { Icon as WebLinKIcon } from '@iconify/vue'
import RadioTab from '../../../../components/RadioTab.vue'
import SelectClassification from './ChannelClassification.vue'

export default {

props:['no','type'],

components:{
 RadioTab,SelectClassification,WebLinKIcon,
},

data(){
 return{
  linkType:[
   { title:'内部浏览器',name:'inter',openMethod:'userSelect' },
   { title:'系统浏览器',name:'system',openMethod:'systemSelect'}
  ],
  openType:[
    {title:'当前页面直接打开',name:'current',openMethod:'currentPage'},
    {title:'外部跳转打开',name:'outer',openMethod:'outerOpen'},
  ],
  defaultType:{ title:'内部浏览器',name:'inter',openMethod:'userSelect' },
  defaultOpen:{title:'当前页面直接打开',name:'current',openMethod:'currentPage'},
  link:'',
  linkName:'',
  classShow:false,
  requestProtocol:'https',
  webLink:{},
 }
},

mounted(){
 this.$nextTick(()=>{
   const nameRef = this.$refs.linkNameRef
   // const linkRef = this.$refs.linkRef
   nameRef.focus()
   // linkRef.focus()
 })
},

methods:{
 // 返回
 backChannel(){
   this.$emit('back')
 },

 // 关闭
 closeChannel(){
   this.$emit('close')
 },

 // 选择分类
 submitSelect(){
   // console.log(this.defaultOpen,this.defaultType);
   if(this.link !== '' && this.linkName !== ''){
    // console.log('获取参数',data.defaultOpen,data.defaultType)
    if(this.defaultOpen.openMethod === 'outerOpen'){
     //  console.log('外部打开')
      this.webLink = {url:`${this.requestProtocol}://${this.link}`,openMethod:this.defaultType.openMethod}
      this.classShow = true
    }else{
     //  console.log('当前页面打开')
      this.webLink = {url:`${this.requestProtocol}://${this.link}`,openMethod:this.defaultOpen.openMethod}
      this.classShow = true
    }

   
  }
 }




},

watch:{
 defaultType(newVal){
   console.log('监听数据变化',newVal)
   this.defaultType = newVal
 },
 defaultOpen(newVal){
   console.log('监听数据变化',newVal)
   this.defaultOpen = newVal
 }
}

}
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
