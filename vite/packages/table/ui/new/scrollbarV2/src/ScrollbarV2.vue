<script setup lang="ts">
import { useDebounceFn } from "@vueuse/core";
import PerfectScrollbar from "perfect-scrollbar";
import { vElementSize } from "../../../../hooks";
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
const props = defineProps({
  // 支持auto x y
  direction: {
    type: String,
    default: "y",
  },
});
const scrollbar: any = ref(null);
const perfectScrollbar: any = ref(null);

const isInit = ref(false);

const settings = computed(() => {
  let res: any = {
    swipeEasing: true,
    useBothWheelAxes: true,
    wheelPropagation: true,
  };
  if (props.direction === "y") {
    res.suppressScrollX = true;
  } else if (props.direction === "x") {
    res.suppressScrollY = true;
  }
  return res;
});

const initScrollbar = () => {
  isInit.value = true;
  perfectScrollbar.value = new PerfectScrollbar(
    scrollbar.value,
    settings.value
  );
};
onMounted(() => {
  initScrollbar();
});
onBeforeUnmount(() => {
  perfectScrollbar.value.destroy();
  perfectScrollbar.value = null;
});
const update = (options) => {
  const {
    /**
     * 指定的匹配的元素
     */
    element = "div",
    /**
     * 指定要查找的元素key
     */
    attributeKey = "",
    /**
     * 指定要查找的元素value
     */
    attributeValue = "",
    /**
     * 指定滚动条更新方向
     */
    direction = "top",
    /**
     * 指定滚动条过渡效果
     */
    behavior = "smooth",
  } = options;
  const scrollbarRef = scrollbar.value;
  let allElement = scrollbarRef.querySelectorAll(element);

  for (let item of allElement) {
    const currentElement = item.getAttribute(attributeKey);
    if (attributeValue != currentElement) {
      continue;
    }
    if (direction === "top") {
      let top = item.offsetTop;
      scrollbarRef.scrollTo(0, top);
      return;
    } else if (direction === "left") {
      let left = item.offsetLeft;
      scrollbarRef.scrollTo(left, 0);
      return;
    }
  }
};

defineExpose({
  update,
});
/**
 * 用于在滚动条大小更新后
 */
const updateScrollbar = useDebounceFn(() => {
  perfectScrollbar.value.update();
}, 1000);
</script>

<template>
  <div
    class="relative overflow-hidden"
    ref="scrollbar"
    v-element-size="updateScrollbar"
  >
    <slot></slot>
  </div>
</template>
<style lang="scss" scoped></style>
