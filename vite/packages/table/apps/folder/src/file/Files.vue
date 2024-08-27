<!-- 渲染不同尺寸的文件状态 -->
<template>
  <div class="flex items-center mb-1" :class="boxClass" :style="getLayoutSize">
    <div
      :style="[getImgSize, { background: item.bg }]"
      class="relative flex items-center justify-center overflow-hidden rounded-lg"
    >
      <!-- 兼容卡片类图标 -->
      <a-avatar
        v-if="item.type === 'ttapp' || item.type == 'card'"
        :src="item.icon"
        shape="square"
        :size="40"
      />
      <!-- <a-avatar s class="" :size="16" :src="data._logo" /> -->
      <xt-new-icon
        :icon="item.icon"
        v-else-if="isIfyIcon"
        class="w-full h-full"
      ></xt-new-icon>

      <img
        ref="img"
        :src="src"
        class="w-full h-full object-cover"
        v-else
        :style="[item.color]"
      />
      <img
        src="/public/icons/tag.png"
        alt=""
        class="absolute w-[25px]"
        style="top: -2px; right: -3px"
        v-if="isIfyIcon"
      />
    </div>
    <div
      class="text-xs truncate xt-text-2"
      style="width: 90%; text-align: left"
      :style="{ textAlign: props.layout === 'rows' ? 'center' : 'left' }"
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
  layout: "rows",
});
const img = ref();
const src = ref(props.item.icon);
const data = inject("data", "");
const mode = ref("default");

// 查看图标是否是工作台图标
const isIfyIcon = computed(() => {
  const regex = /^[a-z-]+:[a-z-]+(?:-\d+)?(?:-[a-z\d-]+)?.*$/;
  return regex.test(props.item.icon);
});
// 获取文件后缀
const getExtension = (filePath) => {
  // 轻应用打开方式修改后，容错
  if (typeof filePath == "object") return "null";
  const match = filePath.match(/\.([^.]+)$/);
  return match ? match[1] : "null";
};
const imgType = [
  "png",
  "jpeg",
  "jpg",
  "gif",
  "psd",
  "bmp",
  "fpx",
  "tiff",
  "dxf",
  "eps",
  "svg",
  "cdr",
  "pcx",
  "emf",
  "wmf",
  "swf",
  "exif",
  "pdf",
  "cgm",
  "raw",
  "lic",
  "dng",
  "raf",
];
onMounted(() => {
  resize();
  let res = imgType.includes(getExtension(props.item.value));
  if (res) {
    src.value = props.item.value;
  }

  // props.item.type === 'systemApp' ? src.value = props.item.icon : src.value = props.item.value
  // if(img.value !== undefined){
  //   img.value.onerror = function() {
  //     src.value = props.item.icon
  //   };
  // }
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
    textClass.value = "ml-3 text-left";
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
