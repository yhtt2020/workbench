<template>
  <Teleport to="body">
    <!-- 弹窗 -->
    <div
      v-if="modelValue"
      class="flex flex-col h-full fixed top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 rounded-xl xt-modal xt-shadow p-4 xt-text text-base"
      style="
        border: 1px solid rgba(255, 255, 255, 0.1);
        box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.5);
      "
      :style="{
        'z-index': index,
      }"
    >
      <div class="flex w-full flex-1">
        <!-- 左侧 -->
        <nav v-if="nav">
          <slot name="nav"> </slot>
        </nav>
        <main class="h-full flex flex-1 flex-col">
          <header class="flex items-center mb-4" v-if="header">
            <!-- 标题左侧 -->
            <div class="flex items-center">
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
            <div class="flex-1 text-center items-center">
              <slot name="header-center">
                {{ title }}
              </slot>
            </div>
            <!-- 标题右侧 -->
            <div class="flex items-center">
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
            style="
              position: relative;
              /* height: calc(100vh); */
              margin-right: -15px;
              margin-left: -10px;
              padding-left: 10px;
              padding-top: 5px;
              padding-right: 15px;
            "
            class="flex-1 xt-theme-b"
          >

            <slot>
              <McDonalds />
            </slot>
          </vue-custom-scrollbar>
        </main>
      </div>

      <slot name="footer">
        <footer class="flex justify-end mt-4 items-center" v-if="footer">
          <xt-button w="64" h="40" @click="onNo()">
            <span class="xt-text-2">{{ noName }}</span>
          </xt-button>
          <xt-button w="64" h="40" class="ml-3" type="theme" @click="onOk()">{{
            okName
          }}</xt-button>
        </footer>
      </slot>
    </div>
    <!-- 遮罩 -->
    <div
      v-if="modelValue && mask"
      @click.stop.self="onNo()"
      class="xt-mask h-full w-full fixed top-0 left-0 ring-0 bottom-0"
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
  nav?: boolean;
  back?: boolean;
  header?: boolean;
  footer?: boolean;
  esc?: boolean;
}
const props = withDefaults(defineProps<ModalProps>(), {
  modelValue: false,
  title: "麦当劳之歌",
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
});
const { esc } = toRefs(props);
const emits = defineEmits(["ok", "no", "back", "update:modelValue"]);

const onNo = () => {
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
