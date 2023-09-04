<template>
 <div class="w-full flex items-center justify-center px-3">
  <template v-if="isLoading !== 0">
    <div class="flex flex-col items-center justify-center w-1/2">
      <a-empty :image="simpleImage" description="数据获取失败"/>
      <div class="flex items-center button-active rounded-lg px-8 py-3 justify-center " 
       style="background: var(--active-bg);color:var(--active-text);" @click="getReferData"
      >
        重试
      </div>
    </div>
    
  </template>

  <template v-else>
    <div class="flex flex-col">
      <span class="font-16 mb-6" style="color:var(--primary-text);">推荐用户</span>
      <div class="flex grid grid-cols-2 gap-4 mb-6">
       <div v-for="item in refUser" class="flex items-center px-4 justify-between py-5 rounded-xl" style="width:400px;background: var(--secondary-bg);">
        <div class="flex items-center">
         <a-avatar :src="item.avatar" :size="48"></a-avatar>
         <span class="pl-4 font-16" style="color:var(--primary-text)">{{ item.nickname }}</span>
        </div>
        <AddFriendButton  :uid="item.uid"  :key="item.uid" @relationshipChanged="updateRelationship"
          :bgColor="{background:'var(--active-secondary-bg)'}"
        >
        </AddFriendButton>
       </div>
      </div>
      <span class="font-16 mb-6" style="color:var(--primary-text);">推荐群聊</span>
      <div class="flex grid grid-cols-2 gap-4">
        <div v-for="item in groupList" class="flex items-center justify-between px-4 py-5 rounded-xl" style="background: var(--secondary-bg);">
          <div class="flex items-center">
            <a-avatar :src="item.avatar" shape="square" :size="48"></a-avatar>
            <div class="flex flex-col justify-center">
              <span class="pl-4 font-16" style="color:var(--primary-text)">{{ item.name }}</span>
              <span class="pl-4 font-16" style="color:var(--primary-text)">{{ total }}人</span>
            </div>
          </div>

          <XtButton v-if="isGroup" style="width: 96px;background: var(--active-secondary-bg);" @click="quitGroup(item.groupID)">已加入</XtButton>
          <XtButton v-else style="width: 96px;background: var(--active-bg);" @click="addGroup(item.groupID)">加入</XtButton>
        </div>
      </div>
    </div> 
  </template>

 </div>
</template>

<script>
import { defineComponent,onMounted,reactive,toRefs,nextTick, ref,watch, computed } from 'vue'
import { appStore } from '../../../store'
import { serverCache } from '../../../js/axios/serverCache'
import AddFriendButton from '../../../components/sns/AddFriendButton.vue'

export default defineComponent({
 components:{
  AddFriendButton
 }, 
 setup () {
  const isLoading = ref(0) // 根据这个来判断第一次加载数据返回undefined

  const data = reactive({
   users:[  // 初始化默认推荐用户 
    { uid:'4'},
    {uid:'36'},
    {uid:'10'},
    { uid:'23'}
   ],
   group:[
    {groupID:'suggest'}
    // {groupID:'noob'},{groupID:'bug'},{groupID:'fans'},
    // {groupID:'update'},{groupID:'develop_group'},
    // {groupID:'trade'},{groupID:'developer'},{groupID:'3dprint'},{groupID:'screen_diy'},
    // {groupID:'player'},{groupID:'3dgitial'},
   ],
   refUser:[], // 接收推荐用户数据
   groupList:[],  // 接收推荐群数据
   simpleImage:'/img/state/null.png', // 空状态数据
   total:'200',
   relationship: 'unload',
   memberList:[],  // 接收群成员数据
  })

  const findStore = appStore()

  const setReferredUsers = async () =>{  // 获取发现用户数据
   const refList = {
    refUser:[],
    group:[]
   }

   for(let i=0;i<data.users.length;i++){
    const uid = data.users[i].uid
    const userRes = await findStore.getUserCard(uid)
    const referItem = {
     uid:userRes.data.user.uid,
     nickname:userRes.data.user.nickname,
     avatar:userRes.data.user.avatar
    }
    refList.refUser.push(referItem)
    
   }

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
  
  const getReferData = async() =>{  // 获取存储在服务器端的数据
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


  const getMemeber = async () =>{  // 获取群成员数据
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
 
  const updateRelationship = (e) =>{
    data.relationship = e.relationship
  }
  
  const isGroup = computed( () =>{
    const uid = findStore.$state.userInfo.uid
    return data.memberList.some(member => parseInt(member.userID) === uid);
  })
  
  const addGroup = async (id) =>{  // 加入推荐群聊
    const option = {
      groupID:id,
    }
    await window.$chat.joinGroup(option)
  }

  const quitGroup = async (id) =>{  // 退出群聊
    await window.$chat.quitGroup(`${id}`)
  }

  onMounted(()=>{
   setReferredUsers()
   getReferData()
   getMemeber()
  })

  return {
   serverCache,isLoading, isGroup,
   ...toRefs(data),setReferredUsers,
   getReferData,updateRelationship,
   getMemeber,quitGroup,addGroup
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
</style>