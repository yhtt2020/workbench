<template>
  <xt-text class="xt-bg-2 rounded-xl p-3 mb-1 text-base">
    <div class="flex flex-col">
      <div class="mb-3">
        自由布局（开发中）：<a-switch v-model:checked="freeLayoutSwitch" />
      </div>
      <template v-if="freeLayoutSwitch">
        <div class="mb-3">中心点功能</div>
        <xt-text class="mb-3">
          <xt-button class="mr-3" h="40" @click="freeDeskResize()" type="theme">
            回到中心点</xt-button
          >
          <xt-button @click="updatePosition" h="40" type="link"
            >修改中心点</xt-button
          >
        </xt-text>
        <div class="mb-3">网格功能</div>
        <div class="mb-3">
          网格线常驻：<a-switch
            v-model:checked="getFreeLayoutState.line.isAuxLine"
          />
        </div>
        <div class="mb-3">
          中心线常驻：<a-switch
            v-model:checked="getFreeLayoutState.line.isCenterLine"
          />
        </div>
        <!-- <div class="mb-3">
          拖拽保持吸附网格：<a-switch
            v-model:checked="getFreeLayoutState.whileDrag"
          />
        </div> -->
        <div class="mb-3">
          拖拽结束吸附网格：<a-switch
            v-model:checked="getFreeLayoutState.afterDrop"
          />
        </div>
        <!-- <div class="flex items-center mb-3" v-if="getFreeLayoutState.afterDrop">
          边距：
          <a-slider
            class="flex-1"
            v-model:value="getFreeLayoutState.margin"
            :min="0"
            :max="50"
            :step="1"
            :tooltipOpen="true"
          />
          <a-input-number
            v-model:value="getFreeLayoutState.margin"
            :min="1"
            :max="200"
            :step="1"
          ></a-input-number>
        </div> -->
        <div class="mb-3">画布功能</div>
        <div class="mb-3">
          无限画布：<a-switch
            v-model:checked="getFreeLayoutState.canvas.isInfinite"
          />(最大支持10万像素)
        </div>
        <div class="flex items-center mb-3">
          缩放：
          <a-slider
            class="flex-1"
            v-model:value="zoom"
            :min="1"
            :max="200"
            :step="1"
            :tooltipOpen="true"
          />
          <a-input-number
            v-model:value="zoom"
            :min="1"
            :max="200"
            :step="1"
          ></a-input-number>
        </div>
        <div class="flex items-center mb-3">
          宽度：
          <a-slider
            class="flex-1"
            v-model:value="getFreeLayoutState.canvas.width"
            :min="1000"
            :max="maxCanvasSize"
            :step="500"
            :tooltipOpen="true"
          />
          <a-input-number
            v-model:value="getFreeLayoutState.canvas.width"
            :min="1000"
            :step="500"
            :max="maxCanvasSize"
          ></a-input-number>
        </div>
        <div class="flex items-center mb-3">
          长度：
          <a-slider
            class="flex-1"
            v-model:value="getFreeLayoutState.canvas.height"
            :min="1000"
            :max="maxCanvasSize"
            :step="500"
            :tooltipOpen="true"
          />
          <a-input-number
            v-model:value="getFreeLayoutState.canvas.height"
            :min="1000"
            :step="500"
            :max="maxCanvasSize"
          ></a-input-number>
        </div>
        <xt-button type="success" @click="resetCanvas">还原默认画布</xt-button>
        <xt-text class="mb-3"> 其他功能 </xt-text>
        <xt-button type="error" @click="resetFreeLayout">
          清除自由布局数据</xt-button
        >
      </template>

      <xt-text type="2"
        >该功能尚未完成 可能会产生严重bug，开启需谨慎！！！</xt-text
      >
    </div>
  </xt-text>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { storeToRefs } from "pinia";
import { useDebounceFn } from "@vueuse/core";
import { useFreeLayoutStore } from "./store";
// 初始化操作

const emits = defineEmits(["scrollbarRedirect", "scrollbarUpdate"]);
const freeLayoutStore = useFreeLayoutStore();
const {
  getFreeLayoutState,
  isFreeLayout,
  freeLayoutEnv,
  defaultState,
  freeLayoutState,
  getCurrentDeskId,
} = storeToRefs(freeLayoutStore);

const maxCanvasSize = computed(() => {
  if (getFreeLayoutState.value.canvas.isInfinite) {
    return 100000;
  }
  return 10000;
});

// 自由布局开关
const freeLayoutSwitch = ref(isFreeLayout.value || false);
watch(freeLayoutSwitch, (newV) => {
  freeLayoutStore.renewFreeLayout();
});

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
// 缩放比例
const zoom = ref(
  getFreeLayoutState?.value ? getFreeLayoutState?.value.canvas.zoom * 100 : 100
);
watch(zoom, (newV) => {
  getFreeLayoutState.value.canvas.zoom = newV / 100;
  debounceScrollbarUpdate();
});

watch(
  () => [
    getFreeLayoutState.value?.canvas.width,
    getFreeLayoutState.value?.canvas.height,
  ],
  (newV) => {
    debounceScrollbarUpdate();
  }
);

function resetCanvas() {
  getFreeLayoutState.value.canvas = {
    ...defaultState.value.canvas,
  };
  // freeLayoutState.value[getCurrentDeskId.value].canvas =
  //   defaultState.value.canvas;
  // for (let key in defaultState.value.canvas) {
  //   console.log("key :>> ", key);
  //   freeLayoutState.value[getCurrentDeskId.value].canvas[key] =
  //     defaultState.value.canvas[key];
  // }

  zoom.value = 100;
}
import cache from "../../card/hooks/cache";
function resetFreeLayout() {
  // freeLayoutStore.resetFreeLayout();
  cache.del("useFreeLayoutStore");
  freeLayoutStore.clearAllFreeLayout();
}
</script>

<style lang="scss" scoped></style>
