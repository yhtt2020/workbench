<template>
  <div
    v-if="isLoading === true"
    class="flex items-center justify-center w-full h-full"
  >
    <a-spin />
  </div>

  <vue-custom-scrollbar
    v-else
    @touchstart.stop
    @touchmove.stop
    @touchend.stop
    :settings="settingsScroller"
    style="height: calc(100vh - 15.8em)"
  >
    <div class="flex epic-container">
      <template v-for="(item, index) in epicLists" :key="index">
        <div
          class="mr-4 mb-4 discount-bg pointer flex flex-col rounded-lg"
          @click="openEpicStore(item)"
        >
          <div class="epic-image">
            <img
              :src="getSpecifiedPicture(item.keyImages).url"
              class="w-full h-full rounded-t-lg object-cover"
              alt=""
            />
          </div>

          <div class="p-3 name-text epic-title truncate">
            {{ item.title === "Mystery Game" ? "神秘游戏" : item.title }}
          </div>

          <div class="p-3">
            <div v-if="getItemStartTime(item)" class="flex item-center">
              <span class="p-2 py-1 mr-2 rounded-md free-font">现在免费</span>
              <span class="py-1 time-text">
                截止时间:
                {{
                  deadline(
                    item.promotions.promotionalOffers[0].promotionalOffers[0]
                      .endDate
                  )
                }}
              </span>
            </div>

            <div v-if="getItemEndTime(item)" class="flex item-center">
              <span class="p-1 mr-2 rounded-md next-notice">下周预告</span>
              <span class="py-1 time-text">
                开始时间:
                {{
                  deadline(
                    item.promotions.upcomingPromotionalOffers[0]
                      .promotionalOffers[0].startDate
                  )
                }}
              </span>
            </div>
          </div>
        </div>
      </template>
    </div>
  </vue-custom-scrollbar>
</template>

<script>
import { sendRequest } from "../../../js/axios/api";
import browser from "../../../js/common/browser";
import { getEpicUrl } from "../game";
import { mapWritableState, mapActions } from "pinia";
import { gameStrategyStore } from "../../../store/gameStrategyStore";
import _ from "lodash-es";

export default {
  name: "EpicPageDetail",

  data() {
    return {
      // 滚动条配置
      settingsScroller: {
        useBothWheelAxes: true,
        swipeEasing: true,
        suppressScrollY: false,
        suppressScrollX: true,
        wheelPropagation: true,
      },
      // epic列表
      epicLists: [],
      isLoading: false,
    };
  },

  computed: {
    ...mapWritableState(gameStrategyStore, ["currentGameArea"]),
  },

  mounted() {
    this.$nextTick(() => {
      this.getGamePageEpic();
    });
  },

  methods: {
    // 获取游戏epic数据
    getGamePageEpic() {
      const url = `${getEpicUrl}locale=zh-CN&&country=CN&&allowCountries=CN`;
      this.isLoading = true;
      sendRequest(url, {}, { localCache: true, localTtl: 60 * 12 * 60 })
        .then((rs) => {
          if (rs.status) {
            const { data } = rs?.data;
            const getElementList = data?.Catalog?.searchStore?.elements;
            const newList = _.filter(getElementList, function (o) {
              return o.promotions !== null;
            });
            this.epicLists = newList;
            this.isLoading = false;
          }
        })
        .finally(() => {
          this.isLoading = false;
        });
    },

    // 获取指定需要的图片
    getSpecifiedPicture(arr) {
      const newArr = _.filter(arr, function (o) {
        return o.type === "OfferImageWide";
      });
      return newArr[0];
    },

    // 区分时间,判断上午或下午
    deadline(value) {
      const date = new Date(
        typeof value === "string" ? `${value}` : parseInt(value) * 1000
      );
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const hour = date.getHours();
      const minute = date.getMinutes();
      const ampm = hour >= 12 ? "下午" : "上午"; // 判断上午或下午
      const formattedDate = `${month}月${day}日 ${ampm} ${hour % 12}:${minute
        .toString()
        .padStart(2, "0")}`;
      return formattedDate;
    },

    // 根据item提取开始时间
    getItemStartTime(item) {
      return item?.promotions?.promotionalOffers?.length !== 0;
    },

    // 根据item提取结束时间
    getItemEndTime(item) {
      return item?.promotions?.upcomingPromotionalOffers?.length !== 0;
    },

    // 加入epic官网详情
    openEpicStore(v) {
      if (v.urlSlug !== null) {
        browser.openInInner(`https://store.epicgames.com/zh-CN/p/${v.urlSlug}`);
      } else {
        browser.openInInner(`https://store.epicgames.com/zh-CN`);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
/**epic区域**/
.epic-image {
  max-width: 484px;
}
.free-font {
  background: #508bfe;
  font-size: 16px;
  color: var(--active-text);
  font-weight: 600;
}
.next-notice {
  font-size: 16px;
  color: var(--primary-text);
  font-weight: 600;
  background: var(--secondary-bg);
}
.time-text {
  font-size: 14px;
  color: var(--secondary-text);
  font-weight: 400;
}

@media screen and (max-width: 840px) {
  .epic-container {
    display: flex !important;
    flex-direction: column !important;
  }
}

@media screen and (min-width: 841px) and (max-width: 1074px) {
  .epic-container {
    display: flex !important;
    flex-wrap: wrap !important;
    align-items: center !important;
    justify-content: center !important;
  }
}

@media screen and (min-width: 1075px) and (max-width: 1140px) {
  .epic-container {
    display: flex !important;
    flex-wrap: wrap !important;
    align-items: center !important;
    justify-content: center !important;
  }
}

@media screen and (min-width: 1141px) and (max-width: 1380px) {
  .epic-container {
    display: flex !important;
    flex-wrap: wrap !important;
    justify-content: center !important;
  }
}

::v-deep .ps__thumb-y {
  display: none !important;
}
</style>