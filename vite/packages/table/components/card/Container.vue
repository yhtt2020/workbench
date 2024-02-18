<!-- 小组件控制器 -->
<!-- 使用前请先阅读控制器源码和使用场景 -->
<!-- 修改前请先组内同事商谈 -->
<!-- 使用场景参考
        简单使用：vite\packages\table\components\widgets\clock\index.vue
        复杂使用：vite\packages\table\apps\folder\src\Folder.vue
 -->
<template>
  <!-- 右键菜单 -->
  <RightMenu
    v-model:size="currentSize"
    :menus="menus"
    :customIndex="customIndex"
    :sizeList="sizeList"
    :disableHierarchy="options.hierarchy"
  >
    <!-- 小组件控制器开始 -->
    <div
      ref="container"
      v-if="!options?.custom"
      class="flex flex-col widget rounded-xl"
      :class="[edit ? 'editing' : '', options.shadow ? '' : 'shadow xt-shadow']"
      style=""
      :style="[
        getSize,
        {
          background: options.bg || 'var( --primary-bg)',
          color: options.color || 'var(--primary-text)',
        },
      ]"
    >
      <!-- 小组件头部开始 -->
      <div
        v-if="!header.disabled"
        @dragstart.stop="titleDragStart"
        draggable="true"
        class="flex items-center justify-between w-full"
        style="
          height: 46px;
          min-height: 46px;
          border-radius: 12px 12px 0 0;
          cursor: grab;
        "
        :style="{
          background: header.bg || '',
          color: header.color || '',
        }"
      >
        <!-- 头部左侧 -->
        <div class="flex items-center flex-1" style="height: 28px">
          <div
            class="flex items-center h-full"
            @click="leftClick"
            @mouseenter="leftMouseEnter"
            @mouseleave="leftMouseLeave"
            style=""
            :class="[
              leftHover ? 'header-open cursor-pointer' : 'header-default',
            ]"
          >
            <!-- 图标区域 -->
            <div
              class="flex items-center h-full"
              @click="leftIconClick"
              @mouseenter="iconMouseEnter"
              @mouseleave="iconMouseLeave"
            >
              <xt-ify-icon v-if="leftHover" :icon="header.leftHoverIcon" />
              <template v-else>
                <xt-icon
                  v-if="header.icon"
                  :icon="header.icon"
                  type=""
                  size="19"
                  w="20"
                />
                <xt-ify-icon
                  v-else-if="header.ifyIcon"
                  :icon="header.ifyIcon"
                />
                <xt-icon-show
                  v-else-if="header.showIcon"
                  boxW="20"
                  boxH="20"
                  w="18"
                  h="18"
                  :modelValue="header.showIcon"
                />
              </template>
            </div>
            <!-- 标题区域 -->
            <div
              class="flex items-center h-full px-2 ml-1"
              @click="titleClick"
              @mouseenter="titleMouseEnter"
              @mouseleave="titleMouseLeave"
              :class="{ 'header-title': titleHover }"
            >
              <slot name="title"> {{ title }} </slot>
            </div>
            <!-- 头部左侧扩展区域 -->
            <slot name="left-extend"></slot>
          </div>
        </div>
        <!-- 头部右侧 -->
        <div class="flex items-center header-right" style="padding-right: 14px">
          <!-- 右侧扩展区域 -->
          <slot name="right-extend"></slot>
          <template
            v-if="rightIcons && rightIcons.length"
            v-for="item in rightIcons"
          >
            <div v-if="!item.disabled" class="header-right-icon mr-1">
              <!-- 右侧图标悬浮提示 -->
              <div
                v-if="item.tip"
                class="absolute px-2 py-1 rounded-lg xt-modal header-right-icon-tip"
                style="top:-30px;left:50%,transform:translateX(-50%);z-index: 99999999;"
              >
                {{ item.tip }}
                <div class="triangle-bottom"></div>
              </div>
              <xt-ify-icon
                v-if="item.ifyIcon"
                :icon="item.ifyIcon"
                @click="item.fn"
                :class="item.class"
                size="20"
              />
              <xt-icon
                v-else-if="item.icon"
                :icon="item.icon"
                @click="item.fn"
                type=""
                size="19"
                w="20"
              />
            </div>
          </template>
          <RightMenu
            :menus="menus"
            :customIndex="customIndex"
            model="all"
            v-model:size="currentSize"
            :disableHierarchy="options.hierarchy"
            :sizeList="sizeList"
          >
            <div class="header-right-icon">
              <xt-ify-icon
                icon="fluent:line-horizontal-3-20-filled"
                size="20"
              />
            </div>
          </RightMenu>
        </div>
      </div>
      <!-- 小组件头部结束 -->
      <!-- 小组件主体开始 -->
      <xt-status
        v-if="useEnv(envLimit)"
        :name="header.title"
        :status="limitEnv"
        imgSize="75"
      />
      <div
        v-else
        class="flex-1 h-full rounded-b-lg"
        :style="[
          {
            background: body.bg,
            color: body.color,
            padding: body.scroll ? '0 14px' : '0 14px 14px 14px',
          },
        ]"
      >
        <Resize
          v-model:size="currentSize"
          :modalSize="options.modalSize"
          :resize="options.resize"
          @resize="resize"
        >
          <slot></slot>
        </Resize>
      </div>
      <!-- 小组件主体结束 -->
    </div>
    <div v-else :class="[edit ? 'editing' : '']">
      <slot>
        <!--  主体内容插槽2  -->
      </slot>
    </div>
    <!-- 小组件控制器结束 -->
  </RightMenu>
