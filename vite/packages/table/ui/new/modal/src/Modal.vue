<template>
  <Teleport to="body">
    <!-- 弹窗 -->
    <xt-drag
      v-if="modelValue"
      :x="currentX"
      :y="currentY"
      :index="modalIndex"
      :handle="handle"
      :disabled="disabledDrag"
      :boundary="true"
      :test="false"
      :collision="false"
      :resetPosition="false"
      @update:x="updateX($event)"
      @update:y="updateY($event)"
      @update:data="resizeModel"
    >
      <div
        @click="modalClick"
        @keydown="handleKeyDown"
        :class="[custom ? '' : boxClass]"
        ref="modal"
        class="relative flex flex-col overflow-hidden text-base no-drag rounded-xl xt-modal xt-shadow xt-text"
        style="
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.5);
          max-width: 100vw !important;
          max-height: 100vh !important;
        "
        :style="[
          modalSizeStyle,
          {
            opacity: modalVisible ? '1' : '0',
          },
        ]"
      >
        <!-- 自定义 -->
        <slot v-if="custom"></slot>
        <div v-else class="flex w-full h-full overflow-hidden">
          <!-- 左侧 -->
          <nav class="h-full">
            <slot name="nav"></slot>
          </nav>
          <div class="flex flex-col w-full h-full">
            <!-- 头部 -->
            <slot name="header">
              <header
                class="relative flex items-center w-full no-drag xt-modal-header"
                :class="headerClass"
                v-if="header"
                @dblclick="doubleClick"
              >
                <!-- 标题左侧 -->
                <div class="z-20 flex items-center flex-1">
                  <slot name="header-left"></slot>
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
                  <slot name="header-right"></slot>
                  <!-- 最小化 -->
                  <xt-button
                    v-if="min"
                    class="ml-3 tt-modal-button"
                    w="32"
                    h="32"
                    radius="8"
                    @click="minimize"
                  >
                    <xt-ify-icon icon="fluent:subtract-16-regular"/>
                  </xt-button>
                  <!-- 最大化 -->
                  <xt-button
                    class="ml-3 tt-modal-button"
                    w="32"
                    h="32"
                    radius="8"
                    @click="maximize"
                    v-if="max"
                  >
                    <xt-new-icon
                      :icon="
                        isMaximize
                          ? 'fluent:full-screen-minimize-16-regular'
                          : 'fluent:full-screen-maximize-16-regular'
                      "
                      size="16"
                      class="xt-text-2"
                    />
                  </xt-button>
                  <!-- 全屏 -->
                  <xt-button
                    class="ml-3 tt-modal-button"
                    w="32"
                    h="32"
                    radius="8"
                    @click="fullscreen"
                    v-if="full"
                  >
                    <xt-mix-icon
                      :icon="
                        isFullScreen
                          ? 'fluent:arrow-minimize-16-regular'
                          : 'fluent:arrow-maximize-16-regular'
                      "
                      boxSize="32"
                      style="background: none"
                    />
                  </xt-button>
                  <!-- 关闭按钮 -->
                  <xt-button
                    class="ml-3 tt-modal-button"
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
            </slot>
            <!-- 内容区 -->
            <main
              ref="scrollbar"
              class="flex-1 h-0 overflow-hidden"
              :class="mainClass"
            >
              <slot>
                <McDonalds/>
              </slot>
            </main>
            <!-- 底部 -->
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
                >{{ okName }}
                </xt-button
                >
              </footer>
            </slot>
          </div>
        </div>
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
    <!-- 过渡动画 -->
    <div
      v-if="transitionVisible"
      :style="transitionStyle"
      style="transition: all 0.1s"
      class="fixed flex items-center justify-center px-2 cursor-pointer xt-modal rounded-xl"
      @click="minimize"
    >
      <slot name="minimize-left"></slot>
      <xt-button w="32" h="32" radius="8" v-if="isMinimize" class="px-2">
        <xt-new-icon
          icon="fluent:full-screen-maximize-16-regular"
          size="16"
          class="xt-text-2"
        />
      </xt-button>
      <slot name="minimize-right"></slot>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
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
import {useGlobalStore} from "../../../../apps/global/store";
// import { vElementSize } from "../../drag/src/hooks/useElementSize";
import {nanoid} from "nanoid";
import PerfectScrollbar from "perfect-scrollbar";
import {ModalProps} from "./types";
import {storeToRefs} from "pinia";

