<template>
  <div class="w-full h-full flex  flex-col">
    <div class="h-10 flex items-center justify-between mb-5">
      <div class="flex items-center justify-center">
        <MyIcon icon="fluent:star-16-regular" style="font-size: 1.25rem;" class="mr-2 xt-text"/>
        <span  class="s-text xt-text xt-font font-16 font-600">我的收藏 （{{ myPapers.length }}）</span>
      </div>
      <div class="flex items-center justify-center">
        <xt-button @click="playAll" h="40" class="mr-3 xt-bg-t-2">
          <div class="flex items-center justify-center">
            <MyIcon icon="fluent:play-16-filled" style="font-size: 1.25rem;" class="xt-text mr-2"/>
            <span  class="s-text xt-text xt-font font-16 font-400">轮播全部</span> 
          </div>
        </xt-button>
        <xt-button w="154" h="40" @click="playActive" class="mr-3 xt-bg-t-2">
          <div class="flex items-center justify-center">
            <MyIcon icon="fluent:play-16-filled" style="font-size: 1.25rem;" class="xt-text mr-2"/>
            <span  class="s-text xt-text xt-font font-16 font-400">轮播选中（ {{ activePapers.length }} ）</span> 
          </div>
        </xt-button>
        <xt-button w="154" h="40"  @click="this.visibleImport = true" class="xt-bg-t-2">
          <div class="flex items-center justify-center">
            <MyIcon icon="fluent:arrow-download-16-regular" style="font-size: 1.25rem;" class="xt-text mr-2"/>
            <span  class="s-text xt-text xt-font font-16 font-400">导入本地图片</span> 
          </div>
        </xt-button>
      </div>
    </div>

    <div style="flex-grow: 1;flex-shrink: 1;height: 0">
      <!-- <div v-if="myPapers.length === 0">
        <a-empty style="margin-top: 3em" description=""></a-empty>
        <a-button type="primary" @click="go">去挑选心仪的壁纸</a-button>
      </div> -->
      <div class="w-full h-full flex flex-1 flex-col items-center justify-center"   v-if="myPapers.length === 0">
        <MyIcon icon="fluent-emoji:framed-picture" style="font-size: 3.5rem;"/>
        <span class="xt-font xt-text font-14 my-6 font-400">我们提供了以下几种壁纸源供你选择，快快挑选喜爱的壁纸，加入收藏吧。</span>
        <div class="w-full flex items-center justify-center" >
          <xt-button  h="40"  v-for="item in emptyList" class="xt-bg-t-2 mr-3" style="border-radius: 10px;" @click="goDetail(item)">
            <div class="flex items-center justify-center">
              <MyIcon :icon="item.newIcon" style="font-size:1.25rem ;" class="mr-2"/>
              <span class="xt-font xt-text font-16 font-400">{{item.name}}</span>
            </div>
          </xt-button>
        </div>
      </div>
  
      <vue-custom-scrollbar id="containerWrapper" v-else :settings="settingsScroller"
        style="flex-shrink: 1;flex-grow: 1;height: 100%">
        <viewer :images="myPapers" :options="options">
          <a-row :gutter="[20, 20]" id="bingImages">
            <a-col class="image-wrapper" v-for="img in myPapers" :span="6" style="">
              <img @contextmenu.stop="showMenu(img)" @error="deleteAll(img)" :data-source="img.path" :alt="img.resolution"
                class="image-item pointer" :src="fileImageExtension(img) === true ? img.path : img.src"
                style="position: relative">
              <div @click="previewVideo(img)" v-if="fileImageExtension(img) === true" class="play-icon pointer" style="">
                <Icon icon="bofang" style="font-size:3em;margin-top: 8px"></Icon>
              </div>
              <div style="position: absolute;right: 0;top: -10px ;padding: 10px">
                <div @click.stop="addToActive(img)" class="bottom-actions pointer"
                  :style="{ background: isInActive(img) ? 'rgba(255,0,0,0.66)' : '' }">
                  <Icon v-if="!isInActive(img)" icon="tianjia1"></Icon>
                  <Icon v-else style="" icon="yiwancheng"></Icon>
                </div>
              </div>
              <div id="mse" v-if="fileImageExtension(img) === true"></div>
            </a-col>
          </a-row>
        </viewer>
      </vue-custom-scrollbar>
    </div>
  </div>

 
  <a-drawer v-model:visible="visibleMenu" placement="bottom" :height="200">
    <a-row :gutter="20" style="text-align: center">
      <a-col :span="3">
        <div @click="setDesktopPaper" class="btn">
          <Icon style="font-size: 3em" icon="tianjia1"></Icon>
          <div>设置桌面壁纸</div>
        </div>
      </a-col>

      <a-col :span="3">
        <div @click="download()" class="btn">
          <Icon style="font-size: 3em" icon="xiazai"></Icon>
          <div>下载壁纸</div>
        </div>
      </a-col>

      <a-col :span="3">
        <div class="btn" @click="del()">
          <Icon icon="guanbi2" style="font-size: 3em"></Icon>
          <div>删除该壁纸</div>
        </div>
      </a-col>
      <a-col :span="4">
        <div class="btn relative" @click="setAppPaper">
          <Icon icon="tianjia1" style="font-size: 3em"></Icon>
          <div>设为工作台背景</div>
          <GradeSmallTip powerType="mainWallpaper"></GradeSmallTip>
        </div>
      </a-col>
    </a-row>
  </a-drawer>

  <a-drawer v-model:visible="visibleImport" title="导入本地图片" placement="right" class="no-drag" width="500">
    <Import :loadStaticPaper="loadStaticPaper" :getLoadLively="getLoadLively"></Import>
  </a-drawer>

 <div v-show="previewVideoVisible" style="position: fixed;left: 0;right: 0;top: 0;bottom: 0;z-index:9999999" id="previwer">
  <div id="actions" class="no-drag" style="position: fixed;right: 2em;top: 2em;z-index: 9999999999;">
   <div @click="closePreview" class="btn pointer" style="background: rgba(0,0,0,0.76);min-width: 4em;">
     <Icon icon="guanbi1" style="font-size: 2em"></Icon>
   </div>
  </div>
  <div id="my-mse"></div>
 </div>  
