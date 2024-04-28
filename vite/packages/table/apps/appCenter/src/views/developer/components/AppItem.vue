<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useTTAppStore } from "../../../../../ttApp/src/store";
import { storeToRefs } from "pinia";
import { installV2 } from "../hooks/installV2";
import { uninstall } from "../hooks/uninstall";
import { addIcon, addNav } from "../hooks/add";
import { navStore as useNavStore } from "../../../../../../store/nav";
import { validate } from "../hooks/validate";
const navStore = useNavStore();
const { navigationToggle } = storeToRefs(navStore);
const { item } = defineProps<{ item: any }>();
watch(
  () => item.value,
  () => {
    console.log("更新了 :>> ");
  }
);
// ttapp数据
const ttappStore: any = useTTAppStore();
const { modal, ttappList } = storeToRefs(ttappStore);
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
      name: "添加应用到",
      newIcon: "fluent:add-16-regular",
      children: [
        {
          name: "桌面",
          newIcon: "fluent:desktop-16-regular",
          cb: () => {
            const data = validate(item.id);
            addIcon(data);
          },
        },
        {
          newIcon: "fluent:tablet-16-regular",
          name: "底部导航",
          disabled: !navigationToggle.value[2],
          cb: () => {
            const data = validate(item.id);
            addNav(data, "bottom");
          },
        },
        {
          disabled: !navigationToggle.value[0],
          newIcon: "fluent:panel-left-contract-16-regular",
          name: "左侧导航",
          cb: () => {
            const data = validate(item.id);
            addNav(data, "left");
          },
        },
        {
          disabled: !navigationToggle.value[1],
          newIcon: "fluent:panel-right-contract-16-regular",
          name: "右侧导航",
          cb: () => {
            const data = validate(item.id);
            addNav(data, "right");
          },
        },
      ],
    },
    {
      name: "应用设置",
      newIcon: "fluent:settings-16-regular",
      cb: () => {},
    },
    {
      name: "更新文件",
      newIcon: "fluent:arrow-sync-16-regular",
      cb: async () => {
        await installV2(item.id);
      },
    },
    {
      name: "上传应用",
      newIcon: "fluent:cloud-arrow-up-16-regular",
    },
    {
      name: "卸载",
      newIcon: "fluent:delete-16-regular",
      color: "#FF4D4F",
      cb: () => {
        window.$ui.confirm(
          "卸载会将桌面导航相关该应用的快捷方式删除，是否继续？",
          "",
          {
            ok: async () => {
              uninstall(item.id);
            },
            type: "warning",
          }
        );
      },
    },
  ];
  if (item?.card) {
    let arr: any = [];
    item.card?.map((data) => {
      arr.push({
        name: `${data.name || item.name}组件`,
        newIcon: "fluent:collections-add-24-regular",
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
  previewData.value = {
    name: "TTAppCard",
    data,
    size: data.size,
  };
  previewVisible.value = true;
};
/** 打开主应用弹窗 */
const entry = () => {
  ttappStore.enterApp(item.id);
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
  <!-- v-for="item in ttappList" :item="item" :key="item.id" -->
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
        <div class="flex">
          {{ item.name }}
          <div
            class="tt-text-2 h-[22px] tt-main-bg ml-1 rounded-md text-xs px-1 flex items-center justify-center"
          >
            {{ item.version }}
          </div>
        </div>
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
        @click="entry"
      >
        <xt-ify-icon icon="fluent:open-16-regular" size="16" class="mr-1" />
        <span class="text-sm">进入 </span>
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
