<template>
  <div
    class="flex flex-row p-1 rounded-lg"
    :class="bgColor"
    :style="{ height: itemHeight }"
    style="background: var(--secondary-bg)"
  >
    <div
      v-for="(item, index) in navList"
      :style="btnStyle"
      class="relative flex items-center h-full rounded-lg nav-box panel-icon btn-active pointer"
      @click.stop="clickNav(item, index)"
      :class="activeIndex === index ? 'xt-active-btn' : ''"
    >
      <div :class="activeIndex === index ? 'round-dot' : 'circle'"></div>
      <span
        class="flex justify-center panel-title "
        style="flex: 1; " :style="{ color: activeIndex === index ? 'rgba(255,255,255,0.85)' : 'var(--primary-text)' }"
        >{{ item.title }}</span>
      <div v-if="item.state === true" class="ml-2 state-dot"></div>
    </div>
  </div>
</template>
dd

<script>
export default {
  name: "RadioTab",
  props: {
    //单选导航列表
    navList: {
      type: Array,
      default: () => [],
    },
    // 当前选中的内容
    selectType: {
      type: Object,
      default: () => {},
    },
    //背景颜色
    bgColor: {
      type: String,
      default: "active-item",
    },
    //导航的高
    height: {
      type: Number,
      default: 48,
    },
    //按钮的样式
    btnStyle: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      activeIndex: 0,
    };
  },
  computed: {
    itemHeight() {
      return this.height + "px";
    },
  },
  watch: {
    selectType: {
      handler() {
        this.posType();
      },
    },
  },
  mounted() {
    this.posType();
  },
  methods: {
    posType() {
      if (this.selectType) {
        if (this.selectType.name && this.navList.length > 0) {
          this.activeIndex = this.navList.findIndex((item) => {
            return item.name === this.selectType.name;
          });
        }
      }
    },
    clickNav(item, index) {
      this.activeIndex = index;
      item.state = false; // 将消息未读状态隐藏
      this.$emit("update:selectType", item);
    },
  },
};
</script>

<style scoped>
.state-dot {
  width: 8px;
  height: 8px;
  background: #ff4d4f;
  border-radius: 4px;
}
.active-item {
  color: var(--active-text);
  background: var(--active-bg);
}
.nav-box {
  width: 50%;
  padding: 0 20px;
}
::v-deep .xt-active-btn {
  justify-content: start;
}
.circle {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: none;
  border: 2px solid var(--active-bg);
}
</style>
