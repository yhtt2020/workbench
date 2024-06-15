<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, inject, watch, computed } from "vue";
import axios from "axios";

import { highLightKeywords } from "../../utils";
import { sourceList, openWithList, defaultSourceList } from "../../config/data";

import Scrollbar from "./Scrollbar.vue";
import { watchDebounced } from "@vueuse/core";
const words: any = inject("words");
const isWebSource: any = inject("isWebSource");
const currentSource: any = inject("currentSource");
const altIndex: any = inject("altIndex");
const ctrlSelectIndex: any = inject("ctrlSelectIndex");
const currentOpenWith: any = inject("currentOpenWith");
const data: any = inject("data");
const emit = defineEmits(["search"]);
const search = (data) => {
  emit("search", data);
};
const enterSearch = () => {
  // webRef
  let res = recommendList.value[ctrlSelectIndex.value];
  emit("search", res);
};
// 推荐列表
const recommendList = ref([]);
const selectWebSource = (newSource) => {
  // 修改实际web搜索源
  data.value.webSource = newSource;
  currentSource.value = newSource;
};

// 获取推荐
const getRecommend = async () => {
  // 空数据
  if (!words.value.trim()) {
    return;
  }
  // 搜索源不符合
  const name = currentSource.value.name;
  let recommendUrl =
    currentSource.value.recommendUrl + encodeURIComponent(words.value);
  let { data } = await axios.get(recommendUrl);
  recommendList.value = handlers[name]?.(data) || handlers["default"]();
};
watchDebounced(
  [words, currentSource, altIndex],
  async (val: any) => {
    // 重置下标
    ctrlSelectIndex.value = 0;
    console.log("触发更新 :>> ", val);
    if (val[2] > 6) {
      scrollbarRef.value?.update({
        attributeKey: "data-id",
        attributeValue: currentSource.value.name,
        direction: "left",
      });
    }
    if (val[2] < 2) {
      scrollbarRef.value?.update({
        attributeKey: "data-id",
        attributeValue: currentSource.value.name,
        direction: "left",
      });
    }
    recommendList.value = [];
    await getRecommend();
  },
  { debounce: 200, immediate: true }
);

const handlers = {
  百度: (data) =>
    data?.g?.map((item) => {
      return {
        name: item.q,
      };
    }),
  微博: (data) =>
    data?.data?.hotquery?.map((item) => {
      return {
        name: item.suggestion,
      };
    }),
  Bilibili: (data) =>
    data?.result?.tag?.map((item) => {
      return {
        name: item.value,
      };
    }),
  豆瓣: (data) =>
    data?.words?.map((item) => {
      return {
        name: item,
      };
    }),
  必应: (data) =>
    data?.[1]?.map((item) => {
      return {
        name: item,
      };
    }),
  知乎: (data) =>
    data?.suggest?.map((item) => {
      return {
        name: item.query,
      };
    }),
  优酷: (data) =>
    data?.data?.map((item) => {
      return {
        name: item.name,
      };
    }),
  GitHub: () => {
    /**
     * 无接口返回空数组
     */
    return [];
  },
  default: () => [words.value],
};
const recommendIndex = computed(() => {
  if (ctrlSelectIndex.value < 0) {
    ctrlSelectIndex.value = recommendList.value.length - 1;
  }
  if (ctrlSelectIndex.value > recommendList.value.length - 1) {
    ctrlSelectIndex.value = 0;
  }
  return ctrlSelectIndex.value % recommendList.value.length;
});
defineExpose({
  enterSearch,
});
const scrollbarRef: any = ref(null);
// setTimeout(() => {
//   scrollbarRef.value.update({
//     attributeKey: "data-id",
//     attributeValue: "GitHub",
//     direction: "left",
//   });
// }, 1000);
</script>

<template>
  <xt-scrollbar-v2
    ref="scrollbarRef"
    direction="x"
    style="
      border-bottom: 1px solid var(--tt-primary-border-color);
      height: 50px;
      min-height: 50px;
    "
    class="w-full relative flex overflow-hidden tab-container flex-nowrap whitespace-nowrap mb-1"
  >
    <div
      v-for="item in data.sourceList"
      @click="selectWebSource(item)"
      :data-id="item.name"
      :style="[
        {
          'border-bottom':
            currentSource.name == item.name
              ? '2px solid var(--tt-theme-color)'
              : '2px solid var(--modal-bg)',
        },
      ]"
      class="px-2 py-3 inline-flex items-center cursor-pointer"
    >
      <xt-mix-icon :icon="item.icon" type="select" size="20" class="mr-2" />
      <span class="">{{ item.name }}</span>
    </div>
  </xt-scrollbar-v2>
  <Scrollbar>
    <div
      class="w-full p-3 h-11 flex justify-between rounded-xl cursor-pointer hover:tt-theme-bg-2"
      v-for="(item, index) in recommendList"
      :class="{
        'xt-theme-bg-2': recommendIndex == index,
      }"
      @click="search(item)"
    >
      <div v-html="highLightKeywords(words, item.name)"></div>
      <a-dropdown
        placements="bottom"
        :overlayStyle="{
          'z-index': '999999999 !important',
        }"
      >
        <div class="flex items-center">
          <template v-if="recommendIndex == index">
            <span class="tt-theme"> {{ currentOpenWith?.name }}</span>
            <xt-mix-icon
              icon="fluent:caret-down-12-filled"
              class="tt-no-bg ml-2"
              iconStyle="color: var(--active-bg)"
            />
          </template>
          <template v-else>
            <div class="tt-text-3">网页</div>
          </template>
        </div>
        <template #overlay>
          <!-- <div
                    class="p-2 pb-0 w-[240px] xt-shadow xt-border tt-modal-bg rounded-xl"
                  >
                    <div
                      v-for="item in openWithList"
                      class="w-full h-10 flex items-center justify-between p-2 mb-2 text-sm hover:tt-theme-bg cursor-pointer"
                      style="border-radius: 10px"
                      :class="[
                        {
                          'tt-theme-bg-2': currentSource.name == item.name,
                        },
                      ]"
                      @click="selectTabSource(item)"
                    >
                      <div class="flex items-center">
                        {{ item.name }}
                      </div>
                    </div>
                  </div> -->
        </template>
      </a-dropdown>
    </div>
    <div
      v-if="!recommendList.length"
      class="w-full h-full flex flex-col items-center justify-center"
    >
      <xt-ify-icon
        icon="fluent-emoji:magnifying-glass-tilted-right"
        size="56"
        class="mb-4"
      />
      <span class="xt-text xt-font font-16">没有找到相关内容</span>
    </div>
  </Scrollbar>
</template>

<style lang="scss" scoped></style>
