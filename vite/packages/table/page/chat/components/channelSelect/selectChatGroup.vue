<template>
 <div class="flex flex-col my-3" style="width:500px;">
  <div class="flex w-full mb-5 h-10 items-center justify-center" style="position: relative;">
   <div class="back-button w-10 h-10 flex items-center rounded-lg pointer active-button justify-center" style="background: var(--secondary-bg);" @click="backChannel">
    <LeftOutlined style="font-size: 1.25em;"></LeftOutlined>
   </div>
   <span class="font-16-400" style="color:var(--primary-text);">选择群聊</span>
   <div class="close-channel w-10 h-10 flex items-center rounded-lg pointer active-button justify-center"  style="background: var(--secondary-bg);" @click="closeGroup">
    <CloseOutlined  style="font-size: 1.25em;"/>
   </div>
  </div>

  <div class="flex px-6">
   <div class="flex" style="width: 293px;">
     
   </div>
   <a-divider type="vertical" style="height:442px; margin: 0 16px; background-color:var(--divider);" />
   <div class="flex" style="width: 293px;">
     
   </div>
  </div>



 </div>
</template>

<script>
import { computed, defineComponent } from 'vue'
import { CloseOutlined,LeftOutlined } from '@ant-design/icons-vue'
import _ from 'lodash-es'


export default defineComponent({
 components:{
  CloseOutlined,LeftOutlined
 },
 setup (props,ctx) {
  const tui = window.$TUIKit

  
  const backChannel = ()=>{
   ctx.emit('back')
  }

  const closeGroup = () =>{
   ctx.emit('close')
  }

  const filterList = computed(()=>{
   const list = tui.TUIServer.TUIGroup.store.groupList
   const arr = _.filter(list,function(o){
    return o.selfInfo.role !== 'Member'
   })
   return arr
  })
  

  return {
   filterList,
   backChannel,closeGroup
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