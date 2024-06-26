<template>
  <template v-if="isLoading === true">
    <div class="flex items-center justify-center w-full h-full">
      <a-spin />
    </div>
  </template>

  <template v-else>
    <vue-custom-scrollbar
      @touchstart.stop
      @touchmove.stop
      @touchend.stop
      :settings="settingsScroller"
      style="height: calc(100vh - 15rem)"
    >
      <div style="height: 16px"></div>
      <div class="flex items-center justify-center">
        <div class="epic-container">
          <template v-for="(item, index) in epicLists" :key="index">
            <div
              class="flex flex-col epic-item xt-bg-t-2 rounded-t-lg pointer"
              @click="openEpicStore(item)"
            >
              <img
                :src="getSpecifiedPicture(item)"
                class="w-full h-full rounded-t-lg object-cover"
                alt=""
              />

              <!-- 游戏名称 -->
              <div class="px-2 pt-3 pb-2 name-text epic-title truncate">
                {{ item.title === "Mystery Game" ? "神秘游戏" : item.title }}
              </div>

              <div class="px-2 pt-2 pb-2">
                <!-- 限时免费 -->
                <template v-if="limitedTimeFree(item)">
                  <div class="flex item-center">
                    <span class="p-2 py-1 mr-2 rounded-md free-font">
                      现在免费
                    </span>
                    <span class="py-1 time-text">
                      当前免费， {{ getLimitedTime(item) }}截止
                    </span>
                  </div>
                </template>

                <!-- 即将推出 -->
                <template v-else-if="comingSoon(item)">
                  <div class="flex item-center">
                    <span class="px-2 mr-2 py-1 rounded-md next-notice">
                      即将推出
                    </span>
                    <span class="py-1 time-text">
                      免费 {{ getLaunchTime(item) }}
                    </span>
                  </div>
                </template>
              </div>
            </div>
          </template>
        </div>
      </div>
      <div style="height: 16px"></div>
    </vue-custom-scrollbar>
  </template>
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
    getSpecifiedPicture(item) {
      const foundImg = _.find(item?.keyImages, (img) => {
        return img?.type === "OfferImageWide";
      });
      return foundImg?.url;
    },

    // 加入epic官网详情
    openEpicStore(v) {
      const url = 'https://store.epicgames.com/zh-CN'
      const epicSlug = v?.catalogNs?.mappings;
      if (epicSlug) {
        const { pageSlug } = epicSlug[0];
        const newUrl = `${url}/p/${pageSlug}`;
        browser.openInSystem(newUrl);
      } else {
        browser.openInSystem(newUrl);
      }
    },

    // 判断当前是否为限时免费
    limitedTimeFree(item) {
      const { promotionalOffers } = item?.promotions;
      return promotionalOffers?.length !== 0;
    },

    // 判断是否为即将推出
    comingSoon(item) {
      const { upcomingPromotionalOffers } = item?.promotions;
      return upcomingPromotionalOffers?.length !== 0;
    },

    // 获取限时结束时间
    getLimitedTime(item) {
      const { promotionalOffers } = item?.promotions;
      const promotion = promotionalOffers[0]?.promotionalOffers[0];
      const date = new Date(promotion?.endDate);
      const month = date.getMonth() + 1; // 月份从0开始，需要加1
      const day = date.getDate();
      const hours = date.getHours();
      const minutes = date.getMinutes().toString().padStart(2, "0");
      return `${month}月${day}日 ${hours}:${minutes}`;
    },

    // 获取推出时间区域
    getLaunchTime(item) {
      const { upcomingPromotionalOffers } = item?.promotions;
      const promotion = upcomingPromotionalOffers[0]?.promotionalOffers[0];
      const startDate = this.getNewDate(new Date(promotion?.startDate));
      const endDate = this.getNewDate(new Date(promotion?.endDate));
      return `${startDate}-${endDate}`;
    },
    getNewDate(time) {
      const month = time.getMonth() + 1; // 月份从0开始，需要加1
      const day = time.getDate().toString().padStart(2, "0");
      return `${month}月${day}日`;
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

/**新响应式区域**/
.epic {
  &-item {
    max-width: 484px;
  }

  @media screen and (max-width: 840px) {
    &-container {
      width: 484px !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      flex-direction: column !important;
    }
    &-item {
      width: calc(100% / 1);
      margin-bottom: 16px !important;
    }
  }

  @media screen and (min-width: 841px) and (max-width: 1074px) {
    &-container {
      display: grid !important;
      grid-template-columns: repeat(
        2,
        1fr
      ) !important; /* 指定每行显示四列，每列平均分配剩余空间 */
      gap: 12px !important; /* 设置列与列之间的间隔 */
    }
    &-item {
      width: calc(100% / 1);
    }
  }

  @media screen and (min-width: 1075px) and (max-width: 1140px) {
    &-container {
      display: grid !important;
      grid-template-columns: repeat(
        2,
        1fr
      ) !important; /* 指定每行显示四列，每列平均分配剩余空间 */
      gap: 12px !important; /* 设置列与列之间的间隔 */
    }
    &-item {
      width: calc(100% / 1);
    }
  }

  @media screen and (min-width: 1141px) and (max-width: 1380px) {
    &-container {
      display: grid !important;
      grid-template-columns: repeat(
        3,
        1fr
      ) !important; /* 指定每行显示四列，每列平均分配剩余空间 */
      gap: 12px !important; /* 设置列与列之间的间隔 */
    }
    &-item {
      width: calc(100% / 1);
    }
  }

  @media screen and (min-width: 1381px) {
    &-container {
      display: grid !important;
      grid-template-columns: repeat(
        4,
        1fr
      ) !important; /* 指定每行显示四列，每列平均分配剩余空间 */
      gap: 12px !important; /* 设置列与列之间的间隔 */
    }
    &-item {
      width: calc(100% / 1);
    }
  }
}

::v-deep .ps__thumb-y {
  display: none !important;
}
</style>

<!-- 
  @media screen and (max-width: 840px) {
    &-container {
      display: flex !important;
      flex-direction: column !important;
      align-items: center !important;
      justify-content: center !important;
      width: 484px !important;
    }
  } 
    
  &-container {
      display: flex !important;
      flex-direction: column !important;
      align-items: center !important;
      justify-content: center !important;
      width: 484px !important;
    }-->