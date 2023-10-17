<template>
  <Menu :menus="deskMenu" name="name" fn="fn" :bubble="true" :start="menuState">
    <slot></slot>
  </Menu>
</template>

<script setup>
import { ref, computed } from "vue";
import { storeToRefs } from "pinia";
import { useWidgetStore } from "../card/store.ts";
import Menu from "../../ui/components/Menu/index.vue";
const props = defineProps({
  deskMenu: {},
});
const widgetStore = useWidgetStore();

const { rightModel } = storeToRefs(widgetStore);
const menuState = computed(() => {
  return rightModel.value == "follow" ? true : false;
});
</script>

<style lang="scss" scoped></style>
