<template>
  <div class="px-7">
    <div class="h-24 flex rounded-xl p-4 mb-4" style="color: var(--primary-text);background: var(--secondary-bg);">
      <div style="width:64px;height:64px;" class="flex items-center justify-center">
        <img :src="needPayAvatar.url" class="w-full h-full object-cover" alt="">
      </div>
      <div class="flex flex-col justify-center ml-4">
        <span class="avatar-font" style="color: var(--primary-text);user-select: text">{{ needPayAvatar.name }}</span>
        <span class="avatar-font" style="color: var(--primary-text);">道具</span>
        <span class="avatar-font" style="color: var(--primary-text);user-select: text">
              <template v-if="gettingOrder">正在生成订单…</template>
              <template v-else>订单号：{{ order.nanoid }} <icon class="pointer" style="font-size: 18px" @click="copyOrder(order.nanoid)" icon="fuzhi"></icon></template></span>
      </div>
    </div>
    <div v-if="error" style="font-size: 14px;line-height: 24px"><icon icon="tishi-xianxing" style="font-size: 14px"></icon> 拉取支付二维码出错，可能是系统正在维护，请稍后再试。</div>
    <HorzontanlPanelIcon v-if="!error" :navList="payMethod" v-model:selectType="payWeixin"
                         style="background: var(--secondary-bg);!important"></HorzontanlPanelIcon>

    <template v-if="payWeixin.type === 'wechat' && !error">
      <div class="flex my-8 px-1">
        <div class="flex rounded-lg items-center justify-center" style="width:200px;height:200px;">
          <a-avatar shape="square" style="width: 100%;height: 100%" :src="qrCode.wechat" class="  object-cover" alt=""></a-avatar>
        </div>
        <div class="flex flex-col ml-8 justify-center">
          <span v-if="needPayAvatar.price.originPrice" class="mb-2  " style="font-size: 18px">原价： <span class="  line-through">￥{{ needPayAvatar.price.originPrice }}</span></span>
          <span class="mb-2 avatar-price">￥{{ needPayAvatar.price.price }}</span>
          <div class="flex items-center">
            <Icon icon="weixinzhifu" style="font-size: 0.55em;"></Icon>
            <span class="avatar-font  ml-2" style="color: var(--primary-text);">微信扫码支付</span>
          </div>
        </div>
      </div>
    </template>
    <template v-else-if="!error">
      <div class="flex my-8 px-1">
        <div class="flex rounded-lg items-center justify-center" style="width:200px;height:200px;">
          <div v-if="qrCode.alipay " style="background: white;padding: 10px;" class="w-full h-full rounded-sm">
            <iframe
              style="border: none;background: transparent;width: 120px;height: 120px;overflow: hidden;transform: scale(1.3);margin-left: 30px;margin-top: 30px"
              scrolling="no" class=" object-cover" id="alipayCode"></iframe>
          </div>
          <a-avatar v-else shape="square" class="w-full h-full object-cover" alt=""></a-avatar>
        </div>
        <div class="flex flex-col ml-8 justify-center">
          <span v-if="needPayAvatar.price.originPrice" class="mb-2  " style="font-size: 18px">原价： <span class="  line-through">￥{{ needPayAvatar.price.originPrice }}</span></span>
          <span class="mb-2 avatar-price avatar-font">￥{{ needPayAvatar.price.price }}</span>
          <div class="flex items-center">
            <Icon icon="zhifubao" style="font-size: 0.55em;"></Icon>
            <span class="avatar-font ml-2" style="color: var(--primary-text);">支付宝扫码支付</span>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import HorzontanlPanelIcon from '../HorzontanlPanelIcon.vue'
import { message, Modal } from 'ant-design-vue'
import { mapActions } from 'pinia'
import { frameStore } from '../../store/avatarFrame'

