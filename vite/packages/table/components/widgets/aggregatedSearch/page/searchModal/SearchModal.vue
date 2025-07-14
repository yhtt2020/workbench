<script setup lang="ts">
import { ref, computed, inject, watch, provide, onMounted } from "vue";
import { useEventListener, useDebounce, useDebounceFn } from "@vueuse/core";

import { open } from "../../utils/open";
import { sourceList, openWithList, defaultSourceList } from "../../config/data";
// 历史搜索
import HistorySearch from "./HistorySearch.vue";
// 系统搜索
import SystemSearch from "./SystemSearch.vue";
// 网页搜索
import WebSearch from "./WebSearch.vue";
// AI搜索
import AISearch from "./AISearch.vue";
// 文件搜索
import FileSearch from "./FileSearch.vue";
import { HistoryData } from "./types";
// 右边新建对话，左边询问ai助手
const emit = defineEmits(["close", "openCardSet"]);

const data: any = inject("data");
const props: any = defineProps({
  // 指定搜索源
  specifySource: {},
});

/** 搜索数据 */
const words = ref("");
const debounceWord = useDebounce(words, 200);

/** 当前搜索源 */
const currentSource = ref();
const debounceSource = useDebounce(currentSource, 200);
// 打开方式下标
const openWithIndex = ref(0);
/** 搜索源下标 */
const sourceIndex = ref(0);
/** 当前打开方式 */
const currentOpenWith: any = ref();

// tab栏显示状态
const tabVisible = ref(false);

// 选择的下标
const ctrlSelectIndex = ref(0);
/** web搜索源 */
const webSource = ref();
/** 用于判断是否属于web搜索源 */
const isWebSource = computed(() => {
  const name = currentSource.value.name;
  if (name === "工作台内搜索" || name === "文件" || name === "AI助手") {
    return false;
  }
  return true;
});
provide("words", words);
provide("currentSource", debounceSource);
provide("currentOpenWith", currentOpenWith);
provide("ctrlSelectIndex", ctrlSelectIndex);
provide("isWebSource", isWebSource);

/** 初始化当前搜索源 */
const initCurrentSource = () => {
  let source;
  // 有指定搜索源
  if (props.specifySource) {
    source = props.specifySource;
  }
  // 有记录
  else if (data.value?.lastUse) {
    source = data.value.source;
  }
  // 默认
  else {
    source = data.value.sourceList[0];
  }

  currentSource.value = source;
  if (source.name == "工作台内搜索") {
    sourceIndex.value = 0;
  } else if (source.name == "文件") {
    sourceIndex.value = 1;
  } else {
    sourceIndex.value = 2;
  }
};

/** 初始化打开方式 */
const initOpenWith = () => {
  openWithIndex.value = openWithList.findIndex(
    (item) => item.value === data.value.openWith
  );
  currentOpenWith.value = openWithList[openWithIndex.value];
};

/** 初始化web搜索源 */
const initWebSource = () => {
  if (isWebSource.value) {
    webSource.value = currentSource.value;
  } else {
    webSource.value = data.value.webSource;
  }
};

initCurrentSource();
initOpenWith();
initWebSource();

const tabSourceList = computed(() => {
  let res: any = [...defaultSourceList];
  res.push(webSource.value);

  return res;
});
/** 历史搜索 */
const historySearch = (index: number) => {
  let item = data.value.historyList[index];
  open(item);
};
const saveSearchSource = () => {
  if (data.value.lastUse) {
    data.value.source = currentSource.value;
    data.value.openWith = currentOpenWith.value.value;
  }
};
provide("saveSearchSource", saveSearchSource);
/** 搜索 */
const search: any = async (value?: any) => {
  if (!isWebSource.value) return;
  console.log("value :>> ", value);
  saveSearchSource();
  let word = value ? value.name : words.value;
  let searchUrl = currentSource.value.searchUrl + encodeURIComponent(word);
  const history: HistoryData = {
    name: word,
    source: currentSource.value.icon,
    value: searchUrl,
    showType: "网页",
    openWith: currentOpenWith.value.value,
  };
  // item.openWith, item.value
  console.log("history :>> ", history);
  console.log("currentOpenWith.value.value :>> ", currentOpenWith.value.value);

  data.value.historyList.push(history);

  open(history);
  close();
};
/** 关闭弹窗 */
const close = () => {
  emit("close");
};

