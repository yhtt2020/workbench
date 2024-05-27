<script setup lang="ts">
import { ref, computed, inject, watch, provide, onMounted } from "vue";
import PerfectScrollbar from "perfect-scrollbar";
import { useEventListener, useDebounce, useDebounceFn } from "@vueuse/core";
import { openBrowser } from "../../utils/open";
import History from "./History.vue";

import { sourceList, openWithList, defaultSourceList } from "../../config/data";
import axios from "axios";
const emit = defineEmits(["close", "openCardSet"]);

const scrollbar: any = ref(null);
const searchScrollbar: any = ref(null);

const initScrollbar = () => {
  scrollbar.value = new PerfectScrollbar(searchScrollbar.value, {});
};
const data: any = inject("data");
const props: any = defineProps({
  // 指定搜索源
  specifySource: {},
});
/** 搜索数据 */
const words = ref("");
const debounceWord = useDebounce(words, 1);
/** 当前搜索源 */
const currentSource = ref();
const debounceSource = useDebounce(currentSource, 1);
// 打开方式下标
const openWithIndex = ref(0);
/** 搜索源下标 */
const sourceIndex = ref(0);
/** 当前打开方式 */
const currentOpenWith: any = ref();

// tab栏显示状态
const tabVisible = ref(false);
// 推荐列表
const recommendList: any = ref([]);
// 选择的下标
const ctrlSelectIndex = ref(0);
const historyRef: any = ref();
const debounceCtrlSelectIndex = useDebounce(ctrlSelectIndex, 1);
provide("ctrlSelectIndex", ctrlSelectIndex);
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
  sourceIndex.value = sourceList.findIndex((item) => item.name === source.name);

  currentSource.value = source;
};
/** 初始化打开方式 */
const initOpenWith = () => {
  openWithIndex.value = openWithList.findIndex(
    (item) => item.value === data.value.openWith
  );
  currentOpenWith.value = openWithList[openWithIndex.value];
};
/** 用于判断是否属于web搜索源 */
const isWebSource = computed(() => {
  const name = currentSource.value.name;
  if (name == "工作台" || name == "window桌面文件") {
    return false;
  }
  return true;
});
initCurrentSource();
initOpenWith();
const webSource = ref();

const initWebSource = () => {
  webSource.value = data.value.webSource;
};
initWebSource();
const tabSourceList = computed(() => {
  let res: any = [...defaultSourceList];
  res.push(webSource.value);

  return res;
});

