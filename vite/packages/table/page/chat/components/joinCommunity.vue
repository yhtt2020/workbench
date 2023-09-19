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
      <a-input placeholder="搜索" :spellcheck="false" v-model:value="searchId" class="h-10" style="border-radius: 10px;" @keyup.enter="searchCommunity">
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
        <div v-for="item in list" class="flex flex-col rounded-lg p-4" style="background: var(--secondary-bg);">
          <div class="flex items-center mb-3">
            <a-avatar :size="40" :src="item.icon" shape="square"></a-avatar>
            <span class="font-16-500 pl-3 truncate" style="color:var(--primary-text);">{{ item.name }}</span>
          </div>

          <!-- <span  class="font-14-400  mb-2.5 " style="color:var(--primary-text);">{{ item.summary }}</span> -->

          <div class="flex justify-between">
            <span class="font-12-400" style="color:var(--secondary-text);">{{ item.memberNum }}人</span>
            <span class="font-12-400" style="color:var(--secondary-text);">{{ item.type === 'PublicJoin' ? '公开加入' : '审核加入' }}</span>
          </div>
          <a-divider style="height: 2px; background-color: var(--divider);margin: 16px 0;" />
          <XtButton  style="background:var(--active-bg);color:var(--active-text);height:40px;width:100%;" @click="nowJoin(item)">立即加入</XtButton>
        </div>
      </div>

      <div class="flex grid grid-cols-2 gap-3" style="width:452px;" v-else>
        <div v-for="item in searchResult" class="flex flex-col rounded-lg p-4" style="background: var(--secondary-bg);">
          <div class="flex items-center mb-3">
            <a-avatar :size="40" :src="item.icon" shape="square"></a-avatar>
            <span class="font-16-500 pl-3 truncate" style="color:var(--primary-text);">{{ item.name }}</span>
          </div>

          <!-- <span  class="font-14-400  mb-2.5 " style="color:var(--primary-text);">{{ item.summary }}</span> -->

          <div class="flex justify-between">
            <span class="font-12-400" style="color:var(--secondary-text);">{{ item.memberNum }}人</span>
            <span class="font-12-400" style="color:var(--secondary-text);">{{ item.type === 'PublicJoin' ? '公开加入' : '审核加入' }}</span>
          </div>
          <a-divider style="height: 2px; background-color: var(--divider);margin: 16px 0;" />
          <XtButton  style="background:var(--active-bg);color:var(--active-text);height:40px;width:100%;" @click="nowJoin(item)">立即加入</XtButton>
        </div>
      </div>

    </div>
  </vue-custom-scrollbar>

 </div>
</template>

<script>
import { defineComponent, onMounted, reactive, toRefs } from 'vue'
import { CloseOutlined,SearchOutlined } from '@ant-design/icons-vue'
import { myCommunityStore } from '../store/myCommunity'



export default defineComponent({
 components:{
  CloseOutlined,SearchOutlined
 },
 setup (props,ctx) {

  const myCom = myCommunityStore()
  // console.log('获取搜索数据::>>',myCom.searchCommunity)

  const data = reactive({
    settingsScroller: {
      useBothWheelAxes: true,
      swipeEasing: true,
      suppressScrollY: false,
      suppressScrollX: true,
      wheelPropagation: true
    },
    list:myCom.$state.recommendCommunityList,
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
        // console.log('搜索结果',result.data.list)
        data.searchResult = result.data.list
      })
    }else{
      evt.preventDefault();
    }
  }

  // 加入社群
  const nowJoin = (item) =>{
    console.log('测试::>>',item)
  }

  
  return {
   closeJoinCom,...toRefs(data),searchCommunity,nowJoin
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
 font-family: PingFangSC-Regular;
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
  font-family: PingFangSC-Regular;
  font-size: 14px;
  font-weight: 400;
}

.font-16-500{
  font-family: PingFangSC-Medium;
  font-size: 16px;
  font-weight: 500;
}

.font-12-400{
  font-family: PingFangSC-Regular;
  font-size: 12px;
  font-weight: 400; 
}
</style>