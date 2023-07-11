<template>
  <div class="pl-4 pb-10 pt-4 h-full">
    <HorizontalPanel :navList="avatarList" v-model:selectType="listItem" class="mb-5"></HorizontalPanel>
    <template v-if="listItem.name === 'shop_store'">
      <vue-custom-scrollbar @touchstart.stop @touchmove.stop @touchend.stop :settings="settingsScroller"
                            style="height: 75%;">
        <div v-for="item in frameList" class="w-full mb-3 rounded-lg flex flex-col p-3"
             :style="avatarBgColor(item.frame.rarity)">
          <div class="avatar-top flex mb-4">
            <div style="width: 100px;height: 100px;">
              <img :src="item.cover" class="w-full h-full object-fill" alt="">
            </div>
            <div class="flex flex-col justify-center ml-4">
              <span class="avatar-font" :style="titleTagColor(item.frame.rarity)">
                {{ item.alias }}
              </span>
              <span class="w-11 h-6 rank-font rounded my-2.5" :style="avatarTagColor(item.frame.rarity)">
                {{ textTag(item.frame.rarity) }}
              </span>
              <span class="get-way-font">
                获得途径：{{ avatarGainMethodText(item.frame.gainMethod) }}
              </span>
            </div>
            <a-button hidden type="primary" class="rounded-xl" style="height: 44px;color: var(--active-text);">
              试穿
            </a-button>
          </div>
          <div class="avatar-bottom flex  " v-if="item.prices.length !== 0">
            <a-button v-if="!item.owned" type="primary" class="mr-3 rounded-xl avatar-font flex items-center justify-center"
                      @click="buyNow(item)" style="color: var(--active-text);height: 44px;"
                      :style="getFrameScore(item)&&false ? {width:'104px'}:{width:'100%'}"
            >
              ￥ {{ getFramePrice(item) }}
            </a-button>
            <a-button v-else type="default" class="mr-3 rounded-xl avatar-font flex items-center justify-center" style="width: 100%">
              已有
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
  <a-modal v-model:visible="payVisible" :footer="null" :width="480" :closable="false"
           :header="null" :bodyStyle="{borderRadius:'12px',padding:'12px',}" :height="0"
  >
    <div class="w-full flex items-center mb-6" v-if="isPay === false">
      <div class="avatar-font h-12 flex items-center justify-center" style="width: 90%;color: var(--primary-text);">
        收银台
      </div>
      <div class="w-12 flex items-center justify-center h-12 rounded-lg active-button pointer"
           @click="payVisible = false" style="color: var(--secondary-text);background: var(--secondary-bg);">
        <Icon icon="guanbi" style="font-size: 0.5715em;"></Icon>
      </div>
    </div>
    <CollectionCodeModal :gettingOrder="gettingOrder" :order="order"
                         :needPayAvatar="needPayAvatar"></CollectionCodeModal>
    <!-- 未购买情况下走扫码支付的流程 -->
  </a-modal>

  <!-- 积分付费弹窗组件 -->
  <a-modal v-model:visible="pointVisible" :footer="null" :width="480" :closable="false"
           :header="null" :bodyStyle="{borderRadius:'12px',padding:'12px',}" :height="0"
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
</template>

<script>
import { mapState, mapActions, mapWritableState } from 'pinia'
import HorizontalPanel from '../HorizontalPanel.vue'
import HorzontanlPanelIcon from '../HorzontanlPanelIcon.vue'
import CollectionCodeModal from '../payModal/CollectionCodeModal.vue'
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

export default {
  components: {
    MyFrames,
    HorizontalPanel,
    HorzontanlPanelIcon,
    CollectionCodeModal,
    PointPayment,
    GiftModal
  },
  props: ['teamLeader', 'teamMembers', 'team'],
  data () {
    return {
      avatarList: [    // 头像框是否购买的状态
        { title: '商店(开发中)', name: 'shop_store' },
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
    }
  },
  computed: {
    ...mapState(appStore, ['userInfo']),
    ...mapState(teamStore, ['membersDevote']),
    ...mapWritableState(frameStore, ['frameData']),
    frameList () {
      const data = this.frameData.list
      const list = _.filter(data, function (o) { return o.frame.gainMethod !== 'rank' })
      console.log(list)
      return list
    },
    memberDevoteDisplay () {
      let display = JSON.parse(JSON.stringify(this.teamMembers))
      display.unshift(JSON.parse(JSON.stringify(this.teamLeader)))

      display.map(user => {
        user.devote = this.membersDevote[user.uid] || 0
      })

      return display.filter(member => {
        return Number(member.uid) !== Number(this.userInfo.uid)
      })
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
    avatarTagColor, textTag, titleTagColor, avatarBgColor, avatarGainMethodText,
    getFramePrice (item) {  // 根据价格类型获取数据
      const money = _.find(item.prices, function (o) { return o.type === 'money' })
      if (money !== undefined) {
        return money.price
      }
    },

    getFrameScore (item) {  // 根据积分类型获取数据
      const score = _.find(item.prices, function (o) { return o.type === 'score' })
      if (score !== undefined) {
        return score.price
      }
    },

    getFramePriceOrigin (item) {
      return _.find(item.prices, function (o) { return o.type === 'money' })
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
    // 点击价格购买逻辑
    buyNow (item) {
      this.needPayAvatar.name = item.summary
      this.needPayAvatar.url = item.cover
      this.needPayAvatar.price = this.getFramePrice(item)
      this.gettingOrder = true
      this.ensureOrder(item.dataNanoid, this.getFramePriceOrigin(item).nanoid).then((rs) => {
        this.gettingOrder = false
        if (rs.status) {
          if(rs.data.code===200){
            //证明已经支付了
            message.info('已经支付了订单，无需重复支付。')
            return
          }else if(rs.data.code===400){
            this.payVisible = true // 打开支付弹窗
            this.order = rs.data.order
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
  font-family: PingFangSC-Medium;
  font-size: 14px;
  color: var(--active-text);
  font-weight: 500;
  text-align: center;
}

.get-way-font {
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: var(--secondary-text);
  font-weight: 400;
}

:deep(.ps__thumb-y) {
  display: none !important;
}

:deep(.ant-btn span) {
  display: flex !important;
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
