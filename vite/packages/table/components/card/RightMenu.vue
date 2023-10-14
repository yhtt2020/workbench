<!-- 处理右键菜单内容 -->
<template>
  <Menu :menus="menuList" name="title" fn="fn" :start="menuState">
    <!-- <xt-button @click="rightModel = 'follow'">follow</xt-button>
    <xt-button @click="rightModel = 'default'">default</xt-button> -->
    <div @contextmenu.stop="menuVisible = true">
      <slot></slot>
    </div>
    <template #test v-if="sizes.length > 0">
      <div class="flex flex-wrap mb-2">
        <div
          v-for="item in sizes"
          class="h-8 w-12 xt-bg-2 text-sm xt-base-btn mr-3"
          style="border-radius: 16px"
          @click="updateCardSize(item)"
        >
          {{ item.name }}
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
      <!-- <HorizontalPanel
        :navList="sizeList"
        v-model:selectType="sizeType"
        bgColor="drawer-item-select-bg"
      /> -->
      <slot name="old"></slot>
    </div>
    <hr
      style="border: none; border-top: 1px solid rgba(255, 255, 255, 0.1)"
      class="my-8 ml-4 mr-4"
      v-if="sizes && sizes.length > 0"
    />
    <div class="flex flex-row">
      <!-- 根据任务需求 抽离了底部选择区 -->
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
  sizeType: {},
});
const { menus, sizes } = toRefs(props);

const widgetStore = useWidgetStore();
const { rightModel } = storeToRefs(widgetStore);

const cardSize = ref(props.sizeType);
watch(cardSize, (newV) => {
  console.log("newV :>> ", newV);
});

// 旧版菜单展示
const menuVisible = ref(false);

// 更新卡片大小
const updateCardSize = (item) => {
  cardSize.value = item;

  emits("update:sizeType", item);
};
// 删除卡片
const removeCard = () => {
  emits("removeCard");
};

// 是否启动跟随菜单
const menuState = computed(() => {
  return rightModel.value == "follow" ? true : false;
});

// 处理不同右键模式的菜单数据
const menuList = computed(() => {
  if (rightModel.value == "follow") {
    const array = [
      {
        slot: "test",
      },
      ...menus.value,
    ];
    return array;
  }
  return menus.value;
});
</script>

<style lang="scss" scoped></style>
