<template>
  <Teleport to="body">
    <!-- 弹窗 -->
    <div
      v-if="modelValue"
      :class="[boxPadding]"
      class="fixed flex flex-col text-base -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 rounded-xl xt-modal xt-shadow xt-text"
      style="
        border: 1px solid rgba(255, 255, 255, 0.1);
        box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.5);
      "
      :style="{
        'z-index': index,
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
              <slot name="header-left">
                <template v-if="back">
                  <xt-button
                    w="32"
                    h="32"
                    radius="8"
                    class="mr-4"
                    @click="onBack()"
                  >
                    <xt-new-icon
                      icon="fluent:chevron-left-16-filled"
                      size="16"
                      class="xt-text-2"
                    />
                  </xt-button>
                </template>
              </slot>
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
              <xt-button class="ml-3" w="32" h="32" radius="8" @click="onNo()">
                <xt-new-icon
                  icon="fluent:dismiss-16-filled"
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
            style="position: relative; padding-right: 8px; padding-left: 8px;"
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
          <xt-button w="64" h="40" class="ml-3" type="theme" @click="onOk()">{{
            okName
          }}</xt-button>
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
import { toRefs, onMounted, onBeforeUnmount } from "vue";
export interface ModalProps {
  modelValue?: boolean;
  title?: string;
  noName?: string;
  okName?: string;
  index?: number;
  maskIndex?: number;
  mask?: boolean;
  // 左侧
  nav?: boolean;
  back?: boolean;
  header?: boolean;
  footer?: boolean;
  esc?: boolean;
  boxPadding?: string;
  // 自定义插槽
  custom?:boolean
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
  back: false,
  header: true,
  footer: true,
  esc: false,
  boxPadding: "p-4",
  custom:false
});
const { esc } = toRefs(props);
const emits = defineEmits(["ok", "no", "back", "update:modelValue"]);

const onNo = () => {
  console.log('111111 :>> ', 111111);
  emits("update:modelValue", false);
  emits("no");
};
const onOk = () => {
  emits("update:modelValue", false);
  emits("ok");
};
const onBack = () => {
  emits("update:modelValue", false);
  emits("back");
};
// esc关闭
const handleEscKeyPressed = (event) => {
  if (props.esc && event.keyCode === 27) {
    onNo();
  }
};

onMounted(() => {
  if (esc.value) {
    window.addEventListener("keydown", handleEscKeyPressed, {
      capture: true,
    });
  }
});
onBeforeUnmount(() => {
  if (esc.value) {
    window.removeEventListener("keydown", handleEscKeyPressed, {
      capture: true,
    });
  }
});
</script>

<style lang="scss" scoped></style>
