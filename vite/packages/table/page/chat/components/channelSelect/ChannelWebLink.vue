<template>
  <div class="flex flex-col justify-between my-3" style="width:500px;"  v-if="classShow === false">
    <ModalTop title="自定义网页链接" back="true" @close="closeClick" @back="backClick"/>

    <div class="flex flex-col px-6">
      <div class="flex flex-col p-4 mb-4 rounded-lg xt-bg-2">
        <span class="font-16 font-400 mb-2.5 xt-text xt-font">操作指南</span>
        <span class="font-14 font-400 xt-text-2 xt-font">
          输入带有“https://”或“http://”前缀的，完整的网页地址。支持选择点击链接后的打开方式，默认使用工作台设置。
        </span>
        <span class="font-14 font-400 xt-text-2 xt-font">添加网址后,如遇到网页打开无法显示,是该网页路径的安全策略问题导致无法正常显示,则需要通过系统浏览器进行打开。</span>
      </div>

      <a-input class="h-10" v-model:value="linkName" ref="linkNameRef" spellcheck="false" style="border-radius: 8px; margin-bottom: 12px;" placeholder="链接名称" />
      <a-input-group compact >
        <a-select v-model:value="requestProtocol" style="width: 20%;height:40px !important;">
          <a-select-option value="https">https</a-select-option>
          <a-select-option value="http">http</a-select-option>
        </a-select>
        <a-input v-model:value="link" ref="linkRef" placeholder="请输入" spellcheck="false" style="width: 80%;height:40px !important;border-top-right-radius: 8px !important;border-bottom-right-radius:8px;" />
      </a-input-group>

      <span class="my-4 font-16 font-400 xt-font xt-text">链接打开方式</span>
      <RadioTab :navList="openType" class="mb-3" v-model:selectType="defaultOpen"></RadioTab>
      <template v-if="defaultOpen.openMethod === 'outerOpen'">
        <!-- <RadioTab class="mb-3" :navList="linkType" v-model:selectType="defaultType"></RadioTab> -->
        <dropDown :list="linkType" v-model:mode="mode"></dropDown>
      </template>

      <div class="flex items-center justify-end mb-3">
        <xt-button w="64" h="40" class="mr-3 category-button" @click="closeClick">取消</xt-button>
        <xt-button w="64" h="40" type="theme" class="category-button" @click="selectNext">选择</xt-button>
      </div>
    </div>
  </div>
  <ChannelClassification v-else :no="no"  :data="{name:linkName,props:webLink}" type="link" @classBack="classShow = false"/>
</template>

<script>
import { defineAsyncComponent } from 'vue'
import { Icon as LinkIcon } from '@iconify/vue'
import {message} from 'ant-design-vue'

import { data } from '../../../../../table/components/desk/navigationBar/components/dropDown/Data'

import ModalTop from '../ModalTop.vue';
import RadioTab from '../../../../components/RadioTab.vue'
import ChannelClassification from './ChannelClassification.vue';

const dropDown = defineAsyncComponent(
  () => import('../../../../../table/components/desk/navigationBar/components/dropDown/DropDown.vue'));

export default {
 components:{
  LinkIcon,ModalTop,RadioTab,ChannelClassification,dropDown
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
    mode:'systemSelect',
    linkType:[
        {
            icon:'mingcute:windows-line',
            name:'系统默认浏览器',
            value:'systemSelect',
            info:'使用Windows系统默认浏览器打开'
        },
        {
            icon:'fluent:globe-16-regular',
            name:'工作台内置浏览器',
            value:'userSelect',
            info:'在工作台内直接打开，不会跳转到外部应用软件。'
        },
        {
            icon:'fluent:globe-16-regular',
            name:'想天浏览器',
            value:'thinksky',
            info:'使用想天浏览器打开'
        },
        {
            icon:'fluent:phone-16-regular',
            name:'手机模式',
            value:'mob',
            info:'使用想天浏览器内置的「手机模式」打开，可以模拟手机端的浏览状态。'
        }
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

 },
 watch:{
  mode(newV){
    console.log(newV)
    this.defaultType.openMethod = newV
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