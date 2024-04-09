<template>
  <Teleport to="body">
    <!-- 弹窗 -->
    <xt-drag
      :test="false"
      v-model:x="x"
      v-model:y="y"
      :index="modalIndex"
      :collision="false"
      v-if="modelValue"
      @update:data="resizeModel"
      :handle="handle"
      :disabled="handle ? false : true"
      @click="modalClick"
    >
      <div
        :class="[custom ? '' : boxClass]"
        ref="modal"
        class="no-drag flex flex-col text-base rounded-xl xt-modal xt-shadow xt-text overflow-hidden"
        style="
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.5);
        "
        :style="[
          modalStyle,
          {
            opacity: modalVisible ? '1' : '0',
          },
        ]"
      >
        <slot v-if="custom"></slot>
        <template v-else>
          <div class="flex flex-1 w-full">
            <!-- 左侧 -->
            <nav>
              <slot name="nav"> </slot>
            </nav>
            <!-- 主体区域 -->
            <main class="flex flex-col flex-1 h-full">
              <!-- 主体头部 -->
              <header
                class="relative flex items-center xt-modal-header"
                :class="headerClass"
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
                  <!-- 最小化 -->
                  <xt-button
                    v-if="min"
                    class="ml-3"
                    w="32"
                    h="32"
                    radius="8"
                    @click="minimize"
                  >
                    <xt-ify-icon icon="fluent:subtract-16-regular" />
                  </xt-button>
                  <!-- 最大化 -->
                  <xt-button
                    class="ml-3"
                    w="32"
                    h="32"
                    radius="8"
                    @click="maximize"
                    v-if="max"
                  >
                    <xt-new-icon
                      :icon="
                        isMaximize
                          ? 'fluent:full-screen-minimize-16-filled'
                          : 'fluent:full-screen-maximize-16-regular'
                      "
                      size="16"
                      class="xt-text-2"
                    />
                  </xt-button>
                  <!-- 关闭按钮 -->
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
                :class="mainClass"
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
    <!-- 过渡动画 -->
    <div
      v-if="transitionVisible"
      :style="transitionStyle"
      style="transition: all 0.1s"
      class="fixed xt-modal rounded-xl flex justify-center items-center px-2 cursor-pointer"
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
import { useWindowSize } from "../../drag/src/hooks/useWindowSize";
// import { vElementSize } from "../../drag/src/hooks/useElementSize";

import { ModalProps } from "./types";
import { drawHeaderImage } from "../../../../js/common/avatar";
import { debouncedWatch } from "@vueuse/core";
const { proxy }: any = getCurrentInstance();

const props = withDefaults(defineProps<ModalProps>(), {
  modelValue: false,
  title: "",
  noName: "取消",
  okName: "确认",
  index: 1000,
  maskIndex: 100,
  mask: true,
  nav: false,
  header: true,
  footer: false,
  esc: false,
  boxClass: "p-4",
  headerClass: "",
  mainClass: "",
  beforeMount: () => true,
  beforeUnmount: () => true,
  custom: false,
  scrollbarPadding: { paddingRight: "0px", paddingLeft: "0px" },
  type: null,
  min: false,
  max: false,
  handle: "",
  name: null,
});
const { esc, modelValue, beforeMount, beforeUnmount, type } = toRefs(props);

const emits = defineEmits(["ok", "no", "update:modelValue", "close", "max"]);

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
const currentModalIndex = ref(props.index);
// 当前弹窗层级
const modalIndex = computed(() => {
  if (isMinimize.value) {
    return -999;
  }
  return currentModalIndex.value;
});
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
// 视图大小
const windowHeight = ref(0);
const windowWidth = ref(0);

// 底部导航高度
let bottomBarHeight = 0;
// 弹窗样式
const modalStyle = computed(() => {
  if (isMaximize.value) {
    return {
      borderRadius: "0px",
      width: "100vw",
      height: "100vh",
    };
  }

  // x.value = oldX.value;
  // y.value = oldY.value;
  return {
    borderRadius: "12px",
    height: "auto",
  };
});
let intervalId;
// 初始化位置
function initPos() {
  intervalId = setInterval(() => {
    // if (name.value) {
    // }
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
    modalVisible.value = true;
    clearInterval(intervalId); // 数据加载完成后取消定时器
  }, 100);
}

// 更新弹窗大小
const resizeModel = (data) => {
  modalWidth.value = data.width;
  modalHeight.value = data.height;
};

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
  }
  // 最大化
  else if (isMaximize.value) {
    return {
      top: "0",
      left: "0",
      width: "100vw",
      height: "100vh",
      zIndex: props.index - 1,
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

/** 最小化实现 */
const minimize = () => {
  transitionVisible.value = true;
  modalVisible.value = false;

  setTimeout(() => {
    isMinimize.value = !isMinimize.value;
    setTimeout(() => {
      if (!isMinimize.value) {
        modalVisible.value = true;
        transitionVisible.value = false;
      }
    }, 100);
  }, 1);
};

//   x.value = oldX.value;
//   y.value = oldY.value;
//   return {
//     borderRadius: "12px",
//     height: "auto",
//   };
/** 最大化 */
const maximize = () => {
  transitionVisible.value = true;
  modalVisible.value = false;

  setTimeout(() => {
    isMaximize.value = !isMaximize.value;
    emits("max", isMaximize.value);
    if (isMaximize.value) {
      oldX.value = x.value;
      oldY.value = y.value;
      x.value = 0;
      y.value = 0;
    }
    if (!isMaximize.value) {
      x.value = oldX.value;
      y.value = oldY.value;
    }
    setTimeout(() => {
      modalVisible.value = true;
      transitionVisible.value = false;
    }, 100);
  }, 1);
};
/** modalClick */
const modalClick = () => {
  currentModalIndex.value = 999999999999;
  proxy.$bus.emit("modalFocus", false);
};
/** 通用默认底部按钮事件 */
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

// 挂载前
onBeforeMount(() => {});
// 挂载后
onMounted(() => {
  // 先发送失去弹窗焦点
  proxy.$bus.emit("modalFocus", false);
  // 然后挂载监听弹窗焦点
  proxy.$bus.on("modalFocus", (isFocus: boolean) => {
    currentModalIndex.value = isFocus ? 999999999999 : props.index;
  });

  // 获取底部菜单
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
    window.addEventListener("keydown", onEsc, {
      capture: true,
    });
  }
  useWindowSize((size) => {
    windowHeight.value = size.height.value;
    windowWidth.value = size.width.value;
  }, 0);
});
// 卸载前
onBeforeUnmount(() => {
  //
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
  // 手动最小化
  maximize,
  // 手动最大化
  minimize,
});
</script>

<style lang="scss" scoped></style>
