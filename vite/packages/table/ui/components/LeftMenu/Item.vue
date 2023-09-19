<template>
  <div>
    <div
      v-if="item.slot"
      style="width: 40px; height: 40px; border-radius: 10px"
      class="xt-bg-2 xt-base-btn"
    >
      <slot :name="item.slot"> </slot>
    </div>
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
        style="border-radius: 10px;object-fit: cover"
      />
    </div>
    <xt-icon
      v-else-if="item.icon"
      w="40"
      size="20"
      radius="10"
      :type="type"
      :icon="item.icon"
    ></xt-icon>
  </div>
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
  type: {
    default: "default",
  },
});

const stateStyle = computed(() => {
  return {
    width: props.w + "px",
    height: props.w + "px",
  };
});
</script>

<style lang="scss" scoped></style>
