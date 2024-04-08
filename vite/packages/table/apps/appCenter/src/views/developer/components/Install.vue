<script setup lang="ts">
import { message } from "ant-design-vue";
import { useInstallTTApp, useSelectAll } from "../../../../../ttApp/src/hooks";
import { useTTAppStore } from "../../../../../ttApp/src/store";
import { storeToRefs } from "pinia";
import { getAppImg } from "../../../../../ttApp/src/hooks/getAppImg";
import { da } from "date-fns/locale";
import { de } from "date-fns/locale";
import { clone } from "lodash";

const ttappStore: any = useTTAppStore();
const { ttappList } = storeToRefs(ttappStore);
const install = async () => {
  let res = await useInstallTTApp();
  // 安装成功
  const { data, code } = res;
  if (code === 200) {
    const { modules, ...restData } = data; // 使用解构赋值取出modules和其他属性
    let currentData = {
      ...restData, // 剩余的属性（除了modules）
      ...modules, // 单独解构modules属性
    };

    // 处理logo路径
    const logo = getAppImg(currentData.id, currentData.logo);
    currentData._logo = logo;
    // 如果有main模块
    if (currentData.main) {
      // 处理main路径
      currentData.main._url = `ttapp://${data.id}/${currentData.main.entry}`;
    }
    // 如果有card模块
    if (currentData.card) {
      // 处理card路径
      currentData.card._url = `ttapp://${data.id}/${currentData.card.entry}`;
      // 处理card预览图路径
      currentData.card._preview = getAppImg(
        currentData.id,
        currentData.card.preview
      );
    }
    console.log("currentData :>> ", currentData);
    message.success("安装成功");
    ttappList.value.push(currentData);
  }
  // manifest.json失败
  else if (res.code > 20 && res.code < 30) {
    message.error("manifest.json错误，请重新配置");
  }
  // 其他失败
  else {
    message.error("文件上传失败请重试");
  }
};
</script>

<template>
  <xt-button type="theme" w="95" h="32" radius="8" @click="install">
    导入应用
  </xt-button>
</template>
<style lang="scss" scoped></style>
