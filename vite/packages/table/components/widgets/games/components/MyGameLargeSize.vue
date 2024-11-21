<!-- 我的游戏大尺寸页面 -->
<template>
  <template v-if="!detailVisible">
    <!-- steam游戏 -->
    <template v-if="gameClass === 'steam'">
      <template v-if="mySteamGameList?.length !== 0">
        <div class="my-game-container mt-4">
          <template
            v-for="(item, index) in mySteamGameList?.slice(0, 4)"
            :key="index"
          >
            <div
              class="flex flex-col xt-bg-t-2 rounded-t-lg pointer"
              @click="enterMyGameDetail(item)"
            >
              <div class="w-full my-game-img">
                <img
                  class="rounded-t-lg"
                  :src="`https://cdn.cloudflare.steamstatic.com/steam/apps/${item?.appid}/header.jpg`"
                  style="width: 100%; height: 100%; object-fit: cover"
                  alt=""
                />
              </div>
              <span class="w-full px-3 py-3 truncate" style="max-width: 207px">
                {{ item?.name }}
              </span>
            </div>
          </template>
        </div>
      </template>

      <template v-else>
        <div class="flex items-center justify-center flex-col h-full">
          <div class="flex items-center justify-center flex-col mb-4">
            <xt-ify-icon
              icon="fluent-emoji:magnifying-glass-tilted-right"
              class="mb-4"
              size="64"
            />
            <span class="xt-text-2 xt-font font-14">没有找到相关内容</span>
          </div>
          <xt-button
            :radius="8"
            type="theme"
            h="40"
            style="
              width: auto !important;
              padding-left: 16px;
              padding-right: 16px;
            "
            @click="enterMyGame"
          >
            立即添加
          </xt-button>
        </div>
      </template>
    </template>

    <!-- 其他游戏 -->
    <template v-else-if="gameClass === 'other'">
      <template v-if="myOtherGameList?.length !== 0">
        <div class="my-game-container">
          <template
            v-for="(item, index) in myOtherGameList?.slice(0, 6)"
            :key="index"
          >
            <div @click="openGame(item)" class="flex flex-col xt-bg-t-2 rounded-lg pointer item-content ">
              <div class="pt-3 item-content">
                <a-avatar :radius="12" shape="square" :size="50" :src="item.icon"></a-avatar>
              </div>
              <span class="w-full px-3 py-3 truncate text-center" >
                {{ item?.name }}
              </span>
            </div>
          </template>
        </div>
      </template>

      <template v-else>
        <div class="flex items-center justify-center flex-col h-full">
          <div class="flex items-center justify-center flex-col mb-4">
            <xt-ify-icon
              icon="fluent-emoji:magnifying-glass-tilted-right"
              class="mb-4"
              size="64"
            />
            <span class="xt-text-2 xt-font font-14">没有找到相关内容</span>
          </div>
          <xt-button
            :radius="8"
            type="theme"
            h="40"
            style="
              width: auto !important;
              padding-left: 16px;
              padding-right: 16px;
            "
            @click="openLocal"
          >
            导入外部游戏
          </xt-button>
        </div>
      </template>
    </template>
  </template>

  <template v-else>
    <MyGameLargeDetail :largeDataDetail="largeGameDetail" @close="detailVisible = false"/>
  </template>
</template>

<script setup>
import {ref, toRefs, onUnmounted, watch, defineEmits} from "vue";
import { storeToRefs } from "pinia";
import { steamUserStore } from "../../../../store/steamUser";
import { gameDetailStore } from "../store/gameDetailStore";
import { useRouter } from "vue-router";

import MyGameLargeDetail from "./MyGameLargeDetail.vue";
import {message} from "ant-design-vue";

const props = defineProps({
  // 游戏分类
  gameClass: {
    type: String,
  },
  // steam游戏列表
  mySteamGameList: {
    type: Array,
    default: () => [],
  },
  // 我的其他游戏列表
  myOtherGameList: {
    type: Array,
    default: () => [],
  },
});
const emits=defineEmits(['import'])
const openLocal=()=>{
  emits('import')
}
const { gameClass, mySteamGameList, myOtherGameList } = toRefs(props);

// 解构store数据
const { detailVisible } = storeToRefs(steamUserStore());
const { largeGameDetail } = storeToRefs(gameDetailStore());

const router = useRouter();

// 进入我的游戏详情
const enterMyGameDetail = (data) => {
  detailVisible.value = true;
  largeGameDetail.value = data;
};

// 进入我的游戏
const enterMyGame = () => {
  router.push({ name: "myGame" });
};

const openGame=(item)=>{
  message.success('正在启动游戏 '+item.name)
  require("electron").shell.openPath(item.path);
}
// 导入外部游戏

</script>

<style lang="scss" scoped>
.my {
  &-game-container {
    display: grid;
    /* 指定每行显示四列，每列平均分配剩余空间 */
    grid-template-columns: repeat(2, 1fr);
    /* 设置列与列之间的间隔 */
    gap: 16px;
  }
  &-game-img {
    height: 118px;
  }
}
</style>
