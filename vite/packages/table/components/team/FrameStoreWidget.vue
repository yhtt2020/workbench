<template>
  <div class="pl-4  pt-4 h-full flex flex-col " style="height: 100%" >
    <HorizontalPanel :navList="avatarList" v-model:selectType="listItem" class="mb-5"></HorizontalPanel>
    <template v-if="listItem.name === 'shop_store'">
      <vue-custom-scrollbar @touchstart.stop @touchmove.stop @touchend.stop :settings="settingsScroller"
                            style="flex:1;height:0">
        <div v-for="item in frameList" class="w-full mb-3 rounded-lg flex flex-col "
             :style="avatarBgColor(item.frame.rarity)">
          <div class="avatar-top flex " style="position: relative">
            <div style="width: 100px;height: 100px;">

              <RayMedal v-if="item.frame.rarity>=4" medalStyle="transform:scale(250%) !important"  :size="120"  style="transform: translateX(-10%) translateY(-5%) " :src="item.cover">

              </RayMedal>
              <img v-else :src="item.cover" class="w-full h-full object-fill" alt="">
              <div style="margin-top: -8px" v-if="getFramePrice(item)?.originPrice" class="xt-text-2 text-center ">
                <a-badge :numberStyle="{backgroundColor: '#52c41a',borderColor:'transparent'}" :count="getFramePrice(item)?.discountReason"></a-badge>
              </div>
            </div>
            <div class="flex flex-col justify-center ml-4">
              <div class="mt-2">
                    <span class="avatar-font" :style="titleTagColor(item.frame.rarity)">
                {{ item.alias }}
              </span>
                <span class="w-11 h-6 rank-font rounded my-2.5" :style="avatarTagColor(item.frame.rarity)">
                {{ textTag(item.frame.rarity) }}
              </span>
              </div >

              <div class="xt-text-2 mt-1">
                {{item.summary}}
              </div>

              <span class="get-way-font mt-1">
                获得途径：{{ avatarGainMethodText(item.frame.gainMethod) }}
              </span>
              <div class="mt-2" v-if="item.prices.length">
                <a-avatar-group>
                  <span class="mr-4 xt-text-2" > 已售 {{item.ownersCount[1]}} 件</span>   <a-avatar class="pointer" @click="showUserCard(owner.uid,owner.userInfo)" v-for="owner in item.ownersCount[0]"  :src="owner.userInfo.avatar"></a-avatar>
                </a-avatar-group>
              </div>
            </div>
            <div title="试穿" @click="tryFrame(item.cover)"  class=" xt-bg px-3 py-1 rounded-full pointer" style="position: absolute;right: 10px;top: 10px" >
              <icon icon="yifu" style="font-size: 18px"></icon> 试穿
            </div>
          </div>
          <div class="avatar-bottom flex  " v-if="item.prices.length !== 0">
            <a-button v-if="!item.owned" type="primary" class="mr-3 rounded-xl avatar-font flex items-center justify-center m-3"
                      @click="buyNow(item)" style="color: var(--active-text);height: 44px;"
                      :style="getFrameScore(item)&&false ? {width:'104px'}:{width:'100%'}"
            >
              赞助 ￥ {{ getFramePrice(item).price }}
              <template  v-if="+getFramePrice(item).originPrice"><span class="line-through ml-2">￥{{getFramePrice(item).originPrice}}</span>
                <a-badge :count="getDiscount(getFramePrice(item))" class="ml-2" :number-style="{ backgroundColor: '#52c41a',borderColor:'transparent' }"></a-badge></template>
            </a-button>
            <a-button v-else type="default" class="mr-3 rounded-xl avatar-font flex items-center justify-center  m-3" style="width: 100%">
              已有 <span class=" ml-2">￥ {{ getFramePrice(item).price }}</span> <template  v-if="getFramePrice(item).originPrice"><span class="line-through ml-2">￥{{getFramePrice(item).originPrice}}</span>
            </template>

            </a-button>
            <a-button hidden="" type="primary" class="mr-3  rounded-xl avatar-font flex items-center justify-center"
                      @click="scorePay(item)" v-if="getFrameScore(item)" style="color: var(--active-text);height: 44px;"

            >
              {{ getFrameScore(item) }}积分
            </a-button>
            <a-button hidden="" type="primary" class="rounded-xl" @click="teamGift(item)"
                      style="height: 44px;color: var(--active-text);"
                      :style="getFrameScore(item)&&false ? {width:'104px'}:{width:'50%'}"
            >
              赠送
            </a-button>
            <!-- 预览按钮 -->

          </div>

        </div>
      </vue-custom-scrollbar>
    </template>
    <template v-else>
      <MyFrames></MyFrames>
    </template>
  </div>

  <!-- 收款码付费弹窗组件 -->
  <a-modal centered v-model:visible="payVisible" :footer="null" :width="480" :closable="false" @cancel="closeCheckTimer"
           :header="null" :bodyStyle="{borderRadius:'12px',padding:'12px',}"
  >
    <div class="w-full flex items-center mb-6" v-if="isPay === false">
      <div class="avatar-font h-12 flex items-center justify-center" style="width: 90%;color: var(--primary-text);">
        收银台
      </div>
      <div class="w-12 flex items-center justify-center h-12 rounded-lg active-button pointer"
           @click="payVisible = false;closeCheckTimer()" style="color: var(--secondary-text);background: var(--secondary-bg);">
        <Icon icon="guanbi" style="font-size: 0.5715em;"></Icon>
      </div>
    </div>
    <PaymentMoney @payOk="getFrameGoods();payVisible=false" :gettingOrder="gettingOrder" :order="order" ref="paymentPanel"
                         :needPayAvatar="needPayAvatar"></PaymentMoney>
    <!-- 未购买情况下走扫码支付的流程 -->
  </a-modal>

  <!-- 积分付费弹窗组件 -->
  <a-modal centered v-model:visible="pointVisible" :footer="null" :width="480" :closable="false"
           :header="null" :bodyStyle="{borderRadius:'12px',padding:'12px',}"
  >
    <div class="flex mb-6">
      <div class="avatar-font h-12 flex items-center justify-center" style="width: 90%;color: var(--primary-text);">
        收银台
      </div>
      <div class="w-12 h-12 flex items-center pointer justify-center rounded-lg active-button"
           style="color: var(--secondary-text);background: var(--secondary-bg);"
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
  <Modal :blur-flag="true" v-if="tryFrameVisible" v-model:visible="tryFrameVisible">
    <div style="width: 200px;height:200px " class="p-8 text-center flex flex-col justify-center">
          <FrameAvatar  :frame-url="tringFrame" :avatar-url="userInfo.avatar" :avatar-size="50" style="transform: scale(2)"></FrameAvatar>
    </div>

  </Modal>
