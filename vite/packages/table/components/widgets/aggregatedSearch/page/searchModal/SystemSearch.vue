<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, inject, computed } from "vue";
import { highLightKeywords } from "../../utils";
import {
  getGroupData,
  getLikeData,
  getAppData,
  getNoteData,
  getTodoData,
  getClipboardData,
} from "./getSearchData.js";
import { storeToRefs } from "pinia";
import Scrollbar from "./Scrollbar.vue";
import { HistoryData } from "./types";
import { useAppModal } from "../../../../../hooks";
const words: any = inject("words");
const isWebSource = inject("isWebSource");
const currentSource = inject("currentSource");
const ctrlSelectIndex: any = inject("ctrlSelectIndex");
const saveSearchSource = inject("saveSearchSource") as Function;

const data: any = inject("data");

const currentIndex = ref(0);
import { startApp } from "../../../../../ui/hooks/useStartApp";
import { open } from "../../utils/open.js";
import { watchDebounced } from "@vueuse/core";

// const { type , value } = currentItem.value
//             startApp(type, value, router)
const systemList = computed(() => {
  let res = [
    {
      name: "全部",
      fn: async (words) => {},
    },
    {
      name: "收藏",
      fn: async (words) => {
        let likeData = getLikeData(words);
        if (likeData) {
          return likeData;
        }
      },
    },
    {
      name: "应用",
      fn: async (words) => {
        // 获取应用数据
        let appData = getAppData(words);
        if (appData) {
          return appData;
        }
      },
    },

    {
      name: "待办",
      fn: async (words) => {
        // 获取待办数据
        let todoData = getTodoData(words);
        if (todoData) {
          return todoData;
        }
      },
    },
    // {
    //   name: "剪切板",
    //   fn: async (words) => {
    //     // 获取剪切板数据
    //     let clipboardData = await getClipboardData(words);
    //     if (clipboardData) {
    //       return clipboardData;
    //     }
    //   },
    // },
    {
      name: "群聊",
      fn: async (words) => {
        // 获取群聊数据
        let groupData = getGroupData(words);
        if (groupData) {
          return groupData;
        }
      },
    },
    // {
    //   name: "系统",
    //   fn: async (words) => {},
    // },
  ];
  if (window.$usePlat("client")) {
    res.push({
      name: "备忘录",
      fn: async (words) => {
        let noteData = await getNoteData(words);
        if (noteData) {
          return noteData;
        }
      },
    });
  }
  return res;
});
const searchList = ref([]);
const loading = ref(false);
const allSearch = async (val) => {
  val = val.toString();
  loading.value = true;
  searchList.value = [];
  // 搜索指定源
  if (currentIndex.value !== 0) {
    let res = await systemList.value[currentIndex.value].fn(val);
    if (res) {
      searchList.value = [res];
    }
    loading.value = false;
    return;
  }

  let arr: any = [];
  for (let item of systemList.value) {
    if (item.name === "全部") {
      continue;
    }
    let res = await item.fn(val);
    if (res) {
      if (res.data.length > 2) {
        res.data = res.data.slice(0, 2);
        res.more = true;
      }
      arr.push(res);
    }
  }
  loading.value = false;

  searchList.value = arr;
};
watchDebounced(
  [words, currentIndex],
  async (val) => {
    console.log("watchDebounced :>> ", 123);
    ctrlSelectIndex.value = 0;
    await allSearch(words.value);
  },
  { debounce: 200, immediate: true }
);

const selectAll = (name) => {
  currentIndex.value = systemList.value.findIndex((item) => item.name === name);
};

const openSystemApp = (obj, name) => {
  console.log("obj :>> ", obj);
  const history: HistoryData = {
    name: obj.name,
    source: obj.icon,
    value: obj.value,
    showType: name,
    openWith: obj.type,
  };
  saveSearchSource();
  data.value.historyList.push(history);

  open(history);
};
</script>

<template>
  <xt-scrollbar
    :x="true"
    style="
      border-bottom: 1px solid var(--tt-primary-border-color);
      height: 50px;
      min-height: 50px;
    "
    class="w-full relative flex overflow-hidden tab-container flex-nowrap whitespace-nowrap mb-1"
  >
    <div
      @click="currentIndex = index"
      v-for="(item, index) in systemList"
      :style="[
        {
          'border-bottom':
            currentIndex == index
              ? '2px solid var(--tt-theme-color)'
              : '2px solid var(--modal-bg)',
        },
      ]"
      class="p-3 inline-flex items-center cursor-pointer"
    >
      <span class="">{{ item.name }}</span>
    </div>
  </xt-scrollbar>
  <Scrollbar>
    <div v-if="loading">搜索中……</div>
    <template v-else-if="searchList.length > 0" v-for="item in searchList">
      <div class="p-2.5 tt-text-3 w-full text-sm flex justify-between">
        <div>
          {{ item.name }}
        </div>
        <div
          class="cursor-pointer"
          @click="selectAll(item.name)"
          v-if="item.more"
        >
          查看全部
        </div>
      </div>

      <div
        class="w-full flex items-center justify-between h-11 p-2.5 cursor-pointer rounded-xl hover:tt-theme-bg-2"
        @click="openSystemApp(data, item.name)"
        v-for="data in item.data"
      >
        <xt-mix-icon :icon="data.icon" type="select" size="24" class="mr-2.5" />
        <div class="flex-1 truncate">
          {{ data?.name }}
        </div>
        <!-- <div class="ml-1 text-xs tt-text-3">{{ data.name }}</div> -->
      </div>
    </template>
    <template v-else>
      <div class="w-full h-full flex flex-col items-center justify-center">
        <xt-ify-icon
          icon="fluent-emoji:magnifying-glass-tilted-right"
          size="56"
          class="mb-4"
        />
        <span class="xt-text xt-font font-16">没有找到相关内容</span>
      </div>
    </template>
    <!-- <div>
      {{ items }}
    </div> -->
  </Scrollbar>
</template>

<style lang="scss" scoped>
.text-ellipsis {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