/** 打开方式选择 */
const selectOpenWith = (index) => {
  currentOpenWith.value = openWithList[index];
};

/** 搜索源选择 */
const selectTabSource = (newSource) => {
  currentSource.value = newSource;
};

/** 打开卡片设置 */
const openCardSet = () => {
  emit("openCardSet");
};
/** 搜索源切换 */
const debouncedChangeTabVisible = useDebounceFn(() => {
  tabVisible.value = false;
}, 500);
const AIRef: any = ref();
const SystemRef: any = ref();
const webRef: any = ref();

const altIndex = ref(0);
provide("altIndex", altIndex);
/** 相关事件 */
const eventDown = (e) => {
  /** 组合键 */
  // ctrl+tab
  if (e.key == "Tab" && e.ctrlKey) {
    e.preventDefault();

    openWithIndex.value = (openWithIndex.value + 1) % openWithList.length;
    selectOpenWith(openWithIndex.value);
    return;
  }
  // ctrl + [1-9]
  if (e.ctrlKey && e.key.match(/^[1-9]$/)) {
    e.preventDefault();
    ctrlSelectIndex.value = e.key - 1;
    return;
  }
  // alt + [1-9]
  if (e.altKey && e.key.match(/^[1-9]$/)) {
    if (words.value.length == 0) {
      return;
    }
    altIndex.value = e.key - 1;
    e.preventDefault();
    currentSource.value = data.value.sourceList[e.key - 1];
    return;
  }
  /** 单键 */
  // enter
  if (e.key === "Enter") {
    e.preventDefault();
    const name = currentSource.value.name;
    // ai搜索
    if (name === "AI助手") {
      AIRef.value.search();
    }
    // web搜索
    else if (words.value.length > 0) {
      if (isWebSource.value) {
        webRef.value.enterSearch();
      }
    }
    // 历史搜索
    else {
      historySearch(ctrlSelectIndex.value);
    }
    return;
  }
  if (e.key === "ArrowUp") {
    e.preventDefault();
    ctrlSelectIndex.value -= 1;
    return;
  }
  if (e.key === "ArrowDown") {
    e.preventDefault();
    ctrlSelectIndex.value += 1;
    return;
  }

  // tab
  if (e.key == "Tab") {
    e.preventDefault();
    tabVisible.value = true;
    // 有bug
    sourceIndex.value = (sourceIndex.value + 1) % tabSourceList.value.length;
    const sourceVal = tabSourceList.value[sourceIndex.value];
    selectTabSource(sourceVal);
  }

  if (e.code === "Space") {
    e.stopPropagation();
  }

  if (e.ctrlKey && (e.key === "A" || e.key === "a")) {
    e.stopPropagation();
  }
};

const tabEventUp = (e) => {
  if (e.key == "Tab") {
    debouncedChangeTabVisible();
  }
};

useEventListener("keydown", eventDown);
useEventListener("keyup", tabEventUp);
</script>

