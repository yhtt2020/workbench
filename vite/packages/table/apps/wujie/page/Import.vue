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
import { message } from "ant-design-vue";
import { nanoid } from "nanoid";
import {
  folderExists,
  folderCreate,
  getCurrentDir,
  readFile,
  deleteFile,
} from "./useFile";
// vite\packages\table\components\card\hooks\base64.js
const imgRef = ref(null);

const getFileExtension = (filePath) => {
  const compressedTypes = ["zip", "rar", "7z", "json"];
  const fileExtension = filePath.split(".").pop() || "";
  return compressedTypes.includes(fileExtension);
};
const a = async () => {
  // imgRef.value.click();
  // imgRef.value.onchange = function (event) {
  //   console.log("files[0] :>> ", files[0]);
  // };

  let path = await tsbApi.dialog.showOpenDialog({
    title: "选择",
    message: "请选择文件",
    multiple: "true",
    properties: ["openFile", "multiSelections"],
  });

  // 未上传
  if (!path) return;
  let filePath = path[0];
  // 后缀名错误
  if (!getFileExtension(filePath)) return message.error("上传的文件类型错误");

  // 解压

  // 判断包含文件

  // 读取核心文件
  let res = require("fs").readFileSync(filePath, "utf-8");
  res = JSON.parse(res);
  if (typeof res !== "object") return message.error("上传的文件数据错误");
  if (!res.page) return message.error("上传的文件数据错误");

  // 是否创建文件夹路径
  let temporaryFolderName = "ttapp_test";
  if (!(await folderExists(temporaryFolderName))) {
    await folderCreate(temporaryFolderName);
  }

  // 先临时用时间做ID
  const id = Date.now();
  let folderName = [temporaryFolderName, res.name + id];
  folderCreate(folderName);

  // 需要检测的文件路径
  let checkFilePath = ["manifest.json", res.page];
  let checkRes = [];
  // 校验路径是否存在
  for (let path of checkFilePath) {
    let res = await folderExists([...folderName, path]);
    if (!res) {
      checkRes.push(path);
    }
  }

  // 检查不通过
  console.log("checkRes.length  :>> ", checkRes.length);
  if (checkRes.length > 0) {
    deleteFile(folderName);
    checkRes.forEach((item) => {
      message.error("缺失 " + item + " 文件");
    });

    return;
  }
  // 应该是遍历所有文件数据进行存放 或者 解压时就处于目录了

  // 建立对应表
  /**
   * 1 文件夹路径
   * 2 ID
   */

  // 是否需要帮他打开文件夹 告诉文件夹位置

  //
  return;

  // if (path && this.isImageFile(path[0])) {
  // }
  // if (path && this.isImageFile(path[0])) {
  //   this.analysis(path[0]);
  // } else {
  //
  // }

  // console.log("res :>> ", res);

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
