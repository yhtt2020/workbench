<template>
 <div class="flex flex-col">
  <!-- 左侧顶部社群描述 -->
  <div class="w-full mb-2.5 flex justify-between items-center">
   <div class="flex flex-col">
    <span class=" font-bold text-lg truncate" style="color:var(--primary-text);">{{ floatData.name }}</span>
    <!-- <div class="font-14" style="color:var(--secondary-text);">
     {{ summary }}
    </div> -->
   </div>
   <ChatDropDown @updatePage="updatePage" :list="hideDropList"/>
  </div>
  <div class="ml-1 category-14-400" style="color:var(--primary-text);">
   社群号：{{ floatData.id }}
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

 
 <template v-if="floatData?.data?.tree.length === 0">
  <div class="flex items-center h-full justify-center flex-col">
   <div v-for="item in emptyList" class="flex  items-center rounded-lg pointer mb-3 active-button h-10 px-3"
        style="background: var(--secondary-bg);" @click="clickEmptyButton(item)">
     <component :is="item.icon"></component>
     <span class="font-16 ml-3" style="color:var(--primary-text);">{{ item.name }}</span>
   </div>
  </div>
 </template>

 <vue-custom-scrollbar :settings="settingsScroller" style="height: 100%;" v-else>
  <div v-for="item in floatData?.data?.tree">
   <ChatFold :title="item.name">
    
    <!-- 单列 -->
    <div class="flex flex-col" v-if="isDoubleColumn === false">
     <div v-for="item in item.children" @click="currentItem(item)" 
      :class="{'active-bg': currentID ===item.id}"
      class="flex items-center p-2 rounded-lg pointer group-item"
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

    <!-- 双列 -->
    <div class="flex grid grid-cols-2 gap-1" v-else>

     <div v-for="item in item.children" @click="currentItem(item)"
      :class="{'active-bg':currentID === item.id}" class="flex items-center p-2 rounded-lg pointer group-item"
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
import { hideDropList } from '../../../../js/data/chatList'
import { Icon as CommunityIcon } from '@iconify/vue'
import { UserAddOutlined, PlusOutlined, MenuUnfoldOutlined,SelectOutlined } from '@ant-design/icons-vue'
import { mapWritableState, mapActions, mapState } from 'pinia'
import { chatStore } from '../../../../store/chat'

import ChatDropDown from './chatDropDown.vue';
import ChatFold from './chatFold.vue'

export default {
 props:['floatData'],

 components:{
  UserAddOutlined, PlusOutlined, MenuUnfoldOutlined,SelectOutlined,
  ChatDropDown,CommunityIcon,ChatFold
 },
 
 data(){
  return{
   hideDropList,

   emptyList: [
    { icon:UserAddOutlined, name: '邀请其他人', type: 'inviteOther' },
    { icon: PlusOutlined, name: '添加新应用', type: 'addChannel' },
    { icon: MenuUnfoldOutlined, name: '添加新分组', type: 'addNewGroup' },
   ],

   settingsScroller: {
    useBothWheelAxes: true,
    swipeEasing: true,
    suppressScrollY: false,
    suppressScrollX: true,
    wheelPropagation: true
   },
  
   currentID:''


  }
 },

 computed:{
  ...mapWritableState(chatStore,['settings']),
  isDoubleColumn(){
   return this.settings.showDouble
  }
 },

 methods:{
  // 切换单双列显示
  updatePage(){
   this.$emit('updateColumn')
  },

  // 当社群为空时触发
  clickEmptyButton(item){
   this.$emit('createCategory',item)
  },

  // 点击当前
  currentItem(item){
   this.currentID = item.id
   this.$emit('clickItem',item)
  }

 }

}
</script>

<style lang="scss" scoped>
.active-bg {
 background: var(--active-secondary-bg);
}
</style>