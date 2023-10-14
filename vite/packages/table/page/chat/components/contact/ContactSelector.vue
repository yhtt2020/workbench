<template>
 <div class="flex px-6">
  <div class="flex flex-col" style="width:293px;" >
   <a-input hidden=""  class="h-11"  v-model:value="searchKeyword"  placeholder="搜索"  style="border-radius: 10px;">
    <template #suffix>
     <DirectlyIcon icon="fluent:search-20-filled" style="font-size: 1.5rem;cursor: pointer;" @click="search"/>
    </template>
   </a-input>

   <div class="flex my-4"  hidden="">
    <div>我的组织</div>
    <div>我的好友</div>
   </div>

   <div class="category-14-400 my-4" style="color: var(--secondary-text);">{{title}}</div>

   <vue-custom-scrollbar class="flex flex-col" :settings="settingsScroller" style="height:380px;">
    <div v-for="(item,index) in list" :class="{'select-bg':isSelect(index)}" 
     class="flex rounded-lg items-center pointer mb-2 p-3"
     @click="selectCurrentContact(item)"
    >
     <a-avatar :size="32" shape="circle" :src="item.userInfo.avatar"></a-avatar>
     <span class="category-16-400 ml-4" style="color:var(--primary-text);">{{ item.userInfo.nickname }}</span>
    </div>
   </vue-custom-scrollbar>

  </div>
  
  <a-divider type="vertical" style="margin: 0 16px; height: 530px; background-color:var(--divider);" />

  <div style="width:293px" class="flex flex-col">
   <div class="mb-4">已选({{ selectedList.length }}人)</div>

   <vue-custom-scrollbar class="flex flex-col" :settings="settingsScroller" style="height:440px;">
    <div v-for="item in selectedList"  class="flex rounded-lg items-center justify-between pointer mb-2 p-3">
     <div class="flex items-center">
      <a-avatar :size="32" shape="circle" :src="item.userInfo.avatar"></a-avatar>
      <span class="category-16-400 ml-4" style="color:var(--primary-text);">{{ item.userInfo.nickname }}</span>
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
 props:['list','title','no'],

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
  }
 },

 methods:{
  // 搜索
  search(){},

  // 点击选择当前联系人
  selectCurrentContact(item){
   const index = this.selectedList.findIndex((findItem)=>{ return findItem.userInfo.uid === item.userInfo.uid })
   // console.log('判断是否选中',index)
   if(index === -1){
    this.selectedList.push(item)
   }else{
    return;
   }
  },

  // 清除已经选中的联系人
  deleteSelected(item){
   const index = this.selectedList.findIndex((listItem)=>{ return listItem.userInfo.uid === item.userInfo.uid })
   this.selectedList.splice(index,1)
  },

  // 判断有没有选中
  isSelect(index){
   // console.log('查看是否选中',this.selectedList.includes(this.list[index]));
   return this.selectedList.includes(this.list[index])
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