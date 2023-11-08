<template>
  <Widget :options="options" :customIndex="customIndex" :desk="desk">
    <template #left-title-icon>
        <div
          class="icon"
          style=" width: 38px;height: 24px; display: flex;justify-content: center;align-items: center;position: absolute;
            left: 2px; ">
          <newIcon icon="cib:epic-games" style="font-size: 22px;" />
        </div>
      </template>
    <HorizontalPanel style="min-width: 100%" :navList="epicTips" v-model:selectType="epicType" class="mt-2 drawer-item-bg"></HorizontalPanel>
    <template v-if="epicType.name === 'week'">
      <div class="w-full" v-if="detailShow === false">
        <div class="flex items-center justify-center my-10" v-if="weekEpic.length === 0">
          <a-empty :image="simpleImage" />
        </div>
        <div v-else class="relative rounded-lg cursor-pointer week-image" v-for="weekItem in weekEpic"
             @click="enterWeek(weekItem)">
          <img class="rounded-lg" :src="weekItem.keyImages[0].url" alt=""
               style="width:100%;height:100%;object-fit: cover;">
          <div class="remainder-day" style="color: var(--active-text);font-family: Oswald;">
            剩余{{ remainderDay(weekItem.promotions.promotionalOffers[0].promotionalOffers[0].endDate) }}天
          </div>
          <div class="stablish-province" style="font-family: Oswald;">立省 {{ weekItem.price.totalPrice.fmtPrice.originalPrice }}</div>
        </div>
      </div>
      <EpicDetail :detailOptions="detailList" :detailType="epicType" v-else @update:backShow="detailBack"></EpicDetail>
    </template>
    <template v-else>
      <div class="w-full" v-if="detailShow === false">
        <div class="flex items-center justify-center my-10" v-if="nextWeekEpic.length === 0">
          <a-empty :image="simpleImage" />
        </div>
        <div v-else class="relative rounded-lg cursor-pointer week-image" v-for="weekItem in nextWeekEpic"
             @click="enterWeek(weekItem)">
          <img class="rounded-lg" :src="weekItem.keyImages[0].url" alt=""
               style="width:100%;height:100%;object-fit: cover;">
          <div class="remainder-day">
            还有{{ remainderDay(weekItem.promotions.upcomingPromotionalOffers[0].promotionalOffers[0].endDate) }}天
          </div>
          <div class="stablish-province ">立省{{weekItem.price.totalPrice.fmtPrice.originalPrice}}</div>
        </div>
      </div>
      <EpicDetail :detailOptions="detailList" :detailType="epicType" v-else @update:backShow="detailBack"></EpicDetail>
    </template>

  </Widget>
</template>

<script>
import Widget from '../../card/Widget.vue'
import HorizontalPanel from '../../HorizontalPanel.vue'
import { sendRequest, startOfNextWeek, startOfWeek, remainderDay } from '../../../js/axios/api'
import EpicDetail from './EpicDetail.vue'
import _ from 'lodash-es'
import {Icon as newIcon} from '@iconify/vue' 
export default {
  name: 'GameEpic',
  components: {
    Widget,
    HorizontalPanel,
    EpicDetail,
    newIcon
  },
  props: {
    customIndex: {
      type: Number,
      default: 0
    },
    desk:{
      type:Object
    }
  },
  data () {
    return {
      options: {
        className: 'card',
        title: 'Epic喜加一',
        // icon: 'epicgames',
        type: 'games',
        epicShow: true,
      },
      epicTips: [
        { title: '本周免费', name: 'week' },
        { title: '下周预告', name: 'next' }
      ],
      epicType: { title: '本周免费', name: 'week' },
      epicWeek: [], // 本周数据
      epicNext: [],  // 下周数据
      epicList: [],
      detailList: {},
      detailShow: false,
      simpleImage: '/public/img/test/not-data.png', // 空状态
      env:{
        web: false,
        mobile: false,
        client: false,
        offline:false
      }
    }
  },
  computed: {
    weekEpic () {
      try {
        const weekEpicIndex = this.epicList.filter(el => {
          if (el.promotions.promotionalOffers.length !== 0 && el.price.totalPrice.discountPrice === 0) {
            const startPromotions = el.promotions.promotionalOffers[0]
            const startDate = new Date(startPromotions.promotionalOffers[0].startDate)
            const endDate = new Date(startPromotions.promotionalOffers[0].endDate)
            return startOfWeek(startDate,endDate)
          }
        })
        if (weekEpicIndex.length > 2) {
          return _.sampleSize(weekEpicIndex, 2)
        }
        return weekEpicIndex
      } catch (e) {
        console.warn(e)
        return []
      }

    },
    nextWeekEpic () {
      try {
        const nextWeekEpicIndex = this.epicList.filter(el => {
          if (el.promotions.upcomingPromotionalOffers.length !== 0 && el.price.totalPrice.discountPrice === 0) {
            const nextPromotions = el.promotions.upcomingPromotionalOffers[0]
            const nextStartDate = new Date(nextPromotions.promotionalOffers[0].startDate)
            const nextEndDate = new Date(nextPromotions.promotionalOffers[0].endDate)
            return startOfNextWeek(nextStartDate,nextEndDate)
          }
        })
        if (nextWeekEpicIndex.length > 2) {
          return _.sampleSize(nextWeekEpicIndex, 2)
        }
        return nextWeekEpicIndex.slice(0, 2)
      } catch (e) {
        console.warn(e)
        return []
      }

    },
  },
  mounted () {
    this.getEpicData()
  },
  methods: {
    remainderDay,
    getEpicData () {
      sendRequest('https://store-site-backend-static-ipv4.ak.epicgames.com/freeGamesPromotions?locale=zh-CN&country=CN&allowCountries=CN',{},{
        localCache:true,
        localTtl:60*12*60
      }).then(res => {
        if(!res){
          this.epicList =[]
        }else{
          const epicData = res.data.data.Catalog.searchStore.elements
          // 根据promotions判断Epic是否免费
          const epicIndex = epicData.filter(el => {
            return el.promotions !== null
          })
          this.epicList = epicIndex
        }
      })
    },
    enterWeek (item) {
      this.detailShow = true
      if (item.promotions.promotionalOffers.length !== 0) {
        const promotions = item.promotions.promotionalOffers[0].promotionalOffers[0]
        this.detailList = {
          image: item.keyImages[0].url,
          name: item.title,
          price: item.price.totalPrice.fmtPrice.originalPrice,
          illustrate: item.description,
          weekDate: promotions.endDate,
          productSlug: item.productSlug
        }
      } else if (item.promotions.upcomingPromotionalOffers.length !== 0) {
        const upcomingPromotional = item.promotions.upcomingPromotionalOffers[0].promotionalOffers[0]
        this.detailList = {
          image: item.keyImages[0].url,
          name: item.title,
          price: item.price.totalPrice.fmtPrice.originalPrice,
          illustrate: item.description,
          nextWeekDate: upcomingPromotional.endDate,
          productSlug: item.productSlug
        }
      }
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

}
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
  width: 80px;
}

.stablish-province {
  position: absolute;
  top: 1.9em;
  right: 0;
  padding: 3px 6px 2px 6px;
  text-align: center;
  width: 80px;
  background:var(--secondary-bg);
  border-bottom-left-radius: 6px;
  font-size: 13px;
  font-weight: 400;
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


.nav-list-container {
  background: rgba(255, 255, 255, 0.2) !important;
  border-radius: 8px !important;
}

.nav-list-container ::v-deep .s-item {
  border-radius: 6px !important;
}
</style>
