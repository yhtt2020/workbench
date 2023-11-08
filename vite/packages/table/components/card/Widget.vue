<template>
  <Drop v-model:widgetSize="widgetSize">
    <RightMenu
      :menus="menus"
      :sizes="sizeList"
      @removeCard="doRemoveCard"
      v-model:sizeType="sizeType"
      v-model:oldMenuVisible="menuVisible"
    >
      <div
        v-if="!options?.hide"
        :class="classes"
        style="color: var(--primary-text)"
        :style="{
          display: options.hide == true ? 'none' : '',
          width: customSize.width,
          height: customSize.height,
          background: options.background || 'var( --primary-bg)',
        }"
      >
        <!--标题栏start-->
        <slot name="cardTitle">
          <div
            :class="options.noTitle === true ? 'no-title' : 'content-title'"
            class="flex items-center justify-between"
          >
            <div class="left-title" v-if="options.noTitle !== true">
              <!-- 标题左侧插槽 -->
              <slot name="left-title-icon"></slot>
              <!-- 标题旧版左侧图标 -->
              <Icon :icon="options.icon" class="title-icon"></Icon>
              <div class="flex w-2/3">
                <!-- 卡片标题插槽 -->
                <slot name="title-text">
                  {{ options.title }}
                </slot>
                <!-- 标题右侧插槽 -->
                <slot name="left-title"></slot>
              </div>
            </div>
            <div class="z-10 right-title flex" v-if="showRightIcon">
              <!-- 右侧设置插槽  用于扩展标题菜单左侧位置的内容  -->
              <slot name="right-menu"> </slot>
              <MenuOutlined
                class="pointer"
                @click="showDrawer($event)"
                @contextmenu.stop="showDrawer"
              />
            </div>
          </div>
        </slot>
        <!-- 标题栏end   -->
        <!--  主体内容插槽start  -->
        <PageState :env="env" :options="options">
          <slot></slot>
        </PageState>
        <!--  主题
          内容插槽end  -->
      </div>
      <slot v-else></slot>
      <!-- 右上角抽屉菜单扩展 start  -->
      <template #menuExtra>
        <slot name="menuExtra"></slot>
      </template>
      <!-- 右上角抽屉扩展 end -->
    </RightMenu>
  </Drop>

  <!--额外插槽，用于扩展一些不可见的扩展元素start-->
  <slot name="extra"> </slot>
  <!--额外插槽，用于扩展一些不可见的扩展元素end-->
</template>

<script lang="ts">
import { PropType } from "vue";
import { mapActions, mapWritableState } from "pinia";
import { MenuOutlined } from "@ant-design/icons-vue";
import { Icon as MyIcon } from "@iconify/vue";
import _ from "lodash-es";

import { cardStore } from "../../store/card";
import { offlineStore } from "../../js/common/offline";

import Template from "../../../user/pages/Template.vue";
import RightMenu from "./RightMenu.vue";
import PageState from "./PageState.vue";
import Drop from "./Drop.vue";
import { IOption, IMenuItem } from "./types";

