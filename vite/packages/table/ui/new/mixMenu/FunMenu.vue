<template>
  <xt-menu
    ref="menu"
    :name="name"
    :fn="fn"
    :menus="menuList"
    :model="model"
    :class="[menuHeight, menuWidth]"
    :beforeCreate="beforeCreate"
    @click="defaultListClick"
    @contextmenu="defaultListContextmenu"
    @mounted="onMounted"
  >
    <slot> </slot>
    <template #cardSize>
      <slot name="follow"></slot>
    </template>
  </xt-menu>

  <xt-drawer v-model="drawerVisible" :height="h">
    <slot name="drawer"></slot>
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
  height: {
    default: 0,
  },
  menuHeight: {
    default: "h-full",
  },
  menuWidth: {
    default: "w-full",
  },
});
const menu = ref(null);
const { menus, model, height } = toRefs(props);

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
const h = ref();
const defaultList = computed(() => {
  let list = [];
  h.value = 200 + height.value;

  menus?.value?.forEach((item) => {
    if (item?.children) {
      item.children.forEach((it) => {
        list.push(it);
      });
    } else {
      if (item?.divider) {
        h.value += 115;
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

const emits = defineEmits(["mounted"]);
const onMounted = ()=>{
  emits("mounted");
}
function defaultListClick(event) {
  if (rightModel.value == "default" && model.value == "all") {
    event.preventDefault();
    event.stopPropagation();
    drawerVisible.value = true;
    onMounted()
  }
}
function defaultListContextmenu(event) {
  if (rightModel.value == "default") {
    event.preventDefault();
    event.stopPropagation();
    drawerVisible.value = true;
    onMounted()
  }
}

function custom() {
  console.log("menu.value :>> ", menu.value.handleOpenMenu);
  menu.value.handleOpenMenu({
    stopPropagation: () => {},
    preventDefault: () => {},

    clientX: 200,
    clientY: 200,
  },model.value);
}
defineExpose({
  custom,
});
</script>

<style lang="scss" scoped></style>
