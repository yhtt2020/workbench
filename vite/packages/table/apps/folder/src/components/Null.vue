<template>
  <div class="flex justify-center items-center flex-col h-full">
    <xt-ify-icon
      v-if="currentSize != 2"
      icon="fluent-emoji:inbox-tray"
      size="56"
      class="mb-3"
    />
    <div class="xt-bg-t-2 rounded-xl text-sm mb-3 p-2" style="max-width: 452px">
      你可以拖动工作台桌面图标或windows程序或文件图标到此处；或者进入分组设置选择自动整理模式，为你自动整理桌面图标。
    </div>
    <xt-button type="theme" w="84" h="32" radius="8" @click="editClick">
      添加图标</xt-button
    >
  </div>
</template>

<script setup>
import { watch, toRefs, ref, computed } from "vue";

const props = defineProps({
  size: {},
});
const emits = defineEmits(["addFile"]);

const { size } = toRefs(props);

const currentSize = computed(() => {
  let str = size.value.split("x");
  return str[1];
});

const editClick = () => {
  emits("addFile");
};
</script>

<style lang="scss" scoped></style>
