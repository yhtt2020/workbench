<template>
  <div class="flex flex-col my-3" style="width:500px;">
   <ModalTop back="true" title="自定义网页链接" @close="closeChannel" @back="backChannel"/>
   <div class="flex flex-col px-6">
    <div class="p-4 flex rounded-lg flex-col mb-4 xt-bg-2">
     <span class="font-16 font-400 mb-2.5 xt-text">操作指南</span>
     <span class="font-14 font-400 xt-font xt-text-2">
      输入带有“https://”或“http://”前缀的，完整的网页地址。支持选择点击链接后的打开方式，默认使用工作台设置。
     </span>
     <span class="font-14 font-400 xt-font xt-text-2">添加网址后,如遇到网页打开无法显示,是该网页路径的安全策略问题导致无法正常显示,则需要通过系统浏览器进行打开。</span>
    </div>
    <a-input class="h-10" v-model:value="linkName" ref="linkNameRef" style="border-radius: 12px; margin-bottom: 12px;" placeholder="链接名称" />
    <a-input-group compact>
      <a-select v-model:value="requestProtocol" style="width:20%;">
        <a-select-option value="https">https</a-select-option>
        <a-select-option value="http">http</a-select-option>
      </a-select>
      <a-input v-model:value="link" ref="linkRef" placeholder="请输入" spellcheck="false" style="width: 80%;height:40px !important;border-top-right-radius: 8px !important;border-bottom-right-radius:8px;" />
    </a-input-group>
    <span class="font-16 font-400 xt-font my-4 xt-text">链接打开方式</span>
    <RadioTab :navList="openType"  v-model:selectType="defaultOpen"></RadioTab>
    <div class="my-2"></div>
    <template v-if="defaultOpen.openMethod === 'outerOpen'">
      <RadioTab  :navList="linkType" v-model:selectType="defaultType"></RadioTab>
    </template>
    <div class="flex items-center justify-end my-3">
      <xt-button class="mr-3 category-button" w="64" h="40" @click="closeChannel">取消</xt-button>
      <xt-button class="mr-3 category-button" type="theme" w="64" h="40" @click="submitSelect">确定</xt-button>
    </div>
   </div>
  </div>
</template>

<script>
import { mapActions } from 'pinia';
import { Icon as LinkIcon } from '@iconify/vue';
import { channelClass } from '../../../../js/chat/createChannelClass';
import { communityStore } from '../../store/communityStore';
import { message } from 'ant-design-vue';

import RadioTab from '../../../../components/RadioTab.vue';
import ModalTop from '../ModalTop.vue';

export default {
 props:['no','id'],

 components:{
  LinkIcon,RadioTab,ModalTop,
 },

 data(){
   return{
    requestProtocol:'https',
    defaultType:{ title:'内部浏览器',name:'inter',openMethod:'userSelect' },
    defaultOpen:{title:'当前页面直接打开',name:'current',openMethod:'currentPage'},
    link:'',
    linkName:'',
    linkType:[
     { title:'内部浏览器',name:'inter',openMethod:'userSelect' },
     { title:'系统浏览器',name:'system',openMethod:'systemSelect'}
    ],
    openType:[
     {title:'当前页面直接打开',name:'current',openMethod:'currentPage'},
     {title:'外部跳转打开',name:'outer',openMethod:'outerOpen'},
    ],
   }
 },

 mounted(){
  this.$nextTick(()=>{
    const nameRef = this.$refs.linkNameRef
    nameRef.focus()
  })
 },

 methods:{
  ...mapActions(communityStore,['getCategoryData','getChannelList']),
  backChannel(){
    this.$emit('back')
  },
  closeChannel(){
    this.$emit('close')
  },
  async submitSelect(evt){
    if(this.link !== '' && this.linkName !== ''){
      const option = {
        type:'link', id:this.id, no:this.no,
        content:{
          name:this.linkName,
          props:{
            url:`${this.requestProtocol}://${this.link}`,
            openMethod:this.defaultOpen.openMethod === 'currentPage' ? this.defaultOpen.openMethod : this.defaultType.openMethod
          }
        }
      }
      channelClass.secondaryChannel(option)
      message.success('关联成功')
      this.closeChannel()
    }else{
      message.warning('参数必须填写完整')
      evt.preventDefault();
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
