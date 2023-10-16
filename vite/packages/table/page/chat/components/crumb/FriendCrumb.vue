<template>
 <div class="mb-4">
  <a-breadcrumb :separator="separator">
   <a-breadcrumb-item v-for="(item, index) in breadcrumb" class="pointer " :key="index" @click="backCrumb(item)">
    <span :style="{color:item.color}" class="category-14-400">{{ item.name }}</span>
   </a-breadcrumb-item>
  </a-breadcrumb>
 </div>

 <vue-custom-scrollbar class="flex flex-col " :settings="settingsScroller" style="height:430px;">
  <div v-for="(item,index) in friendList" :class="{'select-bg':isSelect(index)}" 
   class="flex rounded-lg items-center pointer mb-2 p-3" @click="currentFriend(item)"
  >
   <a-avatar :size="32" shape="circle" :src="item.avatar"></a-avatar>
   <span class="category-16-400 ml-4" style="color:var(--primary-text);">{{ item.nick }}</span> 
  </div>
 </vue-custom-scrollbar>
</template>

<script>
import { defineComponent,onMounted,reactive,ref,toRefs,computed } from 'vue'

export default defineComponent({
 props:['selectList'],

 setup (props,ctx) {
  const server = window.$TUIKit

  const data = reactive({
   breadcrumb: [
    {name:'联系人',path:'/',type:'contact',color:'var(--active-bg)'},
    {name:'我的好友',path:'/myFriend',type:'friend'}
   ],
   separator: '/',
   friendList:[],

   // 滚动条配置 
   settingsScroller: {
    useBothWheelAxes: true,
    swipeEasing: true,
    suppressScrollY: false,
    suppressScrollX: true,
    wheelPropagation: true
   }
  })

  const backCrumb = (item) =>{
   if(item.type === 'contact'){
    ctx.emit('back')
   }
  }

  const isSelect = (index)=>{
   return props.selectList.includes(data.friendList[index])
  }

  const currentFriend = (item) =>{
   ctx.emit('currentClick',item)
  }


  onMounted(async()=>{
   const res  = await server.tim.getFriendList()
   const list = res?.data.map((item)=>{ return item.profile })
   // console.log('获取好友数据',list);
   data.friendList = list
  })

  return {
   ...toRefs(data),backCrumb,isSelect,currentFriend

  }
 }
})
</script>

<style lang="scss" scoped>
:deep(.select-bg){
 border: 1px solid var(--active-bg);
 background: var(--active-secondary-bg) !important;
}

</style>