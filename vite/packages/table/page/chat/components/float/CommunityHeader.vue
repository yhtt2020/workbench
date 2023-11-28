<template>
 <div class="p-3 flex items-center " v-if="headerIcon !== ''">
   <div class="flex items-center justify-center px-2.5 py-2.5 rounded-md h-10" style="background: rgba(80,139,254,0.20);">
    <div class="flex items-center justify-center mr-2.5">
      <HeaderIcon :icon="headerIcon" style="font-size: 1.25rem;"/>
    </div>
    <div class="font-16 font-400 xt-text xt-font flex items-center justify-center">{{  headerTitle }}</div>
   </div>
 </div>
 <a-divider style="height: 1px; margin: 0 0 12px 0;" v-if="headerIcon !== ''"/>
</template>

<script>
import _ from 'lodash-es'
import { Icon as HeaderIcon } from '@iconify/vue'

export default {
 props:['headerContent'],
 
 components:{
  HeaderIcon
 },

 data(){
  return{
   icon:[
    {type:'forum',icon:'fluent-emoji-flat:placard'},
    {type:'group',icon:'fluent-emoji-flat:thought-balloon'},
    {type:'link',icon:'fluent-emoji-flat:globe-with-meridians'},
    {type:'communitySet',icon:'fluent:settings-16-regular'},
    {type:'desk',icon:''}
   ]
  }
 },

 computed:{
  headerIcon(){
    if(Object.keys(this.headerContent).length !== 0){
      const type = this.headerContent.type
      const findItem = _.find(this.icon,function(item){
       return type === item.type
      })
      // console.log('查看',findItem);
      return findItem.icon
    }else{
      return ''
    }
  },
  headerTitle(){
    if(Object.keys(this.headerContent).length !== 0){
      const groupName = this.headerContent.type !== 'communitySet' ? this.headerContent.name : '社群设置';
      // console.log('查看2',groupName);
      return groupName
    }else{
      return;
    }
  }
 },

}
</script>

<style lang="scss" scoped>

</style>