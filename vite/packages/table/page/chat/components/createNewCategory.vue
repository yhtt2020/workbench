<template>
 <div class="flex flex-col my-3" style="width:500px;">
  <div class="flex w-full mb-5 h-10 items-center justify-center" style="position: relative;">
   <span class="font-16-400" style="color:var(--primary-text);">添加分组</span>
   <div class="close-channel w-10 h-10 flex items-center rounded-lg pointer active-button justify-center"  style="background: var(--secondary-bg);" @click="closeNewGroup">
    <CloseOutlined  style="font-size: 1.25em;"/>
   </div>
  </div>

  <div class="flex flex-col px-6">
   <a-input placeholder="分组名称" v-model:value="categoryName" class="h-10" style="border-radius: 8px;text-align: center;"></a-input>
   <div class="mt-4 flex items-center justify-end pt-4">
    <XtButton style="width: 64px;height:40px;margin-right: 12px;" @click="closeNewGroup">取消</XtButton>
    <XtButton style="width: 64px;height:40px; background: var(--active-bg);color:var(--active-text);" @click="submitCategory">确定</XtButton>
   </div>
  </div>
 </div>
</template>

<script>
import { defineComponent, reactive,toRefs,computed,} from 'vue'
import { CloseOutlined } from '@ant-design/icons-vue'
import { communityStore } from '../store/communityStore'
import { message } from 'ant-design-vue'


export default defineComponent({
 props:['no'],

 components:{
  CloseOutlined
 },

 setup (props,ctx) {

  const category = communityStore()

  const data = reactive({
   categoryName:''  // 接收分组名称
  })
  
  const closeNewGroup = () => {
   ctx.emit('close')
  }

  // 创建分组按钮
  const submitCategory = async () =>{
   if(data.categoryName !== ''){ 
    // 创建频道目录参数
    const option = {   
     name:data.categoryName, communityNo:props.no,
     type:'category',role:'category',parentId:0,
    }
    const categoryRes =  await category.createChannel(option)
    if(categoryRes.status === 1){
     message.success(`${categoryRes.info}`)
     const getChannelOption = { communityNo:props.no,cache:1 }
     category.getChannel(getChannelOption)
     closeNewGroup()
    }else{
     message.error(`${categoryRes.info}`)
     closeNewGroup()
    }
   }
  }



  return {
   ...toRefs(data), 
   closeNewGroup,submitCategory,
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
</style>
