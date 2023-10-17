<template>
  <Menu :menus="menu" name="name" fn="fn" :start="menuState">
    <slot></slot>
  </Menu>
</template>

<script setup>
import { ref, computed, toRefs } from "vue";
import { storeToRefs } from "pinia";
import { useWidgetStore } from "../card/store.ts";
import Menu from "../../ui/components/Menu/index.vue";
const props = defineProps({
  deskMenu: {},
  deskGroupMenu: {},
});
const { deskMenu, deskGroupMenu } = toRefs(props);
const widgetStore = useWidgetStore();

const { rightModel, isOnCard } = storeToRefs(widgetStore);
const menuState = computed(() => {
  return rightModel.value == "follow" && !isOnCard.value ? true : false;
});

const menu = computed(() => {
  let arr = [...deskMenu.value, ...deskGroupMenu.value];
  arr.sort((a, b) => a.id - b.id);

  return arr;
});
</script>

<style lang="scss" scoped></style>
