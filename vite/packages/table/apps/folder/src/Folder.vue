<template>
  <Drop @createFile="createFile" @deleteFile="deleteFile">
    <xt-container
      :customIndex="customIndex"
      :customData="customData"
      :defaultData="defaultFolderData"
      :header="header"
      :menuList="menuList"
      v-model:size="customData.size"
      :sizeList="sizeList"
      @leftClick="leftClick"
      @onRefresh="onRefresh"
    >
      <!-- 右侧布局切换 -->
      <Resize :disabled="expand.disabled" v-model:size="customData.size">
        <!-- 空状态显示状态 -->
        <template v-if="customData.list.length <= 0 && !dragSortState">
          <Null :size="customData.size" @createFile="createFile"></Null>
        </template>
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
    </xt-container>
  </Drop>

  <folderSet
    v-if="setVisible"
    :data="customData"
    @close="setVisible = false"
    @updateSort="updateSort"
    @updateWindowApp="updateWindowApp"
  >
  </folderSet>

  <xt-modal custom v-model="expandVisible" boxClass="" @close="expandClose">
    <Expand :data="props"></Expand>
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
import File from "./file/File.vue";
import folderSet from "./folderSet/folderSet.vue";
import Drop from "./components/Drop.vue";
import Resize from "./components/Resize.vue";
import Expand from "./expand/Expand.vue";
import vueCustomScrollbar from "../../../../../src/components/vue-scrollbar.vue";
import { nanoid } from "nanoid";
import { message } from "ant-design-vue";
import { defaultData, defaultFolderData } from "./components/options";
import Null from "./components/Null.vue";
/**
 * 初始化阶段
 */
const props = defineProps({
  customData: {},
  customIndex: {},
  expand: {
    default: () => {
      return {
        disabled: false,
      };
    },
  },
  secondary: {},
});
const { customData, customIndex, expand, secondary } = toRefs(props);

const refreshState = ref(false);
const header = computed(() => {
  return {
    newIcon: "fluent:folder-16-regular",
    title: customData.value.name,
    // add: true,
    // refresh: true,
    // refreshState: refreshState.value,
    leftHover: true,
    leftHoverName: secondary.value ? "编辑文件夹" : "点击打开",
    leftHoverIcon: secondary.value
      ? "fluent:settings-16-regular"
      : "fluent:open-16-regular",
    rightIcon: [
      {
        newIcon: lockIcon.value,
        fn: lockClick,
      },
      {
        newIcon: layout.value,
        fn: layoutClick,
      },
    ],
  };
});

const sizeList = ref([
  {
    name: "2x2",
    value: "2x2",
  },
  {
    name: "2x4",
    value: "2x4",
  },
  {
    name: "4x4",
    value: "4x4",
  },
  {
    name: "6x4",
    value: "6x4",
  },
]);

provide("index", customIndex);
provide("data", customData);

/**
 * 菜单配置
 */
const setVisible = ref(false);
const menuList = computed(() => {
  return [
    {
      title: "设置",
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
  customData.value.list.push(data);
};
// 删
const deleteFile = (data) => {
  customData.value.list.splice(customData.value.list.indexOf(data), 1);
};
// 改
const updateFile = (data) => {
  // customData.value.list.push(data);
};

/**
 * 文件排序
 */
// 排序
const sortMode = (key) => {
  // 对数组进行排序
  customData.value.list.sort((a, b) => b[key] - a[key]);
};

// 触发排序
const updateSort = (val) => {
  const mode = customData.value.sort;
  if (mode === "free") {
    customData.value.lock = true;
    return;
  }
  sortMode(mode);
};

/**
 * 更新窗口程序
 */
const updateWindowApp = async () => {
  const desktopApps = await ipc.sendSync("getDeskApps");
  customData.value.list = [];
  desktopApps.forEach((item) => {
    const file = {
      ...defaultData,
      name: item.name,
      value: item.path,
      icon: item.icon,
      type: "tableApp",
      id: nanoid(6),
    };
    customData.value.list.push(file);
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
  dragSortState.value = true;
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
const oldCardSize = ref();
const leftClick = () => {
  if (secondary.value) {
    setVisible.value = true;
  } else {
    expandVisible.value = true;
    oldCardSize.value = customData.value.size;
  }
};

const expandClose = () => {
  customData.value.size = oldCardSize.value;
};

const onRefresh = () => {
  refreshState.value = true;
  setTimeout(() => {
    refreshState.value = false;
  }, 1000);
};

onBeforeMount(() => {});

onMounted(() => {});
</script>

<style lang="scss" scoped>
:deep(.left-title) {
  margin-left: 0px !important;
}
</style>
