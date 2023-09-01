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
import {sUrl} from '../../../consts'
// import axios from 'axios'

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
    {groupID:'noob'},{groupID:'bug'},{groupID:'fans'},
    {groupID:'update'},{groupID:'develop_group'},{groupID:'suggest'},
    {groupID:'trade'},{groupID:'developer'},{groupID:'3dprint'},{groupID:'screen_diy'},
    {groupID:'player'},{groupID:'3dgitial'},
   ],
   refUser:[],
   groupList:[]
  })

  const findStore = appStore()

  const getReferredUsers = async () =>{
   // const refersLists = {
   //  refUser:[],
   //  groupList:[]
   // }

   for(let i=0;i<data.users.length;i++){
    const uid = data.users[i].uid
    findStore.getUserCard(uid).then(res =>{
     const referItem = {
      uid:res.data.user.uid,
      nickname:res.data.user.nickname,
      avatar:res.data.user.avatar
     }
     // refersLists.refUser.push(referItem)
     data.refUser.push(referItem)
    })
    .catch((error)=>{
      console.warn(error)
    })
    .finally(()=>{
      return;
    })
   }

   for(let i=0;i<data.group.length;i++){
    const groupID = data.group[i].groupID
    window.$chat.getGroupProfile({groupID:groupID}).then(res=>{
      // refersLists.groupList.push(res.data.group)
      data.groupList.push(res.data.group)
    }).catch(error=>{
      console.warn(error)
    }).finally(()=>{
     return;
    })
   }
   
   // console.log('获取推荐数据',refersLists);
   // data.content = refersLists

   // serverCache.set('findData',refersLists)

   // const result = await serverCache.get('findData',{},{cache:true,ttl:60*60*12,localCache:true, localTtl:60})
   // console.log('获取推荐数据',result)
   // // const getUrl = sUrl('/app/cache/get')
   // // const params = {
   // //  key:'findData'
   // // }
   // serverCache.get('findData',{},{cache:true,ttl:60*60*12,localCache:true, localTtl:60}).then(res=>{
   //  console.log('获取服务器端数据存储结果',res.data)
   // })




   // axios.get(getUrl, {
       
   //    })
   // serverCache.get('findData',).then(res=>{
   //  console.log()
   // })
   // sendRequest('findData',{},{localCache:true, localTtl:60}).then(res=>{
   // 
   // })
   // const params = { key: }
   


  }

  onMounted(()=>{
    nextTick(()=>{
     getReferredUsers()
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