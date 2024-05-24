<script setup lang="ts">
import {
  ref,
  computed,
  inject,
  watch,
  provide,
  onMounted,
  reactive,
} from "vue";
import { useEventListener, useDebounce } from "@vueuse/core";
import History from "./History.vue";
import Search from "./Search.vue";
import { sourceList, openWithList } from "../../config/data";
import axios from "axios";

const data: any = inject("data");
const customData = reactive(data);
const emit = defineEmits(["close", ]);
const props: any = defineProps({
  specifySource: {},
});
/** 搜索数据 */
const words = ref("");
// 打开方式下标
const openWithIndex = ref(0);
/** 搜索源下标 */
const sourceIndex = ref(0);
/** 当前打开方式 */
const currentOpenWith: any = ref();
/** 当前搜索源 */
const currentSource = ref();
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

const search: any = async () => {
  const history = {
    value: words.value,
    source: currentSource.value,
  };

  data.value.historyList.push(history);

  if (data.value.lastUse) {
    data.value.source = currentSource.value;
    data.value.openWith = currentOpenWith.value.value;
  }
};
const getRecommend = async () => {
  // 空数据
  // if (!words.value.trim()) {
  // return;
  // }
  // 搜索源不符合
  const name = currentSource.value.name;
  if (name === "文件夹" || name === "工作台") {
    return;
  }

  const searchUrl =
    currentSource.value.searchUrl + encodeURIComponent(words.value);
  let res = await axios.get(searchUrl);

  if (name == "百度") {
  }
  console.log("res :>> ", res);
};
const debounceWord = useDebounce(words, 500);
const debounceSource = useDebounce(currentSource, 500);

watch([debounceWord, debounceSource], async (val) => {
  await getRecommend();
});
const close = () => {
  emit("close");
};

const searchValueChange = (data) => {
  console.log("data :>> ", data);
};
/** 打开方式选择 */
const selectOpenWith = (index) => {
  currentOpenWith.value = openWithList[index];
};

/** 搜索源选择 */
const selectSource = (newSource) => {
  currentSource.value = newSource;
};
const tabVisible = ref(false);
/** tab相关事件 */
const tabEventDown = (e) => {
  // ctrl+tab
  if (e.key == "Tab" && e.ctrlKey) {
    e.preventDefault();
    openWithIndex.value = (openWithIndex.value + 1) % openWithList.length;
    selectOpenWith(openWithIndex.value);
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
useEventListener("keydown", tabEventDown);
useEventListener("keyup", tabEventUp);

const ctrlSelectIndex = ref(0);
provide("selectIndex", ctrlSelectIndex);
const ctrl1_9Event = (e) => {
  if (!e.ctrlKey || !e.key.match(/^[1-9]$/)) {
    return;
  }
  ctrlSelectIndex.value = e.key;
  console.log("pressedNumber :>> ", ctrlSelectIndex.value);
};
useEventListener("keydown", ctrl1_9Event);
</script>

<template>
  <xt-modal :model-value="true" @close="close" custom>
    <div class="w-[600px] h-[600px] flex flex-col">
      <!-- 头部 -->
      <header class="tt-main-bg flex items-center justify-between p-3">
        <div class="flex-1 flex items-center">
          <!-- 可切换搜索源 -->
          <a-dropdown
            trigger='["click","hover"]'
            v-model:visible="tabVisible"
            placements="bottom"
            :overlayStyle="{
              'z-index': '999999999 !important',
            }"
          >
            <div>
              <xt-mix-icon :icon="currentSource.icon" type="select" size="24" />
            </div>
            <template #overlay>
              <div
                class="p-2 pb-0 w-[240px] xt-shadow xt-border tt-modal-bg rounded-xl"
              >
                <div
                  v-for="item in sourceList"
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
            <xt-input
              class="tt-main-bg"
              v-model="words"
              @change="searchValueChange"
              @pressEnter="search"
            />
            <a-input
              v-model-value="words"
              placeholder="搜索"
              class="w-full"
              @change="searchValueChange"
              @pressEnter="search"
            />
            {{ words }}
          </div>
        </div>
        <!-- 搜索按钮 -->
        <xt-mix-icon icon="fluent:search-16-regular" @click="search" />
      </header>

      <main class="flex-1 w-full p-3 overflow-hidden">
        <xt-scrollbar v-if="words" class="h-full" :x="false" :y="true">
          <div>
            {{ customData.openWith }}
          </div>
          <div>
            {{ data.openWith }}
          </div>

          <div class="w-full h-12 rounded-lg">
            <div class="w-full p-3 h-11 flex" v-for="item in 10">
              <div class="flex-1"></div>
              <div class="flex items-center">
                {{ currentOpenWith?.name }}
                <xt-mix-icon
                  icon="fluent:caret-down-12-filled"
                  class="tt-no-bg ml-2"
                  iconStyle="color: var(--active-bg)"
                />
              </div>
            </div>
          </div>
        </xt-scrollbar>
        <History v-else :selectIndex="ctrlSelectIndex" />
      </main>
      <footer
        class="h-10 tt-main-bg flex items-center justify-between px-2 text-xs"
      >
        <div class="tt-text-3 flex h-8 items-center">
          <div class="p-1 rounded-md ml-1 tt-bg-2-t px-1">Tab</div>
          <div class="ml-1">切换搜索方式</div>
          <div class="p-1 rounded-md ml-1tt-bg-2-t px-1">Ctrl</div>
          <div class="p-1 rounded-md ml-1 tt-bg-2-t px-1">1-9</div>
          <div class="ml-1">快速打开候选项</div>
          <div class="p-1 rounded-md ml-1 tt-bg-2-t px-1">1-8</div>
          <div>快速切换类型</div>
        </div>
        <xt-mix-icon icon="fluent:search-16-regular" @click="search" />
      </footer>
    </div>
  </xt-modal>
</template>
<style lang="scss" scoped></style>
