<template>
  <a-spin tip="加载中..." :spinning="imgSpin" size="large">
    <Widget :options="options" :customIndex="customIndex" :menuList="menuList" :sizeList="sizeList" ref="cardSlot"  :desk="desk">
      <template #left-title-icon>
        <div class="absolute flex hover-container items-center top-2.5 left-0 justify-center" style="z-index:1000;">
          <xt-new-icon icon="fluent:image-multiple-16-regular" size="29" :color="'var(--active-text)'"></xt-new-icon>
       </div>
      </template>
      <template #title-text>
        <span class="xt-font xt-active-text font-14 font-400" style="z-index:1000;">{{ options.title }}</span>
      </template>
      
      <div class="absolute inset-0" style="border-radius: 8px; z-index: 0">
        <div class="w-full  flex flex-col items-center justify-center" :class="customData.width === 2 ? 'h-full':'h-60'" v-if="imgList.length <= 0">
          <newIcon icon="fluent-emoji:framed-picture" style="font-size: 3.5rem;" v-if="customData.width === 2"/>
          <div class="xt-font p-3 rounded-lg xt-text font-14 xt-bg-t-2  font-400" :class="customData.width === 2 ? 'my-6':'my-2'" :style="customData.width === 2 ? {width:'auto'} :{ width:'210px',}">
            我们提供多种壁纸源供你选择，快快挑选喜爱的壁纸，加入收藏吧。
          </div>
          <xt-button size="mini" :w="100" :h="40" type="theme" style="border-radius: 8px;" @click="goPickOut">去挑选</xt-button>
        </div>
        <div class="w-full h-full pointer" v-else >
        
          <div class="absolute top-shadow w-full top-0 left-0 h-12 "></div>
          <video class="fullscreen-video" ref="wallpaperVideo" style="border-radius: 8px; object-fit: cover"
                 playsinline="" autoplay="" muted="" loop="" v-if="getCustomDataPaper.srcProtocol">
            <source :src="getCustomDataPaper.srcProtocol" type="video/mp4" id="bgVid"/>
          </video>
          <img :src="getCustomDataPaper.middleSrc" @load="imgLoad" @error="imgError" alt="" class="w-full h-full"
               style="border-radius: 8px; object-fit: cover" v-else-if="getCustomDataPaper.middleSrc"/>
          <img :src="getCustomDataPaper.src" @load="imgLoad" alt="" @error="imgError" class="w-full h-full"
               style="border-radius: 8px; object-fit: cover" v-else/>
        </div>
      </div>

      <template v-if="imgList.length > 0">
        <div class="absolute bottom-0 pointer hover-container left-0 w-full h-full">
          <div class="absolute bottom-0 hover-item flex right-0" style="opacity: 0;">
            <xt-button w="40" h="40" class="xt-bg-t-3" style="border-radius: 8px ;margin: 0 12px 10px 0; " @click="lastImg">
              <div class="flex items-center justify-center">
                <xt-new-icon icon="fluent:chevron-left-16-regular" size="20"></xt-new-icon>
              </div>
            </xt-button>
            <xt-button w="40" h="40" class="xt-bg-t-3" style="border-radius: 8px ;margin: 0 12px 10px 0;" @click="nextImg">
              <div class="flex items-center justify-center">
                <xt-new-icon icon="fluent:chevron-right-16-regular" size="20"></xt-new-icon>
              </div>
            </xt-button>
            <xt-button w="40" h="40" class="xt-bg-t-3" style="border-radius: 8px ;margin: 0 12px 10px 0;" @click="randomImg">
              <div class="flex items-center justify-center">
                <xt-new-icon icon="fluent:arrow-clockwise-16-regular" :class="randomFlag ? 'replace-it' : ''" size="20"></xt-new-icon>
              </div>
            </xt-button>
            <xt-button w="40" h="40" class="xt-bg-t-3" style="border-radius: 8px ;margin: 0 12px 10px 0;" @click="collect">
              <div class="flex items-center justify-center">
                <xt-new-icon icon="fluent:star-16-regular" v-if="!isInMyPapers" size="20"></xt-new-icon>
                <xt-new-icon icon="fluent:star-16-filled" v-else size="20" :color="'var(--warning)'"></xt-new-icon>
              </div>
            </xt-button>
            <xt-button w="40" h="40" class="xt-bg-t-3" style="border-radius: 8px ;margin: 0 12px 10px 0;" v-if="customData.width === 2" @click="download(currentImg)">
              <div class="flex items-center justify-center">
                <xt-new-icon icon="fluent:arrow-download-16-regular" size="20"></xt-new-icon>
              </div>
            </xt-button>
            <xt-button w="40" h="40" class="xt-bg-t-3" style="border-radius: 8px ;margin: 0 12px 10px 0;" @click="setDeskPaper(currentImg)">
              <div class="flex items-center justify-center">
                <xt-new-icon icon="fluent:desktop-16-regular" size="20"></xt-new-icon>
              </div>
            </xt-button>
          </div>
        </div>
      </template>
    </Widget>
  </a-spin>

  <teleport to='body'>
    <WallpaperWidgetModal :modelValue="addressType.value" ref="paperWidgetRef" @updateCustomDatas="updateCustomDatas"/>
    <GalleryModal ref="galleryRef"/>
  </teleport>

