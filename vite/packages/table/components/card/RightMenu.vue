<!-- 处理右键菜单内容 -->
<template>
  <Menu
    name="title"
    fn="fn"
    :model="model"
    :menus="menuList"
    :beforeCreate="beforeCreateMenu"
    @destroyed="close"
  >
    <div @contextmenu="rightMenuState()" @click="defaultMenuClick()">
      <slot></slot>
    </div>
    <template #cardSize v-if="sizes.length > 0">
      <div class="flex flex-wrap mb-2 ml-2 my-1">
        <div
          v-for="item in sizes"
          class="h-8 w-12 xt-bg-2 text-sm xt-base-btn mr-2"
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
      <BottomEdit :menuList="menuList" @close="menuVisible = false" />
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
import { useFreeLayoutStore } from "./../desk/freeLayout/store";
// 初始化操作
const freeLayoutStore = useFreeLayoutStore();
const { getFreeLayoutData, isFreeLayout } = storeToRefs(freeLayoutStore);
const emits = defineEmits(["sizeType", "onClick"]);

const props = defineProps({
  // 右键菜单数据
  menus: {
    type: Array,
    default: () => {
      return [];
    },
  },
  // 卡片大小数据
  sizes: {
    type: Array,
    default: () => {
      return [];
    },
  },
  customIndex: {},
  sizeType: {},
  model: {
    default: "contextmenu",
  },
});
const { menus, sizes, model } = toRefs(props);

const widgetStore = useWidgetStore();
const { rightModel } = storeToRefs(widgetStore);

// 新版右键和点击事件切换
// 是否启动跟随菜单
const menuState = computed(() => {
  return rightModel.value == "follow" ? true : false;
});

function beforeCreateMenu(e) {
  return menuState.value;
}
const clickMenu = () => {
  if (!menuState.value) {
    menuVisible.value = true;
  }
};
// 处理不同右键模式的菜单数据
const menuList = computed(() => {
  let array = [...menus.value];
  if (rightModel.value == "follow" && sizes.value.length > 0) {
    array.unshift(
      {
        slot: "cardSize",
        title: "小组件尺寸",
        newIcon: "fluent:resize-large-16-regular",
      },
      {
        divider: true,
      }
    );
  }
  if (isFreeLayout.value) {
    // 数组倒数第二个位置添加内容
    array.splice(-1, 0, {
      newIcon: "fluent:window-new-16-regular",
      title: "层叠位置",
      lock: true,
      children: [
        {
          newIcon: "fluent:chevron-left-16-filled",
          name: "上移一层",
          fn: indexAdd,
        },
        {
          newIcon: "fluent:chevron-left-16-filled",
          name: "下移一层",
          fn: indexSub,
        },
        // {
        //   newIcon: "fluent:arrow-download-20-filled",
        //   name: "置于顶层",
        //   fn: () => {},
        // },
        // {
        //   newIcon: "fluent:arrow-download-20-filled",
        //   name: "置于底层",
        //   fn: () => {},
        // },
      ],
    });
  }
  return array;
});

// 卡片大小监听
const cardSize = ref(props.sizeType);

watch(cardSize, (newV) => {
  emits("update:sizeType", newV);
});
// 旧版菜单展示
const menuVisible = ref(false);

// 更新卡片大小
const updateCardSize = (item) => {
  cardSize.value = item;

  emits("update:sizeType", item);
};

const rightMenuState = () => {
  if (!menuState.value) menuVisible.value = true;
};
const defaultMenuClick = () => {
  if (!menuState.value && model.value == "all") menuVisible.value = true;
};
function indexAdd() {
  getFreeLayoutData.value[props.customIndex].index++;
}
function indexSub() {
  if (getFreeLayoutData.value[props.customIndex].index > 1) {
    getFreeLayoutData.value[props.customIndex].index--;
  }
}
</script>

<style lang="scss" scoped></style>
