<template>
  <slot :name="item.slot">{{ item.slot }}</slot>
  <img
    :src="item.img"
    alt=""
    style="width: 40px; height: 40px"
    class="xt-b"
    :class="[typeClass]"
    v-if="item.img"
    @click="iconClick(item)"
  />
  <xt-icon
    v-else-if="item.icon"
    class="rounded-xl"
    :class="[typeClass]"
    :style="[item.id == id ? 'border: 3px solid var(--active-bg)' : '']"
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
  m: {
    default: "mb",
  },
});
const typeClass = computed(() => {
  return props.m + "-3";
});
const iconClick = (item, flag) => {
  console.log("item :>> ", item);
  item.callBack && item.callBack(item);
};
</script>

<style lang="scss" scoped></style>
