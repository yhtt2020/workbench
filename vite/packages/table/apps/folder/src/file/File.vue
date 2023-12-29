<!-- 负责单个文件渲染 -->
<template>
  <div
    class="xt-sortable-fle-container"
    :class="[sortableContainer]"
    style="width: 100%"
  >
    <template v-for="(item, index) in list">
      <div
        v-show="fileDisabled(item)"
        class="xt-sortable-fle-box flex justify-center"
        :class="[sortableBox]"
        :data-id="item.id"
      >
        <xt-mix-menu
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
            <Files :item="item"></Files>
          </Drag>
        </xt-mix-menu>
      </div>
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
import Sortable from "sortablejs";
import {
  ref,
  onMounted,
  watch,
  computed,
  getCurrentInstance,
  toRefs,
} from "vue";
import { useRouter, useRoute } from "vue-router";
import Files from "./Files.vue";
import Drag from "../components/Drag.vue";
import FileSet from "../fileSet/FileSet.vue";
import { startApp } from "../../../../ui/hooks/useStartApp";
import { inject } from "vue";
import { fileTypes } from "./options";

const index = inject("index", "");
const data = inject("data", "");

const { proxy } = getCurrentInstance();

const router = useRouter();

const emits = defineEmits(["deleteFile", "updateSort", "updateList"]);
// 父组件数据
const props = defineProps({
  layout: {},
  list: {},
});
const { list, layout } = toRefs(props);
/**
 * 监听组件大小变化
 */
const currentWidth = computed(() => {
  let [width, height] = data.value.size.split("x");
  return width;
});
/**
 * 拖拽排序
 */
// 拖拽容器
const sortable = ref();
const sortableContainer = ref(
  "xt-sortable-fle-container-" + index.value + Math.ceil(Math.random() * 100)
);
const sortableBox = ref("xt-sortable-fle-box-" + index.value);
// 拖拽布局
const fileLayout = computed(() => {
  let rows = "33.3% 33.3% 33.3%";
  if (currentWidth.value == 4) {
    rows = "20% 20% 20%  20% 20%";
  } else if (currentWidth.value == 6) {
    rows = "12.5%  12.5% 12.5% 12.5% 12.5% 12.5% 12.5% 12.5%";
  }
  return layout.value === "rows" ? rows : "100%";
});
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
    onEnd: function (evt) {
      collisionDetection(evt.to.childNodes);
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
    // {
    //   name: "打开存储路径",
    //   newIcon: "fluent:folder-16-regular",
    //   fn: () => {},
    // },
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
    // {
    //   name: "编辑图标",
    //   newIcon: "fluent:compose-16-regular",
    //   fn: () => {
    //     currentTab.value = "appearance";
    //     fileSetVisible.value = true;
    //   },
    // },

    {
      name: "删除",
      newIcon: "fluent:delete-16-regular",
      disabled: ["observe", "arrange"].includes(data.value.model)
        ? true
        : false,
      color: "#FF4D4F",
      fn: () => {
        proxy.$xtConfirm("确定删除吗？", "", {
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
  startApp(data.type, data.value, router);
  emits("updateSort");
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
</script>

<style scoped>
.xt-sortable-fle-container {
  display: inline-grid;
  grid-template-columns: repeat(auto-fit, v-bind(fileLayout));
}
</style>
