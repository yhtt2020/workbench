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
  <!-- <CollectionCodeModal ref="payRef" :needPayAvatar="needPayAvatar"></CollectionCodeModal> -->

  <!-- 积分付费弹窗组件 -->
  <PointPayment ref="pointRef" :needPayAvatar="needPayAvatar"></PointPayment>

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
      needPayAvatar:{},  // 接收需要付费的头像框数据
      simpleImage: '/img/state/null.png', // 数据空状态
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

    buyNow(item){  // 点击价格购买逻辑 
      this.$refs.payRef.openPayModal()
      this.needPayAvatar.name = item.summary
      this.needPayAvatar.url = item.cover
      this.needPayAvatar.price = this.getFramePrice(item)
    },

    
    scorePay(item){   // 点击积分兑换回调事件  
      this.$refs.pointRef.openPointModal()
      this.needPayAvatar.url = item.cover
      this.needPayAvatar.name = item.summary
    },

    
    teamGift(item){  // 赠送回调事件  
      this.$refs.giftRef.openGiftModal()
      this.needPayAvatar.price = this.getFramePrice(item)
    },
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
</style>
