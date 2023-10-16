<template>
  <!-- 已作废 -->
  <!-- 遮罩 -->
  <div
    class="h-full w-full xt-mask fixed top-0 left-0 ring-0 bottom-0"
    style="z-index: 999"
    @click.stop.self="close()"
    v-if="currentType == 'popup' && modelValue"
  ></div>

  <div
    class="xt-text flex"
    :class="[typeStyle, boxClass, currentType == 'popup' ? '' : 'h-full']"
    style="z-index: 9999; box-sizing: border-box"
    v-if="modelValue"
  >
    <!-- 左侧区域开始 -->
    <div>
      <slot name="left"></slot>
    </div>
    <!-- 左侧区域结束 -->
    <div class="h-full flex-grow flex flex-col">
      <!-- 头部区域开始 -->
      <div class="flex items-center relative">
        <div
          class="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 text-lg"
          v-if="title"
        >
          {{ title }}
        </div>
        <div class="flex-1">
          <!-- 头部插槽 -->
          <slot name="header"></slot>
        </div>
        <XtIcon
          class="no-darg"
          v-if="currentType == 'popup'"
          icon="guanbi1"
          :class="setSpacing('ml')"
          @click="close()"
        >
        </XtIcon>
        <XtIcon
          v-if="showFull"
          :icon="isFull ? 'quxiaoquanping_huaban' : 'quanping_huaban'"
          :class="setSpacing('ml')"
          @click="fullScreenClick()"
        >
        </XtIcon>
      </div>
      <!-- 头部区域结束 -->
      <!-- 主体区域开始 -->
      <!-- flex-grow overflow-hidden overflow-y-auto -->
      <div class="xt-scrollbar" :class="setSpacing('mt')">
        <!-- 主体插槽 -->
        <slot></slot>
      </div>
      <!-- 主体区域结束 -->
    </div>
  </div>
</template>

<script>
export default {
  name: "XtFullScreen",
  props: {
    boxClass: {},
    visible: {
      default: true,
    },
    modelValue: {
      default: true,
    },
    title: {
      default: "",
    },
    showFull: {
      default: true,
    },
    spacing: {
      type: String,
      default: 3,
    },
    // 用于标记布局是默认还是弹窗
    type: {
      type: String,
      default: "default",
      validator: (val) => {
        if (val !== "default" && val !== "popup") {
          console.error("type  必须是 default 或 popup");
          return false;
        }
        return true;
      },
    },
    full: {
      default: false,
    },
  },
  data() {
    return {
      isFull: this.full,
      currentType: this.type,
    };
  },
  watch: {
    isFull(newV) {
      this.$emit("update:full", newV);
    },
    full(newV) {
      this.isFull = newV;
    },
  },
  computed: {
    typeStyle() {
      let typeList = {
        default: " rounded-xl xt-bg ",
        popup:
          "fixed top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 rounded-xl xt-modal  xt-shadow ",
        full: "fixed left-0 right-0 top-0 bottom-0 xt-modal ",
      };
      let type = typeList[this.currentType] ?? typeList["default"];
      let p = this.setSpacing("p");
      return type + p;
    },
  },
  mounted() {
    window.addEventListener("keydown", this.handleEscKeyPressed, {
      capture: true,
    });
  },
  beforeDestroy() {
    window.removeEventListener("keydown", this.handleEscKeyPressed, {
      capture: true,
    });
  },
  methods: {
    handleEscKeyPressed(event) {
      if (event.keyCode === 27) {
        this.close();
      }
    },
    close() {
      this.$emit("update:modelValue", false);
      this.$emit("close");
    },
    setSpacing(name) {
      return name + "-" + this.spacing;
    },
    fullScreenClick() {
      this.isFull = !this.isFull;
      this.currentType = this.isFull ? "full" : this.type;
      // 可以通过v-model:full="你的变量" 监控全屏切换状态
      this.$emit("update:full", this.isFull);
    },
  },
};
</script>

<style lang="scss" scoped></style>
