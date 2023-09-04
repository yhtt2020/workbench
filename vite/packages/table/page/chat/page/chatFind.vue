<template>
  <div class="w-full flex items-center justify-center px-3">
    <template v-if="isLoading !== 0">
      <a-spin />
    </template>

    <template v-else>
      <div class="flex flex-col">

        <span class="font-16 mb-6" style="color:var(--primary-text);">推荐用户</span>
        <div class="mb-6 content-list">
          <!-- grid grid-cols-2 gap-4 -->
          <div v-for="item in refUser" class="flex items-center content-item px-4 justify-between py-5 rounded-xl mb-4" style="width:400px;background: var(--secondary-bg);">
            <div class="flex items-center pointer" @click="openUserCard(item.uid)">
              <a-avatar :src="item.avatar" :size="48"></a-avatar>
              <span class="pl-4 font-16" style="color:var(--primary-text)">{{ item.nickname }}</span>
            </div> 
           
            <AddFindButton v-show="relationship==='not'" @relationshipChanged="updateRelationship" :key="item.uid"
            :uid="item.uid"></AddFindButton>
            <SendMessageButton :uid="item.uid" :enable="true" @send="enterChatList"  v-show="relationship==='yes'"></SendMessageButton>
          </div>
        </div>
        
        <span class="font-16 mb-6" style="color:var(--primary-text);">推荐群聊</span>
        <div class="content-list">
          <!-- grid grid-cols-2 gap-4 -->
          <div v-for="item in groupList" class="flex items-center justify-between px-4 py-5 rounded-xl" style="background: var(--secondary-bg);">
            <div class="flex items-center">
              <a-avatar :src="item.avatar" shape="square" :size="48"></a-avatar>
              <div class="flex flex-col justify-center">
                <span class="pl-4 font-16" style="color:var(--primary-text)">{{ item.name }}</span>
                <span class="pl-4 font-16" style="color:var(--primary-text)">{{ total }}人</span>
              </div>
            </div>

            <XtButton v-if="isGroup" style="width: 96px;background: var(--active-secondary-bg);" @click="enterGroup(item)">
              <icon icon="message"></icon>
              进入群聊
            </XtButton>
            <XtButton v-else style="width: 96px;background: var(--active-bg);" @click="addGroup(item.groupID)">
              加入
            </XtButton>
          </div>
        </div>

      </div>
    </template>
  </div>

  <teleport to='body'>
    <Modal v-model:visible="cardVisible" v-if="cardVisible" :blurFlag="true">
      <!--   -->
      <UserCard :key="userCardUid" :uid="userCardUid" :userInfo="userCardUserInfo"></UserCard>
    </Modal>
  </teleport>
</template>

<script>
import { defineComponent,onMounted,reactive,ref,toRefs,computed } from 'vue'
import { serverCache } from '../../../js/axios/serverCache'
import { appStore } from '../../../store'
import AddFindButton from '../../../components/sns/AddFindButton.vue'
import SendMessageButton from '../../../components/sns/SendMessageButton.vue'
import Modal from '../../../components/Modal.vue'
import UserCard from '../../../components/small/UserCard.vue'

