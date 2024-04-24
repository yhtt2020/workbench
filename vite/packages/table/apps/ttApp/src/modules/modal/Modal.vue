<script setup lang="ts">
import {
  ref,
  onBeforeMount,
  computed,
  watch,
  onMounted,
  provide,
  nextTick,
} from "vue";
import { storeToRefs } from "pinia";
import WuJie from "../wujie/WuJie.vue";
import PerfectScrollbar from "perfect-scrollbar";
import { useRouter } from "vue-router";
import { useTTAppStore } from "../../store";
import { useWindowSize } from "@vueuse/core";
import { useAppCenterStore } from "../../../../appCenter/src/store";
import ModalSetting from "../modalSetting/ModalSetting.vue";

const appCenterStore = useAppCenterStore();
const { visible } = storeToRefs(appCenterStore);
const { width: windowWidth, height: windowHeight } = useWindowSize();
const ttappStore: any = useTTAppStore();
const { modal, ttappList } = storeToRefs(ttappStore);
// 窗口弹窗
const modalRef: any = ref(null);

// 主应用数据
const data: any = ref(null);
// 加载状态
const loading = ref(true);
// 社交列表
const socializeList: any = ref([]);
/** 初始化方法 */
const init = async () => {
  let res = ttappStore.select(modal.value.id);

  if (!res) {
    return;
  }
  // 有社区
  const community = data?.community;
  if (community) {
    let obj = {
      name: data.value?.name + "官方社群",
      typeName: "官方社群",
      fn: () => {},
    };
    socializeList.value.push(obj);
  }
  // 有元社区
  const yuanCommunity = data?.yuanCommunity;
  if (yuanCommunity) {
    let obj = {
      name: data.value?.name + "元社区圈子",
      typeName: "元社区圈子",
      fn: () => {},
    };
    socializeList.value.push(obj);
  }
  // 有群
  const group = data?.group;
  if (group) {
    let obj = {
      name: data.value?.name + "开发者交流群",
      typeName: "开发者交流群",
      fn: () => {},
    };
    socializeList.value.push(obj);
  }
  res.socializeList = socializeList;
  // 获取用户信息 没写完
  await ttappStore.getUserInfo(res.uid || 1);

  // 完成
  data.value = res;
  loading.value = false;
};

/** 刷新 */

const refresh = () => {
  loading.value = true;
  setTimeout(() => {
    loading.value = false;
  }, 1);
};

// const index = ref(1000);
// const isTop = ref(false);

