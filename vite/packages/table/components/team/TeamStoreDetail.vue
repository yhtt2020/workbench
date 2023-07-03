<template>
  <div class="p-4 h-full">
    <HorizontalPanel :navList="avatarList" v-model:selectType="listItem" class="mb-5"></HorizontalPanel>
    <template v-if="listItem.name === 'shop_store'">
      <vue-custom-scrollbar @touchstart.stop @touchmove.stop @touchend.stop :settings="settingsScroller" style="height: 56vh;">
          <div v-for="item in avatarShop " class="w-full mb-3 rounded-lg flex flex-col p-3" :style="avatarBgColor(item)">
              <div class="avatar-top flex mb-4">
                <div style="width: 100px;height: 100px;">
                  <img :src="item.avatar_url" class="w-full h-full object-fill" alt="">
                </div>
                <div class="flex flex-col justify-center ml-4" >
                  <span class="avatar-font" :style="avatarFontColor(item)">
                    {{item.title}}
                  </span>
                  <span class="w-11 h-6 rank-font rounded-md my-2.5" :style="avatarBgFontColor(item)">
                    {{item.avatar_rank}}
                  </span>
                  <span class="get-way-font">
                    {{ item.get_way }}
                  </span>
                </div>
              </div>
              <div class="avatar-bottom flex" v-if="item.price">
                <a-button type="primary" class="mr-3 avatar-button rounded-md" @click="buyNow(item)" style="width: 104px;">￥{{item.price}}</a-button>
                <a-button type="primary" class="mr-3 avatar-button rounded-md" style="width: 104px;" @click="pointExchange(item)">{{item.score}}</a-button>
                <a-button type="primary" class="avatar-button rounded-md" style="width: 104px;">赠送</a-button>
              </div>
          </div>
      </vue-custom-scrollbar>
    </template>
    <template v-else>
      已购
    </template>
  </div>

  <!-- 点击价格购买头像框弹窗 -->
  <a-modal v-model:visible="payVisible" :width="480" >
    <!-- 未购买情况下走扫码支付的流程 -->
    <template v-if="isPay === false">
       <div class="w-full h-full flex-col flex">
          <div class="mx-3 mt-3 mb-8 h-12 flex ">
            <div class="flex items-center justify-center" style="width: 90%;">
              <span class="avatar-font">收银台</span>
            </div>
            <div class="close-pay w-12 h-12 rounded-lg active-button" @click="payVisible = false">
              <Icon icon="guanbi" style="font-size: 0.65em;"></Icon>
            </div>
          </div>
          <div class="flex flex-col mx-10 mb-10">
            <div class="h-24 flex rounded-lg p-4 mb-4" style="color: var(--primary-text);background: var(--secondary-bg);">
              <div style="width:64px;height:64px;" class="flex items-center justify-center">
                <img :src="needPayAvatar.url"  class="w-full h-full object-cover" alt="">
              </div>
              <div class="flex flex-col justify-center ml-4">
                <span class="avatar-font" style="color: var(--primary-text);">{{ needPayAvatar.name }}</span>
                <span class="avatar-font" style="color: var(--primary-text);">道具</span>
              </div>
            </div>
            <HorzontanlPanelIcon :navList="payMethod" v-model:selectType="payWeixin"></HorzontanlPanelIcon>
            <template v-if="payWeixin.type === 'alipay'">
              <div class="flex mt-4 px-1">
                <div class="flex rounded-lg items-center justify-center" style="width:200px;height:200px;">
                  <img src="/img/game.png" class="w-full h-full object-cover" alt="">
                </div>
                <div class="flex flex-col ml-8 justify-center">
                  <span class="mb-2 avatar-price">￥{{ needPayAvatar.price }}</span>
                  <div class="flex items-center">
                    <Icon icon="zhifubao" style="font-size: 1em;"></Icon>
                    <span class="avatar-font" style="color: var(--primary-text);">支付宝扫码支付</span>
                  </div>
                </div>
              </div>
            </template>
            <template v-else>
              <div class="flex mt-4 px-1">
                <div class="flex rounded-lg items-center justify-center" style="width:200px;height:200px;">
                  <img src="/img/game.png" class="w-full h-full object-cover" alt="">
                </div>
                <div class="flex flex-col ml-8 justify-center">
                  <span class="mb-2 avatar-price">￥{{ needPayAvatar.price }}</span>
                  <div class="flex items-center">
                    <Icon icon="weixinzhifu" style="font-size: 1em;"></Icon>
                    <span class="avatar-font" style="color: var(--primary-text);">支付宝扫码支付</span>
                  </div>
                </div>
              </div>
            </template>
          </div>
       </div>
    </template>

    <!-- 扫码支付完成以后的弹窗提示 -->
    <template v-else>
      <div class="w-full h-full flex-col flex p-8">
        <div class="flex items-center justify-center mb-6">
          <Icon icon="chenggong" style="font-size: 0.5718em;"></Icon>
          <span class="avatar-font ml-3">购买成功</span>
        </div>
        <div class="success-text flex items-center justify-center mb-12">成功获得「小恶魔头像框」，已自动使用</div>
        <div class="flex items-center justify-center">
          <a-button type="primary" class="rounded-md w-40" style="margin-right: 0;" @click="paymentCompletion">完成</a-button>
        </div>
      </div>
      <!-- chenggong -->
    </template>
  </a-modal>

  <!-- 点击积分兑换时触发的弹窗 -->
  <a-modal v-model:visible="pointsVisible" :width="480" >
    <div class="w-full h-full flex-col flex">
      <div class="mx-3 mt-3 mb-8 h-12 flex ">
        <div class="flex items-center justify-center" style="width: 90%;">
          <span class="avatar-font">收银台</span>
        </div>
        <div class="close-pay w-12 h-12 rounded-lg active-button" @click="pointsVisible = false">
          <Icon icon="guanbi" style="font-size: 0.65em;"></Icon>
        </div>
      </div>
      <div class="h-24 flex justify-between items-center rounded-lg p-4 mx-10 mb-4 mt-6" style="color: var(--primary-text);background: var(--secondary-bg);">
        <div class="flex">
          <div style="width:64px;height:64px;" class="flex items-center justify-center">
            <img :src="needPayAvatar.url"  class="w-full h-full object-cover" alt="">
          </div>
          <div class="flex flex-col justify-center ml-4">
            <span class="avatar-font" style="color: var(--primary-text);">{{ needPayAvatar.name }}</span>
            <span class="avatar-font" style="color: var(--primary-text);">道具</span>
          </div>
        </div>
        <div class="avatar-price">
           {{ needPayAvatar.score }}
        </div>
      </div>
      <div class="h-16 flex items-center justify-between mx-10 mb-4 rounded-lg" style="color: var(--primary-text);background: var(--secondary-bg);">
        <div class="px-4 success-text">可用积分</div>
        <div class="px-4 success-text">2000积分</div>
      </div>
      <a-button type="primary" class="rounded-md h-12 mx-10 mb-10" style="margin-right: 0;width: 400px;" @click="immediateExchange">
        立即兑换
      </a-button>
    </div>
  </a-modal>
