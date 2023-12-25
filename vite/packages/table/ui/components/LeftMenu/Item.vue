<template>
  <div class="flex flex-col justify-center items-center">
    <!-- antd插槽 -->
    <div
      v-if="item.slot"
      style="width: 40px; height: 40px; border-radius: 10px"
      class="xt-bg-2 xt-base-btn"
    >
      <slot :name="item.slot"> </slot>
    </div>
    <!-- 图片 -->
    <div
      v-else-if="item.img"
      style="width: 40px; height: 40px"
      class="xt-base-btn"
    >
      <!-- 解析改变图片背景 -->
      <img
        :src="item.img"
        :style="[imgSize, imgBg]"
        style="border-radius: 10px; object-fit: cover"
      />
    </div>
    <!-- icon -->
    <xt-icon
      v-else-if="item.icon"
      w="40"
      size="20"
      radius="10"
      :type="type"
      :icon="item.icon"
    />
    <xt-new-icon
      v-else
      size="20"
      w="40"
      :icon="item.full ? full : item.newIcon"
      :bgStyle="iconBg(item.bg)"

      radius="10"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch, toRefs } from "vue";
import { storeToRefs } from "pinia";
import { useRoute, useRouter } from "vue-router";
import { appStore } from "../../../store";
const store = appStore();
const { fullScreen } = storeToRefs(store);
const props = defineProps({
  item: {},
  id: {},
  flag: {
    default: false,
  },
  w: {
    default: 20,
  },
  type: {
    default: "default",
  },
  newType: {
    default: "base",
  },
  bg: {
    default: "var(--mask-bg)",
  },
});

// 图片大小
const imgSize = computed(() => {
  return {
    width: props.w + "px",
    height: props.w + "px",
  };
});
// 图片颜色解析
const imgBg = computed(() => {
  const img = props?.item?.img;
  if (img.includes("color=#")) {
    const bg = img.slice(-7);
    return {
      filter: `drop-shadow(${bg} 80px 0)`,
      transform: "translateX(-80px)",
    };
  } else {
    return;
  }
});
const iconBg = (bg) => {
  if (bg) {
    return bg;
  }

  return props.bg;
};

// 全屏控制
const data = ref(false);
const full = computed(() => {
  fullScreen.value = data.value ? true : false;
  return data.value
    ? "fluent:full-screen-minimize-16-filled"
    : "fluent:full-screen-maximize-16-filled";
});

watch(fullScreen, (val) => {
  if (props.item.full) {
    data.value = !data.value;
  }
});
// const route = useRoute();
// const currentPage = ref(route.path);
// watch(route, (newRoute) => {
//   if ( props.item.full && currentPage !== newRoute.path) data.value = false;
// });
</script>

<style lang="scss" scoped></style>
