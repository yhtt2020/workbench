<script setup lang="ts">
import { ref, computed } from "vue";
import { getAppImg } from "../../hooks/getAppImg";

const props = defineProps<{
  data: any;
}>();
// 添加预览
const addVisible = ref(false);
// 预览数据
const previewData = ref({});
const init = () => {
  // 预览数据初始化
  previewData.value = {
    name: "TTAppCard",
    data: props.data,
    size: props.data?.card?.size,
  };
};
init();

const addPreview = (item: any) => {
  addVisible.value = true;
};
</script>

<template>
  <div
    class="w-[542px] flex h-[184px] rounded-xl xt-bg-2 overflow-hidden"
    style=""
  >
    <!-- 左侧 -->
    <div
      class="flex justify-center items-center relative h-full w-[180px] xt-bg-2"
    >
      <!-- 渲染图片 -->
      <div class="w-[80px] h-[120px]" style="height: 120px">
        <img
          :src="data.card._preview"
          style="width: 80px; height: 120px"
          alt=""
        />
      </div>
      <!-- 图片说明 -->
      <div
        class="flex absolute items-center w-[84px] h-[32px] bottom-2 left-2 xt-bg-t-2 z-10"
        style="border-radius: 8px"
      >
        <img
          :src="data._logo"
          style="width: 20px; height: 20px"
          alt=""
          class="m-1.5"
        />
        <div class="text-xs xt-title-font">
          {{ data?.name || "应用名称" }}
        </div>
      </div>
    </div>
    <!-- 右侧 -->
    <div class="px-4 py-3.5 relative flex-1" style="">
      <!-- 添加按钮 -->
      <xt-button
        w="48"
        h="48"
        class="no-drag absolute top-1/2 -translate-y-1/2"
        style="right: 24px"
        type="theme"
        @click="addPreview()"
      >
        <div class="flex items-center justify-center">
          <xt-ify-icon
            icon="fluent:add-circle-12-filled"
            size="26"
            class="xt-text"
          ></xt-ify-icon>
        </div>
      </xt-button>

      <!-- 名称 -->
      <div class="h-[25px] text-lg">
        {{ data?.name || "小组件名称" }}
      </div>
      <!-- 描述 -->
      <div class="mt-3 xt-text-2 w-[255px] mb-3" style="height: 44px">
        {{ data?.description || "小组件描述" }}
      </div>
      <!-- 标签 -->
      <div class="flex mb-2">
        <div
          class="px-2.5 text-sm xt-text-2 xt-theme-bg-2 flex justify-center items-center rounded"
          style="height: 28px"
        >
          {{ data.card?.size || "自定义尺寸" }}
        </div>
      </div>
      <!-- 信息 -->
      <div class="flex xt-text-2">
        <div class="flex items-center mr-4">
          <xt-base-icon icon="xiazai" style="color: #508bfe" class="mr-1" />
          1393
        </div>
        <div class="flex items-center">
          <xt-base-icon icon="shijian" style="color: #52c41a" class="mr-1" />
          05-24
        </div>
      </div>
    </div>
  </div>
  <!-- 预览组件 -->
  <xt-preview-v2
    v-if="addVisible"
    v-model="addVisible"
    v-bind="data"
    title="推荐添加应用小组件"
  />
</template>
<style lang="scss" scoped></style>