</template>
<script setup>
import _ from "lodash-es";
import { useToast } from "vue-toastification";
import {
  watch,
  computed,
  ref,
  onBeforeMount,
  onMounted,
  getCurrentInstance,
  toRefs,
} from "vue";
import { storeToRefs } from "pinia";
import { cardStore as useCardStore } from "../../store/card";
import { useWidgetStore } from "./store";
import { useFreeLayoutStore } from "../desk/freeLayout/store";
import { useMouseInElement } from "@vueuse/core";

import vueCustomScrollbar from "../../../../src/components/vue-scrollbar.vue";
import Resize from "./Resize.vue";
import RightMenu from "./RightMenu.vue";
import { useEnv } from "../../ui/hooks/useEnv";

const container = ref(0);
const { isOutside } = useMouseInElement(container);

const { proxy } = getCurrentInstance();
// const selected = ref(null);
const status = computed(() => {
  return {
    outside: isOutside.value,
    // selected: selected.value,
  };
});
onMounted(() => {
  // onClickOutside(container, (event) => {
  //   console.log("event :>> ", event);
  //   console.log("selected.value :>> ", selected.value);
  //   if (selected.value == 0) {
  //     selected.value = true;
  //   } else {
  //     selected.value = false;
  //   }
  // });
});
/**
 * pinia
 */
// 卡片数据
const cardStore = useCardStore();
//
const widgetStore = useWidgetStore();
const { edit } = storeToRefs(widgetStore);
// 自由布局
// const freeLayoutStore = useFreeLayoutStore();
// props
/**
 * 均为重构后新的数据结构 和旧版有差异 需要阅读源码
 * 所有参数默认值请都设置为false 请勿随意修改默认值
 * 新增参数请先商谈
 */
