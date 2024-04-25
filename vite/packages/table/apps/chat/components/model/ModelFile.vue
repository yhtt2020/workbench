<!-- 3D模型组件 -->
<script setup>
import * as OV from "online-3d-viewer";
import { onMounted, ref, toRefs } from "vue";

const props = defineProps({
  data: {
    type: Object,
    default: () => ({}),
  },
});
const { data } = toRefs(props);

let myViewer = null;

/**全屏**/
const fullScreen = ref(false);

/**切换全屏**/
const setFullScreen = () => {
  fullScreen.value = !fullScreen.value;
  myViewer.Resize();
};

onMounted(() => {
  OV.SetExternalLibLocation("../libs");
  /**获取查看器的父元素**/
  let parentDiv = document.getElementById(
    "viewer" + "_" + data.value?.ID
  );
  /**使用父元素和一些参数初始化查看器**/
  let viewer = new OV.EmbeddedViewer(parentDiv, {
    backgroundColor: new OV.RGBAColor(0, 0, 0, 5),
  });
  viewer.LoadModelFromUrlList([data.value?.url]);
  myViewer = viewer;
  console.log('测试-parentDiv',parentDiv);
});
</script>

<template>
  <div :class="{ 'full-screen': fullScreen }" class="model-preview">
    <xt-button
      @click="setFullScreen"
      size="mini"
      :w="30"
      :h="30"
      class="pointer xt-bg-2 absolute"
      :style="!fullScreen ? { right:' 10px', top: '10px' } :{ right: '10px', top: '40px' }"
      style="border-radius: 4px"
    >
      <div class="flex items-center justify-center">
        <xt-ify-icon
          icon="fluent:full-screen-maximize-16-regular"
          size="20"
          class="xt-text-2"
          v-if="!fullScreen"
        />
        <xt-ify-icon
          v-else
          icon="fluent:full-screen-minimize-16-regular"
          size="20"
          class="xt-text-2"
        />
      </div>
    </xt-button>

    <div
      :style="{
        width: fullScreen ? '100vw' : '300px',
        height: fullScreen ? '100vh' : '300px',
      }"
      @contextmenu.stop
      :id="'viewer' + '_' + data.ID"
      class="online_3d_viewer"
      style="border-radius: 4px"
      model="/model/model.stl"
    ></div>
  </div>
</template>

<style lang="scss" scoped>
.model-preview {
  width: 300px;
  height: 300px;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 10px;
  position: relative;
}
.full-screen {
  background: var(--primary-bg-solid);
  width: 100vw;
  height: 100vh;
  left: 0;
  right: 0;
  position: fixed;
  z-index: 999;
  top: 0;
}
.normal {
  width: auto;
  height: auto;
}
</style>