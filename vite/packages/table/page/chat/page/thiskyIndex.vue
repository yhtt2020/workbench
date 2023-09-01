<template>
 <div class="flex w-full h-full">
  <div class="px-3 flex flex-col" style="width:240px;border-right:1px solid var(--divider)">

   <div class="flex flex-col">
    <div class="flex justify-between mb-2.5">
     <span class="font-500" style="color:var(--primary-text);">想天工作台官方社群</span>
     <ChatDropDown />
    </div>
    <div class="font-14" style="color:var(--secondary-text);">
     欢迎加入想天工作台官方社群，在这里您可以了解到和产品有关的一切
    </div>
   </div>

   <a-divider style="height: 1px;margin: 12px 0; background-color: var(--divider)" />

   <ChatFold :title="use">
    <div>折叠</div>
   </ChatFold>
   
  </div>

 </div>
</template>

<script lang="ts">
import { defineComponent,reactive,toRefs } from 'vue'
import ChatDropDown from '../components/chatDropDown.vue'
import ChatFold from '../components/chatFold.vue'
import { chatList } from '../../../js/data/chatList'
import { CaretRightOutlined } from '@ant-design/icons-vue'

export default defineComponent({

 components:{
  ChatDropDown,
  ChatFold,
  CaretRightOutlined
 },

 setup () {
  const data = reactive({
   use:'常用',
   // icon:'CaretRightOutlined',
   // treeData:[
   //  {
   //   title:'常用',
   //   key: '0-0',
   //   children:chatList.commonUse
   //  },
   //  {
   //   title:'产品相关',
   //   key:'0-1',
   //   children:chatList.productRelated
   //  },
   //  {
   //   title:'交流群',
   //   key:'0-2',
   //   children:chatList.group
   //  }
   // ]
  })

  return {
   ...toRefs(data),
  }
 }
})
</script>

<style lang="scss" scoped>
.font-500{
 font-family: PingFangSC-Medium;
 font-size: 16px;
 font-weight: 500;
}

.font-14{
 font-family: PingFangSC-Regular;
 font-size: 14px;
 font-weight: 400;
}
</style>