const globalStore = useGlobalStore();
const {windowHeight, windowWidth} = storeToRefs(globalStore);
import {useNavigationStore} from "../../../../components/desk/navigationBar/navigationStore";

const navStore = useNavigationStore();
const {currentMainH} = storeToRefs(navStore);

const {proxy}: any = getCurrentInstance();
// 类型注释在types.ts文件中
const props = withDefaults(defineProps<ModalProps>(), {
  modelValue: false,
  title: "",
  noName: "取消",
  okName: "确认",
  index: 999,
  maskIndex: 100,
  mask: true,
  nav: false,
  header: true,
  footer: false,
  esc: false,
  boxClass: "p-4",
  headerClass: "pb-4",
  mainClass: "",
  beforeMount: () => true,
  beforeUnmount: () => true,
  custom: false,
  scrollbarStyle: {paddingRight: "0px", paddingLeft: "0px"},
  type: null,
  min: false,
  max: false,
  full: false,
  handle: "",
  name: null,
  isFullScreen: false,
  isMaximize: false,
  isScrollbar: true,
});
const {esc, modelValue, beforeMount, beforeUnmount, type} = toRefs(props);

const emits = defineEmits([
  // 双向绑定弹窗显示状态
  "update:modelValue",
  // 双向绑定弹窗全屏状态
  "update:isFullScreen",
  // 双向绑定弹窗最大化状态
  "update:isMaximize",
  // 弹窗关闭事件
  "close",
  // 弹窗最小化事件
  "minimize",
  // 弹窗最大化事件
  "maximize",
  // 弹窗全屏事件
  "fullscreen",
  // 弹窗初始化事件
  "init",
  "ok",
  "no",
]);
/**
 * 弹窗变量
 */
// 弹窗滚动条
const scrollbar: any = ref(null);
const perfectScrollbar: any = ref(null);
// 弹窗元素
const modal: any = ref(null);
// 弹窗定位
const x = ref(-1000);
const y = ref(-1000);
const oldX = ref(0);
const oldY = ref(0);
// 弹窗大小
const modalWidth = ref(0);
const modalHeight = ref(0);
// 弹窗层级
const INDEX = 999;
const currentModalIndex = ref(0);

// 旧弹窗大小
const oldWidth = ref(0);
const oldHeight = ref(0);
// 弹窗显示
const modalVisible = ref(false);
// 弹窗过渡显示
const transitionVisible = ref(false);
// 最小化
const isMinimize = ref(false);
// 最大化
const isMaximize = ref(false);
// 底部导航栏元素
let bottomBar: any = ref(null);
watch(
  () => isMaximize.value,
  (val) => {
    emits("update:isMaximize", val);
  }
);
// 全屏
const isFullScreen = ref(false);
watch(
  () => isFullScreen.value,
  (val) => {
    emits("update:isFullScreen", val);
  }
);

// 弹窗名称
const modalName = ref(nanoid(4));
// 导航高度
let barHeight = 0;

// 禁用拖拽状态
const disabledDrag = computed(() => {
  if (isFullScreen.value || isMaximize.value) return true;
  return props.handle ? false : true;
});
// 当前弹窗层级
const modalIndex = computed(() => {
  if (isMinimize.value) {
    return -999;
  }
  return currentModalIndex.value;
});
// 弹窗实际x坐标
const currentX = computed(() => {
  if (modalWidth.value >= windowWidth.value) {
    return 0;
  }
  // 如果是手动拖拽
  if (props.handle) {
    return x.value;
  } else {
    return getModalPosition.value.left;
  }
});
// 弹窗实际y坐标
const currentY = computed(() => {
  if (modalHeight.value >= windowHeight.value) {
    return 0;
  }
  // 如果是手动拖拽
  if (props.handle) {
    return y.value;
  } else {
    return getModalPosition.value.top;
  }
});

