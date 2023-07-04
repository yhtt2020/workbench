<template>
  <div class="px-4 pb-10 pt-4 h-full">
    <HorizontalPanel :navList="avatarList" v-model:selectType="listItem" class="mb-5"></HorizontalPanel>
    <template v-if="listItem.name === 'shop_store'">
      <vue-custom-scrollbar @touchstart.stop @touchmove.stop @touchend.stop :settings="settingsScroller" style="height: 62vh;">
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
              <div class="avatar-bottom flex">
                <a-button type="primary" class="mr-3 rounded-md flex items-center justify-center" @click="buyNow(item)" 
                 style="width: 104px;color: var(--active-text);height: 48px;"
                >
                  ￥ <span class="avatar-font" style="color: var(--active-text);">{{item.price}}</span>
                </a-button>
                <a-button type="primary" class="mr-3  rounded-md avatar-font flex items-center justify-center" @click="scorePay(item)" 
                 style="width: 104px;color: var(--active-text);height: 48px;"
                >
                  {{ item.score }}
                </a-button>
                <a-button type="primary" class="rounded-md" @click="teamGift(item)" style="width: 104px;height: 48px;color: var(--active-text);">
                  赠送
                </a-button>
              </div>
          </div>
      </vue-custom-scrollbar>
    </template>
    <template v-else>
      <vue-custom-scrollbar @touchstart.stop @touchmove.stop @touchend.stop :settings="settingsScroller" style="height: 62vh;">
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
          <a-button type="primary" class="rounded-md h-12 w-full" style="margin-right: 0;color: var(--active-text);">
            使用
          </a-button>
        </div>
      </vue-custom-scrollbar>
    </template>
  </div>

  <!-- 点击价格购买头像框弹窗 -->
  <a-modal v-model:visible="payVisible" :width="480"  :closable="false"
  :centered="true" :footer="null"  :header="null" :bodyStyle="{padding:'0'}"
  >
    <div class="flex p-3 mb-6">
      <div class="avatar-font h-12 flex items-center justify-center" style="width: 90%;color: var(--primary-text);">收银台</div>
      <div class="close-pay w-12 h-12 rounded-lg active-button" @click="payVisible = false">
        <Icon icon="guanbi" style="font-size: 0.65em;"></Icon>
      </div>
    </div>
    <!-- 未购买情况下走扫码支付的流程 -->
    <template v-if="isPay === false">
      <div class="w-full flex-col flex px-10">
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
        <template v-if="payWeixin.type === 'wechat'">
          <div class="flex my-8 px-1">
            <div class="flex rounded-lg items-center justify-center" style="width:200px;height:200px;">
              <img src="/img/game.png" class="w-full h-full object-cover" alt="">
            </div>
            <div class="flex flex-col ml-8 justify-center">
              <span class="mb-2 avatar-price">￥{{ needPayAvatar.price }}</span>
              <div class="flex items-center">
                <Icon icon="weixinzhifu" style="font-size: 1em;"></Icon>
                <span class="avatar-font" style="color: var(--primary-text);">微信扫码支付</span>
              </div>
            </div>
          </div>
        </template> 
        <template v-else>
          <div class="flex my-8 px-1">
            <div class="flex rounded-lg items-center justify-center" style="width:200px;height:200px;">
              <img src="/img/game.png" class="w-full h-full object-cover" alt="">
            </div>
            <div class="flex flex-col ml-8 justify-center">
              <span class="mb-2 avatar-price avatar-font">￥{{ needPayAvatar.price }}</span>
              <div class="flex items-center">
                <Icon icon="zhifubao" style="font-size: 1em;"></Icon>
                <span class="avatar-font" style="color: var(--primary-text);">支付宝扫码支付</span>
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

  <!-- 点击积分兑换时触发的弹窗 -->
  <a-modal  v-model:visible="pointsVisible" :width="480" :closable="false" :footer="null"
   :header="null" :centered="true" :bodyStyle="{ padding:'0' }"
  >
   <div class="flex p-4 mb-6">
    <div class="avatar-font h-12 flex items-center justify-center" style="width: 90%;color: var(--primary-text);">收银台</div>
    <div class="close-pay w-12 h-12 rounded-lg active-button" @click="pointsVisible = false">
     <Icon icon="guanbi" style="font-size: 0.65em;"></Icon>
    </div>
   </div>
   <div class="px-10 pb-10 flex flex-col">
    <div class="h-24 flex justify-between mb-3 items-center rounded-lg p-4" style="color:var(--primary-text);background:var(--secondary-bg);">
      <div class="flex">
        <div style="width:64px;height:64px;" class="flex items-center justify-center">
          <img :src="needPayAvatar.url"  class="w-full h-full object-cover" alt="">
        </div>
        <div class="flex flex-col justify-center ml-4">
          <span class="avatar-font" style="color: var(--primary-text);">{{ needPayAvatar.name }}</span>
          <span class="avatar-font" style="color: var(--primary-text);">道具</span>
        </div>
      </div>
      <div class="avatar-price avatar-font">
        {{ needPayAvatar.score }}
      </div>
    </div>
    <div class="h-16 mb-3 flex items-center justify-between rounded-lg" style="color: var(--primary-text);background: var(--secondary-bg);">
      <div class="px-4 success-text">可用积分</div>
      <div class="px-4 avatar-font" style="color:var(--secondary-text);">2000积分</div>
    </div>
    <a-button type="primary" v-if="isEnough" class="rounded-md" style="margin-right: 0;height: 48px; width: 400px;color: var(--active-text);" @click="immediateExchange">
      立即兑换
    </a-button>
    <a-button v-else class="rounded-md" disabled style="border:none;height: 48px; margin-right: 0;width: 400px;background: var(--secondary-bg);color: var(--secondary-text);" 
     @click="immediateExchange"
    >
      积分不足
    </a-button>
   </div>
  </a-modal>

  <!-- 点击赠送弹窗 -->
  <a-modal v-model:visible="giftVisible" :width="480" :footer="null" :title="null" :centered="true" :closable="false"
   :header="null"  :bodyStyle="{ padding:'0' }"
  >
    <div class="w-full h-full flex-col flex pr-3 pt-4" v-if="giftShow === false">
      <div class="mb-3 h-12 flex ">
        <div class="flex items-center justify-center" style="width: 90%;">
          <span class="avatar-font" style="color: var(--primary-text);">收银台</span>
        </div>
        <div class="close-pay w-12 h-12 rounded-lg active-button" @click="giftVisible = false">
          <Icon icon="guanbi" style="font-size: 0.65em;"></Icon>
        </div>
      </div>
    </div>

     <!-- 赠送的好友界面 -->
    <template v-if="giftShow === false">
      <div class="flex flex-col mx-10 pb-10">
        <span class="avatar-font mb-4" style="color: var(--primary-text);">选择购买方式</span>
        <div class="flex flex-col">
          <div class="w-full px-6 flex pointer active-button justify-between py-5 mb-4 rounded-lg" 
           style="background: var(--secondary-bg);"
           @click="pricePay"
          >
            <span class="avatar-font" style="color: var(--primary-text);">金额</span>
            <div class="flex items-center justify-center">
              <span class="avatar-font mr-4" style="color: var(--primary-text);">￥9.0</span>
              <Icon icon="xiangyou" style="font-size: 0.45em;color: var(--primary-text);"></Icon>
            </div>
          </div>
          <div class="w-full px-6 flex pointer active-button justify-between py-5 mb-4 rounded-lg" 
           style="background: var(--secondary-bg);"
           @click="pricePay"
          >
            <span class="avatar-font" style="color: var(--primary-text);">积分（可用：2000）</span>
            <div class="flex items-center justify-center">
              <span class="avatar-font mr-4" style="color: var(--primary-text);">￥9.0</span>
              <Icon icon="xiangyou" style="font-size: 0.45em;color: var(--primary-text);"></Icon>
            </div>
          </div>
        </div>
      </div>
    </template>
   
    <!-- 赠送支付方式 -->
    <template v-else>
      <div class="w-full h-full flex-col flex pb-10 pt-4 px-3">
        <div class="mb-3 h-12 flex justify-between">
          <div class="close-pay w-12 h-12 rounded-lg active-button" @click="giftShow = false">
            <Icon icon="xiangzuo" style="font-size: 0.65em;"></Icon>
          </div>
          <div class="flex items-center justify-center" >
            <span class="avatar-font" style="color: var(--primary-text);">选择用户</span>
          </div>
          <div class="close-pay w-12 h-12 rounded-lg active-button" @click="giftVisible = false">
            <Icon icon="guanbi" style="font-size: 0.65em;"></Icon>
          </div>
        </div>
        <div class="mx-5 mb-4">
          <a-input class="rounded-lg h-12" v-model:value="teamSearch"  placeholder="输入昵称、UID搜索"
           @change="avatarSearch($event)" :allowClear="true"
          >
          </a-input>
        </div>
        <!-- 当搜索为空时,默认自己小队成员数据 -->
        <template v-if="teamSearch === ''">
          <span class="get-way-font mx-5 mb-3">我的小队成员</span>
          <div class=" flex flex-wrap mx-5 items-start">
            <div v-for="user in memberDevoteDisplay" @click="giftTeamMember(user)"
             class="flex rounded-lg pointer  avatar-bg mr-3.5 mb-3 flex-col items-center justify-center"
             :class="{'avatar-status':teamIndex === user.uid}"
            >
              <UserAvatar :avatar="user.userInfo.avatar" :rare="rarity"></UserAvatar>
              <div class="get-way-font mt-2.5">{{ user.userInfo.nickname }}</div>
            </div>
          </div>
        </template>

        <!-- 当搜索不为空时,则显示搜索的队伍数据 -->
        <template v-else>
          <span class="get-way-font mx-5 mb-4">搜索结果</span>
          <div class=" flex flex-wrap mx-5 items-start">
            <!-- 搜索数据结果为空时 -->
            <div class="flex w-full items-center justify-center" v-if="memberDevoteDisplay.length === 0" >
              <a-empty :image="simpleImage" />
            </div>
            <div v-else v-for="user in memberDevoteDisplay" class="flex rounded-lg pointer  avatar-bg mr-3.5 mb-3 flex-col items-center justify-center"
            >
              <UserAvatar :avatar="user.userInfo.avatar" :rare="rarity"></UserAvatar>
              <div class="get-way-font mt-2.5">{{ user.userInfo.nickname }}</div>
            </div>
          </div>
        </template>

      </div>
    </template>
  </a-modal>
