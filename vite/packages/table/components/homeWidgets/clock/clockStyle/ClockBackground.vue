<template>
  <div class="text-base" style="margin-bottom: 10px">背景图片</div>
  <div
    style="
      font-family: PingFangSC-Regular;
      font-size: 16px;
      color: rgba(255, 255, 255, 0.6);
      font-weight: 400;
    "
  >
    支持直接复制粘贴图片到此处
  </div>
  <div
    class="flex flex-row justify-between items-center mt-6"
    style="margin: 12px 0"
  >
    <div
      class="flex justify-center items-center rounded-lg h-12 drawer-item-bg w-1/2 pointer text-base"
      @click="importFile"
    >
      选择图片
    </div>
    <div
      class="flex justify-center items-center rounded-lg h-12 drawer-item-bg w-1/2 ml-3 pointer text-base"
      @click="openMy"
    >
      选自壁纸收藏
    </div>
  </div>
  <ModalList
    v-if="myImgShow"
    v-model:visible="myImgShow"
    title="我的收藏"
    :imgList="myPapers"
    @sendImg="sendImg"
    style="z-index: 99999"
  ></ModalList>
</template>

<script>
import ModalList from "../../../comp/ModalList.vue";
import { paperStore } from "../../../../store/paper";
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
    };
  },
  methods: {
    openMy() {
      this.myImgShow = true;
    },
    sendImg(img) {
      this.myData.img = img;
      console.log("img :>> ", img);
    },
    async importFile() {
      let openPath = await tsbApi.dialog.showOpenDialog({
        title: "选择导入的代码",
        filters: [
          { name: "图片", extensions: ["png", "jpg", "jpeg", "bmp", "gif"] },
          {
            name: "视频",
            extensions: ["mp4", "mpeg", "avi", "rmvb"],
          },
          { name: "全部", extensions: ["*"] },
        ],
        properties: ["multiSelections"],
      });
      if (!openPath) {
        return;
      } else {
        const imgReg = /.(jpg|jpeg|gif|bmp|png)$/; // 匹配图片正则
        const videoReg = /.(mp4|mpeg|avi|rmvb)$/; // 匹配视频正则
        this.myData.img = {};
        const regex = /\.(jpg|jpeg|png|gif)$/i;
        if (regex.test(openPath[0])) {
          this.myData.img.src = openPath[0];
        } else if (videoReg.test(openPath[0])) {
          this.myData.img.srcProtocol = openPath[0];
          this.$nextTick(() => {
            this.$refs.wallpaperVideo.load();
            this.$refs.wallpaperVideo.play().catch((err) => {});
          });
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.gutter-box {
  background-color: #fff;
  background: #2a2a2a;
  border-radius: 12px;
  height: 48px;
  font-family: PingFangSC-Regular;
  font-size: 16px;
  color: rgba(255, 255, 255, 0.85);
  text-align: center;
  font-weight: 400;
  line-height: 48px;
}
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
