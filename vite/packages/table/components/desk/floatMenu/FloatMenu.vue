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
widgetStore.edit = true
const floatMenuStore = useFloatMenuStore();
const {firstPosition} = storeToRefs(floatMenuStore);

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
  "add",
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
      title: "添加组件",
      fn: () => {
        emits("add");
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

// 画布设置
const freeLayoutMenu = computed(() => {
  return [
    {
      icon: "fluent:compose-16-regular",
      title: "修改中心点",
      fn: () => {
        console.log(" freeLayoutEnv.value :>> ", freeLayoutEnv.value);

        console.log("object :>> ", freeLayoutEnv.value.scrollData.width);
        getFreeLayoutState.value.line.centerLine = {
          y: freeLayoutEnv.value.scrollTop,
          x:
            freeLayoutEnv.value.scrollLeft +
            freeLayoutEnv.value.scrollData.width / 2,
        };

        message.success("修改中心点成功");
      },
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
      style="touch-action: none; width: 208px"
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
        class="h-10 p-1 xt-bg-2 mb-3"
        style="font-size: 14px !important"
      />
      <!-- <xt-modal :modelValue="1"> <test></test></xt-modal> -->

      <div class="flex my-3">
        <Item v-for="item in defaultMenu" :item="item" class="mr-2" />
      </div>
      <template v-if="isFreeLayout && currentMode === 'free'">
        <xt-text type="2" class="mb-3 mt-2">画布设置</xt-text>
        <!-- <Items :menus="freeLayoutMenu"></Items> -->
        <div class="flex my-3">
          <Item v-for="item in freeLayoutMenu" :item="item" class="mr-2" />
        </div>

        <div class="mb-3 mt-2 flex items-center">
          画布缩放
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
            class="flex-1 relative xt-main-bg xt-b overflow-hidden floatMenu"
            style="width: 60px; height: 40px"
          >
            <template #addonAfter>
              <div
                class="h-full flex items-center xt-text justify-between px-3.5 relative xt-bg"
                style="border-radius: 0px 8px 8px 0"
              ></div>
              <div
                class="absolute xt-text top-1/2 -translate-y-1/2 text-base"
                style="left: 7px"
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
            class="flex-1 relative xt-main-bg xt-b overflow-hidden floatMenu"
            style="width: 60px; height: 40px"
          >
            <template #addonAfter>
              <div
                class="h-full flex items-center xt-text justify-between px-3.5 relative xt-bg"
                style="border-radius: 0px 8px 8px 0"
              ></div>
              <div
                class="absolute xt-text top-1/2 -translate-y-1/2 text-base"
                style="left: 7px"
              >
                %
              </div>
            </template>
          </XtInput>
          <XtInput
            v-else
            v-model="defaultZoom"
            class="flex-1 relative xt-main-bg xt-b overflow-hidden floatMenu"
            style="width: 60px; height: 40px"
          >
            <template #addonAfter>
              <div
                class="h-full flex items-center xt-text justify-between px-3.5 relative xt-bg"
                style="border-radius: 0px 8px 8px 0"
              ></div>
              <div
                class="absolute xt-text top-1/2 -translate-y-1/2 text-base"
                style="left: 7px"
              >
                %
              </div>
            </template>
          </XtInput>
        </div>
      </template>
    </div>
  </xt-drag>
</template>

<style scoped>
:deep(.ant-input-affix-wrapper) {
  padding: 0 !important ;
}
</style>
