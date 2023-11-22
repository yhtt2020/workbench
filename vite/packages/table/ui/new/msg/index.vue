<template>
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
    <div class="flex items-center">
      <div class="mr-4">
        <slot name="icon">
          <xt-new-icon
            icon="fluent:info-12-filled"
            style="color: var(--warning) !important"
          />
        </slot>
      </div>

      <span>{{ title }}</span>
    </div>
    <div class="xt-text-2 my-4" style="margin-left: 40px; max-width: 316px">
      {{ text }}
    </div>
    <slot name="handle">
      <div class="flex justify-end items-center">
        <!-- 勾选框 -->
        <slot name="checkbox"></slot>
        <xt-button w="64" h="40" @click="onNo()">
          <span class="xt-text-2">{{ noName }}</span>
        </xt-button>
        <xt-button w="64" h="40" class="ml-3" type="theme" @click="onOk()">{{
          okName
        }}</xt-button>
      </div>
    </slot>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    default: true,
  },
  title: {
    default: "默认title",
  },
  text: {
    default: "默认text",
  },
  index: {
    default: 99999,
  },
  noName: {
    default: "取消",
  },
  okName: {
    default: "确认",
  },
});

const emits = defineEmits(["ok", "no", "modelValue"]);

const onNo = () => {
  // emits("update:modelValue", false);
  emits("no");
};
const onOk = () => {
  // emits("update:modelValue", false);
  emits("ok");
};
</script>

<style lang="scss" scoped></style>
