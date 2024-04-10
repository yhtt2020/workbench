<script setup lang="ts">
import { ref, onBeforeMount, computed, watch, onMounted } from "vue";
import { storeToRefs } from "pinia";
import WuJie from "../wujie/WuJie.vue";

import { useTTAppStore } from "../../store";
const ttappStore: any = useTTAppStore();
const { modal, ttappList } = storeToRefs(ttappStore);
// 窗口弹窗
const modalRef: any = ref(null);

const data: any = ref({});

/** 初始化方法 */
const init = () => {
  // 开始
  loading.value = true;
  let res = ttappStore.select(modal.value.id);

  if (!res) {
    return;
  }
  data.value = res;

  // 完成
  loading.value = false;
};

/** 刷新 */
const loading = ref(true);
const refresh = () => {
  loading.value = true;
  setTimeout(() => {
    loading.value = false;
  }, 1);
};
const index = ref(1000);
const isTop = ref(false);
/** 右键菜单 */
const menuList = computed(() => {
  let res = [
    { name: "刷新", fn: refresh },
    {
      name: isTop.value ? "取消置顶" : "置顶",
      fn: () => {
        isTop.value = !isTop.value;
        if (isTop.value) {
          index.value = 999999;
        } else {
          index.value = 1000;
        }
      },
    },
  ];
  return res;
});

/** 窗口关闭 */
const close = () => {
  modalRef.value.close();
};

watch(
  () => modal.value?.id,
  () => {
    init();
  },
  {
    deep: true,
  }
);
onBeforeMount(() => {
  init();
});

/** 最大化 */
const isMax = ref(false);
const modalSize = computed(() => {
  if (isMax.value) {
    return {
      width: "100%",
      height: "100%",
    };
  } else {
    return {
      width: data.value.main.width,
      height: data.value.main.height,
    };
  }
});
//
const max = (value: boolean) => {
  isMax.value = value;
};

import PerfectScrollbar from "perfect-scrollbar";
const scrollbar: any = ref(null);
const perfectScrollbar: any = ref(null);
onMounted(() => {
  setTimeout(() => {
    perfectScrollbar.value = new PerfectScrollbar(scrollbar.value, {});
  }, 1);
});
</script>

<template>
  <xt-modal
    v-if="data"
    v-model="modal.visible"
    handle=".xt-modal-header"
    boxClass=""
    headerClass="p-2"
    :index="index"
    min
    max
    esc
    @max="max"
    ref="modalRef"
    :mask="false"
    class="xt-text"
  >
    <!-- 头部左侧区域 -->
    <template #header-left>
      <div class="mr-2 rounded-lg overflow-hidden">
        <a-avatar shape="square" class="" :size="20" :src="data._logo" />
      </div>
      {{ data.name }}
    </template>
    <!-- 头部右侧区域 -->
    <template #header-right>
      <xt-button
        class="ml-3 tt-modal-button"
        w="32"
        h="32"
        radius="8"
        @click="refresh"
      >
        <xt-ify-icon icon="fluent:arrow-clockwise-16-regular" />
      </xt-button>
    </template>
    <!-- 左侧导航 -->
    <!-- <template #nav>
      <div></div>
      <xt-left-menu />
    </template> -->
    <xt-mix-menu :menus="menuList" :stopPropagation="false">
      <div
        class="relative w-full h-full overflow-hidden"

        ref="scrollbar"
        :style="modalSize"
      >
        <WuJie v-if="!loading" :url="data.main._entry" :name="data.id" />
      </div>
    </xt-mix-menu>
    <!-- 最小化左侧 -->
    <template #minimize-left>
      <div class="mr-2 rounded-lg overflow-hidden">
        <a-avatar shape="square" class="" :size="28" :src="data._logo" />
      </div>
      <!-- <div class="mr-2 xt-text">{{ data.name }}</div> -->
    </template>
    <!-- 最小化右侧 -->
    <template #minimize-right>
      <xt-button class="ml-2" w="32" h="32" radius="8" @click="close">
        <xt-new-icon
          icon="fluent:dismiss-16-regular"
          size="16"
          class="xt-text-2"
        />
      </xt-button>
    </template>
  </xt-modal>
</template>
<style lang="scss" scoped></style>
