<template>
  <Drop
    @createFile="createFile"
    @deleteFile="deleteFile"
    @updateBg="updateBg"
    ref="folder"
    class="tt-folder-container"
    :stopDrop="folderMember"
  >
    <xt-container
      v-model:status="status"
      :desk="desk"
      :modalSize="folderMember ? [] : modalSize"
      :options="options"
      :customIndex="customIndex"
      :customData="customData"
      :header="header"
      :menuList="menuList"
      :sizeList="folderMember ? [] : autoSizeList"
      @leftClick="leftClick"
      v-model:customSize="customData.customSize"
      @delete="deleteFn"
      class="tt-folder-container"
    >
      <!-- 头部自定义下拉菜单(仅支持左和右)-->
      <template #customRightMenu>
        <slot name="customRightMenu"></slot>
      </template>

      <!-- 空状态显示状态 -->
      <template v-if="customData?.list.length <= 0 && !dragSortState">
        <Null
          :size="customData.customSize"
          @addFile="addFileClick"
          :memberVisible="folderMember"
          v-if="!navBar.isOut"
        />
        <slot name="navEmpty"></slot>
      </template>

      <!-- 非空状态 -->
      <vue-custom-scrollbar
        v-else
        style="padding-right: 4px"
        :settings="{
          useBothWheelAxes: true,
          suppressScrollY: false,
        }"
        class="relative w-full h-full"
      >
        <File
          :list="customData.list"
          :layout="customData.layout"
          :model="customData.model"
          :modalSize="folderMember ? [] :  modalSize"
          @deleteFile="deleteFile"
          @updateFile="updateFile"
          @updateList="updateList"
          @updateSort="updateSort"
          @clickFile="clickFile"
        />
      </vue-custom-scrollbar>

    </xt-container>
  </Drop>
  <FolderSet
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
    :isFolder="true"
  />

  <Expand
    :data="expandList"
    :auto="false"
    v-if="expandVisible"
    @close="expandClose"
  ></Expand>

  <ModelCard
    v-if="modelVisible"
    :cardData="cardData"
    v-model:model-visible="modelVisible"
    @delete="deleteFile"
  />
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
  onUnmounted,
  onBeforeMount,
  getCurrentInstance,
  defineAsyncComponent,
} from "vue";
import { useRouter, useRoute } from "vue-router";
import { nanoid } from "nanoid";
import { message } from "ant-design-vue";

import File from "./file/File.vue";
import Drop from "./components/Drop.vue";

import vueCustomScrollbar from "../../../../../src/components/vue-scrollbar.vue";

import { defaultData, defaultFolderData } from "./components/options";
import { startApp } from "../../../ui/hooks/useStartApp";
import { useNavigationStore } from "../../../components/desk/navigationBar/navigationStore";
import { useMouseInElement } from "@vueuse/core";
import { mergeData } from "../../../ui/hooks/useDataConversion";
import {expandData} from './hooks/expandCom'

import { useFolderStore } from "./store";
import { storeToRefs } from "pinia";

const Null = defineAsyncComponent(() => import("./components/Null.vue"));
const Expand = defineAsyncComponent(() => import("./expand/Expand.vue"));
const FolderSet = defineAsyncComponent(() =>
  import("./folderSet/folderSet.vue")
);
const EditNewNavigation = defineAsyncComponent(() =>
  import("../../../components/desk/addIcon/EditNewNavigation.vue")
);
const ModelCard = defineAsyncComponent(() =>
  import("../../../components/windowPanel/components/ModelCard.vue")
);

import { communityMember } from "../../communityDesk/hooks/deskCreateMethod";

const { proxy } = getCurrentInstance();
const router = useRouter();

const folderStore = useFolderStore();
const { focusClose } = storeToRefs(folderStore)

/**
 * 拖拽位置
 */
const folder = ref(null);
const { isOutside } = useMouseInElement(folder);

const resize = computed(() => {
  if (!navBar.value.resize || secondary.value) {
    return false;
  }
  return true;
});
const status = ref();
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
const deleteFn = (fn) => {
  console.log("fn :>> ", fn);
  fn();
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
  desk:{},
  customIndex: {},
  expand: {
    default: () => {
      return {
        disabled: false,
      };
    },
  },
  secondary: {},
  // 导航栏特定设置
  navBar: {
    type: Object,
    default: () => ({
      // 右下角自定义大小图标显示
      resize: true,
      // 设置中尺寸大小选择
      sizeOption: true,
      // 设置背景颜色
      bg: true,
      // 隐藏删除小组件选项
      isDel: false,
      // 隐藏当桌面为自由桌面时，上置下置层级选择
      hierarchy: false,
      // 点击文件夹外部关闭
      close: Boolean,
      // 是否开启外部右键菜单
      isOut: false,
      // 禁用头部
      disableHeader: false,
    }),
  },
  // 自动设置大小
  auto: {
    default: false,
  },
  modalSize: {},
});

