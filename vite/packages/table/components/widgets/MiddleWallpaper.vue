<template>
  <a-spin tip="加载中..." :spinning="imgSpin" size="large">
    <xt-container
      :header="header"
      v-model:customSize="customSize"
      :options="options"
      :customIndex="customIndex"
      :sizeList="sizeList"
      ref="cardSlot"
      :customData="customData"
      :menuList="newMenu"
      class="cardSlot"
      :desk="desk"
      @delete="deleteCard"
    >
      <div
        :class="isMiddle?'middle-wrap':'small-wrap'"

      >
        <template v-if="imgList.length <= 0">
          <div
            class="flex flex-col items-center justify-center w-full"
            :class="isSmall ? 'h-full' : 'h-60'"
          >
            <newIcon
              icon="fluent-emoji:framed-picture"
              style="font-size: 3.5rem"
              v-if="isSmall"
            />
            <div
              class="p-3 rounded-lg xt-font xt-text font-14 xt-bg-t-2 font-400"
              :class="isSmall ? 'my-6' : 'my-2'"
              :style="isSmall ? { width: 'auto' } : { width: '210px' }"
            >
              我们提供多种壁纸源供你选择，快快挑选喜爱的壁纸，加入收藏吧。
            </div>
            <xt-button
              size="mini"
              :w="100"
              :h="40"
              type="theme"
              style="border-radius: 8px"
              @click="goPickOut"
            >去挑选
            </xt-button
            >
          </div>
        </template>

        <template v-else>
          <div class="w-full h-full hover-container pointer flex flex-wrap  paper-list">

            <!-- <viewer :images="[getCustomDataPaper]" :options="imgOption" v-else> -->
            <template v-for="(img, index) in getCustomDataPaper">
              <video
                class="fullscreen-video"
                ref="wallpaperVideo"
                style="border-radius: 8px; object-fit: cover"
                playsinline=""
                autoplay=""
                muted=""
                loop=""
                v-if="img.srcProtocol"
              >
                <source
                  :src="img.srcProtocol"
                  type="video/mp4"
                  id="bgVid"
                />
              </video>
              <div
               v-else
                style=""
                :style="isSmall?'width: 100% ;height:100% ':'width:auto;height:auto'
                "
                class="overflow-hidden rounded-lg img-item"
              >
                <xt-preview-img
                  :imgList="imagesList"
                  :multiple="true"
                  :maskClose="true"
                  :controlOption="{
                    controlBar: true,
                    closeBtn: true,
                    arrowBtn: true,
                  }"
                  :index="index"
                  class="w-full h-full relative"
                >
                  <img :class="isMiddle?'small-img':'full-img'"
                       :src="img.src"
                       :data-source="img.path"
                       :alt="img.resolution"
                       class="relative object-cover w-full h-full rounded-lg pointer"
                  />
                  <div @click.stop class="tools">
                    <xt-button
                      w="40"
                      h="40"
                      class="xt-bg-t-3"
                      style="border-radius: 8px; margin: 0 12px 10px 0"
                      @click="collect(img.path)"
                    >
                      <div class="flex items-center justify-center">
                        <xt-new-icon
                          icon="fluent:star-16-regular"
                          v-if="!isInMyPapers(img.path)"
                          size="20"
                        ></xt-new-icon>
                        <xt-new-icon
                          icon="fluent:star-16-filled"
                          v-else
                          size="20"
                          :color="'var(--warning)'"
                        ></xt-new-icon>
                      </div>
                    </xt-button>
                    <xt-button
                      w="40"
                      h="40"
                      class="xt-bg-t-3"
                      style="border-radius: 8px; margin: 0 12px 10px 0"
                      v-if="isMiddle"
                      @click="download(img.path)"
                    >
                      <div class="flex items-center justify-center">
                        <xt-new-icon
                          icon="fluent:arrow-download-16-regular"
                          size="20"
                        ></xt-new-icon>
                      </div>
                    </xt-button>
                    <xt-button
                      w="40"
                      h="40"
                      class="xt-bg-t-3"
                      style="border-radius: 8px; margin: 0 12px 10px 0"
                      @click="setDeskPaper(img)"
                    >
                      <div class="flex items-center justify-center">
                        <xt-new-icon
                          icon="fluent:desktop-16-regular"
                          size="20"
                        ></xt-new-icon>
                      </div>
                    </xt-button>
                  </div>
                </xt-preview-img>
              </div>

            </template>
            <!-- </viewer> -->

            <div
              class="absolute flex hover-item"
              style="
                opacity: 0;
                z-index: 1 !important;
              "
              :style="isMiddle?'top:20px;left:20px;':'top:10px;left:10px;'"
            >
              <xt-button
                w="40"
                h="40"
                class="xt-bg-t-3"
                style="border-radius: 8px; margin: 0 12px 10px 0"
                @click="lastImg"
              >
                <div class="flex items-center justify-center">
                  <xt-new-icon
                    icon="fluent:chevron-left-16-regular"
                    size="20"
                  ></xt-new-icon>
                </div>
              </xt-button>
              <xt-button
                w="40"
                h="40"
                class="xt-bg-t-3"
                style="border-radius: 8px; margin: 0 12px 10px 0"
                @click="nextImg"
              >
                <div class="flex items-center justify-center">
                  <xt-new-icon
                    icon="fluent:chevron-right-16-regular"
                    size="20"
                  ></xt-new-icon>
                </div>
              </xt-button>

              <xt-button
                w="40"
                h="40"
                class="xt-bg-t-3"
                style="border-radius: 8px; margin: 0 12px 10px 0"
                @click="randomImg"
              >
                <div class="flex items-center justify-center">
                  <xt-new-icon
                    icon="fluent:arrow-clockwise-16-regular"
                    :class="randomFlag ? 'replace-it' : ''"
                    size="20"
                  ></xt-new-icon>
                </div>
              </xt-button>


            </div>
          </div>
        </template>
      </div>
    </xt-container>
  </a-spin>
  <QueryWallpaperSettingMethod ref="queryRef"></QueryWallpaperSettingMethod>

  <!-- <teleport to="body">
    <WallpaperWidgetModal />
    <GalleryModal ref="galleryRef" />
    ref="paperWidgetRef"
      :modelValue="wallModelValue"
      @updateCustomDatas="updatePaperSource"
  </teleport> -->
