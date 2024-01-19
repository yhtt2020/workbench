<template>
  <RightMenu
    :menus="menus"
    :customIndex="customIndex"
    v-model:size="currentSize"
    :sizeList="sizeList"
    :disableHierarchy="options.hierarchy"
  >
    <div
      v-if="!options?.custom"
      class="flex flex-col xt-shadow widget rounded-xl"
      :class="[edit ? 'editing' : '']"
      style="backdrop-filter: blur(50px); -webkit-backdrop-filter: blur(50px)"
      :style="[
        getSize,
        {
          background: options.bg || 'var( --primary-bg)',
          color: options.color || 'var(--primary-text)',
        },
      ]"
    >
      <!-- 头部区域 -->
      <div
        v-if="!header.disabled"
        @dragstart.stop="titleDragStart"
        draggable="true"
        class="flex items-center justify-between w-full"
        style="height: 46px; border-radius: 12px 12px 0 0; cursor: grab"
        :style="{
          background: header.bg || '',
          color: header.color || '',
        }"
      >
        <!-- 头部左侧 -->
        <div class="flex items-center flex-1" style="height: 28px">
          <div
            @click="leftClick"
            class="flex items-center h-full"
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
              @mouseenter="titleMouseEnter"
              @mouseleave="titleMouseLeave"
              :class="{ 'header-title': titleHover }"
            >
              <slot name="title">
                {{ title }}
              </slot>
            </div>
            <slot name="left-extend"></slot>
          </div>
        </div>
        <!-- 头部右侧 -->
        <div class="flex items-center header-right" style="padding-right: 14px">
          <slot name="right-extend"></slot>

          <template
            v-if="rightIcons && rightIcons.length"
            v-for="item in rightIcons"
          >
            <div v-if="!item.disabled" class="header-right-icon mr-1.5">
              <!-- 右侧图标悬浮提示 -->
              <div
                v-if="item.tip"
                class="absolute xt-modal py-1 px-2 rounded-lg header-right-icon-tip"
                style="top:-30px;left:50%,transform:translateX(-50%)"
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
      <PageState :env="env" :options="options">
        <div
          class="flex-1 h-full rounded-b-lg"
          :style="[
            {
              background: body.bg,
              color: body.color,
              padding: body.scroll ? '0 14px' : '0 14px 14px 14px',
            },
          ]"
        >
          <slot>
            <!--  主体内容插槽1  -->
          </slot>
        </div>
      </PageState>
    </div>
    <div v-else :class="[edit ? 'editing' : '']">
      <slot>
        <!--  主体内容插槽2  -->
      </slot>
    </div>

    <!-- 卡片整体区域end -->
    <!-- 右上角抽屉菜单扩展 start  -->
    <template #menuExtra>
      <slot name="menuExtra"></slot>
    </template>
    <!-- 右上角抽屉扩展 end -->
  </RightMenu>
  <!--额外插槽，用于扩展一些不可见的扩展元素start-->
  <slot name="extra"> </slot>
  <!--额外插槽，用于扩展一些不可见的扩展元素end-->
  <slot name="msg"></slot>
</template>
<!-- lang="ts" -->
<script setup>
import { mapActions, mapWritableState } from "pinia";
import _ from "lodash-es";
import { useToast } from "vue-toastification";
import { watch, computed, ref, onBeforeMount, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { cardStore as useCardStore } from "../../store/card";
import { offlineStore } from "../../js/common/offline";
import { useWidgetStore } from "./store";
import { useFreeLayoutStore } from "../desk/freeLayout/store";

import RightMenu from "./RightMenu.vue";
import PageState from "./PageState.vue";
import Msg from "./Msg.vue";

import { deepMerge } from "./ContainerUtils";

import XtButton from "../../ui/libs/Button/index.vue";

/**
 * pinia
 */
// 卡片数据
const cardStore = useCardStore();
//
const widgetStore = useWidgetStore();
const { edit } = storeToRefs(widgetStore);
// 自由布局
const freeLayoutStore = useFreeLayoutStore();
const { isSelectAll } = storeToRefs(freeLayoutStore);
// props
const props = defineProps({
  /**
   * header body customSize sizeList defaultData options
   * 均为重构后的数据结构 需要阅读源码
   */
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
        refresh: {},
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
  // 卡片尺寸 默认 4x2
  customSize: {
    type: String,
    default: "4x2",
  },
  // 作为弹窗时的尺寸
  modalSize: {},
  /**
   * 可选尺寸，此属性设置后，在编辑处会显示可选尺寸。
   * 格式为 { name: '4x2'value: '4x2' }
   */
  sizeList: {
    type: Array,
    default: () => [],
  },
  /**
   * 卡片默认数据
   * 传递后每次都会帮你校验数据
   */
  defaultData: {},
  // 全局选项
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
        del: false,
      };
    },
  },
  /**
   * 右上角菜单项
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
  //组件索引
  customIndex: {
    type: Number,
    default: 0,
  },
  //组件自定义数据，每个卡片独立，并存入桌面数据当中
  customData: {
    type: Object,
    default: () => {},
  },

  desk: {
    type: Object,
    required: true,
  },
  env: {
    type: Object,
    default: () => {
      return {
        web: false,
        mobile: false,
        client: false,
        offline: false,
      };
    },
  },
});

onBeforeMount(() => {
  // 处理默认数据
  if (props.defaultData) {
    deepMerge(props.customData, props.defaultData);
  }
});
/**
 * emits
 */
// "update:customSize" 更新卡片大小回调
// leftClick 头部左侧鼠标经过点击回调
// delete 小组件删除回调
const emits = defineEmits(["update:customSize", "leftClick", "delete"]);

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
const currentSize = ref(props.customSize);

/**
 * 计算属性
 */
// 实际渲染的右键菜单
const menus = computed(() => {
  return [
    ...props.menuList,
    {
      newIcon: "akar-icons:trash-can",
      fn: () => {
        // 未补全?.type
        if (props.options?.type != "note") {
          doRemoveCard();
        } else {
          // 便签单独处理
          props.options?.removeCard();
          emits("");
        }
      },
      title: "删除小组件",
      color: "#FF4D4F",
      disabled: props.options?.del ? true : false,
    },
  ];
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
  let arr = [...props.header.rightIcon];
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
  if (props.modalSize) {
    str = props.modalSize.split("x");
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
    emits("update:customSize", val);
  }
);

// 方法
// 头部拖拽开始
const titleDragStart = () => {
  const toast = useToast();
  toast.clear();
  toast(
    {
      component: Msg,
    },
    {
      icon: false,
      closeOnClick: false,
      closeButton: false,
      pauseOnFocusLoss: true,
      pauseOnHover: true,
      toastClassName: "notice-toast",
      timeout: 3000,
      hideProgressBar: false,
    }
  );
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

// 头部左侧点击
const leftClick = () => {
  if (props.header.leftHover) {
    emits("leftClick");
  }
};
// 右键删除
const doRemoveCard = () => {
  emits("delete");
  cardStore.removeCard(props.customIndex, props.desk);
};

// 设置自定义数据
const setCustomData = (key, data) => {
  let obj = {};
  obj[key] = data;
  cardStore.updateCustomData(props.customIndex, obj, props.desk);
};
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
</style>
