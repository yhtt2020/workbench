<!-- 我的游戏小尺寸页面 -->
<template>
  <template v-if="!smallDetailVisible">
    <!-- steam游戏 -->
    <template v-if="gameClass === 'steam'">
      <div class="mt-2 flex flex-col h-full">
        <template v-if="mySteamGameList?.length !== 0">
          <template
            v-for="(item, index) in mySteamGameList?.slice(0, 2)"
            :key="index"
          >
            <div
              class="flex flex-col xt-bg-t-2 rounded-t-lg pointer mb-4"
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
        </template>
        <!-- 其他游戏 -->

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
      </div>
    </template>
    <template v-else-if="gameClass === 'other'">
      <template v-if="myOtherGameList?.length !== 0">
        <div class="my-game-container">
          <template
            v-for="(item, index) in myOtherGameList?.slice(0, 3)"
            :key="index"
          >
            <div @click="openGame(item)" class="flex flex-col mb-3 xt-bg-t-2 rounded-lg pointer item-content ">
              <div class="pt-3 item-content">
                <a-avatar :radius="12" shape="square" :size="55" :src="item.icon"></a-avatar>
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

  <!-- 游戏详情 -->
  <template v-else>
    <MyGameSmallDetail :mySmallDetailItem="smallGameDetail"/>
  </template>
</template>

<script setup>
import { ref, toRefs ,defineEmits} from "vue";
import { storeToRefs } from "pinia";
import { steamUserStore } from "../../../../store/steamUser";
import { gameDetailStore } from "../store/gameDetailStore";
import { useRouter } from "vue-router";

import MyGameSmallDetail from "./MyGameSmallDetail.vue";
import {message} from "ant-design-vue";

const router = useRouter();

// 解构store数据
const { smallDetailVisible } = storeToRefs(steamUserStore());
const { smallGameDetail } = storeToRefs(gameDetailStore());
const emits=defineEmits(['import'])
const openLocal=()=>{
  emits('import')
}
const props = defineProps({
  // 区分游戏类型是steam还是other
  gameClass: {
    type: String,
  },
  // 我的steam游戏列表
  mySteamGameList: {},
  myOtherGameList: {
    type: Array,
    default: () => [],
  },
});
const { gameClass } = toRefs(props);
const openGame=(item)=>{
  message.success('正在启动游戏 '+item.name)
  require("electron").shell.openPath(item.path);
}

const mySmallDetail = ref({})

// 进入游戏详情
const enterMyGameDetail = (data) => {
  smallDetailVisible.value = true;
  smallGameDetail.value = data;
};

// 进入我的游戏应用
const enterMyGame = () =>{
  router.push({ name: "myGame" });
}
</script>

<style lang="scss" scoped>
</style>
