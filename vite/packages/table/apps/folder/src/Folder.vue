<template>
  <!-- <Widget>
    <File
      :list="customData.list"
      :layout="customData.layout"
      :model="customData.model"
      @deleteFile="deleteFile"
      @updateList="updateList"
      @updateSort="updateSort"
    />
  </Widget> -->
  <Drop
    @createFile="createFile"
    @deleteFile="deleteFile"
    @updateBg="updateBg"
    ref="folder"
  >
    <xt-container
      :options="options"
      :customIndex="customIndex"
      :customData="customData"
      :defaultData="defaultFolderData"
      :header="header"
      :menuList="menuList"
      :sizeList="autoSizeList"
      @leftClick="leftClick"
      v-model:size="customData.size"
    >
      <!-- 右侧布局切换 -->
      <Resize
        :disabled="expand.disabled"
        v-model:size="customData.size"
        :resize="navBar.resize"
      >
        <!-- 空状态显示状态 -->
        <template v-if="customData.list.length <= 0 && !dragSortState">
          <Null :size="customData.size" @addFile="addFileClick" />
        </template>
        <vue-custom-scrollbar
          v-else
          :settings="{
            suppressScrollY: false,
          }"
          class="relative w-full h-full"
        >
          <File
            :list="customData.list"
            :layout="customData.layout"
            :model="customData.model"
            @deleteFile="deleteFile"
            @updateFile="updateFile"
            @updateList="updateList"
            @updateSort="updateSort"
            @clickFile="clickFile"
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
  />
  <EditNewNavigation
    v-if="editVisible"
    @setQuick="editVisible = false"
    @addIcon="addFile"
    :isFolder="false"
  />

  <xt-modal custom v-model="expandVisible" boxClass="" @close="expandClose">
    <Expand :data="props" :auto="false"></Expand>
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
// import Widget from "../../../components/card/Widget.vue";

import EditNewNavigation from "../../../components/desk/navigationBar/EditNewNavigation.vue";
import { useNavigationStore } from "../../../components/desk/navigationBar/navigationStore";
import { useMouseInElement } from "@vueuse/core";

/**
 * 拖拽位置
 */
const folder = ref(null);
const { isOutside } = useMouseInElement(folder);
const updatePosition = (data) => {
  if (isOutside.value) {
    customData.value.list.splice(customData.value.list.indexOf(data), 1);
  }
};

/**
 * 文件添加
 */
const editVisible = ref(false);
const navigationStore = useNavigationStore();
const addFileClick = () => {
  if (customData.value.model != "custom") {
    message.info("桌面文件下无法无法添加");
    return;
  }
  navigationStore.selectNav = "desktop";
  editVisible.value = true;
};
const addFile = (data) => {
  const { name, icon, type, value } = data;
  let fileInfo = {
    ...defaultData,
    id: nanoid(6),
    name,
    icon,
    type,
    value,
  };
  createFile(fileInfo);
};
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
  navBar: {
    type: Object,
    default: () => ({
      // 右下角图标显示
      resize: true,
      // 设置中尺寸大小选择
      sizeOption: true,
      // 设置背景颜色
      bg: true,
      // 隐藏删除小组件选项
      isDel: false,
      // 隐藏层级选择
      hierarchy: false,
    }),
  },
  // 自动设置大小
  auto: {
    default: false,
  },
});

const { customData, customIndex, expand, secondary, navBar, auto } =
  toRefs(props);
const emit = defineEmits(["update:size", "update:layout", "clickFile"]);

const refreshState = ref(false);
const header = computed(() => {
  return {
    showIcon: customData.value.icon,
    title: customData.value.name,
    refresh: {
      tip: "更新桌面数据",
      disabled: customData.value.model != "custom" ? false : true,
      state: refreshState.value,
      fn: refreshDeskApp,
    },
    leftHover: true,
    leftHoverName: secondary.value ? "编辑文件夹" : "点击打开",
    leftHoverIcon: secondary.value
      ? "fluent:settings-16-regular"
      : "fluent:open-16-regular",
    rightIcon: [
      {
        ifyIcon: "fluent:add-16-filled",
        fn: addFileClick,
      },
      {
        ifyIcon: layout.value,
        fn: layoutClick,
      },
    ],
  };
});

const options = computed(() => {
  return {
    bg: isDrag.value ? "var(--active-secondary-bg) " : "",
    // 隐藏删除
    del: navBar.value.isDel ,
    // 隐藏层级
    hierarchy: navBar.value.hierarchy
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
provide("isOutside", isOutside);

/**
 * 通过文件夹中数据的多少来自定义大小
 */
const autoSizeList = computed(() => {
  if (auto.value) {
    const size = {
      name: '自动',
      value: autoSize.value,
    };
    return [...sizeList.value, size];
  }
  return sizeList.value;
});
/**
 * 自动尺寸
 */
const autoSize = computed(() => {
  const length = customData.value.list.length;
  if (length <= 6) {
    return "2x2";
  } else if (length <= 12 && length > 6) {
    return "3x3";
  } else if (length <= 18 && length > 12) {
    return "4x4";
  } else {
    return "6x4";
  }
});

/**
 *点击组件关闭
 */
const clickFile = (data) => {
  emit("clickFile", data);
};
/**
 * 自定义大小
 */
watch(
  () => customData.value.size,
  (newV, oldV) => {
    console.log(newV, oldV, "newV,oldV");
    emit("update:size", newV);
  },
  { deep: true }
);

/**
 * 自定义布局
 */
watch(
  () => customData.value.layout,
  (newV, oldV) => {
    console.log(newV, oldV, "newV,oldV");
    emit("update:layout", newV);
  }
);
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
  const index = customData.value.list.findIndex(
    (item) => item && item.id === data.id
  );
  console.log('updateFile :>> ', 22233);

  customData.value.list[index] = data;
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
  } else {
    customData.value.lock = false;
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
  // customData.value.lock = false;
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
  setTimeout(() => {}, 1000);
};

const isDrag = ref(false);
const updateBg = (val) => {
  isDrag.value = val;
};

onBeforeMount(() => {});

/**
 * 刷新桌面数据
 */
const refreshDeskApp = async () => {
  if (customData.value.model == "custom") return;

  refreshState.value = true;
  const desktopApps = await ipc.sendSync("getDeskApps");
  let desktopAppsList = [];

  desktopApps.forEach((item) => {
    const file = {
      ...defaultData,
      name: item.name,
      value: item.path,
      icon: item.icon,
      type: "tableApp",
      id: nanoid(6),
    };
    desktopAppsList.push(file);
  });
  customData.value.list = customData.value.list.filter((item) =>
    desktopAppsList.find((file) => item.name == file.name)
  );
  let newList = [];
  desktopAppsList.forEach((item) => {
    let data = customData.value.list.find((file) => item.name == file.name);

    if (typeof data == "undefined") {
      customData.value.list.push(item);
    }
  });
  setTimeout(() => {
    refreshState.value = false;
  }, 1000);
};
onMounted(async () => {
  if (customData.value.icon === "") {
    customData.value.icon =
      "https://a.apps.vip/icons/iconSelect/icon/folder.svg?color=#ffffff";
  }
  if (customData.value.model != "custom") {
  }
});
</script>

<style lang="scss" scoped>
:deep(.left-title) {
  margin-left: 0px !important;
}
</style>
