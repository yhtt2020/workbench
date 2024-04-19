<script setup lang="ts">
import { ref, onBeforeMount, computed, watch, onMounted } from "vue";
import { storeToRefs } from "pinia";
import WuJie from "../wujie/WuJie.vue";
import PerfectScrollbar from "perfect-scrollbar";
import { useRouter } from "vue-router";
import { useTTAppStore } from "../../store";
const ttappStore: any = useTTAppStore();
const { modal, ttappList } = storeToRefs(ttappStore);
// 窗口弹窗
const modalRef: any = ref(null);

const data: any = ref({});

/** 初始化方法 */
const id = ref();
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
const openCommunity = () => {
  $app.$router.push({
    name: "myCommunity",
    params: {
      no: data.value.community,
    },
  });
  close();
};
//
const max = (value: boolean) => {
  isMax.value = value;
};

const scrollbar: any = ref(null);
const perfectScrollbar: any = ref(null);
onMounted(() => {
  setTimeout(() => {
    perfectScrollbar.value = new PerfectScrollbar(scrollbar.value, {
      wheelPropagation: false,
    });
  }, 1);
});
/** 打开应用市场 */
// const aboutVisible = ref(false);
const openAppStore = () => {
};
/** 打开关于 */
const aboutVisible = ref(false);
const openAboutModal = () => {
  aboutVisible.value = true;
};
/** 打开应用 */
const settingVisible = ref(false);
const openSettingModal = () => {
  settingVisible.value = true;
};
</script>

<template>
  <!-- 关于弹窗 -->
  <xt-modal v-if="aboutVisible" v-model="aboutVisible" :mask="false">
    <div class="w-[280px] flex justify-center items-center flex-col">
      <a-avatar shape="square" :size="48" :src="data._logo" />
      <div class="my-3">{{ data?.name }}</div>
      <div class="tt-text-2">版本 {{ data?.version }}</div>
      <div class="my-3">{{ data?.description }}</div>
    </div>
  </xt-modal>
  <!-- 关于弹窗 -->
  <!-- <xt-modal v-if="aboutVisible" v-model="aboutVisible" :mask="false">
    <div class="w-[280px] flex justify-center items-center flex-col">
      <a-avatar shape="square" :size="48" :src="data._logo" />
      <div class="my-3">{{ data?.name }}</div>
      <div class="tt-text-2">版本 {{ data?.version }}</div>
      <div class="my-3">{{ data?.description }}</div>
    </div>
  </xt-modal> -->
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
      <div
        class="group hover:tt-theme-bg-2 relative pl-2 rounded-lg title min-w-[86px] h-[32px] flex items-center text-sm cursor-pointer"
      >
        <a-avatar shape="square" class="" :size="16" :src="data._logo" />
        <span class="mx-2">{{ data.name }}</span>

        <div
          class="tt-shadow rounded-xl tt-modal-bg p-2 absolute bottom-[-423px] left-0 z-[999999] w-[240px] h-[423px]"
        >
          <div class="flex" @click="openAppStore">
            <xt-mix-icon class="mr-2" icon="fluent:building-shop-16-regular" />
            应用市场
          </div>
          <div class="flex" @click="openAboutModal">
            <xt-mix-icon class="mr-2" icon="fluent:info-16-regular" />
            关于{{ data.name }}
          </div>
          <div class="flex" @click="openSettingModal">
            <xt-mix-icon class="mr-2" icon="fluent:settings-16-regular" />
            设置
          </div>
        </div>
      </div>
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
      <xt-button
        title="打开社群"
        v-if="data.community"
        class="ml-3 tt-modal-button"
        w="32"
        h="32"
        radius="8"
        @click="openCommunity"
      >
        <xt-ify-icon icon="fluent:comment-multiple-16-regular" />
      </xt-button>
    </template>
    <!-- 左侧导航 -->
    <!-- <template #nav>
      <div></div>
      <xt-left-menu />
    </template> -->
    <xt-mix-menu :menus="menuList" :stopPropagation="false">
      <div
        class="relative w-full h-full overflow-hidden px-4"
        ref="scrollbar"
        :style="modalSize"
      >
        <WuJie
          v-if="!loading"
          :url="data.main._entry"
          :id="data.id"
          :app-info="{ ...data }"
        />
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
<style lang="scss" scoped>
.title {
  &:hover {
    // background: red;
  }
}
</style>
