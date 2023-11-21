<template>
  <div :style="isDoubleColumn ? { width:'336px' } : {width:'240px'} " class="relative">
    <img :src="textUrl" class="w-full h-full object-cover" :class="settings.enableHide ? 'rounded-t-xl':''"/>
    <div class="community-name h-11 w-full com-line-bg">
      <div class="m-1.5 px-3 items-center rounded-lg drop-hover flex justify-between h-8">
        <ChatDropDown class="w-full" newIcon="fluent:line-horizontal-3-20-filled" :title="defaultCategory?.name" :list="floatList" /> 
      </div>
    </div>
  </div>
  <div :style="settings.enableHide ? {height:'450px'}:{}">
    <div class="px-3 h-full flex  flex-col justify-between my-2" :style="isDoubleColumn ? { width:'336px' } : {width:'240px'} " >
      <!-- 双列 -->
      <template v-if="isDoubleColumn">
       <div class="font-14 summary font-400 mb-3 xt-font xt-text-2 summary-2">
        {{ defaultCategory?.summary }}
       </div>
       <div class="w-full flex items-center justify-start">
        <div class="px-2 py-1 font-12 rounded-md font-400 xt-font xt-text-2 mb-2" :class="settings.enableHide ? '' :'xt-bg'">
          社群号：{{ defaultCategory?.no }}
        </div>
       </div>
       <div>
        <a-row :gutter="10">
         <a-col flex="55px" class="mt-1 text-right">
           <span class="px-2 rounded-full xt-active-bg xt-active-text">0 级</span>
         </a-col>
         <a-col flex="auto" style="padding-top: 3px">
           <a-progress :show-info="false" strokeColor="var(--active-bg)" :percent="10"></a-progress>
         </a-col>
        </a-row>
       </div>
      </template>
      <!-- 单列 -->
      <template v-else>
       <div class="flex  items-center">
        <div class="font-14 summary font-400 mb-3 xt-font xt-text-2" :class="collapsed ? 'summary-3' :'summary-1'">
          {{ defaultCategory?.summary }}
        </div>
        <xt-button w="32" h="32" style="background: none !important;" @click="openHideContent">
          <div class="flex items-center justify-center" v-if="collapsed">
            <CommunityIcon icon="fluent:caret-down-16-filled" style="font-size: 1rem;" />
          </div>
          <div class="flex items-center justify-center" v-else>
            <CommunityIcon icon="fluent:caret-up-16-filled" style="font-size: 1rem;" />
          </div>
        </xt-button>
       </div>
       <div class="flex items-center mt-2">
        <span class="px-2 py-1 font-12 rounded-md font-400 xt-font xt-text-2 mr-3 " :class="settings.enableHide ? '' :'xt-bg'">
          社群号：{{ defaultCategory?.no }}
        </span>
        <span class="px-2 rounded-md xt-active-bg xt-active-text">0 级</span>
       </div>
       <a-progress :show-info="false" strokeColor="var(--active-bg)" v-if="collapsed" :percent="10"></a-progress>
      </template>
      <a-divider style="height: 2px;margin: 8px  0; border-top:1px solid var(--divider) !important"/>
      <vue-custom-scrollbar :settings="settingsScroller" style="height: 60vh;">
        <div v-for="item in defaultCategory?.tree">
         <ChatFold :title="item.name" :show="false" :content="undefined" :no="defaultCategory?.no">
          <div class="flex flex-col" v-if="isDoubleColumn === false">
            <div v-for="item in item.children" @click="currentItem(item)"  :class="{'active-bg': currentID ===item.id}" 
             class="flex items-center rounded-lg px-3.5 py-2.5 pointer" 
            >
             <div class="flex items-center">
               <template v-if="item.type === 'group'">
                <communityIcon icon="fluent-emoji-flat:thought-balloon" style="font-size: 1.25em;"/>
               </template>
               <template v-if="item.type === 'link'">
                <communityIcon icon="fluent-emoji-flat:globe-with-meridians" style="font-size: 1.25em;"/>
               </template>
               <template v-if="item.type === 'forum'">
                <communityIcon icon="fluent-emoji-flat:placard" style="font-size: 1.25em;"/>
               </template>
             </div> 
             <span class="font-16 ml-2 truncate" style="color: var(--primary-text);">{{ item.name || item.title }}</span>
              <SelectOutlined class="ml-1 xt-text-2 flip " style="font-size: 14px" v-if="item.type === 'link' && item.name !== 'Roadmap'"/>
            </div>
          </div>
          <div class="flex grid grid-cols-2 gap-1" v-else>
           <div v-for="item in item.children" @click="currentItem(item)"  :class="{'active-bg':currentID === item.id}" class="flex items-center px-3.5 py-2.5 rounded-lg pointer group-item">
            <div class="flex items-center">
             <template v-if="item.type === 'group'">
              <communityIcon icon="fluent-emoji-flat:thought-balloon" style="font-size: 1.25em;"/>
             </template>
             <template v-if="item.type === 'link'">
              <communityIcon icon="fluent-emoji-flat:globe-with-meridians" style="font-size: 1.25em;"/>
             </template>
             <template v-if="item.type === 'forum'">
              <communityIcon icon="fluent-emoji-flat:placard" style="font-size: 1.25em;"/>
             </template>
            </div>
             <span class="font-16 ml-2 truncate" style="color: var(--primary-text);">{{ item.name || item.title }}</span>
             <SelectOutlined class="ml-1 xt-text-2 flip " style="font-size: 14px" v-if="item.type === 'link' && item.name !== 'Roadmap'"/>
           </div>
          </div>
         </ChatFold>
        </div>
      </vue-custom-scrollbar>
    </div>
  </div>
