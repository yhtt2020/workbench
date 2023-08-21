<template>
  <!-- 早期组件已经很烂了 得重构 -->
  <div
    class="w-full flex items-center justify-center flex-col" style="height: 95%;"
    v-if="web"
  >
    <div class="mb-2">前往工具台体验完整功能</div>
    <XtButton @click="webClick()">下载</XtButton>
  </div>
  <div
    v-else
    class="controller-state w-full"
    :class="bg"
    :style="[
      {
        width: window.w,
        height: window.h,
      },
    ]"
    v-if="state !== ''"
  >
    <img
      :style="{ zoom: `${zoom}%` }"
      :src="`/public/img/state/${state}.png`"
      alt=""
    />
    <div>{{ text[`${state}`] }}</div>
    <template v-if="state !== 'null' && btn !== ''">
      <!-- 按钮控制有两种：1、插槽 2、回调 -->
      <slot :row="{}">
        <div class="click no-drag" @click="onClick()">
          {{ btn[`${state}`] }}
        </div>
      </slot>
    </template>
  </div>
</template>

<script>
export default {
  name: "XtState",
  props: {
    // 显示的状态
    state: {
      type: String,
      default: "init",
    },
    // 显示的窗口大小 两种方式 1、外部定义宽高 2、传递window对象
    window: {
      type: Object,
      default: () => {
        return {
          w: "100%",
          h: "100%",
        };
      },
    },
    // 显示的图片大小
    zoom: {
      type: Number,
      default: 40,
    },
    // 显示的文本内容
    text: {
      type: Object,
      default: () => {
        return {
          init: "请先绑定", // 初始化
          null: "暂无数据", // 空数据
          false: "加载失败", // 失败
        };
      },
    },
    // 显示的文本内容
    btn: {
      type: Object,
      default: () => {
        return {
          init: "绑定", // 初始化
          false: "刷新", // 失败
        };
      },
    },
    // 背景 原先默认值 xt-bg 现在下方到class直接添加
    bg: {
      type: String,
      default: "",
    },
    web: {
      default: false,
    },
  },
  mounted() {},
  methods: {
    onClick() {
      this.$emit("onClick");
    },
    webClick() {
      window.open("https://www.apps.vip/download/");
    },
  },
};
</script>

<style lang="scss" scoped>
.controller-state {
  color: var(--primary-text);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  text-align: center;
  border-radius: 10px;
}
img {
  margin-bottom: 22px;
}
.click {
  margin-top: 10px;
  padding: 13px 26px;
  background: var(--primary-bg);
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background: var(--active-bg);
  }
}
</style>
