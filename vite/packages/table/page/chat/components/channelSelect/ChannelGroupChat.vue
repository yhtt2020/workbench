<template>
 <div class="flex flex-col my-3" style="width:500px;" v-if="chatShow === false">
  <div class="flex w-full mb-5 h-10 items-center justify-center" style="position: relative;">
   <div class="back-button w-10 h-10 flex items-center rounded-lg pointer active-button justify-center" style="background: var(--secondary-bg);" @click="backChannel">
    <LeftOutlined style="font-size: 1.25em;"></LeftOutlined>
   </div>
   <span class="font-16-400" style="color:var(--primary-text);">添加群聊</span>
   <div class="close-channel w-10 h-10 flex items-center rounded-lg pointer active-button justify-center"  style="background: var(--secondary-bg);" @click="closeChannel">
    <CloseOutlined  style="font-size: 1.25em;"/>
   </div>
  </div>

  <div class="px-6 flex-col mt-4">
   <div v-for="item in list" class="flex flex-col p-4 mb-4 rounded-lg pointer"  @click="selectChannel(item)"
   style="background: var(--secondary-bg);" :class="{'select-bg':listIndex === item.type}">
    <span class="font-16-400 mb-2.5" style="color:var(--primary-text);">{{ item.title }}</span>
    <span class="font-14-400" style="color:var(--secondary-text);">{{ item.summary }}</span>
   </div>
  </div>

  <div class="px-6">
   <div class="flex items-center justify-end">
    <XtButton style="width: 64px;height:40px;margin-right: 12px;" @click="closeChannel">取消</XtButton>
    <XtButton style="width: 64px;height:40px; background: var(--active-bg);color:var(--active-text);"  @click="selectSubmit">选择</XtButton>
   </div>
  </div>
 </div>

 <CreateCommunity v-if="listIndex === 'create' && chatShow === true " :no="no" @close="closeChannel" id="chat" @back="chatShow = false">
 </CreateCommunity>
 
 <SelectKnownGroup :no="no" :type="type" v-if="listIndex === 'already' && chatShow === true" id="contact" @back="chatShow = false" @close="closeChannel">
 </SelectKnownGroup>

</template>

<script>
import { defineComponent,reactive,toRefs } from 'vue'
import { CloseOutlined,LeftOutlined } from '@ant-design/icons-vue'

import CreateCommunity from '../CreateNewGroups.vue'
import SelectKnownGroup from './ChannelKnownGroup.vue'

export default defineComponent({

 props:['type','no'],

 components:{
  CloseOutlined,LeftOutlined,
  CreateCommunity,SelectKnownGroup
 },

 setup (props,ctx) {
  
  const data = reactive({
    list:[
     { title:'创建新群聊',summary:'选择你的联系人，创建一个新的群聊关联到社群中。',type:'create' },
     { title:'添加已有群聊',summary:'选择你已经创建的群聊，将他们批量关联到社群中。',type:'already' }
    ],
    listIndex:'create',
    chatShow:false,
  })

  // 关闭
  const closeChannel = () => {
   ctx.emit('close')
  }

  // 返回
  const backChannel = () =>{
   ctx.emit('back')
  }

  // 选择加入方式
  const selectChannel = (item) =>{
   data.listIndex = item.type
  }

  const selectSubmit = () =>{
   data.chatShow = true
  }
 

  return {
   ...toRefs(data),
   closeChannel,backChannel,selectChannel,selectSubmit
  }
 }
})
</script>

<style lang="scss" scoped>

.font-16-400{
 font-family: PingFangSC-Regular;
 font-size: 16px;
 font-weight: 400;
}

.close-channel{
 position: absolute;
 top:1px;
 right:12px;
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

.font-14-400{
 font-family: PingFangSC-Regular;
 font-size: 14px;
 font-weight: 400;
}

.back-button{
 position: absolute;
 top: 1px ;
 left: 12px;
}

.select-bg{
 background: var(--active-secondary-bg) !important;
 border:1px solid var(--active-bg) !important;
}
</style>