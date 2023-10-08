<template>
 <div class="flex flex-col">
  <div class="w-full mb-2.5 flex  justify-between items-center">
    <span class=" font-bold text-lg truncate" style="color:var(--primary-text);">{{ categoryList.name }}</span>
    <ChatDropDown @updatePage="updatePage" :no="categoryList.no" :list="floatList"/> 
  </div>

  <div class="font-14 mb-2" style="color:var(--secondary-text);" :style="isDoubleColumn ? { width:'312px' } : {width:'215px'} ">
    {{ categoryList.summary }}
  </div> 
  
  <div class="ml-1 category-14-400 mb-2" style="color:var(--primary-text);">
   社群号：{{ categoryList.no }}
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


 <template v-if="categoryList?.tree?.length === 0 ">
  <div class="flex items-center h-full justify-center flex-col" v-if="categoryList?.role !== 'member'">
    <div v-for="item in emptyList" class="flex  items-center rounded-lg pointer mb-3 active-button h-10 px-3"
         style="background: var(--secondary-bg);" @click="clickEmptyButton(item)">
      <CommunityIcon :icon="item.icon" style="font-size:1.75em;"></CommunityIcon>
      <span class="font-16 ml-3" style="color:var(--primary-text);">{{ item.name }}</span>
    </div>
  </div>

  <div v-else  class="flex items-center h-full justify-center">
    <a-empty :image="emptyImage" description="这里还没有内容"></a-empty>
  </div>
 </template>


 <vue-custom-scrollbar :settings="settingsScroller" style="height: 100%;" v-else>
  <div v-for="item in categoryFilterList">
    <ChatFold :title="item.name" >
    
      <div class="flex flex-col" v-if="isDoubleColumn === false">
  
       <div v-for="item in item.children" @click="currentItem(item)" 
        :class="{'active-bg': currentID ===item.id}"
        class="flex items-center rounded-lg p-2 pointer group-item" 
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
        :class="{'active-bg':currentID === item.id}" class="flex items-center px-3.5 py-2 rounded-lg pointer group-item"
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
  
  <template v-if="!isDoubleColumn">
    <div class="flex flex-col">
      <div v-for="item in channelList" class="flex items-center px-2  py-2 rounded-lg pointer group-item" :class="{'active-bg': currentID ===item.id}"  @click="currentItem(item)">
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
  </template>

  <template v-else>
    <div class="flex grid grid-cols-2 gap-1">
       <div v-for="item in channelList" class="flex items-center px-3.5 py-2 rounded-lg pointer group-item"  :class="{'active-bg': currentID ===item.id}"  @click="currentItem(item)" >
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
  </template>

 </vue-custom-scrollbar>


</template>

<script>
import { mapActions,mapWritableState } from 'pinia'
import { chatStore } from '../../../../store/chat'
import { communityStore } from '../../store/communityStore'
import { hideDropList,showDropList,memberDropList,memberShowList } from '../../../../js/data/chatList'
import { Icon as CommunityIcon } from '@iconify/vue'
import { SelectOutlined } from '@ant-design/icons-vue'

import ChatDropDown from './chatDropDown.vue';
import ChatFold from './chatFold.vue'

export default{
  props:[ 'communityID','float' ],

  components:{
    CommunityIcon,ChatDropDown,ChatFold,SelectOutlined,
  },

  data(){
    return{
      emptyList: [
       { icon:'fluent:people-add-16-regular', name: '邀请其他人', type: 'inviteOther' },
       { icon:'fluent:apps-add-in-20-filled', name: '添加新应用', type: 'addChannel' },
       { icon:'fluent:add-16-filled', name: '添加新分组', type: 'addNewGroup' },
      ],
      currentID:'',
      settingsScroller: {
       useBothWheelAxes: true,
       swipeEasing: true,
       suppressScrollY: false,
       suppressScrollX: true,
       wheelPropagation: true
      },
      emptyImage:'/img/state/null.png',
    }
  },

  computed:{
    ...mapWritableState(communityStore,['categoryList']),
    ...mapWritableState(chatStore,['settings']),
    isDoubleColumn(){
      return this.settings.showDouble
    },
    floatList(){
      if(this.float){
        if(this.communityID.no === 1){
          return memberShowList
        }else{
          if(this.categoryList?.role !== 'member'){
            return showDropList
          }else{
            return memberShowList
          }
        }
      }else{
        if(this.communityID.no === '1'){
          return memberDropList
        }else{
          if(this.categoryList?.value?.role !== 'member'){
            return hideDropList
          }else{
            return memberDropList
          }
        }
      }
    },

    channelList(){
      const list = this.categoryList?.tree.filter((item)=>{
        return item.role !== 'category'
      })
      return list
    },

    categoryFilterList(){
      const list = this.categoryList?.tree.filter((item)=>{
        return item.role !== 'channel'
      })
      return list
    }
  },

  methods:{
    clickEmptyButton(item){
      this.$emit('createCategory',item)
    },
    currentItem(item){
      console.log('排查::>',item);
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
</style>