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
// 弹窗大小
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
// 是否最大化
const isMax = ref(false);
// 最大化切换
const max = (value: boolean) => {
  isMax.value = value;
};

// groupid

const openCommunity = () => {
  $app.$router.push({
    name: "myCommunity",
    params: {
      no: data.value.community,
    },
  });
  close();
};
// timingSafeEqual,$ROUTER,XXXX

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
onMounted(() => {
  setTimeout(() => {
    perfectScrollbar.value = new PerfectScrollbar(scrollbar.value, {
      wheelPropagation: false,
    });
  }, 1);
});
/** 打开应用市场 */
// const aboutVisible = ref(false);
const openAppStore = () => {};
/** 打开关于 */
const aboutVisible = ref(false);
const openAboutModal = () => {
  openGroup();
  aboutVisible.value = true;
};
/** 打开应用 */
const settingVisible = ref(false);
const openSettingModal = () => {
  settingVisible.value = true;
};
/** 左侧菜单 */
const leftMenu = computed(() => {
  return [
    // {
    //   name: "应用市场",
    //   fn: openAppStore,
    //   icon: "fluent:building-shop-16-regular",
    // },
    {
      name: "关于",
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

const settingMenu = [
  {
    name: "应用信息",
    icon: "fluent:info-16-regular",
    fn: () => {},
  },
  {
    name: "消息通知",
    icon: "fluent:alert-16-regular",
    fn: () => {},
  },
  {
    name: "数据存储",
    icon: "fluent:hard-drive-16-regular",
    fn: () => {},
  },
  {
    name: "隐私权限",
    icon: "",
    fn: () => {},
  },
];
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
  <!-- 设置弹窗 -->
  <xt-modal v-if="settingVisible" v-model="settingVisible" :mask="false" custom>
    <div class="w-[700px] h-[634px] flex">
      <div class="w-[200px] tt-main-bg p-3">
        <div
          class="flex items-center tt-theme-bg-2 h-[44px] rounded-[10px] mb-2"
          v-for="item in settingMenu"
        >
          <xt-mix-icon class="mx-2" :icon="item.icon" /> {{ item.name }}
        </div>
      </div>
      <div class="flex-1 p-4">
        <xt-scrollbar :y="true" class="h-full">
          <xt-option-box>
            <div class="flex text-sm mb-4">
              <div>
                <a-avatar shape="square" :size="48" :src="data._logo" />
              </div>
              <div class="ml-4">
                <div class="">{{ data?.name }}</div>
                <div class="tt-text-2 mt-1">版本 {{ data?.description }}</div>
              </div>
            </div>
          </xt-option-box>

          <xt-option-box>
            <div class="flex text-sm mb-4">
              <div>
                <a-avatar shape="square" :size="48" :src="data._logo" />
              </div>
              <div class="ml-4">
                <div class="">开发者名字</div>
                <div class="tt-text-2 mt-1">开发者</div>
              </div>
            </div>
          </xt-option-box>

          <xt-option-box>
            <div class="flex text-sm mb-4 justify-between">
              <div>版本</div>
              <div class="tt-text-2">{{ data?.version }}</div>
            </div>
            <hr />
            <div class="flex text-sm mb-4 justify-between">
              <div>官网</div>
              <div class="tt-link">立即访问</div>
            </div>
          </xt-option-box>

          <xt-option-box>
            <div class="flex text-sm mb-4 justify-between">
              <div>社群</div>
              <div class="tt-text-2">{{ data.name }}官方社群</div>
            </div>
            <hr />
            <div class="flex text-sm mb-4 justify-between">
              <div>群聊</div>
              <div class="tt-text-2">{{ data.name }}开发者交流群</div>
            </div>
            <hr />
            <div class="flex text-sm mb-4 justify-between">
              <div>圈子</div>
              <div class="tt-text-2">{{ data.name }}元社区圈子</div>
            </div>
          </xt-option-box>

          <xt-option-box>
            <div class="flex text-sm mb-[15px] justify-between">
              <div>允许消息通知</div>
              <a-switch />
            </div>
          </xt-option-box>

          <xt-option-box>
            <div class="flex text-sm mb-[15px] justify-between">
              <div>应用数据</div>
              <div class="tt-text-2"></div>
            </div>
          </xt-option-box>
          <xt-button class="xt-main-bg" h="32" block>
            <div class="tt-text-2 text-sm">清除应用数据</div>
          </xt-button>
          <div class="tt-text-2 text-xs mt-1 mb-3">
            这将会删除应用保存的数据，如个人设置偏好等，将应用恢复为初始安装状态。
          </div>
          <xt-button class="xt-main-bg" h="32" block>
            <div class="tt-error text-sm">完全删除应用</div></xt-button
          >
          <div class="tt-text-2 text-xs mt-1">
            这将会完全卸载应用，同时会删除所有相关删除，此操作不可撤销。
          </div>

          <xt-option-box>
            <div class="flex text-sm mb-[15px] justify-between items-center">
              <div>允许应用获取地理位置信息</div>
              <a-switch />
            </div>
          </xt-option-box>
          <xt-option-box>
            <div class="flex text-sm mb-4 justify-between">
              <div>允许应用读取和写入「备忘录应用」数据</div>
              <a-switch />
            </div>
            <hr />
            <div class="flex text-sm mb-4 justify-between">
              <div>允许应用读取和写入「待办应用」数据</div>
              <a-switch />
            </div>
            <hr />
            <div class="flex text-sm mb-4 justify-between">
              <div>允许应用读取和写入「快捷指令」数据</div>
              <a-switch />
            </div>
          </xt-option-box>
        </xt-scrollbar>
      </div>
    </div>
  </xt-modal>
  <!-- 主应用弹窗 -->
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
          @click.stop.prevent=""
          class="group-hover:opacity-000 transition-all opacity-0 tt-shadow rounded-xl tt-modal-bg p-2 absolute top-[35px] left-0 z-[999999] w-[240px]"
        >
          <div
            class="flex h-[40px] items-center mt-2 hover:tt-theme-bg-2 rounded-xl pl-3"
            @click.stop.prevent="item.fn"
            v-for="item in leftMenu"
          >
            <xt-mix-icon class="mr-2" :icon="item.icon" />
            {{ item.name }}
          </div>
          <div
            class="flex h-[40px] items-center mt-2 hover:tt-theme-bg-2 rounded-xl pl-3"
            @click.stop.prevent="item.fn"
            v-for="item in leftMenu"
          >
            <xt-mix-icon class="mr-2" :icon="item.icon" />
            {{ item.name }}
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
<style lang="scss" scoped></style>
