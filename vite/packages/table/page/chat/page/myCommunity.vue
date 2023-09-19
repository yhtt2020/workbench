<template>
 <a-row class="w-full h-full">
  <a-col flex=" 0 1 300px" class="find-left h-full flex flex-col px-3"  style=" border-right:1px solid var(--divider);">
   <div class="flex flex-col">
    <div class="flex justify-between items-center w-full mb-2.5">
     <div class="flex  flex-col">
      <span class="font-500" style="color:var(--primary-text);">{{ info.communityInfo.name }}</span> 
      <span class="font-14" style="color:var(--secondary-text);">一起打磨出闪闪发光的技术宝石！</span>
     </div>
     <ChatDropDown :list="showDropList"/>
    </div>

    <div class="font-14" style="color:var(--secondary-text);"></div>

   </div>

   <a-divider style="height: 1px;margin: 12px 0; background-color: var(--divider)"/>
   
   <div class="flex items-center h-full justify-center flex-col">
     <div v-for="item in emptyList" class="flex  items-center rounded-lg pointer mb-3 active-button h-10 px-3" style="background: var(--secondary-bg);">
        <component :is="item.icon"></component>
        <span class="font-16 ml-3" style="color:var(--primary-text);">{{ item.name }}</span>
     </div>
   </div>


  </a-col>

  <a-col flex=" 1 1 200px" class="h-full flex flex-col">
    <!--  -->
    
  </a-col>
 </a-row>
</template>

<script>
import { defineComponent, reactive, toRefs} from 'vue'
import { showDropList } from '../../../js/data/chatList'
import { Icon as CommunityIcon } from '@iconify/vue'
import { UserAddOutlined,PlusOutlined,MenuUnfoldOutlined } from '@ant-design/icons-vue'

import ChatDropDown from '../components/chatDropDown.vue'

export default defineComponent({
 props:['info'],
 components:{
  ChatDropDown,CommunityIcon,
  UserAddOutlined,PlusOutlined,MenuUnfoldOutlined
 },

 setup (props,ctx) {
  const data = reactive({
    emptyList:[
      {},
      { icon:PlusOutlined,name:'添加新应用',},
      {},
    ]
  })


  return {
    showDropList,
   ...toRefs(data),

  }
 }
})
</script>

<style lang="scss" scoped>
.font-500 {
  font-family: PingFangSC-Medium;
  font-size: 16px;
  font-weight: 500;
}

.font-14 {
  font-family: PingFangSC-Regular;
  font-size: 14px;
  font-weight: 400;
}

.font-16 {
  font-family: PingFangSC-Regular;
  font-size: 16px;
  font-weight: 400;
}

.group-item {
  &:active {
    filter: brightness(0.8);
    opacity: 0.8;
  }

  &:hover {
    background: var(--active-secondary-bg);
  }
}

:deep(.ant-row) {
  display: flex !important;
  flex: row nowrap !important;
}

.flip {
  transform: rotateY(180deg)
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
</style>