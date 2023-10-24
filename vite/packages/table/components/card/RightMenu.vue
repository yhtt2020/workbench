<!-- 处理右键菜单内容 -->
<template>
  <Menu
    name="title"
    fn="fn"
    v-model:trigger="trigger"
    :menus="menuList"
    :model="model"
    :start="menuState"
    @closeMenu="close"
  >
    <div
      @contextmenu="rightMenuState()"

    >
      <slot></slot>
    </div>
    <template #cardSize v-if="sizes.length > 0">
      <div class="flex flex-wrap mb-2 ml-3 my-1">
        <div
          v-for="item in sizes"
          class="h-8 w-12 xt-bg-2 text-sm xt-base-btn mr-3"
          style="border-radius: 16px"
          @click="updateCardSize(item)"
        >
          {{ item.title }}
        </div>
      </div>
    </template>
  </Menu>

  <a-drawer
    :width="120"
    height="auto"
    class="drawer"
    :closable="true"
    placement="bottom"
    v-model:visible="menuVisible"
    @close="menuVisible = false"
  >
    <div
      class="flex flex-row items-center mb-3 ml-4"
      v-if="sizes && sizes.length > 0"
    >
      <div class="mr-4">小组件尺寸</div>
      <HorizontalPanel
        :navList="sizes"
        v-model:selectType="cardSize"
        bgColor="drawer-item-select-bg"
      />
      <slot name="old"></slot>
    </div>
    <hr
      style="border: none; border-top: 1px solid rgba(255, 255, 255, 0.1)"
      class="my-8 ml-4 mr-4"
      v-if="sizes && sizes.length > 0"
    />
    <div class="flex flex-row">
      <slot name="menuExtra"></slot>
      <BottomEdit
        :menuList="menuList"
        @close="menuVisible = false"
        @removeCard="doRemoveCard"
      />
      <!--      <div class="w-24 h-24 ml-4 option" @click="onCopy"-->
      <!--           v-if="options.type.includes('CPU') || options.type.includes('GPU')">-->
      <!--        <Icon class="icon" icon="fuzhi"></Icon>-->
      <!--        复制数据-->
      <!--      </div>-->
    </div>
  </a-drawer>
</template>

<script setup>
import { ref, toRefs, computed, watch } from "vue";
import { storeToRefs } from "pinia";
import { useWidgetStore } from "./store.ts";
import Menu from "../../ui/components/Menu/index.vue";
import BottomEdit from "./BottomEdit.vue";
import HorizontalPanel from "../HorizontalPanel.vue";

const emits = defineEmits(["removeCard", "sizeType"]);

const props = defineProps({
  // 右键菜单数据
  menus: {
    default: () => {
      return [];
    },
  },
  // 卡片大小数据
  sizes: {
    default: () => {
      return [];
    },
  },
  //
  event: {
    default: null,
  },
  oldMenuVisible: {},
  sizeType: {},
});
const { menus, sizes, oldMenuVisible, currentEvent, event } = toRefs(props);

const widgetStore = useWidgetStore();
const { rightModel } = storeToRefs(widgetStore);

// 新版右键和点击事件切换
const model = ref("contextmenu");
// 是否启动跟随菜单
const menuState = computed(() => {
  return rightModel.value == "follow" ? true : false;
});

// 处理不同右键模式的菜单数据
const menuList = computed(() => {
  if (rightModel.value == "follow" && sizes.value.length > 0) {
    let array = [
      {
        slot: "cardSize",
        title: "小组件尺寸",
        newIcon: "fluent:resize-large-16-regular",
      },
      {
        divider: true,
      },
      ...menus.value,
    ];
    return array;
  }
  return menus.value;
});

// 卡片大小监听
const cardSize = ref(props.sizeType);
watch(cardSize, (newV) => {
  emits("update:sizeType", newV);
});
// 旧版菜单展示
const menuVisible = ref(false);
const menuRef = ref();
// 旧版右键监听
const trigger = ref(false);
const close = () => {
  trigger.value = false;
};
watch(oldMenuVisible, (newV) => {
  // 如果不处于主应用模式
  if (!menuState.value) menuVisible.value = newV;
  else if (menuState.value) {
    trigger.value = true;
    emits("update:oldMenuVisible", false);
  }
});
watch(menuVisible, (newV) => {
  emits("update:oldMenuVisible", newV);
  oldMenuVisible.value = newV;
});

// 更新卡片大小
const updateCardSize = (item) => {
  cardSize.value = item;

  emits("update:sizeType", item);
};
// 删除卡片
const removeCard = () => {
  emits("removeCard");
};
const rightMenuState = () => {
  if (!menuState.value) menuVisible.value = true;
};
</script>

<style lang="scss" scoped></style>
