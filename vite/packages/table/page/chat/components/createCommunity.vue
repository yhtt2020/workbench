<template>
 <div class="flex flex-col justify-between px-3 pt-3 pb-4" style="width:500px;">
  <div class="flex w-full h-10 items-center justify-center" style="position: relative;margin-bottom: 46px;">
   <!-- 左侧返回按钮 -->
   <div hidden="" class="flex items-center pointer active-button rounded-lg justify-center back h-10 w-10" >
    <LeftOutlined style="font-size: 1.25em;" />
   </div>

   <span class="font-16-400" style="color: var(--primary-text);">创建社群</span>

   <div class="flex items-center pointer active-button rounded-lg justify-center close h-10 w-10" @click="closeCreateCom">
    <CloseOutlined style="font-size: 1.25em;" />
   </div>
  </div>
  
  <div class="flex items-center flex-col">
   <a-avatar :size="64" shape="square" src="/icons/bz1.png"></a-avatar>
   <a-input  placeholder="输入社群名称" class="h-12 search"  style="width: 340px;margin-top: 36px;border-radius: 12px;text-align: center;"></a-input>
   <a-input :disabled="true" placeholder="ID:UH7631" class="h-12 search"  style="width: 340px;margin-top: 12px; margin-bottom:46px; border-radius: 12px;text-align: center;"></a-input>
  </div>

  <div class="flex items-center justify-end ">
    <XtButton style="width:64px;color:var(--secondary-text);" class="h-10 font-16-400" @click="closeCreateCom">取消</XtButton>
    <XtButton class="h-10 ml-3" style="width:64px;background: var(--active-bg);color:var(--active-text);" @click="createCommunity">确定</XtButton>
  </div>
  <!-- CameraOutlined -->
 </div>
</template>

<script>
import { defineComponent } from 'vue'
import { LeftOutlined, CloseOutlined, CameraOutlined} from '@ant-design/icons-vue'


export default defineComponent({
 components:{
  LeftOutlined,CloseOutlined,CameraOutlined
 },
 setup (props,ctx) {

  const closeCreateCom = () =>{
    ctx.emit('close')
  }

  // 创建社群
  const createCommunity = () =>{

  }
  return {
   closeCreateCom,createCommunity,
  }
 }
})
</script>

<style lang="scss" scoped>
.back{
 position: absolute;
 top:0;
 left:0;
 background: var(--secondary-bg);
}
.close{
 position: absolute;
 top:0;
 right:-1px;
 background: var(--secondary-bg);
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
.font-16-400{
 font-family: PingFangSC-Regular;
 font-size: 16px;
 font-weight: 400;
}

:deep(.search){
 &::placeholder{
   color: var(--secondary-text);
 }
}

</style>