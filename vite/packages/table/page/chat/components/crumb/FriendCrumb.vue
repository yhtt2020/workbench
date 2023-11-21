<template>
 <div class="my-4 flex justify-between">
  <a-breadcrumb :separator="separator">
   <a-breadcrumb-item v-for="(item, index) in breadcrumb" class="pointer " :key="index" @click="backCrumb(item)">
    <span :style="item.color ? {color:`${item.color}`} : {color:'var(--secondary-text)'}" class="category-14-400">{{ item.name }}</span>
   </a-breadcrumb-item>
  </a-breadcrumb>
  <a-checkbox class="custom-checkbox-font" v-model:checked="settings.isAllSelected" >全选</a-checkbox>
 </div>

 <vue-custom-scrollbar class="flex flex-col " :settings="settingsScroller" style="height:430px;">
  <div v-for="(item,index) in friendList" :class="{'select-bg':isSelect(index)}" 
   class="flex rounded-lg items-center pointer mb-2 p-3" @click="currentFriend(item)"
  >
   <a-avatar :size="32" shape="circle" :src="item.avatar"></a-avatar>
   <span class="font-16 font-400 ml-4" style="color:var(--primary-text);">{{ item.nick }}</span> 
  </div>
 </vue-custom-scrollbar>
</template>

<script>
import { mapActions,mapWritableState } from 'pinia'
import {appStore} from '../../../../store'

export default {
 props:['selectList'],

 data(){
  return{
   breadcrumb: [
    {name:'联系人',path:'/',type:'contact',color:'var(--active-bg)'},
    {name:'我的好友',path:'/myFriend',type:'friend',}
   ],
   separator: '/',
   friendList:[],

   // 滚动条配置 
   settingsScroller: {
    useBothWheelAxes: true,
    swipeEasing: true,
    suppressScrollY: false,
    suppressScrollX: true,
    wheelPropagation: true
   }
  }
 },

 computed:{
  ...mapWritableState(appStore,['settings'])
 },

 async  mounted(){
  const server = window.$TUIKit
  const res  = await server.tim.getFriendList()
  const list = res?.data.map((item)=>{ return item.profile })
  // console.log('获取好友数据',list);
  this.friendList = list
 },

 methods:{
  isSelect(index){
   return this.selectList.includes(this.friendList[index])
  },

  backCrumb(item){
   if(item.type === 'contact'){
    this.$emit('back')
   }
  },

  currentFriend(item){
   this.$emit('currentClick',item)
  },


 },

 watch:{
  'settings.isAllSelected':{
    handler(newVal){
      if(newVal){
        this.$emit('updateList',this.friendList)
      }
    },
    immediate:true,
    deep:true,
    
  }
 }
}

</script>

<style lang="scss" scoped>
:deep(.select-bg){
 border: 1px solid var(--active-bg);
 background: var(--active-secondary-bg) !important;
}
</style>