<template>
  <xt-modal :model-value="true" @close="close" @init="initScrollbar" custom>
    <div class="w-[600px] flex flex-col max-h-[600px]">
      <!-- 头部 -->
      <header
        class="tt-bg-2-t flex items-center justify-between p-3 pr-2 h-[52px] max-h-[52px]"
      >
        <div class="flex-1 flex items-center">
          <!-- 可切换搜索源 -->
          <a-dropdown
            v-model:visible="tabVisible"
            placements="bottom"
            :overlayStyle="{
              'z-index': '999999999 !important',
            }"
          >
            <div class="flex items-center">
              <xt-mix-icon
                :icon="currentSource.icon"
                type="select"
                size="24"
                class="tt-no-bg"
              />
              <xt-mix-icon
                icon="fluent:caret-down-16-filled"
                type="select"
                size="24"
                class="tt-no-bg"
              />
            </div>
            <template #overlay>
              <div
                class="p-2 pb-0 w-[240px] xt-shadow xt-border tt-modal-bg rounded-xl"
              >
                <div
                  v-for="item in tabSourceList"
                  class="w-full h-10 flex items-center justify-between p-2 mb-2 text-sm hover:tt-theme-bg-2 cursor-pointer"
                  style="border-radius: 10px; z-index: 999999999999"
                  :class="[
                    {
                      'tt-theme-bg-2': currentSource.name == item.name,
                    },
                  ]"
                  @click="selectTabSource(item)"
                >
                  <div class="flex items-center">
                    <xt-mix-icon
                      size="24"
                      class="mr-3"
                      :icon="item.icon"
                      type="select"
                    />
                    {{ item.name }}
                  </div>
                  <div class="tt-text-3 mr">
                    {{ item.type }}
                  </div>
                </div>
              </div>
            </template>
          </a-dropdown>
          <!-- 输入框 -->
          <div class="flex-1">
            <xt-input type="" v-model="words" :focus="true" />
          </div>
        </div>
        <!-- 搜索按钮 -->
        <xt-mix-icon
          icon="fluent:search-16-regular"
          @click="search()"
          boxSize="32"
          class="tt-no-bg"
        />
      </header>

      <main
        class="w-full overflow-hidden flex flex-col px-3"
        style="height: 508px"
        v-if="
          data.historyList.length > 0 || words || currentSource.name == 'AI助手'
        "
      >
        <AISearch v-if="currentSource.name == 'AI助手'" ref="AIRef" />
        <SystemSearch
          v-else-if="words && currentSource.name == '工作台内搜索'"
          ref="SystemRef"
        />
        <FileSearch v-else-if="words && currentSource.name == '文件'" />
        <WebSearch
          v-else-if="words && isWebSource"
          @search="search"
          ref="webRef"
        />
        <HistorySearch v-else-if="!words && data.historyList.length > 0" />


      </main>
      <main v-else  class="mt-2">
       <div class="p-4">
         <div class="flex">
           按下<div class="py-1 rounded-md mr-1 tt-bg-2-t px-2 tt-text-2">Tab</div>
           或者点击图标：
           <div class="ml-1">切换搜索方式</div>
         </div>
         <div class="flex gap-4 pt-2">
           <div
             v-for="item in tabSourceList"
             class="xt-bg w-full h-10 flex items-center justify-between p-2 mb-2 text-sm hover:tt-theme-bg-2 cursor-pointer"
             style="border-radius: 10px; z-index: 999999999999"
             :class="[
                    {
                      'tt-theme-bg-2': currentSource.name == item.name,
                    },
                  ]"
             @click="selectTabSource(item)"
           >
             <div class="flex items-center">
               <xt-mix-icon
                 size="24"
                 class="mr-3"
                 :icon="item.icon"
                 type="select"
               />
               {{ item.name }}
             </div>
             <div class="tt-text-3 mr">
               {{ item.type }}
             </div>
           </div>
         </div>

       </div>
        <div class="p-4 pt-0 flex">
          可按下<div class="py-1 rounded-md mr-1 tt-bg-2-t px-2 tt-text-2">Alt</div>+
          <div class="py-1 rounded-md mr-1 tt-bg-2-t px-2 tt-text-2">x</div>
          唤起全局可用的超级工具箱，支持更多小工具
        </div>

      </main>
      <footer
        class="h-10 tt-bg-2-t flex items-center justify-between p-3 pr-2 text-xs"
      >
        <div class="tt-text-3 flex h-8 items-center">
          <template v-if="!words && !data.historyList.length">

          </template>
          <template v-if="words || data.historyList.length > 0">

              <div class="py-1 rounded-md mr-1 tt-bg-2-t px-2 tt-text-2">
                Ctrl
              </div>
              <div class="py-1 rounded-md mr-1 tt-bg-2-t px-2 tt-text-2">1-9</div>
              <div>快速打开候选项</div>
              <div class="py-1 rounded-md mr-1 tt-bg-2-t px-2 tt-text-2">
                Ctrl
              </div>
              <div class="py-1 rounded-md mr-1 tt-bg-2-t px-2 tt-text-2">Tab</div>
              <div>切换打开方式</div>
              <template v-if="isWebSource && words">
                <div class="py-1 rounded-md mr-1 tt-bg-2-t px-2 tt-text-2">
                  Alt
                </div>
                <div class="py-1 rounded-md mr-1 tt-bg-2-t px-2 tt-text-2">
                  1-9
                </div>
                <div>切换搜索引擎</div>
               </template>

          </template>
        </div>
        <xt-mix-icon
          icon="fluent:settings-16-regular"
          @click="openCardSet"
          boxSize="32"
          class="tt-no-bg"
        />
      </footer>
    </div>
  </xt-modal>
</template>
<style lang="scss" scoped></style>
