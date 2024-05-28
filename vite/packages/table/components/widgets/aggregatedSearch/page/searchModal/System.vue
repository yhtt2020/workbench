<script setup>
import { ref, onMounted, onBeforeUnmount, watch, inject, computed } from "vue";
import { highLightKeywords } from "../../utils";
import { favoStore as useFavoStore } from "../../../../../apps/favorites/store";
import { noteStore as useNoteStore } from "../../../../../apps/note/store";
import { useAppCenterStore } from "../../../../../apps/appCenter/src/store";

import { storeToRefs } from "pinia";
import Scrollbar from "./Scrollbar.vue";
const words = inject("words");
const isWebSource = inject("isWebSource");
const currentSource = inject("currentSource");
const currentIndex = ref(0);
const appCenterStore = useAppCenterStore();
const { myApps } = storeToRefs(appCenterStore);
const favoStore = useFavoStore();
const { allList } = storeToRefs(favoStore);
const noteStore = useNoteStore();
noteStore.getNotes();
const { noteList } = storeToRefs(noteStore);

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

const init = async (val) => {
  searchList.value = [];
  // 获取便签数据
  let noteList = await noteStore.searchNote(val);
  if (noteList.length) {
    noteList = noteList.map((item) => {
      return {
        ...item,
        name: item.customData.title,
      };
    });
    searchList.value.push({
      name: "备忘录",
      data: noteList,
    });
  }
  // 获取收藏数据
  let likeList = [];
  allList.value.forEach((item) => {
    let name = item.rename ? item.rename : item.name;
    if (name.includes(val) || item.url.includes(val)) {
      item.name = name;
      likeList.push(item);
    }
  });
  if (likeList.length) {
    searchList.value.push({
      name: "收藏",
      data: likeList,
    });
  }
  // 获取应用数据
  let appList = [];
  myApps.value.forEach((item) => {
    if (item.name.includes(val)) {
      appList.push(item);
    }
  });
  if (appList.length) {
    searchList.value.push({
      name: "应用",
      data: appList,
    });
  }
};
watch(words, (val) => {
  console.log("触发了 :>> ");
  init(val);
});
const selectAll = (name) => {
  currentIndex.value = systemList.value.findIndex((item) => item.name === name);
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
        class="h-11 p-2.5 flex justify-between items-center"
        v-for="data in item.data"
      >
        <div class="flex items-center">
          <xt-mix-icon />
          {{ data?.name }}
        </div>
        <!-- <div>网页</div> -->
      </div>
    </div>
  </Scrollbar>
</template>

<style lang="scss" scoped></style>
