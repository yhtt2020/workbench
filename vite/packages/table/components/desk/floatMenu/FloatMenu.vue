<script setup lang="ts">
import {
  ref,
  computed,
  watch,
  toRefs,
  onBeforeUnmount,
  getCurrentInstance,
} from "vue";
import { storeToRefs } from "pinia";
import { useFreeLayoutStore } from "../freeLayout/store";
import { useWidgetStore } from "../../card/store";
import Items from "./Items.vue";
import Item from "./Item.vue";
import { useFloatMenuStore } from "./store";
import { message } from "ant-design-vue";

const widgetStore = useWidgetStore();
widgetStore.edit = true;
const floatMenuStore = useFloatMenuStore();
const { firstPosition } = storeToRefs(floatMenuStore);

const freeLayoutStore: any = useFreeLayoutStore();
const { getFreeLayoutState, freeLayoutEnv, isFreeLayout, isSelectAll }: any =
  storeToRefs(freeLayoutStore);
const props = defineProps({
  zoom: {},
  aloneZoom: {},
  alone: {},
  hide: {},
});
const { zoom, alone, aloneZoom, hide }: any = toRefs(props);
const emits = defineEmits([
  "scrollbarRedirect",
  "exit",
  "addIcon",
  "add",
  "addFolder",
  "set",
  "hide",
  "update:zoom",
  "update:aloneZoom",
  "resetLayout",
]);
// 基础
const baseHide = computed(() => {
  if (currentMode.value == "free") {
    if (getFreeLayoutState.value?.system?.hide) {
      return true;
    } else {
      return false;
    }
  } else {
    if (hide.value) {
      return true;
    } else {
      return false;
    }
  }
});
const defaultMenu = computed(() => {
  return [
    {
      icon: "fluent:add-16-regular",
      title: "添加图标",
      fn: () => {
        emits("addIcon");
      },
    },
    {
      icon: "fluent:collections-add-24-regular",
      title: "添加组件",
      fn: () => {
        emits("add");
      },
    },
    {
      icon: "fluent:app-folder-16-regular",
      title: "添加文件夹",
      fn: () => {
        emits("addFolder");
      },
    },
    {
      icon: "fluent:eye-off-16-regular",
      title: baseHide.value ? "隐藏小组件" : "显示小组件",
      type: baseHide.value ? "theme" : "default",
      fn: () => {
        if (currentMode.value == "free") {
          getFreeLayoutState.value.system.hide =
            !getFreeLayoutState.value.system.hide;
        } else {
          emits("hide");
        }
      },
    },
    {
      icon: "fluent:settings-16-regular",
      title: "桌面设置",
      fn: () => {
        emits("set");
      },
    },
  ];
});
const updatePosition = () => {
  getFreeLayoutState.value.mode.align === "custom";
  getFreeLayoutState.value.line.centerLine = {
    y: freeLayoutEnv.value.scrollTop,
    x:
      freeLayoutEnv.value.scrollLeft + freeLayoutEnv.value.scrollData.width / 2,
    // x: freeLayoutEnv.value.scrollLeft,
  };

  message.success("修改中心点成功");
};
const redirectPosition = () => {
  emits("scrollbarRedirect");
};

// 画布设置
const freeLayoutMenu = computed(() => {
  return [
    {
      icon: "fluent:compose-16-regular",
      title: "修改中心点",
      fn: updatePosition,
    },
    {
      icon: "fluent:resize-large-16-regular",
      title: "回到中心点",
      fn: () => {
        emits("scrollbarRedirect");
      },
    },
    {
      icon: "fluent:sub-grid-20-regular",
      type: getFreeLayoutState.value.line.isAuxLine ? "theme" : "default",
      title: getFreeLayoutState.value.line.isAuxLine
        ? "关闭网格线"
        : "打开网格线",
      fn: () => {
        getFreeLayoutState.value.line.isAuxLine =
          !getFreeLayoutState.value.line.isAuxLine;
      },
    },
    {
      icon: "fluent:timeline-20-regular",
      title: "拖拽结束吸附于网格",
      type: getFreeLayoutState.value.option.afterDragging ? "theme" : "default",
      fn: () => {
        getFreeLayoutState.value.option.afterDragging =
          !getFreeLayoutState.value.option.afterDragging;
      },
    },
  ];
});
// 画布缩放
const canvasMenu = computed(() => {
  return [
    {
      icon: "fluent:subtract-16-regular",
      title: "缩小",
      type: "default",
      fn: () => {
        if (currentMode.value === "free") {
          freeLayoutZoom.value -= 5;
        } else {
          if (alone.value) {
            defaultAloneZoom.value -= 5;
          } else {
            defaultZoom.value -= 5;
          }
        }
      },
    },
    {
      icon: "fluent:add-16-regular",
      type: "default",
      title: "放大",
      fn: () => {
        if (currentMode.value === "free") {
          freeLayoutZoom.value += 5;
        } else {
          if (alone.value) {
            defaultAloneZoom.value += 5;
          } else {
            defaultZoom.value += 5;
          }
        }
      },
    },
  ];
});

