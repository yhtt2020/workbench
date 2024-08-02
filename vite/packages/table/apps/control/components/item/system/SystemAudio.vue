<!-- 音频播放页 -->
<template>
  <!-- 音乐播放器 -->
  <div
    class="xt-bg-t-2 w-full rounded-lg mb-3 volume-play flex items-center justify-between"
    style="padding: 0 22px; height: 54px;"
  >
    <div v-for="item in updateList">
      <xt-button style="width: auto !important;" h="0" @click="item.fn">
        <div class="flex items-center justify-center">
          <xt-ify-icon
            :icon="item.icon"
            :size="item.size || 24"
            :style="{ color: item.color }"
          />
        </div>
      </xt-button>
    </div>
  </div>
  <!-- 音量调节 -->
  <div
    @touchstart="setting = true"
    @touchmove="syncProgressBar"
    @touchend="setVolume"
    @click="setVolume"
    @mousemove="syncProgressBar"
    @mousedown="setting = true"
    @mouseup="setVolume"
    class="xt-bg-t-2 w-full flex items-center volume-content justify-between rounded-lg pointer"
    style="height: 54px;"
  >
    <div
      class="rounded-tl-lg rounded-bl-lg"
      :style="{ width: ((defaultOutput.volume / 100) * 258).toFixed(0) + 'px' }"
      style="height: 52px; background: rgba(255, 255, 255, 0.85)"
    ></div>
    <div class="pr-4">
      <xt-button
        @mousedown.stop
        @mousemove.stop
        @mouseup.stop
        @click="setMuted(!mute)"
        @touchend.stop
        @touchstart.stop
        @touchmove.stop
        style="width: auto"
        h="0"
      >
        <div class="flex items-center justify-center">
          <xt-ify-icon
            v-if="!mute"
            icon="fluent:speaker-2-16-regular"
            size="24"
            class="xt-text-2"
          />
          <xt-ify-icon
            v-else
            icon="fluent:speaker-mute-16-regular"
            size="24"
            class="xt-text-2"
          />
        </div>
      </xt-button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import {
  getDefaultVolume,
  setDefaultVolume,
} from "../../../../../js/ext/audio/audio";
import { appStore } from "../../../../../store";
import { storeToRefs } from "pinia";

const mute = ref(false);
const defaultOutput = ref({});
const setting = ref(false);
const props = defineProps({
  event: true,
  /**通过status属性来判断音乐播放器是否可以播放,以及音量是否可以调节**/
  status: {
    type: String,
    default: "null",
  },
});

const app = appStore();
const { status } = storeToRefs(app);

onMounted(async () => {
  if (!window.$usePlat('client')) return;
  defaultOutput.value = await getDefaultVolume();
  mute.value = defaultOutput.value.muted;
});
const play = () => {
  // 音乐的播放交互逻辑
  console.log(props.status,'props')
  if (props.status === "null") {
    window.$models.win32.sendKeyboard(0xb3,true);
  }
};
const lastSong = () => {
  console.log('上一首歌')
  // 做上一首音乐的播放交互逻辑
  if (props.status === "null") {
    window.$models.win32.sendKeyboard(0xb1,true);
  }
};
const setMuted = (muteValue, event) => {
  setDefaultVolume({
    muted: muteValue,
  });
  mute.value = muteValue;
  window.event.stopPropagation();
};
const nextSong = () => {
  // 做下一首音乐的播放交互逻辑
  console.log('下一首歌')
  if (props.status === "null") {
    window.$models.win32.sendKeyboard(0xb0,true);
  }
};

/**
 * 获取声控对应的位置
 * @param event
 * @returns {*}
 */
function getPosVal(event) {
  let val = 0;
  if (event.clientX) {
    val = event.clientX - event.target.getBoundingClientRect().x;
  } else {
    val =
      event.changedTouches[0].clientX - event.target.getBoundingClientRect().x;
  }
  return val;
}
const syncProgressBar = (event) => {
  if (setting.value) {
    console.log(getPosVal(event));
    defaultOutput.value.volume = Number(
      ((getPosVal(event) / 258) * 100).toFixed(2)
    );
  }
};
const setVolume = (event) => {
  let val = getPosVal(event);
  setting.value = false;
  setDefaultVolume({
    volume: +((val / 258) * 100).toFixed(2),
    muted: mute.value,
  });
  defaultOutput.value.volume = Number(((val / 258) * 100).toFixed(2));
};



const list = ref([
  {
    icon: "fluent:previous-16-filled",
    color: "var(--disable-text)",
    fn: () => {
      lastSong();
    },
  },
  {
    icon: "fluent:video-play-pause-20-filled",
    color: "var(--primary-text)",
    fn: () => {
      play();
    },
    size: 32,
  },
  {
    icon: "fluent:next-16-filled",
    color: "var(--disable-text)",
    fn: () => {
      nextSong();
    },
  },
]);

// icon: "fluent:pause-12-filled",

// 根据判断调整播放图标
const updateList = computed(() => {
  // if (status.value.music.playing) {
  //   list.value[1].icon = "fluent:pause-16-filled";
  // } else {
  //   list.value[1].icon = "fluent:play-16-filled";
  // }
  return list.value;
});
</script>

<style lang="scss" scoped>
.unPointer {
  pointer-events: none !important;
}

:deep(.xt-active) {
  &:focus-visible {
    outline: none !important;
  }
}
</style>