const recommendIndex = computed(() => {
  if (ctrlSelectIndex.value < 0) {
    ctrlSelectIndex.value = searchList.value.length - 1;
  }
  if (ctrlSelectIndex.value > searchList.value.length - 1) {
    ctrlSelectIndex.value = 0;
  }
  return ctrlSelectIndex.value % searchList.value.length;
});
watch(debounceCtrlSelectIndex, (val) => {
  searchScrollbar.value.scrollTop = ctrlSelectIndex.value * 44;
});
watch([debounceWord, debounceSource], async (val) => {
  // 重置下标
  ctrlSelectIndex.value = 0;
  await getRecommend();
});
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
  default: () => [words.value],
};
const getRecommend = async () => {
  // 空数据
  if (!words.value.trim()) {
    return;
  }
  // 搜索源不符合
  const name = currentSource.value.name;
  if (name === "工作台") {
    return;
  }
  if (name === "文件") {
    const desktopApps = await ipc.sendSync("getDeskApps");
    recommendList.value = desktopApps.filter((item) => {
      let res = item.name.includes(words.value);
      if (res) {
        return item;
      }
    });
    return;
  }
  let recommendUrl =
    currentSource.value.recommendUrl + encodeURIComponent(words.value);
  let { data } = await axios.get(recommendUrl);
  recommendList.value = handlers[name]?.(data) || handlers["default"]();
};
const historySearch = (index: number) => {
  let item = data.value.historyList[index];
  openBrowser(item.value, currentOpenWith.value.value);
};
/** 搜索 */
const search: any = async (value?: any) => {
  if (data.value.lastUse) {
    data.value.source = currentSource.value;
    data.value.openWith = currentOpenWith.value.value;
  }
  let word = value ? value.name : words.value;
  let searchUrl = currentSource.value.searchUrl + encodeURIComponent(word);

  const history = {
    name: word,
    source: currentSource.value,
    value: searchUrl,
    type: "网页",
    openWith: currentOpenWith.value.value,
  };

  data.value.historyList.push(history);

  openBrowser(searchUrl, currentOpenWith.value.value);
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
const selectWebSource = (newSource) => {
  // 修改实际web搜索源
  data.value.webSource = newSource;
  currentSource.value = newSource;
};
/** 打开卡片设置 */
const openCardSet = () => {
  emit("openCardSet");
};

/** 相关事件 */
const eventDown = (e) => {
  // ctrl+tab
  if (e.key == "Tab" && e.ctrlKey) {
    e.preventDefault();
    openWithIndex.value = (openWithIndex.value + 1) % openWithList.length;
    selectOpenWith(openWithIndex.value);
    return;
  }
  // ctrl+[1-9]
  if (e.ctrlKey && e.key.match(/^[1-9]$/)) {
    ctrlSelectIndex.value = e.key - 1;
    return;
  }
  // enter
  if (e.key === "Enter") {
    e.preventDefault();
    if (words.value.length > 0) {
      search(recommendList.value[ctrlSelectIndex.value]);
    } else {
      historySearch(ctrlSelectIndex.value);
    }
    return;
  }
  if (e.key === "ArrowUp") {
    ctrlSelectIndex.value -= 1;
    return;
  }
  if (e.key === "ArrowDown") {
    ctrlSelectIndex.value += 1;
    return;
  }
  // Alt+tab
  if (e.key === "Tab" && e.key === "Alt") {
    e.preventDefault();
    console.log("2222222 :>> ", 2222222);
    return;
  }
  // tab
  if (e.key == "Tab") {
    e.preventDefault();
    tabVisible.value = true;
    sourceIndex.value = (sourceIndex.value + 1) % tabSourceList.value.length;
    const sourceVal = tabSourceList.value[sourceIndex.value];
    selectTabSource(sourceVal);
  }
};
const searchList = computed(() => {
  if (words.value.length == 0) {
    return data.value.historyList;
  } else {
    return recommendList.value;
  }
});
const debouncedChangeTabVisible = useDebounceFn(() => {
  tabVisible.value = false;
}, 11111500);
const tabEventUp = (e) => {
  if (e.key == "Tab") {
    debouncedChangeTabVisible();
  }
};
const clear = () => {
  data.value.historyList = [];
};
useEventListener("keydown", eventDown);
useEventListener("keyup", tabEventUp);

const highlightText = (text) => {
  if (typeof text !== "string" || text === "") {
    text = words.value;
  }
  const wordArr = [...words.value];
  if (!Array.isArray(wordArr) || wordArr.length === 0) {
    return text;
  }
  // 将关键字数组转换为正则表达式数组
  const regexArray = wordArr.map((keyword) => new RegExp(`(${keyword})`, "gi"));

  // 使用reduce方法结合replace来替换所有关键字
  return regexArray.reduce(function (result, regex) {
    return result.replace(regex, function (match) {
      return `<span class="tt-theme">${match}</span>`;
    });
  }, text);
};
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
              <xt-mix-icon :icon="currentSource.icon" type="select" size="24" />
            </div>
            <template #overlay>
              <div
                class="p-2 pb-0 w-[240px] xt-shadow xt-border tt-modal-bg rounded-xl"
              >
                <div
                  v-for="item in tabSourceList"
                  class="w-full h-10 flex items-center justify-between p-2 mb-2 text-sm hover:tt-theme-bg-2 cursor-pointer"
                  style="border-radius: 10px"
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
            <xt-input type="" v-model="words" />
          </div>
        </div>
        <!-- 搜索按钮 -->
        <xt-mix-icon
          icon="fluent:search-16-regular"
          @click="search()"
          boxSize="32"
        />
      </header>
      <xt-scrollbar
        v-if="words && isWebSource"
        :x="true"
        style="border-bottom: var(--tt-primary-border-color)"
        class="w-full relative flex overflow-hidden tab-container flex-nowrap whitespace-nowrap pb-3"
      >
        {{ currentSource.name }}
        <div
          v-for="item in sourceList"
          @click="selectWebSource(item)"
          :style="[
            {
              'border-bottom':
                currentSource.name == item.name
                  ? '2px solid var(--tt-theme-color)'
                  : '2px solid var(--tt-secondary-color)',
            },
          ]"
          class="p-3 inline-flex items-center cursor-pointer"
        >
          <xt-mix-icon :icon="item.icon" type="select" size="24" class="mr-1" />
          <span class="">{{ item.name }}</span>
        </div>
      </xt-scrollbar>
      <main
        class="flex-1 w-full overflow-hidden relative"
        ref="searchScrollbar"
      >
        <div
          class="p-3 h-[500px]"
          v-if="words.length > 0 || data.historyList.length > 0"
        >
          <div class="flex pb-2" v-if="words">
            <div class="text-sm tt-text-2">猜你想找</div>
          </div>
          <div
            class="flex justify-between pb-3"
            v-else-if="data.historyList.length > 0"
          >
            <div class="text-sm tt-text-2">最近</div>
            <xt-mix-icon
              size="20"
              icon="fluent:dismiss-circle-16-filled"
              @click="clear"
            />
          </div>
          <!-- 搜索建议 -->
          <div
            class="w-full p-3 h-11 flex justify-between rounded-xl cursor-pointer hover:tt-theme-bg-2"
            v-for="(item, index) in searchList"
            :class="{
              'xt-theme-bg-2': recommendIndex == index,
            }"
            @click="search(item)"
          >
            <div v-html="highlightText(item.name)"></div>
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
          <!-- 搜索历史 -->
          <!-- <History v-else ref="historyRef" /> -->
        </div>
      </main>
      <footer
        class="h-10 tt-bg-2-t flex items-center justify-between p-3 pr-2 text-xs"
      >
        <div class="tt-text-3 flex h-8 items-center">
          <div class="py-1 rounded-md mr-1 tt-bg-2-t px-2 tt-text-2">Tab</div>
          <div class="ml-1">切换搜索方式</div>

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

            <template v-if="isWebSource">
              <div class="py-1 rounded-md mr-1 tt-bg-2-t px-2 tt-text-2">
                Alt
              </div>
              <div class="py-1 rounded-md mr-1 tt-bg-2-t px-2 tt-text-2">
                Tab
              </div>
              <div>切换打开方式</div>
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
