<!-- 我的大尺寸下的游戏详情 -->
<template>
  <div
    class="flex items-center h-full w-full"
    :class="
      runningGame.appid === largeDataDetail?.appid
        ? ' justify-between'
        : ' justify-center'
    "
  >
    <div class="flex flex-col" style="width: 400px">
      <div class="w-full mb-4" style="height: 188px">
        <img
          class="rounded-lg"
          style="width: 100%; height: 100%; object-fit: cover"
          :src="getGameImg"
          alt=""
        />
        <div
          class="in-run"
          v-if="runningGame?.appid === largeDataDetail?.appid"
        >
          正在运行
        </div>
      </div>

      <span class="truncate px-1 mb-2 font-16 xt-font" style="max-width: 180px">
        {{ largeDataDetail?.name }}
      </span>

      <div class="large-container mb-4">
        <span class="xt-text-2 font-14">
          最近游玩 : {{ getDateMyTime(largeDataDetail?.time) }}
        </span>
        <span class="xt-text-2 font-14">
          M站评分 :
          {{
            largeDataDetail?.metacritic_score
              ? largeDataDetail?.metacritic_score
              : "-"
          }}
        </span>
        <span class="xt-text-2 font-14">
          过去两周 : {{ twoWeekTime(largeDataDetail?.time) }} 小时
        </span>
        <span class="xt-text-2 font-14">
          总数 : {{ totalTime(largeDataDetail?.time) }} 小时
        </span>
      </div>

      <div class="flex items-center justify-between w-full">
        <!-- 返回按钮 -->
        <xt-button w="40" h="40" :radius="8" @click="backMyGame" class="mr-3">
          <div class="flex items-center justify-center">
            <xt-ify-icon
              icon="fluent:chevron-left-16-regular"
              size="20"
              class="xt-text"
            />
          </div>
        </xt-button>

        <xt-button
          w="185"
          h="40"
          :radius="8"
          v-if="runningGame.appid !== largeDataDetail?.appid"
          @click="startGame"
          class="mr-3"
          style="background: rgba(82, 196, 26, 1)"
        >
          <div class="flex items-center justify-center">
            <xt-ify-icon
              icon="fluent:play-16-filled"
              size="20"
              class="xt-text mr-3"
            />
            <span class="xt-text">开始游戏</span>
          </div>
        </xt-button>

        <xt-button
          w="185"
          h="40"
          :radius="8"
          @click="closeGame"
          class="mr-3"
          type="theme"
          v-else-if="runningGame.appid === largeDataDetail?.appid"
        >
          <div class="flex items-center justify-center">
            <xt-ify-icon
              icon="fluent:play-16-filled"
              size="20"
              class="xt-text mr-3"
            />
            <span class="xt-text">关闭游戏</span>
          </div>
        </xt-button>

        <xt-button w="185" h="40" :radius="8" @click="enterGameGuide">
          <div class="flex items-center justify-center">
            <xt-ify-icon
              icon="akar-icons:trophy"
              size="16"
              class="xt-text mr-2"
            />
            <span class="xt-text">游戏攻略</span>
          </div>
        </xt-button>
      </div>
    </div>

    <!-- 游戏运行情况下 -->
    <template v-if="runningGame.appid === largeDataDetail?.appid">
      <div
        style="background: var(--divider); width: 1px"
        class="h-full mx-4"
      ></div>

      <div class="flex flex-1 flex-col">
        <!-- FPS -->
        <div
          class="large-cpu xt-bg-2 rounded-xl flex items-center justify-center"
        >
          <div class="flex flex-col items-center justify-center">
            <span class="font-30 xt-font font-600">
              {{ gameCPU?.FPS }}
            </span>
            <div class="flex items-center justify-center">
              <xt-ify-icon
                icon="fluent:games-16-filled"
                size="16"
                class="xt-text mr-2"
              />
              <span class="font-16 xt-font xt-text font-500">FPS</span>
            </div>
          </div>
        </div>

        <!-- CPU -->
        <div
          class="large-cpu xt-bg-2 rounded-xl flex items-center justify-center"
        >
          <div class="flex flex-col items-center justify-center">
            <div class="flex items-center justify-center">
              <span class="font-30 xt-font font-600 mr-0.5">
                {{ gameCPU?.useCPU }}
              </span>
              <span class="font-24">%</span>
            </div>

            <div class="flex items-center justify-center">
              <xt-ify-icon
                icon="heroicons:cpu-chip-16-solid"
                size="16"
                class="xt-text mr-2"
              />
              <span class="font-16 xt-font xt-text font-500">CPU</span>
            </div>
          </div>
        </div>

        <!-- GPU -->
        <div
          class="large-cpu xt-bg-2 rounded-xl flex items-center justify-center"
        >
          <div class="flex flex-col items-center justify-center">
            <span class="font-30 xt-font font-600">
              {{ gameCPU?.useGPU }}
            </span>
            <div class="flex items-center justify-center">
              <xt-ify-icon
                icon="gravity-ui:gpu"
                size="16"
                class="xt-text mr-2"
              />
              <span class="font-16 xt-font xt-text font-500">GPU</span>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, toRefs, computed } from "vue";
