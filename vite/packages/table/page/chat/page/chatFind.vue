<template>
  <div class="flex flex-col w-full h-full pl-4">
   <div class="flex items-center">
    <HorizontalPanel :navList="communityList" v-model:selectType="communityDefault" style="height: 40px !important;"/>
    <a-input v-if="communityDefault.name === 'community'" style="width: 244px;border-radius: 10px;background: var(--secondary-bg);" spellcheck="false" placeholder="搜索"
     class="h-10 ml-3" @pressEnter="findSearch" @input="findSearch"
    >
      <template #suffix>
        <SearchIcon class="pointer category-button" icon="fluent:search-20-filled" style="font-size: 1.43rem;"  @click="findSearch"/>
      </template>
    </a-input>
   </div>

   <CommunityFind v-if="communityDefault.name === 'community'" :dataList="searchList"/>
   <GroupsUserFind v-else/>
   
  </div>
</template>

<script>
import { ref,reactive,watch,computed } from 'vue'
import HorizontalPanel from '../../../components/HorizontalPanel.vue'
import {Icon as SearchIcon} from '@iconify/vue'

import GroupsUserFind from './find/groupsUserFind.vue'
import CommunityFind from './find/communityFind.vue'

export default {
  components:{
    HorizontalPanel,
    SearchIcon,
    CommunityFind,
    GroupsUserFind
  },

  data(){
    return{
      communityList:[
        {title:'社群',name:'community',},
        {title:'群聊和用户',name:'user',}
      ],
      communityDefault:{title:'社群',name:'community'},
      isListEmpty:window.$TUIKit.store.store.TUIConversation.conversationList,
      searchList:[]
    }
  },

  methods:{
    // 社群发现页搜索
    findSearch(){
      
    }
  },



  watch:{
    'communityDefault':{
      handler(newVal){
        this.communityDefault = newVal
      },
      immediate:true,
      deep:true,
    },

    'isListEmpty':{
      handler(newVal){
        if(newVal?.length === 0){
          this.communityDefault = this.communityList[1]
        }else{
          this.communityDefault = this.communityList[0]
        }
      },
      immediate:true,
      deep:true,
    }
  }
}
</script>

<style lang="scss" scoped>
:deep(.nav-item){
  border-radius: 8px !important;
  font-size:16px;
  font-weight: 400;
}
</style>