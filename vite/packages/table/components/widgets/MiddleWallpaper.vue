<template>
  <a-spin tip="加载中..." :spinning="imgSpin" size="large">
    <Widget :options="options" :customIndex="customIndex" :menuList="menuList" ref="cardSlot" :desk="desk">
      <div class="absolute w-24 h-5 top-4 left-4 pointer" @click="openRight"></div>
      <template #left-title-icon>
        <div
          class="icon"
          style=" width: 38px;height: 24px; display: flex;justify-content: center;align-items: center;position: absolute;
            left: 2px; ">
          <newIcon icon="fluent:image-multiple-16-regular" style="font-size: 20px;" />
        </div>
      </template>
      <div class="absolute inset-0" style="border-radius: 8px; z-index: -1">
        <div class="w-full text-center" style="margin-top: 20%" v-if="imgList.length <= 0">
          <a-empty :image="simpleImage" />
          <div class="item-content">
            <xt-button size="mini" :w="100" :h="40"  type="theme" @click="goGallery">去挑选壁纸</xt-button>
          </div>
        </div>
        <div class="w-full h-full pointer" v-else @click="goSource">
          <video class="fullscreen-video" ref="wallpaperVideo" style="border-radius: 8px; object-fit: cover"
            playsinline="" autoplay="" muted="" loop="" v-if="currentImg.srcProtocol">
            <source :src="currentImg.srcProtocol" type="video/mp4" id="bgVid" />
          </video>

          <img :src="currentImg.middleSrc" @load="imgLoad" @error="imgError" alt="" class="w-full h-full"
            style="border-radius: 8px; object-fit: cover" v-else-if="currentImg.middleSrc" />
          <img :src="currentImg.src" @load="imgLoad" alt="" @error="imgError" class="w-full h-full"
            style="border-radius: 8px; object-fit: cover" v-else />
        </div>
      </div>
      <div class="absolute flex flex-row justify-center bottom-4" style="width: 543px" v-if="imgList.length > 0">
        <div class="flex items-center justify-center mr-4 item-icon pointer" @click="lastImg">
          <Icon class="icon" icon="caret-left"></Icon>
        </div>
        <div class="flex items-center justify-center mr-4 item-icon pointer" @click="nextImg">
          <Icon class="icon" icon="caret-right"></Icon>
        </div>
        <div class="flex items-center justify-center mr-4 item-icon pointer" @click="randomImg">
          <Icon class="icon" :class="randomFlag ? 'replace-it' : ''" icon="reload"></Icon>
        </div>
        <div class="flex items-center justify-center mr-4 item-icon pointer" @click="collect"
          v-if="addressType.name !== 'my'">
          <Icon v-if="!isInMyPapers" icon="star"></Icon>
          <Icon v-else style="fill: yellow" icon="star-fill"></Icon>
        </div>
        <div class="flex items-center justify-center item-icon pointer" @click="settingImg">
          <Icon class="icon" icon="desktop"></Icon>
        </div>
      </div>
    </Widget>
  </a-spin>
  <a-drawer :width="500" v-model:visible="settingVisible" placement="right">
    <template #title>
      <div class="text-center">「壁纸」设置</div>
    </template>
    <div class="text-base">壁纸源</div>
    <a-select style="
        border: 1px solid rgba(255, 255, 255, 0.1);
      " class="w-full h-10 mt-4 text-xs rounded-lg" size="large" :bordered="false" v-model:value="pickFilterValue"
      @change="pickFilterChange($event)" :options="wallpaperOptions">
    </a-select>
  </a-drawer>
</template>