export default {
  name: 'CollectionCodeModal',
  props: {
    needPayAvatar: {
      type: Object,
      default: () => {}
    },
    order: {//当前订单信息
      type: Object,
    },
    gettingOrder:{//正在生成订单
      type:Boolean,
      default:true
    }
  },
  components: {
    HorzontanlPanelIcon
  },
  data () {
    return {
      error:false,
      payMethod: [   // 头像框购买的支付方式数据
        { icon: 'weixinzhifu', title: '微信支付', type: 'wechat' },
        { icon: 'zhifubao', title: '支付宝', type: 'alipay' }
      ],
      payWeixin: { icon: 'weixinzhifu', title: '微信支付', type: 'wechat' }, // 默认微信支付
      qrCode: {//二维码
        wechat: '',
        alipay: ''
      },

      pointVisible: false, // 头像框积分兑换
      checkTimer:null,
    }
  },
  watch: {
    'payWeixin': {
      handler (newVal) {
        this.generateQrcode(newVal.type )
      },
      immediate: true,
    },
    'order':{
      handler(newVal){
        this.generateQrcode(this.payWeixin.type )
      }
    }
  },
  mounted () {
 this.startTimer()
  },
  unmounted () {
    this.closeTimer()
  },
  methods: {
    ...mapActions(frameStore, ['getQrcode','checkOrderPaid']),
    startTimer(){
      if(!this.checkTimer){
        this.checkTimer= setInterval(()=>{
          this.checkOrderPaidStatus()
        },1000)
      }
    },
    closeTimer(){
      if(this.checkTimer){
        clearInterval(this.checkTimer)
        this.checkTimer=null
      }
    },
    async checkOrderPaidStatus () {
      if (this.order) {
        let rs = await this.checkOrderPaid(this.order.nanoid)
        if (rs.status) {
          this.closeTimer()
          setTimeout(()=>{
            this.$emit('payOk')
          },500)
          Modal.success({
            centered:true,
            content:'感谢支持，系统已经为您自动发放道具。',
            onOk:()=>{

            }
          })
        } else {
        }
      }
    },
   generateQrcode(payment){
      if(!this.order.nanoid){
        return
      }
      if (payment === 'wechat') {
        this.getWechat()
      } else {
        this.getAlipay()
      }
    },
    getWechat () {
      this.qrCode.wechat = ''
      this.error=false
      this.getQrcode(this.order.nanoid, 'wechat').then((rs) => {
        console.log('微信二维码返回', rs)
        if (rs.status) {
          this.qrCode.wechat = rs.data.qrCode
          return
        }
        this.error=true
        message.error('获取微信订单二维码失败，请稍后再试。')
        return
      })
    },
    copyOrder(text){
      try{
        require('electron').clipboard.writeText(text)
        //Navigator.clipboard.writeText(text)
        message.success('复制订单号成功')
      }catch (e) {

      }
    },
    getAlipay () {
      this.qrCode.alipay = ''
      this.error=false
      this.getQrcode(this.order.nanoid, 'alipay').then((rs) => {
        console.log('微信二维码返回', rs)
        if (rs.status) {
          this.qrCode.alipay = rs.data.qrCode
          this.$nextTick(() => {
            let alipay = document.getElementById('alipayCode')
            if (alipay) {
              let iframedoc = alipay.contentDocument || alipay.contentWindow.document
              iframedoc.body.innerHTML = this.qrCode.alipay
              iframedoc.forms['alipaysubmit'].submit()
            }
          })

          return
        }
        this.error=true
        message.error('获取支付宝订单二维码失败，请稍后再试。')
        return
      })
    },
  }
}
</script>

<style lang="scss" scoped>
.avatar-font {

  font-size: 16px;
  font-weight: 500;
}

.active-button {
  &:active {
    filter: brightness(0.8);
    opacity: 0.8;
  }

  &:hover {
    opacity: 0.8;
  }
}

.avatar-pay {

  font-size: 16px;
  font-weight: 400;
}

.avatar-price {
  font-family: Oswald;
  font-size: 24px;
  color: #FF4D4F;
  font-weight: 400;
}

.success-text {

  font-size: 16px;
  color: var(--secondary-text);
  font-weight: 400;
}

:deep(.nav-item) {
  width: 50% !important;
  border-radius: 7px !important;
}

:deep(.panel-icon) {
  width: 50% !important;

  & > svg {
    font-size: 0.65em !important;
  }

  & > .panel-title {

    font-size: 16px;
    font-weight: 400;
  }
}

:deep(.active-item) {
  background: rgba(80, 139, 254, 0.65);
  color: var(--active-text);
}
</style>
