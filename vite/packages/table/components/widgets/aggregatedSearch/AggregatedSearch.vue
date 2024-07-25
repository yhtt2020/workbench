<script setup lang="ts">
import {ref, watch, computed, toRefs, provide} from "vue";
import {sourceList, defaultSourceList} from "./config/data";
import CardSet from "./page/cardSet/CardSet.vue";
import SearchModal from "./page/searchModal/SearchModal.vue";

const header = computed(() => {
  return {
    title: "聚合搜索",
    showIcon: "/logo/aggregateSearch.svg",
    bg: customData.value.bgMode == "header" ? customData.value.bgColor : "",
  };
});

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
  currentSize: "4",
  _updateFlag: "2466",
  bgMode: "default",
  bgColor: "#508BFE",
};
const options = computed(() => {
  return {
    // 初始化数据
    defaultData,
    noBorder: customData.value?.noBorder,
    bg: customData.value.bgMode == "custom" ? customData.value.bgColor : "",
    cardName: '聚合搜索'
  };
});

const customSize = computed(() => {
  const size = customData.value.currentSize || 4;

  if (customData.value.noBorder) {
    customData.value.customSize = size + "x1";
  } else {
    customData.value.customSize = size + "x2";
  }

  return customData.value.customSize;
});

const props = defineProps({
  customIndex: {},
  customData: {},
  desk: {}
});
const {customData}: any = toRefs(props);
provide("data", customData);

const searchStyle = computed(() => {
  if (!customData.value.noBorder) {
    return {
      "border-radius": "12px",
      height: "100%",
    };
  } else {
    return {
      background:
        customData.value.bgMode != "default" ? customData.value.bgColor : "",
      "border-radius": "10px",
      height: "56px",
      // border: "1px solid rgba(255,255,255,0.1)",
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
  if (customData.value.currentSize == "4") {
    // 最后使用有记录时
    if (customData.value.lastUse) {
      const sourceList = customData.value.sourceList.filter(
        (item) => item.name !== customData.value.source.name
      );
      arr = sourceList.slice(0, 3);
    }
    arr = customData.value.sourceList?.slice(1, 4);
  }

  // 添加默认源
  arr?.unshift(...defaultSourceList);

  return arr;
});
const sizeList = computed(() => {
  let sizes = []
  if (customData.value.noBorder) {
    sizes = [
      '2x1', '4x1', '6x1', '8x1'
    ]
  } else {
    sizes = [
      '2x2', '4x2', '6x2', '8x2'
    ]
  }
  return sizes.map(item => {
    return {
      name: item,
      value: item
    }
  })


});
const updateSize = (val) => {
  customData.value.customSize = val;
  customData.value.currentSize = [...val][0]
};
</script>

<template>
  <xt-container
    v-model:customSize="customSize"
    :customIndex="customIndex"
    :customData="customData"
    :options="options"
    :menuList="menuList"
    :header="header"
    :sizeList="sizeList"
    :desk="desk"
    @resize="updateSize"
    class="xt-theme-b items-center"
  >
    <div class="w-full h-full flex flex-col justify-center  " :class="{'max-w-[705px] m-auto':customData.noBorder}">
      <div
        @click="openSearch(null)"
        class="w-full flex justify-between p-4 cursor-pointer "
        :style="searchStyle"
        :class="[
          customData.noBorder
            ? 'h-[56px] xt-shadow xt-filter tt-bg max-w-[705px]'
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
          <xt-mix-icon icon="fluent:search-16-regular" class="tt-no-bg"/>
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
  <CardSet v-if="cardSetVisible" @close="cardSetVisible = false"/>
  <!-- 搜索 -->
  <SearchModal
    :specifySource="searchSource"
    v-if="searchVisible"
    @close="closeSearch"
    @openCardSet="cardSetVisible = true"
  />
</template>

<style lang="scss" scoped></style>
