<!-- 我的游戏小尺寸详情 -->
<template>
  <div class="mt-3">
    <div class="flex items-center justify-center flex-col w-full">
      <div class="relative" style="height: 120px; width: 252px" v-if="getGameImg !== null">
        <img
          class="rounded-lg"
          style="width: 100%; height: 100%; object-fit: cover"
          :src="getGameImg"
          alt=""
        />
        <div
          class="in-run"
          v-if="runningGame.appid === mySmallDetailItem?.appid"
        >
          正在运行
        </div>
      </div>

      <span class="truncate mt-2 mb-2" style="max-width: 180px">
        {{ mySmallDetailItem?.name }}
      </span>

      <div class="flex flex-col mb-2">
        <span class="flex items-center mb-1.5 justify-center last-time">
          最近游玩 : {{ getDateMyTime(mySmallDetailItem?.time) }}
        </span>
        <span class="flex items-center mb-1.5 justify-center last-time">
          过去两周 : {{ twoWeekTime(mySmallDetailItem?.time) }} 小时
        </span>
        <span class="flex items-center mb-1.5 justify-center last-time">
          总数 : {{ totalTime(mySmallDetailItem?.time) }} 小时
        </span>
      </div>

      <div class="flex items-center justify-between w-full mb-3">
        <xt-button w="40" h="40" :radius="8" @click="backMyGame">
          <div class="flex items-center justify-center">
            <xt-ify-icon
              icon="fluent:chevron-left-16-filled"
              size="20"
              class="xt-text"
            />
          </div>
        </xt-button>
        <xt-button w="194" h="40" :radius="8" @click="enterGameGuide">
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

      <template v-if="runningGame.appid !== mySmallDetailItem?.appid">
        <xt-button
          w="250"
          h="40"
          :radius="8"
          style="background: rgba(82, 196, 26, 1)"
          @click="startGame"
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
      </template>

      <template v-else>
        <xt-button w="250" h="40" :radius="8" @click="closeGame" type="theme">
          <div class="flex items-center justify-center">
            <xt-ify-icon
              icon="fluent:dismiss-16-filled"
              size="20"
              class="xt-text mr-2"
            />
            <span class="xt-text">关闭游戏</span>
          </div>
        </xt-button>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, toRefs,computed, onUnmounted } from "vue";
import { storeToRefs } from "pinia";
import { steamUserStore } from "../../../../store/steamUser";
import { getDateTime } from "../../../../util";
import { gameGuideStore } from "../../../../page/gameAssistant/store/gameGuideStore";
import { useRouter } from "vue-router";

// 解构store数据
const { smallDetailVisible, searchWords, runningGame } = storeToRefs(
  steamUserStore()
);
const { gameAppId } = storeToRefs(gameGuideStore())

const emit = defineEmits(['close']);

const router = useRouter();

const props = defineProps({
  mySmallDetailItem: {
    type: Object,
    default: () => {},
  },
});
const { mySmallDetailItem } = toRefs(props);

// 返回游戏首页
const backMyGame = () => {
  smallDetailVisible.value = false;
};

// 时间转换
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

// 两周内的时间转换
const twoWeekTime = (time) => {
  return time ? (time.playtime_2weeks / 60).toFixed(1) : 0;
};
// 游戏游玩总时长
const totalTime = (time) => {
  return time ? (time.playtime_forever / 60).toFixed(1) : 0;
};

// 进入游戏攻略
const enterGameGuide = () => {
  searchWords.value[mySmallDetailItem.value.appid] = {
    text: mySmallDetailItem.value?.name,
    video: mySmallDetailItem.value?.name,
  };
  gameAppId.value = mySmallDetailItem.value.appid;
  router.push({
    name: "gameIntroduction",
  });
};

// 开始游戏
const startGame = () => {
  steamUserStore().playGame(mySmallDetailItem.value);
};
// 关闭游戏
const closeGame = () => {
  steamUserStore().stopGame(mySmallDetailItem.value);
};

// 获取图片
const getGameImg = computed(()=>{
  if(mySmallDetailItem.value){
   return `https://cdn.cloudflare.steamstatic.com/steam/apps/${mySmallDetailItem.value?.appid}/header.jpg`
  }
  else {
   return null
  }
})

onUnmounted(()=>{
 emit('close')
})
</script>

<style lang="scss" scoped>
.in {
  &-run {
    position: absolute;
    top: 7px;
    right: 10px;
    background: rgba(82, 196, 26, 1);
    border-radius: 4px;
    padding: 3px 6px;
    font-size: 14px;
    color: rgba(255, 255, 255, 0.85);
    font-weight: 500;
  }
}
</style>