<template>
 <RadioTab :navList="dataType" v-model:selectType="defaultType"></RadioTab>
</template>

<script lang="ts">
import { defineComponent, reactive,toRefs,watch } from 'vue'
import RadioTab from "../../../../../components/RadioTab.vue";
import { message } from "ant-design-vue";

export default defineComponent({
 props:['updateInviteInfo'],

 components:{
  RadioTab
 },

 setup (props,ctx) {
  const types = window.$TUIKit.TIM.TYPES

  const data = reactive({
   dataType:[
    {title:'需要验证',name:types.JOIN_OPTIONS_NEED_PERMISSION},
    {title:'自由邀请',name:types.JOIN_OPTIONS_FREE_ACCESS},
    {title:'禁止邀请',name:types.JOIN_OPTIONS_DISABLE_APPLY}
   ],
   defaultType:{
    title:props.updateInviteInfo.title,
    name:props.updateInviteInfo?.conversation?.inviteOption
   }
  })  
  
  watch(()=>data.defaultType,(newVal)=>{
   data.defaultType = newVal
   updateGroupInvite(newVal)
  })

  const updateGroupInvite = (newVal:any) =>{
   const options = {
    groupID:props.updateInviteInfo.groupID,
    inviteOption:newVal.name,
   }
   console.log(options)
   window.$chat.updateGroupProfile(options).then(res=>{
    try {
     if(res.code === 0){
      message.success('邀请方式修改成功')
      ctx.emit('updateGroupInfo')
      ctx.emit('close')
     }
    } catch (error) {
     console.warn(error)
    }
   })

  }

  return {
   ...toRefs(data),updateGroupInvite
  }
 }
})
</script>

<style lang="scss" scoped>

</style>