<template>
 <div class="flex flex-col my-3" style="width:500px;">
  <div class="flex w-full mb-5 h-10 items-center justify-center" style="position: relative;">
   <div class="back-button w-10 h-10 flex items-center rounded-lg pointer active-button justify-center" style="background: var(--secondary-bg);" @click="backChannel">
    <ClassIcon  icon="fluent:chevron-left-16-filled" style="font-size: 2em;" />
   </div>
   <span class="font-16-400" style="color:var(--primary-text);">选择社区圈子</span>
   <div class="close-channel w-10 h-10 flex items-center rounded-lg pointer active-button justify-center"  style="background: var(--secondary-bg);" @click="closeChannel">
    <ClassIcon icon="fluent:dismiss-16-filled" style="font-size: 1.75em;"/>
   </div>
  </div>

  <div class="flex flex-col px-6">
   <span class="font-16-400 mb-4" style="color: var(--primary-text);">我创建的圈子({{ forumList.length }})</span>
  
   <vue-custom-scrollbar :settings="settingsScroller" style="height: 300px;">
    <div v-for="item in forumList" class="flex items-center p-5 rounded-lg" style="background: var(--secondary-bg);" @click="selectForum(item)">
     <a-avatar :size="40" shape="square" :src="item.logo"></a-avatar>
     <span class="category-16-400 ml-3" style="color:var(--primary-text);">{{ item.name }}</span>
    </div>
   </vue-custom-scrollbar>
   
   

   <div class="mt-4 flex items-center justify-end" style="height:40px;">
    <XtButton style="width: 64px;height:40px;margin-right: 12px;" @click="closeChannel">
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
import { mapActions,mapWritableState } from 'pinia'
import { forumStore } from '../../store/forumStore'
import { Icon as ClassIcon} from '@iconify/vue'

export default {
 components:{
  ClassIcon,
 },

 data(){
  return{
   settingsScroller: {
    useBothWheelAxes: true,
    swipeEasing: true,
    suppressScrollY: false,
    suppressScrollX: true,
    wheelPropagation: true
   },
   
  }
 },

 computed:{
  ...mapWritableState(forumStore,['forumList'])
 },

 async mounted(){
  await this.getForumData()
 },


 methods:{
  ...mapActions(forumStore,['getForumData']),
  closeChannel(){
   this.$emit('close')
  },
  backChannel(){
   this.$emit('back')
  },

  // 选择指定的版块
  selectForum(item){
    
  }
 

 },


}
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