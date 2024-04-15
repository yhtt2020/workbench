<!-- 右侧显示区域页 -->
<template>
  <div style="height: 0; flex: 1" class="relative">
    <!-- 群聊 -->
    <TUIChat v-if="currentItem?.type === 'group'"></TUIChat>
    <!-- 链接 -->
    <template v-else-if="currentItem?.type === 'link'">
      <div
        v-if="
          currentItem.name !== 'Roadmap' &&
          currentItem.props.openMethod !== 'currentPage'
        "
        class="flex items-center justify-center"
        style="text-align: center; margin-top: 30%"
      >
        <span class="font-16 font-400" style="color: var(--primary-text)">
          当前频道需要浏览器打开。
        </span>
        <xt-ify-icon icon="fluent:open-20-filled" style="font-size: 24px" />
      </div>
      <iframe
        v-else-if="currentItem?.props.openMethod === 'currentPage'"
        :src="currentItem?.props.url"
        class="m-2"
        style="
          border: none;
          background: none;
          border-radius: 4px;
          width: calc(100% - 10px);
          height: calc(100% - 10px);
        "
      ></iframe>
      <div
        style="position: absolute; top: -62px; right: 0px"
        v-if="
          currentItem.name !== 'Roadmap' &&
          currentItem.props.openMethod !== 'currentPage'
        "
      >
        <xt-button @click="openLink" :w="120" :h="40"> 浏览器打开 </xt-button>
      </div>
    </template>
    <!-- 版块 -->
    <Commun
      v-else-if="currentItem?.type === 'forum'"
      :forum-id="currentItem?.props?.id"
    />
  </div>
</template>

<script setup>
import { toRefs } from "vue";
import browser from "../../../../js/common/browser";

import Commun from "../com/Commun.vue";

const props = defineProps({
  currentItem: {
    type: Object,
    default: () => {},
  },
});
const { currentItem } = toRefs(props);

const openLink = () => {
  // 系统默认浏览器打开
  if (currentItem.value.props?.url) {
    browser.openInSystem(currentItem.value.props.url);
  } else {
    browser.openInSystem(currentItem.value.props);
  }
};
</script>

<style lang="scss" scoped>
</style>