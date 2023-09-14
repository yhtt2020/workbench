<template>
 <div style="width:500px;" class="flex flex-col justify-between px-3 pt-3 pb-4">
  <div class="flex w-full h-10 items-center justify-center" style="position: relative;margin-bottom: 46px;">
   <span class="font-16-400" style="color: var(--primary-text);">加入社群</span>

   <div class="flex items-center pointer active-button rounded-lg justify-center close h-10 w-10" @click="closeJoinCom">
    <CloseOutlined style="font-size: 1.25em;" />
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
  const closeJoinCom = () =>{
    ctx.emit('close')
  }  
  
  return {
   closeJoinCom
  }
 }
})
</script>

<style lang="scss" scoped>
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
</style>