export default defineComponent({
  components:{
    AddFindButton,
    SendMessageButton,
    Modal,UserCard
  },

  setup (props,ctx) {
    const isLoading = ref(0) // 根据这个来判断第一次加载数据返回undefined

    const  findStore = appStore()

    const data = reactive({
      // 初始化默认推荐用户
      users:[
        { uid:'4'}, {uid:'36'}, {uid:'10'},{ uid:'23'}
      ],
      group:[
        {groupID:'suggest'},// {groupID:'noob'},{groupID:'bug'},{groupID:'fans'},
       // {groupID:'update'},{groupID:'develop_group'},
       // {groupID:'trade'},{groupID:'developer'},{groupID:'3dprint'},{groupID:'screen_diy'},
       // {groupID:'player'},{groupID:'3dgitial'},
      ],

      refUser:[], // 接收推荐用户数据
      groupList:[],  // 接收推荐群数据

      relationship: 'unload',
      memberList:[],  // 接收群成员数据
      cardVisible:false,

      // 获取卡片数据
      userCardUid:'',
      userCardUserInfo:findStore.$state.userCardUserInfo,
    })
 
   

    // 获取发现推荐用户数据
    const setReferredUsers = async () =>{
      const refList = { refUser:[], group:[] }
      // 遍历获取推荐用户
      for(let i=0;i<data.users.length;i++){
        const uid = data.users[i].uid
        const userRes = await findStore.getUserCard(uid)
        const referItem = {
         uid:userRes.data.user.uid,
         nickname:userRes.data.user.nickname,
         avatar:userRes.data.user.avatar,
        }
        refList.refUser.push(referItem)
      }

      // 遍历获取推荐群聊
      for(let i=0;i<data.group.length;i++){
       const option = {
        groupID:data.group[i].groupID
       }
       const result  = await window.$chat.getGroupProfile(option)
       const group = result.data.group
       refList.group.push(group)
      }
      serverCache.set('findData',refList,30)
    }

    // 获取存储在服务器端的数据
    const getReferData = async() =>{
      try {
       // const result = await serverCache.getData('findData')
       const result = await serverCache.getDataWithLocalCache('findData',{localCache:true,ttl:30})
       
       // console.log('获取存储在服务器端的数据',result);
       if(result !== undefined){
        data.refUser = result.refUser
        data.groupList = result.group
        isLoading.value = 0
       }else{
        console.error('获取数据失败，返回undefined',result);
        isLoading.value = 1
       }
      } catch (error) {
       console.error('获取数据失败',error);
      }
    }

    // 获取群成员数据
    const getMemeber = async () =>{
      for(let i=0;i<data.group.length;i++){
       const option = {
        groupID:data.group[i].groupID,
        count:100,
        offset:0,
       }
       const res = await window.$chat.getGroupMemberList(option)
       data.memberList = res.data.memberList
      }
    }

    // 通过计算属性判断是否加入群聊
    const isGroup = computed( () =>{
      const uid = findStore.$state.userInfo.uid
      return data.memberList.some(member => parseInt(member.userID) === uid);
    })

    // 加入推荐群聊
    const addGroup = async (id) =>{  
     const option = {
      groupID:id,
     }
     await window.$chat.joinGroup(option)
    }

    // 进入群聊
    const enterGroup = async (item) =>{  
     // router.push({name:'chatMain'})
     ctx.emit('updateChat')
     const conversationID = `GROUP${item.groupID}`
     // 通知 TUIConversation 添加当前会话
     // Notify TUIConversation to toggle the current conversation
     window.$TUIKit.TUIServer.TUIConversation.getConversationProfile(conversationID).then((imResponse) => {
      window.$TUIKit.TUIServer.TUIConversation.handleCurrentConversation(imResponse.data.conversation);
     })
    }

    // 更新关系
    const updateRelationship = (e) =>{
      data.relationship = e.relationship
    }

    // 发送消息加入详情
    const enterChatList = (uid) =>{
      ctx.emit('updateChat')
      const name = `C2C${uid}`
      window.$TUIKit.TUIServer.TUIConversation.getConversationProfile(name).then((imResponse) => {
       window.$TUIKit.TUIServer.TUIConversation.handleCurrentConversation(imResponse.data.conversation);
      })
    }

    // 点击头像和昵称打开用户卡片
    const openUserCard = async(uid) =>{
      data.cardVisible = true
      data.userCardUid = uid
    }

    onMounted(()=>{
      setReferredUsers()
      getReferData()
      getMemeber()
    })

    return {
      isLoading,isGroup,
      ...toRefs(data),getReferData,
      setReferredUsers,getMemeber,
      enterGroup,addGroup,enterChatList,
      updateRelationship,openUserCard,
    }
  }
})
</script>


<style lang="scss" scoped>
.font-16{
 font-family: PingFangSC-Medium;
 font-size: 16px; 
 font-weight: 500;
}

.button-active{
  &:active{
    filter: brightness(0.8);
    opacity: 0.8;
  }
  &:hover{
    opacity: 0.8;
  }
}

:deep(.xt-active){
  width:115px !important;
}

@media screen  and (max-width:800px) and (min-width:1000px) {
  .content-list{
    width:100%;
    display: flex !important;
    flex-direction: column !important;
    justify-content: space-between;
  }
}

@media screen and (min-width:1001px){
  .content-list{
    display: grid !important;
    grid-template-columns: 1.1fr 1fr;
    justify-content: space-between;
  }
}


</style>