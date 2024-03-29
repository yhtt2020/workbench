<template>
  <Teleport to="body">
    <!-- 弹窗 -->
    <xt-drag
      v-model:x="x"
      v-model:y="y"
      :index="index"
      :collision="false"
      v-if="modelValue"
      @update:data="resizeModel"
      handle=".xt-modal-header"
    >
      <!--  -->
      <div
        :class="[boxClass, isFull ? 'rounded-none' : 'rounded-xl']"
        ref="modal"
        class="no-drag flex flex-col text-base rounded-xl xt-modal xt-shadow xt-text"
        style="
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.5);
          transition: 'all 0.3s ease-in-out';
        "
        :style="[
          isFullStyle,
          {
            opacity: show ? '1' : '0',
          },
        ]"
      >
        <slot v-if="custom"></slot>
        <template v-else>
          <div class="flex flex-1 w-full">
            <!-- 左侧 -->
            <nav v-if="nav">
              <slot name="nav"> </slot>
            </nav>
            <!-- 主体区域 -->
            <main class="flex flex-col flex-1 h-full">
              <!-- 主体头部 -->
              <header
                class="relative flex items-center mb-4 xt-modal-header"
                v-if="header"
              >
                <!-- 标题左侧 -->
                <div class="z-20 flex items-center flex-1">
                  <slot name="header-left"> </slot>
                </div>
                <!-- 标题中间 -->
                <div
                  class="absolute z-10 flex items-center flex-1 text-center -translate-x-1/2 left-1/2"
                >
                  <slot name="header-center">
                    {{ title }}
                  </slot>
                </div>
                <!-- 标题右侧 -->
                <div class="right-0 z-20 flex items-center">
                  <slot name="header-right"> </slot>
                  <xt-ify-icon @click="minimize" />
                  <xt-button
                    class="ml-3"
                    w="32"
                    h="32"
                    radius="8"
                    @click="isFull = !isFull"
                  >
                    <!-- v-if="full" -->

                    <xt-new-icon
                      :icon="
                        isFull
                          ? 'fluent:full-screen-minimize-16-filled'
                          : 'fluent:full-screen-maximize-16-regular'
                      "
                      size="16"
                      class="xt-text-2"
                    />
                  </xt-button>
                  <xt-button
                    class="ml-3"
                    w="32"
                    h="32"
                    radius="8"
                    @click="onNo()"
                  >
                    <xt-new-icon
                      icon="fluent:dismiss-16-regular"
                      size="16"
                      class="xt-text-2"
                    />
                  </xt-button>
                </div>
              </header>
              <!-- 主体内容区 -->
              <vue-custom-scrollbar
                :settings="{
                  swipeEasing: true,
                  suppressScrollY: false,
                  suppressScrollX: true,
                  wheelPropagation: false,
                }"
                style="position: relative"
                :style="scrollbarPadding"
                class="flex-1"
              >
                <slot>
                  <McDonalds />
                </slot>
              </vue-custom-scrollbar>
            </main>
          </div>
          <slot name="footer">
            <footer class="flex items-center justify-end mt-4" v-if="footer">
              <xt-button w="64" h="40" @click="onNo()">
                <span class="xt-text-2">{{ noName }}</span>
              </xt-button>
              <xt-button
                w="64"
                h="40"
                class="ml-3"
                type="theme"
                @click="onOk()"
                >{{ okName }}</xt-button
              >
            </footer>
          </slot>
        </template>
      </div>
    </xt-drag>
    <!-- 遮罩 -->
    <div
      v-if="modelValue && mask"
      @click.stop.self="onNo()"
      class="fixed top-0 bottom-0 left-0 w-full h-full xt-mask ring-0"
      :style="{
        'z-index': maskIndex,
      }"
    ></div>
    <!-- 最小化 -->
    <div
      :style="minimizeStyle"
      class="fixed xt-theme-b xt-theme-bg rounded-xl"
      :class="minimizeState ? '' : 'pop'"
      @click="restore"
    >
      1111211111
    </div>
  </Teleport>
</template>

<script setup lang="ts">
const x = ref(-1000);
const y = ref(-1000);
import McDonalds from "./McDonalds.vue";
import {
  ref,
  watch,
  toRefs,
  onMounted,
  onBeforeUnmount,
  onBeforeMount,
  nextTick,
  computed,
  getCurrentInstance,
} from "vue";
import { useWindowSize } from "../drag/src/hooks/useWindowSize";
import { vElementSize } from "../drag/src/hooks/useElementSize";
export interface ModalProps {
  // 控制弹窗是否显示
  modelValue?: boolean;
  // 弹窗标题
  title?: string;
  noName?: string;
  okName?: string;
  // 弹窗层级
  index?: number;
  // 遮罩层级
  maskIndex?: number;
  // 是否使用遮罩
  mask?: boolean;
  nav?: boolean;
  // 头部插槽是否开启
  header?: boolean;
  // 底部插槽是否开启
  footer?: boolean;
  // esc 关闭弹窗
  esc?: boolean;
  // 弹窗样式
  boxClass?: string;
  // 挂载前
  beforeMount?: () => boolean;
  // 卸载前
  beforeUnmount?: () => boolean;
  // 自定义插槽
  custom?: boolean;
  // 开启全屏功能
  full?: boolean;
  scrollbarPadding?: {
    [key: string]: string;
    paddingRight: string;
    paddingLeft: string;
  };
  type: string | null;
}

