<script setup lang="ts">
import { ref, computed, watch, toRefs } from "vue";
import { storeToRefs } from "pinia";
import { useFreeLayoutStore } from "../freeLayout/store";
import Items from "./Items.vue";
import Item from "./Item.vue";
// 初始化操作
const freeLayoutStore: any = useFreeLayoutStore();
const { getFreeLayoutState, freeLayoutEnv, isFreeLayout }: any =
  storeToRefs(freeLayoutStore);
const props = defineProps({
  zoom: {},
});
const { zoom }: any = toRefs(props);
const emits = defineEmits([
  "scrollbarRedirect",
  "exit",
  "add",
  "set",
  "hide",
  "update:zoom",
]);
// 基础
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
      title: "隐藏小组件",
      fn: () => {
        emits("hide");
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
        freeLayoutEnv.value.updatePosition = true;
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
      type: getFreeLayoutState.value.afterDrop ? "theme" : "default",
      fn: () => {
        getFreeLayoutState.value.afterDrop =
          !getFreeLayoutState.value.afterDrop;
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
          freeLayoutZoom.value += 1;
        } else {
          defaultZoom.value += 1;
        }
      },
    },
    {
      icon: "fluent:subtract-16-regular",
      title: "缩小",
      type: "default",
      fn: () => {
        if (currentMode.value === "free") {
          freeLayoutZoom.value -= 1;
        } else {
          defaultZoom.value -= 1;
        }
      },
    },
  ];
});

const deskList = ref([
  {
    name: "固定布局",
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

// 缩放比例
const freeLayoutZoom = ref(
  getFreeLayoutState?.value ? getFreeLayoutState?.value.canvas.zoom * 100 : 100
);
watch(freeLayoutZoom, (newV) => {
  getFreeLayoutState.value.canvas.zoom = newV / 100;
});

const defaultZoom = ref(zoom.value);
watch(defaultZoom, (newV) => {
  emits("update:zoom", newV);
});
</script>

<template>
  <xt-drag
    boundary
    resetPosition
    :y="20"
    :x="20"
    :index="100"
    disabledHandle=".floatMenu"
  >
    <div
      class="select-none cursor-move z-24 xt-modal rounded-xl p-3 no-drag xt-shadow"
      style="touch-action: none; width: 208px"
    >
      <xt-text type="2" class="mb-3">
        <template #center> 编辑桌面 </template>
        <template #right>
          <xt-button w="20" h="20" radius="50" class="floatMenu" @click="exit1">
            <xt-new-icon
              icon="fluent:dismiss-16-filled"
              class="text-2"
              size="12"
              style="color: var(--secondary-text) !important"
            />
          </xt-button>
        </template>
      </xt-text>
      <xt-tab
        v-model="currentMode"
        :list="deskList"
        class="h-10 p-1 xt-bg-2 mb-3"
        style="font-size: 14px !important"
      />
      <div class="flex my-3">
        <Item v-for="item in defaultMenu" :item="item" class="mr-3" />
      </div>
      <template v-if="isFreeLayout && currentMode === 'free'">
        <xt-text type="2" class="mb-3 mt-2">画布设置</xt-text>
        <Items :menus="freeLayoutMenu"></Items>
        <div class="mb-3 mt-2 flex items-center">
          画布缩放
          <xt-new-icon
            @click="getFreeLayoutState.canvas.zoom = 1"
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
            class="flex-1 relative xt-main-bg xt-b overflow-hidden"
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
      <div v-if="!isFreeLayout && currentMode === 'free'">
        你尚未开启自由布局
      </div>
      <template v-if="currentMode == 'default'">
        <div class="mb-3 mt-2 flex items-center">
          小组件缩放
          <xt-new-icon
            @click="defaultZoom = 100"
            class="xt-text-2 ml-1"
            color="var(--secondary-text)"
            size="16"
            icon="fluent:arrow-counterclockwise-20-filled"
          />
        </div>
        <div class="flex items-center">
          <Item v-for="item in canvasMenu" :item="item" class="mr-2"></Item>
          <XtInput
            v-model="defaultZoom"
            class="flex-1 relative xt-main-bg xt-b overflow-hidden"
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
