<template>
  <div class="flex flex-col items-center justify-center h-full">
    <xt-ify-icon
      v-if="currentSize != 2"
      icon="fluent-emoji:inbox-tray"
      size="56"
      class="mb-3"
    />

    <template v-if="memberVisible">
      <div class="flex items-center justify-center flex-col">
        <xt-ify-icon icon="fluent-emoji:magnifying-glass-tilted-right" class="mb-4" size="56" />
        <span class="xt-text-2 font-14">暂无数据</span>
      </div>
    </template>

    <template v-else>
      <div
        class="p-2 mb-3 text-sm xt-bg-t-2 rounded-xl"
        style="max-width: 452px"
      >
        你可以拖动工作台桌面图标
        {{ $usePlat("client") ? "或Windows程序" : "" }}
        或文件图标到此处
        {{
          $usePlat("client")
            ? "；或者进入分组设置选择自动整理模式，为你自动整理桌面图标。"
            : "。"
        }}
      </div>
      <xt-button type="theme" w="84" h="32" radius="8" @click="editClick">
        添加图标
      </xt-button>
    </template>
  </div>
</template>

<script setup>
import { watch, toRefs, ref, computed } from "vue";

const props = defineProps({
  size: {},
  memberVisible: {
    type: Boolean,
  },
});
const emits = defineEmits(["addFile"]);

const { size, memberVisible } = toRefs(props);

const currentSize = computed(() => {
  let str = size.value.split("x");
  return str[1];
});

const editClick = () => {
  emits("addFile");
};
</script>

<style lang="scss" scoped></style>
