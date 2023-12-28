<template>
  <Teleport to="body">
    <!-- 弹窗 -->
    <div
      v-if="modelValue"
      :class="[boxClass, isFull ? ' rounded-none w-full h-full' : 'rounded-xl']"
      ref="modal"
      class="fixed flex flex-col text-base top-1/2 -translate-y-1/2 -translate-x-1/2 left-1/2 rounded-xl xt-modal xt-shadow xt-text"
      style="
        border: 1px solid rgba(255, 255, 255, 0.1);
        box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.5);
      "
      :style="{
        'z-index': index,
        // top: top + 'px',
      }"
    >
      <slot v-if="custom"></slot>
      <template v-else>
        <div class="flex flex-1 w-full">
          <!-- 左侧 -->
          <nav v-if="nav">
            <slot name="nav"> </slot>
          </nav>
          <main class="flex flex-col flex-1 h-full">
            <header class="relative flex items-center mb-4" v-if="header">
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
                <xt-button
                 class="ml-3"
                  w="32"
                  h="32"
                  radius="8"
                  v-if="full"
                  @click="isFull = !isFull"
                >
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
                <xt-button class="ml-3"
                  w="32"
                  h="32"
                  radius="8"
                  v-if="full"
                  @click="updateFullState"
                >
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
            <!-- 内容区 -->
            <vue-custom-scrollbar
              :settings="{
                swipeEasing: true,
                suppressScrollY: false,
                suppressScrollX: true,
                wheelPropagation: false,
              }"
              style="position: relative; padding-right: 8px; padding-left: 8px"
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
    <!-- 遮罩 -->
    <div
      v-if="modelValue && mask"
      @click.stop.self="onNo()"
      class="fixed top-0 bottom-0 left-0 w-full h-full xt-mask ring-0"
      :style="{
        'z-index': maskIndex,
      }"
    ></div>
  </Teleport>
</template>

<script setup lang="ts">
import McDonalds from "./McDonalds.vue";
import { ref, watch, toRefs, onMounted, onBeforeUnmount, nextTick } from "vue";
import { useWindowSize } from "@vueuse/core";
import { update } from "lodash";
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
}
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
});
const { esc, modelValue, beforeMount, beforeUnmount } = toRefs(props);
const isFull = ref(false);

const emits = defineEmits(["ok", "no", "update:modelValue", "close", ""]);

const modal: any = ref(null);
let topBarHeight = 0;
let topUtilBarHeight = 0;
let bottomBarHeight = 0;
onMounted(() => {
  if (esc.value) {
    window.addEventListener("keydown", handleEscKeyPressed, {
      capture: true,
    });
  }
  return;
  // 处理定位问题
  const topBar = document.getElementsByClassName("xt-main-top-bar")[0];
  const topUtilBar = document.getElementsByClassName("xt-main-top-util-bar")[0];
  const bottomBar = document.getElementsByClassName("xt-main-bottom-bar")[0];

  if (topBar) topBarHeight = topBar.clientHeight;

  if (topUtilBar) topUtilBarHeight = topUtilBar.clientHeight;

  if (bottomBar) bottomBarHeight = bottomBar.clientHeight;
});
const top = ref(-999);
watch(
  () => modelValue.value,
  () => {
    nextTick(() => {
      if (!modal.value) return;
      const modelHeight = modal.value.clientHeight;
      const windowSize = useWindowSize();
      const windowHeight = windowSize.height.value;

      const x =
        (windowHeight +
          topBarHeight +
          topUtilBarHeight -
          bottomBarHeight -
          modelHeight) /
        2;

      top.value = x;
    });
  },
  { immediate: true }
);
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
const updateFullState =()=>{
  isFull.value = !isFull.value
}
onBeforeUnmount(() => {
  if (esc.value) {
    window.removeEventListener("keydown", handleEscKeyPressed, {
      capture: true,
    });
  }
});
defineExpose({
  updateFullState,isFull,
})
</script>

<style lang="scss" scoped></style>
