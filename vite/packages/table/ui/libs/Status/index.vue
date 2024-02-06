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
        class="mt-4 font-14 xt-text-2"
        :style="{ fontSize: fontSize }"
      >
        {{ name }} 在 {{ ENV_MAP[plat] }} 下不可用
      </div>
    </div>
  </div>
</template>

<script>
import { ENV_MAP } from "../../../permission/config";
export default {
  name: "XtStatus",
  data() {
    return {
      plat: "",
      ENV_MAP,
    };
  },
  components: {},
  mounted() {
    this.plat = this.$useEnv(this.status);
    console.log("ENV_MAP :>> ", ENV_MAP);
    console.log("this.status :>> ", this.status);
    console.log(" this.plat  :>> ", this.plat);
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
      default: "",
    },
  },
};
</script>

<style lang="scss" scoped></style>
