<!-- 壁纸弹窗应用 -->
<template>
  <div class="w-full">
   <template v-if="endNumVisible">
     <xt-left-menu
       :list="newGalleryList"
       leftClass="xt-bg-m rounded-l-xl"
       leftMargin="mr-0 pb-3 mb-0"
       model="id"
       v-model:index="leftIndex"
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
       leftMargin="mr-0 pb-3 mb-0"
       model="id"
       v-model:index="leftIndex"
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
import { computed, getCurrentInstance, nextTick, onMounted, ref,watch } from "vue";
import _ from "lodash-es";
import { storeToRefs } from "pinia";
import { pickPaperStore } from "../../../page/gallery/store/PickPaperStore";
import GalleryComponent from "../components/GalleryComponent.vue";
const {proxy} = getCurrentInstance()
onMounted(()=>{
  proxy.$bus.on("",()=>{
    currentPaperTab({type:"s"})
  })
})
const pickPaper = pickPaperStore();
const { currentID } = storeToRefs(pickPaper);
// 111
/**壁纸左侧列表**/
const paperLeftList = ref([
  {
    newIcon: "fluent:star-16-filled",
    id: 0,
    type:"m",
    bg: "var(--secondary-bg)",
    callBack: (item) => {
      currentPaperTab(item);
    },
  },
  {
    newIcon: "fluent:emoji-smile-slight-24-filled",
    id: 1,
    type:"w",
    bg: "var(--secondary-bg)",
    callBack: (item) => {
      currentPaperTab(item);
    },
  },
  {
    newIcon: "uim:bing",
    id: 2,
    type:"b",
    bg: "var(--secondary-bg)",
    callBack: (item) => {
      currentPaperTab(item);
    },
  },
  {
    newIcon: "fluent:image-multiple-16-filled",
    id: 3,
    type:"p",
    bg: "var(--secondary-bg)",
    callBack: (item) => {
      currentPaperTab(item);
    },
  },
  // {
  //   newIcon: "fluent:image-sparkle-16-filled",
  //   id: 4,
  //   type:"l",
  //   bg: "var(--secondary-bg)",
  //   callBack: (item) => {
  //     currentPaperTab(item);
  //   },
  // },
  {
    newIcon: "fluent:settings-16-filled",
    id: 5,
    type:"s",
    route: { name: "papersSetting" },
    callBack: (item) => {
      currentPaperTab(item);
    },
  },
]);


// 根据当前环境是网页端还是PC端,如果是网页端需要将设置进行屏蔽
const newGalleryList = computed(() => {
  const filterArr = _.filter(paperLeftList.value, (item) => {
    return item.type !== "s" && item.type !== 'b';
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

// 根据当前页面选中左侧栏下标选中
const leftIndex = computed(()=>{
  const found = paperLeftList.value.find((item)=>{
    return String(item.type) === String(currentID.value);
  })
  return found?.id;
})

/**左侧栏tab切换**/
const currentPaperTab = (item) => {
  console.log('item :>> ', item);
  currentID.value = item.type;
};



</script>

<style lang="scss" scoped>
:deep(.xt-bt) {
  border-top: none !important;

}
:deep(.xt-br) {
  border-right: none !important;
  & .xt-container{
    & div:first-of-type{
      margin: 0 !important;
    }
  }
}
</style>

<!-- & div{
    & div{
      margin-bottom: 3px !important;
    }
  } -->