// 头部导航栏高度
const topBarHeight = computed(() => {
  if (window.$usePlat("web")) {
    return 0;
  }
  // 顶部导航栏开启时
  // if (){}
  if (bottomBar.value) barHeight = bottomBar.value.clientHeight;
  return 40;
});

// 底部导航栏高度
const bottomBarHeight = computed(() => {
  let height = currentMainH.value.bottom;
  // 底部导航栏开启时
  // if (){}
  if (bottomBar.value) barHeight = bottomBar.value.clientHeight;
  return 100 + topBarHeight.value;
});

// 弹窗样式
const modalSizeStyle = computed(() => {
  let obj: any = {};
  if (isMaximize.value) {
    obj = {
      borderRadius: "0px",
      width: "100vw",
      height: `calc(100vh - ${bottomBarHeight.value}px)`,
    };
  } else if (isFullScreen.value) {
    obj = {
      borderRadius: "0px",
      width: "100vw",
      height: "100vh",
    };
  } else {
    obj = {
      borderRadius: "12px",
      height: "auto",
    };
  }
  return obj;
});
// 弹窗过渡样式
const transitionStyle = computed(() => {
  // 最小化
  if (isMinimize.value) {
    return {
      top: "80%",
      left: windowWidth.value - 200 + "px",
      minWidth: "50px",
      height: "50px",
      zIndex: props.index + 1,
    };
  } else {
    return {
      top: `${y.value}px`,
      left: `${x.value}px`,
      width: `${modalWidth.value}px`,
      height: `${modalHeight.value}px`,
      zIndex: props.index - 1,
    };
  }
});

/** 获取弹窗位置 */
const getModalPosition = computed(() => {
  let top;
  let left;

  // 最大化时
  if (isMaximize.value) {
    top = 0;
    left = 0;
  }
  // 全屏时
  else if (isFullScreen.value) {
    top = 0;
    left = 0;
  }
  // 有遮罩层时
  else if (props.mask) {
    top = (windowHeight.value - modalHeight.value) / 2;
    left = (windowWidth.value - modalWidth.value) / 2;
  }
  // 无遮罩层的情况
  else {
    // 防止弹窗越界，超出屏幕
    let h =
      (windowHeight.value - bottomBarHeight.value - modalHeight.value) / 2;
    top = h < 0 ? 0 : h;
    left = (windowWidth.value - modalWidth.value) / 2;
  }

  return {
    top,
    left,
  };
});

let intervalId;
// 初始化位置
const initPosition = () => {
  intervalId = setInterval(() => {
    // 数据未加载完成时
    if (windowHeight.value <= 0 || modalHeight.value <= 0) return;
    const {left, top} = getModalPosition.value;
    y.value = top;
    x.value = left;
    oldX.value = left;
    oldY.value = top;
    oldHeight.value = modalHeight.value;
    oldWidth.value = modalWidth.value;
    modalVisible.value = true;
    clearInterval(intervalId); // 数据加载完成后取消定时器

    if (props.isFullScreen == true) {
      fullscreen();
    } else if (props.isMaximize == true) {
      maximize();
    }
    emits("init");
  }, 1);
};
// 更新弹窗大小
const resizeModel = (data) => {
  modalHeight.value = data.height;
  modalWidth.value = data.width;
};
/** 更新x坐标 */
const updateX = (val) => {
  // if (val < 0) {
  //   x.value = 0;
  // } else if (val > windowWidth.value - modalWidth.value) {
  //   x.value = windowWidth.value - modalWidth.value;
  // } else {
  x.value = val;
  // }
};
/** 更新y坐标 */
const updateY = (val) => {
  // if (val < 0) {
  //   y.value = 0;
  // } else if (val > windowHeight.value - modalHeight.value) {
  //   y.value = windowHeight.value - modalHeight.value;
  // } else {
  y.value = val;
  // }
};
/** 最小化实现 */
const minimize = () => {
  isMinimize.value = !isMinimize.value;
  emits("minimize", isMinimize.value);

  modalVisible.value = false;
  transitionVisible.value = true;

  if (!isMinimize.value) {
    modalVisible.value = true;
    transitionVisible.value = false;
  }
};

