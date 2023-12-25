<template>
  <Drop @createFile="createFile" @deleteFile="deleteFile">
    <Widget
      :customIndex="customIndex"
      :customData="customData"
      :options="options"
      :menuList="menuList"
      :size="reSize"
    >
      <!-- 左侧图标 -->
      <template #left-title-icon>
        <div @click="iconClick">icon</div>
      </template>
      <!-- 左侧标题 -->
      <template #title-text>
        {{ customData.name }}
      </template>
      <!-- 右侧布局切换 -->
      <template #right-menu>
        <xt-new-icon :icon="lockIcon" size="20" @click="lockClick" />
        <xt-new-icon :icon="layout" size="20" @click="layoutClick" />
      </template>
      <Resize @reSizeInit="reSizeInit" :cardSize="customData.cardSize">
        <!-- 空状态显示状态 -->
        <div
          v-if="customData.list.length <= 0 && !dragSortState"
          class="flex flex-col items-center mt-3 tt"
        >
          <xt-new-icon
            v-if="options.className !== 'card small'"
            icon="fluent-emoji:inbox-tray"
            w="56"
            class="mb-3"
          />
          <xt-new-icon
            v-if="options.className !== 'card small'"
            icon="fluent-emoji:inbox-tray"
            w="56"
            class="mb-3"
          />
          <div class="xt-bg-t-2 rounded-xl text-sm mb-3 p-2">
            你可以拖动工作台桌面图标或windows程序或文件图标到此处；或者进入分组设置选择自动整理模式，为你自动整理桌面图标。
          </div>
          <xt-button type="theme" w="84" h="32" radius="8">添加图标</xt-button>
        </div>

        <vue-custom-scrollbar
          v-else
          :settings="{
            suppressScrollY: false,
          }"
          class="w-full relative h-full"
        >
          <File
            :list="customData.list"
            :layout="customData.layout"
            :model="customData.model"
            @deleteFile="deleteFile"
            @updateList="updateList"
            @updateSort="updateSort"
          />
        </vue-custom-scrollbar>
      </Resize>
    </Widget>
  </Drop>

  <folderSet
    v-if="setVisible"
    :data="customData"
    @close="setVisible = false"
    @updateSort="updateSort"
    @updateWindowApp="updateWindowApp"
  >
  </folderSet>

  <xt-modal custom v-model="expandVisible" boxClass="">
    <Expand :props="props"></Expand>
  </xt-modal>
</template>

<script setup>
import {
  ref,
  watch,
  computed,
  toRefs,
  provide,
  onMounted,
  onBeforeUnmount,
  onBeforeMount,
} from "vue";
import Widget from "../../../components/card/Widget.vue";
import File from "./file/File.vue";
import folderSet from "./folderSet/folderSet.vue";
import Drop from "./components/Drop.vue";
import Resize from "./components/Resize.vue";
import Expand from "./expand/Expand.vue";
import vueCustomScrollbar from "../../../../../src/components/vue-scrollbar.vue";
import { nanoid } from "nanoid";
import { message } from "ant-design-vue";
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
provide("data", customData);

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
  if (customData.value.layout === "rows") return "fluent:grid-16-regular";
  else return "fluent:apps-list-detail-24-regular";
});
/**
 * 文件夹布局切换
 */
const layoutClick = () => {
  customData.value.layout =
    customData.value.layout === "rows" ? "columns" : "rows";
};
/**
 * 文件增删改
 */

// 增
const createFile = (data) => {
  console.log("1233 :>> ", data);
  customData.value.list.push(data);
};
// 删
const deleteFile = (data) => {
  console.log("data :>> ", data);
  customData.value.list.splice(customData.value.list.indexOf(data), 1);
};
// 改
const updateFile = (data) => {
  console.log("123 :>> ", 123);
  // customData.value.list.push(data);
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
  console.log("mode :>> ", mode);
  if (mode === "free") {
    console.log("3333 :>> ", 3333);
    customData.value.lock = true;
    return;
  }
  console.log("111 :>> ", 111);
  sortMode(mode);
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
/**
 * 锁配置
 */
const lockIcon = computed(() => {
  return customData.value.lock
    ? "fluent:lock-closed-16-regular"
    : "fluent:lock-open-28-regular";
});
const lockClick = () => {
  // 自由排序 or 桌面文件 下紧张默认锁住
  if (customData.value.sort === "free" || customData.value.model != "custom") {
    customData.value.lock = true;
    message.info("自由排序或桌面文件下无法解锁");

    return;
  }
  customData.value.lock = !customData.value.lock;
};

/**
 * 更新拖拽后的排序
 */
const dragSortState = ref(false);
const updateList = (data) => {
  dragSortState.value == true;
  customData.value.list = [];

  setTimeout(() => {
    customData.value.list = data;
    dragSortState.value = false;
  }, 10);
};

/**
 * 左侧图标放大功能
 */
const expandVisible = ref(false);
const iconClick = () => {
  expandVisible.value = true;
};

/**
 *
 */

const reSizeInit = (data) => {
  init(data)
};

const reSize = computed(() => {
  const width = customData.value.cardSize.width;
  const height = customData.value.cardSize.height;
  return {
    width: (width || 1) * width + (width - 1) * 10 + "px",
    height: (height || 2) * height + (height - 1) * 10 + "px",
  };
});

const init = () => {
  // 初始化卡片大小
  if (!customData.value.cardSize) {
    customData.value.cardSize = {
      name: "default",
      width: 1,
      height: 2,
    };
    return;
  }
  const size = customData.value.cardSize.name;
  if (size == "big") {
    customData.value.cardSize.width = 2;
    customData.value.cardSize.height = 2;
  } else if (size == "default") {
    customData.value.cardSize.width = 1;
    customData.value.cardSize.height = 2;
  } else if (size == "small") {
    // small
    customData.value.cardSize.width = 1;
    customData.value.cardSize.height = 1;
  } else {
    let str = size.split(",");
    customData.value.cardSize.width = Math.round(str[0] / 280);
    customData.value.cardSize.height = Math.round(str[1] / 205);
  }
};
onBeforeMount(() => {
  init();
  console.log("mounted :>> ", 11111);
});

onMounted(() => {});
</script>

<style lang="scss" scoped>
:deep(.left-title) {
  margin-left: 0px !important;
}
</style>
