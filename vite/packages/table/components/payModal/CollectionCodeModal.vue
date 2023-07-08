<!-- 收款码组件 -->
<template>
  <div class="code-modal">
    <a-modal v-model:visible="payVisible" :footer="null" :width="480"  :closable="false"
    :header="null" :bodyStyle="{borderRadius:'12px',padding:'12px',}" :height="0"
    >
     <div class="w-full flex items-center mb-6" v-if="isPay === false">
       <div class="avatar-font h-12 flex items-center justify-center" 
        style="width: 90%;color: var(--primary-text);">
        收银台
       </div>
       <div class="w-12 flex items-center justify-center h-12 rounded-lg active-button pointer" 
        @click="payVisible = false" style="color: var(--secondary-text);background: var(--secondary-bg);">
        <Icon icon="guanbi" style="font-size: 0.5715em;"></Icon>
       </div>
     </div>
     <!--  未购买情况下走扫码支付的流程 -->
     <template v-if="isPay === false">
      <div class="w-full flex-col flex px-7">
        <div class="h-24 flex rounded-xl p-4 mb-4" style="color: var(--primary-text);background: var(--secondary-bg);">
          <div style="width:64px;height:64px;" class="flex items-center justify-center">
            <img :src="needPayAvatar.url"  class="w-full h-full object-cover" alt="">
          </div>
          <div class="flex flex-col justify-center ml-4">
            <span class="avatar-font" style="color: var(--primary-text);">{{ needPayAvatar.name }}</span>
            <span class="avatar-font" style="color: var(--primary-text);">道具</span>
          </div>
        </div>
        <HorzontanlPanelIcon :navList="payMethod" v-model:selectType="payWeixin" style="background: var(--secondary-bg);!important"></HorzontanlPanelIcon>
        <!-- 微信支付界面 -->
        <template v-if="payWeixin.type === 'wechat'">
          <div class="flex my-8 px-1">
            <div class="flex rounded-lg items-center justify-center" style="width:200px;height:200px;">
              <img src="/img/game.png" class="w-full h-full object-cover" alt="">
            </div>
            <div class="flex flex-col ml-8 justify-center">
              <span class="mb-2 avatar-price">￥{{ needPayAvatar.price }}</span>
              <div class="flex items-center">
                <Icon icon="weixinzhifu" style="font-size: 0.55em;"></Icon>
                <span class="avatar-pay  ml-2" style="color: var(--primary-text);">微信扫码支付</span>
              </div>
            </div>
          </div>
        </template>

        <!-- 支付宝界面 -->
        <template v-else>
          <div class="flex my-8 px-1">
            <div class="flex rounded-lg items-center justify-center" style="width:200px;height:200px;">
              <img src="/img/game.png" class="w-full h-full object-cover" alt="">
            </div>
            <div class="flex flex-col ml-8 justify-center">
              <span class="mb-2 avatar-price ">￥{{ needPayAvatar.price }}</span>
              <div class="flex items-center">
                <Icon icon="zhifubao" style="font-size: 0.55em;"></Icon>
                <span class="avatar-pay ml-2" style="color: var(--primary-text);">支付宝扫码支付</span>
              </div>
            </div>
          </div>
        </template>
      </div>
     </template>

     <!-- 扫码支付完成以后的弹窗提示 -->
     <template v-else>
      <div class="w-full h-full flex-col flex p-6">
        <div class="flex items-center justify-center mb-6">
          <Icon icon="chenggong" style="font-size: 0.5718em;"></Icon>
          <span class="avatar-font ml-3">购买成功</span>
        </div>
        <div class="success-text flex items-center justify-center mb-12">成功获得「小恶魔头像框」，已自动使用</div>
        <div class="flex items-center justify-center">
          <a-button type="primary" class="rounded-md w-40" style="margin-right: 0;" >完成</a-button>
        </div>
      </div>
     </template>
    
   </a-modal>
  </div>
</template>

<script>
import HorzontanlPanelIcon from '../HorzontanlPanelIcon.vue'
export default {
  name:'CollectionCodeModal',
  props:{
    needPayAvatar:{
      type:Object,
      default:()=>{}
    }
  },
  components:{
    HorzontanlPanelIcon
  },
  data(){
    return{
      payVisible:false, // 打开付款弹窗
      isPay:false,  // 判断是否支付流程完成
      payMethod:[   // 头像框购买的支付方式数据
        { icon:'weixinzhifu',title:'微信支付',type:'wechat'},
        { icon:'zhifubao',title:'支付宝',type:'alipay'}
      ],
      payWeixin:{ icon:'weixinzhifu',title:'微信支付',type:'wechat'}, // 默认微信支付
    }
  },
  methods:{
    openPayModal(){
      this.payVisible = true
    },
  },
  watch:{
    'payWeixin':{
      handler(){
        this.payWeixin = this.payWeixin
      },
      immediate:true,
    }
  }
}
</script>

<style lang="scss" scoped>
.avatar-font{
  font-family: PingFangSC-Medium;
  font-size: 16px;
  font-weight: 500;
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

.avatar-pay{
  font-family:PingFangSC-Medium;
  font-size: 16px;
  font-weight: 400;
}

.avatar-price{
  font-family: Oswald;
  font-size: 24px;
  color: #FF4D4F;
  font-weight: 400;
}

.success-text{
  font-family: PingFangSC-Regular;
  font-size: 16px;
  color:var(--secondary-text);
  font-weight: 400;
}

:deep(.nav-item){
  width: 50% !important;
  border-radius: 7px !important;
}
:deep(.panel-icon){
  width: 50% !important;
  &>svg{
    font-size: 0.65em !important;
  }
  &>.panel-title{
    font-family: PingFangSC-Regular;
    font-size: 16px;
    font-weight: 400;
  }
}
:deep(.active-item){
  background: rgba(80,139,254, 0.65);
  color: var(--active-text);
}
</style>