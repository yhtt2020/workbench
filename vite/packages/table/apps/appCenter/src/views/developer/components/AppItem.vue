<script setup lang="ts">
import { ref, computed } from "vue";
import { useTTAppStore } from "../../../../../ttApp/src/store";
import { storeToRefs } from "pinia";
import { updateConfig } from "./updateConfig";

const { item } = defineProps<{ item: any }>();
// esc dbl 循环二级
// ttapp数据
const ttappStore: any = useTTAppStore();
const { modal } = storeToRefs(ttappStore);
const menus = computed(() => {
  let res = [
    // {
    //   name: "编辑信息",
    //   newIcon: "fluent:compose-16-regular",
    //   cb: () => {
    //     console.log("编辑");
    //   },
    // },
    {
      name: "更新文件",
      newIcon: "fluent:delete-16-regular",
      cb: async () => {
        let res = await updateConfig(item.id);
        console.log("res :>> ", res);
      },
    },
    {
      name: "卸载",
      newIcon: "fluent:delete-16-regular",
      color: "#FF4D4F",
      cb: () => {
        ttappStore.uninstall(item.id);
      },
    },
  ];
  if (item?.card) {
    let arr: any = [];
    item.card?.map((data) => {
      arr.push({
        name: `${data.name || item.name}组件`,
        newIcon: "fluent:add-16-regular",

        cb: () => {
          addPreview(data);
        },
      });
    });
    res.unshift(...arr);
  }

  return res;
});

const previewVisible = ref(false);
const previewData = ref({
  name: "TTAppCard",
  data: {
    id: "",
    customSize: "",
  },
  size: "",
});
const addPreview = (data: any) => {
  console.log("data :>> ", data);
  previewData.value = {
    name: "TTAppCard",
    data,
    size: data.size,
  };
  console.log("previewData.value :>> ", previewData.value);
  previewVisible.value = true;
};
/** 打开主应用弹窗 */
const openModal = () => {
  modal.value.id = item.id;
  modal.value.visible = true;
};
</script>

<template>
  <!-- 添加时预览组件 -->
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
        <a-avatar shape="square" :size="70" :src="item?._logo"> </a-avatar>
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
