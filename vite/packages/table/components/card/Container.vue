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
    <div
      class="menu-box"
      :class="[options.noBorder ? 'hover:tt-theme-bg-2 rounded-xl' : '']"
    >
      <!-- 离线模式-->
      <div
        class="mask rounded-xl"
        v-if="envLimit.includes('offline') && currentEnv == 'offline'"
      >
        <div class="mask-box">
          <p class="flex justify-center">
            <xt-new-icon
              class="mr-2"
              :size="cardH <= 2 ? '60' : '100'"
              icon="fluent-emoji:airplane"
            ></xt-new-icon>
          </p>
          <p>处于离线模式，暂无法使用</p>
          <p>
            <xt-button
              :w="145"
              :h="40"
              @click="useUpdateUserInfo"
              class="ml-3 xt-bg-2"
              key="console"
              type="theme"
            >
              <div class="flex">
                <xt-new-icon
                  class="mr-2"
                  size="20"
                  icon="fluent:arrow-clockwise-16-regular"
                ></xt-new-icon>
                尝试重连
              </div>
            </xt-button>
          </p>
        </div>
      </div>

      <!-- 自定义模式 -->
      <div v-if="options?.custom" :class="[edit ? 'editing' : '']">
        <slot>
          <!--  主体内容插槽2  -->
        </slot>
      </div>
      <!-- 默认模式 -->
      <div
        v-else
        ref="container"
        class="flex flex-col widget rounded-xl"
        :class="[
          edit ? 'editing' : '',
          options.shadow || options.noBorder ? '' : 'shadow xt-shadow',
        ]"
        @touchmove="handleTouchStart"
        style=""
        :style="[getSize, containerStyle]"
      >
        <!-- 小组件头部开始 -->
        <header
          v-if="!header.disabled && !options.noBorder"
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
            <slot name="header-left">
              <div
                class="flex items-center h-full"
                @click="leftClick"
                @mouseenter="leftMouseEnter"
                @mouseleave="leftMouseLeave"
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
                    <xt-mix-icon
                      v-if="mixIcon"
                      :icon="mixIcon"
                      w="20"
                      h="20"
                      class="tt-no-bg"
                    />
                  </template>
                </div>
                <!-- 标题区域 -->
                <div
                  class="flex items-center h-full px-2 ml-1"
                  @click="titleClick"
                  @mouseenter="titleMouseEnter"
                  @mouseleave="titleMouseLeave"
                  style="z-index: 999"
                  :class="{ 'header-title': titleHover, pointer: true }"
                >
                  <slot name="title"> {{ title }} </slot>
                </div>
                <!-- 头部左侧扩展区域 -->
                <slot name="left-extend"></slot>
              </div>
            </slot>
          </div>
          <!-- 头部右侧 -->
          <div
            class="flex items-center header-right"
            style="padding-right: 14px"
          >
            <!-- 右侧扩展区域 -->
            <slot name="right-extend"></slot>
            <template
              v-if="rightIcons && rightIcons.length"
              v-for="item in rightIcons"
            >
              <div v-if="!item.disabled" class="mr-1 header-right-icon">
                <!-- 右侧图标悬浮提示 -->
                <a-tooltip
                  :title="item.tip"
                  :get-popup-container="getPopupContainer"
                >
                  <xt-ify-icon
                    v-if="item.ifyIcon"
                    :icon="item.ifyIcon"
                    @click="item.fn"
                    :class="item.class"
                    size="20" />
                  <xt-icon
                    v-else-if="item.icon"
                    :icon="item.icon"
                    @click="item.fn"
                    type=""
                    size="19"
                    w="20"
                /></a-tooltip>
              </div>
            </template>
            <RightMenu
              :menus="menus"
              :customIndex="customIndex"
              model="all"
              v-model:size="currentSize"
              :disableHierarchy="options.hierarchy"
              :sizeList="sizeList"
              v-if="!options.rightMenuVisible"
            >
              <div class="header-right-icon">
                <xt-ify-icon
                  icon="fluent:line-horizontal-3-20-regular"
                  size="20"
                />
              </div>
            </RightMenu>
            <slot name="customRightMenu" v-else></slot>
          </div>
        </header>
        <!-- 小组件头部结束 -->
        <!-- 小组件主体开始 -->
        <xt-status
          :name="options.cardName"
          :status="envLimitStatus"
          :plat="platLimit"
          :imgSize="75"
        >
          <div class="h-full rounded-b-lg" :style="[bodyStyle]">
            <Resize
              v-model:size="currentSize"
              v-bind="resizeOptions"
              :modalSize="options.modalSize"
              :resize="options.resize"
              @resize="resize"
            >
              <slot></slot>
            </Resize>
          </div>
        </xt-status>
        <!-- 小组件主体结束 -->
      </div>
    </div>
  </RightMenu>