</template>

<script>
import {mapActions, mapWritableState} from "pinia";
import axios from "axios";
import {message} from "ant-design-vue";
import {paperStore} from "../../store/paper";
import {appStore} from "../../store";
import {cardStore} from "../../store/card";
import {lively, lively2} from "../../js/data/livelyData";
import {Icon as newIcon} from "@iconify/vue";
import {
  wallpaperOptions,
  selectWallPaper,
} from "../../page/gallery/data/gallery";
import {getFileName} from "../../page/gallery/libs/utils";
import {paperGet, bingGet} from "../../js/axios/request";

import Widget from "../card/Widget.vue";
// import WallpaperWidgetModal from "../../apps/galleryModal/components/WallpaperWidgetModal.vue";
// import GalleryModal from "../paperModal/PaperApp.vue";
import {usePlat} from "../../ui/hooks/usePlat";
import {communityNavStore} from "../bottomPanel/store/communityNavStore";
import {useAppModal} from "../../apps/appModal/src/hook/useAppModal";
import {pickPaperStore} from "../../page/gallery/store/PickPaperStore";
import QueryWallpaperSettingMethod from '../../apps/galleryModal/QueryWallpaperSettingMethod.vue'

let fs;
let path;
if (usePlat("client")) {
  fs = require("fs");
  path = require("path");
}

