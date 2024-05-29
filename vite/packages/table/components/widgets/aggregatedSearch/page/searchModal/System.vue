<script setup>
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
import { useAppModal } from "../../../../../hooks";
const words = inject("words");
const isWebSource = inject("isWebSource");
const currentSource = inject("currentSource");
const ctrlSelectIndex = inject("ctrlSelectIndex");
const currentIndex = ref(0);
import { startApp } from "../../../../../ui/hooks/useStartApp";

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
  let arr = [];
  // 获取便签数据
  let noteData = await getNoteData(val);
  if (noteData) {
    arr.push(noteData);
  }
  // 获取收藏数据
  let likeData = getLikeData(val);
  if (likeData) {
    arr.push(likeData);
  }

  // 获取应用数据
  let appData = getAppData(val);
  if (appData) {
    arr.push(appData);
  }
  // 获取待办数据
  let todoData = getTodoData(val);
  if (todoData) {
    arr.push(todoData);
  }
  // 获取群聊数据
  let groupData = getGroupData(val);
  if (groupData) {
    arr.push(groupData);
  }
  let clipboardData = await getClipboardData(val);
  if (clipboardData) {
    arr.push(clipboardData);
  }
  searchList.value = arr;
};

watch(
  words,
  (val) => {
    console.log("222222 :>> ", val);
    ctrlSelectIndex.value = 0;
    allSearch(val);
  },
  {
    immediate: true,
  }
);
const selectAll = (name) => {
  currentIndex.value = systemList.value.findIndex((item) => item.name === name);
};
const openNote = (data) => {};
const openSystemApp = (data, name) => {
  console.log("data :>> ", data);
  if (name === "应用") {
    startApp(data.type, data.value);
  } else if (name === "备忘录") {
    const { openApp } = useAppModal("note");
    openApp({
      customIndex: data.id,
    });
  }
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
    <template v-for="item in searchList">
      <div class="p-2.5 tt-text-3 w-full text-sm flex justify-between">
        <div>
          {{ item.name }}
        </div>
        <div class="cursor-pointer" @click="selectAll(item.name)">查看全部</div>
      </div>

      <div
        class="w-full flex h-11 p-2.5 justify-between items-center cursor-pointer"
        v-for="data in item.data"
        @click="openSystemApp(data, item.name)"
      >
        <div class="flex flex-1">
          <xt-mix-icon
            :icon="data.icon"
            type="select"
            size="24"
            class="mr-2.5"
          />

          <div class="flex-1 truncate">
            {{ data?.name }}
          </div>
        </div>
        <div>网页</div>
      </div>
    </template>
    <div>
      {{ items }}
    </div>
  </Scrollbar>
</template>

<style lang="scss" scoped></style>