/** 最大化 */
const maximize = () => {
  if (isFullScreen.value) {
  } else if (!isMaximize.value) {
    oldY.value = y.value;
    oldX.value = x.value;
  }
  isFullScreen.value = false;

  isMaximize.value = !isMaximize.value;
  emits("maximize", isMaximize.value);
  if (isMaximize.value) {
    x.value = 0;
    y.value = topBarHeight.value;
  } else {
    x.value = oldX.value;
    y.value = oldY.value;
    setTimeout(() => {
      x.value = oldX.value;
      y.value = oldY.value;
    });
  }
};

/** 全屏 */
const fullscreen = () => {
  if (isMaximize.value) {
  } else if (!isFullScreen.value) {
    oldY.value = y.value;
    oldX.value = x.value;
  }
  isMaximize.value = false;

  isFullScreen.value = !isFullScreen.value;
  emits("fullscreen", isFullScreen.value);
  if (isFullScreen.value) {
    x.value = 0;
    y.value = 0;
  } else {
    x.value = oldX.value;
    y.value = oldY.value;
  }
};

/** 模态框点击事件 */
const modalClick = () => {
  getModalFouls();
};
const doubleClick = (event: any) => {
  if (!props.max) return;
  let res = event.target?.closest(".tt-modal-button");
  if (res) return;
  maximize();
};

/** 模态框获取焦点 */
const getModalFouls = (val) => {
  // 如果当前弹窗已经是焦点弹窗则不处理
  if (currentModalIndex.value == INDEX) return;
  // 先通知所有弹窗移除焦点
  proxy.$bus.emit("modalBlur");

  // 提升当前弹窗层级
  setTimeout(() => {
    currentModalIndex.value = val||INDEX;
  }, 3);
};

// 关闭 or 取消
const onNo = () => {
  if (!beforeUnmount.value()) return;
  emits("no");
  emits("update:modelValue", false);
  emits("close");
};

// 关闭 and 确定
const onOk = () => {
  emits("ok");
  onNo();
};

// esc关闭
const onEsc = (event) => {
  if (props.esc && event.keyCode === 27) {
    onNo();
  }
};

// 初始化
const init = () => {
  // 初始化弹窗位置
  initPosition();

  // 监听弹窗失去焦点事件
  proxy.$bus.on("modalBlur", () => {
    currentModalIndex.value = props.index;
  });
  getModalFouls(props.index)


  // 属于单例弹窗
  if (props.type) {
    // 关闭单例弹窗
    proxy.$bus.emit("modalClose", props.type, modalName.value);

    setTimeout(() => {
      // 监听关闭单例弹窗
      proxy.$bus.on("modalClose", (currentType, currentName) => {
        if (type.value == currentType && modalName.value != currentName) {
          close();
        }
      });
    }, 1);
  }

  // 需要esc键
  if (esc.value) {
    // esc键监听
    window.addEventListener("keydown", onEsc, {
      capture: true,
    });
  }

  setTimeout(() => {
    if (!scrollbar.value || !props.isScrollbar) return;
    perfectScrollbar.value = new PerfectScrollbar(scrollbar.value, {});
  }, 50);
};

// 键盘事件
const handleKeyDown = (event) => {
  if (event.code === "Space") {
    event.stopPropagation();
  }
  if (event.ctrlKey && (event.key === "A" || event.key === "a")) {
    event.stopPropagation();
  }
};
// 挂载前
onBeforeMount(() => {
});

// 挂载后
onMounted(() => {
  init();
});

// 卸载前
onBeforeUnmount(() => {
  // 注销弹窗失去焦点监听
  proxy.$bus.off("modalBlur");
  // 注销单例弹窗监听
  if (props.type) {
    proxy.$bus.off("modalClose");
  }
  // 注销esc键监听
  if (esc.value) {
    window.removeEventListener("keydown", onEsc, {
      capture: true,
    });
  }
});

// 抛出事件
defineExpose({
  // 手动关闭
  close: onNo,
  // 手动最大化
  maximize,
  // 手动最小化
  minimize,
  // 手动全屏
  fullscreen,
  // 是否最大化
  isMaximize,
  // 是否最小化
  isMinimize,
});
</script>

<style lang="scss" scoped></style>