</template>

<script>
import {mapState,mapActions} from "pinia";
import HorizontalPanel from '../HorizontalPanel.vue'
import HorzontanlPanelIcon from '../HorzontanlPanelIcon.vue'
import UserAvatar from '../small/UserAvatar.vue'
import { avatarShop,rankColor } from '../../js/data/teamAvatar'
import {appStore} from "../../store";
import {teamStore} from "../../store/team";
import _ from 'lodash-es'

export default {
  components:{
    HorizontalPanel,
    HorzontanlPanelIcon,
    UserAvatar
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
      rarity:3,
      avatarShop, // 模拟数据
      payVisible:false, // 默认关闭头像框购买弹窗
      pointsVisible:false, // 默认关闭头像框积分兑换窗口
      giftVisible:false, // 默认关闭赠送弹窗
      giftShow:false, // 点击赠送头像框默认方式
      needPayAvatar:{},  // 模拟接收需要付费的头像框数据
      payMethod:[   // 头像框购买的支付方式数据
        { icon:'weixinzhifu',title:'微信支付',type:'wechat'},
        { icon:'zhifubao',title:'支付宝',type:'alipay'}
      ],
      payWeixin:{ icon:'weixinzhifu',title:'微信支付',type:'wechat'}, // 默认微信支付
      isPay:false, // 判断是否扫码支付完成条件
      teamSearch:'', // 小队头像框搜索
      simpleImage: '/img/state/null.png', // 数据空状态
      teamIndex:'' // 队友选中下标
    }
  },
  computed:{
    ...mapState(appStore, ['userInfo']),
    ...mapState(teamStore,['membersDevote']),
    isEnough(){
      return this.needPayAvatar.score < this.needPayAvatar.total ? true : false
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
      },
      immediate:true,
    }
  },
  mounted(){
    this.teamIndex = 4654
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
    scorePay(item){
      console.log('测试',item);
      this.pointsVisible = true
      this.needPayAvatar.url = item.avatar_url
      this.needPayAvatar.name = item.title
      this.needPayAvatar.score = item.score
      this.needPayAvatar.total = item.total
    },
    // 扫码支付完成后回调事件
    paymentCompletion(){
      this.payVisible = false
    },

    // 立即兑换的操作逻辑
    immediateExchange(){},
    // 赠送回调事件
    teamGift(item){
      this.giftVisible = true
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
  color: var(--secondary-text);
  background: var(--secondary-bg);
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

.avatar-bg{
  background: var(--secondary-bg);
  width: 125px;
  height: 125px;
  &:nth-of-type(3){
    margin-right: 0 !important;
  }
}

.avatar-status{
  border: 1px solid var(--active-bg);
  background: var(--active-secondary-bg);
}
</style>
