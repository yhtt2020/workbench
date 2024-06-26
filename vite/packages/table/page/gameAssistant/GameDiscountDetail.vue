<template>
  <div class="px-4 flex flex-col">
    <div class="flex">
      <div class="flex-grow">
        <div class="left-flex flex items-center">
          <xt-button @click="goBack" :radius="8" w="48" h="48">
            <xt-ify-icon
              icon="fluent:chevron-left-16-filled"
              size="24"
              class="xt-text"
            />
          </xt-button>
          <span
            style="font-size: 20px; font-weight: 500"
            class="ml-4 px-2 py-2 rounded-lg detail-name"
          >
            {{ discountDetail?.name }}
          </span>
        </div>
      </div>

      <div class="flex-grow-0 flex items-center">
        <div class="right-flex flex items-center justify-center mr-5">
          <xt-button
            class="mr-3"
            @click="shareSteamGame"
            :w="40"
            :h="40"
            :radius="8"
          >
            <xt-ify-icon
              icon="fluent:share-android-24-filled"
              size="24"
              class="xt-text"
            />
          </xt-button>
          <span
            class="rounded-lg px-10 py-2 button-active detail-bg pointer mr-3 min-store"
            @click="enterSteamStore"
          >
            前往购买
          </span>
          <GameDiscountTab :isTab="false" :mb="'mb-0'" />
        </div>
      </div>
    </div>

    <vue-custom-scrollbar
      :settings="settingsScroller"
      style="height: calc(100vh - 15.8em)"
      class="mt-3 mr-3"
    >
      <div class="detail-container">
        <div v-if="loading"></div>
        <div class="top-detail flex" v-else>
          <div class="wheelCastingUnit-container">
            <WheelCastingUnit
              :loading="loading"
              :wheelList="wheelData"
            />
          </div>
          <div class="flex-1">
            <DetailRightText :detailData="discountDetail" :detailTime="exTime"/>
          </div>
        </div>
      </div>

      <div class="flex items-center justify-center flex-col mt-5">
        <div
          class="rounded-lg px-4 py-4 min-introduction detail-bg"
          style="width: 960px"
        >
          <span
            style="
              font-size: 18px;
              color: var(--primary-text);
              font-weight: 600;
            "
            >游戏介绍</span
          >
          <div
            v-html="discountDetail?.gameIntroduction"
            class="game-intro"
          ></div>
        </div>
      </div>
    </vue-custom-scrollbar>
  </div>

  <!-- 转发分享弹窗 -->
  <ShareToChat
    :content="shareContent"
    type="game"
    alias="游戏"
    ref="shareModalRef"
  />
</template>

<script>
import browser from "../../js/common/browser";
import { mapActions, mapWritableState } from "pinia";
import { steamStore } from "../../store/steam";
import { gameStrategyStore } from "../../store/gameStrategyStore";

import WheelCastingUnit from "../../components/WheelCastingUnit.vue";
import ShareToChat from "../../ui/chat/ShareToChat.vue";
import GameDiscountTab from "./components/GameDiscountTab.vue";
import DetailRightText from "./components/DetailRightText.vue";

