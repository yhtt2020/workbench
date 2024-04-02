<script setup lang="ts">
import { ref, onBeforeMount, computed } from "vue";
import { storeToRefs } from "pinia";
import WuJie from "../wujie/WuJie.vue";

import { useTTAppStore } from "../../store";
import { getAppImg } from "../../hooks/getAppImg";
const ttappStore: any = useTTAppStore();
const { modal, ttappList } = storeToRefs(ttappStore);
// 窗口弹窗
const modalRef: any = ref(null);

const data: any = ref();
const url = ref();
onBeforeMount(() => {
  // 开始加载
  let res = ttappStore.select(modal.value.id);

  if (!res) {
    return;
  }
  data.value = {
    ...res,
    modal: res.modules.main,
  };
  const main = res?.modules?.main;
  console.log("res :>> ", data.value);

  url.value = `ttapp://${data.value.id}/${main.entry}`;
  // 加载完成
  loading.value = false;
});

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
const headerImg = computed(() => {
  return getAppImg(data.value.id, data.value.logo);
});
</script>

<template>
  <xt-modal
    v-model="modal.visible"
    handle=".xt-modal-header"
    boxClass=""
    headerClass="p-2"
    :index="index"
    min
    max
    ref="modalRef"
    :mask="false"
    class="xt-text"
  >
    <!-- 头部左侧区域 -->
    <template #header-left>
      <div class="mr-2 rounded-lg overflow-hidden">
        <a-avatar shape="square" class="" :size="20" :src="headerImg" />
      </div>
      {{ data.name }}
    </template>
    <!-- 头部右侧区域 -->
    <template #header-right>
      <xt-button class="ml-3" w="32" h="32" radius="8" @click="refresh">
        <xt-ify-icon icon="fluent:arrow-clockwise-16-regular" />
      </xt-button>
    </template>
    <!-- 左侧导航 -->
    <!-- <template #nav>
      <div></div>
      <xt-left-menu />
    </template> -->
    <xt-mix-menu :menus="menuList">
      <div
        class="overflow-hidden h-full"
        v-if="!loading"
        style="background: #fff"
      >
        <!-- 数据 -->
        <!-- <div style="height: 400px; width: 700px; background: pink"></div> -->
        <WuJie :url="url" :name="data.id" />
      </div>
    </xt-mix-menu>
    <!-- 最小化左侧 -->
    <template #minimize-left>
      <div class="mr-2 rounded-lg overflow-hidden">
        <a-avatar shape="square" class="" :size="28" :src="headerImg" />
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
