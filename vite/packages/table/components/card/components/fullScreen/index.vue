<template>
  <div
    class="xt-text flex h-full"
    :class="[modelStyle]"
    style="z-index: 99999; box-sizing: border-box"
  >
    <!-- 左侧区域开始 -->
    <div :class="setSpacing('mr')">
      <slot name="left"></slot>
    </div>
    <!-- 左侧区域结束 -->
    <div class="h-full flex-grow flex flex-col">
      <!-- 头部区域开始 -->
      <div class="flex items-center">
        <div class="flex-1">
          <!-- 头部插槽 -->
          <slot name="header"></slot>
        </div>
        <div
          class="xt-btn w-12 h-12 cursor-pointer"
          :class="setSpacing('ml')"
          @click="fullScreenClick()"
        >
          <Icon
            :icon="isFull ? 'quxiaoquanping_huaban' : 'quanping_huaban'"
            style="font-size: 26px"
          ></Icon>
        </div>
      </div>
      <!-- 头部区域结束 -->
      <!-- 主体区域开始 -->
      <div
        class="flex-grow h-full overflow-hidden overflow-y-auto xt-scrollbar"
        :class="setSpacing('mt')"
      >
        <!-- 主体插槽 -->
        <slot></slot>
      </div>
      <!-- 主体区域结束 -->
    </div>
  </div>
</template>

<script>
export default {
  props: {
    spacing: {
      type: String,
      default: 3,
    },
    // 用于标记布局是默认还是弹窗
    model: {
      type: String,
      default: "default",
      validator: (val) => {
        if (val !== "default" && val !== "popup") {
          console.error("model  必须是 default 或 popup");
          return false;
        }
        return true;
      },
    },
  },
  data() {
    return {
      isFull: false,
      currentModel: this.model,
    };
  },
  computed: {
    modelStyle() {
      let modelList = {
        default: " rounded-xl xt-bg ",
        popup:
          "fixed top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 rounded-xl xt-modal ",
        full: "fixed left-0 right-0 top-0 bottom-0 xt-modal ",
      };
      let model = modelList[this.currentModel] ?? modelList["default"];
      let p = this.setSpacing("p");
      return model + p;
    },
  },
  methods: {
    setSpacing(name) {
      return name + "-" + this.spacing;
    },
    fullScreenClick() {
      this.isFull = !this.isFull;
      this.currentModel = this.isFull ? "full" : this.model;
      // 可以通过v-model:full="你的变量" 监控全屏切换状态
      this.$emit("update:full", this.isFull);
    },
  },
};
</script>

<style lang="scss" scoped></style>
