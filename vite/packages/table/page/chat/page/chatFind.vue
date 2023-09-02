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
       <div v-for="item in refUser" class="flex items-center px-4 justify-between py-5 rounded-xl" style="background: var(--secondary-bg);">
        <div class="flex items-center">
         <a-avatar :src="item.avatar" :size="48"></a-avatar>
         <span class="pl-4 font-16" style="color:var(--primary-text)">{{ item.nickname }}</span>
        </div>
        <div class="h-10 rounded-lg pointer flex items-center justify-center button-active" 
         style="color: var(--active-text);background: var(--active-bg);width:96px;"
        >
          加为好友
        </div>
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
          <div class="h-10 ml-10 pointer rounded-lg flex items-center justify-center button-active" 
           style="color: var(--active-text);background: var(--active-bg);width:96px;"
          >
           加入
          </div>
        </div>
      </div>
    </div> 
  </template>

 </div>
</template>

<script>
import { defineComponent,onMounted,reactive,toRefs,nextTick, ref,watch } from 'vue'
import { appStore } from '../../../store'
import { serverCache } from '../../../js/axios/serverCache'


export default defineComponent({
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
   refUser:[],
   groupList:[],
   simpleImage:'/img/state/null.png', // 空状态数据
   total:'200',
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





  onMounted(()=>{
   setReferredUsers()
   nextTick(()=>{
    getReferData()
   })
  })

  return {
   serverCache,isLoading,
   ...toRefs(data),setReferredUsers,
   getReferData,
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
</style>