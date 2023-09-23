<template>
 <div class="flex flex-col my-3" style="width:500px;">
  <div class="flex w-full mb-5 h-10 items-center justify-center" style="position: relative;">
   <span class="font-16-400" style="color:var(--primary-text);">添加分组</span>
   <div class="close-channel w-10 h-10 flex items-center rounded-lg pointer active-button justify-center"  style="background: var(--secondary-bg);" @click="closeNewGroup">
    <CloseOutlined  style="font-size: 1.25em;"/>
   </div>
  </div>

  <div class="flex flex-col px-6">
   <a-input placeholder="分组名称" class="h-10" style="border-radius: 8px;text-align: center;"></a-input>
   <div class="mt-4 flex items-center justify-end pt-4">
    <XtButton style="width: 64px;height:40px;margin-right: 12px;" @click="closeNewGroup">取消</XtButton>
    <XtButton style="width: 64px;height:40px; background: var(--active-bg);color:var(--active-text);">确定</XtButton>
   </div>
  </div>
 </div>
</template>



<script>
import { defineComponent } from 'vue'
import { CloseOutlined } from '@ant-design/icons-vue'

export default defineComponent({
 components:{
  CloseOutlined
 },

 setup (props,ctx) {
  
  const closeNewGroup = () =>{
   ctx.emit('close')
  }

  return {
   closeNewGroup,
  }
 }
})
</script>


<style lang="scss" scoped>
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
.font-16-400{
 font-family: PingFangSC-Regular;
 font-size: 16px;
 font-weight: 400;
}
</style> 
