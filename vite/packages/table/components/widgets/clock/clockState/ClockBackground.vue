<template>
  <div class="text-base" style="margin-bottom: 10px">背景图片</div>
  <div
    class="xt-text"
    style=" font-size: 16px; font-weight: 400"
  >
    支持直接复制粘贴图片到此处
  </div>
  <div
    class="flex flex-row justify-between items-center mt-6 drag"
    style="margin: 12px 0"
  >
    <div
      class="flex justify-center items-center rounded-lg h-12 drawer-item-bg w-1/2 pointer text-base no-drag xt-bg-2"
      @click="importFile"
    >
      选择图片
    </div>
    <div
      class="flex justify-center items-center rounded-lg h-12 drawer-item-bg w-1/2 ml-3 pointer text-base no-drag xt-bg-2"
      @click="openMy"
    >
      选自壁纸收藏
    </div>
  </div>

  <div class="text-base" style="margin-bottom: 10px">背景模糊度</div>
  <a-slider v-model:value="blurs" :max="100" :step="1" class="no-drag" />
  <div class="text-base" style="margin-bottom: 10px">调整时钟比例</div>
  <a-slider v-model:value="zoom" :max="100" :step="1" />
  <ModalList
    v-if="myImgShow"
    v-model:visible="myImgShow"
    title="我的收藏"
    :imgList="myPapers"
    @sendImg="sendImg"
    style="z-index: 99999"
  ></ModalList>
  <input style="display: none" ref="fileRef" type="file" name="" id="" />
</template>

<script>
import ModalList from "../../../comp/ModalList.vue";
import { paperStore } from "../../../../store/paper";
import { message } from "ant-design-vue";

import { validateFile } from "../../../card/hooks/imageProcessing";
import { mapWritableState } from "pinia";
export default {
  computed: {
    ...mapWritableState(paperStore, ["myPapers"]),
  },
  components: {
    ModalList,
  },
  data() {
    return {
      myData: { title: "", link: undefined, img: {} },
      myImgShow: false,
      blurs: 0,
      zoom: 0,
    };
  },
  props: {
    blur: {
      type: String,
      default: 0,
    },
    bgZoom: {
      type: String,
      default: 0,
    },
  },
  mounted() {
    this.blurs = this.blur;
    this.zoom = this.bgZoom;
  },
  watch: {
    blurs(newVal, oldVal) {
      this.$emit("updateBlur", newVal);
    },
    zoom(newVal, oldVal) {
      this.$emit("updateBgZoom", newVal);
    },
  },
  methods: {
    openMy() {
      this.myImgShow = true;
    },
    sendImg(img) {
      this.myData.img = img;
      this.$emit("img", img.path);
    },
    async importFile() {
      let fileRef = this.$refs.fileRef;
      // 点击上传图片按钮
      fileRef.click();
      // 上传图片回调
      let that = this;
      fileRef.onchange = async function () {
        if (this.files.length === 0) return; // 没有选择文件
        const file = this.files[0]; // 获取文件
        let validate = validateFile(file, 10);
        if (validate !== true) return message.error(validate);
        that.$emit("img", file.path);
      };
    },
    async showOpenFileDialog() {
      let savePath = await tsbApi.dialog.showOpenDialog({
        title: "选择",
        message: "请选择文件",
        properties: ["openFile "],
      });
      if (savePath) {
      } else {
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.flex {
  background: var(--primary-bg);
  border-radius: 5px;
}

.gutter-box {
  background-color: #fff;
  background: #2a2a2a;
  border-radius: 12px;
  height: 48px;

  font-size: 16px;
  color: rgba(255, 255, 255, 0.85);
  text-align: center;
  font-weight: 400;
  line-height: 48px;
}

// 1
.clock-box {
  margin: 10px 0;
  box-sizing: border-box;
  position: relative;
  padding: 10px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 12px;
}

.clock {
  height: 150px;
  position: relative;

  :deep(.clock3) {
    transform: scale(0.34, 0.34);
    position: absolute;
    top: -105px;
    left: 40px;
  }
}
</style>
