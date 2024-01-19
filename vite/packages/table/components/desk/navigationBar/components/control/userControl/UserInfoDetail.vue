<template>
 <div class="flex items-center justify-center w-full px-4">
  <div  class="relative flex items-center  justify-center" @click="goMy">
   <FrameAvatar :avatar-size="100" :frame-url="userinfo.frame" :avatar-url="userinfo.avatar" class="w-full flex justify-center user-container h-full pb-2 object-fill" 
    alt="" :frame="displayUserInfo?.equippedItems?.frameDetail" @close="close"
   >
   </FrameAvatar>
   <a-tooltip v-if="displayUserInfo.certification && displayUserInfo.certification.length>0" :title="displayUserInfo.certification[0].name">
    <a-avatar :src="displayUserInfo.certification[0].attestation_icon"
     style="position: absolute;width: 20px;height:20px;right: -15px;bottom: 0; z-index:999;"
    >
    </a-avatar>
   </a-tooltip>
  </div>
  <div class="flex flex-col ">
   <span class="xt-text font-16 xt-font ml-3">{{ userinfo.nickname }}</span>
   <div class="flex xt-text">
     <OnlineMedal :rank="userinfo.onlineGradeExtra.rank" />
     <Medal  v-for="medal of rankList" :medal="medal"/>
   </div>
  </div>
 </div>
</template>

<script setup>
import { ref,onMounted,computed,getCurrentInstance } from 'vue';
import { storeToRefs } from 'pinia';
import { teamStore } from '../../../../../../store/team';
import { appStore } from '../../../../../../store';
import { useRouter } from 'vue-router';

import FrameAvatar from '../../../../../avatar/FrameAvatar.vue';
import Medal from '../../../../../team/Medal.vue';
import OnlineMedal from '../../../../../team/OnlineMedal.vue';

const props = defineProps({
 userinfo:{
  type:Object,
  default:()=>{}
 }
})

const { proxy } = getCurrentInstance();
const router = useRouter()

const team = teamStore();
const app = appStore();
const { userCardUserInfo } = storeToRefs(app);

const rankList = ref([]);



// 获取勋章
const getUserRank = ()=>{
 team.getUserMedal(props.userinfo.uid).then((res)=>{
  if(res.length !== 0){
   rankList.value = res.slice(0,2);
  } 
 })
}

// 获取用户头像框信息
const getUserCardInfo = () =>{
 app.getUserCard(props.userinfo.uid).then((res)=>{
  if(res.code === 200){
   const result = res.data.equippedItems;
   userCardUserInfo.value = {
    uid: props.userinfo.uid,
    nickname: props.userinfo.nickname,
    avatar: props.userinfo.avatar,
    frame:props.userinfo.frame,
    signature: props.userinfo.signature,
    certification: props.userinfo.all_certification_entity_pc || [],
    equippedItems:result,
   }
  }

 })
}

// 关闭
const close = () =>{
 proxy.$bus.emit('closeControl')
}

// 通过计算属性获取头像框信息
const displayUserInfo = computed(()=>{
 if (userCardUserInfo.value) {
  return { ...userCardUserInfo.value, certification: [] }
 } 
 else if (this.userInfo) {
  return userCardUserInfo.value
 }
 else {
  return {}
 }
})

// 进入我的
const goMy = () =>{
  router.push({ name: 'socialMy' });
  close()
}

onMounted(()=>{
 getUserRank()
 getUserCardInfo()
})

</script>

<style lang="scss" scoped>
:deep(.badge-box){
  padding: 0 !important;
  & div>img{
   margin: 0 !important;
   width: 80px !important;
  }
  & div{
   display: flex ;
   align-items: center;
   justify-content: center;
  }
}

:deep(.medal-wrapper){
 &:first-of-type .badge-box>div>img{
  width: 60px !important;
 }
}

:deep(.frame-position){
  width: 100px !important;
  height: 100px !important;
}

:deep(.avatar-position){
 width:52px !important;
 height: 52px !important;
}

:deep(.user-container){
  & div{
    width: 100px !important;
    height: 0 !important;
  }
}
</style>