export default {
  name: "GameDiscountDetail",

  components: {
    ShareToChat,
    GameDiscountTab,
    WheelCastingUnit,
    DetailRightText,
  },

  props: {
    // 当前折扣的游戏id
    gameId: {
      type: String,
    },
    // 截止时间
    exTime: {
      type: String,
    },
  },

  data() {
    return {
      loading: false,
      settingsScroller: {
        useBothWheelAxes: true,
        swipeEasing: true,
        suppressScrollY: false,
        suppressScrollX: true,
        wheelPropagation: true,
      },
    };
  },

  computed: {
    ...mapWritableState(steamStore, ["discountDetail"]),
    ...mapWritableState(gameStrategyStore, ["currentGameArea"]),

    wheelData() {
      if (this.discountDetail && this.discountDetail?.movie_image) {
        return this.discountDetail?.movie_image;
      }
    },
    shareContent() {
      return {
        description: "steam游戏",
        data: JSON.stringify({
          type: "game",
          game: {
            ...this.discountDetail,
            chineseName: this.discountDetail?.name,
          },
        }),
      };
    },
  },

  methods: {
    ...mapActions(steamStore, ["getDiscountDetail"]),

    // 返回上一个页面
    goBack() {
      this.$bus.emit("backPage");
    },

    // 更新和请求数据方法
    updateDiscountDetailFn() {
      if (!this.loading) {
        this.loading = true;
        if (this.currentGameArea?.id) {
          this.getDiscountDetail(this.gameId, this.currentGameArea?.id)
            .then((rs) => {
              if (rs.status === 200) {
                this.loading = false;
              }
            })
            .finally(() => {
              this.loading = false;
            });
        } else {
          this.getDiscountDetail(this.gameId, "cn")
            .then((rs) => {
              if (rs.status === 200) {
                this.loading = false;
              }
            })
            .finally(() => {
              this.loading = false;
            });
        }
      }
    },

    // 分享
    shareSteamGame() {
      this.$refs.shareModalRef.openShareModal();
    },

    // 进入官网商店
    enterSteamStore() {
      browser.openInUserSelect(`https://store.steampowered.com/app/${this.id}`);
    },

    // 解析时间
    acquisitionDate(val) {
      const expireDate = new Date(parseInt(val) * 1000);
      let m = expireDate.getMonth() + 1; // 月
      let d = expireDate.getDate(); // 日
      return m + "月" + d + "日";
    },
  },

  mounted() {
    this.$bus.on("handleDiscountData", () => {
      this.updateDiscountDetailFn();
    });
    this.updateDiscountDetailFn();
  },
};
</script>

<style lang="scss" scoped>
.detail-bg {
  background: var(--primary-bg);
  color: var(--primary-text);
}
.button-active {
  &:active {
    filter: brightness(0.8);
    opacity: 0.8;
  }
  &:hover {
    opacity: 0.8;
  }
}
.detail-name {
  font-size: 20px;
  color: var(--primary-text);
  font-weight: 500;
}

::v-deep .ps__thumb-y {
  display: none !important;
}
.detail-container {
  display: flex;
  align-items: stretch;
  justify-content: center;
}
.min-width {
  max-width: 344px;
}

.min-introduction {
  .game-intro {
    width: 100%;
    ::v-deep .bb_ul {
      padding: 0 !important;
      li {
        list-style: none !important;
        padding: 0 !important;
        img {
          height: 10px !important;
          width: 10px !important;
          object-fit: cover;
        }
      }
    }
    ::v-deep p img {
      width: 100% !important;
      object-fit: cover;
    }
    ::v-deep img {
      width: 100% !important;
      object-fit: cover;
    }
  }
}
.oswald-font {
  font-family: Oswald-SemiBold;
}

.wheelCastingUnit-container{
  width: 600px !important;
}

@media screen and (max-width: 1224px) {
  #detail-name {
    max-width: 120px;
  }
  .min-store {
    padding: 8px 12px !important;
  }
  .detail-container {
    display: flex !important;
    flex-direction: column !important;
    align-items: center !important;
  }

  .top-detail {
    flex-direction: row !important;
    align-items: center !important;
    max-width: 960px !important;
  }

  .wheelCastingUnit-container {
    width: 600px !important;
  }

  .min-width {
    max-width: 600px !important;
    margin: 24px 0 0 0 !important;
  }
  .min-introduction {
    max-width: 600px !important;
    .game-intro {
      width: 100% !important;
      ::v-deep p img {
        width: 100% !important;
      }
      ::v-deep img {
        width: 100% !important;
      }
      ::v-deep .bb_ul {
        width: 100% !important;
        li {
          padding: 0 !important;
          list-style: none !important;
          img {
            height: 10px !important;
            width: 10px !important;
          }
        }
      }
    }
  }
}

@media screen and (max-width: 850px) {
  .min-width {
    max-width: 500px !important;
  }
  .detail-container {
    display: flex !important;
    flex-direction: column !important;
    align-items: center !important;
  }
  .wheel-content {
    max-width: 500px !important;
  }
  .min-introduction {
    max-width: 500px !important;
    .game-intro {
      width: 100% !important;
      ::v-deep p img {
        width: 100% !important;
      }
      ::v-deep img {
        width: 100% !important;
      }
      ::v-deep .bb_ul {
        width: 100% !important;
        li {
          padding: 0 !important;
          list-style: none !important;
          img {
            height: 10px !important;
            width: 10px !important;
          }
        }
      }
    }
  }
  .top-detail {
    flex-direction: column !important;
    align-items: center !important;
    max-width: 500px !important;
  }

  .wheelCastingUnit-container {
    width: 500px !important;
  }
}
</style>