const deskList = ref([
  {
    name: "自动排列",
    value: "default",
  },
  {
    name: "自由布局",
    value: "free",
  },
]);

const exit1 = () => {
  emits("exit");
};

const currentMode = ref(isFreeLayout.value ? "free" : "default");
watch(
  currentMode,
  (newV) => {
    if (newV == "default") {
      emits("resetLayout");
      if (isFreeLayout.value) {
        freeLayoutStore.renewFreeLayout();
      }
    } else if (newV == "free") {
      if (!isFreeLayout.value) {
        freeLayoutStore.renewFreeLayout();
      }
    }
  },
  {
    immediate: true,
  }
);
// 缩放比例
const freeLayoutZoom = ref(
  getFreeLayoutState?.value ? getFreeLayoutState?.value.canvas.zoom * 100 : 100
);
watch(freeLayoutZoom, (newV) => {
  if (newV >= 0) {
    getFreeLayoutState.value.canvas.zoom = newV / 100;
    const int = Math.round(newV);
    freeLayoutZoom.value = int;
  } else {
    getFreeLayoutState.value.canvas.zoom = 1;
    freeLayoutZoom.value = 1;
  }
});

const defaultZoom = ref(zoom.value);
watch(defaultZoom, (newV: any) => {
  if (newV >= 0) {
    const int = Math.round(newV);
    defaultZoom.value = int;
    emits("update:zoom", int);
  } else {
    defaultZoom.value = 1;
  }
});
// 默认桌面独立缩放
const defaultAloneZoom = ref(aloneZoom.value);
watch(defaultAloneZoom, (val: any) => {
  const int = Math.round(val);
  defaultAloneZoom.value = int;
  if (int >= 0) {
    emits("update:aloneZoom", int);
  } else {
    defaultAloneZoom.value = 1;
  }
});

