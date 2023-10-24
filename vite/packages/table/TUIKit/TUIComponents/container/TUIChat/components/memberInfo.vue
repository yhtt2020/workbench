<template>
 <div class="flex flex-col memberinfo-main" >
  <div class="flex" style="margin:25px !important;">
   <FrameAvatar :frame="info.eq?.frameDetail" class="frame" :avatarUrl="info.userinfo?.avatar" :avatarSize="50" :frameUrl="info.eq?.frameDetail?.image"></FrameAvatar>

   <div class="flex flex-col" style="margin-left: 30px;">
    <span class="font-18 pb-1" style="color: var(--primary-text);"> {{ info.userinfo?.nickname }} </span>
    <span class="font-12" style="border-radius: 4px; background: var(--secondary-bg);padding: 0 6px ;color: var(--secondary-text);">{{ info.userinfo?.uid }}</span>
   </div>
  </div>

  <div class="rounded-lg flex flex-col px-4 py-3 mb-4" style="background: var(--secondary-bg);height: 85px;">
    <div class="font-14 mb-4" style="color:var(--primary-text);">
     全球排名: {{ info.grade?.rank }}
    </div>
    <div class="flex items-center">
      <div class="font-14 flex items-center mr-2" style="color: var(--primary-text);">{{info.grade?.level}}级:</div>
      <LevelIcon :level="info.grade?.level" style="margin-bottom: 4px;"></LevelIcon>
    </div>
  </div>

  <div class="font-14 mb-4" style="color: var(--secondary-text);">成就勋章</div>

  <div class="flex rounded-lg px-4  mb-4" style="height:64px;background: var(--secondary-bg);">
   <OnlineMedal v-if="info.grade?.rank" :rank="info.grade?.rank"></OnlineMedal>
   <Medal :medal="medal" v-for="medal in info.medal"></Medal>
  </div>

  <div class="flex" style="color: var(--secondary-text);" v-if="info.add?.flow === 'in'">
    <div class="font-16 active-button mr-3 rounded-lg pointer" style="background: var(--secondary-bg); padding:11px 55px; color: var(--primary-text);" @click="initiateChat">发起聊天</div>
    <div class="font-16 active-button  rounded-lg pointer" style="background: var(--active-bg); padding:11px 55px; color: var(--active-text);">添加好友</div>
  </div>

 </div>
</template>

<script>
import { defineComponent, reactive, toRefs } from 'vue'
import FrameAvatar from '../../../../../components/avatar/FrameAvatar.vue'
import LevelIcon from '../../../../../components/small/LevelIcon.vue'
import Medal from '../../../../../components/team/Medal.vue'
import OnlineMedal from '../../../../../components/team/OnlineMedal.vue'

const memberInfo = defineComponent({
 props:{
  info:{
   type:Object,
   default:() => ({ })
  }
 },

 components:{
  FrameAvatar,LevelIcon,Medal,OnlineMedal
 },

 setup(props,ctx){
   const data = reactive({

   })

   const initiateChat = () =>{  // 发起聊天
    ctx.emit('submit')
   }

   return{
    ...toRefs(data),initiateChat,

   }
 }
})

export default memberInfo

</script>

<style lang="scss" scoped>
.font-18{

 font-size: 18px;
 font-weight: 500;
}

.memberinfo-main{
 padding: 12px 20px !important;
 width: 400px;
 height: 400px;
}

.font-12{
 font-family: Oswald-Regular;
 font-size: 12px;
 font-weight: 400;
}

.font-14{

 font-size: 14px;
 font-weight: 400;
}

.font-16{

 font-size: 16px;
 font-weight: 400;
}

:deep(.big){
 display: none !important;
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
</style>