const { customData, customIndex, expand, secondary, navBar, auto, modalSize } =
  toRefs(props);
const emit = defineEmits([
  "update:size",
  "update:layout",
  "clickFile",
  "close",
]);

const refreshState = ref(false);

// 区分当前桌面是社群还是个人
const folderMember = computed(()=>{
  // console.log('成员桌面',communityMember(props.desk?.communityNo))
  return communityMember(props.desk?.communityNo);
})

const header = computed(() => {

  if(folderMember.value){
    return {
      showIcon: customData.value.icon,
      title: customData.value.name,
    }
  }

  else if (!navBar.value.isOut) {
    return {
    // disabled: navBar.value.disableHeader,
      showIcon: customData.value.icon,
      title: customData.value.name,
      // refresh: {
      //   tip: "更新桌面数据",
      //   disabled: customData.value.model != "custom" ? false : true,
      //   state: refreshState.value,
      //   fn: refreshDeskApp,
      // },
      leftHover: !navBar.value.disableHeader,  // 当为社区图标时，隐藏hover功能
      leftHoverName: secondary.value ? "编辑文件夹" : "点击打开",
      leftHoverIcon: secondary.value
        ? "fluent:settings-16-regular"
        : "fluent:open-16-regular",
      //
      rightIcon: rightIcons.value,
    };
  } else {
    return customData.value.header;
  }
});

