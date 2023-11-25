<template>
  <div class="xt-bg-2 rounded-xl p-3 mb-3 text-base">
    <div class="flex justify-between">
      <div class="flex justify-center">
        自由布局
        <xt-button
          w="44"
          h="22"
          type="warn"
          style="font-size: 12px"
          class="ml-3"
          radius="8"
          >开发中</xt-button
        >
      </div>
      <a-switch v-model:checked="freeLayoutSwitch" />
    </div>
    <template v-if="freeLayoutSwitch">
      <div class="xt-text-2 text-sm my-3">
        开放式桌面画布，支持自定义每个组件的位置、缩放，还可以实现层叠等操作（当前功能尚未完成，可能会产生严重Bug，仅限尝鲜体验）
      </div>
      <hr class="my-3" />
      <div class="flex justify-between mb-3">
        <div>悬浮操作栏</div>
        <a-switch v-model:checked="getFreeLayoutState.system.isFloatMenu" />
      </div>
      <hr class="my-3" />
      <div class="flex justify-between mb-3">
        <div>卡片叠放</div>
        <a-switch v-model:checked="stack" />
      </div>
      <div class="xt-text-2 text-sm my-3">
        开启后组件不可以叠加摆放，通过右键菜单层叠位置来设置层级
      </div>
      <hr class="my-3" />
      <div class="flex justify-between mb-3">
        <div>卡片吸附</div>
        <a-switch v-model:checked="getFreeLayoutState.option.magnet" />
      </div>
      <div class="xt-text-2 text-sm my-3">
        开启后会在组件拖拽时自动吸附到组件边缘
      </div>
      <hr class="my-3" />
      <div class="flex justify-between mb-3">
        <div>基于网格移动</div>
        <a-switch v-model:checked="getFreeLayoutState.option.whileDragging" />
      </div>
      <hr class="my-3" />
      <div class="mb-3">画布中心点</div>
      <div class="xt-text-2 text-sm my-3">
        桌面是一张「画布」，你可以手动调节画布的中心，然后点击「回到中心点」快速定位画布。
      </div>
      <div class="flex mb-3 justify-between">
        <xt-button class="mr-3 xt-bg" w="204" h="40" @click="freeDeskResize()">
          回到中心点</xt-button
        >
        <xt-button @click="updatePosition" w="204" h="40" class="xt-bg"
          >修改中心点</xt-button
        >
      </div>
      <hr class="my-3" />
      <div class="flex justify-between mb-3">
        <div>画布网格线</div>
        <a-switch v-model:checked="getFreeLayoutState.line.isAuxLine" />
      </div>
      <div class="xt-text-2 text-sm my-3">在桌面上显示画布的网格线。</div>
      <hr class="my-3" />
      <div class="flex justify-between mb-3">
        <div>中心线</div>
        <a-switch v-model:checked="getFreeLayoutState.line.isCenterLine" />
      </div>
      <div class="xt-text-2 text-sm my-3">在桌面是显示画布的中心线。</div>
      <hr class="my-3" />
      <div class="flex justify-between mb-3">
        <div>拖拽自动吸附到网格</div>
        <a-switch v-model:checked="getFreeLayoutState.option.afterDragging" />
      </div>
      <div class="xt-text-2 text-sm my-3">
        拖动小组件进行排列时自动对齐到网格。
      </div>
      <hr class="my-3" />
      <div class="flex justify-between mb-3">
        <div>无限画布</div>
        <a-switch v-model:checked="getFreeLayoutState.canvas.isInfinite" />
      </div>
      <div class="xt-text-2 text-sm my-3">过大的画布可能会导致卡顿。</div>
      <hr class="my-3" />
      <div class="mb-1">画布缩放</div>
      <div class="flex">
        <div class="w-full mr-3">
          <a-slider
            v-model:value="zoom"
            :min="1"
            :max="200"
            :step="1"
            :tooltipOpen="true"
          />
        </div>
        <a-input-number
          v-model:value="zoom"
          :min="1"
          :max="200"
          :step="1"
        ></a-input-number>
      </div>
      <hr class="my-3" />
      <div class="mb-1">画布长度</div>
      <div class="flex">
        <div class="w-full mr-3">
          <a-slider
            class="flex-1"
            v-model:value="getFreeLayoutState.canvas.height"
            :min="1000"
            :max="maxCanvasSize"
            :step="500"
            :tooltipOpen="true"
          />
        </div>
        <a-input-number
          v-model:value="getFreeLayoutState.canvas.height"
          :min="1000"
          :step="500"
          :max="maxCanvasSize"
        ></a-input-number>
      </div>
      <hr class="my-3" />
      <div class="mb-1">画布宽度</div>
      <div class="flex">
        <div class="w-full mr-3">
          <a-slider
            v-model:value="getFreeLayoutState.canvas.width"
            :min="1000"
            :max="maxCanvasSize"
            :step="500"
            :tooltipOpen="true"
          />
        </div>
        <a-input-number
          v-model:value="getFreeLayoutState.canvas.width"
          :min="1000"
          :step="500"
          :max="maxCanvasSize"
        ></a-input-number>
      </div>
      <hr class="my-3" />
      <div class="mb-3">辅助功能</div>
      <div class="xt-text-2 text-sm my-3"></div>
      <div class="flex mb-3 justify-between">
        <xt-button class="xt-bg mr-3" w="204" h="40" :copy="copyData">
          分享自由布局</xt-button
        >

        <xt-button class="xt-bg" w="204" h="40" @click="clearFreeLayout">
          删除自由布局</xt-button
        >
      </div>
      <hr class="my-3" />
      <div class="mb-3">实验室功能</div>
      <!-- <div class="flex justify-between"></div>
      <xt-button class="mr-3 xt-bg" w="204" h="40" @click="freeDeskResize()">
        重新排列所有组件</xt-button
      >
      <xt-button class="xt-bg" w="204" h="40" :copy="copyData">
        导入自由布局</xt-button
      >
      <div class="flex justify-between">
        <xt-button type="error" w="204" h="40" @click="clearAllFreeLayout">
          卡死重置</xt-button
        >
      </div> -->
    </template>
  </div>
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
  freeLayoutData,
  defaultState,
  freeLayoutState,
  getCurrentDeskId,
  getFreeLayoutData,
} = storeToRefs(freeLayoutStore);

const maxCanvasSize = computed(() => {
  if (getFreeLayoutState.value.canvas.isInfinite) {
    return 100000;
  }
  return 10000;
});
const copyData = computed(() => {
  return JSON.stringify({
    state: getFreeLayoutState.value,
    data: getFreeLayoutData.value,
  });
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
// 堆叠
const stack = ref(getFreeLayoutState.value?.option.collision ? false : true);
watch(stack, (newV) => {
  getFreeLayoutState.value.option.collision =
    !getFreeLayoutState.value?.option.collision;
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

function clearFreeLayout() {
  freeLayoutSwitch.value = false;
  console.log('getCurrentDeskId.value :>> ', getCurrentDeskId.value);
  freeLayoutStore.clearFreeLayout(getCurrentDeskId.value);
}
// 清除所有自由布局
function clearAllFreeLayout() {
  freeLayoutSwitch.value = false;
  // cache.del("useFreeLayoutStore");
  // freeLayoutStore.clearAllFreeLayout();
}
</script>

<style lang="scss" scoped></style>
