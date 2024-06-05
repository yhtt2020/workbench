<template>
  <xt-container
    v-model:customSize="customData.customSize"
    :header="header"
    :customIndex="customIndex"
    :options="options"
    :menuList="menuList"
    ref="customAssembly"
    :custom-data="customData"
    :desk="desk"
    @delete="deleteCard"
  >
    <div
      v-if="Object.keys(myData.img).length > 0"
      class="absolute inset-0"
      style="
        border-radius: 8px;
        z-index: 1;
        left: -14px;
        right: -14px;
        bottom: -14px;
        top: -45px;
      "
    >
      <div
        class="w-full h-full pointer"
        @click="openApp"
        v-if="Object.keys(myData.img).length > 0"
      >
        <video
          class="fullscreen-video"
          ref="wallpaperVideo"
          style="border-radius: 8px; object-fit: cover"
          playsinline=""
          autoplay=""
          muted=""
          loop=""
          v-if="myData.img.srcProtocol"
        >
          <source :src="myData.img.srcProtocol" type="video/mp4" id="bgVid" />
        </video>
        <img
          @error="imgError"
          :src="myData.img.path"
          alt=""
          class="w-full h-full"
          style="border-radius: 8px; object-fit: cover"
          v-else-if="myData.img.path && imgState"
        />
        <img
          @error="imgError"
          :src="myData.img.src"
          class="w-full h-full"
          style="border-radius: 8px; object-fit: cover"
          v-else-if="myData.img.src && imgState"
        />
        <img
          src="https://a.apps.vip/cards/smallWallpaper.png"
          class="w-full h-full"
          style="border-radius: 8px; object-fit: cover"
          v-else
        />
      </div>

      <div
        class="absolute bottom-0 flex items-center w-full h-12 pl-3 game-item-title-bg"
        v-if="showName"
        style="border-radius: 0 0 8px 8px; color: var(--primary-text)"
      >
        {{ myData.title }}
      </div>
    </div>
    <div v-else class="flex flex-col items-center justify-center h-full">
      <Unusual
        :newIcon="'fluent-emoji-flat:framed-picture'"
        class="mb-6"
        :normalButtonTitle="'选择图片'"
        :disableEdit="options.disableEdit"
        @back="importFile"
      />

      <!-- <a-empty description="" /> -->
      <!-- <xt-button type="theme" @click="importFile"> 选择图片 </xt-button> -->

    </div>
  </xt-container>
  <!-- 新版设置 -->
  <CustomModal
    :modalVisible="panelVisible"
    :customInput="myData.title"
    :linkPath="myData.link"
    :showName="showName"
    :img="imgSrc"
    :desk="desk"
    @close="panelVisible = false"
    @update:img="updateImg"
    @updateBorder="updateBorder"
    :noBorder="customData.hideFrame"
    @updateName="updateName"
    @updateInput="updateInput"
    @updateLink="updateLink"
    @localFile="localFile"
  />
</template>


<script>
import Widget from "../../card/Widget.vue";
import HorizontalPanel from "../../HorizontalPanel.vue";
import Classification from "../../comp/Classification.vue";
import navigationData from "../../../js/data/tableData";
import listItem from "../../../components/bottomPanel/listItem.vue";
import ModalList from "../../comp/ModalList.vue";
import path from "path";
import { mapActions, mapWritableState } from "pinia";
import { paperStore } from "../../../store/paper";
import Template from "../../../../user/pages/Template.vue";
import { cardStore } from "../../../store/card";
import { message } from "ant-design-vue";
import { startApp } from "../../../ui/hooks/useStartApp";
import { communityNavStore } from "../../bottomPanel/store/communityNavStore";

import { usePlat } from "../../../ui/hooks/usePlat";
import CustomModal from "./components/CustomModal.vue";
import Unusual from "../Unusual.vue";

let appModel;
if (usePlat("client")) {
  appModel = window.$models.appModel;
}

