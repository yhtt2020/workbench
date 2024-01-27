<template>
  <div @click="a">a11111111111</div>
  <input ref="imgRef" id="aawsdwad" type="file" accept="image/jpg,image/jpeg,image/png" />
  <div @click="a">a11111111111</div>
</template>

<script setup>
import { ref } from "vue";
const imgRef = ref(null);
const a = async () => {
  imgRef.value.click();
console.log('222 :>> ', 222);
  imgRef.value.onchange = function (event) {
    console.log("files[0] :>> ", files[0]);
    // if (this.files.length === 0) return;
    // const file = this.files[0];
    // that.beforeUpload(file);
  };
  return;
  let path = await tsbApi.dialog.showOpenDialog({
    title: "选择",
    message: "请选择文件",
    multiple: "true",
    properties: ["openFile ", "multiSelections"],
  });
  console.log("path :>> ", path);
  // if (path && this.isImageFile(path[0])) {
  //   this.analysis(path[0]);
  // } else {
  //   if (path) message.error("请传入二维码图片！");
  // }
};
</script>

<style lang="scss" scoped></style>
