<template>
  <a-modal v-model:visible="giftVisible" :footer="null" :width="480"  :closable="false"
   :header="null" :bodyStyle="{borderRadius:'12px',padding:'12px',}" :height="0"
  >
   <!-- 赠送方式 -->
    <template v-if="giftShow === false">
      <div class="w-full h-full flex-col flex mb-6" >
        <div class="mb-3 h-12 flex ">
          <div class="flex items-center justify-center" style="width: 90%;">
            <span class="avatar-font" style="color: var(--primary-text);">收银台</span>
          </div>
          <div class="w-12 flex items-center pointer justify-center h-12 rounded-lg active-button"
            @click="giftVisible = false"  style="color: var(--secondary-text);background: var(--secondary-bg);"
          >
            <Icon icon="guanbi" style="font-size: 0.5715em;"></Icon>
          </div>
        </div>
      </div>
      <div class="flex flex-col mx-7">
        <span class="avatar-font mb-4" style="color: var(--primary-text);">选择购买方式</span>
        <div class="flex flex-col">
          <!-- 现金方式 -->
          <div class="w-full px-6 flex pointer items-center active-button justify-between py-5 mb-4 rounded-xl"
           style="background: var(--secondary-bg);"  @click="cashPay"
          >
           <!-- @click="pricePay" -->
           <span class="avatar-font" style="color: var(--secondary-text);">金额</span>
           <div class="flex items-center justify-center">
            <span class="avatar-score mr-4" style="color: var(--primary-text);">￥{{needPayAvatar.price}}</span>
            <Icon icon="xiangyou" style="font-size: 0.4765em;color: var(--primary-text);"></Icon>
           </div>
          </div>
          <!-- 积分方式 -->
          <div class="w-full px-6 flex pointer active-button items-center justify-between py-5 mb-4 rounded-xl"
           style="background: var(--secondary-bg);" @click="pointPay"
          >
            <span class="avatar-font" style="color: var(--secondary-text);">积分（可用：2000）</span>
            <div class="flex items-center justify-center">
              <span class="avatar-score mr-4" style="color: var(--primary-text);">199积分</span>
              <Icon icon="xiangyou" style="font-size: 0.4765em;color: var(--primary-text);"></Icon>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- 用户选择界面 -->
    <template v-else-if="isBilling === false">
      <div class="w-full h-full flex justify-between pb-10" >
        <div class="flex items-center justify-center pointer w-12 h-12 rounded-lg active-button" style="color: var(--secondary-text);background: var(--secondary-bg);" @click="giftShow = false">
          <Icon icon="xiangzuo" style="font-size: 0.5715em;"></Icon>
        </div>
        <div class="flex items-center justify-center" >
          <span class="avatar-font" style="color: var(--primary-text);">选择用户</span>
        </div>
        <div class="flex items-center justify-center pointer w-12 h-12 rounded-lg active-button" style="color: var(--secondary-text);background: var(--secondary-bg);"  @click="giftVisible = false">
          <Icon icon="guanbi" style="font-size: 0.5715em;"></Icon>
        </div>
      </div>
      <!-- 搜索输入框 -->
      <div class="flex flex-col px-7">
        <a-input class="h-12 rounded-xl mb-4" v-model:value="userNickName" placeholder="输入昵称、UID搜索" allow-clear @change="searchGiftUser"/>
      </div>
      <template v-if="isSearch === false">
        <div class="flex flex-col px-7">
          <span class="pl-1 mb-4 secondary-title">我的小队成员</span>
          <div class=" flex flex-wrap items-start">
            <div  v-for="user in memberDevoteDisplay" :class="{'avatar-status':teamIndex === user.uid}"
              class="flex rounded-lg pointer avatar-bg mr-2 mb-3 flex-col items-center justify-center"
              @click="giftTeamMember(user)"
            >
              <UserAvatar :avatar="user.userInfo.avatar" :rare="rarity"></UserAvatar>
              <div class="avatar-nickname mt-2.5">{{ user.userInfo.nickname }}</div>
            </div>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="flex flex-col px-7">
          <span class="pl-1 mb-4 secondary-title">搜索结果</span>
        </div>
      </template>
    </template>

    <!-- 最后的结算界面 -->
    <template v-else>
      <div class="w-full h-full flex justify-between pb-10" >
        <div class="flex items-center justify-center pointer w-12 h-12 rounded-lg active-button" style="color: var(--secondary-text);background: var(--secondary-bg);" @click="isBilling = false">
          <Icon icon="xiangzuo" style="font-size: 0.5715em;"></Icon>
        </div>
        <div class="flex items-center justify-center" >
          <span class="avatar-font" style="color: var(--primary-text);">收银台</span>
        </div>
        <div class="flex items-center justify-center pointer w-12 h-12 rounded-lg active-button" style="color: var(--secondary-text);background: var(--secondary-bg);"  @click="giftVisible = false">
          <Icon icon="guanbi" style="font-size: 0.5715em;"></Icon>
        </div>
      </div>
      <template v-if="billingWay === 0">
        <div class="flex flex-col px-7 mb-4">
          <div class="flex items-center rounded-lg p-4" style="background: var(--secondary-bg);">
            <span class="secondary-title">赠送给:</span>
            <a-avatar class="mx-5" :size="32" :src="uid.url"></a-avatar>
            <span class="gift-name">{{uid.name}}</span>
          </div>
        </div>
        <PaymentMoney :needPayAvatar="needPayAvatar"></PaymentMoney>
      </template>
      <template v-else>
        <div class="flex flex-col px-7 mb-4">
          <div class="flex items-center rounded-lg p-4" style="background: var(--secondary-bg);">
            <span class="secondary-title">赠送给:</span>
            <a-avatar class="mx-5" :size="32" :src="uid.url"></a-avatar>
            <span class="gift-name">{{uid.name}}</span>
          </div>
        </div>
        <PointPayment :needPayAvatar="needPayAvatar"></PointPayment>
      </template>
    </template>
  </a-modal>
