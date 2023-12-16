<template>
  <Drop @updateFile="updateFile" @deleteFile="deleteFile">
    <Widget
      :customIndex="customIndex"
      :customData="customData"
      :options="options"
      :menuList="menuList"
    >
      <!-- 左侧图标 -->
      <template #left-title-icon>
        <div @click="iconClick">icon</div>
      </template>
      <!-- 左侧标题 -->
      <template #title-text>
        {{ customData.title }}
      </template>
      <!-- 右侧布局切换 -->
      <template #right-menu>
        <xt-new-icon :icon="layout" size="20" @click="layoutClick" />
      </template>
      <!-- <Resize> -->
      <!-- 空状态 -->
      <div
        v-if="Object.keys(customData.list).length <= 0 || 0"
        class="flex flex-col items-center mt-3 tt"
      >
        <xt-new-icon
          v-if="options.className !== 'card small'"
          icon="fluent-emoji:inbox-tray"
          w="56"
          class="mb-3"
        />
        <div class="xt-bg-t-2 rounded-xl text-sm mb-2 p-2">
          你可以拖动工作台桌面图标或windows程序或文件图标到此处；或者进入分组设置选择自动整理模式，为你自动整理桌面图标。
        </div>
        <xt-button type="theme" w="84" h="32" radius="8">添加图标</xt-button>
      </div>
      <vue-custom-scrollbar
        v-else
        :settings="{
          swipeEasing: true,
          suppressScrollY: false,
          suppressScrollX: true,
          wheelPropagation: false,
        }"
        class="w-full relative h-full"
      >
        <File
          :list="customData.list"
          :layout="customData.layout"
          :model="customData.model"
          @deleteFile="deleteFile"
          @updateSort="updateSort"
        />
      </vue-custom-scrollbar>
      <!-- </Resize> -->

      <!-- <xt-selectIcon
      :menus="['icon']"
      v-model="iconEditVisible"
      @getAvatar="getAvatar"
      isUpload="true"
    /> -->
      <!-- <xt-option-from :options="sss" /> -->
      <!-- <xt-option-color v-bind="aa" /> -->
    </Widget>
  </Drop>

  <folderSet
    v-if="setVisible"
    :data="customData"
    @close="setVisible = false"
    @updateSort="updateSort"
    @updateModel="updateModel"
    @updateWindowApp="updateWindowApp"
  >
  </folderSet>
</template>

<script setup>
import { ref, watch, computed, toRefs, provide, onMounted } from "vue";
import Widget from "../../../components/card/Widget.vue";
import File from "./file/File.vue";
import folderSet from "./folderSet/folderSet.vue";
import Drop from "./components/Drop.vue";
import Resize from "./components/Resize.vue";
import vueCustomScrollbar from "../../../../../src/components/vue-scrollbar.vue";
import { nanoid } from "nanoid";

import { defaultData } from "./components/options";
/**
 * 初始化阶段
 */
const props = defineProps({
  customData: {},
  customIndex: {},
});
const { customData, customIndex } = toRefs(props);

provide("index", customIndex);
provide("model", customData.value.model);
provide("data", customData);

/**
 * 挂载阶段
 */

onMounted(() => {
  //
  if (customData.value.model === "") return;
});

const customDataValue = computed(() => {
  return customData.value;
});
// 卡片默认配置
const options = computed(() => {
  return {
    className: "card small",
    // className: "card double",
    title: "文件夹",
  };
});
/**
 * 菜单配置
 */
const setVisible = ref(false);
const menuList = computed(() => {
  return [
    {
      title: "分组设置",
      newIcon: "fluent:settings-16-regular",
      fn: () => {
        setVisible.value = true;
      },
    },
  ];
});
/**
 * 文件夹布局图标状态
 */
const layout = computed(() => {
  if (customData.value.layout === "rows") {
    return "fluent:grid-16-regular";
  } else if (customData.value.layout == "columns") {
    return "fluent:apps-list-detail-24-regular";
  }
});
/**
 * 文件夹布局切换
 */
const layoutClick = () => {
  customData.value.layout =
    customData.value.layout === "rows" ? "columns" : "rows";
};

/**
 * 图标编辑
 */
const getAvatar = (avatar) => {
  console.log("avatar :>> ", avatar);
  // this.modelValue=false
};

const iconEditVisible = ref(false);
const iconClick = () => {
  console.log("iconClick");
  iconEditVisible.value = true;
};

// 更新文件数据
const updateFile = (data) => {
  customData.value.list[data.id] = data;

  console.log(" customData.value.list :>> ", customData.value.list);
};
// 删除文件数据
const deleteFile = (data) => {
  // customData.value.list.splice(customData.value.list.indexOf(data), 1);
  delete customData.value.list[data.id];
};
/**
 * 文件排序
 */
// 排序
const sortMode = (key) => {
  // 将对象的属性转换为数组
  const itemsArray = Object.entries(customData.value.list).map(
    ([key, item]) => item
  );
  // 对数组进行排序
  console.log("key :>> ", key);
  itemsArray.sort((a, b) => b[key] - a[key]);
  let obj = {};
  itemsArray.forEach((item) => {
    obj[item.id] = item;
  });
  customData.value.list = obj;
};

// 触发排序
const updateSort = (val) => {
  const mode = customData.value.sort;
  sortMode(mode);
};

/**
 * 更新模式
 */
const updateModel = (data) => {
  customData.value.model = data;
};

/**
 * 更新窗口程序
 */
const updateWindowApp = async () => {
  const desktopApps = await ipc.sendSync("getDeskApps");

  desktopApps.forEach((item) => {
    const file = {
      ...defaultData,
      name: item.name,
      value: item.path,
      icon: item.icon,
      type: "tableApp",
      id: nanoid(),
    };
    customData.value.list[file.id] = file;
  });
};
</script>

<style lang="scss" scoped>
:deep(.left-title) {
  margin-left: 0px !important;
}
</style>
