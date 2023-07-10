<template>
  <div class="pl-4 pb-10 pt-4 h-full">
    <HorizontalPanel :navList="avatarList" v-model:selectType="listItem" class="mb-5"></HorizontalPanel>
    <template v-if="listItem.name === 'shop_store'">
      <vue-custom-scrollbar @touchstart.stop @touchmove.stop @touchend.stop :settings="settingsScroller" style="height: 75%;">
        <div v-for="item in frameList" class="w-full mb-3 rounded-lg flex flex-col p-3" :style="avatarBgColor(item)">
          <div class="avatar-top flex mb-4">
            <div style="width: 100px;height: 100px;">
              <img :src="item.cover" class="w-full h-full object-fill" alt="">
            </div>
            <div class="flex flex-col justify-center ml-4" >
              <span class="avatar-font" :style="titleTagColor(item)">
                {{item.alias}}
              </span>
              <span class="w-11 h-6 rank-font rounded my-2.5" :style="avatarTagColor(item)">
                {{  textTag(item) }}
              </span>
              <span class="get-way-font">
                获得途径：商店购买、日常签到
              </span>
            </div>
          </div>
          <div class="avatar-bottom flex  " v-if="item.prices.length !== 0">
            <a-button type="primary" class="mr-3 rounded-xl avatar-font flex items-center justify-center"
             @click="buyNow(item)" style="color: var(--active-text);height: 44px;"
             :style="getFrameScore(item) ? {width:'104px'}:{width:'50%'}"
            >
              ￥ {{ getFramePrice(item) }}
            </a-button>
            <a-button type="primary" class="mr-3  rounded-xl avatar-font flex items-center justify-center"
             @click="scorePay(item)" v-if="getFrameScore(item)"  style="color: var(--active-text);height: 44px;"

            >
              {{ getFrameScore(item) }}积分
            </a-button>
            <a-button type="primary" class="rounded-xl" @click="teamGift(item)" style="height: 44px;color: var(--active-text);"
             :style="getFrameScore(item) ? {width:'104px'}:{width:'50%'}"
            >
              <Icon icon="gift" style="font-size: 1.35em;"></Icon>
            </a-button>
            <!-- 预览按钮 -->
            <a-button type="primary" class="rounded-xl" style="height: 44px;color: var(--active-text);">
              <Icon icon="eye" style="font-size: 1.35em;"></Icon>
            </a-button>
          </div>

        </div>
      </vue-custom-scrollbar>
    </template>
    <template v-else>
      <vue-custom-scrollbar @touchstart.stop @touchmove.stop @touchend.stop :settings="settingsScroller" style="height: 68%;">
        <div v-for="item in frameList" class="w-full mb-3 rounded-lg flex flex-col p-3" :style="avatarBgColor(item)">
          <div class="avatar-top flex mb-4">
            <div style="width: 100px;height: 100px;">
              <img :src="item.cover" class="w-full h-full object-fill" alt="">
            </div>
            <div class="flex flex-col justify-center ml-4" >
              <span class="avatar-font" :style="titleTagColor(item)">
                {{item.alias}}
              </span>
              <span class="w-11 h-6 rank-font rounded my-2.5" :style="avatarTagColor(item)">
                {{  textTag(item) }}
              </span>
              <span class="get-way-font">
                获得途径：商店购买、日常签到
              </span>
            </div>
          </div>
          <a-button type="primary" class="rounded-xl h-12 w-full" style="margin-right: 0;color: var(--active-text);">
            使用
          </a-button>
        </div>
      </vue-custom-scrollbar>
    </template>
  </div>

  <!-- 收款码付费弹窗组件 -->
  <a-modal v-model:visible="payVisible" :footer="null" :width="480"  :closable="false"
  :header="null" :bodyStyle="{borderRadius:'12px',padding:'12px',}" :height="0"
  >
    <div class="w-full flex items-center mb-6" v-if="isPay === false">
      <div class="avatar-font h-12 flex items-center justify-center" style="width: 90%;color: var(--primary-text);">
        收银台
      </div>
      <div class="w-12 flex items-center justify-center h-12 rounded-lg active-button pointer" @click="payVisible = false" style="color: var(--secondary-text);background: var(--secondary-bg);">
        <Icon icon="guanbi" style="font-size: 0.5715em;"></Icon>
      </div>
    </div>
    <CollectionCodeModal :needPayAvatar="needPayAvatar"></CollectionCodeModal>
    <!-- 未购买情况下走扫码支付的流程 -->
    <template v-if="isPay === false">
      <div class="w-full flex-col flex px-10">
        <div class="h-24 flex rounded-xl p-4 mb-4" style="color: var(--primary-text);background: var(--secondary-bg);">
          <div style="width:64px;height:64px;" class="flex items-center justify-center">
            <img :src="needPayAvatar.url"  class="w-full h-full object-cover" alt="">
          </div>
          <div class="flex flex-col justify-center ml-4">
            <span class="avatar-font" style="color: var(--primary-text);">{{ needPayAvatar.name }}</span>
            <span class="avatar-font" style="color: var(--primary-text);">道具</span>
            <span class="avatar-font" style="color: var(--primary-text);">
              <template v-if="gettingOrder">正在生成订单…</template>
              <template v-else>订单号：{{currentOrder.nanoid}}</template></span>
          </div>
        </div>
        <HorzontanlPanelIcon :navList="payMethod" v-model:selectType="payWeixin" style="background: var(--secondary-bg);!important"></HorzontanlPanelIcon>
        <template v-if="payWeixin.type === 'wechat'">
          <div class="flex my-8 px-1">
            <div class="flex rounded-lg items-center justify-center" style="width:200px;height:200px;">
              <a-avatar shape="square" :src="qrCode.wechat" class="w-full h-full object-cover" alt=""></a-avatar>
            </div>
            <div class="flex flex-col ml-8 justify-center">
              <span class="mb-2 avatar-price">￥{{ needPayAvatar.price }}</span>
              <div class="flex items-center">
                <Icon icon="weixinzhifu" style="font-size: 0.55em;"></Icon>
                <span class="avatar-font  ml-2" style="color: var(--primary-text);">微信扫码支付</span>
              </div>
            </div>
          </div>
        </template>
        <template v-else>
          <div class="flex my-8 px-1">
            <div class="flex rounded-lg items-center justify-center" style="width:200px;height:200px;">
              <div v-if="qrCode.alipay" style="background: white;padding: 10px;" class="w-full h-full rounded-sm">
                <iframe style="border: none;background: transparent;width: 120px;height: 120px;overflow: hidden;transform: scale(1.3);margin-left: 30px;margin-top: 30px" scrolling="no" class=" object-cover" id="alipayCode"></iframe>
              </div>
              <a-avatar v-else shape="square"  class="w-full h-full object-cover" alt=""></a-avatar>
            </div>
            <div class="flex flex-col ml-8 justify-center">
              <span class="mb-2 avatar-price avatar-font">￥{{ needPayAvatar.price }}</span>
              <div class="flex items-center">
                <Icon icon="zhifubao" style="font-size: 0.55em;"></Icon>
                <span class="avatar-font ml-2" style="color: var(--primary-text);">支付宝扫码支付</span>
              </div>
            </div>
          </div>
        </template>
      </div>
    </template>

    <!-- 扫码支付完成以后的弹窗提示 -->
    <template v-else>
      <div class="w-full h-full flex-col flex">
        <div class="flex items-center justify-center mb-6">
          <Icon icon="chenggong" style="font-size: 0.5718em;"></Icon>
          <span class="avatar-font ml-3">购买成功</span>
        </div>
        <div class="success-text flex items-center justify-center mb-12">成功获得「小恶魔头像框」，已自动使用</div>
        <div class="flex items-center justify-center">
          <a-button type="primary" class="rounded-md w-40" style="margin-right: 0;" @click="paymentCompletion">完成</a-button>
        </div>
      </div>
    </template>
  </a-modal>

  <!-- 积分付费弹窗组件 -->
  <a-modal v-model:visible="pointVisible" :footer="null" :width="480"  :closable="false"
           :header="null" :bodyStyle="{borderRadius:'12px',padding:'12px',}" :height="0"
  >
    <div class="flex mb-6">
      <div class="avatar-font h-12 flex items-center justify-center" style="width: 90%;color: var(--primary-text);">收银台</div>
      <div class="w-12 h-12 flex items-center pointer justify-center rounded-lg active-button" style="color: var(--secondary-text);background: var(--secondary-bg);"
           @click="pointVisible = false"
      >
        <Icon icon="guanbi" style="font-size: 0.5715em;"></Icon>
      </div>
    </div>
    <PointPayment :needPayAvatar="needPayAvatar"></PointPayment>
  </a-modal>
  <!--  -->

  <!-- 赠送弹窗组件 -->
  <GiftModal ref="giftRef" :needPayAvatar="needPayAvatar" :memberDevoteDisplay="memberDevoteDisplay"></GiftModal>
