<template>
  <xt-text class="xt-bg-2 rounded-xl p-3 mb-1 text-base">
    <div class="flex flex-col">
      <div class="mb-3">
        自由布局（开发中）：<a-switch v-model:checked="freeLayoutSwitch" />
      </div>
      <template v-if="freeLayoutSwitch">
        <div class="mb-3">中心点功能</div>
        <xt-select v-model="getFreeLayoutState.position" :list="positionList" />
        <xt-button
          h="40"
          class="my-3"
          @click="freeDeskResize()"
          type="theme"
          block
        >
          回到中心点</xt-button
        >
        <div class="mb-3">网格功能</div>
        <div class="mb-3">
          网格线常驻：<a-switch v-model:checked="getFreeLayoutState.auxLine" />
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
          无限画布(过大可能导致卡顿)：<a-switch
            v-model:checked="getFreeLayoutState.afterDrop"
          />
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
            v-model:value="getFreeLayoutState.width"
            :min="1000"
            :max="5000"
            :step="500"
            :tooltipOpen="true"
          />
          <a-input-number
            v-model:value="getFreeLayoutState.width"
            :min="1000"
            :step="500"
            :max="5000"
          ></a-input-number>
        </div>
        <div class="flex items-center mb-3">
          长度：
          <a-slider
            class="flex-1"
            v-model:value="getFreeLayoutState.height"
            :min="1000"
            :max="5000"
            :step="500"
            :tooltipOpen="true"
          />
          <a-input-number
            v-model:value="getFreeLayoutState.height"
            :min="1000"
            :step="500"
            :max="5000"
          ></a-input-number>
        </div>
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
const { getFreeLayoutState, isFreeLayout } = storeToRefs(freeLayoutStore);

// 自由布局开关
const freeLayoutSwitch = ref(isFreeLayout.value || false);
watch(freeLayoutSwitch, (newV) => {
  freeLayoutStore.renewFreeLayout();
});
/**
 * 重置定位
 */
const positionList = ref([
  {
    name: "顶部居左",
    value: "top left",
  },
  {
    name: "顶部居中",
    value: "top center",
  },
  {
    name: "垂直居中",
    value: "center",
  },
]);

function freeDeskResize() {
  emits("scrollbarRedirect");
}
const emitScrollbarUpdate = (event) => {
  emits("scrollbarUpdate");
};

const debounceScrollbarUpdate = useDebounceFn(emitScrollbarUpdate, 200);
// 缩放比例
const zoom = ref(
  getFreeLayoutState?.value ? getFreeLayoutState?.value.zoom * 100 : 100
);
watch(zoom, (newV) => {
  getFreeLayoutState.value.zoom = newV / 100;
  debounceScrollbarUpdate();
});

watch(
  () => [getFreeLayoutState.value?.width, getFreeLayoutState.value?.height],
  (newV) => {
    debounceScrollbarUpdate();
  }
);
</script>

<style lang="scss" scoped></style>
