<!-- 游戏折扣详情页面 -->
<template>
  <div
    class="w-full h-full flex items-center justify-center"
    v-if="isLoading === true"
  >
    <a-spin />
  </div>

  <vue-custom-scrollbar
    v-else
    @touchstart.stop
    @touchmove.stop
    @touchend.stop
    :settings="settingsScroller"
    class="mt-3 px-3"
    style="height: calc(100vh - 16.5em)"
  >
    <div class="steam-top-content w-full mb-4">
      <template v-for="item in discountList?.slice(0, 2)">
        <div
          @click="enterDiscountDetail(item)"
          class="steam-top-item rounded-lg flex pointer flex-col discount-bg"
        >
          <img
            :src="item.header_image"
            alt=""
            class="rounded-t-lg"
            style="width: 100%; height: 100%; object-fit: cover"
          />

          <div class="p-2.5 name-text">{{ item.name }}</div>

          <div class="px-2.5 mb-3" style="color: var(--secondary-text)">
            优惠截止时间: {{ deadline(item.discount_expiration) }}
          </div>

          <div class="px-2.5 flex items-center mb-3">
            <span class="percent px-1 rounded-md">
              -{{ item.discount_percent }}%
            </span>
            <span class="final-price ml-3">
              {{ currencyFormat(item.final_price, item.currency) }}
            </span>

            <span class="line-through old-price ml-3">
              {{ currencyFormat(item.original_price, item.currency) }}
            </span>
          </div>
        </div>
      </template>
    </div>

    <div class="steam-bottom-content">
      <template v-for="item in discountList?.slice(2)">
        <div
          @click="enterDiscountDetail(item)"
          class="steam-bottom-item discount-bg pointer rounded-lg flex flex-col mr-2"
        >
          <img
            :src="item.header_image"
            alt=""
            class="rounded-t-lg mb-3"
            style="width: 100%; height: 100%; object-fit: cover"
          />
          <div class="px-3 flex items-center mb-3">
            <span class="percent-bottom px-1 rounded-md">
              -{{ item.discount_percent }}%
            </span>
            <span class="final-price ml-2">
              {{ currencyFormat(item.final_price, item.currency) }}
            </span>
            <span class="line-through old-price ml-2">
              {{ currencyFormat(item.original_price, item.currency) }}
            </span>
          </div>
        </div>
      </template>
    </div>
  </vue-custom-scrollbar>
</template>

<script>
import { mapWritableState, mapActions } from "pinia";
import { gameStrategyStore } from "../../../store/gameStrategyStore";
import { getPreferenceUrl } from "../game";
import { sendRequest, currencyFormat } from "../../../js/axios/api";

