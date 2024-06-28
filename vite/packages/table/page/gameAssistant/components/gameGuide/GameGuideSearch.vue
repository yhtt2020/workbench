<template>
  <div class="px-4 flex flex-col">
    <div class="line-title">关键词自定义</div>

    <div class="line">当游戏名存在无法被搜索到的情况时，请手动自定义关键词</div>

    <div class="line">视频攻略关键词：</div>

    <div class="line">
      <a-input
        placeholder="视频关键词"
        style="border-radius: 12px; background: var(--secondary-bg)"
        class="no-drag h-10 w-full"
        v-model:value="searchVal.video"
      />
    </div>

    <div class="line">图文攻略关键词：</div>

    <div class="line">
      <a-input
        placeholder="视频关键词"
        style="border-radius: 12px; background: var(--secondary-bg)"
        class="no-drag h-10 w-full"
        v-model:value="searchVal.text"
      />
    </div>

    <div class="line-title">搜索</div>
    <div class="line">
      <a-input
        placeholder="搜索"
        class="no-drag h-10 w-full"
        v-model:value="searchVal.text"
        style="border-radius: 12px; background: var(--secondary-bg)"
      />
    </div>
    <xt-button w="420" h="40" type="theme" :radius="8"> 搜索 </xt-button>
  </div>
</template>

<script>
export default {
  name: "GameGuideSearch",
  props: {
    searchVal: {
      type: Object,
      default: () => {},
    },
  },
};
</script>

<style lang="scss" scoped>
</style>