</template>

<script>
import HorizontalPanel from '../HorizontalPanel.vue'
import HorzontanlPanelIcon from '../HorzontanlPanelIcon.vue'
import { avatarShop,rankColor } from '../../js/data/teamAvatar'
import _ from 'lodash-es'

export default {
  components:{
    HorizontalPanel,
    HorzontanlPanelIcon
  },
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
      avatarShop, // 模拟数据
      payVisible:false, // 默认关闭头像框购买弹窗
      pointsVisible:false, // 默认关闭头像框积分兑换窗口
      needPayAvatar:{},  // 模拟接收需要付费的头像框数据
      payMethod:[   // 头像框购买的支付方式数据
        { icon:'weixinzhifu',title:'微信支付',type:'wechat'},
        { icon:'zhifubao',title:'支付宝',type:'alipay'}
      ],
      payWeixin:{ icon:'weixinzhifu',title:'微信支付',type:'wechat'}, // 默认微信支付
      isPay:false, // 判断是否扫码支付完成条件
    }
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
      },
      immediate:true,
    }
  },
  methods:{
    /**
     * 根据不同头像框级别匹配头像框背景色
     * 最外层容器的底部背景色
     * **/
    avatarBgColor(item){
      const rankIndex = _.findIndex(rankColor,function(o){
        return o.avatar_rank === item.avatar_rank
      })
      return {
        background:rankColor[rankIndex].bg_color
      }
    },

    /**
     * 根据不同头像框级别匹配头像框名称颜色
     * 例如：小狐狸头像框、小青蛙头像框、小恶魔头像框
     * **/
    avatarFontColor(item){
      const rankIndex = _.findIndex(rankColor,function(o){
        return o.avatar_rank === item.avatar_rank
      })
      return {
        color:rankColor[rankIndex].color
      }
    },

    /**
     * 根据不同头像框级别的背景色
     * 例如:史诗、优秀、精良等等这情况的的背景色
     * **/
    avatarBgFontColor(item){
      const rankIndex = _.findIndex(rankColor,function(o){
        return o.avatar_rank === item.avatar_rank
      })
      return {
        background:rankColor[rankIndex].color,
      }
    },

    // 点击价格购买逻辑
    buyNow(item){
      this.payVisible = true // 打开支付弹窗
      this.needPayAvatar.name = item.title
      this.needPayAvatar.url = item.avatar_url
      this.needPayAvatar.price = item.price
    },
    // 点击积分兑换回调事件
    pointExchange(item){
      this.pointsVisible = true
      this.needPayAvatar.name = item.title
      this.needPayAvatar.url = item.avatar_url
      this.needPayAvatar.price = item.price
      this.needPayAvatar.score = item.score
    },
    // 扫码支付完成后回调事件
    paymentCompletion(){
      this.payVisible = false
    },

    // 立即兑换的操作逻辑
    immediateExchange(){

    },

  }
}
</script>

