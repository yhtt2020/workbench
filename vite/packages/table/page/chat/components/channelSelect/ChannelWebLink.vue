<template>
  <div class="flex flex-col my-3 justify-between" style="width:500px;"  v-if="classShow === false">
    <ModalTop title="自定义网页链接" back="true" @close="closeClick" @back="backClick"/>

    <div class="flex flex-col px-6">
      <div class="p-4 flex xt-bg-2 rounded-lg flex-col mb-4">
        <span class="font-16 font-400 mb-2.5 xt-text xt-font">操作指南</span>
        <span class="font-14 font-400 xt-text-2 xt-font">
          输入带有“https://”或“http://”前缀的，完整的网页地址。支持选择点击链接后的打开方式，默认使用工作台设置。
        </span>
      </div>

      <a-input class="h-10" v-model:value="linkName" ref="linkNameRef" spellcheck="false" style="border-radius: 8px; margin-bottom: 12px;" placeholder="链接名称" />
      <a-input-group compact >
        <a-select v-model:value="requestProtocol" style="width: 20%;height:40px !important;">
          <a-select-option value="https">https</a-select-option>
          <a-select-option value="http">http</a-select-option>
        </a-select>
        <a-input v-model:value="link" ref="linkRef" placeholder="请输入" spellcheck="false" style="width: 80%;height:40px !important;border-top-right-radius: 8px !important;border-bottom-right-radius:8px;" />
      </a-input-group>

      <span class="font-16 font-400 xt-font my-4 xt-text">链接打开方式</span>
      <RadioTab :navList="openType" v-model:selectType="defaultOpen"></RadioTab>
      <template v-if="defaultOpen.openMethod === 'outerOpen'">
        <RadioTab  :navList="linkType" v-model:selectType="defaultType"></RadioTab>
      </template>

      <div class="flex items-center justify-end my-3">
        <xt-button w="64" h="40" class="mr-3 category-button" @click="closeClick">取消</xt-button>
        <xt-button w="64" h="40" type="theme" class="category-button" @click="selectNext">选择</xt-button>
      </div>
    </div>
  </div>
  <ChannelClassification v-else :no="no"  :data="{name:linkName,props:webLink}" type="link" @classBack="classShow = false"/>
</template>

<script>
import { Icon as LinkIcon } from '@iconify/vue'
import {message} from 'ant-design-vue'

import ModalTop from '../ModalTop.vue';
import RadioTab from '../../../../components/RadioTab.vue'
import ChannelClassification from './ChannelClassification.vue';

export default {
 components:{
  LinkIcon,ModalTop,RadioTab,ChannelClassification
 },

 props:['no'],

 data(){
  return{
    linkName:'',
    link:'',

    classShow:false,
    requestProtocol:'https',
    defaultType:{ title:'内部浏览器',name:'inter',openMethod:'userSelect' },
    defaultOpen:{title:'当前页面直接打开',name:'current',openMethod:'currentPage'},

    linkType:[
     { title:'内部浏览器',name:'inter',openMethod:'userSelect' },
     { title:'系统浏览器',name:'system',openMethod:'systemSelect'}
    ],
    openType:[
     {title:'当前页面直接打开',name:'current',openMethod:'currentPage'},
     {title:'外部跳转打开',name:'outer',openMethod:'outerOpen'},
    ],

    webLink:{},

  }
 },

 methods:{
  closeClick(){
   this.$emit('close')
  },
  backClick(){
    this.$emit('back')
  },
  // 下一步
  selectNext(){
    if(this.link !== '' && this.linkName !== ''){
      if(this.defaultOpen.openMethod === 'outerOpen'){
        this.webLink = {url:`${this.requestProtocol}://${this.link}`,openMethod:this.defaultType.openMethod}
        this.classShow = true
      }else{
        this.webLink = {url:`${this.requestProtocol}://${this.link}`,openMethod:this.defaultOpen.openMethod}
        this.classShow = true
      }
    }else{
      message.warning('参数不能缺失')
    }
  }

 }
};
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