<script>
import Widget from "../card/Widget.vue";
import axios from "axios";
import { mapActions, mapWritableState } from "pinia";
import { Empty, message } from "ant-design-vue";
import { paperStore } from "../../store/paper";
import { appStore } from "../../store";
import { cardStore } from "../../store/card";
import { lively, lively2 } from "../../js/data/livelyData";
import XtButton from '../../ui/libs/Button/index.vue'
import { Icon as newIcon } from "@iconify/vue";
let fs = require("fs");
let path = require("path");
export default {
  name: "MiddleWallpaper",
  components: {
    XtButton,
    Widget,
    newIcon
  },
  props: {
    desk:{
      type:Object,
    },
    customIndex: {
      type: Number,
      default: 0,
    },
    customData: {
      type: Object,
      default: () => { },
    }
  },
  data() {
    return {
      imgSpin: false,
      options: {
        className: "card double",
        title: "壁纸",
        // icon: "image",
        type: "MiddleWallpaper",
      },
      menuList: [
        {
          icon: "shezhi1",
          title: "设置",
          fn: () => {
            this.settingVisible = true;
            this.$refs.cardSlot.visible = false;
          },
        },
      ],
      pickFilterValue: "我的收藏",
      wallpaperOptions: [
        { value: "我的收藏", name: "my", path: "" },
        {
          value: "必应壁纸",
          name: "bing",
          path: "https://cn.bing.com/HPImageArchive.aspx?format=js&idx=1&n=8",
        },
        {
          value: "拾光壁纸",
          path: "https://api.nguaduot.cn/timeline/v2?client=thisky",
          name: "pickingPaper",
        },
        {
          value: "贪食鬼",
          path: "https://api.nguaduot.cn/glutton/v2?client=thisky",
          name: "pickingPaper",
        },
        {
          value: "贪吃蛇",
          path: "https://api.nguaduot.cn/snake/v2?client=thisky",
          name: "pickingPaper",
        },
        {
          value: "wallhaven",
          path: "https://api.nguaduot.cn/wallhaven/v2?client=thisky",
          name: "pickingPaper",
        },
        // {value:'动态壁纸',name:'lively',path:'https://api.nguaduot.cn/timeline/v2'}
      ],
      settingVisible: false,
      simpleImage: '/public/img/test/load-ail.png',
      addressType: {
        value: "我的收藏",
        path: "",
        name: "my",
      },
      imgList: [{ src: "" }],
      currentImg: {
        srcProtocol: null,
        path: "",
      },
      imgIndex: 0,
      randomFlag: false,
      list: [],
    };
  },
  methods: {
    ...mapActions(paperStore, ["removeToMyPaper"]),
    ...mapActions(appStore, ["setBackgroundImage"]),
    ...mapActions(cardStore, ["updateCustomData"]),
    goGallery() {
      this.$router.push({ name: "my" });
    },
    imgLoad() {
      this.imgSpin = false;
    },
    openRight() {
      this.settingVisible = true;
    },
    pickFilterChange(e) {
      this.addressType = this.wallpaperOptions.find((i) => i.value === e) || {
        value: "我的收藏",
        path: "",
        name: "my",
      };
      this.updateCustomData(this.customIndex, this.addressType,this.desk);
      this.options.title = this.addressType.value;
      if (
        this.addressType.name === "pickingPaper" ||
        this.addressType.name === "bing"
      ) {
        axios
          .get(this.addressType.path)
          .then((res) => {
            this.imgList = [];
            if (res.data.data) {
              let pickImage = res.data.data;
              this.count = res.data.count;
              let animations = ["ani-gray", "bowen", "ani-rotate"];
              if (pickImage) {
                pickImage.forEach((img) => {
                  if (img.thumburl !== null) {
                    let thumburl = "";
                    let str = "";
                    let randomIndex = Math.floor(
                      Math.random() * animations.length
                    );
                    if (img.thumburl.indexOf("@") !== -1) {
                      str = img.thumburl.substring(
                        img.thumburl.indexOf("@"),
                        img.thumburl.length
                      );
                      thumburl = img.thumburl.replace(str, "@1200w.webp");
                    }
                    if (img.thumburl.indexOf("400") !== -1) {
                      thumburl =
                        img.thumburl.substring(0, img.thumburl.indexOf("400")) +
                        "1200" +
                        img.thumburl.slice(
                          img.thumburl.indexOf("400") - img.thumburl.length + 3
                        );
                    }
                    if (img.thumburl.indexOf("fw") !== -1) {
                      str = img.thumburl.substring(
                        img.thumburl.indexOf("fw"),
                        img.thumburl.length
                      );
                      thumburl = img.thumburl.replace(str, "fw1200webp");
                    }
                    const image = {
                      title: false,
                      src: img.thumburl,
                      path: img.imgurl,
                      resolution: img.size,
                      score: img.score,
                      no: img.no,
                      middleSrc: thumburl,
                      animations: animations[randomIndex],
                    };
                    this.imgList.push(image);
                  }
                });
              }
            } else {
              let images = res.data.images;
              let animations = ["ani-gray", "bowen", "ani-rotate"];
              if (images) {
                images.forEach((img) => {
                  let random = Math.random();
                  let randomIndex = Math.floor(
                    Math.random() * animations.length
                  );
                  let image = {
                    title: false, // img.title,
                    src: "https://cn.bing.com" + img.url,
                    path: "https://cn.bing.com" + img.url,
                    animation: animations[randomIndex], //['gray','rate'][(Math.random()*2).toFixed()]//''slide','fade','scale',
                  };
                  this.imgList.push(image);
                });
              }
            }
            this.initImg();
          })
          .catch((err) => {
            this.imgList = [];
            this.imgIndex = 0;
            this.imgSpin = false;
          });
      } else if (this.addressType.name === "my") {
        this.imgList = this.myPapers;
        this.initImg();
      }
      // else if(this.addressType.name === 'lively'){
      //   this.imgList = this.list
      //   this.initImg()
      // }
    },
    initImg() {
      this.imgIndex = 0;
      this.setImg();
    },
    imgError() {
      this.imgSpin = false;
      this.currentImg.src = "/img/defaultImg.jpg";
    },
    // getVideo (item) {
    //
    //   let filename = item.name
    //   filename = `https://up.apps.vip/lively/${filename}`
    //   return filename
    // },
    setImg() {
      this.imgSpin = true;
      if (this.imgList.length > 0) {
        this.currentImg = this.imgList[this.imgIndex];
        this.$nextTick(() => {
          if (this.currentImg.srcProtocol) {
            this.$refs.wallpaperVideo.load();
            this.$refs.wallpaperVideo.play().catch((err) => { });
            this.imgSpin = false;
          }
        });
      } else {
        this.currentImg = {
          srcProtocol: null,
          value: "我的收藏",
          path: "",
          name: "my",
        };
        this.imgSpin = false;
      }
    },
    lastImg() {
      this.imgIndex -= 1;
      if (this.imgIndex < 0) {
        this.imgIndex = this.imgList.length - 1;
      }
    },
    async nextImg() {
      // if(this.imgIndex>=this.imgList.length-1){
      //   if(this.addressType.name ==='picking') {
      //
      //       let res = await  axios.get(this.addressType.path, {
      //         params: {
      //           no: 5
      //         }
      //       })
      //     if(res.data.data){
      //       let pickImage = res.data.data
      //       this.count = res.data.count
      //       let animations = ["ani-gray", "bowen", "ani-rotate"];
      //       if(pickImage){
      //         pickImage.forEach(img=>{
      //           if(img.thumburl !== null){
      //             let randomIndex = Math.floor(Math.random() * animations.length);
      //             const image = {
      //               title:false,
      //               src:img.thumburl,
      //               path:img.imgurl,
      //               resolution:img.size,
      //               score:img.score,
      //               no:img.no,
      //               animations: animations[randomIndex],
      //             }
      //             this.imgList.push(image)
      //           }
      //         })
      //       }
      //
      //     }else{
      //       this.imgIndex = 0
      //     }
      //
      //   }else {
      //     this.imgIndex = 0
      //   }
      //
      // }
      this.imgIndex += 1;
      if (this.imgIndex >= this.imgList.length) {
        this.imgIndex = 0;
      }
    },
    randomImg() {
      if (this.randomFlag === true) return;
      this.randomFlag = true;
      setTimeout(() => {
        this.randomFlag = false;
        let nmb = parseInt(Math.random() * this.imgList.length);
        this.imgIndex === nmb ? this.randomImg() : (this.imgIndex = nmb);
      }, 500);
    },
    collect() {
      if (this.addressType.name === "pickingPaper") {
        this.removeToMyPaper(this.imgList[this.imgIndex]);
      } else if (this.addressType.name === "bing") {
        let image = {
          src: this.imgList[this.imgIndex].src,
          path: this.imgList[this.imgIndex].src,
        };
        this.removeToMyPaper(image);
      }
    },
    settingImg() {
      if (this.addressType.name === "my") {
        if (this.imgList[this.imgIndex].srcProtocol) {
          this.setBackgroundImage({
            path: "",
            runpath: `file://${this.imgList[this.imgIndex].src}`,
          });
        } else {
          if (!this.imgList[this.imgIndex].path) {
            this.imgList[this.imgIndex].path = this.imgList[this.imgIndex].src;
          }

          this.setBackgroundImage(this.imgList[this.imgIndex]);
        }
      } else if (this.addressType.name === "lively") {
        this.doStartDownload(this.imgList[this.imgIndex]);
      } else {
        this.setBackgroundImage(this.imgList[this.imgIndex]);
      }
    },
    // doStartDownload (item) {
    //   message.info('开始下载壁纸')
    //   item.percent = 0
    //   tsbApi.download.start({
    //     url: this.getVideo(item),
    //     savePath: this.savePath + '/lively/' + item.name,
    //     updated: (args) => {
    //       item.done = 1
    //       item.percent = (args.downloadInfo.receivedBytes / args.downloadInfo.totalBytes * 100).toFixed(0)
    //       //https://www.electronjs.org/zh/docs/latest/api/download-item#%E4%BA%8B%E4%BB%B6%E5%90%8D-updated
    //     },
    //     done: (args) => {
    //       item.percent = 100
    //       item.done = 1
    //       message.success('动态壁纸下载完成')
    //     },
    //     willDownload: (args) => {
    //     }
    //   })
    // },
  },
  computed: {
    ...mapWritableState(paperStore, ["myPapers", "settings"]),
    isInMyPapers() {
      return (
        this.myPapers.findIndex((img) => {
          return this.imgList[this.imgIndex].src === img.src;
        }) > -1
      );
    },
    goSource() {
      this.$router.push({ name: this.addressType.name });
    },
    // savePath(){
    //   if(!this.settings.savePath){
    //     return ''
    //   }
    //   return this.settings.savePath
    // }
  },
  mounted() {
    // this.list = [...lively]
    // this.savePath = this.settings.savePath
    // lively2.forEach((w) => {
    //   this.list.push({
    //     name: w
    //   })
    // })
    // if (this.savePath) {
    //   //如果已经设置过下载地址了
    //   this.list.forEach(li => {
    //     if (fs.existsSync(require('path').join(this.savePath, 'lively', li.name))) {
    //       li.done = 1
    //     } else {
    //       li.done = 0
    //     }
    //   })
    // }
    // this.list.forEach(item =>{
    //   let url = this.getVideo(item)
    //   let local = ''
    //   if (item.done) {
    //     //如果是已经触发过下载的，则判断一下本地是否存在，存在则替换成本地播放链接
    //     local = path.join(this.savePath, 'lively', item.name)
    //   }
    //   if (fs.existsSync(local)) {
    //     url = 'file://' + local
    //   }
    //   item.srcProtocol = url
    // })
    this.$nextTick(() => {
      if (!this.customData) {
        this.pickFilterChange("我的收藏");
      } else {
        this.pickFilterValue = this.customData.value;
        this.pickFilterChange(this.customData.value);
      }
      this.setImg();
    });
  },
  watch: {
    imgIndex: {
      handler() {
        this.setImg();
      },
    },
  },
};
</script>

<style lang="scss" scoped>
.item-icon {
  width: 100px;
  height: 56px;
  border-radius: 12px;
  background: var(--secondary-bg);
  color: var(--primary-text);
  backdrop-filter: blur(20px);

  .icon {
    height: 36px;
    width: 36px;
  }
}
:deep(.ant-empty-image){
  height: 60px;
}
</style>
