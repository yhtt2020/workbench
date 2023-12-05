<template>
  <Menu :menus="menus" name="name" fn="fn" :model="model">
    <slot></slot>
  </Menu>
</template>

<script setup>
import { ref, computed, toRefs } from "vue";
import { storeToRefs } from "pinia";
import { useWidgetStore } from "../card/store.ts";
// import Menu from "../../ui/components/Menu/index.vue";
import Menu from "../../ui/new/mixMenu/FunMenu.vue";
const props = defineProps({
  menus: {},
  model: {
    default: "contextmenu",
  },
});
const widgetStore = useWidgetStore();
</script>

<style lang="scss" scoped></style>
