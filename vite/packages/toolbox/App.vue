<template>
  <a-config-provider :locale="locale">
    <toolsMain></toolsMain>
  </a-config-provider>
</template>

<script>
import zhCN from "ant-design-vue/es/locale/zh_CN";
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
dayjs.locale("zh-cn");
import toolsMain from "./views/main/index.vue";
export default {
  data() {
    return {
      locale: zhCN,
    };
  },
  components: {
    toolsMain,
  },
};
</script>

<style lang="scss" scoped></style>
