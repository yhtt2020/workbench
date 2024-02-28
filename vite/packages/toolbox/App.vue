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
import { main } from "./store/main";
import {mapWritableState} from 'pinia'

export default {
  data() {
    return {
      locale: zhCN,
    };
  },
  components: {
    toolsMain,
  },
  computed: {
    ...mapWritableState(main, ["autoHide"]),
  },
  mounted () {
    window.addEventListener('blur', () => {
      if(this.autoHide){
        tsbApi.window.hide()
      }
    })
  }
};
</script>

<style lang="scss" scoped></style>
