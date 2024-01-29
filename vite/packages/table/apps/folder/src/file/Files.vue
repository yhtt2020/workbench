<!-- 渲染不同尺寸的文件状态 -->
<template>
  <div
    class="flex items-center mb-1"
    :class="boxClass"
    :style="getLayoutSize"
  >
    <div  :style="[getImgSize,{background: item.bg}]" class="overflow-hidden rounded-lg">
      <!-- item?.linkIcon" 获取链接中无法获取到链接的图标使用默认图标 -->
      <xt-new-icon :icon="item.icon" size="40" v-if="item?.linkIcon"></xt-new-icon>
      <img v-else ref="img" :src="src" class="w-full h-full " :style="[item.color]"/>
    </div>
    <div
      class="text-xs truncate xt-text-2"
      style="width: 90%"
      :class="textClass"
    >
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
const img = ref()
const src= ref(props.item.value)
const data = inject("data", "");
const mode = ref("default");

onMounted(() => {
  resize();
  props.item.type === 'systemApp' ? src.value = props.item.icon : src.value = props.item.value
  if(img.value !== undefined){
    img.value.onerror = function() {
      src.value = props.item.icon
    };
  }
  
});

watch(
  () => data.value.customSize,
  () => {
    resize();
  },
  {
    deep: true,
  }
);

const resize = () => {
  let [width, height] = data.value.customSize.split("x");
  if (width == "2" || height == "2") {
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
    boxClass.value = " flex-col justify-center items-center";
    textClass.value = "text-center  mx-auto mt-1";
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
