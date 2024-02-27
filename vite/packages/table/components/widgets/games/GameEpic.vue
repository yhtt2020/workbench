<template>
  <xt-container 
    :header="header"
    v-model:customSize="customData.customSize"
    :customData="customData"
    :envLimit="['web']"  
    :options="options" 
    :customIndex="customIndex" 
    :desk="desk">

    <HorizontalPanel style="min-width: 100%" :navList="epicTips"  v-model:selectType="epicType"  class=" drawer-item-bg" >
    </HorizontalPanel>

    <template v-if="epicType.name === 'week'">
      <div class="w-full mt-3" v-if="detailShow === false">
        <div class="flex items-center justify-center my-10" v-if="promotionList.length === 0">
          <a-empty :image="simpleImage" />
        </div>
        <div v-else class="relative rounded-lg cursor-pointer week-image"  v-for="item in promotionList" @click.stop="enterWeek(item)">
         <img class="rounded-lg" :src="item.keyImages[0].url" alt=""  style="width:100%;height:100%;object-fit: cover;">

         <div class="remainder-day xt-num-font-600" style="color: var(--active-text);min-width: 100px;">
          剩余 {{ item.days.start }} 天
         </div>
         <div class="stablish-province xt-num-font-600" style="min-width: 100px;">
          立省  {{ item.price.totalPrice.fmtPrice.originalPrice }}
         </div>
        </div>
      </div>
      <EpicDetail :detailOptions="detailList" :detailType="epicType" v-else @update:backShow="detailBack"></EpicDetail>
    </template>

    <template v-else>
      <div class="w-full mt-3" v-if="detailShow === false">
        <div class="flex items-center justify-center my-10" v-if="unPromotionList.length === 0">
          <a-empty :image="simpleImage" />
        </div>
        <div v-else class="relative rounded-lg cursor-pointer week-image"  v-for="item in unPromotionList" @click.stop="enterWeek(item)">
         <img class="rounded-lg" :src="item.keyImages[0].url" alt=""  style="width:100%;height:100%;object-fit: cover;">

         <div class="remainder-day xt-num-font-600" style="color: var(--active-text);min-width: 100px;">
          剩余 {{ item.days.end }} 天
         </div>
         <div class="stablish-province xt-num-font-600" style="min-width: 100px;">
          立省
          {{ item.price.totalPrice.fmtPrice.originalPrice }}
         </div>
        </div>
      </div>
      <EpicDetail :detailOptions="detailList" :detailType="epicType" v-else @update:backShow="detailBack"></EpicDetail>
    </template>
  </xt-container>
</template>

<script>
import { Icon as newIcon } from "@iconify/vue";
import { mapWritableState,mapActions } from 'pinia'
import { epicStore } from '../../../store/epicStore'
import { message } from 'ant-design-vue'
// import { serverCache, localCache } from "../../../js/axios/serverCache";
// import axios from "axios";
// import { thisWeek, nextWeek,remainderDays } from "./utils/epicUtils";

import Widget from "../../card/Widget.vue";
import HorizontalPanel from "../../HorizontalPanel.vue";
import EpicDetail from "./EpicDetail.vue";

export default {
  components: {
    Widget,
    HorizontalPanel,
    EpicDetail,
    newIcon,
  },

  props: ["desk", "customIndex",'customData'],

  data() {
    return {
      epicTips: [
        { title: "本周免费", name: "week" },
        { title: "下周预告", name: "next" },
      ],
      options: {
        className: "card",
        title: "Epic喜加一",
        // icon: 'epicgames',
        type: "games",
      },

      epicType: { title: "本周免费", name: "week" },
      simpleImage: "/public/img/test/not-data.png", // 空状态
      detailShow: false,

      env: {
        web: false,
        mobile: false,
        client: false,
        offline: false,
      },

      promotionList: [],
      unPromotionList: [],

      detailList: {},
      
      refreshFlag:false,
    }
  },

  computed:{
    ...mapWritableState(epicStore,['epicData']),
    header(){
      return {
        title: 'Epic喜加一',
        ifyIcon:'cib:epic-games',
        refresh:{
          fn:this.refreshNow,
          tip:'刷新',
          state:this.refreshFlag ? true : false
        }
      }
    }
  },

  mounted() {
    this.getEpicData();
    if(Object.keys(this.epicData).length !== 0){
      this.unPromotionList = this.epicData.unPromotionList
      this.promotionList = this.epicData.promotionList
    }
    this.customData.customSize = '2x4'
  },

  methods: {
    ...mapActions(epicStore,['getEpicData','refresh']),
    // 点击刷新
    refreshNow(){
      this.refreshFlag = true
      this.refresh()
      setTimeout(()=>{
        this.refreshFlag = false
      },500)
    },

    enterWeek (item){
      const data = {
        ...item,
        image:item.keyImages[0].url,
        price: item.price.totalPrice.fmtPrice.originalPrice,
        days:this.epicType.name === 'week' ? item.days.end :  item.days.start
      }
      this.detailShow = true
      this.detailList = data
    },
    detailBack () {
      this.detailShow = false
    },
  },

  watch: {
    epicType () {
      this.detailShow = false
    }
  }
};
</script>

<style lang="scss" scoped>
.change-item {
  width: 122px;
}

.epic-active {
  background: rgba(42, 42, 42, 0.8);
  border-radius: 6px;
}

.week-image {
  width: 252px;
  height: 144px;

  &:nth-of-type(1) {
    margin-bottom: 10px;
    margin-top: 14px;
  }
}

.remainder-day {
  position: absolute;
  right: 0;
  top: 0;
  background: rgba(255, 77, 79, 1);
  padding: 3px 10px 2px 8px;
  border-top-right-radius: 6px;
  font-size: 13px;
  font-weight: 400;
  text-align: center;
}

.stablish-province {
  position: absolute;
  top: 1.9em;
  right: 0;
  padding: 3px 6px 2px 6px;
  text-align: center;
  background:var(--secondary-bg);
  border-bottom-left-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  color:var(--primary-text);
}

.epic-detail-image {
  width: 252px;
  height: 144px;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.content-introduction {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: pre-wrap;
  color: rgba(255, 255, 255, 0.6);
  font-size: 16px;
  font-weight: 400;
}


:deep(.nav-item){
  border-radius: 8px !important;
}

.nav-list-container {
  background: rgba(255, 255, 255, 0.2) !important;
  border-radius: 8px !important;
}
</style>
