<template>
  <div @contextmenu.stop="showDrawer" :class="classes" :style="{
      pointerEvents: editing ? 'none' : '',
      width: customSize.width,
      height: customSize.height,
      background: 'var(--background-color)',
      color: 'var(--font-color)'
    }"  @mouseleave="onMouseOut" @mouseenter="onMouseOver">

    <!--标题栏start-->
    <slot name="title">
      <div :class="options.noTitle === true ? 'no-title' : 'content-title'" class="flex justify-between items-center">
        <div class="left-title" v-if="options.noTitle !== true">
          <Icon :icon="options.icon" class="title-icon"></Icon>
          <div class="w-2/3">{{ options.title }}</div>
        </div>
        <div class="right-title" @click.stop="showDrawer" @contextmenu.stop="showDrawer">
          <Icon icon="gengduo1" class="title-icon pointer"></Icon>
        </div>
      </div>
    </slot>
    <!-- 标题栏end   -->
    <!--  主体内容插槽start  -->
    <slot :customIndex="customIndex"></slot>
    <!--  主题内容插槽end  -->
  </div>
  <!-- 右上角抽屉菜单start -->
  <a-drawer :contentWrapperStyle="{ backgroundColor: '#1F1F1F' }" :width="120" height="auto" class="drawer"
            :closable="true" placement="bottom" v-model:visible="menuVisible" @close="onClose">
    <div class="ml-4 mb-3 flex flex-row items-center" v-if="sizeList && sizeList.length > 0">
      <div class="mr-4">小组件尺寸</div>
      <HorizontalPanel :navList="sizeList" v-model:selectType="sizeType" bgColor="drawer-item-select-bg">
      </HorizontalPanel>
    </div>
    <hr style="border: none; border-top: 1px solid rgba(255, 255, 255, 0.1)" class="ml-4 mr-4 my-8"
        v-if="sizeList && sizeList.length > 0"/>
    <div class="flex flex-row">
      <div class="option h-24 w-24 ml-4" @click="item.fn()" v-for="item in menuList">
        <Icon class="icon" :icon="item.icon"></Icon>
        {{ item.title }}
      </div>
      <div class="option h-24 w-24 ml-4" @click="removeCard">
        <Icon class="icon" icon="guanbi2"></Icon>
        删除
      </div>
<!--      <div class="option h-24 w-24 ml-4" @click="onCopy"-->
<!--           v-if="options.type.includes('CPU') || options.type.includes('GPU')">-->
<!--        <Icon class="icon" icon="fuzhi"></Icon>-->
<!--        复制数据-->
<!--      </div>-->
    </div>
  </a-drawer>
  <!-- 右上角抽屉菜单end -->
  <!--额外插槽，用于扩展一些不可见的扩展元素start-->
  <slot name="extra">
  </slot>
  <!--额外插槽，用于扩展一些不可见的扩展元素end-->
</template>

<script lang="ts">
import {mapActions, mapWritableState} from "pinia";
import {cardStore} from "../../store/card";
import AidaGuide from "../widgets/supervisory/AidaGuide.vue";
import HorizontalPanel from "../HorizontalPanel.vue";
import _ from "lodash-es";
import {PropType} from "vue";

//组件选项
declare interface IOption {
  //类型，字符串
  type: string,
  //是否显示卡片标题
  noTitle: boolean
}

//菜单项
declare interface IMenuItem {
  //标题
  title: string,
  //函数
  fn: () => void,
  //图标
  icon: string,
}

export default {
  components: {AidaGuide, HorizontalPanel},

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
      default: () => {
      },
    },

  },
  data() {
    return {
      //右上角抽屉菜单可见与否的控制
      menuVisible: false,
      //当前设置的组件尺寸数据，对应着props里的sizeList
      sizeType: {title: "", height: undefined, width: undefined, name: ""},
    };
  },
  computed: {
    ...mapWritableState(cardStore, ["customComponents"]),
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
      let defaultClass = {
        gradient: true,
        "gradient--14": true,
      };
      if (this.customData && this.customData.hideFrame) {
        defaultClass = {};
      }

      let classNameObject = {};
      if (Object.keys(defaultClass).length > 0) {
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
  },

  watch: {
    sizeType: {
      handler() {
        this.increaseCustomComponents(
          this.$parent.customIndex ||
          this.$parent.$parent.customIndex ||
          this.$parent.$attrs.customIndex,
          {
            width: this.sizeType.width,
            height: this.sizeType.height,
          }
        );
      },
    },
  },

  methods: {
    ...mapActions(cardStore, [
      "removeCustomComponents",
      "increaseCustomComponents",
    ]),
    showDrawer() {
      this.menuVisible = true;
    },
    removeCard() {
      this.removeCustomComponents(
        this.$parent.customIndex ||
        this.$parent.$parent.customIndex ||
        this.$parent.$attrs.customIndex
      );
      this.menuVisible = false;
    },
    onSetup() {
      this.menuVisible = false;
    },
    onClose() {
      this.menuVisible = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.no-frame {
  position: relative;
}
</style>