<template>
  <div @click="a">a11111111111</div>
  <input
    ref="imgRef"
    id="aawsdwad"
    type="file"
    accept="image/jpg,image/jpeg,image/png"
  />
  <div @click="a">a11111111111</div>
</template>

<script setup>
import { ref } from "vue";

import { folderExists, folderCreate, getCurrentDir } from "./useFile";
// vite\packages\table\components\card\hooks\base64.js
const imgRef = ref(null);
const a = async () => {
  let res1 = await folderExists("xxx");
  console.log(" res :>> ", res1);
  // folderCreate("xxx");
  // getCurrentDir();
  // return;
  return;
  imgRef.value.click();
  imgRef.value.onchange = function (event) {
    console.log("files[0] :>> ", files[0]);
  };
  return;

  let path = await tsbApi.dialog.showOpenDialog({
    title: "选择",
    message: "请选择文件",
    multiple: "true",
    properties: ["openFile ", "multiSelections"],
  });
  // console.log("path :>> ", path);

  let res = require("fs").readFileSync(path[0], "utf-8");
  console.log("res :>> ", res);
  // if (path && this.isImageFile(path[0])) {
  //   this.analysis(path[0]);
  // } else {
  //   if (path) message.error("请传入二维码图片！");
  // }

  /**
   * 1 读取文件
   *
   * 2 判断类型
   *
   * 2.1 压缩包
   *     2.1.1 解压
   *     2.1.2 读取文件
   *
   * 2.2 图片
   *     2.2.1 读取文件
   *     2.2.2 生成base64
   *
   *
   * 2.3 视频
   */
};
</script>

<style lang="scss" scoped></style>