</template>

<script>
import {mapState,mapActions, mapWritableState} from "pinia";
import HorizontalPanel from '../HorizontalPanel.vue'
import HorzontanlPanelIcon from '../HorzontanlPanelIcon.vue'
import CollectionCodeModal from "../payModal/CollectionCodeModal.vue";
import PointPayment from '../payModal/PointPayment.vue';
import GiftModal from "../payModal/GiftModal.vue";
import { rarityColor } from '../../js/common/teamAvatar'
import {appStore} from "../../store";
import {frameStore} from '../../store/avatarFrame'
import {teamStore} from "../../store/team";
import _ from 'lodash-es'
import { message } from 'ant-design-vue'


export default {
  components:{
    HorizontalPanel,
    HorzontanlPanelIcon,
    CollectionCodeModal,
    PointPayment,
    GiftModal
  },
  props:['teamLeader','teamMembers','team'],
  data(){
    return{
      avatarList:[    // 头像框是否购买的状态
        {title:'商店(开发中)',name:'shop_store'},
        {title:'已购（开发中）',name:'have_bought'}
      ],
      listItem:{title:'商店',name:'shop_store'}, // 默认显示头像框未购买界面
      settingsScroller: {
        useBothWheelAxes: true,
        swipeEasing: true,
        suppressScrollY: false,
        suppressScrollX: true,
        wheelPropagation: true
      },
      payVisible:false, // 默认关闭头像框购买弹窗
      pointsVisible:false, // 默认关闭头像框积分兑换窗口
      giftVisible:false, // 默认关闭赠送弹窗
      giftShow:false, // 点击赠送头像框默认方式
      needPayAvatar:{},  // 接收需要付费的头像框数据
      payMethod:[   // 头像框购买的支付方式数据
        { icon:'weixinzhifu',title:'微信支付',type:'wechat'},
        { icon:'zhifubao',title:'支付宝',type:'alipay'}
      ],
      payWeixin:{ icon:'weixinzhifu',title:'微信支付',type:'wechat'}, // 默认微信支付
      isPay:false, // 判断是否扫码支付完成条件
      teamSearch:'', // 小队头像框搜索
      simpleImage: '/img/state/null.png', // 数据空状态
      teamIndex:'', // 队友选中下标
      payShow:false, // 选中需要赠送的人界面

      currentOrder:{},//当前订单信息
      qrCode:{//二维码
        wechat:'',
        alipay:''
      },
      gettingOrder:true,//正在确认订单
      pointVisible:false, // 头像框积分兑换

    }
  },
  computed:{
    ...mapState(appStore, ['userInfo']),
    ...mapState(teamStore,['membersDevote']),
    ...mapWritableState(frameStore,['frameData']),
    frameList(){
      const data = this.frameData.list
      const list = _.filter(data,function(o){ return o.frame.gainMethod !== 'rank' })
      return list
    },
    memberDevoteDisplay(){
      let display=JSON.parse(JSON.stringify(this.teamMembers))
      display.unshift(JSON.parse(JSON.stringify(this.teamLeader)))

      display.map(user=>{
        user.devote = this.membersDevote[user.uid]||0
      })


      return display.filter(member=>{
        return Number(member.uid)!== Number(this.userInfo.uid)
      })
    },
  },
  watch:{
    'listItem':{
      handler(){
        this.listItem = this.listItem
      },
      immediate:true,
    },
    'payWeixin':{
      handler(){
        this.payWeixin = this.payWeixin
        if(this.payWeixin==='wechat'){
          this.getWechat()
        }else{
          this.getAlipay()
        }
      },
      immediate:true,
    }
  },
  mounted(){
    this.getFrameGoods()
  },
  methods:{
    ...mapActions(frameStore,['getFrameGoods']),

    avatarBgColor(item){ // 根据不同头像框级别匹配头像框背景色
      const index = _.find(rarityColor,function(o){ return o.id === item.frame.rarity})
      return {
        background: index.bg_color
      }
    },

    avatarTagColor(item){  // 根据不同头像框级别区分头像框字体色
      const index = _.find(rarityColor,function(o){ return o.id === item.frame.rarity})
      return {
        background:index.avatar_color,
      }
    },

    textTag(item){  // 获取头像框级别分类
      const index = _.find(rarityColor,function(o){ return o.id === item.frame.rarity})
      return index.avatar_tag
    },

    titleTagColor(item){  // 获取头像框名称颜色
      const index = _.find(rarityColor,function(o){ return o.id === item.frame.rarity})
      return {
        color:index.avatar_color,
      }
    },

    getFramePrice(item){  // 根据价格类型获取数据
      const money = _.find(item.prices,function(o){ return o.type === 'money' })
      if(money !== undefined){
        return money.price
      }
    },

    getFrameScore(item){  // 根据积分类型获取数据
      const score = _.find(item.prices,function(o){ return o.type === 'score' })
      if(score !== undefined){
       return score.price
      }
    },

    getFramePriceOrigin(item){
     return _.find(item.prices,function(o){ return o.type === 'money' })
    },

    // 点击价格购买逻辑
    buyNow(item){
      this.payVisible = true // 打开支付弹窗
      this.needPayAvatar.name = item.summary
      this.needPayAvatar.url = item.cover
      this.needPayAvatar.price = this.getFramePrice(item)
      this.gettingOrder=true
      this.ensureOrder(item.dataNanoid,this.getFramePriceOrigin(item).nanoid).then((rs)=>{
        this.gettingOrder=false
        if(rs.status){
            this.currentOrder=rs.data


          this.getWechat()

          return
        }

        message.error('生成订单失败，请稍后再试。')
      })
    },
    getWechat(){
      this.qrCode.wechat = ''
      this.getQrcode(this.currentOrder.nanoid, 'wechat').then((rs) => {
        console.log('微信二维码返回', rs)
        if (rs.status) {
          this.qrCode.wechat = rs.data.qrCode
          return
        }
        message.error('获取订单二维码失败，请稍后再试。')
        return
      })
    },
    getAlipay(){
      this.qrCode.alipay = ''
      this.getQrcode(this.currentOrder.nanoid, 'alipay').then((rs) => {
        console.log('微信二维码返回', rs)
        if (rs.status) {
          this.qrCode.alipay = rs.data.qrCode
          this.$nextTick(()=>{
           let  alipay=document.getElementById('alipayCode')
            if(alipay){
              let iframedoc= alipay.contentDocument || alipay.contentWindow.document
              iframedoc.body.innerHTML=this.qrCode.alipay
             iframedoc.forms['alipaysubmit'].submit();
            }
          })

          return
        }
        message.error('获取订单二维码失败，请稍后再试。')
        return
      })
    },


    scorePay(item){   // 点击积分兑换回调事件
      this.pointVisible = true
      this.needPayAvatar.url = item.cover
      this.needPayAvatar.name = item.summary
    },


    teamGift(item){  // 赠送回调事件
      this.$refs.giftRef.openGiftModal()
      this.needPayAvatar.price = this.getFramePrice(item)
    },
    // 赠送使用价格支付方式回调事件
    pricePay(){
      this.giftShow = true
    },

    // 头像框人物搜索回调事件
    avatarSearch(e){
      console.log('测试',e);
    },
    // 选中队友后回调事件
    giftTeamMember(item){
      this.teamIndex = item.uid
      this.payShow = true
    }
  }
}
</script>

<style lang="scss" scoped>
.avatar-font{
  font-family:Oswald;
  font-size: 16px;
  font-weight: 500;
}

.rank-font{
  font-family: PingFangSC-Medium;
  font-size: 14px;
  color: var(--active-text);
  font-weight: 500;
  text-align: center;
}
.get-way-font{
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color:var(--secondary-text);
  font-weight: 400;
}
:deep(.ps__thumb-y){
  display: none !important;
}

:deep(.ant-btn span){
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
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
