<template>
  <div class="xt-bg-2 p-4 rounded-xl" v-if="isFreeLayout">
    <xt-option-info
      title="自由布局"
      info="开放式桌面画布，支持自定义每个组件的位置、缩放，还可以实现层叠等操作。（当前功能为测试版，可能会有部分组件不兼容或影响使用的Bug，如有遇到请关闭自由布局）"
    >
      <template #icon>
        <xt-button
          w="36"
          h="22"
          type="warn"
          style="font-size: 12px"
          class="ml-4"
          radius="6"
          >BETA</xt-button
        >
      </template>
    </xt-option-info>
    <hr />
    <xt-option-info
      title="滚动模式"
      info="可以根据你的习惯修改桌面画布的滚动模式。（「自由模式」下按住「空格键」和「鼠标左键」可以随意拖动桌面）"
    />
    <xt-option-tab
      v-model="getFreeLayoutState.mode.scroll"
      :list="scrollList"
      @cb="updateScroll"
      circle
      style="height: 40px"
    />
    <hr />
    <xt-option-info
      title="排列模式"
      info="选择图标和组件在拖动时的排列模式。"
    />
    <xt-option-tab
      v-model="getFreeLayoutState.mode.arrange"
      :list="arrangeList"
      @cb="updateArrange"
      circle
      style="height: 40px"
    />
    <hr />
    <xt-option-info
      title="组件叠放"
      info="开启后支持将组件或图标进行叠放，并支持调整叠放层级。"
      isSwitch
      v-model:switch="stack"
    />
    <hr />
    <xt-option-info
      title="桌面画布尺寸"
      info="调整整体桌面画布尺寸，宽x高，以及缩放比例。"
      icon="fluent:arrow-clockwise-16-regular"
      @onIconClick="onIconClick"
    />
    <div class="mb-4 flex items-center relative" style="height: 40px">
      <xt-input
        v-model="deskWidth"
        @blur="updateDeskSize"
        class="xt-bg-t-2 xt-b"
        style="width: 146px"
      />
      <div class="flex justify-center items-center" style="width: 36px">x</div>
      <xt-input
        v-model="deskHeight"
        @blur="updateDeskSize"
        class="xt-bg-t-2 xt-b"
        style="width: 146px"
      />
      <xt-input
        v-model="deskZoom"
        @blur="updateDeskSize"
        class="xt-bg-t-2 xt-b absolute right-0"
        style="width: 74px"
      >
        <template #suffix> % </template>
      </xt-input>
    </div>
    <hr />
    <xt-option-info
      title="对齐方式"
      info="选择桌面布局的对齐方式，可以通过桌面菜单中的「重置桌面位置」回到对齐中心。"
    />
    <xt-option-select
      v-model="getFreeLayoutState.mode.align"
      :list="alignList"
      @cb="updateAlign"
    />
    <xt-button
      v-if="getFreeLayoutState.mode.align == 'custom'"
      class="xt-bg-t-2 mt-4 text-sm"
      h="40"
      block
      @click="updateCentre"
      >点击设置当前桌面位置为画布中心</xt-button
    >
    <div class="flex justify-between mb-4">
      <div>中心线</div>
      <a-switch v-model:checked="getFreeLayoutState.line.isCenterLine" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { storeToRefs } from "pinia";
import { useDebounceFn } from "@vueuse/core";
import { useFreeLayoutStore } from "./store";
import { message } from "ant-design-vue";
// 初始化操作
const emits = defineEmits(["scrollbarRedirect", "scrollbarUpdate"]);
const freeLayoutStore = useFreeLayoutStore();
const {
  getFreeLayoutState,
  isFreeLayout,
  freeLayoutEnv,
  freeLayoutData,
  defaultState,
  freeLayoutState,
  getCurrentDeskId,
  getFreeLayoutData,
} = storeToRefs(freeLayoutStore);

function freeDeskResize() {
  emits("scrollbarRedirect");
}
const emitScrollbarUpdate = (event) => {
  emits("scrollbarUpdate");
};
function updatePosition() {
  freeLayoutEnv.value.updatePosition = true;
}

const debounceScrollbarUpdate = useDebounceFn(emitScrollbarUpdate, 200);
// 堆叠
const stack = ref(getFreeLayoutState.value?.option?.collision ? false : true);
watch(stack, (newV) => {
  getFreeLayoutState.value.option.collision =
    !getFreeLayoutState.value?.option.collision;
});

