<template>
  <div class="flex justify-center items-center w-full h-full">
    <!-- xt-bg-t-2 -->
    <div>
      <div class="flex justify-center">
        <xt-new-icon
          icon="fluent:plug-disconnected-16-regular"
          :size="imgSize"
          color="color: var(--secondary-text);"
        ></xt-new-icon>
      </div>
      <div
        class="mt-4"
        :style="{ fontSize: fontSize }"
        style="font-size: 14px; color: var(--secondary-text)"
      >
        {{ name }}在{{ plat }}下不可用
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "XtStatus",
  data() {
    return {
      plat: "",
    };
  },
  components: {},
  mounted() {
    this.plat = window.$useEnv(this.status);
  },
  watch: {},
  props: {
    // 元素名称
    name: {
      type: String,
      default: "帕鲁",
    },
    // 平台名称
    // plat: {
    //   type: String,
    //   default: '上班时间',
    // },
    // 文字大小
    fontSize: {
      type: Number,
      default: 40,
    },
    // 图片大小
    imgSize: {
      type: Number,
      default: 100,
    },
    status: {
      type: Array,
      default: '',
    },
  },
};
</script>

<style lang="scss" scoped></style>
