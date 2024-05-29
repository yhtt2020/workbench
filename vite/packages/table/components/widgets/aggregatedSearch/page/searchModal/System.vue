<script setup>
import { ref, onMounted, onBeforeUnmount, watch, inject, computed } from "vue";
import { highLightKeywords } from "../../utils";
import { clipboardStore as useClipboardStore } from "../../../../../apps/clipboard/store";
import {
  getCommunityData,
  getLikeData,
  getAppData,
  getNoteData,
  getTodoData,
} from "./getSearchData";
import { storeToRefs } from "pinia";
import Scrollbar from "./Scrollbar.vue";
import { useAppModal } from "../../../../../hooks";
const words = inject("words");
const isWebSource = inject("isWebSource");
const currentSource = inject("currentSource");
const ctrlSelectIndex = inject("ctrlSelectIndex");
const currentIndex = ref(0);

// 剪切板数据
const clipboardStore = useClipboardStore();
const { items } = storeToRefs(clipboardStore);

// const { type , value } = currentItem.value
//             startApp(type, value, router)

const systemList = ref([
  {
    name: "全部",
  },
  {
    name: "收藏",
  },
  {
    name: "应用",
  },
  {
    name: "备忘录",
  },
  {
    name: "待办",
  },
  {
    name: "剪切板",
  },
  {
    name: "社群",
  },
  {
    name: "系统",
  },
]);
const searchList = ref([]);

const allSearch = async (val) => {
  searchList.value = [];
  // 获取便签数据
  let noteData = await getNoteData(val);
  if (noteData) {
    searchList.value.push(noteData);
  }
  // 获取收藏数据
  let likeData = getLikeData(val);
  if (likeData) {
    searchList.value.push(likeData);
  }

  // 获取应用数据
  let appData = getAppData(val);
  if (appData) {
    searchList.value.push(appData);
  }
  // 获取待办数据
  let todoData = getTodoData(val);
  if (todoData) {
    searchList.value.push(todoData);
  }
  let communityData = getCommunityData(val);
  if (communityData) {
    searchList.value.push(communityData);
  }
};



watch(words, (val) => {
  console.log('222222 :>> ', 222222);
  ctrlSelectIndex.value = 0;
  allSearch(val);
});
const selectAll = (name) => {
  currentIndex.value = systemList.value.findIndex((item) => item.name === name);
};
const openNote = (data) => {
  const { openApp } = useAppModal("note");
  openApp({
    customIndex: this.customIndex,
  });
};
const openSystemApp = (data) => {
  console.log("data :>> ", data);
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
    <div v-for="item in searchList">
      <div class="p-2.5 tt-text-3 text-sm flex justify-between">
        <div>
          {{ item.name }}
        </div>
        <div class="cursor-pointer" @click="selectAll(item.name)">查看全部</div>
      </div>
      <div
        @click="openSystemApp(data)"
        class="h-11 p-2.5 flex justify-between items-center cursor-pointer"
        v-for="data in item.data"
      >
        <div class="flex items-center">
          <xt-mix-icon
            :icon="data.icon"
            type="select"
            size="24"
            class="mr-2.5"
          />
          <span class="text-sm">
            {{ data?.name }}
          </span>
        </div>
        <!-- <div>网页</div> -->
      </div>
    </div>
    <div>
      {{ items }}
    </div>
  </Scrollbar>
</template>

<style lang="scss" scoped></style>
