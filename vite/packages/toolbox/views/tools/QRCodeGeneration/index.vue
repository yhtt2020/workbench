<template>
  <div class="w-full h-full flex">
    <div class="flex-1 flex flex-col mr-3">
      <div class="flex-grow flex mb-3">
        <XtTextarea v-model:data="text"></XtTextarea>
      </div>
      <div class="flex">
        <XtButton class="mb-3 mx-3" style="width: 100%" @click="clear()"
          >清除</XtButton
        >
        <XtButton
          type="theme"
          class="mb-3"
          style="width: 100%"
          @click="newQRCode()"
          >生成</XtButton
        >
      </div>
      <div class="flex">
        <div class="flex flex-col mr-3 justify-center items-center">
          <XtTitle style="margin: 0">二维码颜色</XtTitle>
          <XtBaseColor v-model:data="color"></XtBaseColor>
        </div>
        <div class="flex flex-col items-center">
          <XtTitle style="margin: 0">背景色</XtTitle>
          <XtBaseColor v-model:data="bgColor"></XtBaseColor>
        </div>
      </div>
      <div class="mb-1">大小 (px)</div>
      <a-slider
        id="test"
        v-model:value="size"
        :min="90"
        :max="220"
        :disabled="disabled"
      />
    </div>
    <div class="flex-1">
      <div
        v-if="src"
        class="w-full h-full xt-bg-2 xt-border rounded-xl flex flex-col p-3"
      >
        <div class="flex-grow flex mb-3 xt-base-btn">
          <!-- <canvas id="qrcode-canvas"></canvas> -->
          <img :src="src" alt="" />
        </div>

        <XtButton type="theme" style="width: 100%" @click="download()"
          >下载</XtButton
        >
      </div>
      <div
        v-else
        class="w-full h-full xt-bg-2 rounded-xl p-2 xt-base-btn xt-border"
      >
        <div style="width: 50%">请在上方输入内容后点击生成，在此处预览</div>
      </div>
    </div>
  </div>
</template>

<script>
import QRCode from "qrcode";

export default {
  data() {
    return {
      text: "",
      size: 90,
      color: "",
      bgColor: "",
      src: "",
    };
  },
  methods: {
    async newQRCode() {
      try {
        const options = {
          e: "M", //容错级别
          width: this.size,
          height: this.size,
          margin: 1,
          color: {
            dark: this.color, // 像素点颜色
            light: this.bgColor, // 背景色
          },
        };
        const url = await QRCode.toDataURL(this.text, options);

        this.base64 = url;

        this.src = url;
      } catch (error) {
        console.error("Error generating QR Code:", error);
      }
    },
    clear() {
      this.src = "";
    },
    async download() {
      let filters = { name: "图片", extensions: ["png"] };
      let savePath = await tsbApi.dialog.showSaveDialog({
        title: "选择保存位置",
        defaultPath: "二维码",
        message: "选择保存的位置",
        filters: [filters],
        properties: ["createDirectory", "showOverwriteConfirmation"],
      });
      const base64 = this.base64;
      function dataURLToBlob(fileDataURL) {
        let arr = fileDataURL.split(","),
          mime = arr[0].match(/:(.*?);/)[1],
          bstr = atob(arr[1]),
          n = bstr.length,
          u8arr = new Uint8Array(n);
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], { type: mime });
      }
      require("fs").writeFile(
        savePath,
        Buffer.from(await dataURLToBlob(base64).arrayBuffer()),
        (err) => {
          if (err) throw err;
          console.log("The file has been saved!");
        }
      );
    },
  },
};
</script>

<style lang="scss" scoped>
:deep(.zs-color-picker-panel__visible) {
  position: absolute;
  top: -280% !important;
}
:deep(.zs-color-picker-panel) {
  position: absolute;
  top: -280% !important;
}
</style>
