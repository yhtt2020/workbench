<template>
  <xt-menu
    :name="name"
    :fn="fn"
    :menus="menuList"
    :model="model"
    :beforeCreate="beforeCreate"
    @click="defaultListClick"
    @contextmenu="defaultListContextmenu"
  >
      <slot>  </slot>
  </xt-menu>

  <xt-drawer v-model="drawerVisible" :height="height">
    <DefaultItem
      :menus="menuList"
      :name="name"
      :fn="fn"
      @close="drawerVisible = false"
    ></DefaultItem>
  </xt-drawer>
</template>

<script setup>
import { ref, toRefs, computed, watch } from "vue";
import { storeToRefs } from "pinia";
import { useWidgetStore } from "../../../components/card/store";
import DefaultItem from "./DefaultItem.vue";
const props = defineProps({
  menus: {},
  model: {
    default: "contextmenu",
  },
  name: { default: "name" },
  fn: { default: "fn" },

});
const { menus, model } = toRefs(props);

const widgetStore = useWidgetStore();
const { rightModel } = storeToRefs(widgetStore);

const drawerVisible = ref(false);

const menuList = computed(() => {
  if (rightModel.value == "default") {
    return defaultList.value;
  } else if (rightModel.value == "follow") {
    return followList.value;
  }
});
const height= ref(200)
const defaultList = computed(() => {
  let list = [];
  height.value = 200;

  menus.value?.forEach((item) => {
    if (item?.children) {
      item.children.forEach((it) => {
        list.push(it);
      });
    } else {
      if (item?.divider) {
        height.value += 115;
      }
      list.push(item);
    }
  });

  return list;
});

const followList = computed(() => {
  return menus.value;
});

function beforeCreate() {
  return rightModel.value == "follow";
}

function defaultListClick() {
  if (rightModel.value == "default" && model.value == "all") {
    drawerVisible.value = true;
  }
}
function defaultListContextmenu() {
  if (rightModel.value == "default") {
    drawerVisible.value = true;
  }
}
</script>

<style lang="scss" scoped></style>
