<template>
  <RightMenu
    :menus="menus"
    :customIndex="customIndex"
    v-model:size="currentSize"
    :sizeList="sizeList"
  >
    <div
      v-if="!options?.custom"
      class="flex flex-col xt-shadow widget rounded-xl"
      :class="[edit ? 'editing' : '']"
      style="
         {
          backdrop-filter: blur(50px);
          -webkit-backdrop-filter: blur(50px);
        }
      "
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
        class="w-full flex items-center justify-between"
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
              class="flex items-center px-2 h-full ml-1"
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
          <template v-if="rightIcons && rightIcons.length">
            <div v-for="item in rightIcons" class="header-right-icon mr-1">
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
              background: main.bg,
              color: main.color,
              padding: main.scroll ? '0 14px' : '0 14px 14px 14px',
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
<script>
// import { PropType } from "vue";
import { h } from "vue";
import { mapActions, mapWritableState } from "pinia";
import _ from "lodash-es";
import { useDebounceFn } from "@vueuse/core";
import { message, notification } from "ant-design-vue";
import { cardStore } from "../../store/card";
import { offlineStore } from "../../js/common/offline";
import { useWidgetStore } from "./store";
import { useFreeLayoutStore } from "../desk/freeLayout/store";

import RightMenu from "./RightMenu.vue";
import PageState from "./PageState.vue";
// import { IOption, IMenuItem } from "./types";

import { deepMerge } from "./ContainerUtils";

import XtButton from "../../ui/libs/Button/index.vue";

export default {
  components: {
    RightMenu,
    PageState,
    XtButton,
  },
  name: "Container",
  props: {
    /**
     * header main size sizeList defaultData
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
           *    fn: lockClick,
           * }
           */
          rightIcon: [],
          // 右侧添加图标 true为打开 false为关闭
          add: false,
          // 右侧刷新图标 true为打开 false为关闭
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
    main: {
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
    size: {
      type: String,
      default: "4x2",
    },
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
        };
      },
    },
    //右上角菜单项
    menuList: {
      // as PropType<IMenuItem>
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
  },
  data() {
    return {
      // 刷新状态
      refreshState: false,
      // 左侧区域状态
      showLeftHover: false,
      // 左侧图标区域状态
      showIconHover: false,
      // 标题区域状态
      showTitleHover: false,
      // 卡片尺寸
      currentSize: this.size,
    };
  },
  computed: {
    ...mapWritableState(useWidgetStore, ["edit"]),
    ...mapWritableState(useFreeLayoutStore, ["isSelectAll"]),
    menus() {
      return [
        ...this.menuList,
        {
          newIcon: "akar-icons:trash-can",
          fn: () => {
            if (this.isSelectAll) {
            }
            if (this.options?.type != "note") {
              this.doRemoveCard();
            } else {
              // 便签单独处理
              this.options?.removeCard();
            }
          },
          title: "删除小组件",
          color: "#FF4D4F",
        },
      ];
    },
    // 左侧区域状态
    leftHover() {
      return (
        (this.showLeftHover || this.showIconHover) &&
        (this.header.leftHover || this.header.iconHover)
      );
    },
    // 标题区域状态
    titleHover() {
      return this.showTitleHover && this.header.titleHover;
    },
    // 卡片尺寸
    getSize() {
      let w = 1;
      let h = 1;
      if (typeof this.currentSize != "string") {
        console.warn("错误的传递 :>> ");
      } else {
        let str = this.currentSize.split("x");
        w = str[0];
        h = str[1];
      }

      return {
        width: w * 134 + (w - 1) * 12 + "px",
        height: h * 96 + (h - 1) * 12 + "px",
      };
    },
    // 右侧图标
    rightIcons() {
      let arr = [...this.header.rightIcon];
      if (this.header.add) {
        arr.push({
          newIcon: "fluent:add-16-regular",
          fn: this.onAdd,
        });
      }

      if (this.header.refresh) {
        arr.push({
          newIcon: "fluent:arrow-clockwise-16-regular",
          class: this.refreshState ? "refresh" : "",
          fn: this.onRefresh,
        });
      }
      return arr;
    },
    title() {
      if (this.leftHover) {
        return this.header.leftHoverName;
      } else if (this.titleHover) {
        return this.header.titleHoverName;
      }
      return this.header.title;
    },
  },
  created() {
    if (!this.defaultData) return;
    deepMerge(this.customData, this.defaultData);
  },
  mounted() {},
  watch: {
    /**
     * 监听size变化
     */
    size(newV) {
      this.currentSize = newV;
    },
    currentSize(newV) {
      this.$emit("update:size", newV);
    },
    /**
     * 监听刷新状态变化
     */
    "header.refreshState": {
      handler(newValue, oldValue) {
        if (!newValue) {
          this.refreshState = false;
        }
      },
      deep: true,
    },
  },
  methods: {
    ...mapActions(cardStore, ["removeCard", "updateCustomData"]),
    ...mapActions(offlineStore, ["getIsOffline"]),
    // 头部拖拽开始
    titleDragStart() {
      // message.info("开启调整桌面布局可以拖拽小组件");
      const key = `open${Date.now()}`;
      const fn = () => {
        console.log("this :>> ", this);
        this.$bus.emit("startAdjust");
        notification.close(key);
      };
      notification["info"]({
        message: "开启调整桌面布局可以拖拽小组件",
        // description: "开启调整桌面布局可以拖拽小组件",
        btn: () =>
          h(
            XtButton,
            {
              type: "theme",
              w: "120",
              h: 40,
              onClick: fn,
            },
            { default: () => "调整布局" }
          ),
        key,
      });
      // notification.open({
      //   message: "Notification Title",
      //   description:
      //     'A function will be be called after the notification is closed (automatically after the "duration" time of manually).',
      //   btn: () =>
      //     h(
      //       XtButton,
      //       {
      //         type: "theme",
      //         size: "small",
      //         onClick: () => () => {
      //           console.log("123 :>> ", 123);
      //         },
      //       },
      //       { default: () => "Confirm" }
      //     ),
      // });
    },
    // 左侧区域鼠标进入
    leftMouseEnter() {
      if (!this.header.leftHover) return;
      this.showLeftHover = true;
    },
    // 左侧区域鼠标离开
    leftMouseLeave() {
      if (!this.header.leftHover) return;
      this.showLeftHover = false;
    },
    // 左侧图标鼠标进入
    iconMouseEnter() {
      if (!this.header.iconHover) return;
      this.showIconHover = true;
    },
    // 左侧图标鼠标离开
    iconMouseLeave() {
      if (!this.header.iconHover) return;
      this.showIconHover = false;
    },
    // 标题区域鼠标进入
    titleMouseEnter() {
      if (!this.header.titleHover) return;
      this.showTitleHover = true;
    },
    // 标题区域鼠标离开
    titleMouseLeave() {
      if (!this.header.titleHover) return;
      this.showTitleHover = false;
    },
    // 打开
    leftClick() {
      if (this.header.leftHover) {
        this.$emit("leftClick");
      }
    },
    // 新增
    onAdd() {
      this.$emit("onAdd");
    },
    // 刷新
    onRefresh() {
      this.refreshState = true;
      this.$emit("onRefresh");
      setTimeout(() => {
        this.refreshState = false;
      }, 2000);
    },
    // 右键删除
    doRemoveCard() {
      this.options.beforeDelete && this.$emit("delete");
      this.removeCard(this.customIndex, this.desk);
    },

    // 设置自定义数据
    setCustomData(key, data) {
      let obj = {};
      obj[key] = data;
      this.updateCustomData(this.customIndex, obj, this.desk);
    },
  },
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
</style>
