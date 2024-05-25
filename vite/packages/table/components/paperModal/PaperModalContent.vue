<!-- 壁纸弹窗内容 -->
<template>
  <xt-modal
    v-if="contentVisible"
    v-model="contentVisible"
    custom
    :mask="false"
    boxClass="p-0"
    :maskIndex="1010"
    :index="1010"
    ref="paperModalRef"
  >
    <xt-left-menu
      :list="updatePaperLeftList"
      leftClass="xt-bg-m rounded-l-xl"
      leftMargin="mr-0 py-3"
      w="64"
      end="2"
      :index="currentStatus"
      :class="currentParams.maxVisible ? 'w-full h-full' : 'small-w'"
    >
      <div class="w-full xt-modal rounded-r-xl px-4 pt-4 pb-0">
        <!-- 我的收藏 -->
        <template v-if="currentStatus === 'm'">
          <My :isModal="true" />
        </template>

        <!-- 精选壁纸 -->
        <template v-else-if="currentStatus === 'w'">
          <SiftPaper :isModal="true" />
        </template>

        <!-- 必应壁纸 -->
        <template v-else-if="currentStatus === 'b'">
          <Bing :isModal="true" />
        </template>

        <!-- 拾光壁纸 -->
        <template v-else-if="currentStatus === 'p'">
          <Picking :isModal="true" />
        </template>

        <!-- 动态壁纸 -->
        <template v-else-if="currentStatus === 'l'">
          <Lively :isModal="true" />
        </template>

        <!-- 设置 -->
        <template v-else-if="currentStatus === 's'">
          <Setting :isModal="true" />
        </template>
      </div>
    </xt-left-menu>
  </xt-modal>
</template>

<script setup>
import { computed, getCurrentInstance, nextTick, onMounted, ref } from "vue";
import _ from "lodash-es";
import { storeToRefs } from "pinia";
import { pickPaperStore } from "../../page/gallery/store/PickPaperStore";

import My from "../../page/gallery/My.vue";
import Bing from "../../page/gallery/Bing.vue";
import Lively from "../../page/gallery/Lively.vue";
import Picking from "../../page/gallery/Picking.vue";
import Setting from "../../page/gallery/Setting.vue";
import SiftPaper from "../../page/gallery/SiftPaper.vue";

const pickPaper = pickPaperStore();
const { currentID } = storeToRefs(pickPaper);

/**判断是否最大化**/
const currentParams = ref({
  maxVisible: false,
});

/**组件dom**/
const paperModalRef = ref(null);
const { proxy } = getCurrentInstance();

/**触发壁纸弹窗**/
const contentVisible = ref(false);
const openContentModal = () => {
  contentVisible.value = true;
};

/**壁纸左侧列表**/
const paperLeftList = ref([
  {
    newIcon: "fluent:star-16-regular",
    id: "m",
    bg: "var(--secondary-bg)",
    callBack: (item) => {
      currentPaperTab(item);
    },
  },
  {
    newIcon: "fluent:emoji-smile-slight-24-regular",
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
    newIcon: "fluent:image-multiple-16-regular",
    id: "p",
    bg: "var(--secondary-bg)",
    callBack: (item) => {
      currentPaperTab(item);
    },
  },
  {
    newIcon: "fluent:image-sparkle-16-regular",
    id: "l",
    bg: "var(--secondary-bg)",
    callBack: (item) => {
      currentPaperTab(item);
    },
  },
  {
    newIcon: "fluent:full-screen-maximize-16-filled",
    id: "f",
    callBack: (item) => {
      openMaxScreen();
    },
  },
  {
    newIcon: "fluent:settings-16-regular",
    id: "s",
    route: { name: "papersSetting" },
    callBack: (item) => {
      currentPaperTab(item);
    },
  },
]);
/**根据窗口最大化将图标进行更新**/
const updatePaperLeftList = computed(() => {
  if (currentParams.value.maxVisible) {
    const mapList = _.map(paperLeftList.value, (item) => {
      if (item.index === "f") {
        return {
          newIcon: "fluent:full-screen-minimize-16-filled",
          callBack: item.callBack,
          index: item.index,
        };
      } else {
        return item;
      }
    });
    return mapList;
  } else {
    return paperLeftList.value;
  }
});

/**左侧栏tab切换**/
const currentPaperTab = (item) => {
  currentID.value = item.id;
};

/**开启全屏化**/
const openMaxScreen = () => {
  currentParams.value.maxVisible = !currentParams.value.maxVisible;
  paperModalRef.value.maximize();
};

/**计算当前状态**/
const currentStatus = computed(() => {
  console.log("排查", currentID.value);
  if (currentID.value) {
    return currentID.value;
  } else {
    return "m";
  }
});

onMounted(() => {
  proxy.$bus.on("closePaper", () => {
    contentVisible.value = false;
  });
});
defineExpose({
  openContentModal,
});
</script>

<style lang="scss" scoped>
.small-w {
  width: 976px !important;
  height: 600px !important;
}
:deep(.xt-bt) {
  border-top: none !important;
}
:deep(.xt-br) {
  border-right: none !important;
}
</style>