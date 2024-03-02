<template>
  <!-- 确认框 -->
  <div class="fixed modal-float xt-modal rounded-lg" style="">
    <div class="h-full w-full flex flex-col">
      <div class="w-full flex items-center" style="height:56px;">
        <Icon class="ml-5" icon="fluent-emoji:glowing-star" width="24" height="24" />
        <div class="font-16 xt-text ml-4">登录后领取更多</div>
      </div>
      <div style="margin-left: 60px;" class="pr-6 font-16 xt-text-2">登录后体验更多功能</div>
      <div class="text-center font-16 xt-text-2 mt-3 mb-2">可获得丰厚奖励</div>
      <div class="flex justify-end mt-4 mb-1">
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
    width: 400px;
    height: 294px;
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
