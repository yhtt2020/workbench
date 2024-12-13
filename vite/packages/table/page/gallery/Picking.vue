<!-- 拾光壁纸模块 -->
<template>
  <div class="flex flex-col w-full h-full">
    <!-- 头部选择操作 -->
    <div class="flex items-center justify-between mb-2">
      <!-- 左侧标题 -->
      <div class="flex items-center justify-center">
        <xt-new-icon
          icon="fluent:image-multiple-16-filled"
          size="20"
          class="mr-2 xt-text"
        />
        <span
          class="xt-font xt-text font-400"
          :class="isModal ? 'font-14' : 'font-16'"
        >
          拾光壁纸
        </span>
      </div>

      <!-- 右侧操作 -->
      <div class="flex items-center justify-center">
        <!-- 应用弹窗模式下的下拉选择器 -->
        <MinSelect @updateCallback="pickFilterChange"/>

        <!-- 下拉弹窗 -->
        <xt-dropdown
          :w="isModal ? 32 : 40"
          :h="isModal ? 32 : 40"
          :iconSize="isModal ? 20 : 24"
          :placement="'bottomRight'"
          :buttonClass="'xt-active-bg'"
          :newIcon="'fluent:filter-16-filled'"
          :iconBg="'var(--active-text)'"
          :class="isModal ? 'mr-3' : ''"
          :zIndex="100001"
        >
          <PickDropDetail :isModal="isModal" style="width: 350px;" @emitPick="pickFilterChange"/>
        </xt-dropdown>
      </div>
    </div>

    <!-- 底部壁纸数据渲染区域 -->
    <div class="flex-1" style="height: calc(100% - 100px)">
      <!-- 加载状态 -->
      <template v-if="isLoading">
        <div style="display: flex; align-items: center; justify-content: center">
          <a-spin/>
        </div>
      </template>

      <!-- 列表区域 -->
      <XtScrollbar
        :y="true"
        style="height: 100%"
        id="pick-wrapper"
        ref="pickWrapperRef"
        v-show="isLoading === false"
      >
        <div style="height: 8px"></div>

        <a-row :gutter="[16, 16]" id="pick-images" ref="pickRef">
          <a-col
            class="image-wrapper"
            v-for="(img, index) in pickImageData"
            :span="6"
          >
            <div class="w-full h-full pointer pick-paper">
              <xt-mix-menu
                :menus="pickPaperMenu"
                fn="callBack"
                @mounted="this.currentPaper = img"
                :stopPropagation="false"
              >
                <xt-preview-img :imgList="imagesList" :index="index">
                  <img
                    class="image-item pointer"
                    :src="img.path"
                    :data-source="img.src"
                    :alt="img.resolution"
                    style="position: relative"
                  />
                </xt-preview-img>
                <div class="absolute flex top-1 right-3">
                  <xt-button
                    :w="isModal ? 32 : 40"
                    :h="isModal ? 32 : 40"
                    class="mr-2 xt-bg-t-3 img-button"
                    style="border-radius: 8px; opacity: 0"
                    @click="download(img)"
                    v-if="!isWeb"
                  >
                    <div class="flex items-center justify-center">
                      <xt-new-icon
                        icon="fluent:arrow-download-16-filled"
                        :size="isModal ? 16 : 20"
                        :color="'var(--active-text)'"
                      ></xt-new-icon>
                    </div>
                  </xt-button>
                  <xt-web-link-button v-else class="img-button" style="opacity: 0" :url="img.src">
                    <template #a-button>
                      <div class="flex items-center justify-center">
                        <xt-new-icon
                          icon="fluent:arrow-download-16-filled"
                          :size="20"
                          :color="'var(--active-text)'"
                        ></xt-new-icon>
                      </div>
                    </template>
                  </xt-web-link-button>

                  <xt-button
                    :w="isModal ? 32 : 40"
                    :h="isModal ? 32 : 40"
                    class="mr-2 xt-bg-t-3 img-button"
                    style="border-radius: 8px; opacity: 0"
                    @click="addToMy(img)"
                    :style="
                        isInMyPapers(img) ? { opacity: '1' } : { opacity: '0' }
                      "
                  >
                    <div class="flex items-center justify-center">
                      <xt-new-icon
                        icon="fluent:star-16-filled"
                        v-if="isInMyPapers(img)"
                        :size="isModal ? 16 : 20"
                        :color="'var(--warning)'"
                      ></xt-new-icon>
                      <xt-new-icon
                        icon="fluent:star-16-filled"
                        v-else
                        :size="isModal ? 16 : 20"
                        :color="'var(--active-text)'"
                      ></xt-new-icon>
                    </div>
                  </xt-button>
                </div>
                <div
                  class="absolute"
                  style="top: 50%; left: 50%; transform: translate(-50%, -50%)"
                >
                  <xt-button
                    w="100"
                    :h="isModal ? 32 : 40"
                    class="mr-2 xt-bg-t-3 img-button"
                    style="border-radius: 8px; opacity: 0"
                    @click="showSetModal(img)"
                  >
                    <div class="flex items-center justify-center">
                      <xt-new-icon
                        icon="fluent:checkmark-circle-16-filled"
                        :size="isModal ? 16 : 20"
                        class="mr-1"
                        :color="'var(--active-text)'"
                      ></xt-new-icon>
                      <span
                        :class="
                            isModal ? 'font-14 font-400' : 'font-16 font-400'
                          "
                        class="xt-active-text xt-font"
                      >设为壁纸</span
                      >
                    </div>
                  </xt-button>
                </div>
              </xt-mix-menu>
            </div>
          </a-col>
        </a-row>

        <div style="height: 16px"></div>
      </XtScrollbar>
    </div>
  </div>
