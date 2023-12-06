<template>
 <div class="flex flex-col my-3" style="width:500px;" v-if="classShow === false">
  <ModalTop title="选择社区版块" back="true" @close="closeChannel" @back="backChannel"/>

  <div class="flex flex-col px-6">
   <span class="font-16 font-400 mb-4 xt-text" >我创建的版块({{ forumList.length }})</span>

   <template v-if="forumList.length === 0">
    <EmptyStatus />
   </template>

   <vue-custom-scrollbar :settings="settingsScroller" style="height: 300px;" v-else>
    <div v-for="(item,index) in forumList" class="flex items-center mb-3 pointer p-5 rounded-lg xt-bg-2" 
     :class="{'select-bg':selectIndex === index}" @click="selectForum(index,item)"
    >
     <a-avatar :size="40" shape="square" :src="item.logo"></a-avatar>
     <span class="font-16 font-400 ml-3 xt-text">{{ item.name }}</span>
    </div>
   </vue-custom-scrollbar>

   <div class="mt-4 flex items-center justify-end" style="height:40px;">
    <xt-button w="64" h="40" class="category-button mr-3" @click="closeChannel">取消</xt-button>
    <xt-button w="64" h="40" class="category-button" type="theme" @click="selectNext">选择</xt-button>
   </div>
  </div>
 </div>

 <ChannelClassification v-else  :no="no" type="forum" :data="selectForumItem" @classBack="classShow = false"/>
</template>

<script>
import { mapActions,mapWritableState } from 'pinia'
import { forumStore } from '../../store/forumStore'
import { Icon as ClassIcon} from '@iconify/vue'

import ChannelClassification from './ChannelClassification.vue';
import ModalTop from '../ModalTop.vue';
import EmptyStatus from '../empty/EmptyStatus.vue';

export default {
 components:{
  ClassIcon,
  ChannelClassification,
  ModalTop,EmptyStatus
 },

 props:['no'],

 data(){
  return{
   settingsScroller: {
    useBothWheelAxes: true,
    swipeEasing: true,
    suppressScrollY: false,
    suppressScrollX: true,
    wheelPropagation: true
   },
   selectIndex:-1,
   selectForumItem:'',
   classShow:false
  }
 },

 computed:{
  ...mapWritableState(forumStore,['forumList'])
 },

 mounted(){
  this.$nextTick(()=>{
   this.getForumData()
  })
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
  selectForum(index,item){
   if(this.selectIndex === index){
    this.selectIndex = -1
    this.selectForumItem = ''
   }else{
    this.selectIndex = index
    this.selectForumItem = item
   }
  },

  // 选择下一步
  selectNext(evt){
   if(this.selectForumItem !== ''){
    this.classShow = true
   }else{
    evt.preventDefault();
   }
  }
 },
}
</script>

<style lang="scss" scoped>
.close-channel{
 position: absolute;
 top:1px;
 right:12px;
}
.back-button{
 position: absolute;
 top: 1px ;
 left: 12px;
}
.select-bg{
 background: var(--active-secondary-bg) !important;
 border:1px solid var(--active-bg) !important;
}
</style>
