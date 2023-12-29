<template>
 <div style="height: 100vh;" class="xt-modal w-full flex flex-col items-center justify-center">
  <div style="width: 600px; height: 601px;" class="flex items-center  box-border flex-col xt-b justify-center rounded-xl xt-bg-2">
   <div class="flex items-center flex-col justify-center" style="width: 452px;">
    <div class="flex items-center justify-center">
     <a-avatar shape="square" src="/icons/logo128.png" :size="64"></a-avatar>
    </div>

    <div class="mt-6 my-3 xt-font xt-text-2 font-16 font-400">您已被邀请加入</div>

    <div class="xt-font xt-text font-24 font-500">天天工作台官方社群</div>

    <div class="flex items-center  mt-4 justify-center" hidden=""  style="width: 480px;">
     <div class="flex items-center justify-center mr-6">
      <span class="w-2.5 h-2.5 rounded-full success-bg mr-2.5"></span>
      <span>2,874 人在线</span>
     </div>
     <div class="flex items-center justify-center">
      <span class="w-2.5 h-2.5 rounded-full mr-2.5" style="background: rgba(255, 255, 255, 0.6);"></span>
      <span>2,874 人在线</span>
     </div>
    </div>

    <div class="flex flex-col mb-6 justify-start " style="width: 480px;">
     <span class="xt-text mb-4 xt-font font-16 font-400">昵称</span>
     <a-input v-model:value="randomNickname" placeholder="输入昵称或者随机获取一个昵称" class="w-full h-10" style="border-radius: 10px;">
      <template #suffix>
       <xt-button w="20" h="20" @click="roll">
        <ProcessIcon id="touzi" icon="fluent-emoji:game-die" style="font-size: 1.2rem;"/>
       </xt-button>
      </template>
     </a-input>
     <span class="mt-3 mb-6 xt-text-2 xt-font font-14 font-400">这是其他社群成员所看到的你的名称。</span>
     <xt-button w="480" type="theme" @click="acceptInvite">继续</xt-button>
     <div class="flex items-center mt-3 mb-6 w-full">
      <span class="xt-font xt-text-2 font-14 font-400">进行注册即表示您同意</span>
      <xt-button w="84" h="0" class="font-14 font-400 xt-font" style="color:var(--link) !important;">《服务条款》</xt-button>
      <span class="xt-font xt-text-2 font-14 font-400">和</span>
      <xt-button h="0" w="84" class="font-14 font-400 xt-font" style="color:var(--link) !important;">《隐私政策》</xt-button>
     </div>
     <div class="flex items-center">
      <xt-button w="96" h="0" class="font-16 font-500 xt-font" style="color: var(--link) !important;" @click="login">已经有账号？</xt-button>
     </div>
    </div>
   </div>
  </div>
 </div>
</template>

<script>
import {Icon as ProcessIcon} from '@iconify/vue'
import { randomName } from '../../../../js/data/chatList'

export default {
 components:{
  ProcessIcon,
 },

 data(){
  return{
   acceptVisible:false,
   randomNickname:'',
   j: 1,
  }
 },

 methods:{

  // 接受邀请
  acceptInvite(){
   // todo
   this.$router.push({ name:'defaultCommunity' }) // 模拟邀请成功自己直接进入
  },

  // 随机昵称
  roll(animate = true){
   const el = $('#touzi')
   if(animate){
    if(this.timer){
     clearTimeout(this.timer)
    }
    el.addClass('animate-spin')
    this.timer=setTimeout(()=>{
     this.rollName()
     el.removeClass('animate-spin')
    },400)
   }
  },
  rollName(){
   let groups = randomName;
   let j = Math.ceil((Math.random() * groups.length)) - 1
   if (this.j === j){
    this.rollName()
    return
   }
   this.j = j
   this.randomNickname = groups[j]
  },
  // 有账号情况下做的操作
  login(){
   // todo
  }

 }
}
</script>

<style lang="scss" scoped>
.box-border{
 box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.2), 0px 0px 20px 0px rgba(0,0,0,0.1), 0px 0px 40px 0px rgba(0,0,0,0.2);
}
.animate-spin{
 animation: spin .6s linear infinite !important;
}
:deep(.ant-input) {
 color: var(--secondary-text) !important;
 font-size: 14px;
 font-weight: 400;
 &::placeholder {
   color: var(--secondary-text) !important;
 }
}
</style>