<style lang="scss" scoped>
.avatar-font{
  font-family: PingFangSC-Medium;
  font-size: 16px;
  font-weight: 500;
}
.avatar-price{
  font-family: Oswald-Regular;
  font-size: 24px;
  color: #FF4D4F;
  font-weight: 400;
}
.rank-font{
  font-family: PingFangSC-Medium;
  font-size: 14px;
  font-weight: 500;
  color: var(--active-text);
  text-align: center;
}
.get-way-font{
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color:var(--secondary-text);
  font-weight: 400;
}
.avatar-button{
  color: var(--active-text);
}
.close-pay{
  color: var(--primary-text);
  background: var(--primary-bg);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.success-text{
  font-family: PingFangSC-Regular;
  font-size: 16px;
  color:var(--secondary-text);
  font-weight: 400;
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

:deep(.ps__thumb-y){
  display: none !important;
}
:deep(.nav-item){
  width: 50% !important;
}
:deep(.panel-icon){
  width: 50% !important;
  &>svg{
    font-size: 0.85em !important;
  }
  &>.panel-title{
    font-family: PingFangSC-Regular;
    font-size: 16px;
    font-weight: 400;
  }
}
:deep(.active-item){
  background: rgba(80, 139, 254, 0.25) !important;
}
</style>

<style>
.ant-modal-footer{
  display: none !important;
}
.ant-modal-header{
  background: var(--primary-bg) !important;
  color: var(--primary-text) !important;
  border: none !important;
  text-align: center !important;
}
.ant-modal-title{
  color: var(--primary-text) !important;
}
.ant-modal{
  padding: 0 !important;
  top:150px !important;
}
.ant-modal-mask{
  background: var(--main-mask-bg) !important;
}
.ant-modal-close{
  display: none !important;
}
.ant-modal-body{
  padding: 0 !important;
}
</style>
