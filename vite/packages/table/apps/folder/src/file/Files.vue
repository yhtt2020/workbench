<!-- 渲染不同尺寸的文件状态 -->
<template>
  <div
    class="flex justify-center items-center"
    :class="boxClass"
    :style="getLayoutSize"
  >
    <div :style="getImgSize">
      <img :src="item.icon" class="w-full h-full" />
    </div>
    <div class="w-full xt-text-2 text-sm truncate" :class="textClass">
      {{ item.name }}
    </div>
  </div>
</template>

<script setup>
import { inject, computed, ref, watch, onMounted } from "vue";
import { rowOption, columnOption } from "./options";

// props
const props = defineProps({
  item: {},
});

const data = inject("data", "");
const mode = ref("default");

onMounted(() => {
  resize();
});

watch(
  () => data.value.cardSize,
  () => {
    resize();
  },
  {
    deep: true,
  }
);

const resize = () => {
  const width = data.value.cardSize.width;
  const height = data.value.cardSize.height;
  if (width < 2 || height < 2) {
    mode.value = "default";
    return;
  }
  mode.value = "big";
};

/**
 * 获取当前布局数据
 */
const boxClass = ref("");
const textClass = ref("");
const currentLayout = computed(() => {
  if (!data.value?.layout) return;
  if (data.value?.layout == "rows") {
    boxClass.value = " flex-col";
    textClass.value = "text-center  mt-1";
    return rowOption;
  } else {
    boxClass.value = "pl-3  mb-1";
    textClass.value = "ml-3";
    return columnOption;
  }
});

/**
 * 获取当前布局大小
 */
const getLayoutSize = computed(() => {
  const { width, height } = currentLayout.value[mode.value];
  return {
    width,
    height,
  };
});

/**
 * 获取当前图片大小
 */
const getImgSize = computed(() => {
  const { imgWidth, imgHeight } = currentLayout.value[mode.value];
  return {
    width: imgWidth,
    height: imgHeight,
    "min-width": imgWidth,
    "min-height": imgHeight,
  };
});
</script>

<style lang="scss" scoped></style>
