<template>
  <div class="w-full h-full flex">
    <div class="flex-1 flex flex-col mr-3">
      <div class="flex-grow flex mb-3">
        <XtTextarea v-model:data="text"></XtTextarea>
      </div>
      <div class="flex mb-2">
        <XtButton class=" mr-3" style="width: 100%" @click="clear()"
          >清除</XtButton
        >
        <XtButton
          type="theme"
          style="width: 100%"
          @click="newQRCode()"
          >生成</XtButton
        >
      </div>
      <div class="flex">
        <div class="flex flex-col mr-3 justify-center items-center">
          <div class="mb-2">二维码颜色</div>
          <XtBaseColor v-model:data="color"></XtBaseColor>
        </div>
        <div class="flex flex-col items-center">
          <div class="mb-2">背景色</div>
          <XtBaseColor v-model:data="bgColor"></XtBaseColor>
        </div>
      </div>
      <div class="my-1">大小 (px)</div>
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
          <img :src="src" alt="" />
        </div>

        <XtButton type="theme" style="width: 100%" @click="download()"
          >下载</XtButton
        >
      </div>
      <div
        v-else
        class="w-full h-full xt-bg-2 rounded-xl p-2 xt-base-btn xt-border flex-col"
        @click="uploadFile()"
        @drop="drop"
        @dragover.prevent
        @dragenter.prevent
        @dragleave.prevent
      >
        <div style="width: 50%">请在左侧输入内容后点击生成，在此处预览</div>
        <div style="width: 50%">点击或拖拽二维码到此区域可进行解析</div>
      </div>
    </div>
  </div>
</template>

<script>
import QRCode from "qrcode";
import jsQR from "jsqr";
import { message } from "ant-design-vue";
import { QRCodeGeneration } from "../../../store/QRCodeGeneration";
import { mapWritableState } from "pinia";

export default {
  data() {
    return {
      size: 90,
      color: "#000",
      bgColor: "#fff",
      src: "",
    };
  },
  computed: {
    ...mapWritableState(QRCodeGeneration, ["text"]),
  },
  methods: {
    analysis(path) {
      const canvasElement = document.createElement("canvas");
      var image = new Image();
      image.src = path;
      const taht = this;
      image.onload = function () {
        canvasElement.width = image.width;
        canvasElement.height = image.height;
        const canvasWidth = image.width;
        const canvasHeight = image.height;

        const canvas = canvasElement.getContext("2d");
        canvas.drawImage(image, 0, 0);
        const imageData = canvas.getImageData(
          0,
          0,
          canvasWidth,
          canvasHeight
        ).data;
        const code = jsQR(imageData, canvasWidth, canvasHeight);
        if (code) {
          taht.text = code.data;
        } else {
          message.error("解析失败 请重试");
        }
      };
    },
    isImageFile(file) {
      const allowedExtensions = [".png", ".jpg", ".jpeg", ".gif"];
      const fileExtension = file.substring(file.lastIndexOf(".")).toLowerCase();
      return allowedExtensions.includes(fileExtension);
    },
    drop(e) {
      let files = e.dataTransfer.files;
      if (files && this.isImageFile(files[0].path)) {
        this.analysis(files[0].path);
      } else {
        message.error("请传入二维码图片！");
      }
    },
    async uploadFile() {
      let path = await tsbApi.dialog.showOpenDialog({
        title: "选择",
        message: "请选择文件",
        multiple: "true",
        properties: ["openFile ", "multiSelections"],
      });
      if (path && this.isImageFile(path[0])) {
        this.analysis(path[0]);
      } else {
        if (path) message.error("请传入二维码图片！");
      }
    },

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
  top: -220px !important;
  right: -215px !important;
}
:deep(.zs-color-picker-panel) {
  position: absolute;
  top: -220px !important;
}
</style>
