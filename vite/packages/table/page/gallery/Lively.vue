<template>
  <div class="flex w-full flex-col h-full">
   <div class="flex w-full justify-between mb-2">
    <div class="flex items-center justify-center">
      <xt-new-icon icon="fluent:settings-16-regular" size="20"  class="mr-2"></xt-new-icon>
      <span class="xt-font xt-text font-400" :class="isModal ? 'font-14':'font-16'">动态壁纸</span>
    </div>

    <ClosePaperButton v-if="isModal"/>
   </div>

   <div class="flex-1 h-4/5">
    <vue-custom-scrollbar  :settings="settingsScroller" class="grow shrink " style="height: 100%;">
      <div style="height: 8px;"></div>
      <a-row :gutter="[16,16]" id="bingImages" >
        <a-col class="image-wrapper " v-for="(item,index) in displayList" :span="6" style="position: relative">
          <div class="w-full h-full pointer lively-hover">
            <xt-mix-menu :menus="menuList" fn="callBack" @mounted="currentItem = item,currentIndex = index">
              <div @click="previewVideo(item)" class="play-icon pointer flex items-center justify-center" style="opacity: 0;">
                <xt-new-icon icon="fluent:play-16-filled" :size="isModal ? 20 : 32" style="color: var(--active-text) !important;"></xt-new-icon>
              </div>
              <div @click="previewVideo(item)" style="border-radius: 6px;overflow: hidden;position: relative">
                <div :style="{width:getWidth(item)+'%'}" style="background: rgb(0 0 0 / 20%);height: 100%; position: absolute;z-index: 3;right: 0;"></div>
                <img @contextmenu.stop="visibleMenu=true" class="image-item pointer"  :src="getCover(item)" style="position: relative">
              </div>
                
              <div class="absolute top-1 right-3" style="z-index: 50;">
                <xt-button :w="isModal ? 32 : 40" :h="isModal ? 32 : 40" class="xt-bg-t-2 lively-download" style="border-radius: 8px; opacity: 0;" @click="clickDownload(item)" v-if="getWidth(item)===100 && item.percent===undefined ">
                  <div class="flex items-center justify-center">
                    <xt-new-icon icon="fluent:arrow-download-16-regular" :size="isModal ? 20 : 24" style="color: var(--active-text) !important;"></xt-new-icon>
                  </div>
                </xt-button>
                <div v-if="item.percent && item.percent!==100" style="padding: 10px;">
                  <a-spin style="color: white"/>
                </div>
                <xt-button :w="isModal ? 32 : 40" :h="isModal ? 32 : 40" class="xt-bg-t-2 " style="border-radius: 8px;" v-else-if="isDownLoad(item)" :style="isDownLoad(item) ? { opacity:'1' } : { opacity:'0' }"  @click="delDownLoad(item,index)">
                  <xt-new-icon icon="fluent:star-16-filled"  :size="isModal ? 16 : 20" style="color: var(--warning) !important;"></xt-new-icon>
                </xt-button>
              </div>

              <!-- <div style="position: absolute;right: 0;top: -10px ;padding: 10px;z-index: 50">
                  <div @click="clickDownload(item)" v-if="getWidth(item)===100 && item.percent===undefined " style="cursor: pointer;" class="bottom-actions ">
                    <Icon icon="xiazai"></Icon>
                  </div>
                  <div v-if="item.percent && item.percent!==100" style="padding: 10px;">
                    <a-spin style="color: white"/>
                  </div>
                </div> -->
            </xt-mix-menu>
          </div>
        </a-col>
      </a-row>
      <div style="height: 16px;"></div>
    </vue-custom-scrollbar>

    <!-- <vue-custom-scrollbar  :settings="settingsScroller" class="grow shrink mt-2">
       <a-row :gutter="[20,20]" id="bingImages" class="px-2.5">
        <a-col class="image-wrapper " v-for="item in displayList" :span="6" style="position: relative">
         <div @click="previewVideo(item)" class="play-icon pointer">
          <Icon icon="bofang" style="font-size:3em;margin-top: 8px"></Icon>
         </div>
         <div @click="previewVideo(item)" style="border-radius: 6px;overflow: hidden;position: relative">
          <div :style="{width:getWidth(item)+'%'}" style="background: rgb(0 0 0 / 20%);height: 100%; position: absolute;z-index: 3;right: 0;">
          </div>
          <img @contextmenu.stop="visibleMenu=true" class="image-item pointer"  :src="getCover(item)" style="position: relative">
         </div>
         <div style="position: absolute;right: 0;top: -10px ;padding: 10px;z-index: 50">
          <div @click="clickDownload(item)" v-if="getWidth(item)===100 && item.percent===undefined " style="cursor: pointer;" class="bottom-actions ">
            <Icon icon="xiazai"></Icon>
          </div>
          <div v-if="item.percent && item.percent!==100" style="padding: 10px;">
            <a-spin style="color: white"/>
          </div>
         </div>
        </a-col>
       </a-row>
    </vue-custom-scrollbar> -->
   </div>
  </div>
 

  <div v-show="previewVideoVisible" style="position: fixed;left: 0;right: 0;top: 0;bottom: 0;z-index:9999999" id="previwer">
    <div id="actions" class="no-drag" style="position: fixed;right: 2em;top: 2em;z-index: 9999999999;">
      <div @click="startDownload()" class="btn pointer"
           style="background: rgba(0,0,0,0.76);min-width: 4em;margin-right: 1em;">
        <Icon icon="xiazai" style="font-size: 2em"></Icon>
      </div>
      <div @click="closePreview" class="btn pointer" style="background: rgba(0,0,0,0.76);min-width: 4em;">
        <Icon icon="guanbi1" style="font-size: 2em"></Icon>
      </div>
    </div>
    <div id="mse"></div>
  </div>