</template>
<script setup>
import _ from "lodash-es";
import {
  watch,
  computed,
  ref,
  onBeforeMount,
  onMounted,
  onBeforeUnmount,
  getCurrentInstance,
  toRefs,
  nextTick,
  provide,
} from "vue";
import { storeToRefs } from "pinia";
import { cardStore as useCardStore } from "../../store/card";
import { useWidgetStore } from "./store";
import { useFreeLayoutStore } from "../desk/freeLayout/store";
import { useMouseInElement } from "@vueuse/core";
import { navStore } from "../../store/nav";
import { titleOption } from "./libs/rightMenuOption";

import Resize from "./Resize.vue";
import RightMenu from "./RightMenu.vue";
import { usePlat } from "../../ui/hooks/usePlat";
import { addCardToNav } from "./hooks/addCardToNav";
import { useConversionCard } from "./hooks/useConversionCard";
import { useDelCard } from "../../hooks";
import { defaultProps } from "./props";
import { useUpdateUserInfo } from "../../permission/user/useUserPermit";
import { usePermissionStore } from "../../permission/store";
const container = ref(null);
const { isOutside } = useMouseInElement(container);

const { proxy } = getCurrentInstance();

/**
 * pinia
 */
// 卡片数据
const cardStore = useCardStore();

// 导航栏是否开启
const useNav = navStore();
const { navigationToggle } = storeToRefs(useNav);
//
const widgetStore = useWidgetStore();
const usePermission = usePermissionStore();
const { currentEnv } = storeToRefs(usePermission);
const { edit } = storeToRefs(widgetStore);

const init = ref(false);
// 自由布局
// const freeLayoutStore = useFreeLayoutStore();

const props = defineProps(defaultProps);

const { header, customData, customIndex } = toRefs(props);

const envLimitStatus = computed(() => {
  return props.envLimit.filter((item) => item != "offline");
});

// 键盘事件
const handleKeyDown = (event) => {
  if (event.code === "Space") {
    event.stopPropagation();
  }
  if (event.ctrlKey && (event.key === "A" || event.key === "a")) {
    event.stopPropagation();
  }
};

//
const handleTouchStart = (e) => {
  e.stopPropagation();
};

