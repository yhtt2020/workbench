<template>
  <xt-menu
    ref="menu"
    :name="name"
    :fn="fn"
    :menus="menuList"
    :model="model"
    :class="[menuHeight, menuWidth, menuWidth]"
    :beforeCreate="beforeCreate"
    @click="defaultListClick"
    @contextmenu="defaultListContextmenu"
    @mounted="onMounted"
    @onMounted="onMounted"
    @onBeforeCreate="onBeforeCreate"
    :stopPropagation="stopPropagation"
  >
    <slot> </slot>
    <template #cardSize>
      <slot name="follow"></slot>
    </template>
    <template #extraMenu>
      <slot name="extraMenu"></slot>
    </template>
  </xt-menu>

  <xt-drawer v-if="drawerVisible" v-model="drawerVisible" :height="h">
    <slot name="drawer"></slot>
    <DefaultItem
      :menus="menuList"
      :name="name"
      :fn="fn"
      @close="drawerVisible = false"
    ></DefaultItem>
  </xt-drawer>
  <teleport to="body">
    <ChooseModal v-if="chooseVisible"></ChooseModal>
  </teleport>
</template>

<script setup>
import { ref, toRefs, computed, watch } from "vue";
import { storeToRefs } from "pinia";
import { useWidgetStore } from "../../../components/card/store";
import DefaultItem from "./DefaultItem.vue";
import ChooseModal from "./ChooseModal.vue";
import { usePlat } from '../../hooks/usePlat'
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
  stopPropagation: { default: true },
  menuWidth: {
    default: "w-full",
  },
  // 是否禁用右键点击事件
   beforeCreateFn:{
    default:()=>{
      return ()=>true
    }
   },
});
const menu = ref(null);
const { menus, model, height, stopPropagation } = toRefs(props);

const widgetStore = useWidgetStore();
const { rightModel } = storeToRefs(widgetStore);
const { firstOpen } = storeToRefs(widgetStore);
const { chooseVisible } = storeToRefs(widgetStore);

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
  menus.value.forEach((item) => {
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
  if (!props.beforeCreateFn()) return;

  return rightModel.value == "follow";
}

const emits = defineEmits(["mounted", "onMounted", "onBeforeCreate"]);
const onMounted = () => {
  emits("mounted");
  emits("onMounted");
};
const onBeforeCreate = () => {
  emits("onBeforeCreate");
};
function defaultListClick(event) {
  if (rightModel.value == "default" && model.value == "all") {
    onBeforeCreate();
    // event.preventDefault();
    // event.stopPropagation();
    drawerVisible.value = true;
    // 阻止默认事件
    if(stopPropagation.value){
      event.stopPropagation();
      event.preventDefault();
    }
    onMounted();
  }
}
function defaultListContextmenu(event) {
  // 第一次触发后出现弹窗让用户选择

  if (!firstOpen.value) {
    if(usePlat('web')){
      rightModel.value='follow'
      firstOpen.value = true;
    }else{
      chooseVisible.value = true;
      firstOpen.value = true;
      return;
    }
  }

  if (!props.beforeCreateFn()) return;

  if (rightModel.value == "default") {
    onBeforeCreate();
    // event.preventDefault();
    // event.stopPropagation();
    drawerVisible.value = true;
    // 阻止默认事件
    if(stopPropagation.value){
      event.stopPropagation();
      event.preventDefault();
    }
    onMounted();
  }
}

function custom() {
  console.log("menu.value :>> ", menu.value.handleOpenMenu);
  menu.value.handleOpenMenu(
    {
      stopPropagation: () => {},
      preventDefault: () => {},

      clientX: 200,
      clientY: 200,
    },
    model.value
  );
}
defineExpose({
  custom,
});
</script>

<style lang="scss" scoped></style>