</template>

<script>
import { mapWritableState, mapActions } from 'pinia'
import { appStore } from '../../store'
import Import from './Import.vue'
import { message, Modal } from 'ant-design-vue'
import { Icon as MyIcon } from '@iconify/vue';
import GradeSmallTip from "../../components/GradeSmallTip.vue";
import Spotlight from 'spotlight.js';
import { galleryList } from './data/gallery';

const fs = window.$models.fs
const path = require('path')
import { paperStore } from '../../store/paper'
import Player from 'xgplayer/dist/simple_player'
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'My',
  components: { Import, GradeSmallTip,MyIcon },
  computed: {
    ...mapWritableState(paperStore, ['settings', 'activePapers', 'myPapers']),
    ...mapWritableState(appStore, ['backgroundImage', 'styles']),
  },
  data() {
    return {
      visibleMenu: false,
      visibleImport: false,
      settingsScroller: {
        useBothWheelAxes: true,
        swipeEasing: true,
        suppressScrollY: false,
        suppressScrollX: true,
        wheelPropagation: true
      },
      livelyPapers: [],
      currentPaper: null,//当前壁纸，显示菜单用
      paperTime: '',
      livelyTime: '',
      previewVideoVisible: false,
      options: {
        url: 'data-source',
      },
      emptyList:galleryList.list,
    }
  },
  mounted() {
    if (this.settings.savePath) {
      this.getLoadLively()
      this.loadStaticPaper()
    }
    $('#previwer').mousemove(() => {
      $('#actions').show()
      if (this.timer) {
        clearTimeout(this.timer)
      }
      this.timer = setTimeout(() => {
        $('#actions').fadeOut()
      }, 5000)
    })
  },
  methods: {
    ...mapActions(paperStore, ['addToActive', 'addToMyPaper', 'addToStaticPaper']),
    ...mapActions(appStore, ['setBackgroundImage']),
    go() {
      this.$router.push({ name: 'pickingPaper' })
    },
    // 获取本地视频目录数据
    getLoadLively() {
      fs.pathExists(path.join(this.settings.savePath, 'lively')).then((exists) => {
        if (exists) {
          const videos = fs.readdirSync(path.join(this.settings.savePath, 'lively'))
          videos.filter(v => {
            let videoPath = path.join(this.settings.savePath, 'lively', v)
            const filename = path.basename(videoPath, '.mp4')
            const livelyItem = {
              src: videoPath,
              path: `https://up.apps.vip/lively/${filename}.jpg`,
              srcProtocol: 'file://' + path.join(this.settings.savePath, 'lively', v),
            }
            this.addToStaticPaper(livelyItem)
          })
        } else {
          this.myPapers = []
        }
      })
    },
    // 获取本地图片数据
    loadStaticPaper() {
      const staticDir = path.join(path.join(this.settings.savePath), 'static')
      // 判断文件目录是否存在
      fs.pathExists(staticDir).then((exists) => {
        // 存在就读取指定壁纸目录
        if (exists) {
          let promptPaper = fs.readdirSync(staticDir)
          promptPaper.map(el => {
            this.getFileCreatedTime(path.join(`${staticDir}/${el}`)).then(createTime => {
              this.paperTime = this.changeTime(createTime)
            }).catch(err => {
            })
            let image = {
              title: false,
              src: `file://${staticDir}/${el}`,
              path: `file://${staticDir}/${el}`,
              time: this.paperTime
            }
            this.addToStaticPaper(image)
          })
        } else {  // 不存在就删除
          this.$emit('error')
        }
      })
    },

    setDesktopPaper() {
      Modal.confirm({
        content: '确定将此壁纸设置为系统桌面壁纸？注意，此处设置不是工作台的壁纸。',
        okText: '设置桌面壁纸',
        onOk: () => {
          message.info('正在为您下载并设桌面壁纸')
          tsbApi.system.setPaper(this.currentPaper.path)
          this.visibleMenu = false
        }
      })
    },

    showMenu(item) {
      this.currentPaper = item
      this.visibleMenu = true
    },
    setAppPaper() {
      // // 1 清除样式
      // const value = cache.get("style")
      // document.documentElement.classList.remove(value);
      // cache.del("background")
      // // 2 判断白天黑夜
      // if (this.styles) {
      //   document.documentElement.classList.add("light-model");
      //   cache.set("style","light-model")
      // } else {
      //   document.documentElement.classList.add('dark-model');
      //   cache.set("style","dark-model")

      // }
      message.info('正在为您设置背景')
      if (this.currentPaper.srcProtocol) {
        this.setBackgroundImage({
          path: '',
          runpath: `file://${this.currentPaper.src}`
        })
      } else {
        if (!this.currentPaper.path) {
          this.currentPaper.path = this.currentPaper.src
        }

        this.setBackgroundImage(this.currentPaper)
      }

      this.visibleMenu = false
    },
    playAll() {
      const imageArr = []
      this.myPapers.map(el => {
        if (this.fileImageExtension(el)) {
          if (el.srcProtocol !== undefined) {
            imageArr.push({
              'src-mp4': `file://${el.src}`,
              media: 'video',
              poster: el.path
            })
          }
        } else {
          imageArr.push({
            src: el.path,
          })
        }
      })
      window.Spotlight.show(imageArr, {
        control: 'autofit,page,fullscreen,close,zoom,prev,next',
        play: true,
        autoslide: true,
        infinite: true,
        progress: false,
        title: false,
        autoplay: true,
      })
    },

    playActive() {
      const playArr = []
      this.activePapers.map(el => {
        if (this.fileImageExtension(el)) {
          playArr.push({
            'src-mp4': el.srcProtocol,
            media: 'video',
            poster: el.path
          })
        } else {
          playArr.push({
            src: el.path,
          })
        }
      })
      window.Spotlight.show(playArr, {
        control: 'autofit,page,fullscreen,close,zoom,prev,next',
        play: true,
        autoslide: true,
        infinite: true,
        progress: false,
        title: false,
        autoplay: true,
      })
    },

    // 获取文件时间
    async getFileCreatedTime(filePath) {
      try {
        const stats = await fs.stat(filePath)
        return stats.birthtime
      } catch (err) {
        console.error(err)
      }
    },

    // 时间转换
    changeTime(msec) {
      let datetime = new Date(msec)
      let year = datetime.getFullYear()
      let month = datetime.getMonth()
      let date = datetime.getDate()
      let hour = datetime.getHours()
      let minute = datetime.getMinutes()
      let second = datetime.getSeconds()
      return year + '/' + ((month + 1) >= 10 ? (month + 1) : '0' + (month + 1)) + '/' + ((date + 1) < 10 ? '0' + date : date) + ' ' + ((hour + 1) < 10 ? '0' + hour : hour) + ':' + ((minute + 1) < 10 ? '0' + minute : minute) + ':' + ((second + 1) < 10 ? '0' + second : second)
    },

    isInActive(image) {
      return this.activePapers.findIndex(img => {
        return image.src === img.src
      }) > -1
    },

    // 删除壁纸
    del() {
      const imageExtensions = ['jpg', 'jpeg', 'gif', 'bmp', 'png']
      if (this.fileImageExtension(this.currentPaper)) {
        this.activePapers.filter(img => {
          if (img.path === this.currentPaper.path) {
            this.activePapers.splice(this.currentPaper.path, 1)
          }
        })
        fs.removeSync(path.join(this.currentPaper.src))
        if (this.myPapers.indexOf(this.currentPaper) !== -1) {
          this.myPapers.splice(this.myPapers.indexOf(this.currentPaper), 1)
        }
      } else {
        const findIndex = this.activePapers.findIndex(img => {
          if (img.src === this.currentPaper.src)
            return true
        })
        this.activePapers.splice(findIndex, 1)
        if (this.currentPaper.src.split('//')[0] === 'file:' && imageExtensions.indexOf(this.currentPaper.src.split('.')[1]) !== -1) {
          fs.removeSync(path.join(this.currentPaper.src.split('//')[1]))
          if (this.myPapers.indexOf(this.currentPaper) !== -1) {
            this.myPapers.splice(this.myPapers.indexOf(this.currentPaper), 1)
          }
        } else {
          if (this.myPapers.indexOf(this.currentPaper) !== -1) {
            this.myPapers.splice(this.myPapers.indexOf(this.currentPaper), 1)
          }
        }
      }
      this.visibleMenu = false
    },

    // 删除有问题的图片
    deleteAll(img) {
      this.myPapers.indexOf(img) !== -1 ? this.myPapers.splice(this.myPapers.indexOf(img), 1) : ''
    },

    closePreview() {
      this.previewVideoVisible = false
      if (window.$xgplayer) {
        window.$xgplayer.destroy()
        window.$xgplayer = null
      }
    },
    // 判断文件是否为图片
    fileImageExtension(filePath) {
      const fileExtensions = filePath.src.split('.').pop()
      const extensions = ['mp4', 'mpeg', 'avi', 'rmvb']
      if (extensions.indexOf(fileExtensions) !== -1) {
        return true
      } else {
        return false
      }
    },
    // 视频播放
    previewVideo(img) {
      $('#actions').show()
      this.timer = setTimeout(() => {
        $('#actions').fadeOut()
      }, 5000)
      this.previewVideoVisible = true
      if (window.$xgplayer) {
        window.$xgplayer.destroy()
      }
      const url = `${img.srcProtocol}`
      window.$xgplayer = new Player({
        id: 'my-mse',
        url: url,
        // fitVideoSize: 'fixWidth',
        fitVideoSize: 'fixWidth',
        // width:300,
        // height:300,
        loop: true,
        fluid: true,
        videoInit: true,
        autoplay: true
      })
    },
    closePreview() {
      this.previewVideoVisible = false
      if (window.$xgplayer) {
        window.$xgplayer.destroy()
        window.$xgplayer = null
      }
    },
    
    // 下载壁纸
    download() {
      if(this.settings.savePath === ''){
        Modal.confirm({
          centered:true,
          style:{'z-index':999999},
          content: '您尚未设置壁纸保存目录，请设置目录，设置目录后下载将自动开始。',
          onOk: async () => {
            await this.queryStart()
          }
        })
      }else{
        // console.log('测试::>>',this.currentPaper.path)
        this.doStartDownload(this.currentPaper.path)
      }
    },

    // 开始下载
    doStartDownload(item){
      message.info('开始下载壁纸')
      const name = this.currentPaper.path.split('&')[1].slice(3)
      // item.percent = 0
      tsbApi.download.start({
        url: item,
        savePath: this.settings.savePath + '/static/' + name,
        // updated: (args) => {
        //   // item.done = 1
        //   // item.percent = (args.downloadInfo.receivedBytes / args.downloadInfo.totalBytes * 100).toFixed(0)
        //   //https://www.electronjs.org/zh/docs/latest/api/download-item#%E4%BA%8B%E4%BB%B6%E5%90%8D-updated
        // },
        done: (args) => {
          // item.percent = 100
          // item.done = 1
          message.success('壁纸下载完成')
        },
        willDownload: (args) => {
        }
      })
      this.visibleMenu = false
    },

    // 选择目录
    async queryStart () {
      let savePath = await tsbApi.dialog.showOpenDialog({
        title: '选择目录', message: '请选择下载壁纸的目录', properties: [
          'openDirectory', 'createDirectory',
        ]
      })
      if (savePath) {
        this.settings.savePath = savePath[0]
        this.doStartDownload(this.currentItem)
      } else {
      }
    },

    // 进入详情
    goDetail(item){
      const hasRoute = item.hasOwnProperty('route');
      if(hasRoute){ this.$router.push(item.route)  }
      else { this.visibleImport = true }
    },

  },
})
</script>

<style scoped>
.s-icon svg {
 filter: none
}

.s-text {
    text-shadow: none;
}
.play-icon {
  position: absolute;
  z-index: 99;
  background: rgba(0, 0, 0, 0.51);
  text-align: center;
  width: 4em;
  height: 4em;
  left: 50%;
  top: 50%;
  border-radius: 100px;
  transform: translate(-50%, -50%);
}

.rotate-center {
  text-align: left !important;
}
</style>