</template>

<script>
import { appStore } from '../../store'
import { mapActions, mapWritableState } from 'pinia'
import Player from 'xgplayer/dist/simple_player'
import { Modal } from 'ant-design-vue'
import Template from '../../../user/pages/Template.vue'
import { message } from 'ant-design-vue'
import { paperStore } from '../../store/paper'
import { isDownLoad } from './libs/utils';

import ClosePaperButton from './components/close/ClosePaperButton.vue'

const lively = [
  {
    name: 'abstract-20072.mp4'
  },
  {
    name: 'bible-105673.mp4'
  },
  {
    name: 'car-135728.mp4'
  },
  {
    name: 'cat-65438.mp4'
  },
  {
    name: 'energy-field-74933.mp4'
  },
  {
    name: 'highland-cows-65903.mp4'
  },
  {
    name: 'ink-67358.mp4'
  },
  {
    name: 'lonely-tree-38108.mp4'
  },
  {
    name: 'mountains-31175.mp4'
  },
  {
    name: 'sasuke-146064.mp4'
  },
  {
    name: 'stock.mp4'
  },
  {
    name: 'trees-24540.mp4'
  },
  {
    name: 'trees-98970.mp4'
  }
]
const lively2 = ['mylivewallpapers-com-Arcanine-and-Oddish-Pokemon.mp4', 'MyLiveWallpapers-com-Conch-Street-4K.mp4', 'mylivewallpapers-com-Cult-of-the-Lamb-4K.mp4', 'mylivewallpapers-com-Fenrir-Ragnorak-4K.mp4', 'mylivewallpapers-com-Firecracker-Diana-LoL.mp4', 'mylivewallpapers-com-Geralt-Wild-Hunt.mp4', 'mylivewallpapers-com-Ghost-Screen-4K.mp4', 'mylivewallpapers-com-Resident-Evil-Pixels.mp4', 'mylivewallpapers-com-Shiba-Inu.mp4', 'mylivewallpapers-com-Tree-Houses-4K.mp4', 'mylivewallpapers-com-V-Rising.mp4', 'mylivewallpapers-com-White-Wolf.mp4', 'mylivewallpapers-com-Wolf.mp4', 'mylivewallpapers.com-16bit-Japanese-Beach.mp4', 'mylivewallpapers.com-3D-Skull.mp4', 'mylivewallpapers.com-Aquarium.mp4', 'mylivewallpapers.com-Avengers-EndGame.mp4', 'mylivewallpapers.com-Blue-Butterflies.mp4', 'mylivewallpapers.com-Captain-America-VS-Iron-Man.mp4', 'mylivewallpapers.com-Cartoon-Baby-Yoda-Mandalorian.mp4', 'mylivewallpapers.com-Cerberus-Pixel-Art-Helltaker.mp4', 'mylivewallpapers.com-Crocodile-Swamp.mp4', 'mylivewallpapers.com-Dolphin-Island.mp4', 'mylivewallpapers.com-Forest-Deer.mp4', 'mylivewallpapers.com-Geralt-of-Rivia.mp4', 'mylivewallpapers.com-Geralt.mp4', 'mylivewallpapers.com-Glow-Sunset-Mountain.mp4', 'mylivewallpapers.com-Glowing-Deer.mp4', 'mylivewallpapers.com-Hearth-Groves.mp4', 'mylivewallpapers.com-Heimerstinger-LoL.mp4', 'mylivewallpapers.com-Henry-Cavill-The-Witcher.mp4', 'mylivewallpapers.com-Jupiter.mp4', 'mylivewallpapers.com-Lil-SpongeThug-KillaPants.mp4', 'mylivewallpapers.com-Magical-Hummingbird.mp4', 'mylivewallpapers.com-Magical-Underwater.mp4', 'mylivewallpapers.com-Mountain-Lake-Sunset.mp4', 'mylivewallpapers.com-Neutron-Star.mp4', 'mylivewallpapers.com-Nuclear-Blast.mp4', 'mylivewallpapers.com-Ocean-Waves.mp4', 'mylivewallpapers.com-Pickle-Rick.mp4', 'mylivewallpapers.com-Pixel-Flower-Shop.mp4', 'mylivewallpapers.com-Pixel-Pleiades-Overlord.mp4', 'mylivewallpapers.com-Pixel-Waterfall.mp4', 'mylivewallpapers.com-Polar-Bubbles.mp4', 'mylivewallpapers.com-Rick-and-Morty-Escape.mp4', 'mylivewallpapers.com-Rick-N-Morty-Adventures.mp4', 'mylivewallpapers.com-Rise-of-Skywalker.mp4', 'mylivewallpapers.com-Shiba-Inu-Hot-Dog.mp4', 'mylivewallpapers.com-Shiba-Inu-Snow.mp4', 'mylivewallpapers.com-Snow-Deer.mp4', 'mylivewallpapers.com-Sponge-Bob-Coffee.mp4', 'mylivewallpapers.com-Sunset-River-FIX.mp4', 'mylivewallpapers.com-The-Long-Dark.mp4', 'mylivewallpapers.com-Tropical-Waterfall.mp4', 'mylivewallpapers.com-Undead-Pirate.mp4', 'mylivewallpapers.com-Waterfall-Birds-1.mp4', 'mylivewallpapers.com-Waterfall-Fox.mp4']
let fs = require('fs')
let path = require('path')

