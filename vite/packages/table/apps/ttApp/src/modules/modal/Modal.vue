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

const url = ref();
onBeforeMount(() => {
  // 开始加载
  const id = modal.value.id;
  console.log("modal.value.id :>> ", modal.value.id);
  let res = ttappStore.select("SzLA");
  console.log("res :>> ", res);
  const main = res?.modules?.main;
  console.log("main :>> ", main);
  url.value = main?.entry;
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

// 测试内容
/**
 * 如何解决挂载多应用不注销情况
 * 1 通过 keep-alive 解决缓存问题
 * 2 通过 遍历应用生成对象
 */
const list = [
  {
    id: "SzLA",
    url: "tsbapp://SzLA/index.html",
    component: WuJie,
  },
  {
    id: "23334",
    url: "",
    component: WuJie,
  },
];

const currentCom = ref(WuJie);
const currentComKey = ref("");
const currentUrl = ref("");
const a = ref(true);
const test = () => {
  a.value = !a.value;
  if (a.value) {
    currentComKey.value = "SzLA";
    currentUrl.value = "http://localhost:5173/resume";
  } else {
    currentComKey.value = "ddd";
    currentUrl.value = "ttapp://SzLA/index.html";
  }
};
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
      xxxx
    </template>
    <!-- 头部右侧区域 -->
    <template #header-right>
      <xt-button class="ml-3" w="32" h="32" radius="8" @click="refresh">
        <xt-ify-icon icon="fluent:arrow-clockwise-16-regular" />
      </xt-button>
    </template>
    <!-- 左侧导航 -->
    <!-- <template #nav>
      <div>放着玩</div>
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
        <!-- <WuJie :url="url" /> -->
        <xt-button @click="test">test {{ a }}</xt-button>
        {{ currentUrl }}
        <keep-alive>
          <WuJie
            :url="currentUrl"
            :key="currentComKey"
          ></WuJie>
        </keep-alive>
        <!-- <component :is="list[modal.id]?.component" /> -->
        <!-- list -->

        <!--  -->
      </div>
    </xt-mix-menu>
    <!-- 最小化左侧 -->
    <template #minimize-left>
      <div class="mr-2 xt-text">xxxx</div>
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
