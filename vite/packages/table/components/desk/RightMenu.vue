<template>
  <Menu :menus="menu" name="name" fn="fn" :bubble="true" :start="menuState">
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

const { rightModel } = storeToRefs(widgetStore);
const menuState = computed(() => {
  return rightModel.value == "follow" ? true : false;
});

const menu = computed(() => {
  return [...deskMenu.value, ...deskGroupMenu.value];
});
</script>

<style lang="scss" scoped></style>
