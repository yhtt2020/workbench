<template>
  <div class="xt-font xt-text font-16 font-400 mb-4">更多设置</div>
  <div class="xt-bg p-4 flex flex-col rounded-xl" style="width: 452px">
    <span class="xt-font xt-text font-16 font-400 mb-2.5">默认加入群聊</span>
    <span class="xt-font xt-text-2 font-14 font-400 mb-4">可以设置社群新用户加入后，默认加入以下设置的群聊</span>
    <a-select class="w-full rounded-xl custom-select" v-model:value="tagValue" :bordered="false"  mode="tags" style="height: 40px;">
     <a-select-option v-for="item in joinChatList" :key="item.id" :value="item.id" class="z-auto">
       {{ item.name }}
     </a-select-option>
    </a-select>
  </div>
</template>

<script>
import { mapActions,mapWritableState } from 'pinia';
import { communityStore } from '../../store/communityStore'

export default {

  data(){
    return{
      tagValue:[],
    }
  },

  computed:{
    ...mapWritableState(communityStore,['categoryList','channelList']),
    joinChatList(){
      if(this.categoryList.tree.length !== 0){
        const channel = []
        const category = []
        for(const cateItem of this.categoryList.tree){
         if(cateItem.role === 'channel'){
          const index = channel.findIndex((item)=>{
            return item.id === cateItem.id
          })
          if(index === -1){
            channel.push(cateItem)
          }
         }
         if(cateItem.role === 'category'){
          const list = cateItem.children
          for(const childItem of list){
            if(childItem.type === 'group'){
              const index = category.findIndex((item)=>{
                return childItem.id === item.id
              })
              if(index === -1){
                category.push(childItem)
              }
            }
          }
         }
        }
        const mergeList = category.concat(channel)
        return mergeList
      }else{
        return []
      }
    }
  },

  mounted() {
    this.$nextTick(()=>{
      const list = this.joinChatList.slice(0,2)
      const mapName = list.map((item)=>{
       return item.id
      })
      console.log('查看name',mapName);
      this.tagValue = mapName  
    })
  },

  methods:{
    
  }
};
</script>

<style lang="scss" scoped>

/**
:deep(.ant-select-selection-item){
  border: none !important;
  background: var(--active-secondary-bg) !important;
  border-radius: 6px !important;
  height: 28px !important;
  line-height: 28px !important;
}
**/

:deep(.custom-select) {
  & .ant-select-selector {
    border-radius: 8px !important;
    display: flex;
    align-items: center;
    height: 40px !important;
  }

  & .ant-select-item {
    color: var(--secondary-text) !important;
  }
}

:deep(.ant-select-multiple .ant-select-selection-item){
  line-height: 26px !important;
  height: 28px !important;
  background: var(--active-secondary-bg) !important;
  border-radius: 6px !important;
  border: none !important;
}
</style>