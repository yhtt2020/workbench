<template>
 <RadioTab :navList="dataType" v-model:selectType="defaultType"></RadioTab>
</template>

<script>
import RadioTab from "../../../../../components/RadioTab.vue";
import _ from "lodash-es";
import { message } from "ant-design-vue";

export default {
 components:{RadioTab},

 props: ["updateGroupInfo"],

 data() {
  return {
   dataType:[
    {title:'需要验证',name:'NeedPermission'},
    {title:'自由加入',name:'FreeAccess'},
    {title:'禁止加入',name:'DisableInvite'}
   ],
   defaultType:{title:this.updateGroupInfo.title,name:this.updateGroupInfo.conversation.joinOption}
  };
 },

 watch:{
  'defaultType':{
   async handler(newVal){
    this.defaultType = newVal
    const options = { 
     groupID:this.updateGroupInfo.groupID,
     inviteOption:this.defaultType.name,
     joinOption:this.defaultType.name,
    }

    const res = await window.$chat.updateGroupProfile(options)

    if(res.code === 0){
     message.success('群聊加群方式已修改')
    }
   },
   immediate:true,
  }
 }

}
</script>

<style lang="sass" scoped>
</style>