</template>

<script>
import {mapActions, mapWritableState} from "pinia";
import {pickPaperStore} from "./store/PickPaperStore";
import {paperStore} from "../../store/paper";
// import axios from "axios";
import {formatDateTime, isInMyPapers, paperDownload} from "./libs/utils";
import {appStore} from "../../store";
// import browser from "../../js/common/browser";
// import { taskStore } from "../../apps/task/store";
import {message} from "ant-design-vue";
import {paperGet} from "../../js/axios/request";
import {completeTask} from "../../apps/task/task";
import {usePlat} from "../../ui/hooks/usePlat";

import PickDropDetail from "./components/content/PickDropDetail.vue";
import GradeSmallTip from "../../components/GradeSmallTip.vue";
import MinSelect from "./components/select/MinSelect.vue";
import paperHelper from "./components/content/paperHelper";

let fs, path;
if (usePlat("client")) {
  fs = window.$models.fs;
  path = require("path");
}

export default {
  name: "Picking",

  components: {
    MinSelect,
    PickDropDetail,
    GradeSmallTip,
  },

  props: {
    isModal: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      isLoading: false,
      pickImageData: [],
      options: {url: "data-source"},
      currentPaper: null,
      settingsScroller: {
        useBothWheelAxes: true,
        swipeEasing: true,
        suppressScrollY: false,
        suppressScrollX: true,
        wheelPropagation: true,
      },
      pickPaperMenu: [
        {
          newIcon: "fluent:desktop-16-filled",
          name: "设为工作台背景",
          callBack: () => {
            this.setAppPaper(this.currentPaper);
          },
        },
        {
          newIcon: "mingcute:windows-line",
          name: "设置桌面壁纸",
          callBack: () => {
            this.setDesktopPaper(this.currentPaper);
          },
        },
        {
          newIcon: "fluent:arrow-download-16-filled",
          name: "下载壁纸",
          callBack: () => {
            this.download(this.currentPaper);
          },
        },
      ],
    };
  },

  computed: {
    ...mapWritableState(pickPaperStore, ["no", "cateHowValue", "cateWhatValue", "orderValue", "paperApi"]),
    ...mapWritableState(paperStore, ["settings"]),

    /**获取图片路径**/
    imagesList() {
      return this.pickImageData.map((item) => {
        return item.src;
      });
    },

    /**判断环境**/
    isWeb() {
      return window.$usePlat("web");
    },
  },

  inject: ["modalParams"],

  mounted() {
    this.getWallpaperSourceList(99999999, false);
    $("#pick-wrapper").scroll(() => {
      let currentTop = $("#pick-wrapper").scrollTop() + $("#pick-wrapper").height() + 20;
      let topVisible = currentTop >= $("#pick-images").prop("scrollHeight");
      if (topVisible && this.isLoading === false) {
        // 将返回数据中最后一条的 no 值减1作为下次请求的 no 参数，即可获取下一页数据
        let newNo = this.pickImageData[this.pickImageData.length - 1]?.no - 1;
        this.getWallpaperSourceList(newNo, true);
      }
    })
  },

  methods: {
    formatDateTime,
    isInMyPapers,
    paperDownload,
    ...mapActions(paperStore, ["removeToMyPaper"]),
    ...mapActions(appStore, ["setBackgroundImage"]),

    /**收藏**/
    addToMy(img) {
      this.removeToMyPaper(img);
    },

    /**设置壁纸**/
    showSetModal(img) {
      console.log(img,'需要设置的img')
      this.$emit('updateIndependentBg', img);
      return;
    },

    /**设置系统桌面壁纸**/
    setDesktopPaper(img) {
      paperHelper.setDesktopPaper(img)
    },

    /**下载壁纸**/
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
            type: "link",
          }
        );
      } else {
        this.doStartDownload(img);
      }
    },
    doStartDownload(item) {
      message.info("开始下载壁纸");
      const name = item.path.split("/");
      const fileName = name[name.length - 1];
      tsbApi.download.start({
        url: item.path,
        savePath: this.settings.savePath + "/static/" + fileName,
        done: (args) => {
          message.success("壁纸下载完成");
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
        this.doStartDownload(this.currentPaper.path);
      }
    },

    /**
     * 根据壁纸源获取壁纸
     * @param no 截止序号，用于分页的关键参数。注：当 order 值为 random 时，该参数无效。
     * 例：将返回数据中最后一条的 no 值减1作为下次请求的 no 参数，即可获取下一页数据。
     * **/
    getWallpaperSourceList(no, flag) {
      if (flag === false) this.isLoading = true;
      // 判断当前的排序是否为随机,如果是,那么no这个参数会失效
      if (this.orderValue === 'random') {
        let data = {
          order: Date.now(),
          catehow: this.cateHowValue,
          catewhat: this.cateWhatValue,
          no: no,
        }
        this.getPaperList(data);
      } else {
        let newData = {
          order: this.orderValue,
          catehow: this.cateHowValue,
          catewhat: this.cateWhatValue,
          no: no,
        }
        this.getPaperList(newData);
      }
    },
    getPaperList(data) {
      paperGet(`/${this.paperApi}/v3`, {...data}).then((res) => {
        if (res.status === 200) {
          let pickImage = res.data.data;
          this.count = res.data.count;
          let animations = ["ani-gray", "bowen", "ani-rotate"];
          if (pickImage) {
            const mapPickImg = pickImage.map((img) => {
              if (img.thumburl !== null) {
                let randomIndex = Math.floor(
                  Math.random() * animations.length
                );
                const image = {
                  title: false,
                  src: img.imgurl,
                  path: img.thumburl,
                  resolution: img.size,
                  score: img.score,
                  no: img.no,
                  animations: animations[randomIndex],
                };
                return image;
              }
            });
            this.isLoading = false;
            if (this.pickImageData.length !== 0) {
              this.pickImageData = this.pickImageData.concat(mapPickImg);
            } else {
              this.pickImageData = mapPickImg;
            }
          }
        }
      })
        .catch((error) => {
          console.error(error);
        })
        .finally(() => {
          this.$nextTick(() => {
            this.isLoading = false;
          });
        });
    },


    /**下拉菜单切换数据**/
    pickFilterChange(evt) {
      this.pickImageData = [];
      this.getWallpaperSourceList(99999999, false);
    },
  },
};
</script>

<style lang="scss" scoped>
.pick-paper {
  &:hover {
    .img-button {
      opacity: 1 !important;
    }
  }
}

.xt-bg-t-3 {
  background: rgba(00, 00, 00, 0.4) !important;
}

:deep(.ant-select-arrow) {
  color: var(--primary-text) !important;
}
</style>