/** 右键菜单 */
const menuList = computed(() => {
  let res = [
    { name: "刷新", fn: refresh },
    // {
    //   name: isTop.value ? "取消置顶" : "置顶",
    //   fn: () => {
    //     isTop.value = !isTop.value;
    //     if (isTop.value) {
    //       index.value = 999999;
    //     } else {
    //       index.value = 1000;
    //     }
    //   },
    // },
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

// 弹窗大小
const modalSize = computed(() => {
  if (!data.value) return;
  // 最大弹窗尺寸
  const maxModalHeight = windowHeight.value - 48;
  const maxModalWidth = windowWidth.value;
  // 弹窗尺寸
  const mainWidth = data.value.main.width || 0;
  const mainHeight = data.value.main.height || 0;
  const width = mainWidth.replace(/\D/g, "");
  const height = mainHeight.replace(/\D/g, "");
  // 当前弹窗尺寸
  const currentWidth = width > maxModalWidth ? maxModalWidth + "px" : mainWidth;
  const currentHeight =
    height > maxModalHeight ? maxModalHeight + "px" : mainHeight;
  if (isMax.value) {
    return {
      width: "100%",
      height: "100%",
    };
  } else {
    return {
      width: currentWidth,
      height: currentHeight,
    };
  }
});
// 是否最大化
const isMax = ref(false);
// 最大化切换
const max = (value: boolean) => {
  isMax.value = value;
};

const openCommunity = () => {
  $app.$router.push({
    name: "myCommunity",
    params: {
      no: data.value.community,
    },
  });
  close();
};
// 打开群聊 获取群头像 社群头像
const router = useRouter();
const openGroup = () => {
  const id = data.value.group;
  router.push({
    path: "/chatMain",
    query: {
      appOpenGroup: id,
    },
  });
};

const scrollbar: any = ref(null);
const perfectScrollbar: any = ref(null);
watch(
  () => data.value,
  (val) => {
    console.log("val :>> ", val);
    // 数据没加载时不执行
    if (!val) return;
    nextTick(() => {
      perfectScrollbar.value = new PerfectScrollbar(scrollbar.value, {
        wheelPropagation: false,
      });
    });
  },
  {
    immediate: true,
  }
);

/** 打开应用市场 */
const openAppStore = () => {
  visible.value = true;
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
/** 左侧菜单 */
const leftBaseMenu = computed(() => {
  return [
    {
      name: "应用市场",
      fn: openAppStore,
      icon: "fluent:building-shop-16-regular",
    },
    {
      name: "关于" + data.value.name,
      fn: openAboutModal,
      icon: "fluent:info-16-regular",
    },
    {
      name: "设置",
      fn: openSettingModal,
      icon: "fluent:settings-16-regular",
    },
  ];
});
const settingClose = () => {
  settingVisible.value = false;
};
</script>

<template>
  <!-- 关于弹窗 -->
  <xt-modal v-if="aboutVisible" v-model="aboutVisible" :mask="false">
    <div class="w-[280px] flex justify-center items-center flex-col">
      <a-avatar shape="square" :size="48" :src="data._logo" />
      <div class="my-3">{{ data?.name }}</div>
      <div class="tt-text-2">版本 {{ data?.version }}</div>
      <div class="my-3 text-sm">{{ data?.description }}</div>
      <div class="tt-link cursor-pointer" v-if="data?.projectUrl">访问官网</div>
    </div>
  </xt-modal>
  <!-- 设置弹窗 -->
  <xt-modal v-if="settingVisible" v-model="settingVisible" :mask="false" custom>
    <ModalSetting v-if="settingVisible" @close="settingClose" :data="data" />
  </xt-modal>
  <!-- 主应用弹窗 -->
  <xt-modal
    v-if="data"
    v-model="modal.visible"
    handle=".xt-modal-header"
    boxClass=""
    headerClass="p-2"
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
      <tippy :z-index="99999999999" trigger="mouseenter" placement="bottom">
        <!-- :interactive="true" -->
        <div
          class="group header-left hover:tt-theme-bg-2 relative pl-2 rounded-lg title h-[32px] flex items-center text-sm cursor-pointer"
        >
          <a-avatar shape="square" class="" :size="16" :src="data._logo" />
          <span class="mx-2">{{ data.name }}</span>
        </div>
        <template #content>
          <!-- <div
            class="transition-all tt-shadow rounded-xl tt-modal-bg px-2 pt-2 w-[240px] ml-[200px]"
            @click.stop.prevent=""
          > -->
          <!-- class="header-left-menu transition-all tt-shadow rounded-xl tt-modal-bg px-2 pt-2 absolute top-[35px] left-0 z-[999999] w-[240px]" -->
          <!-- <div class="flex text-sm mb-2 p-2">
              <a-avatar
                shape="circular"
                :size="36"
                :src="modal.userInfo?.avatar"
              />
              <div class="ml-2">
                <div class="text-sm">{{ modal.userInfo?.name }}</div>
                <div class="tt-text-2 mt-1 text-xs">开发者</div>
              </div>
            </div> -->
          <!-- 社交功能 -->
          <!-- <hr
              style="margin-bottom: 8px !important"
              v-if="socializeList.length"
            />
            <div
              v-for="item in socializeList"
              class="flex h-[40px] items-center mb-2 hover:tt-theme-bg-2 rounded-xl pl-3"
              @click.stop.prevent="item.fn"
            >
              <xt-mix-icon
                class="mr-2 tt-modal-bg"
                type="select"
                :icon="item?.icon"
              />
              {{ item.name }}
            </div> -->

          <!-- 基础功能 -->
          <!-- <hr style="margin-bottom: 8px !important" />
            <div
              class="flex h-[40px] items-center mb-2 hover:tt-theme-bg-2 rounded-xl pl-3"
              @click.stop.prevent="item.fn"
              v-for="item in leftBaseMenu"
            >
              <xt-mix-icon class="mr-2 tt-modal-bg" :icon="item.icon" />
              {{ item.name }}
            </div>
          </div> -->
        </template>
      </tippy>
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
          :url="modal.url"
          :id="data.id"
          :app-info="data"
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
.header-left {
  transition: all 0.3s;

  .header-left-menu {
    display: none;
  }
  &:hover .header-left-menu {
    display: block !important;
  }
}
</style>
