<script setup lang="ts">
import {
  ref,
  toRefs,
  computed,
  onMounted,
  onBeforeUnmount,
  getCurrentInstance,
  watch,
} from "vue";

import cache from "../../../../components/card/hooks/cache";
const { proxy }: any = getCurrentInstance();

interface TipProps {
  // 提示的key值 作为缓存查询使用
  name: string;
  // 校验值 作为key的校验 用于判断内容是否已更新
  check?: string;
  // 提示距离顶部的距离
  top?: number;
  // 提示距离 的距离
  right?: number;
  // 提示的层级
  z: number;
  // 提示触发的类型
  type: "click" | "hover" | "custom";
  mode: "default" | "custom";
  color?: string;
  // 开启边框
  border?: boolean;
}

const props = withDefaults(defineProps<TipProps>(), {
  top: -5,
  right: -5,
  z: 9999,
  color: "red",
  type: "click",
  mode: "default",
  check: "1",
  name: "tip",
  border: true,
});
const { color, top, right, name, check, type, border } = toRefs(props);
watch(
  () => check.value,
  (val) => {
    console.log('val :>> ', val);
    checkVal.value = val;
    updateTipData(true);
    updateTipVisible();
  }
);
const checkVal = ref(check.value);
const tipPos = computed(() => {
  return {
    top: `${top.value}px`,
    right: `${right.value}px`,
    zIndex: props.z,
  };
});

const tipStyle = computed(() => {
  let res: any = {
    background: color.value,
    border: "2px solid var(--secondary-text)",
    width: "12px",
    height: "12px",
  };
  if (!border.value) {
    res.border = "";
  }

  return res;
});

const tipVisible = ref(false);
const tip = ref<HTMLDivElement | null>(null);
onMounted(() => {
  let tipObj = cache.get("ttTip");

  // tipObj不存在
  if (!tipObj) {
    tipObj = {};
  }

  // tipObj中name不存在 或者 check不一致
  if (!tipObj[name.value] || tipObj[name.value].check !=  checkVal.value) {
    updateTipData(true);
  }

  updateTipVisible();

  if (type.value === "custom") {
    proxy.$bus.on("closeTip", (specifyName: string) => {
      if (specifyName == name.value) {
        disabledTip();
      }
    });
  }
});

// 保存提示
const updateTipData = (disabled: boolean) => {
  let tipObj = cache.get("ttTip");
  let obj = {
    disabled,
    check: checkVal.value,
  };
  console.log('obj :>> ', obj);
  tipObj[name.value] = obj;
  cache.set("ttTip", tipObj);
};
const updateTipVisible = () => {
  let tipObj = cache.get("ttTip");
  tipVisible.value = tipObj[name.value].disabled;
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
    <div v-if="tipVisible" class="absolute" :style="[tipPos]">
      <!-- 默认 -->
      <div
        v-if="mode === 'default'"
        class="rounded-full"
        :style="[tipStyle]"
      ></div>
      <!-- 自定义 -->
      <slot v-else name="custom"></slot>
    </div>
    <slot />
  </div>
</template>
<style lang="scss" scoped></style>