</template>

<script>
import { mapActions, mapWritableState } from 'pinia';
import axios from 'axios';
import { message } from 'ant-design-vue';
import { paperStore } from '../../store/paper';
import { appStore } from '../../store';
import { cardStore } from '../../store/card';
import { lively, lively2 } from '../../js/data/livelyData';
import { Icon as newIcon } from '@iconify/vue';
import { wallpaperOptions } from '../../page/gallery/data/gallery';
import { getFileName } from '../../page/gallery/libs/utils';

import Widget from '../card/Widget.vue';
import WallpaperWidgetModal from '../paperModal/WallpaperWidgetModal.vue';
import GalleryModal from '../paperModal/GalleryModal.vue';


let fs = require('fs');
let path = require('path');


export default {
  name: 'MiddleWallpaper',
  components: {  Widget, newIcon,WallpaperWidgetModal,GalleryModal },
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
      default: () => { },
    }
  },
  data () {
    return {
      options: {
        className: 'card double', title: '壁纸',
        type: 'MiddleWallpaper',  icon: "",
      },
      addressType: {
        value: 'timeline',label: '拾光壁纸',
        path: 'https://api.nguaduot.cn/timeline/v2?client=thisky',
      },

      currentImg: {   srcProtocol: null,  path: '', },
      imgList: [{ src: '' }],
      imgIndex: 0,
      randomFlag: false,
      list: [],
      pickFilterValue: 'pickingPaper',
      imgSpin: false,
      wallpaperOptions: wallpaperOptions,

      // 大小切换
      sizeList: [
        { title: '2x2', height: 1,width: 1, name: '2x2',},
        { title: '4x4', height: 2, width: 2, name: '4x4', },
      ],
      // 右键菜单
      menuList:[
        { newIcon:'fluent:image-multiple-16-regular',title:'在应用中打开', fn:()=>{ this.goGallery(this.customData.value) }, },
        { newIcon:'fluent:chevron-up-16-regular',title:'上一张',fn:()=>{ this.lastImg() },  },
        { newIcon:'fluent:chevron-down-16-regular',title:'下一张',fn:()=>{ this.nextImg() },  },
        { newIcon:'fluent:arrow-clockwise-16-regular',title:'换一换',fn:()=>{ this.randomImg() },},
        { newIcon:'fluent:star-16-regular',title:'添加到收藏',fn:()=>{ this.collect() } },
        {
          newIcon:'fluent:more-horizontal-16-regular',title:'更多',
          lock: true,
          children:[
            {
              newIcon:'fluent:desktop-16-regular',title:'设为工作台壁纸',
              fn:()=>{ this.setDeskPaper(this.currentImg); },
            },
            {
              newIcon:'fluent:desktop-16-regular',title:'设为系统桌面壁纸',
              fn:()=>{ this.setSystemPaper(this.currentImg) },
            },
            {
              newIcon:'fluent:arrow-download-16-regular',title:'下载',
              fn:()=>{ this.download(this.currentImg) },
            },
          ]
        },
        {
          newIcon:'fluent:settings-16-regular', title: '设置', 
          fn:()=>{  this.$refs.paperWidgetRef.openWidgetModal()  }
        },
      ],
    }
  },

  computed: {
    ...mapWritableState(paperStore, ['myPapers', 'settings']),
    // 判断是否添加到收藏中
    isInMyPapers () {
      const index = this.myPapers.findIndex((img)=>{ return this.imgList[this.imgIndex].src === img.src });
      return index > -1;
    },
    // 计算属性获取壁纸存储在卡片中的数据
    getCustomDataPaper(){
      if(this.customData.paper){
        return this.customData.paper;
      }
      else {
        return this.currentImg;
      }
    }
  },

  methods: {
    ...mapActions(paperStore, ['removeToMyPaper']),
    ...mapActions(appStore, ['setBackgroundImage']),
    ...mapActions(cardStore, ['updateCustomData']),
    getFileName,
    // 进入对应的应用
    goGallery (value) {
      const paperType = ['wallhaven','timeline','glutton'];
      if(paperType.includes(value)) return this.$router.push({ name: 'pickingPaper' });
      if(value === 'my') return this.$router.push({ name:  'my'});
      if(value === 'bing') return this.$router.push({ name:  'bing'});
    },

    // 空状态进行挑选
    goPickOut(){
      this.$refs.galleryRef.openGalleryModal();
    },

    // 图片加载
    imgLoad () { 
      this.imgSpin = true;
      setTimeout(()=>{
        this.imgSpin = false
      },10);
    },

    // 获取壁纸数据
    pickFilterChange (e) {
      this.addressType = this.wallpaperOptions.find((i) => i.value === e) || this.wallpaperOptions[0];
      this.updateCustomData(this.customIndex, this.addressType, this.desk);
      this.options.title = this.addressType.label;
      if (this.addressType.value !=='my') {
        this.imgSpin = true;
        axios
          .get(this.addressType.path)
          .then((res) => {
            this.imgList = []
            if (res.data.data) {
              let pickImage = res.data.data
              this.count = res.data.count
              let animations = ['ani-gray', 'bowen', 'ani-rotate']
              if (pickImage) {
                pickImage.forEach((img) => {
                  if (img.thumburl !== null) {
                    let thumburl = ''
                    let str = ''
                    let randomIndex = Math.floor(
                      Math.random() * animations.length
                    )
                    if (img.thumburl.indexOf('@') !== -1) {
                      str = img.thumburl.substring(
                        img.thumburl.indexOf('@'),
                        img.thumburl.length
                      )
                      thumburl = img.thumburl.replace(str, '@1200w.webp')
                    }
                    if (img.thumburl.indexOf('400') !== -1) {
                      thumburl =
                        img.thumburl.substring(0, img.thumburl.indexOf('400')) +
                        '1200' +
                        img.thumburl.slice(
                          img.thumburl.indexOf('400') - img.thumburl.length + 3
                        )
                    }
                    if (img.thumburl.indexOf('fw') !== -1) {
                      str = img.thumburl.substring(
                        img.thumburl.indexOf('fw'),
                        img.thumburl.length
                      )
                      thumburl = img.thumburl.replace(str, 'fw1200webp')
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
                    }
                    this.imgList.push(image)
                  }
                })
              }
            } else {
              let images = res.data.images
              let animations = ['ani-gray', 'bowen', 'ani-rotate']
              if (images) {
                images.forEach((img) => {
                  let random = Math.random()
                  let randomIndex = Math.floor(
                    Math.random() * animations.length
                  )
                  let image = {
                    title: false, // img.title,
                    src: 'https://cn.bing.com' + img.url,
                    path: 'https://cn.bing.com' + img.url,
                    animation: animations[randomIndex], //['gray','rate'][(Math.random()*2).toFixed()]//''slide','fade','scale',
                  }
                  this.imgList.push(image)
                })
              }
            }
            this.initImg()
          })
          .catch((err) => {
            this.imgList = []
            this.imgIndex = 0
            this.imgSpin = false
          }).finally(()=>{
            this.imgSpin = false
          })
      } else if (this.addressType.value === 'my') {
        this.imgList = this.myPapers
        this.initImg()
      }
    },

    // 初始化壁纸图片
    initImg () {
      this.imgIndex = 0
      this.setImg()
    },

    // 预防图片裂掉
    imgError () {
      this.imgSpin = false
      this.currentImg.src = '/img/defaultImg.jpg'
    },

    // 设置当前组件壁纸
    setImg () {
      this.imgSpin = true;
      if(this.customData && this.customData.paper){
        this.currentImg = this.customData.paper;
        this.imgSpin = false;
      }
      else {
        this.imgSpin = true;
        setTimeout(()=>{
          if (this.imgList.length > 0) {
            this.currentImg = this.imgList[this.imgIndex];
            this.$nextTick(()=>{
             if (this.currentImg.srcProtocol){
              this.$refs.wallpaperVideo.load();
              this.$refs.wallpaperVideo.play().catch((err) => { });
              this.imgSpin = false; 
             }
            })
          }
          else {
            this.currentImg = {
              srcProtocol: null,
              value: '我的收藏',
              path: '',name: 'my',
            }
            this.imgSpin = false
          }
        },500)
      }
    },

    // 上一张壁纸
    lastImg () {
      this.imgIndex -= 1
      if (this.imgIndex < 0) {
        this.imgIndex = this.imgList.length - 1
      }
      this.customData.paper = this.imgList[this.imgIndex];
    },

    // 下一张壁纸
    async nextImg () {
      this.imgIndex += 1
      if (this.imgIndex >= this.imgList.length) {
        this.imgIndex = 0
      }
      this.customData.paper = this.imgList[this.imgIndex];
    },

    // 随机一张壁纸
    randomImg () {
      if (this.randomFlag === true) return
      this.imgSpin = true
      this.randomFlag = true
      setTimeout(() => {
        this.randomFlag = false
        this.imgSpin = false
        let nmb = parseInt(Math.random() * this.imgList.length)
        this.imgIndex === nmb ? this.randomImg() : (this.imgIndex = nmb)
        this.customData.paper = this.imgList[this.imgIndex];
      }, 500)
      
    },

    // 收藏壁纸
    collect () {
      if (this.addressType.value!=='my' && this.addressType.name!== 'bing') {
        this.removeToMyPaper(this.imgList[this.imgIndex])
      } else if (this.addressType.name === 'bing') {
        let image = {
          src: this.imgList[this.imgIndex].src,
          path: this.imgList[this.imgIndex].src,
        }
        this.removeToMyPaper(image)
      }
    },

    // 设置工作台壁纸
    setDeskPaper(paper){
      message.info('正在设置桌面壁纸');
      this.setBackgroundImage(paper);
      setTimeout(()=>{
        message.success('桌面壁纸设置完成');
      },800)
    },

    // 下载
    download(img){
     if(this.settings.savePath === ''){
      this.$xtConfirm('您尚未设置壁纸保存目录，请设置目录，设置目录后下载将自动开始。','',{
        index:1020,
        ok: async() => {
          await this.queryStart();
        },
        no: () => {},
        noText: '取消',
        type:'warning'
      })
     }
     else {
      const fileRegex = /^file:/;
      const regex = /^https:\/\/up\.apps\.vip/;
      const exist = fileRegex.test(img.path);
      // 判断是否为本地图片
      if(!exist && !regex.test(img.path)){ this.doStartDownload(img); }
      else { 
        this.$xtConfirm('图片已下载','',{
          index:1020, 
          ok: async() => {},
          no: () => {},
          noText: null,
          type:'warning'
        }) 
      }
     }
    },
    doStartDownload(item){
      message.info('开始下载壁纸');
      item.percent = 0;
      const name = getFileName(item.path)
      tsbApi.download.start({
        url:item.src,
        savePath: this.settings.savePath + '/static/' + name,
        updated: (args) => {
          item.done = 1
          item.percent = (args.downloadInfo.receivedBytes / args.downloadInfo.totalBytes * 100).toFixed(0)
        },
        done: (args) => {
          item.percent = 100
          item.done = 1
          message.success('下载完成')
        },
        willDownload: (args) => {
        }
      })
    },
    async queryStart (){
     let savePath = await tsbApi.dialog.showOpenDialog({
      title: '选择目录', message: '请选择下载壁纸的目录',
      properties: [ 'openDirectory', 'createDirectory',]
     })
     if (savePath) {
      this.settings.savePath = savePath[0]
      this.doStartDownload(this.myCurrentID)
     } 
    },


    // 设置系统桌面壁纸
    setSystemPaper(paper){
      if(paper){
        this.$xtConfirm('确定将此壁纸设置为系统桌面壁纸','确定将此壁纸设置为系统桌面壁纸？注意，此处设置不是工作台的壁纸。',{
          index:1020,
          ok: () => {
           message.info('正在为您下载并设桌面壁纸')
           tsbApi.system.setPaper(paper.path)
          },
          no: () => {},
          noText: '取消',
          type:'warning'
        })
      }
    },

    // 切换壁纸源
    updateCustomDatas(value){
      this.customData.value = value;
      this.pickFilterChange(value);
    }
  },
  
  mounted () {
    this.$nextTick(() => {
      if (!this.customData) {
        this.pickFilterChange('timeline')
      } else {
        this.pickFilterValue = this.customData.value
        this.pickFilterChange(this.customData.value)
      }
      this.setImg()
    })
  },

  watch: {
    imgIndex: {
      handler () {
        this.setImg()
      },
    },
  },
}
</script>

<style lang="scss" scoped>
.hover-container{
  &:hover{
    .hover-item{
      opacity: 1 !important;
    }
  }
}
.xt-bg-t-3{
  background: rgba(0,0,0,0.5) !important;
}

.top-shadow{
  background-image: linear-gradient(180deg, rgba(0,0,0,0.50) 0%, rgba(0,0,0,0.00) 100%);
}
</style>
