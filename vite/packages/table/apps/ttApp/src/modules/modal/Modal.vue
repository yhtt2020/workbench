<script setup lang="ts">
import { ref, onBeforeMount, computed } from "vue";
import { storeToRefs } from "pinia";
import WuJie from "../wujie/WuJie.vue";

import { useTTAppStore } from "../../store";
const ttappStore: any = useTTAppStore();
const { modal, ttappList } = storeToRefs(ttappStore);
// 窗口弹窗
const modalRef: any = ref(null);

/** 窗口关闭 */
const close = () => {
  modalRef.value.close();
};

const id = ref();
const url = ref();
const name = ref();
onBeforeMount(() => {
  // 开始加载
  id.value = modal.value.id;

  console.log(" id.value :>> ", id.value);
  console.log(" id.value :>> ", ttappList.value);
//  let res =  ttappList.value.find((item) => item.id === id.value);
  let res = ttappStore.select(id.value);
  console.log("res :>> ", res);

  if (!res) {
    return;
  }
  name.value = res.name;
  const main = res?.modules?.main;

  url.value = `ttapp://${id.value}/${main.entry}`;

  console.log('  url.value :>> ',   url.value);
  // 加载完成
  loading.value = false;
  if (!id) return;
});

/** 刷新 */
const loading = ref(true);
const refresh = () => {
  loading.value = true;
  setTimeout(() => {
    loading.value = false;
  }, 1);
};
/** 右键菜单 */
const menuList = computed(() => {
  let res = [{ name: "刷新", fn: refresh }];
  return res;
});
</script>

<template>
  <xt-modal
    v-model="modal.visible"
    handle=".xt-modal-header"
    boxClass=""
    headerClass="p-2"
    min
    max
    ref="modalRef"
    :mask="false"
    class="xt-text"
  >
    <!-- 头部左侧区域 -->
    <template #header-left>
      <xt-ify-icon class="mr-2" />
      {{ name }}
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
        {{ url }}2
        <WuJie :url="url" :name="id" />
      </div>
    </xt-mix-menu>
    <!-- 最小化左侧 -->
    <template #minimize-left>
      <div class="mr-2 xt-text">{{ name }}</div>
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
