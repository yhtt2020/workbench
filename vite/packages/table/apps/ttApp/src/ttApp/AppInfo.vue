<script setup lang="ts">
defineProps<{
  data: any;
}>();
</script>

<template>
  <div
    class="xt-theme-b w-[542px] flex h-[184px] rounded-xl xt-bg-2 overflow-hidden"
    style=""
  >
    <!-- 左侧 -->
    <div
      class="flex justify-center items-center relative h-full w-[180px] xt-bg-2"
    >
      <!-- 渲染图片 -->
      <div class="xt-theme-b w-[80px] h-[120px]" style="height: 120px">1</div>
      <!-- 图片说明 -->
      <div
        class="flex absolute items-center w-[84px] h-[32px] xt-theme-b bottom-2 left-2 xt-bg-t-2 z-10"
        style="border-radius:8px"
      >
        <div class="m-1.5 xt-theme-b" style="width: 20px; height: 20px"></div>
        <div class="text-xs xt-title-font">{{ data?.name || "应用名称" }}</div>
      </div>
    </div>
    <!-- 右侧 -->
    <div class="px-4 py-3.5 relative flex-1" style="">
      <xt-button
        w="48"
        h="48"
        class="no-drag absolute top-1/2 -translate-y-1/2"
        style="right: 24px"
        type="theme"
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
      <div class="h-[25px] xt-theme-b text-lg">小组件名称</div>
      <!-- 描述 -->
      <div class="mt-3 xt-text-2 w-[255px] mb-3" style="height: 44px">
        一个可自由修改内容，调整大小的桌面便签。
      </div>
      <!-- 标签 -->
      <div class="flex mb-2">
        <div
          class="px-2.5 xt-theme-b text-sm xt-text-2 xt-theme-bg-2 flex justify-center items-center rounded"
          style="height: 28px"
        >
          {{ data?.modules?.card?.size || "自定义尺寸" }}
        </div>
      </div>
      <!-- 信息 -->
      <div class="flex xt-text-2">
        <div class="flex items-center mr-4">
          <xt-base-icon icon="xiazai" style="color: #508bfe" /> 1393
        </div>
        <div class="flex items-center">
          <xt-base-icon icon="shijian" style="color: #52c41a" />
          05-24
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped></style>
