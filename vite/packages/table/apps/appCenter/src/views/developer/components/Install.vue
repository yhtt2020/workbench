<script setup lang="ts">
import { message } from "ant-design-vue";
import { useInstallTTApp, useSelectAll } from "../../../../../ttApp/src/hooks";
import { useTTAppStore } from "../../../../../ttApp/src/store";
const ttappStore: any = useTTAppStore();

const install = async () => {
  let res = await useInstallTTApp();

  // 安装成功
  if (res.code === 200) {
    message.success("安装成功");
    ttappStore.selectAll();
  }
  // manifest.json失败
  else if (res.code > 20 && res.code < 30) {
    message.error("manifest.json错误，请重新配置");
  }
  // 其他失败
  else {
    message.error("文件上传失败请重试");
  }
  console.log("res :>> ", res);
};
</script>

<template>
  <xt-button type="theme" w="95" h="32" radius="8" @click="install">导入应用</xt-button>
</template>
<style lang="scss" scoped></style>
