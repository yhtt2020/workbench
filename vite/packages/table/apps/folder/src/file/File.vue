<!-- 负责单个文件功能渲染 -->
<template>
  <div
    class="xt-sortable-fle-container"
    :class="[sortableContainer]"
    style="width: 100%"
  >
    <template :key="item.id" v-for="(item, index) in list">
      <div
        v-show="fileDisabled(item)"
        class="flex justify-center xt-sortable-fle-box"
        @drag="dragStart($event)"
        @dragend="dragEnd(item)"
        :class="[sortableBox]"
        :data-id="item.id"
      >
        <xt-mix-menu
          @onBeforeCreate="handleMenuMounted(item)"
          :menus="menuList"
          :menuWidth="layout === 'rows' ? '' : 'w-full'"
        >
          <Drag
            class="cursor-pointer"
            @click="fileClick(item)"
            @deleteFile="dragDeleteFile"
            :data="item"
          >
            <Files :item="item" :layout="layout"></Files>
          </Drag>
        </xt-mix-menu>
      </div>
    </template>
  </div>

  <Set v-if="fileSetVisible" v-model="fileSetVisible" @save="save" />
</template>

<script setup>
import Sortable from "sortablejs";
import { storeToRefs } from "pinia";
import {
  ref,
  onMounted,
  watch,
  computed,
  getCurrentInstance,
  toRefs,
  defineAsyncComponent,
} from "vue";
import Files from "./Files.vue";
import Drag from "../components/Drag.vue";
import { inject } from "vue";
import { fileTypes } from "./options";
import { myIcons } from "../../../../store/myIcons";
import { useFolderStore } from "../store";
import {
  useFileConversionIcon,
  useIconConversionFile,
} from "../hooks/useDataConversion";
const Set = defineAsyncComponent(() =>
  import("../../../../components/widgets/myIcons/set/index.vue")
);
import { startApp } from "../../../../ui/hooks/useStartApp";

const index = inject("index", "");
const data = inject("data", "");

const iconStore = myIcons();
const { proxy } = getCurrentInstance();

const folderStore = useFolderStore();
const { focusClose } = storeToRefs(folderStore);

const emits = defineEmits([
  "deleteFile",
  "updateSort",
  "updateList",
  "updateFile",
]);
// 父组件数据
const props = defineProps({
  layout: {},
  list: {},
  modalSize: {},
});
const { list, layout, modalSize } = toRefs(props);
/**
 * 监听组件大小变化
 */
const currentWidth = computed(() => {
  let [width, height] = data.value.customSize.split("x");
  return width;
});
/**
 * 拖拽排序
 */
// 拖拽容器
const sortable = ref();
const sortableContainer = ref(
  "xt-sortable-fle-container-" +
    // modalSize.value +
    index.value +
    Math.ceil(Math.random() * 100)
);
const sortableBox = ref("xt-sortable-fle-box-" + index.value);
// 拖拽布局
const fileLayout = computed(() => {
  let rows = "33.3% 33.3% 33.3%";
  if (modalSize.value || currentWidth.value == 6) {
    rows = "14.1%  14.1% 14.1% 14.1% 14.1% 14.1% 14.1% ";
  } else if (currentWidth.value == 4) {
    rows = "20% 20% 20%  20% 20%";
  }
  return layout.value === "rows" ? rows : "100%";
});

const dragStart = (e) => {};
const dragEnd = (data) => {};

// 是否禁用拖拽
watch(
  () => data.value.sort,
  (newVal) => {
    if (newVal === "free") {
      sortable.value.options.disabled = false;
    } else {
      sortable.value.options.disabled = true;
    }
  }
);
// 挂载拖拽库
onMounted(() => {
  const grid = document.querySelector("." + sortableContainer.value);
  sortable.value = new Sortable(grid, {
    animation: 150,
    handle: "." + sortableBox.value,
    disabled: data.value.sort === "free" ? false : true,
    onEnd: function ({ oldIndex, newIndex }) {
      let sourceList = data.value.list;
      let movedItem = sourceList.splice(oldIndex, 1)[0]; // 从旧位置移除
      sourceList.splice(newIndex, 0, movedItem); // 插入到新位置
    },
  });
});

