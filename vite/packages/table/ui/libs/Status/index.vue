<template>
  <div
    v-if="platform"
    class="flex flex-col justify-center items-center w-full h-full"
  >
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
import { mapWritableState, mapActions } from "pinia";
import cache from "../../../components/card/hooks/cache";
export default {
  name: "XtStatus",
  data() {
    return {
      platform: "",
      ENV_MAP,
    };
  },
  components: {},
  computed: {
    ...mapWritableState(usePermissionStore, ["token", "isGuest", "isSingle", "isOffline"]),
  },
  mounted() {
    if(this.plat) {
      // 平台的屏蔽状态优先级大于工作台登录状态 
      this.platform = this.$usePlat(this.plat);
    }else{
      // 离线模式不需要进行屏蔽 过滤掉
      let status = this.status.filter(item => item !== "offline")
      this.platform = this.$useEnv(status);
    }
  },
  watch: {
    token: {
      handler(val) {
        setTimeout(() => {
          let res = this.$useEnv(this.status);
          this.platform = res;
          if (val) {
            cache.set("isGuest", "");
          }
        }, 1000);
      },
    },
    isGuest: {
      handler() {
        let res = this.$useEnv(this.status);
        this.platform = res;
      },
    },
    isSingle: {
      handler() {
        let res = this.$useEnv(this.status);
        this.platform = res;
      },
    },
    isOffline: {
      handler(val) {
        let res = this.$useEnv(this.status);
        this.platform = res;
      },
    },
  },
  methods: {
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
    plat: {
      type: Array,
      default: "",
    },
  },
};
</script>

<style lang="scss" scoped></style>