export default {
  name: "MiddleWallpaper",

  components: {QueryWallpaperSettingMethod, Widget, newIcon},

  props: {
    desk: {
      type: Object,
    },
    customIndex: {
      type: Number,
      default: 0,
    },
    customData: {
      type: Object,
      default: () => {
      },
    },
    openWay: {
      type: String,
      default: "desk",
    },
  },
  emit: ["delete"],
  data() {
    return {
      // 组件配置
      customSize: '',
      // 壁纸数据
      imgList: [],
      imgIndex: 0,
      randomFlag: false,
      imgSpin: false,
      imgOption: {
        url: "data-source",
        button: false,
        toolbar: false,
        navbar: false,
      },
      imgLoading: true,

      // 大小切换
      sizeList: [
        {value: "2x2", name: "2x2"},
        {value: "4x4", name: "4x4"},
      ],
      // 右键菜单
    };
  },

  computed: {
    ...mapWritableState(paperStore, ["myPapers", "settings"]),
    ...mapWritableState(pickPaperStore, ["currentID"]),
    isMiddle() {
      return +this.paperSize === +4
    },
    isSmall() {
      return +this.paperSize === +2
    },
    menuList() {
      return [
        {
          newIcon: "fluent:image-multiple-16-regular",
          title: "在应用中打开",
          fn: () => {
            const {openApp} = useAppModal("galleryModalApp");
            openApp();
          },
        },
        {
          newIcon: "fluent:chevron-up-16-regular",
          title: this.isMiddle ? "上一组" : "上一张",
          fn: () => {
            this.lastImg();
          },
        },
        {
          newIcon: "fluent:chevron-down-16-regular",
          title: this.isMiddle ? "下一组" : "下一张",
          fn: () => {
            this.nextImg();
          },
        },
        {
          newIcon: "fluent:arrow-clockwise-16-regular",
          title: "换一换",
          fn: () => {
            this.randomImg();
          },
        },
        // {
        //   newIcon: "fluent:star-16-regular",
        //   title: "添加到收藏",
        //   fn: () => {
        //     this.collect();
        //   },
        // },
        // {
        //   newIcon: "fluent:more-horizontal-16-regular",
        //   title: "更多",
        //   lock: true,
        //   children: [
        //     {
        //       newIcon: "fluent:desktop-16-regular",
        //       title: "设为工作台壁纸",
        //       fn: () => {
        //         this.setDeskPaper(this.getCustomDataPaper);
        //       },
        //     },
        //     {
        //       newIcon: "fluent:desktop-16-regular",
        //       title: "设为系统桌面壁纸",
        //       fn: () => {
        //         this.setSystemPaper(this.getCustomDataPaper);
        //       },
        //     },
        //     {
        //       newIcon: "fluent:arrow-download-16-regular",
        //       title: "下载",
        //       fn: () => {
        //         this.download(this.getCustomDataPaper);
        //       },
        //     },
        //   ],
        // },
        {
          newIcon: "fluent:settings-16-regular",
          title: "设置",
          fn: () => {
            this.currentID = "s";
            const {openApp} = useAppModal("galleryModalApp");
            openApp();
          },
        },
      ]
    },
    header() {
      return {
        disabled: true,
        title: this.paperTitle,
        //  ifyIcon: "fluent:image-multiple-16-regular",
        showIcon: "/logo/wallpaper.svg",
      };
    },
    options() {
      return {
        defaultData: {
          customSize: "4x4",
          _updateFlag: "24531",
        },
        customDel: this.openWay === "nav" ? true : false,
        disableEdit: this.isCommunityDesktop(this.desk),
        cardName: "壁纸",
      };
    },
    // 组件标题
    paperTitle() {
      if (this.customData && this.customData.value !== undefined) {
        const paperFind = wallpaperOptions.find((find) => {
          return String(find.value) === String(this.customData.value);
        });
        return paperFind.name;
      } else {
        return wallpaperOptions[0].name;
      }
    },
    // 壁纸源选择数据
    wallModelValue() {
      if (this.customData && this.customData.value !== undefined) {
        return this.customData.value;
      } else {
        return "timeline";
      }
    },
    // 获取我的收藏壁纸数据
    myCollectPaper() {
      return this.myPapers;
    },
    // 动态切换大小
    paperSize() {
      if (this.customData && this.customData.customSize !== undefined) {
        let list = this.customData.customSize.split("x");
        return list[0];
      } else {
        return 2;
      }
    },

    //获取customData中存储的数据
    getCustomDataPaper() {
      if (this.customData && this.customData.paper !== undefined) {
        this.imgSpin = false;
        return this.customData.paper;
      } else {
        if (this.isMiddle) {
          return this.imgList.slice(0, 3);
        } else {
          return this.imgList.slice(0,1);
        }

      }
    },


    imagesList() {
      return this.getCustomDataPaper.map((img, index) => {
        return img.path;
      });
    },

    // 计算图片的宽高
    imgWH() {
      console.log('重新计算壁纸尺寸', this.customData, this.customData.customSize)
      if (this.customData && this.customData.customSize !== undefined) {
        let arr = this.customData.customSize.split("x");
        const result = {
          width: arr[0] * 134 + (arr[0] - 1) * 12,
          height: arr[1] * 96 + (arr[1] - 1) * 12,
        };
        return result;
      } else {
        return {
          width: 4 * 134 + (4 - 1) * 12,
          height: 4 * 96 + (4 - 1) * 12,
        };
      }
    },

    // 判断环境处理右键菜单
    newMenu() {
      if (window.$usePlat("web")) {
        const filterArr = this.menuList.filter((item) => {
          return item.title !== "设置";
        });
        return filterArr;
      } else {
        return this.menuList;
      }
    },

    // 实时获取图标组件的大小
    wallPaperSize() {
      return this.customData?.customSize;
    },
  },

  mounted() {
    this.customSize = this.customData?.customSize
    this.$nextTick(() => {
      if (!this.customData) return;
      if (this.customData.value !== undefined) {
        this.initPaperList(this.customData.value);
      } else {
        this.initPaperList("timeline");
      }
    });
    if (!this.customData) return;
    if (this.customData.customSize === undefined) {
      this.customData.customSize = "4x4";
    }

    if (this.options.disableEdit) {
      this.sizeList = [];
    } else {
      this.sizeList = [
        {value: "2x2", name: "2x2"},
        {value: "4x4", name: "4x4"},
      ];
    }
  },

  methods: {
    ...mapActions(paperStore, ["removeToMyPaper"]),
    ...mapActions(appStore, ["setBackgroundImage"]),
    ...mapActions(cardStore, ["updateCustomData"]),
    ...mapActions(communityNavStore, ["isCommunityDesktop"]),

    getFileName,
    deleteCard() {
      this.$emit("delete");
    },
    // 初始化获取壁纸数据
    initPaperList(val) {
      const paperFind = wallpaperOptions.find((find) => {
        return String(find.value) === String(val);
      });
      this.updateCustomData(this.customIndex, paperFind, this.desk);
      if (paperFind.value === "my") {
        // this.imgList = [];
        this.imgList = this.myCollectPaper;
      } else if (paperFind.value === "sift") {
        // this.imgList = [];
        this.imgList = selectWallPaper;
      } else {
        // this.imgList = [];
        this.getOtherList(paperFind);
      }
    },
    getOtherList(params) {
      this.imgSpin = true;
      let animations = ["ani-gray", "bowen", "ani-rotate"];
      if (params.value !== "bing") {
        paperGet(params.path)
          .then((res) => {
            if (res.status === 200) {
              let pickImage = res.data.data;
              const mapImageList = pickImage.map((img) => {
                let randomIndex = Math.floor(Math.random() * animations.length);
                console.log('找到', img)
                const returnObj = {
                  animations: animations[randomIndex],
                  path: img.imgurl,
                  resolution: img.size,
                  no: img.no,
                  src: img.thumburl || img.imgurl,
                  //  src:img.thumburl,
                };
                return returnObj;
              });
              this.imgList = mapImageList;
            }
          })
          .catch((err) => {
            console.error("报错了", err);
          })
          .finally(() => {
            this.$nextTick(() => {
              this.imgSpin = false;
            });
          });
      } else {
        bingGet(params.path)
          .then((res) => {
            if (res.status === 200) {
              let images = res.data.images;
              const mapImage = images.map((img) => {
                let randomIndex = Math.floor(Math.random() * animations.length);
                return {
                  title: false, // img.title,
                  src: "https://cn.bing.com" + img.url,
                  path: "https://cn.bing.com" + img.url,
                  animation: animations[randomIndex], //['gray','rate'][(Math.random()*2).toFixed()]//''slide','fade','scale',
                };
              });
              this.imgList = mapImage;
            }
          })
          .catch((err) => {
            console.error("报错了", err);
          })
          .finally(() => {
            this.$nextTick(() => {
              this.imgSpin = false;
            });
          });
      }
    },

    // 判断是否添加到收藏中
    isInMyPapers(src) {
      const index = this.myPapers.findIndex((img) => {
        return String(src) === String(img.src);
      });
      return index > -1;
    },
    // 更新壁纸源数据以及更新customData
    updatePaperSource(val) {
      this.customData.value = val;
      this.initPaperList(val);
    },
    resetImg(){
      let gap = this.isMiddle ? 4 : 1
      this.customData.paper = this.imgList.slice(this.imgIndex *gap, this.imgIndex * gap + gap)
    },
    // 上一张壁纸和下一张壁纸
    lastImg() {

      this.imgIndex -= 1;
      if (this.imgIndex < 0) {
        this.imgIndex = 0;//this.imgList.length - 1;
      }
      this.resetImg()

    },
    nextImg() {
      this.imgIndex += 1;
      let gap = this.isMiddle ? 4 : 1
      if (this.imgIndex * gap + gap >= this.imgList.length) {
        this.imgIndex = this.imgList.length - gap;//this.imgList.length - 1;
        if (this.imgIndex <= 0) {
          this.imgIndex = 0
        }
      }
      this.resetImg()
      // this.customData.paper = this.imgList[this.imgIndex];
      // this.imgIndex += 1;
      // if (this.imgIndex >= this.imgList.length) {
      //   this.imgIndex = 0;
      // }
    },

    // 随机壁纸
    randomImg() {
      this.randomFlag = true;
      setTimeout(() => {
        this.randomFlag = false;
        let gap=this.isMiddle?4:1
        let nmb = parseInt(Math.random() * (this.imgList.length/gap));
        console.log('随机到了',nmb,this.imgIndex)
        if(this.imgIndex!==nmb){
          console.log('随机到了',nmb)
          this.imgIndex = nmb
          this.resetImg()
          this.randomFlag = false;
        }else{
          this.randomImg()
        }

      }, 500);
    },

    // 收藏壁纸
    collect(path) {
      if (this.customData && this.customData.value === "my") {
        this.removeToMyPaper({src:path});
      } else {

        this.removeToMyPaper({src:path});
      }
    },

    // 设置工作台壁纸
    setDeskPaper(paper) {
      this.$refs.queryRef.show(paper.path || paper.src)
      // message.info("正在设置桌面壁纸");
      // this.setBackgroundImage(paper);
      // console.log(paper)
      // setTimeout(() => {
      //   message.success("桌面壁纸设置完成");
      // }, 800);
    },

    // 下载
    download(img) {
      if (this.settings.savePath === "") {
        window.$ui.confirm(
          "您尚未设置壁纸保存目录，请设置目录，设置目录后下载将自动开始。",
          "",
          {
            index: 100010,
            ok: async () => {
              await this.queryStart();
            },
            no: () => {
            },
            noText: "取消",
            type: "warning",
          }
        );
      } else {
        const fileRegex = /^file:/;
        const regex = /^https:\/\/up\.apps\.vip/;
        const exist = fileRegex.test(img.path);
        // 判断是否为本地图片
        if (!exist && !regex.test(img.path)) {
          this.doStartDownload(img);
        } else {
          window.$ui.confirm("图片已下载", "", {
            index: 1020,
            ok: async () => {
            },
            no: () => {
            },
            noText: null,
            type: "warning",
          });
        }
      }
    },
    doStartDownload(item) {
      message.info("开始下载壁纸");
      item.percent = 0;
      const name = getFileName(item.path);
      tsbApi.download.start({
        url: item.src,
        savePath: this.settings.savePath + "/static/" + name,
        updated: (args) => {
          item.done = 1;
          item.percent = (
            (args.downloadInfo.receivedBytes / args.downloadInfo.totalBytes) *
            100
          ).toFixed(0);
        },
        done: (args) => {
          item.percent = 100;
          item.done = 1;
          message.success("下载完成");
        },
        willDownload: (args) => {
        },
      });
    },
    async queryStart() {
      let savePath = await tsbApi.dialog.showOpenDialog({
        title: "选择目录",
        message: "请选择下载壁纸的目录",
        properties: ["openDirectory", "createDirectory"],
      });
      if (savePath) {
        this.settings.savePath = savePath[0];
        this.doStartDownload(this.myCurrentID);
      }
    },

    // 设置系统桌面壁纸
    setSystemPaper(paper) {
      if (paper) {
        window.$ui.confirm(
          "确定将此壁纸设置为系统桌面壁纸",
          "确定将此壁纸设置为系统桌面壁纸？注意，此处设置不是工作台的壁纸。",
          {
            index: 100010,
            ok: () => {
              message.info("正在为您下载并设桌面壁纸");
              tsbApi.system.setPaper(paper.path);
            },
            no: () => {
            },
            noText: "取消",
            type: "warning",
          }
        );
      }
    },

    // 进入应用
    goPickOut() {
      this.$refs.galleryRef.openPaperAppModal();
    },

    // 进入对应的应用
    goGallery(value) {
      const paperType = ["wallhaven", "timeline", "glutton"];
      if (paperType.includes(value))
        return this.$router.push({name: "pickingPaper"});
      if (value === "my") return this.$router.push({name: "my"});
      if (value === "bing") return this.$router.push({name: "bing"});
    },
  },
  watch: {
    customSize(newVal, oldVal) {
      console.log('变动了')
      this.customData.customSize = newVal;

    },
    'customData.customSize'(newVal,oldVal){
      this.imgIndex=0
       this.resetImg()
      console.log('变动了')
    }
  },
};
</script>

