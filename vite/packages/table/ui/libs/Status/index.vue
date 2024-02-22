<template>
  <div v-if="plat" class="flex flex-col justify-center items-center w-full h-full">
    <div class="flex justify-center">
      <xt-new-icon
        icon="fluent:plug-disconnected-16-regular"
        :size="imgSize"
        color="color: var(--secondary-text);"
      ></xt-new-icon>
    </div>
    <div class="mt-4 font-14 xt-text-2" :style="{ fontSize: fontSize }">
      {{ name }} 在 {{ ENV_MAP[plat] }} 下不可用
    </div>
  </div>
  <slot v-else></slot>
</template>

<script>
import { ENV_MAP } from "../../../permission/config";
import { usePermissionStore } from "../../../permission/store";
import { mapWritableState } from "pinia";

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
  },
  watch: {
    token: {
      handler(val) {
        setTimeout(() => {
          let res = this.$useEnv(this.status);
          console.log("current res :>> ", res);
          this.plat = res;
        }, 1000);
      },
    },
  },
  props: {
    // 元素名称
    name: {
      type: String,
      default: "帕鲁",
    },
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
  computed: {
    ...mapWritableState(usePermissionStore, ["token"]),
  },
};
</script>

<style lang="scss" scoped></style>
