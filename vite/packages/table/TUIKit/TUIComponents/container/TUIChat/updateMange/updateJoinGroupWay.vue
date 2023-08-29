<template>
 <RadioTab :navList="dataType" v-model:selectType="defaultType"></RadioTab>
</template>

<script>
import { defineComponent,watch,reactive,toRefs } from 'vue'
import RadioTab from "../../../../../components/RadioTab.vue";
import _ from "lodash-es";
import { message } from "ant-design-vue";

export default defineComponent({
 components:{RadioTab},
 props: ["updateGroupInfo"],

 setup(props,ctx){
  const types = window.$TUIKit.TIM.TYPES

  const data = reactive({
   dataType:[
    {title:'需要验证',name:types.JOIN_OPTIONS_NEED_PERMISSION},
    {title:'自由加入',name:types.JOIN_OPTIONS_FREE_ACCESS},
    {title:'禁止加群',name:types.JOIN_OPTIONS_DISABLE_APPLY}
   ],
   defaultType:{title:props.updateGroupInfo.title,name:props.updateGroupInfo.conversation.joinOption}
  })

  watch(()=>data.defaultType,(newVal)=>{
   data.defaultType = newVal
   updateGroupJoin(newVal)
  })

  const updateGroupJoin = (newVal) =>{
   const options = {
    groupID:props.updateGroupInfo.groupID,
    joinOption:newVal.name,
   }
   
   window.$chat.updateGroupProfile(options).then(res=>{
    try {
     if(res.code === 0){
      message.success('加群方式修改成功')
      ctx.emit('updateGroupInfo')
      ctx.emit('close')
     }
    } catch (error) {
     console.warn(error)
    }
    
   })

  }

  return{
   ...toRefs(data),updateGroupJoin,
  }
 }

})
// export default {
//  

//  

//  data() {
//   return {
   
//   };
//  },

//  watch:{
//   'defaultType':{
//    async handler(newVal){
//     this.defaultType = newVal
//     const options = { 
//     
//      inviteOption:this.defaultType.name,
//      joinOption:this.defaultType.name,
//     }

//     const res = await window.$chat.updateGroupProfile(options)

//     if(res.code === 0){
//      message.success('群聊加群方式已修改')
//     }
//    },
//    immediate:true,
//   }
//  }

// }
</script>

<style lang="sass" scoped>
</style>