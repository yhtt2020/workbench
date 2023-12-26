<template>
  <a-spin tip="加载中..." :spinning="imgSpin" size="large">
    <Widget :options="options" :customIndex="customIndex" :menuList="menuList" :sizeList="sizeList" ref="cardSlot" :desk="desk">
      <template #left-title-icon>
        <div class="absolute flex items-center top-2.5 left-0 justify-center" style="z-index:1000;">
          <xt-new-icon icon="fluent:image-multiple-16-regular" size="29"></xt-new-icon>
          <span class="xt-font xt-text font-14 font-400">{{ options.title }}</span>
       </div>
      </template>
      
      <div class="absolute inset-0" style="border-radius: 8px; z-index: 0">
        <div class="w-full h-full flex flex-col items-center justify-center" v-if="imgList.length <= 0">
          <newIcon icon="fluent-emoji:framed-picture" style="font-size: 3.5rem;"/>
          <span class="xt-font xt-text font-14 xt-bg-t-2 my-6 font-400">我们提供了以下几种壁纸源供你选择，快快挑选喜爱的壁纸，加入收藏吧。</span>
          <xt-button size="mini" :w="100" :h="40" type="theme" style="border-radius: 8px;" @click="goGallery">去挑选</xt-button>
        </div>
        <div class="w-full h-full pointer" v-else @click="goSource">
          <video class="fullscreen-video" ref="wallpaperVideo" style="border-radius: 8px; object-fit: cover"
                 playsinline="" autoplay="" muted="" loop="" v-if="currentImg.srcProtocol">
            <source :src="currentImg.srcProtocol" type="video/mp4" id="bgVid"/>
          </video>

          <img :src="currentImg.middleSrc" @load="imgLoad" @error="imgError" alt="" class="w-full h-full"
               style="border-radius: 8px; object-fit: cover" v-else-if="currentImg.middleSrc"/>
          <img :src="currentImg.src" @load="imgLoad" alt="" @error="imgError" class="w-full h-full"
               style="border-radius: 8px; object-fit: cover" v-else/>
        </div>
      </div>

      <template v-if="imgList.length > 0" >
        <div class="absolute w-full bottom-0  left-1/2 hover-container  -translate-x-1/2   flex items-center justify-end" >
          <div style=" opacity: 0;" class="flex hover-item flex-wrap items-center justify-center"  :style="customData.width !== 2 ? { width: '160px' } : {}">
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
                <xt-new-icon icon="fluent:arrow-clockwise-16-regular" size="20"></xt-new-icon>
              </div>
            </xt-button>
            <xt-button w="40" h="40" class="xt-bg-t-3" style="border-radius: 8px ;margin: 0 12px 10px 0;" @click="collect">
              <div class="flex items-center justify-center">
                <xt-new-icon icon="fluent:star-16-regular" v-if="!isInMyPapers" size="20"></xt-new-icon>
                <xt-new-icon icon="fluent:star-16-filled" v-else size="20" :color="'var(--warning)'"></xt-new-icon>
              </div>
            </xt-button>
            <xt-button w="40" h="40" class="xt-bg-t-3" style="border-radius: 8px ;margin: 0 12px 10px 0;">
              <div class="flex items-center justify-center">
                <xt-new-icon icon="fluent:arrow-download-16-regular" size="20"></xt-new-icon>
              </div>
            </xt-button>
            <xt-button w="40" h="40" class="xt-bg-t-3" style="border-radius: 8px ;margin: 0 12px 10px 0;" @click="settingImg">
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
  </teleport>

  <!-- <a-drawer :width="500" v-model:visible="settingVisible" placement="right">
    <template #title>
      <div class="text-center">「壁纸」设置</div>
    </template>
    <div class="text-base">壁纸源</div>
    <a-select style="
        border: 1px solid rgba(255, 255, 255, 0.1);
      " class="w-full h-10 mt-4 text-xs rounded-lg" size="large" :bordered="false" v-model:value="pickFilterValue"
              @change="pickFilterChange($event)" :options="wallpaperOptions">
    </a-select>
  </a-drawer> -->
</template>

<script>
import { mapActions, mapWritableState } from 'pinia';
import axios from 'axios';
import { Empty, message } from 'ant-design-vue';
import { paperStore } from '../../store/paper';
import { appStore } from '../../store';
import { cardStore } from '../../store/card';
import { lively, lively2 } from '../../js/data/livelyData';
import { Icon as newIcon } from '@iconify/vue';

import Widget from '../card/Widget.vue';
import WallpaperWidgetModal from '../paperModal/WallpaperWidgetModal.vue';

let fs = require('fs');
let path = require('path');


