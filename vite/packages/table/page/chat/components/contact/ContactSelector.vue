<template>
 <div class="flex px-6">
  <div class="flex flex-col" style="width:293px;" >
   <a-input    class="h-11"  v-model:value="searchKeyword"  placeholder="搜索" @pressEnter="search"  style="border-radius: 10px;">
    <template #suffix>
     <DirectlyIcon icon="fluent:search-20-filled" style="font-size: 1.5rem;cursor: pointer;" @click="search"/>
    </template>
   </a-input>

   <div class="flex my-4" >
      <div class="flex items-center pointer" v-for="item in joinCategory" @click="openCrumbs(item)">
        <div class="flex items-center rounded-lg w-10 h-10 justify-center" :style="{background:`${item.bgColor}`}">
          <DirectlyIcon :icon="item.icon" :style="{color:`${item.iconColor}`}" style="font-size: 1.5rem;"/>
        </div>
        <span class="ml-3">{{ item.name }}</span>
      </div>
   </div>

   <div class="category-14-400 my-4" style="color: var(--secondary-text);">{{title}}</div>

   <vue-custom-scrollbar class="flex flex-col" :settings="settingsScroller" style="height:380px;">
    <div v-for="(item,index) in list.teamData" :class="{'select-bg':isSelect(index)}" 
     class="flex rounded-lg items-center pointer mb-2 p-3"
     @click="selectCurrentContact(item)"
    >
     
     <template v-if="item.userInfo">
      <a-avatar :size="32" shape="circle" :src="item.userInfo.avatar"></a-avatar>
      <span class="category-16-400 ml-4" style="color:var(--primary-text);">{{ item.userInfo.nickname }}</span> 
     </template>

     <template v-else>
      <a-avatar :size="32" :shape="item.nick ? 'circle' : 'square'" :src="item.avatar"></a-avatar>
      <span class="category-16-400 ml-4" style="color:var(--primary-text);">{{ item.nick ? item.nick : item.name }}</span> 
     </template>
    </div>
   </vue-custom-scrollbar>

  </div>
  
  <a-divider type="vertical" style="margin: 0 16px; height: 530px; background-color:var(--divider);" />

  <div style="width:293px" class="flex flex-col">
   <div class="mb-4">已选({{ selectedList.length }}人)</div>

   <vue-custom-scrollbar class="flex flex-col" :settings="settingsScroller" style="height:440px;">
    <div v-for="item in selectedList"  class="flex rounded-lg items-center justify-between pointer mb-2 p-3">
     <div class="flex items-center" v-if="item.userInfo">
      <a-avatar :size="32" shape="circle" :src="item.userInfo.avatar"></a-avatar>
      <span class="category-16-400 ml-4" style="color:var(--primary-text);">{{ item.userInfo.nickname }}</span>
     </div>

     <div class="flex items-center" v-else>
      <a-avatar :size="32" :shape="item.nick ? 'circle' : 'square'" :src="item.avatar"></a-avatar>
      <span class="category-16-400 ml-4" style="color:var(--primary-text);">{{ item.nick ? item.nick : item.name }}</span>
     </div>


     <div class="flex items-center justify-center category-button" @click="deleteSelected(item)">
      <DirectlyIcon icon="zondicons:minus-solid" style="font-size: 1.29rem;color:var(--secondary-text);" />
     </div>
    </div>
   </vue-custom-scrollbar>

   <div class="flex justify-end mt-4">
    <XtButton style="width: 64px;height:40px;margin-right: 12px;" @click="closeButton">取消</XtButton>
    <div class="flex items-center justify-center pointer category-button rounded-lg" style="width: 64px;background: var(--active-bg);">确定</div>
   </div>

  </div>
 </div>

</template>

<script>
import { Icon as DirectlyIcon } from '@iconify/vue'
export default {
 props:['list','title','no','inviteMode'],

 components:{
  DirectlyIcon
 },

 data(){
  return{
   searchKeyword:'',
   // 滚动条配置 
   settingsScroller: {
    useBothWheelAxes: true,
    swipeEasing: true,
    suppressScrollY: false,
    suppressScrollX: true,
    wheelPropagation: true
   },
   selectedList:[],
   joinCategory:[
    // { icon:'fluent:people-16-regular',name:'我的组织',type:'myOrganize',bgColor:'var(----active-secondary-bg)',iconColor:'var(--active-bg)' },
    { icon:'fluent:chat-16-regular',name:'我的好友',type:'myFriend',bgColor:'rgba(250,173,20,0.2)',iconColor:'var(--warning)'},
   ]
  }
 },

 methods:{
  // 点击选择当前联系人
  selectCurrentContact(item){
   if(item.userInfo){
    
    const index = this.selectedList.findIndex((findItem)=>{ return findItem.userInfo.uid === item.userInfo.uid })
    // console.log('判断是否选中',index)
    if(index === -1){
     this.selectedList.push(item)
    }else{
     return;
    }

   }else{
    
    if(item.groupID){
     const index = this.selectedList.findIndex((listItem)=>{ return String(listItem.groupID) === String(item.groupID) })
     if(index === -1){
      this.selectedList.push(item)
     }
    }else{
     const index = this.selectedList.findIndex((listItem)=>{ return String(listItem.userID) === String(item.userID) })
     if(index === -1){
      this.selectedList.push(item)
     }
    }

   }
   
  },

  // 清除已经选中的联系人
  deleteSelected(item){
   if(item.userInfo){
    const index = this.selectedList.findIndex((listItem)=>{ return listItem.userInfo.uid === item.userInfo.uid })
    this.selectedList.splice(index,1)
   }else{
    if(item.groupID){
     const index = this.selectedList.findIndex((listItem)=>{ return String(listItem.groupID) === String(item.groupID) })
     this.selectedList.splice(index,1)
    }else{
     // console.log('查看原因',item)
     const index = this.selectedList.findIndex((listItem)=>{ return String(listItem.userID) === String(item.userID) })
     this.selectedList.splice(index,1)
    }
   
   }
  },

  // 判断有没有选中
  isSelect(index){
   // console.log('查看是否选中',this.selectedList.includes(this.list[index]));
   return this.selectedList.includes(this.list.teamData[index])
  },

  // 搜索
  search(){
   if(this.inviteMode === 'direct'){
    console.log('搜索直接邀请操作');
    this.list = []

   }else{
    // console.log('搜索最近聊天数据');
   }
  },

  // 开启面包屑
  openCrumbs(item){

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