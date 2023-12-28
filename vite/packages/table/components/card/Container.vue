<template>
  <RightMenu
    :menus="menus"
    :customIndex="customIndex"
    @removeCard="doRemoveCard"
    class="relative"
    v-model:size="currentSize"
    :sizeList="sizeList"
  >
    <div
      v-if="!options?.hide"
      class="flex flex-col widget rounded-xl"
      :class="[edit ? 'editing' : '']"
      style="color: var(--primary-text); padding: 0"
      :style="[
        getSize,
        {
          display: options.hide == true ? 'none' : '',
          background: options.background || 'var( --primary-bg)',
        },
      ]"
    >
      <!-- 头部区域 -->
      <div
        v-if="!header.disabled"
        @dragstart.stop="handleDragStart"
        draggable="true"
        class="w-full flex items-center justify-between"
        style="height: 46px; border-radius: 12px 12px 0 0; cursor: grab"
        :style="{
          background: header.bg || '',
        }"
      >
        <!-- 头部左侧 -->
        <div class="flex items-center flex-1" style="height: 28px">
          <div
            @click="onOpen"
            class="flex items-center h-full"
            @mouseenter="openMouseEnter"
            @mouseleave="openMouseLeave"
            style=""
            :class="[
              openState ? 'header-open cursor-pointer' : 'header-default',
            ]"
          >
            <!-- 图标区域 -->
            <div
              class="flex items-center h-full"
              @mouseenter="iconMouseEnter"
              @mouseleave="iconMouseLeave"
            >
              <xt-ify-icon v-if="openState" icon="fluent:open-16-regular" />
              <template v-else>
                <xt-icon
                  v-if="header.icon"
                  :icon="header.icon"
                  type=""
                  size="19"
                  w="20"
                />
                <xt-ify-icon
                  v-else-if="header.newIcon"
                  :icon="header.newIcon"
                />
              </template>
            </div>
            <!-- 标题区域 -->
            <div
              class="flex items-center px-1 h-full ml-1"
              @mouseenter="titleMouseEnter"
              @mouseleave="titleMouseLeave"
              :class="{ 'header-title': titleState }"
            >
              <slot name="title">
                <template v-if="openState">
                  {{ iconName ? iconName : "点击打开" }}
                </template>
                <template v-else-if="titleState">
                  {{ titleName ? titleName : "点击打开" }}
                </template>
                <template v-else>
                  {{ header.title }}
                </template>
              </slot>
            </div>
            <slot name="left-extend"></slot>
          </div>
        </div>
        <!-- 头部右侧 -->
        <div class="flex items-center header-right" style="padding-right: 14px">
          <slot name="right-extend"></slot>

          <div v-if="header.add" class="header-right-icon mr-0.5">
            <xt-ify-icon
              icon="fluent:add-16-regular"
              @click="onAdd"
              size="20"
            />
          </div>
          <div v-if="header.refresh" class="header-right-icon mr-1">
            <xt-ify-icon
              :class="isTitleRefresh ? 'refresh' : ''"
              icon="fluent:arrow-clockwise-16-regular"
              @click="onRefresh"
              size="20"
            />
          </div>
          <RightMenu
            :menus="menus"
            :customIndex="customIndex"
            model="all"
            @removeCard="doRemoveCard"
            v-model:size="currentSize"
            :sizeList="sizeList"
          >
            <xt-ify-icon icon="fluent:line-horizontal-3-20-filled" size="20" />
          </RightMenu>
        </div>
      </div>
      <PageState :env="env" :options="options">
        <div class="flex-1 h-0">
          <div
            class="h-full rounded-b-lg"
            :style="[
              {
                background: options.showColor ? 'var(--main-bg)' : '',
                padding: main.scroll ? '0 14px' : '0 14px 14px 14px',
              },
            ]"
          >
            <slot>
              <!--  主体内容插槽1  -->
            </slot>
          </div>
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
import { mapActions, mapWritableState } from "pinia";
import _ from "lodash-es";

