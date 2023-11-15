<template>
  <Teleport to="body">
    <!-- 弹窗 -->
    <div
      v-if="modelValue"
      class="fixed top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 rounded-xl xt-modal xt-shadow p-4 xt-text text-base"
      style="
        border: 1px solid rgba(255, 255, 255, 0.1);
        box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.5);
      "
      :style="{
        'z-index': index,
      }"
    >
      <div class="flex w-full">
        <!-- 左侧 -->
        <nav v-if="nav">
          <slot name="nav"> </slot>
        </nav>
        <main>
          <header class="flex items-center mb-4" v-if="header">
            <!-- 标题左侧 -->
            <div class="flex items-center">
              <slot name="header-left">
                <xt-button
                  w="32"
                  h="32"
                  radius="8"
                  class="mr-4"
                  @click="onNo()"
                >
                  <xt-new-icon
                    icon="fluent:chevron-left-16-filled"
                    size="16"
                    class="xt-text-2"
                  />
                </xt-button>
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
          <slot>
            <McDonalds />
          </slot>
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

<script setup>
import McDonalds from "./McDonalds.vue";
const props = defineProps({
  // 弹窗显示状态
  modelValue: {
    default: false,
  },
  // 弹窗标题
  title: {
    default: "默认title",
  },
  noName: {
    default: "取消",
  },
  okName: {
    default: "确认",
  },
  // 弹窗层级
  index: {
    default: 1000,
  },
  maskIndex: {
    default: 100,
  },
  mask: {
    default: true,
  },
  // 左侧导航
  nav: {
    default: true,
  },
  // 头部
  header: {
    default: true,
  },
  // 尾部
  footer: {
    default: true,
  },
});

const emits = defineEmits(["ok", "no", "modelValue"]);

const onNo = () => {
  emits("update:modelValue", false);
  emits("no");
};
const onOk = () => {
  emits("update:modelValue", false);
  emits("ok");
};
</script>

<style lang="scss" scoped></style>
