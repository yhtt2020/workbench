<template>
 <div class="flex justify-center mt-4" style="height:89%;">
   <vue-custom-scrollbar :settings="settingsScroller">
     <template v-if="isLoading">
       <a-spin/>
     </template>
 
     <template v-else>
       <div class="flex flex-col">
 
         <span class="font-16 mb-3" style="color:var(--primary-text);">推荐用户</span>
         <div class="content-list">
           <div v-for="item in recommendData.users" class="flex items-center content-item px-4 justify-between py-5 rounded-xl mb-3"
                style="width:400px;background: var(--secondary-bg);">
             <div class="flex items-center pointer w-full" @click="openUserCard(item.uid)">
               <a-row :gutter="10" class="flex w-full">
                 <a-col flex="50px">
                   <a-avatar :src="item.avatar" :size="48"></a-avatar>
                 </a-col>
                 <a-col flex="auto">
                   <div class=" font-16" style="color:var(--primary-text)">{{ item.nickname }}</div>
                   <div>{{ item.reason }}</div>
                 </a-col>
                 <a-col @click.stop  flex="100px" v-if="item.uid!=userInfo.uid && item.relationship!==undefined">
                   <AddFindButton v-show="item.relationship==='not'" @relationshipChanged="updateRelationship($event,item)" :key="item.uid"
                                  :uid="item.uid"></AddFindButton>
                   <SendMessageButton :uid="item.uid" :enable="false" @send="enterChatList"
                                      v-show="item.relationship==='yes'"></SendMessageButton>
                 </a-col>
               </a-row>
 
             </div>
 
 
           </div>
         </div>
 
         <span class="font-16 mb-3" style="color:var(--primary-text);">推荐群聊</span>
         <div class="content-list">
           <div v-for="item in recommendData.groups " class="flex items-center content-item justify-between px-4 py-5 rounded-xl mb-3"
           style="background: var(--secondary-bg);width: 400px;">
             <div class="flex items-center">
             <a-avatar :src="item.avatar" shape="square" :size="48"></a-avatar>
             <div class="flex flex-col justify-center">
               <span class="pl-4 font-16" style="color:var(--primary-text)">{{ item.name }}</span>
               <span class="pl-4 font-16" style="color:var(--primary-text)">{{ limitTotal }}人</span>
             </div>
             </div>  
             
             <XtButton v-show="item.relationShip ==='yes'" style="width: 96px;background: var(--active-secondary-bg);"
                       @click="enterGroup(item)">
               <icon icon="message"></icon>
               进入群聊
             </XtButton>
             <XtButton v-show="item.relationShip ==='not'" style="width: 96px;background: var(--active-bg);" @click="addGroup(item.groupID)">
               加入
             </XtButton> 
           </div> 
         </div>
       </div>
 
 
     </template>
   </vue-custom-scrollbar>
 </div>

 <teleport to='body'>
   <Modal v-model:visible="cardVisible" v-if="cardVisible" :blurFlag="true">
     <UserCard :key="userCardUid" :uid="userCardUid" :userInfo="userCardUserInfo"></UserCard>
   </Modal>
 </teleport>
</template>

<script>
import { mapWritableState, mapActions } from 'pinia'
import { chatStore } from '../../../../store/chat'
import { appStore } from '../../../../store'
// import { useRouter, useRoute } from 'vue-router'
import AddFindButton from '../../../../components/sns/AddFindButton.vue'
import SendMessageButton from '../../../../components/sns/SendMessageButton.vue'
import Modal from '../../../../components/Modal.vue'
import UserCard from '../../../../components/small/UserCard.vue'
// import * as sns from '../../../js/common/sns'

// const router = useRouter()
export default {
 components: {
   AddFindButton,
   SendMessageButton,
   Modal,
   UserCard
 },

 data () {
   return {
     cardVisible: false,
     userCardUid: '',
     relationship: 'unload',
     settingsScroller: {
       useBothWheelAxes: true,
       swipeEasing: true,
       suppressScrollY: false,
       suppressScrollX: true,
       wheelPropagation: true
     },
     server:window.$TUIKit,
   }
 },

 computed: {
   ...mapWritableState(chatStore, ['groupList', 'refUser', 'settings', 'memberList', 'limitTotal','isLoading','recommendData']),
   ...mapWritableState(appStore, ['userCardUserInfo', 'userInfo']),
   isGroup () {
     const uid = this.userInfo.uid
     return this.memberList.some(member => parseInt(member.userID) === uid)
   }
 },

 async mounted () {
   await this.getReferData()
   // await this.getMember()
 },
 methods: {
   ...mapActions(chatStore, ['getReferData','loadGroupRelationship','updateConversation']),
   openUserCard (uid) {
     this.cardVisible = true
     this.userCardUid = uid
   },

   updateRelationship (e,item) {
     item.relationship = e.relationship
   },



   // 加入推荐群聊
   async addGroup (id) {
     this.$router.push({name:'chatMain'})
     const option = {
       groupID: id,
     }
     await window.$chat.joinGroup(option)
     this.loadGroupRelationship()
   },

   // 进入群聊
   async enterGroup (item) {
     // this.$emit('updateChat',this.$route.meta)
     this.updateConversation(`GROUP${item.groupID}`)
     this.$router.push({name:'chatMain'})
     const conversationID = `GROUP${item.groupID}`
     // 通知 TUIConversation 添加当前会话
     // Notify TUIConversation to toggle the current conversation
     window.$TUIKit.TUIServer.TUIConversation.getConversationProfile(conversationID).then((imResponse) => {
       window.$TUIKit.TUIServer.TUIConversation.handleCurrentConversation(imResponse.data.conversation)
     })
   },

   enterChatList (uid) {
    this.updateConversation(`C2C${uid}`)
    this.$router.push({name:'chatMain'})
    const name = `C2C${uid}`
    window.$TUIKit.TUIServer.TUIConversation.getConversationProfile(name).then((imResponse) => {
      window.$TUIKit.TUIServer.TUIConversation.handleCurrentConversation(imResponse.data.conversation)
    })
   },

 }
}
</script>

<style lang="scss" scoped>
.font-16 {
 font-family: PingFangSC-Medium;
 font-size: 16px;
 font-weight: 500;
}

.button-active {
 &:active {
   filter: brightness(0.8);
   opacity: 0.8;
 }

 &:hover {
   opacity: 0.8;
 }
}

:deep(.xt-active) {
 width: 115px !important;
}

@media screen and (max-width: 800px) and (min-width: 1000px) {
 .content-list {
   width: 100%;
   display: flex !important;
   flex-direction: column !important;
   justify-content: space-between;
 }
}

@media screen and (min-width: 1001px) {
 .content-list {
   width: 100%;
   display: grid !important;
   grid-template-columns: 1.1fr 1fr;
   justify-content: space-between;
 }
}

:deep(.xt-base-btn){
 background: var(--active-secondary-bg);
}
</style>
