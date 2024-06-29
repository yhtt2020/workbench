<template>
  <div class="flex w-full flex-col px-4 h-full">
    <div class="flex mb-4">
      <!-- 切换游戏 -->
      <div class="game-select mr-2">
        <a-select
          style="border: 1px solid rgba(255, 255, 255, 0.1)"
          v-model:value="currentSearchName"
          class="w-60 h-10 rounded-lg mr-3 text-xs s-bg"
          size="large"
          :bordered="false"
          @change="getCurrentGame"
        >
          <a-select-option v-for="item in tabGameList" :value="item.name">
            {{ item.chineseName }}
          </a-select-option>
        </a-select>
      </div>

      <!-- 游戏攻略类型切换 -->
      <xt-option-tab
        :list="guideTypeList"
        :circle="false"
        style="
          height: 40px;
          width: 240px;
          background: var(--secondary-bg) !important;
          margin-bottom: 0 !important;
        "
        v-model="selectType"
      />

      <!-- 搜索按钮 -->
      <xt-button
        w="40"
        h="40"
        :radius="8"
        @click="openDrawer('search')"
        class="mx-2"
      >
        <div class="flex items-center justify-center">
          <xt-ify-icon icon="fluent:search-16-filled" size="20" />
        </div>
      </xt-button>

      <!-- 查看官网信息按钮 -->
      <xt-button w="40" h="40" :radius="8" @click="openDrawer('tip')">
        <div class="flex items-center justify-center">
          <xt-ify-icon icon="mingcute:warning-fill" size="20" />
        </div>
      </xt-button>
    </div>
    <div
      class="flex xt-bg-t-2 w-full rounded-xl items-center justify-center"
      style="height: calc(100vh - 10rem)"
    >
       <template v-if="selectType === 'video'">
          <GameGuideVideo :gameName="currentSearchName"/>
       </template>

       
       <template v-else-if="selectType === 'text'">
          <GameGuideImgText :gameName="currentSearchName"/>
       </template>
    </div>
  </div>

  <a-drawer :width="500" v-model:visible="drawerVisible" placement="right">
    <!-- 标题 -->
    <template #title>
      <template v-if="drawerType && drawerType === 'search'">
        <span class="text-center">搜索</span>
      </template>
      <template v-else-if="drawerType && drawerType === 'tip'">
        <span class="text-center">说明</span>
      </template>
    </template>

    <template v-if="drawerType && drawerType === 'search'">
      <GameGuideSearch :searchVal="currentSearchName" />
    </template>

    <template v-else-if="drawerType && drawerType === 'tip'">
      <GameGuideFromInfo />
    </template>
  </a-drawer>
</template>

<script>
import { ref, computed } from "vue";
import { steamUserStore } from "../../store/steamUser";
import { mapActions, mapState, mapWritableState } from "pinia";
import { gameGuideStore } from "./store/gameGuideStore";

import GameGuideSearch from "./components/gameGuide/GameGuideSearch.vue";
import GameGuideFromInfo from "./components/gameGuide/GameGuideFromInfo.vue";
import GameGuideVideo from './components/gameGuide/GameGuideVideo.vue';
import GameGuideImgText from "./components/gameGuide/GameGuideImgText.vue";

export default {
  name: "GameIntroduction",

  components: {
    GameGuideSearch,
    GameGuideFromInfo,
    GameGuideVideo,
    GameGuideImgText
  },

  data() {
    return {
      // 游戏攻略视频和文章的切换tab列表
      guideTypeList: [
        { name: "视频攻略", value: "video" },
        { name: "图文攻略", value: "text" },
      ],

      // 是否开启右侧抽屉弹窗
      drawerVisible: false,
      // 右侧抽屉弹窗类型
      drawerType: "",

      // 视频和图文攻略类型默认参数
      selectType: "video",

      // 当前游戏
      currentGame: {
        name: "副屏",
        appid: "0",
        chineseName: "",
      },
    };
  },

  computed: {
    ...mapWritableState(steamUserStore, ["searchWords"]),
    ...mapState(steamUserStore, ["recentGameList", "runningGame"]),
    ...mapWritableState(gameGuideStore, ["gameAppId"]),

    // 游戏下拉切换列表
    tabGameList() {
      return [
        {
          appid: "0",
          name: "自由搜索",
          chineseName: "自由搜索",
        },
        ...this.recentGameList,
      ];
    },

    // 当前选中游戏
    currentSelectGame: {
      get() {
        if (this.currentGame.appid === "0") {
          return this.customSearchWords;
        }
        return this.searchWords[this.currentGame.appid];
      },
      set(val) {
        if (this.currentGame.appid === "0") {
          return this.customSearchWords;
        }
        this.searchWords[this.currentGame.appid] = val;
      },
    },
    currentSearchName(){
      if(this.gameAppId){
        return this.searchWords[this.gameAppId]?.text;
      }
      else {
        return this.currentGame.name
      }
    }
  },

  mounted() {
  
  },

  methods: {
    // 开启搜索右侧弹窗
    openDrawer(type) {
      this.drawerVisible = true;
      this.drawerType = type;
    },

    // 获取下拉菜单选中的游戏
    getCurrentGame(evt) {
      // this.gameAppId = evt;
      // this.currentSearchName = this.searchWords[evt]?.text;
    },

    

  },
};
</script>

<style lang="scss" scoped>
</style>