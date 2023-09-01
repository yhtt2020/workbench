<template>
 <div class="w-full flex items-center justify-center">

   <div class="flex flex-col">
    <span class="font-16 mb-6" style="color:var(--primary-text);">推荐用户</span>
    <div class="flex items-center justify-between grid grid-cols-2 gap-4">
     <div v-for="item in refUser" class="flex px-4 py-5 rounded-xl" style="background: var(--secondary-text);">
      <div class="flex items-center">
       <a-avatar :src="item.avatar" :size="48"></a-avatar>
       <span class="pl-4 font-16" style="color:var(--primary-text)">{{ item.nickname }}</span>
      </div>
      <div>添加好友</div>
     </div>
    </div>
   </div>
 </div>
</template>

<script>
import { defineComponent,onMounted,reactive,toRefs,nextTick } from 'vue'
import { appStore } from '../../../store'
import { serverCache } from '../../../js/axios/serverCache'

export default defineComponent({
 setup () {
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
   refUser:[],
   groupList:[]
  })

  const findStore = appStore()

  const getReferredUsers = async () =>{  // 获取发现用户数据
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
    refList.group = group
   }
   serverCache.set('findData',refList,60)
  }

  onMounted(()=>{
   getReferredUsers()
   nextTick(async ()=>{
    const result = await serverCache.getData('findData')
    data.refUser = result.refUser
    data.groupList = result.group
   })
  })

  return {
   serverCache,
   ...toRefs(data),getReferredUsers,
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
</style>