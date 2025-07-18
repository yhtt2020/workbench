<!-- 游戏攻略视频 -->
<template>
  <template v-if="loadingVisible === true">
    <div class="flex items-center justify-center w-full h-full">
      <a-spin />
    </div>
  </template>

  <xt-scrollbar
    class="flex-1 w-full h-full overflow-hidden"
    :x="false"
    :y="true"
    v-else
  >
    <div class="flex flex-row flex-wrap pt-4 pr-4">
      <template v-for="(item, index) in videoList" :key="index">
        <div
          class="pb-4 pl-4 game-list-item flex-shrink-0 pointer"
          @click="openUrl(item.arcurl)"
        >
          <div class="relative flex flex-col mb-2">
            <!-- 图片 -->
            <div style="height: 65.5%" class="rounded-lg">
              <img
                :src="`${getVideoCover(item.pic)}`"
                class="w-full h-full rounded-lg object-cover"
                alt=""
              />
            </div>

            <!-- 播放量 -->
            <div
              class="bfl px-2 mb-1 flex justify-between w-full"
              style="position: absolute; bottom: 8px; left: 2px"
            >
              <div class="flex">
                <div class="flex items-center">
                  <xt-ify-icon icon="bi:play-btn-fill" class="xt-text" />
                  <span class="ml-1 xt-text">
                    {{
                      item.play?.toString()?.slice(0, 2) +
                      "." +
                      item.play?.toString()?.slice(0, 4)?.slice(3)
                    }}万
                  </span>
                </div>
                <div class="flex items-center mx-3">
                  <xt-ify-icon icon="clarity:details-solid" class="xt-text" />
                  <span class="ml-1 xt-text">{{ item.video_review }}</span>
                </div>
              </div>
              <div class="xt-text">{{ item.duration }}</div>
            </div>
          </div>

          <div
            class="text-white mb-2 px-1 pointer my-primary-title"
            @click="openUrl(item.arcurl)"
            style="
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 1;
            "
          >
            {{ getSummary(item) }}
          </div>

          <div class="flex px-2 items-center">
            <span
              class="xt-text-2 font-12 font-400 mr-3 truncate"
              style="max-width: 120px"
            >
              {{ item.author }}
            </span>
            <span class="xt-text-2 font-12 font-400">
              {{ changeTime(item.senddate) }}
            </span>
          </div>
        </div>
      </template>
    </div>
    <div style="height: 70px"></div>
  </xt-scrollbar>
</template>

<script>
import { GetBiliData } from "../../hooks/getGameGuideDetail";
import { fixHttp } from "../../../../util";
import browser from "../../../../js/common/browser";

export default {
  name: "GameGuideVideo",

  props: {
    gameName: {
      type: String,
    },
  },

  data() {
    return {
      // 视频列表
      videoList: [],
      // 加载状态
      loadingVisible: false,
    };
  },

  mounted() {
    this.$nextTick(() => {
      this.getVideoList(this.gameName);
    });
    this.$bus.on("updateGameGuide", (name) => {
      this.getVideoList(name);
    });
  },

  methods: {
    // 获取bi站视频列表
    getVideoList(name) {
      if (!this.loadingVisible) {
        this.loadingVisible = true;
        new GetBiliData()
          .biliSearch(name)
          .then((rs) => {
            if (rs?.status === 200) {
              this.loadingVisible = false;
              const { data } = rs?.data;
              const { video } = data?.result;
              this.videoList = video;
            }
          })
          .finally(() => {
            this.loadingVisible = false;
          });
      }
    },

    // 将图片转换
    getVideoCover(url) {
      return fixHttp(url + "@320w_200h");
    },

    // 获取描述
    getSummary(item) {
      return item?.title.replace(/<em[^>]*>/g, "").replace(/<\/em>/g, "");
    },

    // 日期转换
    changeTime(newDate) {
      const nowTime = new Date(parseInt(newDate) * 1000);
      return nowTime.toLocaleDateString();
    },

    // 查看bi站视频详情
    openUrl(url) {
      browser.openInUserSelect(url);
    },
  },
};
</script>

<style lang="scss" scoped>
.game {
  &-list-item {
    aspect-ratio: 231/200;
    max-width: 340px;
  }

  @media screen and (max-width: 940px) {
    &-list-item {
      width: calc(100% / 2);
    }
  }

  @media screen and (min-width: 1140px) and (max-width: 1340px) {
    &-list-item {
      width: calc(100% / 3);
    }
  }

  @media screen and (min-width: 1140px) and (max-width: 1340px) {
    &-list-item {
      width: calc(100% / 4);
    }
  }

  @media screen and (min-width: 1340px) and (max-width: 1540px) {
    &-list-item {
      width: calc(100% / 5);
    }
  }

  @media screen and (min-width: 1540px) and (max-width: 1740px) {
    &-list-item {
      width: calc(100% / 6);
    }
  }

  @media screen and (min-width: 1740px) and (max-width: 1940px) {
    &-list-item {
      width: calc(100% / 7);
    }
  }

  @media screen and (min-width: 1940px) and (max-width: 2140px) {
    &-list-item {
      width: calc(100% / 8);
    }
  }

  @media screen and (min-width: 2140px) and (max-width: 2340px) {
    &-list-item {
      width: calc(100% / 9);
    }
  }

  @media screen and (min-width: 2340px) and (max-width: 2540px) {
    &-list-item {
      width: calc(100% / 10);
    }
  }

  @media screen and (min-width: 2540px) and (max-width: 2740px) {
    &-list-item {
      width: calc(100% / 11);
    }
  }

  @media screen and (min-width: 2740px) and (max-width: 2940px) {
    &-list-item {
      width: calc(100% / 12);
    }
  }
}
</style>


