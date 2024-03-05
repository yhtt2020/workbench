<template>
  <!-- 确认框 -->
  <div class="fixed modal-float xt-modal rounded-lg" style="">
    <div class="h-full w-full flex flex-col">
      <div class="w-full flex items-center" style="height:56px;">
        <Icon class="ml-5" icon="fluent-emoji:light-bulb" width="24" height="24" />
        <div class="font-16 xt-text ml-4">登录后体验更多功能</div>
      </div>
      <div class="pr-6 font-16 xt-text-2 ml-4">完成各类任务还能领取丰厚奖励。</div>
      
      <div class="flex flex-col justify-center ">
        <a-row class="bg-tab" v-for="(item,index) in loginList" :key="index" :style="{'background-image': item.background}">
          <a-col :span="6" class="h-full w-full justify-center items-center" style="display:flex;">
            <Icon :icon="item.icon"  height="40" width="40" />
          </a-col>
          <a-col :span="18" class="flex  ">
            <div class="font-16" style="color:rgba(255, 255, 255, 0.85)">{{item.title}}</div>
            <div class="font-14" style="color:rgba(255, 255, 255, 0.6)">{{ item.content }}</div>
          </a-col>
        </a-row>
      </div>

      <div class="flex justify-end mt-3 mb-1">
        <xt-button   class="button-bottom mr-3" @click="close"   size="large" >稍后再说</xt-button>
        <xt-button   class="button-bottom mr-4" @click="startGuide"   size="large" type="theme">立即登录</xt-button>
      </div>
    </div>
  </div>
</template>

<script>
import { Icon } from '@iconify/vue';
import { mapWritableState } from 'pinia'
import {cardStore} from "../store/card";
import {nanoid} from "nanoid";
import { homeStore } from "../store/home";
import ShowReward from '../apps/task/components/ShowReward.vue'
import {useLogin} from "../permission/user/useLogin"
export default {
  name: 'WebLogin',
  data() {
    return {
      currentWidth: '-',
      currentHeight: '-',
      loginList:[
        {
          title:'元社区',
          content:'开放式社区，与全网小伙伴一同交流你的热爱，欢迎你的加入！',
          icon:'fluent-emoji:bubbles',
          background:'linear-gradient(107deg, #3E619E 0%, #5D367A 100%)',
        },
        {
          title:'小队',
          content:'与全网工作台小伙伴自由组成小队，为你带来一种不一样的陪伴感。',
          icon:'fluent-emoji:grinning-face-with-smiling-eyes',
          background:' linear-gradient(107deg, #3E9E51 0%, #36407A 100%)',
        },
        {
          title:'社群',
          content:'以兴趣、协作、游戏等等各种主题，免费创建属于你的社群。',
          icon:'fluent-emoji:doughnut',
          background:'linear-gradient(107deg, #9E903E 0%, #7A3E36 100%)',
        },
        {
          title:'等级权益',
          content:'提升你的账号在线等级，解锁体验更多高级功能。',
          icon:'fluent-emoji:star',
          background:' linear-gradient(107deg, #9E3E3E 0%, #6C367A 100%)',
        },
      ],

    }
  },
  async mounted(){
  },
  components: {
    Icon,ShowReward
  },

  computed:{
  },
  methods: {
    startGuide() {
      // 登录之后 开始定制桌面
      useLogin(()=>{
        this.$emit('addWebLogin')
      })

    },
    close(){
      this.$emit('closeWebLogin')
    },
  }
}
</script>

<style scoped lang="scss">
  .modal-float{
    width: 380px;
    height: 630px;
    // background:red;
    z-index: 1001;
    top: 59px;
    right: 12px;
    border: 1px solid rgba(255,255,255,0.1);
    box-shadow: 0px 0px 3px 0px rgba(0,0,0,0.03);
    box-shadow: 0px 0px 20px 0px rgba(0,0,0,0.1);
    box-shadow: 0px 0px 40px 0px rgba(0,0,0,0.2);
  }

  .icon-dismiss{
    height: 21px;
    width: 21px;
    border-radius: 50%;
    background-color: var(--secondary-text);
  }

  .icon-show{
    background: #508BFE;
    box-shadow: -2px 2px 5px 0px rgba(0,0,0,0.23);
    border-radius: 0px 10px 0px 10px;
    position: absolute;
    right: 0;
    top: 0;
    font-size: 12px;
    color: rgba(255,255,255,0.85);
    font-weight: 500;
    width: 32px;
    height: 20px;
    text-align: center;
  }
  .bg-tab{
  width: 350px;
  height: 104px;
  border-radius: 12px;
  padding: 16px;
  margin: 16px auto 0;
}

.img-tag{
  width: 56px;
  position: absolute;
  top: 0;
  right: 9px;
}
  .num-bottom{
    position: absolute;
    font-size: 12px;
    color: rgba(255,255,255,0.85);
    text-align: right;
    font-weight: 500;
    right: 6px;
    bottom: 2px;
  }

  .button-bottom{
    width:95px !important;
    height: 40px !important;
  }
</style>