export default {
  name: 'MiddleWallpaper',
  components: {  Widget, newIcon,WallpaperWidgetModal },
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
      imgSpin: false,
      options: {
        className: 'card double',
        title: '壁纸',
        // icon: "image",
        type: 'MiddleWallpaper',
      },
      // 右键菜单
      menuList:[
        { newIcon:'fluent:image-multiple-16-regular',title:'在应用中打开', fn:()=>{ this.goGallery() }, },
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
              fn:()=>{},
            },
            {
              newIcon:'fluent:desktop-16-regular',title:'设为系统桌面壁纸',
              fn:()=>{},
            },
            {
              newIcon:'fluent:arrow-download-16-regular',title:'下载',
              fn:()=>{},
            },
          ]
        },
        {
          newIcon:'fluent:settings-16-regular', title: '设置', 
          fn:()=>{  this.$refs.paperWidgetRef.openWidgetModal()  }
        },
      ],
      // 大小切换
      sizeList: [
        { title: '2x2', height: 1,width: 1, name: '2x2',},
        { title: '4x4', height: 2, width: 2, name: '4x4', },
      ],



      pickFilterValue: 'pickingPaper',
      wallpaperOptions: [
        {
          label: '拾光壁纸',
          path: 'https://api.nguaduot.cn/timeline/v2?client=thisky',
          value: 'timeline',
        },
        { label: '我的收藏', value: 'my', path: '' },
        {
          label: '必应壁纸',
          value: 'bing',
          path: 'https://cn.bing.com/HPImageArchive.aspx?format=js&idx=1&n=8',
        },

        {
          label: '贪食鬼',
          path: 'https://api.nguaduot.cn/glutton/v2?client=thisky',
          value: 'glutton',
        },
        {
          label: '贪吃蛇',
          path: 'https://api.nguaduot.cn/snake/v2?client=thisky',
          value: 'snake',
        },
        {
          label: 'Wallhaven',
          path: 'https://api.nguaduot.cn/wallhaven/v2?client=thisky',
          value: 'wallhaven',
        },
      ],
      settingVisible: false,
      simpleImage: '/public/img/test/load-ail.png',
      addressType: {
        value: 'timeline',
        path: 'https://api.nguaduot.cn/timeline/v2?client=thisky',
        label: '拾光壁纸',
      },
      imgList: [{ src: '' }],
      currentImg: {
        srcProtocol: null,
        path: '',
      },
      imgIndex: 0,
      randomFlag: false,
      list: [],
    }
  },
  methods: {
    ...mapActions(paperStore, ['removeToMyPaper']),
    ...mapActions(appStore, ['setBackgroundImage']),
    ...mapActions(cardStore, ['updateCustomData']),
    goGallery () {
      this.$router.push({ name: 'pickingPaper' })
    },
    imgLoad () {
      this.imgSpin = false
    },
    openRight () {
      this.settingVisible = true
    },
    pickFilterChange (e) {
      this.addressType = this.wallpaperOptions.find((i) => i.value === e) || this.wallpaperOptions[0]
      this.updateCustomData(this.customIndex, this.addressType, this.desk)
      this.options.title = this.addressType.label
      if (this.addressType.value !=='my') {
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
          })
      } else if (this.addressType.value === 'my') {
        this.imgList = this.myPapers
        this.initImg()
      }
    },
    initImg () {
      this.imgIndex = 0
      this.setImg()
    },
    imgError () {
      this.imgSpin = false
      this.currentImg.src = '/img/defaultImg.jpg'
    },
    setImg () {
      this.imgSpin = true
      if (this.imgList.length > 0) {
        this.currentImg = this.imgList[this.imgIndex]
        this.$nextTick(() => {
          if (this.currentImg.srcProtocol) {
            this.$refs.wallpaperVideo.load()
            this.$refs.wallpaperVideo.play().catch((err) => { })
            this.imgSpin = false
          }
        })
      } else {
        this.currentImg = {
          srcProtocol: null,
          value: '我的收藏',
          path: '',
          name: 'my',
        }
        this.imgSpin = false
      }
    },
    lastImg () {
      this.imgIndex -= 1
      if (this.imgIndex < 0) {
        this.imgIndex = this.imgList.length - 1
      }
    },
    async nextImg () {
      this.imgIndex += 1
      if (this.imgIndex >= this.imgList.length) {
        this.imgIndex = 0
      }
    },
    randomImg () {
      if (this.randomFlag === true) return
      this.randomFlag = true
      setTimeout(() => {
        this.randomFlag = false
        let nmb = parseInt(Math.random() * this.imgList.length)
        this.imgIndex === nmb ? this.randomImg() : (this.imgIndex = nmb)
      }, 500)
    },
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
    settingImg () {
      if (this.addressType.value === 'my') {
        if (this.imgList[this.imgIndex].srcProtocol) {
          this.setBackgroundImage({
            path: '',
            runpath: `file://${this.imgList[this.imgIndex].src}`,
          })
        } else {
          if (!this.imgList[this.imgIndex].path) {
            this.imgList[this.imgIndex].path = this.imgList[this.imgIndex].src
          }
          this.setBackgroundImage(this.imgList[this.imgIndex])
        }
      } else if (this.addressType.value === 'lively') {
        this.doStartDownload(this.imgList[this.imgIndex])
      } else {
        this.setBackgroundImage(this.imgList[this.imgIndex])
      }
    },
    updateCustomDatas(value){
      const find = this.wallpaperOptions.find((find)=>{ return String(find.value) === String(value) });
      this.customData.value = value;
      this.pickFilterChange(find)
    }
  },
  computed: {
    ...mapWritableState(paperStore, ['myPapers', 'settings']),
    isInMyPapers () {
      return (
        this.myPapers.findIndex((img) => {
          return this.imgList[this.imgIndex].src === img.src
        }) > -1
      )
    },
    goSource () {
      switch (this.addressType.value){
        case 'my':
          this.$router.push({ name:  'my'})
          break
        case 'bing':
          this.$router.push({ name:  'bing'})
          break
        default:
          this.$router.push({ name:  'pickingPaper'})
          break
      }
    },
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
</style>
