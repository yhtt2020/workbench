<template>
  <div @contextmenu.stop="showDrawer" :class="classes"
       style=" background: var( --primary-bg); color: var(--primary-text)"
       :style="{
      display: options.hide == true ? 'none' : '',
      width: customSize.width,
      height: customSize.height,
    }" @mouseleave="onMouseOut" @mouseenter="onMouseOver">

    <!--标题栏start-->
    <slot name="cardTitle">
      <div :class="options.noTitle === true ? 'no-title' : 'content-title'" class="flex items-center justify-between">
        <div class="left-title" v-if="options.noTitle !== true">
          <slot name="left-title"></slot>
          <Icon :icon="options.icon" class="title-icon"></Icon>
          <div class="w-2/3 flex">{{ options.title }}
            <slot name="left-title" v-if="options.rightIcon">
              <div class="right-icon">
                <MyIcon class="pointer" :icon="options.rightIcon"></MyIcon>
              </div>
            </slot>
          </div>
        </div>
        <div class="z-10 right-title"  v-if="showRightIcon" @click.stop="showDrawer" @contextmenu.stop="showDrawer">
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
    <div class="flex flex-row items-center mb-3 ml-4" v-if="sizeList && sizeList.length > 0">
      <div class="mr-4">小组件尺寸</div>
      <HorizontalPanel :navList="sizeList" v-model:selectType="sizeType" bgColor="drawer-item-select-bg">
      </HorizontalPanel>
    </div>
    <hr style="border: none; border-top: 1px solid rgba(255, 255, 255, 0.1)" class="my-8 ml-4 mr-4"
        v-if="sizeList && sizeList.length > 0"/>
    <div class="flex flex-row">
    <!-- 根据任务需求 抽离了底部选择区 -->
    <BottomEdit :menuList="menuList" @close="menuVisible = false"/>
      <slot name="menuExtra"></slot>
      <div class="w-24 h-24 ml-4 option" @click="doRemoveCard">
        <Icon class="icon" icon="guanbi2"></Icon>
        删除
      </div>
      <!--      <div class="w-24 h-24 ml-4 option" @click="onCopy"-->
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
import HorizontalPanel from "../HorizontalPanel.vue";
import _ from "lodash-es";
import {PropType} from "vue";
import {Icon as MyIcon} from '@iconify/vue';
import BottomEdit from "./BottomEdit.vue";
//组件选项
declare interface IOption {
  //类型，字符串
  type: string,
  //是否显示卡片标题
  noTitle: boolean,
  // 是否隐藏组件
  hide?: boolean
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
  components: {HorizontalPanel},

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
    desk: {
      type: Object,
      required: true
    },
    //是否显示右上角的图标
    showRightIcon: {
      type: Boolean,
      default: true
    }
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
      //默认的对象
      let defaultClass = {
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
    } else {

    }

  },

  watch: {
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
    size: {
      handler(newVal) {
      }
    }
  },

  methods: {
    ...mapActions(cardStore, [
      "removeCard",
      "updateCustomData",
    ]),
    showDrawer() {
      this.menuVisible = true;
    },
    doRemoveCard() {
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
    hideMenu(){
      this.menuVisible=false
    }
  },
};
</script>

<style lang="scss" >
.no-frame {
  background: none !important;
  .no-title{
    position: absolute;
    right: 20px;top: 10px;
    z-index: 99;
  }
  position: relative;
}


  .cardTitle .right-icon svg{
    position: relative;
    left: -10px;
    top: 3px;
      width: 20px;
      height: 20px;
  }
</style>
