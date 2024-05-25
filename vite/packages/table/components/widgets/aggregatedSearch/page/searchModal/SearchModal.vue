<script setup lang="ts">
import { ref, computed, inject, watch, provide, onMounted } from "vue";
import PerfectScrollbar from "perfect-scrollbar";
import { useEventListener, useDebounce } from "@vueuse/core";
import { openBrowser } from "../../utils/open";
import History from "./History.vue";

import { sourceList, openWithList } from "../../config/data";
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
initCurrentSource();
initOpenWith();

const currentSourceType = computed(() => {
  const name = currentSource.value.name;
  if (name === "文件夹") {
    return "folder";
  }
  if (name === "工作台") {
    return "";
  }
  return "web";
});
const recommendIndex = computed(() => {
  if (ctrlSelectIndex.value < 0) {
    ctrlSelectIndex.value = recommendList.value.length - 1;
  }
  if (ctrlSelectIndex.value > recommendList.value.length - 1) {
    ctrlSelectIndex.value = 0;
  }
  return ctrlSelectIndex.value % recommendList.value.length;
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
const selectSource = (newSource) => {
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
      historyRef.value.search(ctrlSelectIndex.value);
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
  // tab
  if (e.key == "Tab") {
    e.preventDefault();
    tabVisible.value = true;
    sourceIndex.value = (sourceIndex.value + 1) % sourceList.length;
    const sourceVal = sourceList[sourceIndex.value];
    selectSource(sourceVal);
  }
};

const tabEventUp = (e) => {
  if (e.key == "Tab") {
    e.preventDefault();
    setTimeout(() => {
      tabVisible.value = false;
    }, 100);
  }
};
useEventListener("keydown", eventDown);
useEventListener("keyup", tabEventUp);

const highlightText = (text) => {
  if (typeof text !== "string" || text === "") {
    text = words.value;
  }
  const wordArr = [...words.value];
  if (!Array.isArray(wordArr) || wordArr.length === 0) {
    console.log("第二次拦截 :>> ");

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
    <div class="w-[600px] h-[600px] flex flex-col max-h-[100%]">
      <!-- 头部 -->
      <header class="tt-bg-2-t flex items-center justify-between p-3">
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
                  v-for="item in sourceList"
                  class="w-full h-10 flex items-center justify-between p-2 mb-2 text-sm hover:tt-theme-bg-2 cursor-pointer"
                  style="border-radius: 10px"
                  :class="[
                    {
                      'tt-theme-bg-2': currentSource.name == item.name,
                    },
                  ]"
                  @click="selectSource(item)"
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
      <main
        class="flex-1 w-full p-3 overflow-hidden relative"
        ref="searchScrollbar"
      >
        <template v-if="words">
          <div class="flex pb-2">
            <div class="text-sm tt-text-2">猜你想找</div>
          </div>
          <!-- 搜索建议 -->
          <div
            class="w-full p-3 h-11 flex justify-between rounded-xl cursor-pointer hover:tt-theme-bg-2"
            v-for="(item, index) in recommendList"
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
                  {{ currentOpenWith?.name }}
                  <xt-mix-icon
                    icon="fluent:caret-down-12-filled"
                    class="tt-no-bg ml-2"
                    iconStyle="color: var(--active-bg)"
                  />
                </template>
                <template v-else> 网页 </template>
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
                      @click="selectSource(item)"
                    >
                      <div class="flex items-center">
                        {{ item.name }}
                      </div>
                    </div>
                  </div> -->
              </template>
            </a-dropdown>
          </div>
        </template>
        <!-- 搜索历史 -->
        <History v-else ref="historyRef" />
      </main>
      <footer
        class="h-10 tt-bg-2-t flex items-center justify-between px-2 text-xs"
      >
        <div class="tt-text-3 flex h-8 items-center">
          <div class="py-1 rounded-md mr-1 tt-bg-2-t px-2 tt-text-2">Tab</div>
          <div class="ml-1">切换搜索方式</div>
          <div class="py-1 rounded-md mr-1 tt-bg-2-t px-2 tt-text-2">Ctrl</div>
          <div class="py-1 rounded-md mr-1 tt-bg-2-t px-2 tt-text-2">1-9</div>
          <div>快速打开候选项</div>
          <template v-if="words">
            <div class="py-1 rounded-md mr-1 tt-bg-2-t px-2 tt-text-2">
              Ctrl
            </div>
            <div class="py-1 rounded-md mr-1 tt-bg-2-t px-2 tt-text-2">Tab</div>
            <div>切换打开方式</div>
          </template>
        </div>
        <xt-mix-icon icon="fluent:settings-16-regular" @click="openCardSet" />
      </footer>
    </div>
  </xt-modal>
</template>
<style lang="scss" scoped></style>
