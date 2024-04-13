<!-- 右侧显示区域页 -->
<template>
  <!-- 顶部区域 -->
  <div class="flex items-center px-4 mb-0 line-title">
    <div class="flex items-center justify-center">
      <template v-if="currentItem?.type === 'group'">
        <xt-ify-icon icon="fluent-emoji-flat:thought-balloon" size="20" />
      </template>
      <template v-if="currentItem?.type === 'link'">
        <xt-ify-icon icon="fluent-emoji-flat:globe-with-meridians" size="20" />
      </template>
      <template v-if="currentItem?.type === 'forum'">
        <xt-ify-icon icon="fluent-emoji-flat:placard" size="20" />
      </template>
    </div>
    <span class="ml-2 xt-text font-16 xt-font"> {{ currentItem?.name }}</span>
  </div>

  <div style="height: 0; flex: 1">
    <!-- 群聊 -->
    <TUIChat v-if="currentItem?.type === 'group'"></TUIChat>
    <!-- 链接 -->
    <template v-else-if="currentItem?.type === 'link'">
      <iframe
        v-if="currentItem?.props.openMethod === 'currentPage'"
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
      <div v-else style="text-align: center; margin-top: 30%">
        当前频道需要浏览器打开。
      </div>
    </template>
    <!-- 版块 -->
    <Commun v-else-if="currentItem?.type === 'forum'" :forum-id="currentItem?.props?.id" />
  </div>
</template>

<script setup>
import { toRefs } from "vue";

import Commun from "../com/Commun.vue";

const props = defineProps({
  currentItem: {
    type: Object,
    default: () => {},
  },
});
const { currentItem } = toRefs(props);
</script>

<style lang="scss" scoped>
</style>