export default {
  components: {
    Template,
    MenuOutlined,
    MyIcon,
    RightMenu,
    PageState,
    Drop,
  },
  name: "Widget",
  props: {
    //卡片尺寸，这个属性优先级高于下方的sizeList
    size: {
      type: Object,
      default: {
        width: undefined,
        height: undefined,
      },
    },
    //可选尺寸，此属性设置后，在编辑处会显示可选尺寸。
    sizeList: {
      type: Array,
      default: () => [],
    },
    //选项
    options: {
      type: Object as PropType<IOption>,
      default: () => ({}),
    },
    //右上角菜单项
    menuList: {
      type: Array as PropType<IMenuItem>,
      default: () => [],
    },
    //是否编辑中，如果为是，则屏蔽鼠标事件，使卡片无法被点击，一般用于调整布局
    editing: {
      type: Boolean,
      default: false,
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
    //是否显示右上角的图标
    showRightIcon: {
      type: Boolean,
      default: true,
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
      //右上角抽屉菜单可见与否的控制
      menuVisible: false,
      //当前设置的组件尺寸数据，对应着props里的sizeList
      sizeType: { title: "", height: undefined, width: undefined, name: "" },
    };
  },
  computed: {
    ...mapWritableState(cardStore, ["customComponents"]),
    menus() {
      return [
        ...this.menuList,
        {
          newIcon: "akar-icons:trash-can",
          fn: this.doRemoveCard,
          title: "删除小组件",
          color: "#FF4D4F",
        },
      ];
    },

    isCustomData() {
      return Object.keys(this.customData).length !== 0;
    },
    isCode() {
      return this.customData.hasOwnProperty("Code");
    },
    customSize() {
      return {
        width:
          this.size.width ||
          this.sizeType.width * 280 + (this.sizeType.width - 1) * 10 + "px" ||
          undefined,
        height:
          this.size.height ||
          this.sizeType.height * 205 + (this.sizeType.height - 1) * 10 + "px" ||
          undefined,
      };
    },
    classes() {
      //默认的对象
      let defaultClass: any = {
        gradient: true,
        "gradient--14": true,
      };
      //如果存在hideFrame的设置
      if (this.customData && this.customData.hideFrame) {
        defaultClass = {};
      }
      let classNameObject = {};
      if (Object.keys(defaultClass).length > 0) {
        //取出className，并分割出一个类的数组
        if (this.options.className) {
          this.options.className.split(" ").map((c) => {
            classNameObject[c] = true;
          });
        }
      }
      let after = _.cloneDeep(Object.assign(classNameObject, defaultClass));
      if (Object.keys(after).length === 0) {
        after["no-frame"] = true;
      }
      return after;
    },
  },
  mounted() {
    let customData =
      this.$parent.customData ||
      this.$parent.$attrs.customData ||
      this.$parent.$parent.customData;
    if (customData) {
      if (customData.width && customData.height) {
        this.sizeType = {
          title: customData.width + "x" + customData.height,
          height: customData.height,
          width: customData.width,
          name: customData.width + "x" + customData.height,
        };
        // this.$parent.$attrs.onCustomEvent()
        // console.log(this.$parent.$attrs.onCustomEvent)
      }
    }
  },

  watch: {
    // 旧版卡片大小更新
    sizeType: {
      handler() {
        this.updateCustomData(
          this.$parent.customIndex ||
            this.$parent.$parent.customIndex ||
            this.$parent.$attrs.customIndex,
          {
            width: this.sizeType.width,
            height: this.sizeType.height,
          },
          this.desk
        );
      },
    },
    // 更新最新的widget框架大小
    widgetSize: {
      handler(newVal) {
        this.updateCustomData(
          this.$parent.customIndex ||
            this.$parent.$parent.customIndex ||
            this.$parent.$attrs.customIndex,
          {
            widgetSize: this.widgetSize,
          },
          this.desk
        );
      },
    },
  },

  methods: {
    ...mapActions(cardStore, ["removeCard", "updateCustomData"]),
    ...mapActions(offlineStore, ["getIsOffline"]),
    showDrawer(e) {
      this.menuVisible = true;
    },
    // 右键删除
    doRemoveCard() {
      this.options.beforeDelete && this.$emit("delete");
      this.removeCard(
        this.$parent.customIndex ||
          this.$parent.$parent.customIndex ||
          this.$parent.$attrs.customIndex,
        this.desk
      );
      this.menuVisible = false;
    },
    onSetup() {
      this.menuVisible = false;
    },
    onClose() {
      this.menuVisible = false;
    },
    hideMenu() {
      this.menuVisible = false;
    },
    goRoute() {
      this.$router.push(this.options.titleRoute);
    },
  },
};
</script>

<style lang="scss">
.no-frame {
  background: none !important;

  .no-title {
    position: absolute;
    right: 20px;
    top: 10px;
    z-index: 99;
  }

  position: relative;
}
</style>
