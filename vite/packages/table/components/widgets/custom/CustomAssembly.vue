<template>
  <Widget
    :customIndex="customIndex"
    :options="options"
    :menuList="menuList"
    ref="customAssembly"
    :custom-data="customData"
    :desk="desk">
    <div v-if="Object.keys(myData.img).length > 0" class="absolute inset-0" style="border-radius: 8px; z-index: -1">
      <div
        class="h-full w-full pointer"
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
          class="h-full w-full"
          style="border-radius: 8px; object-fit: cover"
          v-else-if="myData.img.path && imgState"
        />
        <img
          @error="imgError"
          :src="myData.img.src"
          class="h-full w-full"
          style="border-radius: 8px; object-fit: cover"
          v-else-if="myData.img.src && imgState"
        />
        <img
          src="https://a.apps.vip/cards/smallWallpaper.png"
          class="h-full w-full"
          style="border-radius: 8px; object-fit: cover"
          v-else
        />
      </div>

      <div
        class="game-item-title-bg w-full h-12 absolute bottom-0 flex items-center pl-3"
        v-if="showName"
        style="border-radius: 0 0 8px 8px;color: var(--primary-text);"
      >
        {{ myData.title }}
      </div>
    </div>
    <div v-else class="flex justify-center items-center flex-col h-full">
      <!-- <a-empty description="" /> -->

      <xt-button type="theme"
                 @click="importFile"
      >
        选择图片
      </xt-button>
    </div>
  </Widget>
  <a-drawer
    v-model:visible="panelVisible"
    :width="500"
    title="设置"
    :headerStyle="{ border: 0 }"
    :bodyStyle="{ padding: '0 24px ' }"
  >
    <template #extra>
      <div
        class="flex justify-center items-center rounded-lg h-10 drawer-item-bg w-16 pointer"
        @click="saveData" style="background: #508BFE ;color:white"
      >
        保存
      </div>
    </template>
    <vue-custom-scrollbar
      :settings="rightScrollbarSettings"
      class="relative"
      style="height: calc(100% - 10px)"
    >
      <!-- <div class="text-base ">小组件尺寸</div> -->
    <XtRadio :list="sizeList" v-model:data="mySize.className" value="className" ></XtRadio>

    <!-- this.mySize.className; -->
    <!-- // 旧版本逻辑 -->
      <!-- <HorizontalPanel
        :navList="sizeList"
        v-model:select-type="mySize"
        class="mt-6"
        bg-color="drawer-item-select-bg"
      ></HorizontalPanel> -->
      <div class="flex mb-2 flex-row justify-between items-center mt-2">
        <div class="text-base">显示名称</div>
        <div><a-switch v-model:checked="showName" /></div>
      </div>
      <a-input
        v-model:value="myData.title"
        class="rounded-lg mt-6 drawer-item-bg xt-bg-2"
        style="height: 48px;color: var(--primary-text);border: 0px;"
        placeholder=""
      >
      </a-input>
      <div class="mt-6 text-base">小组件封面</div>
      <!--    <div class=" mt-2 text-base" style="color: rgba(255, 255, 255, 0.4);">支持直接复制粘贴图片到此处</div>-->
      <div
        class="flex flex-row justify-between items-center mt-6 gap-3"
        v-if="!Object.keys(myData.img).length > 0"
      >
        <xt-button type="theme"
          class="  w-full  " style="width:50%"
          @click="importFile"
        >
          选择图片
        </xt-button>
        <xt-button
          @click="openMy" style="width:50%"
        >
          选自壁纸收藏
        </xt-button>
      </div>
      <div v-else>
        <div class="h-16 w-16 mt-6 relative">
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
            :src="myData.img.middleSrc"
            alt=""
            class="h-full w-full"
            style="border-radius: 8px; object-fit: cover"
            v-else-if="myData.img.middleSrc"
          />
          <img
            :src="myData.img.src"
            class="h-full w-full"
            style="border-radius: 8px; object-fit: cover"
            v-else-if="myData.img.src"
          />
          <div
            class="rounded-full flex-shrink-0 w-5 h-5 flex justify-center items-center pointer absolute top-0 right-0 translate-x-1/2 -translate-y-1/2"
            @click="deleteImg"
            style="background: rgba(255, 255, 255, 0.5)"
          >
            <Icon icon="guanbi" style="color: black; height: 10px"></Icon>
          </div>
        </div>
      </div>
      <div class="mt-6 text-base">快捷方式</div>
      <div class="mt-2 text-base" style="color: var(--secondary-text)">
        支持选择Windows应用的快捷方式来作为小组件的点击启动目标
      </div>
      <div class="flex flex-row justify-between items-center mt-6">
        <div
          class="flex justify-center items-center rounded-lg h-12 drawer-item-bg w-1/2 pointer xt-bg-2"
          @click="customClick"
          v-if="!myData.link"  style="color: var(--primary-text);"
        >
          本地应用
        </div>
        <div
          class="flex justify-center items-center rounded-lg h-12 drawer-item-bg w-1/2 ml-3 pointer xt-bg-2"
          v-if="!myData.link"
          @click="showAppNav"  style="color: var(--primary-text);"
        >
          选自应用导航
        </div>
        <div
          v-else
          class="w-full rounded-lg h-9 flex justify-between items-center px-2"
          style="background: rgba(42, 42, 42, 1)"
        >
          <div class="text-more w-2/3">{{ title }}</div>
          <div
            class="rounded-full flex-shrink-0 w-5 h-5 flex justify-center items-center pointer"
            @click="deleteApp"
            style="background: rgba(255, 255, 255, 0.5)"
          >
            <Icon icon="guanbi" style="color: black; height: 10px"></Icon>
          </div>
        </div>
      </div>
    </vue-custom-scrollbar>
    <div v-if="editFlag || myImgShow" class="fixed inset-0"></div>
    <Classification
      :navClassify="navClassify"
      v-if="editFlag"
      v-model:show="editFlag"
      @clickLeftList="clickItem"
    >
      <div v-show="nowClassify !== 'localApp'" class="h-full">
        <a-input
          v-model:value="selectContent"
          class="no-drag h-10 rounded-lg"
          placeholder="搜索"
          style="background: rgba(42, 42, 42, 0.6)"
        >
          <template #prefix>
            <Icon icon="sousuo" class="text-gray-600"></Icon>
          </template>
        </a-input>
        <vue-custom-scrollbar
          key="scrollbar"
          :settings="rightScrollbarSettings"
          class="relative"
          style="height: calc(100% - 40px); padding: 5px 0"
        >
          <listItem
            v-for="(item, index) in filterList"
            :item="item"
            class="rounded-lg right-scroll-list"
            @click="clickRightListItem(item, index)"
          ></listItem>
        </vue-custom-scrollbar>
      </div>
      <div
        v-show="nowClassify === 'localApp'"
        class="flex flex-col items-start text-zinc-500 h-full"
      >
        <div>1. 点击选择需要添加的应用快捷方式</div>
        <div>2. 拖动应用快捷方式拖放到下方</div>
        <div>3. 支持批量添加</div>
        <div
          class="border-dashed w-full h-1/2 mt-2.5 rounded-lg flex flex-row justify-center items-center"
          @dragover.prevent=""
          @drop.prevent="drop"
        >
          <Icon
            icon="tianjia2"
            style="width: 18px; height: 18px"
            class="mr-2"
          ></Icon>
          添加快捷方式
        </div>
        <ScrolX :height="66">
          <div class="flex flex-row w-full justify-start mt-4 -ml-8 pt-4 pl-4">
            <div v-for="(item, index) in dropList" class="flex ml-4">
              <a-badge>
                <template #count>
                  <Icon
                    icon="guanbi2"
                    style="height: 24px; width: 24px; color: crimson"
                    @click="deleteDropList(index)"
                    class="pointer"
                  ></Icon>
                </template>
                <a-avatar :size="40" shape="square" :src="item.icon">
                </a-avatar>
              </a-badge>
            </div>
          </div>
        </ScrolX>
        <div
          @click="clickRightListItem(dropList)"
          class="pointer flex justify-center items-center mt-2 w-24 h-12 rounded-lg"
          style="background: rgb(42, 42, 42); color: rgba(255, 255, 255, 0.85)"
        >
          确定添加
        </div>
      </div>
    </Classification>
    <ModalList
      v-if="myImgShow"
      v-model:visible="myImgShow"
      title="我的收藏"
      :imgList="myPapers"
      @sendImg="sendImg"
    ></ModalList>
  </a-drawer>
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
const { appModel } = window.$models;
export default {
  name: "CustomAssembly",
  components: {
    Template,
    Widget,
    HorizontalPanel,
    Classification,
    listItem,
    ModalList,
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
    desk:{
      type:Object
    }
  },
  data() {
    return {
      dropList: [],
      imgState: true,
      myImgShow: false,
      sizeList: [
        { title: "1x1", className: "small", name: "1x1" },
        { title: "1x2", className: "", name: "1x2" },
        { title: "2x2", className: "double", name: "2x2" },
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
      mySize: { title: "1x1", className: "small" },
      myData: { title: "", link: undefined, img: {} },
      panelVisible: false,
      options: {
        className: "card small",
        title: "",
        icon: "",
        type: "remote",
        noTitle: true,
      },
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
    };
  },
  computed: {
    ...mapWritableState(paperStore, ["settings", "myPapers"]),
    filterList() {
      return this.ClassifyData.filter((i) => {
        return (
          i.type === this.nowClassify && i.name.includes(this.selectContent)
        );
      });
    },
    title() {
      return this.myData.link.name || this.myData.link;
    },
  },
  created() {
    this.loadDeskIconApps();
  },
  methods: {
    ...mapActions(cardStore, ["updateCustomData"]),
    async loadDeskIconApps() {
      const lightApps = await appModel.getAllApps();
      for (let i = 0; i < lightApps.length; i++) {
        lightApps[i].icon = lightApps[i].logo;
        lightApps[i].type = "lightApp";
      }
      const desktopApps = await ipc.sendSync("getDeskApps");
      for (let i = 0; i < desktopApps.length; i++) {
        desktopApps[i].type = "tableApp";
      }
      this.ClassifyData.push(...desktopApps, ...lightApps);
    },
    showAppNav() {
      this.editFlag = true;
    },
    deleteApp() {
      this.myData.link = undefined;
    },
    deleteImg() {
      this.myData.img = {};
    },
    clickItem(item) {
      this.activeRightItem = 0;
      this.nowClassify = item.name;
    },
    async drop(e) {
      let files = e.dataTransfer.files;
      let filesArr = [];
      if (files && files.length > 0) {
        for (let i = 0; i < files.length; i++) {
          filesArr.push(files[i].path);
        }
      }
      this.dropFiles = await ipc.sendSync("getFilesIcon", {
        files: JSON.parse(JSON.stringify(filesArr)),
      });
      this.dropList.push(...this.dropFiles);
    },
    deleteDropList(index) {
      this.dropList.splice(index, 1);
    },
    clickRightListItem(item, index) {
      this.activeRightItem = index;
      this.editFlag = false;
      if (item instanceof Array) {
        this.myData.link = item[0];
        this.dropList = [];
      } else {
        this.myData.link = item;
      }
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
    },
    async customClick() {
      let openPath = await tsbApi.dialog.showOpenDialog({
        title: "选择图片",
        filters: [{ name: "图片", extensions: ["png",'jpeg','jpg','svg','bmp','gif','webp'] },{ name: "全部", extensions: ["*"] }],
        properties: ["multiSelections"],
      });
      if (!openPath) {
        return;
      } else {
        this.myData.link = openPath[0];
      }
    },
    openMy() {
      this.myImgShow = true;
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
            require("electron").shell.openPath(this.myData.link.path);
        }
      } else if (this.myData.link) {
        this.myData.link.path
          ? require("electron").shell.openPath(this.myData.link.path)
          : require("electron").shell.openPath(
              require("path").normalize(this.myData.link)
            );
      }
    },
    saveData() {
      if (!Object.keys(this.myData.img).length > 0) {
        message.warning("未添加小组件封面");
        return;
      }
      this.updateCustomData(this.customIndex, {
        showName: this.showName,
        mySize: this.mySize,
        myData: this.myData,
      },this.desk);
      message.success("保存成功");
      this.panelVisible = false;
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
  },
  watch: {
    mySize: {
      handler(newV)  {
        this.options.className = "card" + " " + this.mySize.className;
        this.$emit("customEvent");
      },
      immediate: true,
      deep:true
    },
  },
};
</script>

<style scoped></style>
