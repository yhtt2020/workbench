<template>
  <div
    v-if="isLoading === true"
    class="w-full h-full flex items-center justify-center"
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
    <div class="flex items-center justify-center flex-col w-full">
      <!-- 顶部 -->
      <div class="all-content-w mb-4 flex items-center justify-center">
        <template v-for="item in discountList?.slice(0, 2)">
          <div
            class="top-item xt-bg rounded-lg pointer flex flex-col"
            @click="enterDiscountDetail(item)"
          >
            <!-- 图片 -->
            <img
              :src="item.header_image"
              alt=""
              class="rounded-t-lg"
              style="width: 100%; height: 100%; object-fit: cover"
            />

            <!-- 折扣游戏名称 -->
            <span
              class="p-2.5 font-18 xt-text"
              style="font-family: PingFangSC-Semibold"
            >
              {{ item.name }}
            </span>

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

      <!-- 底部 -->
      <div class="all-content-w flex items-center justify-center">
        <div class="bottom-container">
          <template v-for="item in discountList?.slice(2)">
            <div
              class="xt-bg-2 bottom-item pointer rounded-lg flex flex-col"
              @click="enterDiscountDetail(item)"
            >
              <!-- 游戏图片 -->
              <img
                :src="item.header_image"
                alt=""
                class="rounded-t-lg mb-3"
                style="width: 100%; height: 100%; object-fit: cover"
              />

              <!-- 价格 -->
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
      </div>
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
          const url = `${getPreferenceUrl}?cc=cn&&l=cn`;
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
        this.$bus.emit("enterDetail", val);
      }
    },
  },

  unmounted() {
    this.$bus.off("updateDiscountData");
  },
};
</script>

<style lang="scss" scoped>
/**数字样式**/
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

/**列表响应式**/
.all-content {
  &-w {
    max-width: 950px !important;
    flex-direction: row !important;
  }

  @media screen and (max-width: 840px) {
    &-w {
      width: calc(100% / 1);
      flex-direction: column !important;
    }
  }

  @media screen and (min-width: 841px) and (max-width: 1074px){
    &-w {
      width: calc(100% / 1);
    }
  }

  @media screen and (min-width: 1141px) and (max-width: 1380px){
    &-w {
      width: calc(100% / 1);
    }
  }

  @media screen and (min-width: 1381px) and (max-width: 1512px){
    &-w {
      width: calc(100% / 1);
    }
  }

  @media screen and (min-width: 1512px){
    &-w {
      width: calc(100% / 1);
    }
  }
}

.top{
  &-item {
    max-width: 484px !important;
    margin-bottom: 0!important;
  }
  &-item:nth-of-type(1) {
    margin-right: 16px !important;
  }

  @media screen and (max-width: 840px) {
    &-item {
      width: calc(100% / 1); 
      margin-bottom: 16px !important;
    }
    &-item:nth-of-type(1) {
      margin-right: 0 !important;
    }
    &-item:nth-of-type(2) {
      margin-bottom:  0 !important;
    }
  }

  @media screen and (min-width: 841px) and (max-width: 1074px) {
    &-item {
      width: calc(100% / 2) ;
    }
  }

  @media screen and (min-width: 1141px) and (max-width: 1380px) {
    &-item {
      width: calc(100% / 1) ;
    }
  }

  @media screen and (min-width: 1380px) {
    &-item {
      width: calc(100% / 1) ;
    }
  }
}

.bottom {
  &-container {
    display: grid !important;
    grid-template-columns: repeat(
      4,
      1fr
    ) !important; /* 指定每行显示四列，每列平均分配剩余空间 */
    gap: 16px !important; /* 设置列与列之间的间隔 */
  }

  @media screen and (max-width: 840px) {
    &-container {
      display: flex !important;
      align-items: center;
      justify-content: center !important;
      flex-direction: column !important;
      width: 484px !important;
    }
    &-item {
      width: 100% !important;
    }
  }

  @media screen and (min-width: 841px) and (max-width: 1074px) {
    &-container {
      display: grid !important;
      grid-template-columns: repeat(
        2,
        1fr
      ) !important; /* 指定每行显示四列，每列平均分配剩余空间 */
      gap: 16px !important; /* 设置列与列之间的间隔 */
    }
  }
}

</style>