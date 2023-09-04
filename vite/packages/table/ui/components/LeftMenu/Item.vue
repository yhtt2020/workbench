<template>
  <slot :name="item.slot" v-if="item.slot"></slot>
  <div
    v-else-if="item.img"
    style="width: 40px; height: 40px"
    class="xt-base-btn "
    :class="{
      'xt-bg':!item.noBg
    }"
  >
    <img
      :src="item.img"
      alt=""
      :style="[stateStyle]"
      style="border-radius: 10px"
      @click="iconClick(item)"
    />
  </div>
  <xt-icon
    v-else-if="item.icon"
    w="40"
    size="20"
    radius="10"
    v-bind="config"
    :icon="item.icon"
    @click="iconClick(item)"
  ></xt-icon>
</template>

<script setup>
import { computed } from "vue";
const props = defineProps({
  item: {},
  id: {},
  flag: {
    default: false,
  },
  w: {
    default: 20,
  },
});

const stateStyle = computed(() => {
  return {
    width: props.w + "px",
    height: props.w + "px",
  };
});
const iconClick = (item, flag) => {
  // console.log("item :>> ", item);
  item.callBack && item.callBack(item);
};
</script>

<style lang="scss" scoped></style>