import { cardStore } from "../../store/card";
import { offlineStore } from "../../js/common/offline";

import RightMenu from "./RightMenu.vue";
import PageState from "./PageState.vue";
// import { IOption, IMenuItem } from "./types";
import { useWidgetStore } from "./store";
import { useFreeLayoutStore } from "../desk/freeLayout/store";
import { message } from "ant-design-vue";
export default {
  components: {
    RightMenu,
    PageState,
  },
  name: "Container",
  props: {
    header: {
      type: Object,
      default: () => {
        return {
          // 禁用头部区域
          disabled: false,
          // 左侧图标 适配旧版icon 适配新版newIcon
          icon: "",
          newIcon: "",
          // 右侧添加图标 true为打开 false为关闭
          add: false,
          // 右侧刷新图标 true为打开 false为关闭
          refresh: false,
          // 标题背景色 true为打开 false为关闭
          bg: false,
          // 鼠标经过显示 左侧图标 + 标题区域  true为打开 false为关闭
          openState: false,
          openName: "",
          // 鼠标经过显示 左侧图标 true为打开 false为关闭
          iconState: false,
          iconName: "",
          // 鼠标经过显示 标题区域  true为打开 false为关闭
          titleState: false,
          titleName: "",
        };
      },
    },
    main: {
      default: () => {
        return {
          // 是否开启滚动条边距
          scroll: false,
        };
      },
    },
    //
    /**
     * 卡片尺寸 默认4x2
     */
    size: {
      type: String,
      default: "4x2",
    },
    //可选尺寸，此属性设置后，在编辑处会显示可选尺寸。
    sizeList: {
      type: Array,
      default: () => [],
    },
    //选项
    options: {
      //  as PropType<IOption>
      type: Object,
      default: () => ({}),
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
      // 小组件
      widgetSize: {
        width: "",
        height: "",
      },
      isTitleRefresh: false,
      showOpenState: false,
      showIconState: false,
      showTitleState: false,
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

    openState() {
      return (
        (this.showOpenState || this.showIconState) &&
        (this.header.openState || this.header.iconState)
      );
    },
    titleState() {
      return this.showTitleState && this.header.titleState;
    },
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
  },
  mounted() {},
  watch: {
    size(newV) {
      this.currentSize = newV;
    },
    currentSize(newV) {
      this.$emit("update:size", newV);
    },
  },
  methods: {
    ...mapActions(cardStore, ["removeCard", "updateCustomData"]),
    ...mapActions(offlineStore, ["getIsOffline"]),
    // openMouseEnter" @mouseleave="openMouseLeave">
    handleDragStart() {
      message.info("开启调整桌面布局可以拖拽小组件");
    },
    openMouseEnter() {
      if (!this.header.openState) return;
      this.showOpenState = true;
    },
    openMouseLeave() {
      if (!this.header.openState) return;
      this.showOpenState = false;
    },
    iconMouseEnter() {
      if (!this.header.iconState) return;
      this.showIconState = true;
    },
    iconMouseLeave() {
      if (!this.header.iconState) return;
      this.showIconState = false;
    },
    titleMouseEnter() {
      if (!this.header.titleState) return;
      this.showTitleState = true;
    },
    titleMouseLeave() {
      if (!this.header.titleState) return;
      this.showTitleState = false;
    },
    onOpen() {
      if (!this.header.openState) return;
      this.$emit("onOpen");
    },
    onSwitch() {},
    onAdd() {
      this.$emit("onAdd");
    },
    onRefresh() {
      this.isTitleRefresh = true;

      this.$emit("onRefresh");
      setTimeout(() => {
        this.isTitleRefresh = false;
      }, 1000);
    },
    // 右键删除
    doRemoveCard() {
      this.options.beforeDelete && this.$emit("delete");
      this.removeCard(this.customIndex, this.desk);
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