export default {
  name: "GamePageDiscountDetail",

  data() {
    return {
      // 滚动条配置项
      settingsScroller: {
        useBothWheelAxes: true,
        swipeEasing: true,
        suppressScrollY: false,
        suppressScrollX: true,
        wheelPropagation: true,
      },
      // 加载状态
      isLoading: false,
      discountList: [],
    };
  },

  computed: {
    ...mapWritableState(gameStrategyStore, ["currentGameArea"]),
  },

  mounted() {
    this.$nextTick(() => {
      this.getDiscountSteamData();
    });

    this.$bus.on("updateDiscountData", () => {
      this.getDiscountSteamData();
    });
  },

  methods: {
    currencyFormat,

    // 获取特惠数据
    getDiscountSteamData() {
      if (!this.isLoading) {
        this.isLoading = true;
        if (this.currentGameArea?.id) {
          const url = `${getPreferenceUrl}?cc=${this.currentGameArea?.id}&&l=${this.currentGameArea?.id}`;
          sendRequest(url, {}, { localCache: true, localTtl: 60 * 12 * 60 })
            .then((rs) => {
              if (rs.status === 200) {
                this.isLoading = false;
                const { specials } = rs?.data;
                this.discountList = specials?.items;
              }
            })
            .finally(() => {
              this.$nextTick(() => {
                this.isLoading = false;
              });
            });
        } else {
          sendRequest(url, {}, { localCache: true, localTtl: 60 * 12 * 60 })
            .then((rs) => {
              if (rs.status === 200) {
                this.isLoading = false;
                const { specials } = rs?.data;
                this.discountList = specials?.items;
                console.log("测试", specials);
              }
            })
            .finally(() => {
              this.$nextTick(() => {
                this.isLoading = false;
              });
            });
        }
      }
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

    // 进入详情
    enterDiscountDetail(val) {
      if (val.type === 1) {
        //  解决steam折扣列表，type1 组合包问题
        const storeUrl = `https://store.steampowered.com/sub/${val.id}/`;
        browser.openInInner(storeUrl);
      }

      // 进入详情页
      else {
        console.log('测试',val);
        this.$bus.emit('enterDetail',val)
      }
    },
  },

  unmounted() {
    this.$bus.off("updateDiscountData");
  },
};
</script>

<style lang="scss" scoped>
.place-name {
  background: var(--primary-bg);
  color: var(--primary-text);
}
.name-text {
  font-family: PingFangSC-Semibold;
  font-size: 18px;
  color: var(--primary-text);
  font-weight: 600;
}
.discount-bg {
  background: var(--primary-bg);
}

//steam特惠内容区域
.steam-top-content {
  display: flex;
  align-items: center;
  justify-content: center;
}
.steam-bottom-content {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
}

.steam-top-item {
  max-width: 484px;
  margin-right: 12px;
}
.steam-bottom-item {
  max-width: 236px;
}

.old-price {
  font-family: Oswald;
  font-size: 12px;
  color: var(--disable-text);
  font-weight: 400;
}
.final-price {
  font-family: Oswald;
  font-size: 14px;
  color: #ff4d4f;
  font-weight: 600;
}
.percent {
  background: #ff4d4f;
  font-family: Oswald-Bold;
  font-size: 16px;
  color: rgba(255, 255, 255, 0.85);
  font-weight: 700;
}
.percent-bottom {
  background: #ff4d4f;
  font-family: Oswald-Bold;
  font-size: 16px;
  color: rgba(255, 255, 255, 0.85);
  font-weight: 700;
  max-width: 80px;
}

@media screen and (max-width: 840px) {
  .steam-top-content {
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    flex-direction: column !important;
    margin-bottom: 0 !important;
  }
  .steam-bottom-content {
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    flex-direction: column !important;
  }
  .steam-top-item {
    margin-bottom: 16px !important;
    margin-right: 0 !important;
  }
  .steam-bottom-item {
    max-width: 484px !important;
    margin-bottom: 16px;
    margin-right: 0 !important;
  }
}

@media screen and (min-width: 841px) and (max-width: 1074px) {
  .steam-bottom-item {
    width: calc(100% / 1);
    margin-bottom: 16px !important;
  }
  .steam-bottom-content {
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
  }
  .epic-container {
    display: flex !important;
    flex-wrap: wrap !important;
    align-items: center !important;
    justify-content: center !important;
  }
  .steam-top-item {
    width: calc(100% / 1);
  }
}

@media screen and (min-width: 1075px) and (max-width: 1140px) {
  .steam-bottom-item {
    width: calc(100% / 2);
    margin-bottom: 16px !important;
  }
  .steam-bottom-content {
    display: flex !important;
  }

  .steam-top-item {
    width: calc(100% / 1);
  }
}

@media screen and (min-width: 1141px) and (max-width: 1380px) {
  .steam-bottom-item {
    width: calc(100% / 3);
    margin-bottom: 16px !important;
  }
  .steam-bottom-content {
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
  }

  .steam-top-item {
    width: calc(100% / 1);
  }
}

@media screen and (min-width: 1381px) and (max-width: 1512px) {
  .steam-bottom-item {
    width: calc(100% / 4.5);
    margin-bottom: 16px !important;
  }
  .steam-bottom-content {
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    flex-wrap: wrap !important;
  }
  .steam-top-item {
    width: calc(100% / 1);
  }
}

@media screen and (min-width: 1512px) {
  .steam-bottom-content {
    width: 1000px !important;
    margin: 0 auto;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
  }
  .steam-bottom-item {
    margin-bottom: 16px !important;
    width: calc(100% / 1);
  }
  .steam-top-item {
    width: calc(100% / 1);
  }
  .steam-top-item {
    width: calc(100% / 1);
  }
}

::v-deep .ps__thumb-y {
  display: none !important;
}
</style>