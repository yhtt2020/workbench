<script setup lang="ts">
import { ref, computed } from "vue";
import { useTTAppStore } from "../../../../../ttApp/src/store";
import { storeToRefs } from "pinia";

const { item } = defineProps<{ item: any }>();

// ttapp数据
const ttappStore: any = useTTAppStore();
const { modal } = storeToRefs(ttappStore);
const menus = computed(() => {
  return [
    {
      name: "添加小组件",
      newIcon: "fluent:add-16-regular",
      cb: () => {
        addPreview();
      },
      disabled: item.modules?.card ? false : true,
    },
    // {
    //   name: "编辑信息",
    //   newIcon: "fluent:compose-16-regular",
    //   cb: () => {
    //     console.log("编辑");
    //   },
    // },
    {
      name: "卸载",
      newIcon: "fluent:delete-16-regular",
      color: "#FF4D4F",
      cb: () => {
        ttappStore.uninstall(item.id);
      },
    },
  ];
});

const previewVisible = ref(false);
const previewData = {
  name: "TTAppCard",
  data: {
    id: item.id,
    customSize: item.modules?.card?.size,
  },
};
const addPreview = () => {
  previewVisible.value = true;
  //  obj =
  const card = item.modules?.card;
  console.log("card :>> ", card);
};
/** 打开主应用弹窗 */
const openModal = () => {
  modal.value.id = item.id;
  modal.value.visible = true;
};
// console.log("window?.globalArgs :>> ", window?.globalArgs["user-data-path"]);
const getImgPath = () => {
  const { join } = require("path");
  let dataPath = window?.globalArgs["user-data-path"];
  let imgPath = join(dataPath, "apps", item.id, item.logo);
  console.log("imgPath :>> ", imgPath);
  return imgPath;
};
getImgPath();
</script>

<template>
  <!-- 添加时预览组件 -->
  {{ item }}
  <xt-preview-v2
    v-if="previewVisible"
    v-model="previewVisible"
    v-bind="previewData"
    title="推荐添加应用小组件"
  />
  <!-- 渲染样式 -->
  <div
    class="xt-bg-2 rounded-xl flex items-center justify-between p-4 mb-4"
    style="height: 102px"
  >
    <!-- 左侧 -->
    <div class="flex">
      <div
        class="rounded-xl mr-4 overflow-hidden"
        style="width: 70px; height: 70px"
      >
        <a-avatar shape="square" :size="70" :src="getImgPath()"> </a-avatar>
      </div>
      <div class="flex flex-col justify-center">
        <div>{{ item.name }}</div>
        <div class="xt-text-2 text-sm mt-2">
          {{ item.description }}
        </div>
      </div>
    </div>
    <!-- 右侧 -->
    <div class="flex">
      <!-- 打开按钮 -->
      <div
        class="flex justify-center items-center xt-modal rounded-lg mr-2 cursor-pointer"
        style="width: 72px; height: 32px"
        @click="openModal"
      >
        <xt-ify-icon icon="fluent:open-16-regular" size="16" class="mr-1" />
        <span class="text-sm">打开 </span>
      </div>
      <!-- 更多功能 -->
      <xt-menu :menus="menus" name="name" fn="cb" model="click">
        <div
          class="xt-modal flex justify-center items-center rounded-lg"
          style="width: 32px; height: 32px"
        >
          <xt-ify-icon icon="fluent:more-horizontal-16-regular" />
        </div>
      </xt-menu>
    </div>
  </div>
</template>
<style lang="scss" scoped></style>
