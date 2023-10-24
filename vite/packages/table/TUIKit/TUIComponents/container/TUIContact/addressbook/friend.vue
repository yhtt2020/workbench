<template>
 <div class="flex flex-col h-full w-full">
  <div class="flex items-center justify-between" style="margin-bottom: 14px;">
   <span class="font-16" style="color: var(--primary-text);">好友 ({{ list.length }}个) </span>
  </div>

  <div style="color: var(--primary-text);height:100%;">
    <vue-custom-scrollbar :settings="settingsScroller">
      <div v-for="item in list" class="flex list-hover rounded-lg items-center pointer" style="padding: 14px 15px;" @click="clickGroupList(item)">
       <a-avatar  :size="32" :src="item.profile.avatar"></a-avatar>
       <div class="flex flex-col font-16" style="margin-left: 16px;color:var(--primary-text);">
        {{ item.profile.nick }}
       </div>
      </div>
     </vue-custom-scrollbar>
  </div>


 </div>

 <teleport to='body' >
  <FriendModal v-model:visible="friendShow" v-if="friendShow" :blurFlag="true">
    <UserCard :uid="uid" :userCardUid="userCardUid" :userInfo="info"></UserCard>
  </FriendModal>
 </teleport>
</template>

<script>
import { defineComponent,ref,toRefs,computed,watch, reactive, onMounted } from 'vue'
import UserCard from '../../../../../components/small/UserCard.vue'
import FriendModal from '../../../../../components/Modal.vue'
import { appStore } from '../../../../../store'

export default defineComponent({
  props:['list'],


  components:{
    UserCard,FriendModal,
  },


  setup(){

   const data = reactive({
    settingsScroller: {  // 滚动条配置
      useBothWheelAxes: true,
      swipeEasing: true,
      suppressScrollY: false,
      suppressScrollX: true,
      wheelPropagation: true
    },
    uid:'',
    friendShow:false,
    info:[],
    userCardUid:''
   })

   const store = appStore()
   data.userCardUid = store.$state.userCardUid

   const clickGroupList = (item) =>{  // 点击群聊列表
    data.friendShow = true
    data.uid = item.userID
    data.info = item
   }

   return{
     ...toRefs(data),clickGroupList,
   }
  }

})
</script>

<style lang="scss" scoped>
.font-16{

 font-size: 16px;
 font-weight: 400;
}

.font-14{

 font-size: 14px;
 font-weight: 400;
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

.list-hover{
  &:active{
    filter: brightness(0.8);
    opacity: 0.8;
    background: var(--active-secondary-bg);
  }
  &:hover{
    opacity: 0.8;
    background: var(--active-secondary-bg);
  }
}


@media screen and(max-height:600px) {
  :deep(.ps-container){
    height:85% !important;
  }
}

@media screen and(min-height:601px) and (max-height:700px) {
  :deep(.ps-container){
    height:95% !important;
  }
}

@media screen and(min-height:701px) and (max-height:800px) {
  :deep(.ps-container){
    height:95% !important;
  }
}

@media screen and(min-height:801px) and (max-height:900px) {
  :deep(.ps-container){
    height:95% !important;
  }
}

@media screen and(min-height:901px) {
  :deep(.ps-container){
    height:92% !important;
  }
}

</style>