<style lang="scss" scoped>
.tools {
  position: absolute;
  bottom: 0;
  right: 0;
  z-index: 1;
}
.img-item{
  .tools{
    display: none;
  }
  &:hover{
    .tools{
      display: block;
    }
  }
}
.small-img {
  width: 265px;
  height: 190px;
}
.middle-wrap{

  padding-top:15px;
  width: 100%;
  height:100%
}
.small-wrap{
  margin: -14px;
  margin-top: 0px;
  width: calc(100% + 28px);
  height: calc(100% + 14px);
}
.full-img{
  width: 100%;
  height: 100%;
}
.paper-list {
  gap: 10px;
  display: flex;
  align-content: center;
  justify-content: center;
}

.hover-container {
  &:hover {
    .hover-item {
      opacity: 1 !important;
    }
  }
}

.xt-bg-t-3 {
  background: rgba(0, 0, 0, 0.5) !important;
}

.top-shadow {
  background-image: linear-gradient(
      180deg,
      rgba(0, 0, 0, 0.3) 0%,
      rgba(0, 0, 0, 0) 100%
  );
  z-index: 100;
}

:deep(.ant-image-img) {
  border-radius: 8px !important;
}

:deep(.ant-image-mask) {
  display: none !important;
}

:deep(.ant-image-preview-root) {
  background: red !important;
}

</style>

<!--   border:1px solid red  !important;
  max-height: 0 !important;
  max-width: 0 !important;
  width: 100% !important;
  height: 100% !important; -->