const props = defineProps({
  // ----------下面都属于必填选参数----------
  /**
   * 小组件索引
   */
  customIndex: {
    type: Number,
    default: 0,
  },
  /**
   * 小组件数据
   */
  customData: {
    type: Object,
    default: () => {},
  },
  /**
   * 小组件所属桌面
   */
  desk: {
    type: Object,
    required: true,
  },
  /**
   * 小组件大小 默认 2x2
   */
  customSize: {
    type: String,
    default: "2x2",
  },
  // ----------下面都属于可选参数----------
  /**
   * 控制全部小组件区域
   */
  options: {
    type: Object,
    default: () => {
      return {
        // 自定义区域 开启后只保留全局右键功能
        custom: false,
        // 自定义全局背景色
        bg: "",
        // 自定义全局字体颜色
        color: "",
        // 是否允许删除组件
        disabledDelete: false,
        // 开启后，可拖拽小组件
        resize: false,
        // 作为弹窗时的尺寸
        modalSize: "",
        // 阴影开关 开启会关闭阴影
        shadow: false,
        // 卡片默认数据 传递后每次都会帮你校验数据，不存在的key会进行赋值
        defaultData: {},
        // 自定义删除打开后默认删除事件不执行，再删除回调上提供原删除事件
        customDel: false,
        // 开启后所有事件相关提示信息会进行输出
        debug: false,
      };
    },
  },
  // 控制小组件头部区域
  header: {
    type: Object,
    default: () => {
      return {
        // 禁用头部区域
        disabled: false,
        // 左侧图标 适配旧版icon 适配新版newIcon
        icon: "",
        ifyIcon: "",
        /**
         * 右侧图标
         * {
         *    icon: '旧版图标',
         *    ifyIcon: '新版图标',
         *    showIcon: '图标选择器的图标 小庄定义的命名规范'
         *    fn: 点击回调,
         *    tip：'提示文字',
         *    disabled: 禁用 true为禁用 false为不禁用
         * }
         */
        rightIcon: [],
        /**
         * 右侧刷新图标
         * {
         *    fn: lockClick,
         *    tip：'提示文字',
         *    disabled: 禁用 true为禁用 false为不禁用
         * }
         */
        refresh: false,
        // 标题背景色 true为打开 false为关闭
        bg: false,
        // 标题颜色
        color: "",
        // 鼠标经过显示 整个左侧可操作区域 左侧图标 + 标题区域  true为打开 false为关闭
        leftHover: false,
        // 鼠标经过显示 左侧图标 true为打开 false为关闭
        iconHover: false,
        // leftHover iconHover同用 leftHoverName leftHoverIcon 两个参数
        leftHoverName: "",
        leftHoverIcon: "",
        // 鼠标经过显示 标题区域  true为打开 false为关闭
        titleHover: false,
        titleHoverName: "",
      };
    },
  },
  // 控制小组件主体区域
  body: {
    default: () => {
      return {
        // 是否开启滚动条边距
        scroll: false,
        // 自定义背景色
        bg: "",
        // 自定义字体颜色
        color: "",
      };
    },
  },
  /**
   * 小组件菜单列表
   * {
   *    icon: '旧版图标',
   *    newIcon: '新版图标',
   *    fn: 点击回调,
   *    disabled: 禁用 true为禁用 false为不禁用
   * }
   */
  menuList: {
    type: Array,
    default: () => [],
  },
  /**
   * 小组件大小列表
   * 参考格式 [{ name: '4x2'value: '4x2' }]
   */
  sizeList: {
    type: Array,
    default: () => [],
  },
  /**
   * 小组件不可用环境
   * 参数可选 ["web", "offline", "guest", "mac", "client"]
   */
  envLimit: { type: Array, default: () => [] },
  /**
   * 返回小组件控制器所有信息
   * outside 鼠标是否悬浮与小组件
   */
  status: {},
});
const { header } = toRefs(props);
onBeforeMount(async () => {
  // 处理默认数据
  if (props.options.defaultData) {

    props.options.defaultData = await _.merge(
      {},
      props.options.defaultData,
      props.customData
    );
  }
});

// emits 小组件事件回调
/**
 * update:customSize 双向数据绑定customSize
 * update:status 双向数据绑定status
 *
 * leftClick 头部左侧鼠标经过点击回调
 * leftIconHover 头部左侧图标经过点击回调
 * titleHover 头部标题经过点击回调
 *
 * delete 小组件删除回调
 * resize 更新卡片大小回调
 */
const emits = defineEmits([
  "update:customSize",
  "leftClick",
  "delete",
  "resize",
  "update:data",
  "update:status",
  "leftIconHover",
  "titleHover",
]);

/**
 * data
 */
// 左侧区域状态
const showLeftHover = ref(false);
// 左侧图标区域状态
const showIconHover = ref(false);
// 标题区域状态
const showTitleHover = ref(false);
// 当前卡片尺寸
console.log("props.customSize :>> ", props.customSize);
const currentSize = ref(props.customSize);

/**
 * 计算属性
 */
// 删除小组件的数据
const deleteObj = computed(() => {
  return {
    newIcon: "akar-icons:trash-can",
    fn: removeCard,
    title: "删除小组件",
    color: "#FF4D4F",
    disabled: props.options?.disabledDelete ? true : false,
  };
});
// 实际渲染的右键菜单
const menus = computed(() => {
  let deleteArr = [deleteObj.value];
  if (useEnv(props.envLimit)) return deleteArr;
  let menu = [...props.menuList, ...deleteArr];
  return menu;
});
// 头部左侧显示区域状态
const leftHover = computed(() => {
  return (
    (showLeftHover.value || showIconHover.value) &&
    (props.header.leftHover || props.header.iconHover)
  );
});

// 头部标题显示区域状态
const titleHover = computed(() => {
  return showTitleHover.value && props.header.titleHover;
});