</template>

<script>
import { mapState, mapActions, mapWritableState } from 'pinia'
import HorizontalPanel from '../HorizontalPanel.vue'
import HorzontanlPanelIcon from '../HorzontanlPanelIcon.vue'
import PaymentMoney from '../payModal/PaymentMoney.vue'
import PointPayment from '../payModal/PointPayment.vue'
import GiftModal from '../payModal/GiftModal.vue'
import { rarityColor } from '../../js/common/teamAvatar'
import { appStore } from '../../store'
import { frameStore } from '../../store/avatarFrame'
import { teamStore } from '../../store/team'
import _ from 'lodash-es'
import { message } from 'ant-design-vue'
import MyFrames from './MyFrames.vue'
import { avatarBgColor, avatarGainMethodText, avatarTagColor, textTag, titleTagColor } from '../../js/common/avatar'
import RayMedal from '../small/RayMedal.vue'
import FrameAvatar from '../avatar/FrameAvatar.vue'
import Modal from '../Modal.vue'
export default {
  components: {
    FrameAvatar,
    RayMedal,
    MyFrames,
    HorizontalPanel,
    HorzontanlPanelIcon,
    PaymentMoney,
    PointPayment,
    GiftModal,
    Modal
  },
  props: [],
  data () {
    return {
      avatarList: [    // 头像框是否购买的状态
        { title: '头像框商店', name: 'shop_store' },
        { title: '拥有', name: 'have_bought' }
      ],
      listItem: { title: '商店', name: 'shop_store' }, // 默认显示头像框未购买界面
      settingsScroller: {
        useBothWheelAxes: true,
        swipeEasing: true,
        suppressScrollY: false,
        suppressScrollX: true,
        wheelPropagation: true
      },
      pointVisible: false, // 默认关闭头像框积分兑换窗口
      payVisible: false, // 默认关闭头像框购买弹窗
      giftVisible: false, // 默认关闭赠送弹窗
      giftShow: false, // 点击赠送头像框默认方式
      needPayAvatar: {},  // 接收需要付费的头像框数据
      isPay: false, // 判断是否扫码支付完成条件
      teamSearch: '', // 小队头像框搜索
      simpleImage: '/img/state/null.png', // 数据空状态
      teamIndex: '', // 队友选中下标
      payShow: false, // 选中需要赠送的人界面

      order: {},//订单
      gettingOrder: true,
      tryFrameVisible:false,
      tringFrame:''
    }
  },
  computed: {
    ...mapState(appStore, ['userInfo']),
    ...mapState(teamStore, ['membersDevote']),
    ...mapWritableState(frameStore, ['frameData']),
    frameList () {
      const data = this.frameData.list
      // const list = _.filter(data, function (o) { return o.frame.gainMethod !== 'rank' })
      // console.log(list)
      return data
    },
  },
  watch: {
    'listItem': {
      handler () {
        this.listItem = this.listItem
      },
      immediate: true,
    },
  },
  mounted () {
    this.getFrameGoods()
  },
  methods: {
    ...mapActions(frameStore, ['getFrameGoods', 'ensureOrder']),
    ...mapActions(appStore,['showUserCard']),
    tryFrame(frameImage){
      this.tryFrameVisible=true
      this.tringFrame=frameImage
    },
    avatarTagColor, textTag, titleTagColor, avatarBgColor, avatarGainMethodText,
    getFramePrice (item) {  // 根据价格类型获取数据
      const money = _.find(item.prices, function (o) { return o.type === 'money' })
      if (money !== undefined) {
        return money
      }else{
        return {}
      }
    },
    getDiscount(price){
      return '-'+ ((1-price.price/price.originPrice)*100).toFixed(1)+'%'
    },
    getFrameScore (item) {  // 根据积分类型获取数据
      const score = _.find(item.prices, function (o) { return o.type === 'score' })
      if (score !== undefined) {
        return score.price
      }
    },

    scorePay (item) {   // 点击积分兑换回调事件
      this.pointVisible = true
      this.needPayAvatar.url = item.cover
      this.needPayAvatar.name = item.summary
    },

    teamGift (item) {  // 赠送回调事件
      this.$refs.giftRef.openGiftModal()
      this.needPayAvatar.price = this.getFramePrice(item)
    },
    // 赠送使用价格支付方式回调事件
    pricePay () {
      this.giftShow = true
    },

    // 头像框人物搜索回调事件
    avatarSearch (e) {
      console.log('测试', e)
    },
    // 选中队友后回调事件
    giftTeamMember (item) {
      this.teamIndex = item.uid
      this.payShow = true
    },
    closeCheckTimer(){
      this.$refs.paymentPanel.closeTimer()
      console.log('关闭支付状态监测')
    },
    // 点击价格购买逻辑
    buyNow (item) {
      this.needPayAvatar.name = item.summary
      this.needPayAvatar.url = item.cover
      this.needPayAvatar.price = this.getFramePrice(item)
      this.gettingOrder = true
      this.ensureOrder(item.dataNanoid, this.getFramePrice(item).nanoid).then((rs) => {
        this.gettingOrder = false
        if (rs.status) {
          if(rs.data.code===200){
            //证明已经支付了
            message.info('已经支付了订单，无需重复支付。')
            this.getFrameGoods()
            return
          }else if(rs.data.code===400){
            this.payVisible = true // 打开支付弹窗
            this.order = rs.data.order
            this.$refs.paymentPanel.startTimer()
            console.log('开始')
            return
          }
        }

        message.error('生成订单失败，请稍后再试。')
      })
    },
  }
}
</script>

<style lang="scss" scoped>
.avatar-font {
  font-family: Oswald;
  font-size: 16px;
  font-weight: 500;
}

.rank-font {

  font-size: 14px;
  color: var(--active-text);
  font-weight: 500;
  text-align: center;
  margin-left: 10px;
  padding-left: 5px;padding-right: 5px;
}

.get-way-font {

  font-size: 14px;
  color: var(--secondary-text);
  font-weight: 400;
}

:deep(.ps__thumb-y) {
  display: none !important;
}

:deep(.ant-btn span) {
  display: flex !important;
  display: inline-block !important;
  align-items: center !important;
  justify-content: center !important;
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
</style>
