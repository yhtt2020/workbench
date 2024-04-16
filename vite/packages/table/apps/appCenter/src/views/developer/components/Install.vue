<script setup lang="ts">
import { message } from "ant-design-vue";
import { useInstallTTApp } from "../../../../../ttApp/src/hooks";
import { useTTAppStore } from "../../../../../ttApp/src/store";
import { storeToRefs } from "pinia";
import { getAppImg } from "../../../../../ttApp/src/hooks/getAppImg";
import { nanoid } from "nanoid";

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
      let entry = currentData.main.entry;
      if (entry.charAt(0) == "/") {
        currentData.main._entry = `ttapp://${data.id}/${currentData.main.entry}`;
      } else {
        currentData.main._entry = entry;
      }
    }
    // 如果有card模块
    if (currentData.card) {
      let card = currentData.card;
      card.map((item) => {
        item.id = nanoid(4);
        item.parentId = data.id;
        // 处理card路径
        let entry = item.entry;
        if (entry.charAt(0) == "/") {
          item._entry = `ttapp://${currentData.id}/${item.entry}`;
        } else {
          item._entry = entry;
        }
        // 处理card预览图路径
        item._preview = getAppImg(currentData.id, item.preview);
        return item;
      });
    }
    console.log("currentData :>> ", currentData);
    message.success("安装成功");
    ttappList.value.push(currentData);
  }
  // manifest.json失败
  else if (code > 20 && code < 30) {
    console.log("data :>> ", data);
    message.error(data);
  }
  // 其他失败
  else {
    message.error("文件上传失败请重试");
  }
  console.log("data :>> ", data);
};
</script>

<template>
  <xt-button type="theme" w="95" h="32" radius="8" @click="install">
    导入应用
  </xt-button>
</template>
<style lang="scss" scoped></style>