export default {
  name: "CustomAssembly",
  components: {
    Template,
    Widget,
    HorizontalPanel,
    Classification,
    listItem,
    ModalList,
    CustomModal,
    Unusual,
  },
  props: {
    customIndex: {
      type: Number,
      default: 0,
    },
    customData: {
      type: Object,
      default: () => {},
    },
    desk: {
      type: Object,
    },
    openWay: {
      type: String,
      default: "desk",
    },
  },
  data() {
    return {
      dropList: [],
      imgState: true,
      myImgShow: false,
      sizeList: [
        { title: "2x2", className: "small", name: "2x2" },
        { title: "2x4", className: "", name: "2x4" },
        { title: "4x4", className: "double", name: "4x4" },
      ],
      navClassify: [...navigationData.navigationClassify],
      editFlag: false,
      activeRightItem: 0,
      rightScrollbarSettings: {
        useBothWheelAxes: true,
        swipeEasing: true,
        suppressScrollY: false,
        suppressScrollX: true,
        wheelPropagation: true,
      },
      nowClassify: "systemApp",
      selectContent: "",
      showName: false,
      mySize: { title: "2x2", className: "small" },
      myData: { title: "", link: undefined, img: {} },
      panelVisible: false,
      ClassifyData: [
        ...navigationData.coolAppList,
        ...navigationData.systemAppList,
      ],
      menuList: [
        {
          icon: "shezhi1",
          title: "设置",
          fn: () => {
            this.panelVisible = true;
            this.$refs.customAssembly.visible = false;
          },
        },
      ],
      header: {
        // disabled:true
      },
    };
  },
  emits: ["delete"],
  computed: {
    ...mapWritableState(paperStore, ["settings", "myPapers"]),

    title() {
      return this.myData.link.name || this.myData.link;
    },
    imgSrc() {
      return this.myData.img.middleSrc || this.myData.img.src;
    },

    options() {
      return {
        bg: this.customData.hideFrame ? "transparent" : "",
        shadow: this.customData.hideFrame,
        resize: this.isCommunityDesktop(this.desk) ? false : true,
        customDel: this.openWay === "nav" ? true : false,
        disableEdit: this.isCommunityDesktop(this.desk),
      };
    },
  },
  methods: {
    ...mapActions(cardStore, ["updateCustomData"]),
    ...mapActions(communityNavStore, ["isCommunityDesktop"]),

    deleteCard() {
      this.$emit("delete");
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
        if (imgReg.test(openPath[0])) {
          this.myData.img.src = openPath[0];
          this.saveData();
        } else if (videoReg.test(openPath[0])) {
          this.myData.img.srcProtocol = openPath[0];
          this.$nextTick(() => {
            this.$refs.wallpaperVideo.load();
            this.$refs.wallpaperVideo.play().catch((err) => {});
          });
        }
      }
    },

    sendImg(img) {
      this.myData.img = img;
      this.saveCustomData();
    },
    // 替换图片
    updateImg(img) {
      this.myData.img = img;
      this.saveCustomData();
    },
    // 无边框
    updateBorder(val) {
      this.customData.hideFrame = val;
    },
    // 底部名称
    updateName(val) {
      this.showName = val;
      this.saveCustomData();
    },
    // 名称
    updateInput(val) {
      this.myData.title = val;
      this.saveCustomData();
    },
    // 链接
    updateLink(val) {
      this.myData.link = val;
      this.saveCustomData();
      // console.log('updateLink',this.myData.link);
    },
    // 本地文件路径
    localFile(val) {
      this.myData.link = val;
      this.saveCustomData();
      // console.log('localFile',val);
    },
    openApp() {
      if (typeof this.myData.link === "object" && this.myData.link.type) {
        switch (this.myData.link.type) {
          case "systemApp":
            if (this.myData.link.event === "fullscreen") {
              if (this.full) {
                this.full = false;
                tsbApi.window.setFullScreen(false);
              } else {
                this.full = true;
                tsbApi.window.setFullScreen(true);
              }
            } else if (this.myData.link.event === "/status") {
              if (this.$route.path === "/status") {
                this.$router.go(-1);
              } else {
                this.$router.push({ path: "/status" });
              }
            } else if (this.myData.link.data) {
              this.$router.push({
                name: "app",
                params: this.myData.link.data,
              });
            } else {
              this.$router.push({ name: this.myData.link.event });
            }
            break;
          case "coolApp":
            this.$router.push({
              name: "app",
              params: this.myData.link.data,
            });
            break;
          case "localApp":
            require("electron").shell.openPath(this.myData.link.path);
            break;
          case "lightApp":
            ipc.send("executeAppByPackage", {
              package: this.myData.link.package,
            });
            break;
          default:
            startApp("localApp", app.path);
          //require("electron").shell.openPath(this.myData.link.path);
        }
      } else if (this.myData.link) {
        this.myData.link.path
          ? require("electron").shell.openPath(this.myData.link.path)
          : require("electron").shell.openPath(
              require("path").normalize(this.myData.link)
            );
      }
    },
    // 保存数据到缓存
    saveCustomData(){
      // if (!Object.keys(this.myData.img).length > 0) {
      //   message.warning("未添加小组件封面");
      //   return;
      // }
      this.updateCustomData(
        this.customIndex,
        {
          showName: this.showName,
          mySize: this.mySize,
          myData: this.myData,
          customSize: this.mySize.title,
        },
        this.desk
      );
      // message.success("保存成功");
      // this.panelVisible = false;
    },
    imgError() {
      this.imgState = false;
    },
  },
  mounted() {
    const { showName, mySize, myData } = this.customData;
    if (showName) this.showName = showName;
    if (mySize) this.mySize = { ...this.mySize, ...mySize };
    if (myData) this.myData = { ...this.myData, ...myData };
    if (this.customData.customSize == undefined) {
      this.customData.customSize = "2x2";
    }

    if (this.options.disableEdit) {
      this.sizeList = [];
      this.menuList = [];
    } else {
      this.menuList = [
        {
          icon: "shezhi1",
          title: "设置",
          fn: () => {
            this.panelVisible = true;
            this.$refs.customAssembly.visible = false;
          },
        },
      ];
      this.sizeList = [
        { title: "2x2", className: "small", name: "2x2" },
        { title: "2x4", className: "", name: "2x4" },
        { title: "4x4", className: "double", name: "4x4" },
      ];
    }
  },
  // watch: {
  //   'myData.img':{
  //     handler(newV,oldV){
  //       console.log('newV',newV,'oldV',oldV);
  //     },
  //     deep:true,
  //     immediate:true
  //   }
  // },
};
</script>

<style scoped></style>
