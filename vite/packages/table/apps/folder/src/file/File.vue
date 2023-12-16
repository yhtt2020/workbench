<template>
  <div class="flex flex-wrap">
    <template v-for="item in list">
      <xt-mix-menu
        v-if="fileDisabled(item)"
        @mounted="handleMenuMounted(item)"
        :menus="menuList"
        :menuWidth="layout === 'rows' ? '' : 'w-full'"
      >
        <Drag
          class="cursor-pointer"
          @click="fileClick(item)"
          @deleteFile="dragDeleteFile"
          :data="item"
        >
          <Rows v-if="layout === 'rows'" :item="item" />
          <Columns v-else-if="layout === 'columns'" :item="item" />
        </Drag>
      </xt-mix-menu>
    </template>
  </div>

  <FileSet
    v-if="fileSetVisible"
    v-model="fileSetVisible"
    :tab="currentTab"
    :data="currentItem"
  />
</template>

<script setup>
import { ref, computed, getCurrentInstance, toRefs } from "vue";
import Columns from "./Columns.vue";
import Rows from "./Rows.vue";
import Drag from "../components/Drag.vue";
import FileSet from "../fileSet/FileSet.vue";
import { startApp } from "../hooks/useStartApp";
import { inject } from "vue";
import { fileTypes } from "./options";
const model = inject("model", "");
const data = inject("data", "");

const { proxy } = getCurrentInstance();
const emits = defineEmits(["deleteFile"]);
// 父组件数据
const props = defineProps({
  layout: {},
  list: {},
});
const { list } = toRefs(props);
// 菜单数据
const currentTab = ref("");
const fileSetVisible = ref(false);
const menuList = computed(() => {
  return [
    {
      name: "打开",
      newIcon: "fluent:open-16-regular",
      fn: () => {
        fileClick(currentItem.value);
      },
    },
    {
      name: "打开存储路径",
      newIcon: "fluent:folder-16-regular",
      fn: () => {},
    },
    {
      name: "复制",
      newIcon: "fluent:copy-16-regular",
      fn: () => {},
    },
    {
      name: "重命名",
      newIcon: "fluent:compose-16-regular",
      fn: () => {
        fileSetVisible.value = true;
        currentTab.value = "attribute";
      },
    },
    {
      name: "编辑图标",
      newIcon: "fluent:compose-16-regular",
      fn: () => {
        currentTab.value = "appearance";
        fileSetVisible.value = true;
      },
    },

    {
      name: "删除",
      newIcon: "fluent:delete-16-regular",
      disabled: ["observe", "arrange"].includes(model) ? true : false,
      color: "#FF4D4F",
      fn: () => {
        proxy.$xtConfirm("确定删除吗？", "", {
          ok: deleteFile,
        });
      },
    },
    { divider: true },
    {
      name: "系统菜单",
      newIcon: "fluent:settings-16-regular",
      fn: () => {},
    },
  ];
});

const deleteFile = () => {
  emits("deleteFile", currentItem.value);
};
const dragDeleteFile = (data) => {
  emits("deleteFile", data);
};
// 菜单展开回调
const currentItem = ref();
const handleMenuMounted = (item) => {
  currentItem.value = item;
};
// 文件点击
const fileClick = (data) => {
  data.useCount++;
  // 这里应该调用updateFile 但是点击直接生效了？？

  console.log("fileClick :>> ", data);
  startApp(data.type, data.value);

  // require("electron").shell.openPath(require("path").normalize(data.path));
};

/**
 * 判断文件类型是否需要隐藏
 */

// 获取可用类型
const typeRules = computed(() => {
  if (data.value.rules.length == 0) return true;
  let rules = [];
  data.value.rules.forEach((rule) => {
    rules.push(...fileTypes[rule]);
  });

  return rules;
});

// 获取文件后缀
const getExtension = (filePath) => {
  const match = filePath.match(/\.([^.]+)$/);
  return match ? match[1] : "null";
};
// 实现是否需要隐藏
const fileDisabled = (item) => {
  const extension = getExtension(item.value);

  if (typeRules.value == undefined) return 1;
  return typeRules.value.includes(extension);
};
</script>

<style lang="scss" scoped></style>
