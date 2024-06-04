<!-- 壁纸弹窗应用 -->
<template>
  <div class="w-full">
   <template v-if="endNumVisible">
     <xt-left-menu
       :list="newGalleryList"
       leftClass="xt-bg-m rounded-l-xl"
       leftMargin="mr-0 py-3"
       w="64"
       :last="Math.floor(newGalleryList.length - 1)"
       :rightW="'w-full'"
     >
       <GalleryComponent :pageStatus="currentID" />
     </xt-left-menu>
   </template>
 
   <template v-else>
     <xt-left-menu
       :list="newGalleryList"
       leftClass="xt-bg-m rounded-l-xl"
       leftMargin="mr-0 py-3"
       w="64"
       end="1"
       :rightW="'w-full'"
     >
       <GalleryComponent :pageStatus="currentID" />
     </xt-left-menu>
   </template>

  </div>
</template>

<script setup>
import { computed, getCurrentInstance, nextTick, onMounted, ref } from "vue";
import _ from "lodash-es";
import { storeToRefs } from "pinia";

import { pickPaperStore } from "../../../page/gallery/store/PickPaperStore";
import GalleryComponent from "../components/GalleryComponent.vue";

const pickPaper = pickPaperStore();
const { currentID } = storeToRefs(pickPaper);

/**壁纸左侧列表**/
const paperLeftList = ref([
  {
    newIcon: "fluent:star-16-filled",
    id: "m",
    bg: "var(--secondary-bg)",
    callBack: (item) => {
      currentPaperTab(item);
    },
  },
  {
    newIcon: "fluent:emoji-smile-slight-24-filled",
    id: "w",
    bg: "var(--secondary-bg)",
    callBack: (item) => {
      currentPaperTab(item);
    },
  },
  {
    newIcon: "uim:bing",
    id: "b",
    bg: "var(--secondary-bg)",
    callBack: (item) => {
      currentPaperTab(item);
    },
  },
  {
    newIcon: "fluent:image-multiple-16-filled",
    id: "p",
    bg: "var(--secondary-bg)",
    callBack: (item) => {
      currentPaperTab(item);
    },
  },
  {
    newIcon: "fluent:image-sparkle-16-filled",
    id: "l",
    bg: "var(--secondary-bg)",
    callBack: (item) => {
      currentPaperTab(item);
    },
  },
  {
    newIcon: "fluent:settings-16-filled",
    id: "s",
    route: { name: "papersSetting" },
    callBack: (item) => {
      currentPaperTab(item);
    },
  },
]);

// 根据当前环境是网页端还是PC端,如果是网页端需要将设置进行屏蔽
const newGalleryList = computed(() => {
  const filterArr = _.filter(paperLeftList.value, (item) => {
    return item.id !== "s";
  });
  if (window.$usePlat("web")) return filterArr;
  return paperLeftList.value;
});

// 根据当前环境是网页端还是PC端,如果是网页端取消分割
const endNumVisible = computed(() => {
  if (window.$usePlat("web")) {
    return true;
  } else {
    return false;
  }
});

/**左侧栏tab切换**/
const currentPaperTab = (item) => {
  currentID.value = item.id;
};
</script>

<style lang="scss" scoped>
:deep(.xt-bt) {
  border-top: none !important;
}
:deep(.xt-br) {
  border-right: none !important;
}
</style>
