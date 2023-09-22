<template>
  <div>
    <!-- antd插槽 -->
    <div
      v-if="item.slot"
      style="width: 40px; height: 40px; border-radius: 10px"
      class="xt-bg-2 xt-base-btn"
    >
      <slot :name="item.slot"> </slot>
    </div>
    <!-- 图片 -->
    <!-- :class="{ 'xt-bg-2': !item.noBg }" -->
    <div
      v-else-if="item.img"
      style="width: 40px; height: 40px"
      class="xt-base-btn"
    >
      <img
        :src="item.img"
        :style="[imgSize]"
        style="border-radius: 10px; object-fit: cover"
      />
    </div>
    <!-- icon -->
    <xt-icon
      @click="itemClick()"
      v-else
      w="40"
      size="20"
      radius="10"
      :type="type"
      :icon="item.full ? full : item.icon"
    ></xt-icon>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { appStore } from "../../../store";
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
  full: {},
});

// 图片大小
const imgSize = computed(() => {
  return {
    width: props.w + "px",
    height: props.w + "px",
  };
});

// 全屏控制
const store = appStore();
const data = ref(false);
const full = computed(() => {
  store.fullScreen = data.value ? true : false;
  return data.value ? "quxiaoquanping_huaban" : "quanping_huaban";
});
const itemClick = () => {
  if (props.item.full) {
    data.value = !data.value;
  }
};
</script>

<style lang="scss" scoped></style>