const { proxy }: any = getCurrentInstance();

const props = withDefaults(defineProps<ModalProps>(), {
  modelValue: false,
  title: "",
  noName: "取消",
  okName: "确认",
  index: 1000,
  maskIndex: 100,
  mask: true,
  nav: true,
  header: true,
  footer: false,
  esc: false,
  boxClass: "p-4",
  beforeMount: () => true,
  beforeUnmount: () => true,
  custom: false,
  full: false,
  scrollbarPadding: { paddingRight: "0px", paddingLeft: "0px" },
  type: null,
});
const { esc, modelValue, beforeMount, beforeUnmount, type } = toRefs(props);
const isFull = ref(false);
const show = ref(false);
const emits = defineEmits(["ok", "no", "update:modelValue", "close", ""]);

const modal: any = ref(null);
let topBarHeight = 0;
let topUtilBarHeight = 0;
let bottomBarHeight = 0;
const windowHeight = ref(0);
const windowWidth = ref(0);
let intervalId;
function initPos() {
  intervalId = setInterval(() => {
    // 数据未加载完成时
    if (windowHeight.value <= 0 || modalHeight.value <= 0) return;
    let top;
    let left;
    if (props.mask) {
      top = (windowHeight.value - modalHeight.value) / 2;
      left = (windowWidth.value - modalWidth.value) / 2;
    } else {
      top = (windowHeight.value - bottomBarHeight - modalHeight.value) / 2;
      left = (windowWidth.value - modalWidth.value) / 2;
    }

    y.value = top;
    x.value = left;
    oldX.value = left;
    oldY.value = top;
    oldHeight.value = modalHeight.value;
    oldWidth.value = modalWidth.value;
    show.value = true;
    clearInterval(intervalId); // 数据加载完成后取消定时器
  }, 100);
}
const oldX = ref(0);
const oldY = ref(0);
const isFullStyle = computed(() => {
  if (isFull.value) {
    oldX.value = x.value;
    oldY.value = y.value;
    x.value = 0;
    y.value = 0;
    return {
      width: "100vw",
      height: "100vh",
    };
  }

  x.value = oldX.value;
  y.value = oldY.value;
  return {
    width: "auto",
  };
});
const modalWidth = ref(0);
const modalHeight = ref(0);
const oldWidth = ref(0);
const oldHeight = ref(0);
const resizeModel = (data) => {
  modalWidth.value = data.width;
  modalHeight.value = data.height;
};
const minimizeState = ref(false);
const minimizeStyle = computed(() => {
  if (minimizeState.value) {
    setTimeout(() => {
      show.value = true;
    }, 1000);
    return {
      transition: "all 0.15s linear",
      top: `${y.value}px`,
      left: `${x.value}px`,
      width: `${oldWidth.value}px`,
      height: `${oldHeight.value}px`,
      zIndex: props.index - 1,
    };
  }

  return {
    transition: "all 0.15s linear",
    bottom: "16%",
    right: "5%",
    width: " 200px",
    height: "60px",
    zIndex: props.index - 1,
  };
});
const restore = () => {
  // isFull.value = false;
  show.value = true;
  minimizeState.value = false;
};

/** 最小化实现 */
const minimize = () => {
  show.value = false;
  minimizeState.value = true;
};

const close = () => {
  emits("update:modelValue", false);
  emits("close");
};

const onNo = () => {
  if (!beforeUnmount.value()) return;
  emits("no");
  close();
};
const onOk = () => {
  emits("ok");
  close();
};
// esc关闭
const handleEscKeyPressed = (event) => {
  if (props.esc && event.keyCode === 27) {
    onNo();
  }
};
/**
 * 全屏状态切换
 * */
const updateFullState = () => {
  isFull.value = !isFull.value;
};
// 挂载前
onBeforeMount(() => {});
// 挂载后
onMounted(() => {
  const bottomBar = document.getElementsByClassName("xt-main-bottom-bar")[0];
  if (bottomBar) bottomBarHeight = bottomBar.clientHeight;
  initPos();
  // 注册单例弹窗监听
  if (props.type) {
    proxy.$bus.emit("modalClose", props.type);
    setTimeout(() => {
      proxy.$bus.on("modalClose", (currentType) => {
        if (type.value == currentType) {
          close();
        }
      });
    }, 1);
  }

  // 注册esc键监听
  if (esc.value) {
    window.addEventListener("keydown", handleEscKeyPressed, {
      capture: true,
    });
  }
  useWindowSize((size) => {
    windowHeight.value = size.height.value;
    windowWidth.value = size.width.value;
  });
});
// 卸载前
onBeforeUnmount(() => {
  if (props.type) {
    proxy.$bus.off("modalClose");
  }
  // 注销esc键监听
  if (esc.value) {
    window.removeEventListener("keydown", handleEscKeyPressed, {
      capture: true,
    });
  }
});
defineExpose({
  updateFullState,
  isFull,
});
</script>

<style lang="scss" scoped>
.pop {
  bottom: 16%;
  right: 5%;
  width: 200px;
  height: 60px;
}
</style>
