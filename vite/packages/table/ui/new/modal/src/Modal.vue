<template>
  <Teleport to="body">
    <!-- 弹窗 -->
    <xt-drag
      :test="false"
      :x="currentX"
      @update:x="x = $event"
      :y="currentY"
      @update:y="y = $event"
      :index="modalIndex"
      :collision="false"
      v-if="modelValue"
      @update:data="resizeModel"
      :handle="handle"
      :disabled="handle ? false : true"
    >
      <div
        @click="modalClick"
        :class="[custom ? '' : boxClass]"
        ref="modal"
        class="flex flex-col overflow-hidden text-base no-drag rounded-xl xt-modal xt-shadow xt-text"
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
          <!-- 标题和左右内容 -->
          <div class="flex flex-1 w-full">
            <!-- 左侧 -->
            <nav>
              <slot name="nav"> </slot>
            </nav>
            <!-- 右侧 -->
            <main class="flex flex-col flex-1 h-full">
              <!-- 主体头部 -->
              <header
                class="relative flex items-center xt-modal-header"
                :class="headerClass"
                v-if="header"
                @dblclick="doubleClick"
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
                    class="ml-3 tt-modal-button"
                    w="32"
                    h="32"
                    radius="8"
                    @click="minimize"
                  >
                    <xt-ify-icon icon="fluent:subtract-16-regular" />
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
                          ? 'fluent:full-screen-minimize-16-filled'
                          : 'fluent:full-screen-maximize-16-regular'
                      "
                      size="16"
                      class="xt-text-2"
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
              <!-- 主体内容区 -->
              <vue-custom-scrollbar
                :settings="{
                  swipeEasing: true,
                  suppressScrollY: false,
                  suppressScrollX: true,
                  wheelPropagation: false,
                }"
                style="position: relative"
                :style="scrollbarStyle"
                class="flex-1"
                :class="mainClass"
              >
                <slot>
                  <McDonalds />
                </slot>
              </vue-custom-scrollbar>
            </main>
          </div>
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
import { useWindowSize } from "../../drag/src/hooks/useWindowSize";
// import { vElementSize } from "../../drag/src/hooks/useElementSize";
import { nanoid } from "nanoid";

import { ModalProps } from "./types";

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
  headerClass: "pb-4",
  mainClass: "",
  beforeMount: () => true,
  beforeUnmount: () => true,
  custom: false,
  scrollbarStyle: { paddingRight: "0px", paddingLeft: "0px" },
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
const INDEX = 99999;
const currentModalIndex = ref(0);
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
// 弹窗名称
const modalName = ref(nanoid(4));
// 导航高度
let barHeight = 0;

const currentX = computed(() => {
  // 如果是手动拖拽
  if (props.handle) {
    return x.value;
  } else {
    return getPosition.value.left;
  }
});
const currentY = computed(() => {
  // 如果是手动拖拽
  if (props.handle) {
    return y.value;
  } else {
    return getPosition.value.top;
  }
});

// 弹窗样式
const modalStyle = computed(() => {
  if (isMaximize.value) {
    return {
      borderRadius: "0px",
      width: "100vw",
      height: "100vh",
    };
  }

  return {
    borderRadius: "12px",
    height: "auto",
  };
});
let intervalId;

const getPosition = computed(() => {
  let top;
  let left;
  // 有遮罩层的情况
  if (props.mask) {
    top = (windowHeight.value - modalHeight.value) / 2;
    left = (windowWidth.value - modalWidth.value) / 2;
  } 
  // 全屏时
  else if (isMaximize.value) {
    top = 0
    left = 0
  }
  // 无遮罩层的情况
  
  else {
    top = (windowHeight.value - barHeight - modalHeight.value) / 2;
    left = (windowWidth.value - modalWidth.value) / 2;
  }
  return {
    top,
    left,
  };
});

// 初始化位置
function initPosition() {
  intervalId = setInterval(() => {
    // 数据未加载完成时
    if (windowHeight.value <= 0 || modalHeight.value <= 0) return;
    const { left, top } = getPosition.value;
    y.value = top;
    x.value = left;
    oldX.value = left;
    oldY.value = top;
    oldHeight.value = modalHeight.value;
    oldWidth.value = modalWidth.value;
    modalVisible.value = true;
    clearInterval(intervalId); // 数据加载完成后取消定时器
  }, 1);
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
// 头部框双击事件
// const { doubleClick } = useDoubleClick(d);

/** 模态框获取焦点 */
const getModalFouls = () => {
  // 如果当前弹窗已经是焦点弹窗则不处理

  if (currentModalIndex.value == INDEX) return;
  // 先通知所有弹窗移除焦点
  proxy.$bus.emit("modalBlur");

  // 提升当前弹窗层级
  setTimeout(() => {
    currentModalIndex.value = INDEX;
  }, 0);
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

// 初始化
const init = () => {
  // 获取菜单高度
  const bottomBar = document.getElementsByClassName("xt-main-bottom-bar")[0];
  if (bottomBar) barHeight = bottomBar.clientHeight;
  // else if () {}

  // 初始化弹窗位置
  initPosition();

  // 监听弹窗失去焦点事件
  proxy.$bus.on("modalBlur", () => {
    currentModalIndex.value = props.index;
  });

  setTimeout(() => {
    // 获取弹窗焦点
    getModalFouls();
  }, 1);

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
};

// 挂载后
onMounted(() => {
  useWindowSize((size) => {
    windowHeight.value = size.height.value;
    windowWidth.value = size.width.value;
  }, 0);

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
  // 判断最大化变量
  isMaximize,
  // 判断最小化变量
  isMinimize
});
</script>

<style lang="scss" scoped></style>