export default {
  name: 'Lively',

  components: { Template,ClosePaperButton },

  props:['isModal'],

  data () {
    return {
      settingsScroller: {
        useBothWheelAxes: true,
        swipeEasing: true,
        suppressScrollY: false,
        suppressScrollX: true,
        wheelPropagation: true
      },
      currentItem: {},//当前项目
      currentIndex:null,
      list: [],
      previewVideoVisible: false,
      timer: null,

      menuList:[
       {
        newIcon:'fluent:arrow-download-16-regular',name:'下载壁纸',
        callBack:()=>{ this.clickDownload(this.currentItem) } 
       },
       { 
        newIcon:'fluent:delete-16-regular',name:'删除该壁纸',color: 'var(--error)',
        callBack:()=>{ this.delDownLoad(this.currentItem,this.currentIndex) } 
       },
      ]
    }
  },

  mounted () {
    this.list = [...lively]
    this.savePath = this.settings.savePath

    lively2.forEach((w) => {
      this.list.push({
        name: w
      })
    })
    if (this.savePath) {
      //如果已经设置过下载地址了
      this.list.forEach(li => {
        if (fs.existsSync(require('path').join(this.savePath, 'lively', li.name))) {
          li.done = 1
        } else {
          li.done = 0
        }
      })
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

  computed: {
    ...mapWritableState(paperStore, ['settings']),
    displayList () {
      console.log(this.list);
      return this.list.sort((a, b) => {
        return b.done - a.done
      })
    },
    savePath(){
      if(!this.settings.savePath){
        return ''
      }
      return this.settings.savePath
    }

  },

  methods: {
    ...mapActions(paperStore, ['addToMyPaper']),
    isDownLoad,

    getCover (item) {
      let filename = item.name.substring(0, item.name.lastIndexOf('.'))
      filename = `https://up.apps.vip/lively/${filename}.jpg`
      return filename
    },
    getVideo (item) {
      let filename = item.name
      filename = `https://up.apps.vip/lively/${filename}`
      return filename
    },
    getWidth (item) {
      if (this.settings.savePath === '') {
        return 100
      } else {
        if (item.percent === undefined && fs.existsSync(require('path').join(this.savePath, 'lively', item.name))) {
          item.done = 1
          return 0
        }
        if (item.percent) {
          return 100 - item.percent
        } else {
          return 100
        }
      }
    },
    isInActive () {
      return false
    },
    closePreview () {
      this.previewVideoVisible = false
      if (window.$xgplayer) {
        window.$xgplayer.destroy()
        window.$xgplayer = null
      }
    },
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
    startDownload (currentItem) {
      if (this.savePath === '') {
        Modal.confirm({
          centered:true,
          style:{'z-index':999999},
          content: '您尚未设置壁纸保存目录，请设置目录，设置目录后下载将自动开始。',
          onOk: async () => {
            await this.queryStart()
          }
        })
      } else {
        this.doStartDownload(currentItem)
      }
    },
    doStartDownload (item) {
      message.info('开始下载壁纸')
      item.percent = 0
      tsbApi.download.start({
        url: this.getVideo(item),
        savePath: this.savePath + '/lively/' + item.name,
        updated: (args) => {
          item.done = 1
          item.percent = (args.downloadInfo.receivedBytes / args.downloadInfo.totalBytes * 100).toFixed(0)
          //https://www.electronjs.org/zh/docs/latest/api/download-item#%E4%BA%8B%E4%BB%B6%E5%90%8D-updated
        },
        done: (args) => {
          item.percent = 100
          item.done = 1
          message.success('动态壁纸下载完成')
        },
        willDownload: (args) => {
        }
      })
      this.previewVideoVisible = false
    },
    previewVideo (item) {
      $('#actions').show()
      this.timer = setTimeout(() => {
        $('#actions').fadeOut()
      }, 5000)
      this.previewVideoVisible = true
      if (window.$xgplayer) {
        window.$xgplayer.destroy()
      }
      this.currentItem = item
      let url = this.getVideo(item)
      let local = ''
      if (item.done) {
        //如果是已经触发过下载的，则判断一下本地是否存在，存在则替换成本地播放链接
        local = path.join(this.savePath, 'lively', item.name)
      }
      if (fs.existsSync(local)) {
        url = 'file://' + local
      }
      window.$xgplayer = new Player({
        id: 'mse',
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
    clickDownload (item) {
      this.currentItem = item
      this.startDownload(item)
    },

    // 删除动态壁纸
    delDownLoad(item,index){
      this.$xtConfirm('是否确认取消收藏','取消收藏后会同步删除本地文件',{
        index:1020,
        ok: async() => {
          const filePath = path.join(this.settings.savePath,'lively');
          window.$models.fs.removeSync(path.join(filePath,item.name));
          console.log('执行.....测试',this.list[index]);
          this.list[index].done = 0
          delete this.list[index].percent
        },
        no: () => {},
        noText: '取消',
        type:'link'
      })
    }
    
  }
}
</script>

<style lang="scss" scoped>
.play-icon {
  position: absolute;
  z-index: 50;
  /**background: rgba(0, 0, 0, 0.51);**/
  text-align: center;
  width: 4em;
  height: 4em;
  left: 50%;
  top: 50%;
  border-radius: 100px;
  transform: translate(-50%, -50%);
}

.lively-hover{
  &:hover{
    .play-icon,.lively-download{
      opacity: 1 !important;
    }
  }
}
</style>
<style>
.ant-modal-mask{
  z-index: 999999;
}
.ant-modal-wrap{
  z-index: 9999999;
}
</style>
