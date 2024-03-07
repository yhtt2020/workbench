<script setup lang="ts">
import {
  ref,
  toRefs,
  computed,
  onMounted,
  onBeforeUnmount,
  getCurrentInstance,
} from "vue";

import cache from "../../../../components/card/hooks/cache";
const { proxy }: any = getCurrentInstance();

interface TipProps {
  // 提示距离顶部的距离
  top?: number;
  // 提示距离 的距离
  right?: number;
  // 提示的层级
  z: number;
  mode: "default" | "custom";

  color?: string;
  type: "click" | "hover" | "custom";
  // 提示的key值 作为缓存查询使用
  key: string;
  // 校验值 作为key的校验 用于判断内容是否已更新
  check?: string;
}

const props = withDefaults(defineProps<TipProps>(), {
  top: -10,
  right: -10,
  color: "red",
  type: "click",
  mode: "default",
  check: "1",
  key: "tip",
});
const { color, top, right, key, type, check } = toRefs(props);

const tipStyle = computed(() => {
  return {
    top: `${top.value}px`,
    right: `${right.value}px`,
  };
});

const tipVisible = ref(false);
const tip = ref<HTMLDivElement | null>(null);
onMounted(() => {
  console.log("key.value :>> ", key.value);
  return
  let tipObj = cache.get("ttTip");

  // tipObj不存在
  if (!tipObj) {
    tipObj = {};
  }

  // tipObj中key不存在 或者 check不一致
  if (!tipObj[key.value] || tipObj[key.value].check != check.value) {
    updateTipData(true);
  }

  updateTipVisible();

  if (type.value === "custom") {
    proxy.$bus.on("closeTip", (specifyKey: string) => {
      if (specifyKey == key.value) {
        disabledTip();
      }
    });
  }
});

// 保存提示
const updateTipData = (disabled) => {
  let tipObj = cache.get("ttTip");
  let obj = {
    disabled,
    check: check.value,
  };
  tipObj[key.value] = obj;
  cache.set("ttTip", tipObj);
};
const updateTipVisible = () => {
  let tipObj = cache.get("ttTip");
  tipVisible.value = tipObj[key.value].disabled;
};

const disabledTip = () => {
  updateTipData(false);
  updateTipVisible();
};

const onMousedown = () => {
  if (type.value === "hover") {
    disabledTip();
  }
};
const onClick = () => {
  if (type.value === "click") {
    disabledTip();
  }
};

onBeforeUnmount(() => {
  if (type.value === "custom") {
    proxy.$bus.off("closeTip");
  }
});
</script>

<template>
  <div
    @click="onClick"
    @mouseleave="onMousedown"
    ref="tip"
    class="relative"
    style="overflow: visible !important"
  >
    <!-- 提示 -->
    <div
      v-if="tipVisible"
      class="absolute"
      :style="[tipStyle]"
      style="z-index: 999999"
    >
      <!-- 默认提示 -->
      <span
        v-if="mode == 'default'"
        class="rounded-full"
        style="width: 20px; height: 20px"
        :style="{
          backGround: color,
        }"
      >
      </span>
      <!-- 自定义提示 -->
      <slot v-else name="custom"></slot>
    </div>
    <slot />
  </div>
</template>
<style lang="scss" scoped></style>
