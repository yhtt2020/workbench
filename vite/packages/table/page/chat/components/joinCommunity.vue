<template>
  <div style="width:500px;" class="flex flex-col justify-between px-3 pt-3 pb-4">
   <div class="flex w-full h-10 items-center justify-center" style="position: relative;margin-bottom:16px;">
    <span class="font-16-400" style="color: var(--primary-text);">加入社群</span>

    <div class="flex items-center pointer active-button rounded-lg justify-center close h-10 w-10" @click="closeJoinCom">
     <CloseOutlined style="font-size: 1.25em;color:var(--secondary-text);" />
    </div>
   </div>

   <div class="w-full flex items-center justify-center" style="margin: 0 0 16px 0;">
     <div style="width:452px;" >
       <a-input placeholder="搜索" :spellcheck="false" v-model:value="searchId" class="h-10" style="border-radius: 10px;" @keyup.enter="searchCommunity" @input="searchCommunity">
         <template #suffix>
           <SearchOutlined @click="searchCommunity"/>
         </template>
       </a-input>
     </div>
   </div>

   <div class="w-full flex items-center justify-center mb-6">
     <div style="width:452px; color:var(--secondary-text);" class="font-14-400" v-if="searchId === ''">
       推荐社群
     </div>
     <div style="width:452px; color:var(--secondary-text);" class="font-14-400" v-else>
       搜索结果
     </div>
   </div>

   <vue-custom-scrollbar :settings="settingsScroller" style="height:466px;">
     <div class="w-full flex items-center justify-center">
       <div class="flex grid grid-cols-2 gap-3" style="width:452px;" v-if="searchId === ''">
         <div v-for="item in filterRecommendList" class="flex flex-col rounded-lg p-4" style="background: var(--secondary-bg);">
           <div class="flex items-center mb-3">
             <a-avatar :size="40" :src="item.icon" shape="square"></a-avatar>
             <span class="font-16-500 pl-3 truncate" style="color:var(--primary-text);">{{ item.name }}</span>
           </div>
           <div class="flex justify-between">
             <span class="font-12-400" style="color:var(--secondary-text);">{{ item.memberNum }}人</span>
             <span class="font-12-400" style="color:var(--secondary-text);">{{ item.joinOption === 'freeAccess' ? '公开加入' : '审核加入' }}</span>
           </div>

           <a-divider style="height: 2px; background-color: var(--divider);margin: 16px 0;" />

           <XtButton v-if="isJoin(item)" style="background:var(--active-secondary-bg);color:var(--secondary-text);height:40px;width:100%;" @click="closeJoinCom">已加入</XtButton>
           <XtButton v-else  style="background:var(--active-bg);color:var(--active-text);height:40px;width:100%;" @click="nowJoin(item)">立即加入</XtButton>
         </div>
       </div>

       <div class="flex grid grid-cols-2 gap-3" style="width:452px;" v-else>
         <div v-for="item in searchResult" class="flex flex-col rounded-lg p-4" style="background: var(--secondary-bg);">
           <div class="flex items-center mb-3">
             <a-avatar :size="40" :src="item.icon" shape="square"></a-avatar>
             <span class="font-16-500 pl-3 truncate" style="color:var(--primary-text);">{{ item.name }}</span>
           </div>

           <div class="flex justify-between">
             <span class="font-12-400" style="color:var(--secondary-text);">{{ item.memberNum }}人</span>
             <span class="font-12-400" style="color:var(--secondary-text);">{{ item.joinOption === 'freeAccess' ? '公开加入' : '审核加入' }}</span>
           </div>
           <a-divider style="height: 2px; background-color: var(--divider);margin: 16px 0;" />
           <XtButton v-if="isJoin(item)" style="background:var(--active-secondary-bg);color:var(--secondary-text);height:40px;width:100%;" @click="closeJoinCom">已加入</XtButton>
           <XtButton v-else style="background:var(--active-bg);color:var(--active-text);height:40px;width:100%;" @click="nowJoin(item)">立即加入</XtButton>
         </div>
       </div>

     </div>
   </vue-custom-scrollbar>

  </div>
 </template>

 <script>
 import { defineComponent, onMounted, reactive, toRefs,computed } from 'vue'
 import { CloseOutlined,SearchOutlined } from '@ant-design/icons-vue'
 import { communityStore } from '../store/communityStore'
 import { message } from 'ant-design-vue'
 import _ from 'lodash-es'


 export default defineComponent({
  components:{
   CloseOutlined,SearchOutlined
  },
  setup (props,ctx) {

   const myCom = communityStore()


   const data = reactive({
     settingsScroller: {
       useBothWheelAxes: true,
       swipeEasing: true,
       suppressScrollY: false,
       suppressScrollX: true,
       wheelPropagation: true
     },
     searchId:'',
     searchResult:[],
   })


   // 关闭加入弹窗
   const closeJoinCom = () =>{
     ctx.emit('close')
   }

   // 搜索社群
   const searchCommunity = (evt) =>{
     if(data.searchId !== ''){
       myCom.searchCommendCommunity(data.searchId).then(result=>{
         data.searchResult = result.data.list
       })
     }else{
       evt.preventDefault();
     }
   }

   // 加入社群
   const nowJoin = (item) =>{
     myCom.joinCommunity({no:item.no}).then(res=>{
       if(res.status === 1){
         myCom.getMyCommunity()
         message.success(`${res.info}`)
         ctx.emit('close')
       }else{
         message.error(`${res.info},${res.data.reason}`)
         ctx.emit('close')
       }
     })
   }

   // 判断是否已经加入社群
   const isJoin = (data) =>{
     const index = _.find(myCom.communityList,function(item){ return item.id === data.id })
     // console.log('判断是否加入社群',index)
     if(index !== undefined){
       // console.log('排查问题::>>',index)
       return index.communityInfo.status === 1
     }
   }

   // 将获取的推荐社群进行去重操作
   const filterRecommendList = computed(()=>{
     const list = Object.values(myCom.recommendCommunityList.reduce((acc, curr) => {
      if (!acc[curr.id]) {
       acc[curr.id] = curr;
      }
      return acc;
     }, {}));
     return list
   })



   return {
     filterRecommendList,
     isJoin,closeJoinCom,...toRefs(data),searchCommunity,nowJoin
   }
  }
 })
 </script>

 <style lang="scss" scoped>
 .close{
  position: absolute;
  top:0;
  right:-1px;
  background: var(--secondary-bg);
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

 .font-16-400{

  font-size: 16px;
  font-weight: 400;
 }


 :deep(.ant-input){
   color: var(--secondary-text) !important;
   font-size: 1.15em;
   &::placeholder{
     color: var(--secondary-text) !important;
   }
 }
 :deep(.ant-input-suffix){
   color: var(--secondary-text) !important;
   font-size: 1.5em;
   cursor: pointer;
 }

 .font-14-400{
   font-size: 14px;
   font-weight: 400;
 }

 .font-16-500{
   font-size: 16px;
   font-weight: 500;
 }

 .font-12-400{

   font-size: 12px;
   font-weight: 400;
 }
 </style>
