<template>
 <div class="w-full flex flex-col task-userinfo rounded-lg mb-4 px-4 pt-3 pb-2" style="width: 404px;">
  <template v-if="showTaskUser">
   <div class="flex items-center justify-start mb-3">
    <div :style="userInfo.frame !== '' ? {width:'100px',height:'100px',}:{width:'64px',height:'64'}" class="flex items-center justify-center mr-2">
      <FrameAvatar class="frame" :avatarUrl="userInfo.avatar" :avatarSize="userInfo.frame !== '' ? 80 : 64"
       :frameUrl="userInfo.frame" ></FrameAvatar>
    </div>
    <div class="flex items-center flex-col">
     <span class="font-18 xt-font font-600 xt-text">{{ userInfo.nickname }}</span>

    </div>
   </div>
  </template>
  <div class="flex justify-between items-center">
   <div class="flex flex-col" style="width: 168px;">
    <div class="flex justify-between w-full mb-1">
      <xt-text class="xt-text font-14 xt-font font-400">我的经验等级</xt-text>
      <span class="font-18 xt-font  xt-text" style="font-weight: 900;">Lv{{ userInfo?.grade.new_name.substr(0,1) }}</span>
    </div>

    <a-progress :percent="myLv.currentLv"  :strokeColor="'var(--primary-text)'"/>
    
    <!-- 经验升级进度条-->
    <div class="flex justify-between w-full pt-2">
     <xt-text class="xt-text-2 font-12 xt-font font-400">升级所需经验</xt-text>
     <span class="xt-text-2 font-12 xt-font font-400">{{ userInfo?.grade.diff }}</span>
    </div> 
   </div>
   <a-divider type="vertical" style="height: 48px; border-top: 1px solid var(--divider);" />
   <div style="width: 178px;" class="flex flex-col">
    <div class="flex justify-between items-center mb-1">
     <div class="flex  flex-col">
      <xt-text class="xt-text font-14 xt-font font-400">我的积分</xt-text>
      <div style="height: 4px;"></div>
      <span class="xt-text font-18 xt-font " style="font-weight: 900;">{{ myScore }}</span>
     </div>
     <a-avatar :size="48" shape="circle" src="/img/task/communityPoints.svg"></a-avatar>
    </div>
    <xt-text class="xt-text-2 font-12 xt-font font-400">
     后续可用于兑换（暂未上线商城）
    </xt-text>
   </div>
  </div>
 </div>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { appStore } from '../../../../store';
import { computed, onMounted, ref } from 'vue';
import { getTaskScore } from '../../api';

import FrameAvatar from '../../../../components/avatar/FrameAvatar.vue';


const app = appStore();
const { userInfo,lvInfo } = storeToRefs(app);
const myScore = ref("");

const props = defineProps({
  showTaskUser:{
   type:Boolean,
   default:false,
  }
})

// 获取我的经验等级
const myLv = computed(()=>{
  const  currentLv =  Math.floor((userInfo.value?.grade.next - userInfo.value?.grade.diff) / userInfo.value?.grade.next * 100) ;
  const lvDiff = userInfo.value?.grade.next - userInfo.value?.grade.diff;
  // console.log("currentLv lvDiff",lvDiff,currentLv,userInfo.value);
  return {
    currentLv:currentLv,
    lvDiff:lvDiff,
  }
})


onMounted(()=>{
  getTaskScore().then((res)=>{
    // console.log("res",res);
    if(res.status === 1){
      myScore.value = res.data[1].value;
    }
  })
}) 

</script>

<style lang="scss" scoped>
.task-userinfo{
 background-image: linear-gradient(118deg, #FA7B14 0%, #DA6733 100%);
}

:deep(.ant-progress-text){
 display: none !important;
}
:deep(.ant-progress-inner){
 height: 18px !important;
 width: 168px !important;
 background:  rgba(255,255,255,0.49) !important;
 & .ant-progress-bg{
  height: 18px !important;
 }
}
</style>