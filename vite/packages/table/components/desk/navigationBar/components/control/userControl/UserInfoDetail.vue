<template>
 <div class="flex items-center  w-full">
  <div  class="relative flex items-center  justify-center" :class="userinfo.frame == '' ? 'ml-6 mr-0.5':'ml-6 mr-4'" @click="goMy">
    <FrameAvatar :avatarSize="userinfo.frame == '' ?  56 : 80" :avatarUrl="userinfo.avatar" :frameUrl="userinfo.frame" 
    class="w-full flex justify-center h-full pb-2 object-fill" :frame="displayUserInfo?.equippedItems?.frameDetail" @close="close"
   />
   <a-tooltip v-if="displayUserInfo.certification && displayUserInfo.certification.length>0" :title="displayUserInfo.certification[0].name">
     <a-avatar :src="displayUserInfo.certification[0].attestation_icon"
      style="position: absolute;width: 20px;height:20px;right: -15px;bottom: 0; z-index:999;"
     >
     </a-avatar>
   </a-tooltip> 
  </div>
  <div class="flex flex-col " :class="rankList.length === 0 ? 'w-32':''">
   <span class="xt-text font-16 xt-font ml-3">{{ userinfo.nickname }}</span>
   <div class="flex xt-text">
     <OnlineMedal :rank="userinfo.onlineGradeExtra.rank" />
     <Medal :zoom="0.5" style="margin-top: 5px;margin-right: 5px" v-for="medal of rankList" :medal="medal"/>
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

:deep(.avatar-position){
 width:80px !important;
 height:80px !important;
}


:deep(.big){
  display: none !important;
}
</style>
