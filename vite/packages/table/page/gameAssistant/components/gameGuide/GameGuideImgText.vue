<!-- 游戏攻略图文 -->
<template>
  <xt-scrollbar
    class="flex-1 w-full h-full overflow-hidden"
    :x="false"
    :y="true"
  >
    <template v-if="imgTextList.length === 0">
      <div class="flex items-center h-full w-full justify-center flex-col">
        <xt-ify-icon
          icon="fluent-emoji:magnifying-glass-tilted-right"
          size="64"
          class="mb-4"
        />
        <span class="xt-text-2 xt-font font-14">没有找到相关内容</span>
      </div>
    </template>

    <div class="w-full flex flex-col" v-else>
      <template v-for="(item, index) in imgTextList" :key="index">
        <div
          class="h-14 mb-3 rounded-xl xt-bg-t-2 flex items-center px-4 pointer justify-between"
          @click="openUrl(item.url)"
        >
          <div class="round-dot mr-4 flex-shrink-0"></div>
          <span class="text-more inline-block xt-text-2">
            {{ item.summary }}
          </span>
          <span class="ml-auto flex-shrink-0 xt-text-2">
            {{ item.time }}
          </span>
        </div>
      </template>
    </div>
  </xt-scrollbar>
</template>
 
<script>
import { GetImgTextData } from "../../hooks/getGameGuideDetail";
import browser from "../../../../js/common/browser";

export default {
  name: "GameGuideImgText",
  props: {
    gameName: {
      type: String,
    },
  },

  data() {
    return {
      // 图文攻略的列表
      imgTextList: [],
    };
  },

  mounted() {
    this.$nextTick(() => {
      this.getGameImgTextData(this.gameName);
    });
    this.$bus.on("updateGameGuide", (name) => {
      this.getGameImgTextData(name);
    });
  },

  methods: {
    // 获取游戏图文攻略数据
    getGameImgTextData(name) {
      new GetImgTextData().imgTextSearch(name).then((rs) => {
        if (rs.status === 200) {
          this.imgTextList = rs?.data;
        }
      });
    },

    // 查看详情
    openUrl(url) {
      browser.openInSystem(url);
    },
  },

  unmounted() {
    this.$bus.off("updateGameGuide");
  },
};
</script>
 
 <style lang="scss" scoped>
</style>