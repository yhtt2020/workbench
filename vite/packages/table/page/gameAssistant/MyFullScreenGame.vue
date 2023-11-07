<template>
  <div class="pt-3 drag">
    <Vue3SeamlessScroll :list="displayGame" v-model="isScrolling" :copyNum="2" :hover="true" :wheel="true">
      <div class="flex no-drag flex-row rounded-lg flex-wrap mr-4">
        <div class="pb-4 pl-4 game-list-item rounded-lg flex-shrink-0 my-game-content" v-for=" item in displayGame ">
          <div class="relative  w-auto h-full rounded-lg my-bg   flex flex-col ">
            <div :style="showTime?'height: calc(100% - 96px)':'height: calc(100% - 50px)'">
              <img :src="'https://cdn.cloudflare.steamstatic.com/steam/apps/'+item.appid+'/header.jpg'"
                   class="w-full h-full rounded-t-lg object-cover" alt="">
            </div>
            <div :style="showTime?'height: 96px':'height: 50px'" class="p-3 flex flex-col justify-between ">
              <span class="text-more text-white text-base my-title"
                    style="font-weight: 400">{{ item.chineseName }}</span>
              <span :style="showTime?'':'display:none'" class="text-xs">过去两周：{{ twoWeekTime(item.time) }}小时</span>
              <span :style="showTime?'':'display:none'" class="text-xs">总数：{{ totalTime(item.time) }}小时</span>
            </div>
          </div>
        </div>
      </div>
    </Vue3SeamlessScroll>
    <div class="set-button flex no-drag">
      <div @click="stopScroll" style="background: var(--secondary-bg);color:var(--secondary-text);"
           class="set-button-item my-bg  rounded-lg pointer mr-3">
        <Icon icon="bofang" v-if="isScrolling  === false"></Icon>
        <Icon icon="pause" v-else></Icon>
      </div>
      <div @click="openSheZhi" style="background: var(--secondary-bg);color:var(--secondary-text);"
           class="set-button-item my-bg rounded-lg pointer mr-3">
        <Icon icon="shezhi"></Icon>
      </div>
      <div @click="closeFullScreen" style="background: var(--secondary-bg);color:var(--secondary-text);"
           class="set-button-item  rounded-lg pointer">
        <Icon icon="quxiaoquanping_huaban" style=""></Icon>
      </div>
    </div>
  </div>

  <a-drawer class="no-drag" v-model:visible="screenVisible" title="设置" :width="500">
    <div class="flex justify-between mb-4">
      <span>显示游戏时长</span>
      <a-switch v-model:checked="showTime"/>
    </div>

    <!-- 该功能暂时没有合适方法,后期再补充 -->
    <!-- <div class="flex justify-between flex-col mb-4">
      <span>缩放比</span>
      <a-slider v-model:value="scaleValue"  />
    </div> -->
    <div class="mb-4">排序方式</div>
    <div class="flex flex-col">
      <div v-for="item in sortList" @click="tabSort(item)"
           :class="sortType.name === item.name ? 'xt-active-bg active-text':''"
           class="w-full h-full rounded-lg my-full-active pointer px-4 py-4 my-bg flex justify-center mb-4">
        {{ item.title }}
      </div>
    </div>
  </a-drawer>
</template>

<script>
import { mapWritableState } from 'pinia'
import { steamUserStore } from '../../store/steamUser'
import HorizontalPanel from '../../components/HorizontalPanel.vue'
import { Vue3SeamlessScroll } from 'vue3-seamless-scroll'
import { appStore } from '../../store'
import { isHide } from './game'

export default {
  name: 'MyFullScreenGame',
  components: {
    HorizontalPanel,
    Vue3SeamlessScroll
  },
  data () {
    return {
      settingsScroller: {
        useBothWheelAxes: true,
        swipeEasing: true,
        suppressScrollY: false,
        suppressScrollX: true,
        wheelPropagation: true
      },
      showTime: true,
      screenVisible: false,
      sortList: [{ title: '最近游玩', name: 'timer' }, { title: 'A-Z', name: 'letter' }],
      sortType: { title: '最近游玩', name: 'timer' },
      isScrolling: false,
      //screenList:[],
      // scaleValue:15,  // 暂时没有合适方法,后期补充
    }
  },

  mounted () {
    //this.screenList = this.gameList
    this.isScrolling = true
  },

  computed: {
    ...mapWritableState(steamUserStore, ['steamGameList', 'localGameList']),
    ...mapWritableState(steamUserStore,{
      gameSettings:'settings'
    }),
    ...mapWritableState(appStore, ['settings']),
    displayGame () {
      const filtered = this.steamGameList.filter(game => {
        return !isHide('steam', game.appid)
      })
      if (this.sortType.name === 'letter') {
        filtered.sort((a, b) => a.name.localeCompare(b.name))
      } else {
        filtered.sort((a, b) => {
          if (a.time === undefined && a.time === undefined) {
            return 0
          } else if (a.time === undefined) {
            return 1
          } else if (b.time === undefined) {
            return -1
          } else if (a.time !== b.time) {
            return b.time.rtime_last_played - a.time.rtime_last_played
          }
        })
      }

      return filtered
    }
  },
  methods: {
    closeFullScreen () {
      this.$emit('close')
      this.isScrolling = false
    },
    twoWeekTime (time) {
      return time ? (time.playtime_2weeks / 60).toFixed(1) : 0
    },
    totalTime (time) {
      return time ? (time.playtime_forever / 60).toFixed(1) : 0
    },
    openSheZhi () {
      this.screenVisible = true
    },
    stopScroll () {
      this.isScrolling = !this.isScrolling
    },
    tabSort (item) {
      this.sortType = item
      this.screenVisible = false
    }
  },
}
</script>