</template>

<script>
import UserAvatar from '../small/UserAvatar.vue'
import PaymentMoney from './PaymentMoney.vue'
import PointPayment from './PointPayment.vue'
export default {
  name:'GiftModal',
  components:{
    UserAvatar,
    PaymentMoney,
    PointPayment
  },
  props:{
    needPayAvatar:{
      type:Object,
      default:()=>{}
    },
    memberDevoteDisplay:{
      type:Array,
      default:()=>[]
    }
  },

  data(){
    return{
      giftVisible:false,
      giftShow:false, // 选择赠送方式
      isSearch:false, // 是否搜索用户
      userNickName:'', // 搜索用户昵称
      rarity:0,
      teamIndex:'',  // 点击选中用户状态
      isBilling:false, // 是否结算
      billingWay:'',
      uid:{}
    }
  },

  methods:{
    openGiftModal(){
      this.giftVisible = true
    },
    pointPay(){  // 积分方式赠送
      this.giftShow = true
      this.billingWay = 1
    },
    cashPay(){  // 现金方式赠送
      this.giftShow = true
      this.billingWay = 0
    },
    searchGiftUser(){  // 搜索需要将头像赠送的用户回调事件
      if(this.userNickName !== ''){
        this.isSearch = true
      }else{
         this.isSearch = false
      }
    },
    giftTeamMember(user){
      this.teamIndex = user.uid
      this.isBilling = true
      this.uid.url = user.userInfo.avatar
      this.uid.name = user.userInfo.nickname
    }
  }
}
</script>

<style lang="scss" scoped>
.avatar-font{

  font-size: 16px;
  font-weight: 500;
}

.avatar-score{
  font-family:Oswald;
  font-size: 24px;
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

.secondary-title{

  font-size: 14px;
  color:var(--secondary-text);
  font-weight: 400;
}

.avatar-bg{
  background: var(--secondary-bg);
  width: 125px;
  height: 125px;
}

.avatar-nickname{

  font-size: 12px;
  color: var(--primary-text);
  font-weight: 400;
}

.gift-name{

  font-size: 16px;
  color: var(--primary-text);
  font-weight: 400;
}

.avatar-status{
  border: 1px solid var(--active-bg);
  background: var(--active-secondary-bg);
}
:deep(.ant-input-suffix span svg){
  color: var(--disable-text) !important;
}
</style>
