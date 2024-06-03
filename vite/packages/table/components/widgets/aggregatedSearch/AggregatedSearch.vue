<script setup lang="ts">
import { ref, watch, computed, toRefs, provide } from "vue";
import _ from "lodash-es";
import { sourceList, defaultSourceList } from "./config/data";
import CardSet from "./page/cardSet/CardSet.vue";
import SearchModal from "./page/searchModal/SearchModal.vue";

const header = {
  title: "聚合搜索",
  showIcon: "/logo/aggregateSearch.svg",
};
const cloneSourceList = JSON.parse(JSON.stringify(sourceList));
const defaultData = {
  // 搜索源列表
  sourceList: cloneSourceList,
  // 搜索源
  source: cloneSourceList[0],
  webSource: cloneSourceList[0],
  // 打开方式
  openWith: "system",
  // 记住上次使用的搜索方式
  lastUse: false,
  // 历史记录
  historyList: [],
  noBorder: true,
  customSize: "4x2",
  _updateFlag: "24532",
};
const options = computed(() => {
  return {
    // 初始化数据
    defaultData,
    noBorder: customData.value?.noBorder,
  };
});
const customSize = computed(() => {
  if (customData.value.noBorder) {
    customData.value.customSize = "4x1";
  } else {
    customData.value.customSize = "4x2";
  }
  return customData.value.customSize;
});

const props = defineProps({
  customIndex: {},
  customData: {},
});
const { customData }: any = toRefs(props);
provide("data", customData);

const searchStyle = computed(() => {
  if (!customData.value.noBorder) {
    return {
      "border-radius": "12px",
      height: "100%",
    };
  } else {
    return {
      "border-radius": "10px",
      height: "56px",
      border: "1px solid rgba(255,255,255,0.1)",
    };
  }
});

const searchVisible = ref(false);
const searchSource: any = ref(false);
const openSearch = (data?: any) => {
  if (data) {
    searchSource.value = data;
  }
  searchVisible.value = true;
};
const closeSearch = (data?: any) => {
  searchSource.value = null;
  searchVisible.value = false;
};
const cardSetVisible = ref(false);
const menuList = computed(() => {
  let menu = [
    {
      newIcon: "fluent:settings-16-regular",
      title: "设置",
      fn: () => {
        cardSetVisible.value = true;
      },
    },
  ];
  return menu;
});
const listSort = (newIndex, oldIndex) => {
  let sourceList = customData.value.sourceList;

  [sourceList[newIndex], sourceList[oldIndex]] = [
    sourceList[oldIndex],
    sourceList[newIndex],
  ];
};
const lastIcon = computed(() => {
  // 最后使用有记录时
  if (customData.value.lastUse) {
    return customData.value.source;
  }
  return customData.value.sourceList?.slice(0, 1)[0];
});
const surplusIcon = computed(() => {
  // surplusIcon
  let arr: any = [];
  // 最后使用有记录时
  if (customData.value.lastUse) {
    const sourceList = customData.value.sourceList.filter(
      (item) => item.name !== customData.value.source.name
    );
    arr = sourceList.slice(0, 2);
  }
  arr = customData.value.sourceList?.slice(1,3);
  arr?.unshift(...defaultSourceList);

  return arr;
});
</script>

<template>
  <xt-container
    :customIndex="customIndex"
    :customData="customData"
    :options="options"
    :menuList="menuList"
    :customSize="customSize"
    :header="header"
    class="xt-theme-b"
  >
    <div class="w-full h-full flex flex-col justify-center">
      <div
        @click="openSearch(null)"
        class="w-full flex justify-between p-4 cursor-pointer"
        :style="searchStyle"
        :class="[
          customData.noBorder
            ? 'h-[56px] xt-shadow xt-border xt-filter tt-bg'
            : 'flex-1 tt-bg-2-t',
        ]"
      >
        <div
          class="h-full flex"
          :class="customData.noBorder ? 'items-center' : ' items-start'"
        >
          <xt-mix-icon
            :icon="lastIcon?.icon"
            type="select"
            size="24"
            class="tt-no-bg"
          />
        </div>
        <div
          class="h-full flex"
          :class="customData.noBorder ? 'items-center' : ' items-end'"
        >
          <xt-mix-icon icon="fluent:search-16-regular" class="tt-no-bg" />
        </div>
      </div>
      <div v-if="!customData.noBorder" class="flex mt-3 justify-between">
        <div
          class="w-[100px] h-12 tt-bg-2-t flex items-center cursor-pointer"
          @click="openSearch(item)"
          style="border-radius: 10px"
          v-for="item in surplusIcon"
          :key="item.name"
        >
          <xt-mix-icon
            :icon="item?.icon"
            :type="item?.iconType"
            size="24"
            r="6"
            class="mr-2 ml-2.5"
          />
          <div>{{ item?.name }}</div>
        </div>
      </div>
    </div>
  </xt-container>

  <!-- 卡片设置 -->
  <CardSet
    v-if="cardSetVisible"
    @close="cardSetVisible = false"
    v-model:lastUse="customData.lastUse"
    v-model:openWith="customData.openWith"
    @listSort="listSort"
  />
  <!-- 搜索 -->
  <SearchModal
    :specifySource="searchSource"
    v-if="searchVisible"
    @close="closeSearch"
    @openCardSet="cardSetVisible = true"
  />
</template>

<style lang="scss" scoped></style>
