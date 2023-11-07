<template>
  <Menu
    :menus="menus"
    name="name"
    fn="fn"
    :beforeCreate="menuState"
    :model="model"
  >
    <slot></slot>
  </Menu>
</template>

<script setup>
import { ref, computed, toRefs } from "vue";
import { storeToRefs } from "pinia";
import { useWidgetStore } from "../card/store.ts";
import Menu from "../../ui/components/Menu/index.vue";
const props = defineProps({
  menus: {},
  model: {
    default: "contextmenu",
  },
});
const widgetStore = useWidgetStore();

const { rightModel } = storeToRefs(widgetStore);
function menuState() {
  return rightModel.value == "follow";
}
</script>

<style lang="scss" scoped></style>
