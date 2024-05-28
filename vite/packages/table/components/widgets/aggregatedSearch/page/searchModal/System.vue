<script setup>
import { ref, onMounted, onBeforeUnmount, inject, computed } from "vue";
import { highLightKeywords } from "../../utils";
import { favoStore as useFavoStore } from "../../../../../apps/favorites/store";
import { noteStore as useNoteStore } from "../../../../../apps/note/store";
import { storeToRefs } from "pinia";
import Scrollbar from "./Scrollbar.vue";
const words = inject("words");
const isWebSource = inject("isWebSource");
const currentSource = inject("currentSource");
const currentIndex = ref(0);

const favoStore = useFavoStore();
const { allList } = storeToRefs(favoStore);
const noteStore = useNoteStore();
noteStore.getNotes();
const { noteList } = storeToRefs(noteStore);

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

const init = () => {
  // 获取收藏数据
  favoStore.getFavoList();
};

const systemData = computed(() => {
  let res = [];
  return res;
});
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
    {{ noteList }}
  </Scrollbar>
</template>

<style lang="scss" scoped></style>