onBeforeMount(() => {
  // 处理默认数据
  let defaultData = props.options.defaultData;
  let currentData = props.customData;
  let _updateFlag = currentData?._updateFlag ? currentData?._updateFlag : true;
  if (defaultData && _updateFlag != defaultData?._updateFlag) {
    // console.time("组件数据更新");
    props.customData = _.defaults(currentData, defaultData);
    props.customData._updateFlag = defaultData._updateFlag;

  }
});
provide("_data", customData);
provide("_index", customIndex);
onMounted(() => {
  // 防止自定义时，无法获取到container导致卡死
  if (container.value) {
    container.value.addEventListener("keydown", handleKeyDown, {
      capture: true,
    });
    container.value.addEventListener("keydown", handleTouchStart, {
      capture: true,
    });
  }
});
onBeforeUnmount(() => {
  if (container.value) {
    container.value.removeEventListener("keydown", handleKeyDown, {
      capture: true,
    });
    container.value.removeEventListener("keydown", handleTouchStart, {
      capture: true,
    });
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
  "copy",
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
const currentSize = ref(props.customSize);
// 当前卡片高度
const cardH = ref("1");
/**
 * 计算属性
 */
const status = computed(() => {
  return {
    outside: isOutside.value,
  };
});
const mixIcon = computed(() => {
  if (props.header.mixIcon) {
    return props.header.mixIcon;
  }
  if (props.header.icon) {
    return props.header.icon;
  }
  if (props.header.ifyIcon) {
    return props.header.ifyIcon;
  }
  if (props.header.showIcon) {
    return props.header.showIcon;
  }
});
// 删除小组件的数据
const deleteObj = computed(() => {
  return {
    newIcon: "akar-icons:trash-can",
    fn: removeCard,
    title: "删除",
    color: "#FF4D4F",
    disabled: props.options?.disabledDelete ? true : false,
  };
});
// 复制小组件的数据
const copyObj = computed(() => {
  return {
    newIcon: "fluent:copy-select-24-regular",
    fn: copyCard,
    title: "复制",
  };
});
// 卡片数据转为图标数据格式
const cardData = computed(() => {
  return useConversionCard(props);
});
// 容器样式
const containerStyle = computed(() => {
  // 背景色
  let background = "var(--primary-bg)";
  if (props.options.noBorder) {
    background = "none";
  } else if (props.options.bg) {
    background = props.options.bg;
  }
  // 字体色
  let color = "var(--primary-text)";
  if (props.options.color) {
    background = props.options.color;
  }
  return {
    background,
    color,
  };
});
const bodyStyle = computed(() => {
  let background = "none";
  if (props.body?.bg) {
    background = props.body.bg;
  }

  // 字体色
  let color = "";
  if (props.body?.color) {
    background = props.body.color;
  }
  // 边框
  let padding = "";
  if (!props.options?.noBorder) {
    padding = props.body.scroll ? "0 14px" : "0 14px 14px 14px";
  }
  return {
    background,
    color,
    padding,
  };
});
// 添加到导航栏的数据
const addObj = computed(() => {
  return {
    title: "添加到导航栏",
    newIcon: "fluent:tablet-16-regular",
    disabled: props.options.disabledNav ? true : false,
    children: [
      {
        title: "主导航",
        newIcon: "fluent:tablet-16-regular",
        color: navigationToggle.value[2]
          ? "var(--primary-text)"
          : "var(--secondary-text)",
        fn: () => {
          // addMoreIcon('foot','主导航')
          console.log("主导航");
          addCardToNav(cardData.value, "foot");
        },
      },
      {
        title: "左侧导航栏",
        newIcon: "fluent:panel-left-contract-16-regular",
        color: navigationToggle.value[0]
          ? "var(--primary-text)"
          : "var(--secondary-text)",
        fn: () => {
          // addMoreIcon('left','左侧导航栏')
          console.log("左侧导航栏");
          addCardToNav(cardData.value, "left");
        },
      },
      {
        title: "右侧导航栏",
        newIcon: "fluent:panel-right-contract-16-regular",
        color: navigationToggle.value[1]
          ? "var(--primary-text)"
          : "var(--secondary-text)",
        fn: () => {
          // addMoreIcon('right','右侧导航栏')
          console.log("右侧导航栏");
          addCardToNav(cardData.value, "right");
        },
      },
    ],
  };
});
// 实际渲染的右键菜单
const menus = computed(() => {
  const platLimit = props.platLimit || " ";
  if (usePlat(platLimit)) {
    return [addObj.value,copyObj.value, deleteObj.value];
  }

  // 在社群成员桌面的场景下,需要的处理
  if (props?.options?.disableEdit) {
    const filterMenu = props.menuList.filter((item) => {
      return titleOption.some((some) => {
        return String(some) !== String(item.title);
      });
    });
    return filterMenu;
  }

  let menu = [...props.menuList, addObj.value,copyObj.value, deleteObj.value];
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
  cardH.value = str[1];
  let size= {
    width: w * 134 + (w - 1) * 12 ,
    height: h * 96 + (h - 1) * 12 ,
  };
  // if(props.options.noBorder){
  //   size.width+=30
  //   size.height+=30
  // }
  size.width = size.width+ "px"
  size.height = size.height+ "px"
  return size
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
    emits("resize", val);
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
  // 将社群桌面的数据进行同步,只限社群管理员。
  if (props.desk?.hasOwnProperty("communityNo")) {
    proxy.$bus.emit("updateSync");
  }
};
const copyCard=()=>{
  emits("copy", copyEvent);
  // 属于自定义删除事件
  if (props.options.customCopy) return;
  copyEvent();
  // 将社群桌面的数据进行同步,只限社群管理员。
  if (props.desk?.hasOwnProperty("communityNo")) {
    proxy.$bus.emit("updateSync");
  }
}
// 实际删除事件
const customDelete = () => {
  // useDelCard(props.customIndex);
  cardStore.removeCard(props.customIndex, props.desk);
};
const copyEvent=()=>{
  cardStore.copyCard(props.customIndex, props.desk);
}
// 设置自定义数据
const setCustomData = (key, data) => {
  let obj = {};
  obj[key] = data;
  cardStore.updateCustomData(props.customIndex, obj, props.desk);
};
// 头部拖拽开始
const titleDragStart = () => {
  if (props.options.disabledDrag) return;
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

// 自动调整tip弹出位置
const getPopupContainer = (trigger) => {
  return trigger.parentElement;
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
    z-index: 99999;
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

.menu-box {
  z-index: 9;
}
.mask {
  width: 100%;
  height: 100%;
  position: absolute;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(3px);
  z-index: 10;
  display: none;
  // display: flex;
  justify-content: center;
  align-items: center;
  .mask-box {
    text-align: center;
  }
}
.menu-box:hover .mask {
  display: flex;
}
</style>