// 还原缩放
const resetZoom = () => {
  if (currentMode.value === "free") {
    freeLayoutZoom.value = 100;
  } else {
    if (alone.value) {
      defaultAloneZoom.value = 100;
    } else {
      defaultZoom.value = 100;
    }
  }
};
onBeforeUnmount(() => {
  isSelectAll.value = false;
  widgetStore.edit = false;
  // floatMenuStore.firstPosition = null;
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

// 排列模式
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
</script>

<template>
  <xt-drag
    boundary
    resetPosition
    v-model:y="floatMenuStore.y"
    v-model:x="floatMenuStore.x"
    :index="100"
    disabledHandle=".floatMenu"
    :firstPosition="firstPosition"
  >
    <div
      class="select-none cursor-move z-24 xt-modal rounded-xl p-3 no-drag xt-shadow xt-b"
      style="touch-action: none; width: 255px"
    >
      <xt-text type="2" class="mb-3">
        <template #center> 编辑桌面 </template>
        <template #right>
          <xt-new-icon
            @click="exit1"
            icon="akar-icons:circle-x-fill"
            class="text-2 floatMenu"
            size="20"
            style="color: var(--secondary-text) !important"
          />
        </template>
      </xt-text>
      <xt-tab
        :boxStyle="{ 'border-radius': '10px' }"
        :itemStyle="{ 'border-radius': '6px' }"
        v-model="currentMode"
        :list="deskList"
        class="h-10 p-1 xt-bg-t-2 mb-3"
        style="font-size: 14px !important"
      />
      <div class="flex my-3">
        <Item v-for="item in defaultMenu" :item="item" class="mr-2" />
      </div>
      <template v-if="isFreeLayout && currentMode === 'free'">
        <xt-text type="2" class="mb-3 mt-2">滚动模式</xt-text>
        <div>
          <xt-option-select
            class="floatMenu"
            v-model="getFreeLayoutState.mode.scroll"
            :list="scrollList"
            @cb="updateScroll"
            :border="false"
          />
        </div>
        <xt-text type="2" class="mb-3 mt-2">排列模式</xt-text>
        <xt-option-select
          :border="false"
          :list="arrangeList"
          @cb="updateArrange"
          v-model="getFreeLayoutState.mode.arrange"
        />
        <!-- <xt-text type="2" class="mb-3 mt-2">画布设置</xt-text>
        <div class="flex my-3">
          <Item
            v-for="(item, index) in freeLayoutMenu"
            :key="index"
            :item="item"
            :class="{ 'mr-2': index !== freeLayoutMenu.length - 1 }"
          />
        </div> -->
        <div class="mb-3 mt-2 flex items-center">
          桌面缩放
          <xt-new-icon
            @click="resetZoom()"
            class="xt-text-2 ml-1"
            color="var(--secondary-text)"
            size="16"
            icon="fluent:arrow-counterclockwise-20-filled"
          />
        </div>
        <div class="flex items-center">
          <Item v-for="item in canvasMenu" :item="item" class="mr-2"></Item>
          <XtInput
            v-model="freeLayoutZoom"
            class="flex-1 relative xt-b overflow-hidden floatMenu xt-bg-t-2"
            style="width: 60px; height: 40px; border-radius: 10px"
            type=""
          >
            <template #addonAfter>
              <div
                class="h-full flex items-center xt-text justify-between px-4 relative xt-bg-2"
                style="border-radius: 0px 8px 8px 0"
              ></div>
              <div
                class="absolute xt-text top-1/2 -translate-y-1/2 text-base"
                style="left: 8px"
              >
                %
              </div>
            </template>
          </XtInput>
        </div>
      </template>
      <template v-if="currentMode == 'default'">
        <div class="mb-3 mt-2 flex items-center">
          小组件缩放
          <xt-new-icon
            @click="resetZoom()"
            class="xt-text-2 ml-1"
            color="var(--secondary-text)"
            size="16"
            icon="fluent:arrow-counterclockwise-20-filled"
          />
        </div>
        <div class="flex items-center">
          <Item v-for="item in canvasMenu" :item="item" class="mr-2"></Item>
          <XtInput
            v-if="alone"
            v-model="defaultAloneZoom"
            class="flex-1 relative xt-b overflow-hidden floatMenu xt-bg-t-2"
            style="width: 60px; height: 40px; border-radius: 10px"
            type=""
          >
            <template #addonAfter>
              <div
                class="h-full flex items-center xt-text justify-between px-4 relative xt-bg-2"
                style="border-radius: 0px 8px 8px 0"
              ></div>
              <div
                class="absolute xt-text top-1/2 -translate-y-1/2 text-base"
                style="left: 8px"
              >
                %
              </div>
            </template>
          </XtInput>
          <XtInput
            v-else
            v-model="defaultZoom"
            class="flex-1 relative xt-b overflow-hidden floatMenu xt-bg-t-2"
            style="width: 60px; height: 40px; border-radius: 10px"
            type=""
          >
            <template #addonAfter>
              <div
                class="h-full flex items-center xt-text justify-between px-4 relative xt-bg-2"
                style="border-radius: 0px 8px 8px 0"
              ></div>
              <div
                class="absolute xt-text top-1/2 -translate-y-1/2 text-base"
                style="left: 8px"
              >
                %
              </div>
            </template>
          </XtInput>
        </div>
      </template>

      <div class="mt-3 flex justify-between">
        <xt-button
          w="185"
          class="xt-bg-t-2"
          icon="fluent:resize-large-16-regular"
          @click="redirectPosition"
        >
          复原桌面位置
        </xt-button>
        <xt-button
          w="40"
          class="xt-bg-t-2"
          icon="fluent:compose-16-regular"
          @click="updatePosition"
        >
        </xt-button>
      </div>
    </div>
  </xt-drag>
</template>

<style scoped>
:deep(.ant-input-affix-wrapper) {
  padding: 0 !important ;
}
</style>
