<template>
  <div class="h-full w-full flex flex-col">
    <div class="flex items-center justify-between" style="margin-bottom: 14px;">
      <span class="font-16" style="color: var(--primary-text);">群聊 ({{ list.length }}个) </span>

      <div class="w-11 h-11 rounded-lg flex pointer items-center active-button justify-center" style="background: var(--active-bg);" @click="clickSearch">
       <Icon icon="tianjia2" style="width: 20px;height: 20px;color: var(--primary-text);"></Icon>
      </div>
    </div>
    <div style="color: var(--primary-text);height:100%;">
      <vue-custom-scrollbar :settings="settingsScroller">
        <div v-for="item in list" class="flex items-center rounded-lg list-hover pointer" style="padding: 14px 15px;" @click="clickGroupList(item)">
         <a-avatar shape="square" :size="32" :src="item.avatar"></a-avatar>
         <div class="flex flex-col" style="margin-left: 16px;">
          <span class="font-16" style="color:var(--primary-text);">{{ item.name }}</span>
           <span>200人群</span>
         </div>
        </div>
      </vue-custom-scrollbar>
    </div>
  </div>

 <a-drawer v-model:visible="groupShow" width="500" placement="right" :footer="null">
    <GroupDetail :group="groupItem" :memeber="memeber" @closeDrawer="groupShow = false"></GroupDetail>
 </a-drawer>

 <teleport to='body'>
    <Modal v-model:visible="groupVisible" v-if="groupVisible" :blurFlag="true">
      <AddFriend @close="groupVisible = false"></AddFriend>
    </Modal>
 </teleport>

</template>

<script>
import { defineComponent,ref,toRefs,computed,watch, reactive, onMounted } from 'vue'
import AddFriend from '../../../components/transfer/addFriend.vue'
import GroupDetail from '../components/group-detail.vue'
import Modal from '../../../../../components/Modal.vue'

export default defineComponent({
  props:['list'],

  components:{
    GroupDetail,
    AddFriend,
    Modal
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
    groupShow:false, // 右侧抽屉
    groupItem:{}, // 接收点击中的群聊列表项
    memeber:[],
    groupVisible:false,
   })

   const clickGroupList = async (item) =>{  // 点击群聊列表
    data.groupShow = true
    const res  = await window.$chat.getGroupProfile({groupID:item.groupID})
    data.groupItem = res.data.group
    const result = await window.$chat.getGroupMemberList({ groupID:item.groupID, count: 15, offset: 0 })
    data.memeber = result.data.memberList
   }

   const clickSearch = () =>{
    data.groupVisible = true
   }

   return{
     ...toRefs(data),clickGroupList,clickSearch,
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
    height:90% !important;
  }
}

@media screen and(min-height:701px) and (max-height:800px) {
  :deep(.ps-container){
    height:90% !important;
  }
}

@media screen and(min-height:801px) and (max-height:900px) {
  :deep(.ps-container){
    height:90% !important;
  }
}

@media screen and(min-height:901px) {
  :deep(.ps-container){
    height:92% !important;
  }
}

</style>