// 头部标题
const title = computed(() => {
  if (leftHover.value) {
    return props.header.leftHoverName;
  } else if (titleHover.value) {
    return props.header.titleHoverName;
  }
  return props.header.title;
});
// 头部右侧图标
const rightIcons = computed(() => {
  let arr = [];

  if (Array.isArray(props.header.rightIcon)) {
    arr = [...props.header.rightIcon];
  } else {
    console.log("头部右侧图标不属于数组 :>> ");
  }
  if (props.header.refresh) {
    arr.push({
      ifyIcon: "fluent:arrow-clockwise-16-regular",
      class: props.header.refresh.state ? "refresh" : "",
      fn: props.header.refresh.fn,
      tip: props.header.refresh.tip,
      disabled: props.header.refresh.disabled,
    });
  }
  return arr;
});
// 卡片尺寸
const getSize = computed(() => {
  let w = 1;
  let h = 1;
  let str;
  if (typeof currentSize.value != "string") {
    console.warn("错误的传递 :>> ");
  } else {
    str = currentSize.value.split("x");
  }
  if (props.options.modalSize) {
    str = props.options.modalSize.split("x");
  }
  w = str[0];
  h = str[1];
  return {
    width: w * 134 + (w - 1) * 12 + "px",
    height: h * 96 + (h - 1) * 12 + "px",
  };
});

/**
 * 数据监听
 */
// 卡片尺寸更新
watch(
  () => props.customSize,
  (val) => {
    currentSize.value = val;
  }
);
// 卡片尺寸更新
watch(
  () => currentSize.value,
  (val) => {
    console.log("val :>> ", val);
    emits("update:customSize", val);
  }
);

// 更新小组件状态
watch(
  () => status.value,
  (val) => {
    emits("update:status", val);
  },
  {
    immediate: true,
  }
);
/**
 * 方法
 */
const resize = (data) => {
  emits("resize", data);
};
// 头部左侧点击
const leftClick = () => {
  if (props.header.leftHover) {
    emits("leftClick");
  }
};
// 头部图标点击
const leftIconClick = () => {
  if (props.header.iconHover) {
    emits("leftIconHover");
  }
};
// 头部标题点击
const titleClick = () => {
  if (props.header.titleHover) {
    emits("titleHover");
  }
};
// 右键删除
const removeCard = () => {
  emits("delete", customDelete);
  // 属于自定义删除事件
  if (props.options.customDel) return;
  customDelete();
};
// 实际删除事件
const customDelete = () => {
  cardStore.removeCard(props.customIndex, props.desk);
};

// 设置自定义数据
const setCustomData = (key, data) => {
  let obj = {};
  obj[key] = data;
  cardStore.updateCustomData(props.customIndex, obj, props.desk);
};
// 头部拖拽开始
const titleDragStart = () => {
  proxy.$bus.emit("startAdjust");
};
// 左侧区域鼠标进入
const leftMouseEnter = () => {
  if (!props.header.leftHover) return;
  showLeftHover.value = true;
};
// 左侧区域鼠标离开
const leftMouseLeave = () => {
  if (!props.header.leftHover) return;
  showLeftHover.value = false;
};
// 左侧图标鼠标进入
const iconMouseEnter = () => {
  if (!props.header.iconHover) return;
  showIconHover.value = true;
};
// 左侧图标鼠标离开
const iconMouseLeave = () => {
  if (!props.header.iconHover) return;
  showIconHover.value = false;
};
// 标题区域鼠标进入
const titleMouseEnter = () => {
  if (!props.header.titleHover) return;
  showTitleHover.value = true;
};
// 标题区域鼠标离开
const titleMouseLeave = () => {
  if (!props.header.titleHover) return;
  showTitleHover.value = false;
};

defineExpose({
  removeCard,
});
</script>

<style lang="scss" scoped>
.editing {
  &::before {
    content: "";
    position: absolute;
    cursor: grab !important;

    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0);
    z-index: 999;
  }
}

.refresh {
  animation: rotate 0.5s infinite linear;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

.header-right {
  display: none;
}

.widget:hover .header-right {
  display: flex;
}

.header-right-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 28px;
  height: 28px;
  border-radius: 6px;

  &:hover {
    background: var(--secondary-transp-bg);
  }
}

.header-right-icon-tip {
  display: none;
}

.header-right-icon:hover .header-right-icon-tip {
  display: flex;
}

.header-default {
  margin-left: 14px;
}

.header-open {
  height: 28px;
  background: var(--modal-bg);
  padding: 0 8px;
  border-radius: 6px;
  margin-left: 6px;
}

.header-title {
  height: 28px;
  background: var(--modal-bg);
  border-radius: 6px;
}

.triangle-bottom {
  position: absolute;
  bottom: -6px;
  width: 6px;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-bottom: 6px solid var(--modal-bg);
  transform: translateX(-50%) rotate(180deg);
  left: 50%;
}

.shadow {
  backdrop-filter: blur(50px);
  -webkit-backdrop-filter: blur(50px);
}
</style>