<style lang="scss" scoped>
.my-full-active {
  &:active {
    filter: brightness(0.8);
    opacity: 0.8;
  }

  &:hover {
    opacity: 0.8;
  }
}

.active-text {
  color: var(--active-text);
}

.my-bg {
  background: var(--secondary-bg);
}

.text-xs {
  color: var(--secondary-text);
}

.my-title {
  font-size: 16px;
  color: var(--primary-text);
  font-weight: 600;
}

.my-game-content {
  transform-style: preserve-3d;
  perspective: 1000px;
}

.fly {
  animation: fly .5s;
  animation-fill-mode: forwards;
  transform-origin: 50% 0 10px;
}

@keyframes fly {
  0% {

  }
  100% {
    transform: rotateX(5deg) translateZ(20px);
  }
}

@media screen and (max-width: 1064px) {
  .main-nav {
    display: none;
  }
  .select-main-nav {
    display: block;
  }
}

.game-list-item {
  max-width: 404px;
}

.game-list-local {
  max-width: 300px;
  aspect-ratio: 231/300;
}

@media screen and (max-width: 840px) {
  .game-list-item {
    width: calc(100% / 2);
  }
  .game-list-local {
    width: calc(100% / 3);
  }
}

@media screen and (min-width: 840px) and (max-width: 1140px) {
  .game-list-item {
    width: calc(100% / 3);
  }
  .game-list-local {
    width: calc(100% / 4);
  }
}

@media screen and (min-width: 1140px) and (max-width: 1440px) {
  .game-list-item {
    width: calc(100% / 4);
  }
  .game-list-local {
    width: calc(100% / 5);
  }
}

@media screen and (min-width: 1440px) and (max-width: 1740px) {
  .game-list-item {
    width: calc(100% / 5);
  }
  .game-list-local {
    width: calc(100% / 6);
  }
}

@media screen and (min-width: 1740px) and (max-width: 2040px) {
  .game-list-item {
    width: calc(100% / 6);
  }
  .game-list-local {
    width: calc(100% / 7);
  }
}

@media screen and (min-width: 2040px) and (max-width: 2340px) {
  .game-list-item {
    width: calc(100% / 7);
  }
  .game-list-local {
    width: calc(100% / 8);
  }
}

@media screen and (min-width: 2340px) and (max-width: 2640px) {
  .game-list-item {
    width: calc(100% / 8);
  }
  .game-list-local {
    width: calc(100% / 9);
  }
}

@media screen and (min-width: 2640px) and (max-width: 2940px) {
  .game-list-item {
    width: calc(100% / 9);
  }
}

@media screen and (min-width: 2940px) and (max-width: 3240px) {
  .game-list-item {
    width: calc(100% / 10);
  }
}

@media screen and (min-width: 3240px) and (max-width: 3540px) {
  .game-list-item {
    width: calc(100% / 11);
  }
}

@media screen and (min-width: 3540px) and (max-width: 3840px) {
  .game-list-item {
    width: calc(100% / 12);
  }
}

.set-button {
  position: fixed;
  bottom: 18px;
  right: 18px;
}

.set-button-item {
  font-size: 2em;
  padding: 6px 14px;
}


:deep(.ant-slider-handle) {
  background: rgba(255, 255, 255, 0.85) !important;
  border-color: rgba(151, 151, 151, 1) !important;
}

:deep(.ant-slider-rail) {
  background: rgba(255, 255, 255, 0.4) !important;
}

:deep(.ant-slider-track) {
  // background: linear-gradient(90deg, rgba(98, 193, 255, 1) 0%, rgba(51, 141, 255, 1) 100%) !important;
}
</style>
