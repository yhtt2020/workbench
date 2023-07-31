<template>
  <XtColor v-model:color="bg"></XtColor>
  {{ bg }}
  <img :src="imgSrc" alt="" />
  <input style="display: none" ref="fileRef" type="file" name="" id="" />
  <XtButton @click="uploadImg()">123</XtButton>
</template>

<script>
import QRCode from "qrcode";
import "colorpicker-v3/style.css";
import { ref } from "vue";
export default {
  data() {
    return {
      imgSrc: "",
      bg: "",
    };
  },
  mounted() {
    // 配置选项
    const options = {
      error: "H",

      bordered: false, // 无效
      width: 128, //图像宽度
      height: 128, //图像高度
      color: {
        dark: "#FFF", // 像素点颜色
        light: "#000", // 背景色
      },

      scale: 0,
      backgroundColor: "#FFFF00",
    };

    QRCode.toDataURL("https://www.free-api.com/?page=6", options)
      .then((url) => {
        this.imgSrc = url;
      })
      .catch((err) => {
        console.error(err);
      });
  },
  methods: {
    uploadImg() {
      let fileRef = this.$refs.fileRef;
      // 点击上传图片按钮
      fileRef.click();
      // 上传图片回调
      let that = this;
      fileRef.onchange = async function () {
        if (this.files.length === 0) return; // 没有选择文件
        const file = this.files[0]; // 获取文件
        console.log("file :>> ", file);
        try {
          const url = await QRCode.toDataURL(file.path, {
            e: "H", //容错级别
          });
          console.log("QR Code Data URL:", url);
          that.imgSrc = url;
        } catch (error) {
          console.error("Error generating QR Code:", error);
        }
      };
    },
  },
};
</script>

<style lang="scss" scoped></style>