</template>

<script>
import { mapActions,mapWritableState } from 'pinia'
import { chatList } from '../../../../js/data/chatList'
import {chatStore} from '../../../../store/chat'
import { Icon as CommunityIcon } from '@iconify/vue'

import ChatDropDown from './Dropdown.vue'
import ChatFold from './ChatFolds.vue'

export default {
 props:['float'],

 components:{
  ChatDropDown,ChatFold,CommunityIcon
 },

 data(){
  return{
   defaultCategory:{
    name:chatList[0]?.name,
    summary:chatList[0]?.summary,
    no:1,
    tree:chatList[0].channelList
   },
   currentID:'',
   settingsScroller: {
    useBothWheelAxes: true,
    swipeEasing: true,
    suppressScrollY: false,
    suppressScrollX: true,
    wheelPropagation: true
   },
   showList:[
    {
      newIcon:'fluent:text-indent-decrease-16-filled',title:'展开边栏',type:'show',
      callBack:()=>{
        this.setFloatVisible(false)
      }
    },
   ],
   hideList:[
    {
      newIcon:'fluent:text-indent-decrease-16-filled',title:'收起边栏',
      callBack:()=>{
        this.setFloatVisible(true)
      }
    },
    { 
      newIcon:'fluent:apps-list-detail-24-regular',title:'切换双/单列',
      callBack:()=>{
        this.setDouble()
      }
    },
   ],
   textUrl:'https://jxxt-1257689580.cos.ap-chengdu.myqcloud.com/Yzzj-zana-AI6F-jnTG',
   collapsed:false,
  }
 },

 computed:{
  ...mapWritableState(chatStore,['settings']),
  isDoubleColumn(){
   return this.settings.showDouble
  },
  floatList(){
   if(this.float && this.settings.enableHide){
     return this.showList
   }else{
     return this.hideList
   }
  }
 },

 methods:{
  ...mapActions(chatStore,['setFloatVisible','setDouble']),
  currentItem(item){
   this.currentID = item.id
   this.$mit.emit('clickItem',item)
  },
  // 展示单列时所有内容
  openHideContent(){
    this.collapsed = !this.collapsed
  },

 }
}
</script>

<style lang="scss" scoped>
.group-item{
  width:156px !important;
}
.active-bg {
  background: var(--active-secondary-bg);
 }
 .summary-2{
   display: -webkit-box;
   -webkit-box-orient: vertical;
   -webkit-line-clamp: 2;
   white-space: break-spaces;
   overflow: hidden;
   color: var(--primary-text);
   max-width: 312px;
 }
 .summary-1{
   display: -webkit-box;
   -webkit-box-orient: vertical;
   -webkit-line-clamp: 1;
   white-space: break-spaces;
   overflow: hidden;
   margin: 0 !important;
   color: var(--primary-text);
   max-width: 185px;
 }
 .summary-3{
   display: -webkit-box;
   -webkit-box-orient: vertical;
   -webkit-line-clamp: 3;
   white-space: break-spaces;
   overflow: hidden;
   margin: 0 !important;
   color: var(--primary-text);
   max-width: 185px;
 }
 .community-name{
   position: absolute;
   bottom:0;
 }
 .com-line-bg{
   background: linear-gradient(180deg, rgba(0,0,0,0.00) 0%, rgba(0,0,0,0.70) 100%);
 }
 .drop-hover{
  &:hover{
    background: var(--primary-bg);
  }
}
</style>