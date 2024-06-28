<template>
  <div class="px-4 flex flex-col items-center justify-center">
    <div class="mb-4">
      视频攻略数据均来自「Bilibili」，本应用不提供任何攻略数据
    </div>
    <xt-button :radius="8" w="150" h="40" @click="goBili"> 访问官网 </xt-button>
    <div class="my-4">
      图文攻略数据均来自「游民星空」，本应用不提供任何攻略数据
    </div>
    <xt-button :radius="8" w="150" h="40" @click="goImgText">
      访问官网
    </xt-button>
  </div>
</template>

<script>
import browser from "../../../../js/common/browser";
export default {
  name: "GameGuideFromInfo",
  methods: {
    // 跳转bili官网
    goBili() {
      browser.openInUserSelect("https://www.bilibili.com/");
    },
    // 跳转图文官网
    goImgText() {
      browser.openInUserSelect("https://www.gamersky.com/");
    },
  },
};
</script>

<style lang="scss" scoped>
</style>