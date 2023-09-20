<template>
 <div class="flex flex-col my-3" style="width:500px;">
  <div class="flex w-full mb-5 h-10 items-center justify-center" style="position: relative;">
   <div class="back-button w-10 h-10 flex items-center rounded-lg pointer active-button justify-center" style="background: var(--secondary-bg);" @click="backChannel">
    <LeftOutlined style="font-size: 1.25em;"></LeftOutlined>
   </div>
   <span class="font-16-400" style="color:var(--primary-text);">选择社区圈子</span>
   <div class="close-channel w-10 h-10 flex items-center rounded-lg pointer active-button justify-center"  style="background: var(--secondary-bg);" @click="closeChannel">
    <CloseOutlined  style="font-size: 1.25em;"/>
   </div>
  </div>

  <div class="flex flex-col px-6">
   <span class="px-4 font-16-400 mb-4" style="color: var(--primary-text);">我创建的圈子({{ createGroup.length }})</span>
   
   

   <div class="mt-4 flex items-center justify-end" style="height:40px;">
    <XtButton style="width: 64px;height:40px;margin-right: 12px;" @close="closeChannel">
     取消
    </XtButton>

    <XtButton style="width: 64px;height:40px; background: var(--active-bg);color:var(--active-text);">
     选择
    </XtButton>
   </div>
  </div>
 </div>
</template>

<script>
import { computed, defineComponent, reactive, toRefs } from 'vue'
import { CloseOutlined,LeftOutlined } from '@ant-design/icons-vue'
import _ from 'lodash-es'

export default defineComponent({

 props:['type'],

 components:{
  CloseOutlined,LeftOutlined,
 },

 setup (props,ctx) {

  const data = reactive({
   settingsScroller: {
    useBothWheelAxes: true,
    swipeEasing: true,
    suppressScrollY: false,
    suppressScrollX: true,
    wheelPropagation: true
   }
  })


  // 关闭
  const closeChannel = () => {
   ctx.emit('close')
  }

  // 返回
  const backChannel = () =>{
   ctx.emit('back')
  }

  return {
   ...toRefs(data),
   closeChannel,backChannel
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
</style>