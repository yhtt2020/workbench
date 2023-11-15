<template>
 <div class="flex flex-col">
  <div class="w-full mb-2.5 flex  justify-between items-center">
    <span class=" font-bold text-lg truncate" style="color:var(--primary-text);">{{ defaultCategory?.name }}</span>
    <ChatDropDown newIcon="fluent:line-horizontal-3-20-filled" :list="floatList"/> 
  </div>

  <div class="font-14 mb-2" style="color:var(--secondary-text);" :style="isDoubleColumn ? { width:'312px' } : {width:'215px'} ">
    {{ defaultCategory?.summary }}
  </div> 
  
  <div class="ml-1 category-14-400 mb-2" style="color:var(--primary-text);">
   社群号：{{ defaultCategory?.no }}
  </div>
  <div>
   <a-row :gutter="10">
    <a-col flex="55px" class="mt-1 text-right">
      <span class="px-2 rounded-full xt-active-bg">0 级</span>
    </a-col>
    <a-col flex="auto" style="padding-top: 3px">
      <a-progress :show-info="false" strokeColor="var(--active-bg)" :percent="10"></a-progress>
    </a-col>

   </a-row>
  </div>

 </div>

 <a-divider style="height: 2px;margin: 12px 0; background-color: var(--divider)"/>

 <vue-custom-scrollbar :settings="settingsScroller" style="height: 100%;">
  <div v-for="item in defaultCategory?.tree">
    <ChatFold :title="item.name" :show="false" :no="defaultCategory?.no">
     
     <div class="flex flex-col" v-if="isDoubleColumn === false">

      <div v-for="item in item.children" @click="currentItem(item)" 
       :class="{'active-bg': currentID ===item.id}"
       class="flex items-center rounded-lg px-3.5 py-2.5 pointer group-item" 
      >
       <div class="flex items-center">
        <template v-if="item.type === 'group'">
         <communityIcon icon="fluent-emoji-flat:thought-balloon" style="font-size: 2em;"/>
        </template>
        <template v-if="item.type === 'link'">
         <communityIcon icon="fluent-emoji-flat:globe-with-meridians" style="font-size: 2em;"/>
        </template>
        <template v-if="item.type === 'forum'">
         <communityIcon icon="fluent-emoji-flat:placard" style="font-size: 2em;"/>
        </template>
       </div> 
       <span class="font-16 ml-2 truncate" style="color: var(--primary-text);">{{ item.name || item.title }}</span>
       <SelectOutlined class="ml-1 xt-text-2 flip " style="font-size: 14px"
                    v-if="item.type === 'link' && item.name !== 'Roadmap'"/>
      </div>
 
     </div>
 
     <div class="flex grid grid-cols-2 gap-1" v-else>
 
      <div v-for="item in item.children" @click="currentItem(item)"
       :class="{'active-bg':currentID === item.id}" class="flex items-center px-3.5 py-2.5 rounded-lg pointer group-item"
      >
       <div class="flex items-center">
        <template v-if="item.type === 'group'">
         <communityIcon icon="fluent-emoji-flat:thought-balloon" style="font-size: 2em;"/>
        </template>
        <template v-if="item.type === 'link'">
         <communityIcon icon="fluent-emoji-flat:globe-with-meridians" style="font-size: 2em;"/>
        </template>
        <template v-if="item.type === 'forum'">
         <communityIcon icon="fluent-emoji-flat:placard" style="font-size: 2em;"/>
        </template>
       </div>
       <span class="font-16 ml-2 truncate" style="color: var(--primary-text);">{{ item.name || item.title }}</span>
       <SelectOutlined class="ml-1 xt-text-2 flip " style="font-size: 14px" v-if="item.type === 'link' && item.name !== 'Roadmap'"/>
      </div>
 
     </div>

    </ChatFold>
  </div>
 </vue-custom-scrollbar>
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
      icon:'fluent:text-indent-decrease-16-filled',title:'展开边栏',type:'show',
      callBack:()=>{
        this.setFloatVisible(false)
      }
    },
   ],
   hideList:[
    {
      icon:'fluent:text-indent-decrease-16-filled',title:'收起边栏',
      callBack:()=>{
        this.setFloatVisible(true)
      }
    },
    { 
      icon:'fluent:apps-list-detail-24-regular',title:'切换双/单列',
      callBack:()=>{
        this.setDouble()
      }
    },
   ]

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
   this.$emit('clickItem',item)
  },

  
 }

}
</script>

<style lang="scss" scoped>
.active-bg {
 background: var(--active-secondary-bg);
}

.group-item{
  width:156px !important;
}
</style>