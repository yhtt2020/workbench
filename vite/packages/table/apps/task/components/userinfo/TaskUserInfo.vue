<template>
 <div class="w-full flex flex-col task-userinfo rounded-lg mb-4 px-4 pt-3 pb-2" style="width: 404px;">
  <template v-if="showTaskUser">
   <div class="flex items-center justify-start mb-3">
    <div :style="userInfo.frame !== '' ? {width:'100px',height:'100px',}:{width:'64px',height:'64'}" class="flex items-center justify-center mr-4">
      <FrameAvatar class="frame" :avatarUrl="userInfo.avatar" :avatarSize="userInfo.frame !== '' ? 80 : 64"
       :frameUrl="userInfo.frame" ></FrameAvatar>
    </div>
    <div class="flex  flex-col flex-1 w-0">
     <span class="font-18 xt-font font-600 xt-text">{{ userInfo.nickname }}</span>
     <div class="flex flex-1 w-full  overflow-hidden">
         <Medal :zoom="0.9" class="medal" :medal="medal" v-for="medal in infoMedal?.medals"></Medal>
     </div>
    </div>
   </div>
  </template>
  <div class="flex justify-between items-center">
   <div class="flex flex-col" style="width: 168px;">
    <div class="flex justify-between w-full mb-1">
      <xt-text class="xt-text font-14 xt-font font-400">我的社区等级</xt-text>
      <span class="font-18 xt-font  xt-text" style="font-weight: 900;">Lv{{ userInfo?.grade?.grade }}</span>
    </div>
    <a-progress :percent="myLv.currentLv"  :strokeColor="'var(--primary-text)'"/>
    <!-- 经验升级进度条-->
    <div class="flex justify-between w-full pt-2">
     <xt-text class="xt-text-2 font-12 xt-font font-400">升级所需经验</xt-text>
     <span class="xt-text-2 font-12 xt-font font-400">{{ userInfo?.grade?.diff }}</span>
    </div>
   </div>
   <a-divider type="vertical" style="height: 48px; border-top: 1px solid var(--divider);" />
   <div style="width: 178px;" class="flex flex-col">
    <div class="flex justify-between items-center mb-1">
     <div class="flex  flex-col">
      <xt-text class="xt-text font-14 xt-font font-400">社区积分</xt-text>
      <div style="height: 4px;"></div>
      <span class="xt-text font-18 xt-font " style="font-weight: 900;"> 
        <a-avatar :size="24" shape="circle" src="/img/task/communityPoints.svg"></a-avatar> 
        {{ infoMedal.score  }}
      </span>

     </div>
      <div class="flex-1 w-0 ml-2">
        <xt-button :w="110" :h="40" @click="showProp">
          <img style="width: 20px" src="/img/bottomPanel/prop.png"> 
          我的道具
        </xt-button>
      </div>
    </div>
    <div class="flex justify-between">
      <xt-text class="xt-text-2 font-12 xt-font font-400">
        后续可用于兑换
      </xt-text>
      <xt-button v-if="showPointGood" class="relative" w="120" h="0" @click="goShop">
        <div v-for="item in goodImage" class="absolute rounded-md flex items-center justify-end good-image" style="width: 24px;height: 24px;border: 2px solid var(--primary-text);">
          <img :src="item.image"  class="rounded-md w-full h-full object-cover" alt="">
        </div>
      </xt-button>
    </div>
   </div>
  </div>
 </div>
  <MyProp :showMyProp="myPropVisible" @closeMyProp="closeMyProp"></MyProp>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { appStore } from '../../../../store';
import { computed, onMounted, ref,nextTick,getCurrentInstance} from 'vue';
import { taskStore } from '../../store';
import { getUserInfo } from '../../../../permission/api/login';

import FrameAvatar from '../../../../components/avatar/FrameAvatar.vue';
import OnlineMedal from '../../../../components/team/OnlineMedal.vue';
import Medal from '../../../../components/team/Medal.vue';
import MyProp from '../../../../components/team/MyProp.vue'


const app = appStore();
const { userInfo } = storeToRefs(app);
const task = taskStore();
const { taskUserMedal,pointGoods } = storeToRefs(task);
const myScore = ref("");
const myPropVisible=ref(false);
const { proxy }  = getCurrentInstance();


const props = defineProps({
  showTaskUser:{
   type:Boolean,
   default:false,
  },
  showPointGood:{
    type:Boolean,
    default:false,
  }
})

// 获取我的经验等级
const myLv = computed(()=>{
  const next = userInfo.value?.grade?.next;
  const diff = userInfo.value?.grade?.diff;
  const currentLv =  Math.floor((next - diff) / next * 100) ;
  const lvDiff = next - diff;
  return {
    currentLv:currentLv,
    lvDiff:lvDiff,
  }
});
const infoMedal = computed(()=>{
  return taskUserMedal.value;
});
const goodImage = computed(()=>{
  return pointGoods.value.slice(0,4);
})

/**事件**/
const showProp=()=>{
  myPropVisible.value=true
};
const closeMyProp=()=>{
  myPropVisible.value=false
};
const goShop = () =>{
  proxy.$.appContext.config.globalProperties.$bus.emit('getGood');
}

onMounted(()=>{
  getUserInfo();
  task.getTaskUserMedal(userInfo.value?.uid);
  task.getUserScore();
});
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
:deep(.badge-box){
  & div{
    width: auto !important;
    height: auto !important;
    & img{
      width: 50px !important;
    }
  }
  padding: 0 !important;
}
:deep(.big){
  padding: 18px !important;
}
:deep(.medal){
  & .badge-box{
    width:auto !important;
    height: auto !important;
    & div img{
      width: 60px !important;
      margin-left:12px !important;
    }
  }
}
.good-image{
  top:0;
  &:nth-of-type(1){
    right: 45px;
  }
  &:nth-of-type(2){
    right: 35px;
  }
  &:nth-of-type(3){
    right: 20px;
  }
  &:nth-of-type(4){
    right: 5px;
  }
}
</style>