/**
 * 2023-12-20 新增
 */

// 自由布局开关
const freeLayoutSwitch = ref(isFreeLayout.value || false);
watch(freeLayoutSwitch, (newV) => {
  freeLayoutStore.renewFreeLayout();
});
// 滚动模式
const scrollList = ref([
  {
    name: "自由",
    value: "free",
  },
  {
    name: "仅垂直",
    value: "vertical",
  },
  {
    name: "仅水平",
    value: "horizontal",
  },
  {
    name: "禁用",
    value: "lock",
  },
]);
const updateScroll = (newV) => {
  if (newV === "free") {
    getFreeLayoutState.value.mode.scroll = "free";
  } else if (newV === "vertical") {
    getFreeLayoutState.value.mode.scroll = "vertical";
  } else if (newV === "horizontal") {
    getFreeLayoutState.value.mode.scroll = "horizontal";
  } else if (newV === "lock") {
    getFreeLayoutState.value.mode.scroll = "lock";
  }
};

// 排列模式 2023-12-20 已跑通
const arrangeList = ref([
  {
    name: "对齐到网格",
    value: "grid",
  },
  {
    name: "组件边缘吸附",
    value: "magnet",
  },
  {
    name: "自由排列",
    value: "free",
  },
]);
const updateArrange = (newV) => {
  if (newV === "grid") {
    getFreeLayoutState.value.mode.arrange = "grid";
    getFreeLayoutState.value.option.afterDragging = true;
    getFreeLayoutState.value.option.magnet = false;
  } else if (newV === "magnet") {
    getFreeLayoutState.value.mode.arrange = "magnet";
    getFreeLayoutState.value.option.afterDragging = false;
    getFreeLayoutState.value.option.magnet = true;
  } else if (newV === "free") {
    getFreeLayoutState.value.option.arrange = "free";
    getFreeLayoutState.value.option.afterDragging = false;
    getFreeLayoutState.value.option.magnet = false;
  }
};

// 桌面大小
const deskWidth = ref(5000);
const deskHeight = ref(5000);
const deskZoom = ref(100);

if (getFreeLayoutState?.value) {
  deskWidth.value = getFreeLayoutState?.value.canvas.width;
  deskHeight.value = getFreeLayoutState?.value.canvas.height;
  deskZoom.value = getFreeLayoutState?.value.canvas.zoom * 100;
}
const updateDeskSize = () => {
  deskWidth.value = Math.floor(deskWidth.value);
  deskHeight.value = Math.floor(deskHeight.value);
  deskZoom.value = Math.floor(deskZoom.value);
  getFreeLayoutState.value.canvas.width = Math.floor(deskWidth.value);
  getFreeLayoutState.value.canvas.height = Math.floor(deskHeight.value);
  getFreeLayoutState.value.canvas.zoom = Math.floor(deskZoom.value / 100);
  debounceScrollbarUpdate();
};
const onIconClick = () => {
  deskWidth.value = 5000;
  deskHeight.value = 5000;
  deskZoom.value = 100;
};

// 对齐方式
const alignList = ref([
  {
    name: "桌面正中心",
    value: "center",
  },
  {
    name: "桌面顶端",
    // 默认为顶部水平对齐
    value: "top",
  },
  {
    name: "桌面底部",
    value: "bottom",
  },
  {
    name: "桌面左侧",
    value: "left",
  },
  {
    name: "桌面右侧",
    value: "right",
  },
  {
    name: "自定义",
    value: "custom",
  },
]);
const updateAlign = (newV) => {
  if (newV === "top") {
    getFreeLayoutState.value.mode.align = "top";
  } else if (newV === "left") {
    getFreeLayoutState.value.mode.align = "left";
  } else if (newV === "center") {
    getFreeLayoutState.value.mode.align = "center";
  } else if (newV === "bottom") {
    getFreeLayoutState.value.mode.align = "bottom";
  } else if (newV === "right") {
    getFreeLayoutState.value.mode.align = "right";
  } else if (newV === "custom") {
    getFreeLayoutState.value.mode.align = "custom";
    updateCentre();
  }
};

// 重置中心点
const updateCentre = () => {
  getFreeLayoutState.value.line.centerLine = {
    y: freeLayoutEnv.value.scrollTop,
    x:
      freeLayoutEnv.value.scrollLeft + freeLayoutEnv.value.scrollData.width / 2,
  };

  message.success("修改中心点成功");
};
</script>

<style lang="scss" scoped></style>
