<template>
  <Widget :options="options" :customIndex="customIndex" :desk="desk">
    <template #left-title-icon>
      <div
        class="icon flex items-center justify-center h-6"
        style="width: 38px; position: absolute; left: 2px"
      >
        <newIcon icon="cib:epic-games" style="font-size: 22px" />
      </div>
    </template>
    <HorizontalPanel style="min-width: 100%" :navList="epicTips"  v-model:selectType="epicType"  class="mt-2 drawer-item-bg" >
    </HorizontalPanel>

    <template v-if="epicType.name === 'week'">
      <div class="w-full mt-3" v-if="detailShow === false">
        <div class="flex items-center justify-center my-10" v-if="promotionList.length === 0">
          <a-empty :image="simpleImage" />
        </div>
        <div v-else class="relative rounded-lg cursor-pointer week-image"  v-for="item in promotionList" @click.stop="enterWeek(item)">
         <img class="rounded-lg" :src="item.keyImages[0].url" alt=""  style="width:100%;height:100%;object-fit: cover;">
         
         <div class="remainder-day xt-num-font" style="color: var(--active-text);min-width: 100px;">
          剩余 {{ item.days.end }} 天
         </div>
         <div class="stablish-province xt-num-font" style="min-width: 100px;">
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
         
         <div class="remainder-day xt-num-font" style="color: var(--active-text);min-width: 100px;">
          剩余 {{ item.days.start }} 天
         </div>
         <div class="stablish-province xt-num-font" style="min-width: 100px;">
          立省 
          {{ item.price.totalPrice.fmtPrice.originalPrice }}
         </div>
        </div>
      </div>
      <EpicDetail :detailOptions="detailList" :detailType="epicType" v-else @update:backShow="detailBack"></EpicDetail>
    </template>
  </Widget>
</template>

<script>
import { Icon as newIcon } from "@iconify/vue";
import { serverCache, localCache } from "../../../js/axios/serverCache";
import axios from "axios";
import { thisWeek, nextWeek,remainderDays } from "./utils/epicUtils";

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

  props: ["desk", "customIndex"],

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
    }
  },

  mounted() {
   this.$nextTick(()=>{
    this.getEpicList();
   })
  },

  methods: {
    async getEpicList() {
      const epicURL = "https://store-site-backend-static-ipv4.ak.epicgames.com/freeGamesPromotions?locale=zh-CN&country=CN&allowCountries=CN";
      const result = await axios.get(epicURL);
      const data = result.data.data.Catalog;
      const epicList = data.searchStore.elements;
      localCache.set("epic", epicList, 10 * 60);
      serverCache.setData("epic", epicList, 10 * 60);
      // 走服务器缓存
      const res = await serverCache.getDataWithLocalCache("epic", {
        localCache: true,
        ttl: 10 * 60,
        cache: false,
      });
      try {
        if (res) {
          const epicRes = res;
          // 过滤掉为null的数据
          const filterEpic = epicRes.filter((item) => {
            return item.promotions !== null;
          });
          // 排除promotions.promotionalOffers的列表不是空列表
          const mapPromo = filterEpic.map((item) => {
            if (item.promotions.promotionalOffers.length !== 0) {
              return {
                title: item.title,
                summary: item.description,
                keyImages: item.keyImages,
                price: item.price,
                promotions: {
                  ...item.promotions.promotionalOffers[0].promotionalOffers[0],
                },
              };
            }
          });
          // 排除promotions.upcomingPromotionalOffers的列表不是空列表
          const mapUnPromo = filterEpic.map((item) => {
            if (item.promotions.upcomingPromotionalOffers.length !== 0) {
              return {
                title: item.title,
                summary: item.description,
                keyImages: item.keyImages,
                price: item.price,
                promotions: {
                  ...item.promotions.upcomingPromotionalOffers[0]
                    .promotionalOffers[0],
                },
              };
            }
          });
          // 将promotions.promotionalOffers被排除后的列表中有undefined的值进行过滤
          const filterPromo = mapPromo.filter((item) => {
            return item !== undefined;
          });
          // 将promotions.upcomingPromotionalOffers被排除后的列表中有undefined的值进行过滤
          const filterUnPromo = mapUnPromo.filter((item) => {
            return item !== undefined;
          });
          /**
           * 将promotions.promotionalOffers和promotions.upcomingPromotionalOffers的列表
           * 进行合并,然后根据startDate和endDate进行本周和下周的区分
           * **/
          const newPromoList = filterPromo.concat(filterUnPromo);
          const thisWeekDate = thisWeek();
          const nextWeekDate = nextWeek();
          // 根据promoList和unPromoList中的startDate和endDate来判断属于本周还是下一周的数据
          const thisWeekList = newPromoList.filter((item) => {
            if (
              item.promotions.startDate !== null &&
              item.promotions.endDate !== null
            ) {
              const startDate = new Date(item.promotions.startDate);
              const endDate = new Date(item.promotions.endDate);
              return startDate <= thisWeekDate.endDate && endDate >= thisWeekDate.startDate
            }
          });
          const nextWeekList = newPromoList.filter((item) => {
            const itemNull = item.promotions.startDate !== null && item.promotions.endDate !== null
            if (itemNull) {
              const nextStartDate = new Date(item.promotions.startDate);
              const nextEndDate = new Date(item.promotions.endDate);
              return  nextStartDate <= nextWeekDate.endDate && nextEndDate >= nextWeekDate.startDate
            }
          });

          const thisWeekListMap = thisWeekList.map((item)=>{
            return {
              ...item,days:remainderDays(item.promotions)
            }
          })

          const nextWeekListMap = nextWeekList.map((item)=>{
            return {...item,days:remainderDays(item.promotions),}
          })

          this.promotionList = thisWeekListMap;
          this.unPromotionList = nextWeekListMap.slice(1);
        }
      } catch (error) {
        console.error("网络问题", error);
      }
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