// 处理社区中心图标隐藏部分功能，社区中心图标不显示右侧图标
const rightIcons = computed(() => {
  if(navBar.value.disableHeader){
    return []
  } else {
    return [
        {
          ifyIcon: "fluent:open-16-regular",
          tip: "打开全部",
          fn: openAllFile,
        },
        {
          ifyIcon: "fluent:add-16-filled",
          fn: addFileClick,
        },
        {
          ifyIcon: layout.value,
          fn: layoutClick,
        },
      ]
    }
})
// 打开所有文件
const openAllFile = () => {
  if (customData.value.list.length > 10) {
    console.log("10 :>> ", 10);
    window.$ui.confirm(
      "确定要打开全部吗",
      `即将打开 ${customData.value.list.length} 个图标`,
      {
        type: "warning",
        ok: openAllFileClick,
      }
    );
  } else {
    openAllFileClick();
  }
};
const openAllFileClick = () => {
  customData.value.list.forEach((item) => {
    startApp(item.type, item.value, router);
  });
};
const options = computed(() => {
  return {
    defaultData: defaultFolderData,
    bg: isDrag.value ? "var(--active-secondary-bg) " : "",
    // 当位于导航栏时，隐藏删除选项
    disabledDelete: navBar.value.isDel,
    // 当位于导航栏时，且桌面为自由桌面时，隐藏上置下置层级
    hierarchy: navBar.value.hierarchy,
    // 二级
    secondary: {
      customSize: "",
    },
    resize: folderMember.value ? false : resize.value,
    modalSize: modalSize.value,
    customDel: folderMember.value ? false : true,
    rightMenuVisible: navBar.value.customRight,
    // 隐藏菜单中添加到导航栏的选项
    disabledNav: true,
    disableEdit:folderMember.value ? true : false,
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
      name: "自动",
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

const expandList = ref(props)

/**
 * 卡片类图标的相关数据
 */
// 模态框是否可见
const modelVisible = ref(false)
// 当前卡片的详细数据
const cardData = ref({})

/**
 *点击组件关闭
 */
const clickFile = (data) => {
  // 当为社区中心时
  if(data.value === 'commun'){
    expandVisible.value = true
    // 文件夹参数
    expandList.value = expandData()
    // 保留原来的大小
    oldCardSize.value = customData.value.customSize
    return
  } else if (data.type === 'card'){
    // 打开卡片
    modelVisible.value = true
    cardData.value = data
    return
  }
  startApp(data.type, data.value, router);
  emit("clickFile", data);
};
/**
 * 自定义大小
 */
watch(
  () => customData.value.customSize,
  (newV, oldV) => {
    console.log(newV, oldV, "newV,oldV");
    emit("update:customSize", newV);
  },
  { deep : true }
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
  // console.log(folderMember.value);
  if(folderMember.value){
    return [
      {
        title: "一键打开全部",
        newIcon: "fluent:open-16-regular",
        fn: openAllFile,
      },
      {
        newIcon: layout.value,
        title: "排列方式",
        fn: layoutClick,
      },
    ]
  }

  else if (!navBar.value.isOut) {
    return [
      {
        title: "一键打开全部",
        newIcon: "fluent:open-16-regular",
        fn: openAllFile,
      },
      {
        newIcon: layout.value,
        title: "排列方式",
        fn: layoutClick,
      },
      {
        newIcon: "fluent:add-16-filled",
        title: "添加图标",
        fn: addFileClick,
      },
      {
        title: "更新桌面数据",
        disabled: customData.value.model != "custom" ? false : true,
        newIcon: "fluent:arrow-clockwise-16-regular",
        fn: refreshDeskApp,
      },
      { divider: true },
      {
        title: "设置",
        newIcon: "fluent:settings-16-regular",
        fn: () => {
          setVisible.value = true;
        },
      },
    ];
  } else {
    return customData.value.menuList;
  }
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
  focusClose.value = true
  if(!navBar.value.isOut){
    customData.value.list.push(data);
  }
  else{
    emit('createNav',data);
    editVisible.value = false;
  }
};
// 删
const deleteFile = (data) => {
  console.log(data,'<<<<<<<<<<')
  if (!navBar.value.isOut) {
    customData.value.list.splice(customData.value.list.indexOf(data), 1);
    focusClose.value = false
  } else {
    emit("deleteNavApp", data);
  }
};
// 改
const updateFile = (data) => {
  const index = customData.value.list.findIndex(
    (item) => item && item.id === data.id
  );
  console.log("updateFile :>> ", 22233);

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
 * 更新拖拽后的排序
 */
const dragSortState = ref(false);
const updateList = (data) => {
  dragSortState.value = true;
  customData.value.list = [];

  setTimeout(() => {
    customData.value.list = data;
    dragSortState.value = false;
    focusClose.value = false   // 编辑完后，恢复失焦自动关闭
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
    oldCardSize.value = customData.value.customSize;
  }
};

const expandClose = () => {
  expandVisible.value = false;
  customData.value.customSize = oldCardSize.value;
};

const isDrag = ref(false);
const updateBg = (val) => {
  isDrag.value = val;
};

/**
 * 刷新桌面数据
 */
const refreshDeskApp = async () => {
  if (customData.value.model === "custom") return;

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
    message.success('更新成功')
  }, 1000);
};
function handleClick(e) {
  if (e.target?.closest(".tt-folder-container") == null) {
    // 当二级菜单打开时，失焦了也无法关闭文件夹
    if(focusClose.value){
      return
    }
    emit("close");
  }
}

// 打开分组设置
const openSetVisible = () =>{
  setVisible.value = true;
}

onUnmounted(() => {
  window.removeEventListener("click", handleClick);
});
onMounted(async () => {
  if (navBar.value.close) {
    window.addEventListener("click", handleClick);
  }

  customData.value.list = customData.value.list.map((item) => mergeData(item));
  // 空图标替换
  if (customData.value.icon === "") {
    customData.value.icon =
      "https://a.apps.vip/icons/iconSelect/icon/folder.svg?color=#ffffff";
  }
  // 旧版大小数据替换
  if (customData.value.customSize == "") {
    customData.value.customSize = customData.value.size;
  }
  // 冒泡排序

  // 监听文件夹当打开编辑时，阻止失焦自动关闭
  watch(() => editVisible.value, (val) => {
    if(val){
      focusClose.value = true
      return
    }
    focusClose.value = false
  })

  // 监听文件夹当打开设置时，阻止失焦自动关闭
  watch(() => setVisible.value, (val) => {
    if(val){
      focusClose.value = true
      return
    }
    focusClose.value = false
  })

  // 监听文件夹当打开展开时，阻止失焦自动关闭
  watch(() => expandVisible.value, (val) => {
    if(val){
      focusClose.value = true
      return
    }
    focusClose.value = false
  })

  // 开启导航添加
  proxy.$bus.on("openEditNav",()=>{
    addFileClick();
  });
  proxy.$bus.on("closeNav",()=>{
    editVisible.value = false;
  })
});


defineExpose({
  openSetVisible,
  editVisible,
})
</script>

<style lang="scss" scoped>
:deep(.left-title) {
  margin-left: 0px !important;
}
</style>
