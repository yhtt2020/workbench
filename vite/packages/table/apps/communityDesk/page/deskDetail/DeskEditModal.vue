<script setup>
import {
  ref,
  computed,
  watch,
  toRefs,
  onBeforeUnmount,
  getCurrentInstance,
} from "vue";
import { storeToRefs } from "pinia";
import { useFreeLayoutStore } from "../../../../components/desk/freeLayout/store";
import { useWidgetStore } from "../../../../components/card/store";
import { useFloatMenuStore } from "../../../../components/desk/floatMenu/store";
import Item from "../../../../components/desk/floatMenu/Item.vue";
import { message } from "ant-design-vue";

const widgetStore = useWidgetStore();
// widgetStore.edit = true;
const floatMenuStore = useFloatMenuStore();
const { firstPosition } = storeToRefs(floatMenuStore);

const freeLayoutStore = useFreeLayoutStore();
const { getFreeLayoutState, freeLayoutEnv, isFreeLayout, isSelectAll } =
  storeToRefs(freeLayoutStore);
const props = defineProps({
  zoom: {},
  aloneZoom: {},
  alone: {},
  hide: {},
});
const { zoom, alone, aloneZoom, hide } = toRefs(props);

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
  freeLayoutStore.updateLocation();
  message.success("修改中心点成功");
};
const redirectPosition = () => {
  emits("scrollbarRedirect");
};

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
            const int = Math.round(defaultAloneZoom.value);
            defaultAloneZoom.value = int - 5;
          } else {
            const int = Math.round(defaultZoom.value);
            defaultZoom.value = int - 5;
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
            const int = Math.round(defaultAloneZoom.value);
            defaultAloneZoom.value = int + 5;
          } else {
            const int = Math.round(defaultZoom.value);
            defaultZoom.value = int + 5;
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
  redirectPosition();
});

const defaultZoom = ref(zoom.value);
watch(defaultZoom, (newV) => {
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
watch(defaultAloneZoom, (val) => {
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
    :test="false"
  >
    <div
      class="select-none cursor-move z-24 xt-modal rounded-xl p-3 no-drag xt-shadow xt-b"
      style="touch-action: none; width: 255px"
    >
      <xt-text type="2" class="mb-3">
        <template #center> 编辑桌面 </template>
        <template #right>
          <xt-ify-icon
            @click="exit1"
            icon="akar-icons:circle-x-fill"
            class="xt-text-2 floatMenu"
            size="20"
          />
        </template>
      </xt-text>

      <div class="flex flex-col">
        <div class="mb-3 mt-2 flex items-center">
          <span class="xt-text-2 xt-font font-14">桌面缩放</span>
          <xt-ify-icon
            @click="resetZoom()"
            class="xt-text-2"
            size="16"
            icon="fluent:arrow-counterclockwise-20-filled"
          />
        </div>

        <div class="flex items-center">
          <Item v-for="item in canvasMenu" :item="item" class="mr-2"></Item>
          <XtInput
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
      </div>

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