/**
 * 菜单功能
 */
const currentTab = ref("");
const currentItem = ref();
// 菜单展开回调
const handleMenuMounted = (item) => {
  console.log("222 :>> ", 222);
  currentItem.value = item;
};

// 菜单数据
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
      fn: () => {
        let realPath = currentItem.value.value;
        var fs = require("fs");
        var stat = fs.lstatSync(realPath);
        var isDir = stat.isDirectory();
        realPath = isDir ? realPath : require("path").dirname(realPath);
        window.$models.win32.openPath(require("path").normalize(realPath));
      },
      disabled:
        currentItem.value && currentItem.value.type == "tableApp"
          ? false
          : true,
    },
    // {
    //   name: "复制",
    //   newIcon: "fluent:copy-16-regular",
    //   fn: () => {},
    // },
    // {
    //   name: "重命名",
    //   newIcon: "fluent:compose-16-regular",
    //   fn: () => {
    //     fileSetVisible.value = true;
    //     currentTab.value = "attribute";
    //   },
    // },
    {
      name: "编辑",
      newIcon: "fluent:compose-16-regular",
      fn: () => {
        // currentTab.value = "appearance";
        let data = useFileConversionIcon(currentItem.value);
        iconStore.edit = data;
        fileSetVisible.value = true;
        focusClose.value = true;
      },
      disabled: ["observe", "arrange"].includes(data.value.model)
        ? true
        : false,
    },

    {
      name: "删除",
      newIcon: "fluent:delete-16-regular",
      disabled: ["observe", "arrange"].includes(data.value.model)
        ? true
        : false,
      color: "#FF4D4F",
      fn: () => {
        focusClose.value = true;
        window.$ui.confirm("确定删除吗？", "", {
          type: "warning",
          ok: deleteFile,
        });
      },
    },
    // { divider: true },
    // {
    //   name: "系统菜单",
    //   newIcon: "fluent:settings-16-regular",
    //   fn: () => {},
    // },
  ];
});

const collisionDetection = (nodes) => {
  // 循环新的排序ID
  let arr = [];
  for (let item of nodes) {
    if (
      !(item instanceof HTMLDivElement) ||
      item.getAttribute("data-id") == null
    ) {
      continue;
    }
    let id = item.getAttribute("data-id");
    if (list.value.length == 0) return;
    // 有报错
    // let data = list.value.find((obj) => obj.id == parseInt(id));
    let data = list.value.find((obj) => obj.id == id);
    arr.push({ ...data });
  }

  console.log("arr :>> ", arr);
  emits("updateList", arr);
};

const deleteFile = () => {
  emits("deleteFile", currentItem.value);
};

/**
 * 文件点击
 */
const fileClick = (data) => {
  // 更新使用次数
  data.useCount++;
  // 更新使用时间
  data.lastUseTime = new Date().getTime();
  // startApp(data.type, data.value, router);
  emits("updateSort");
  emits("clickFile", data);
};
const dragDeleteFile = (data) => {
  emits("deleteFile", data);
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
  // 如果没有规则，则默认显示
  if (typeof typeRules.value == "boolean") return true;

  const extension = getExtension(item.value);
  return typeRules.value.includes(extension);
};

// 保存数据
const save = (edit) => {
  console.log('文件处保存',edit)
  const data = useIconConversionFile(edit.value);
  data.useCount = currentItem.value.useCount;
  data.id = currentItem.value.id;
  data.type = iconStore.edit.type;
  data.open=iconStore.edit.open
  data.value = iconStore.edit.value;
  emits("updateFile", data);
};
</script>

<style scoped>
.xt-sortable-fle-container {
  display: inline-grid;
  grid-template-columns: repeat(auto-fit, v-bind(fileLayout));
}
</style>