import { storeToRefs } from "pinia";
import { steamUserStore } from "../../../../store/steamUser";
import { getDateTime } from "../../../../util";
import { inspectorStore } from "../../../../store/inspector";
import { gameGuideStore } from "../../../../page/gameAssistant/store/gameGuideStore";
import { useRouter } from "vue-router";

const router = useRouter();

// 解构store数据
const { detailVisible, runningGame, searchWords } = storeToRefs(
  steamUserStore()
);
const { displayData } = storeToRefs(inspectorStore());
const { gameAppId } = storeToRefs(gameGuideStore())

const props = defineProps({
  // 指定我的游戏详情
  largeDataDetail: {
    type: Object,
    default: () => {},
  },
});

const { largeDataDetail } = toRefs(props);

// 返回我的游戏组件首页
const backMyGame = () => {
  detailVisible.value = false;
};

// 获取游戏详情图片
const getGameImg = computed(() => {
  if (largeDataDetail.value) {
    return `https://cdn.cloudflare.steamstatic.com/steam/apps/${largeDataDetail.value?.appid}/header.jpg`;
  } else {
    return null;
  }
});

const gameCPU = computed(() => {
  return displayData.value;
});

// 过去两周的时长
const twoWeekTime = (time) => {
  return time ? (time?.playtime_2weeks / 60).toFixed(1) : 0;
};
// 总数时长
const totalTime = (time) => {
  return time ? (time?.playtime_forever / 60).toFixed(1) : 0;
};
// 最近游玩时长
const getDateMyTime = (time) => {
  if (time) {
    const timer = getDateTime(
      new Date(parseInt(time?.rtime_last_played) * 1000)
    );
    return time?.rtime_last_played !== 0
      ? timer?.month + "月" + timer?.day + "日"
      : "0";
  } else {
    return 0;
  }
};

// 关闭游戏
const closeGame = () => {
  steamUserStore().stopGame(largeDataDetail.value);
};
// 开始游戏
const startGame = () => {
  steamUserStore().playGame(largeDataDetail.value);
};

// 进入游戏攻略
const enterGameGuide = () => {
  searchWords.value[largeDataDetail.value.appid] = {
    text: largeDataDetail.value?.name,
    video: largeDataDetail.value?.name,
  };
  gameAppId.value = largeDataDetail.value.appid;
  router.push({
    name: "gameIntroduction",
  });
};
</script>

<style lang="scss" scoped>
.large {
  &-container {
    display: grid;
    /* 指定每行显示四列，每列平均分配剩余空间 */
    grid-template-columns: repeat(2, 1fr);
    /* 设置列与列之间的间隔 */
    gap: 16px;
  }
  &-cpu {
    width: 111px;
    height: 111px;
    margin-bottom: 15px;
    &:last-of-type {
      margin-bottom: 0 !important;
    }
  }
}
</style>