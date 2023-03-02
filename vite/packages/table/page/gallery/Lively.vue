<template>
  <div class="rotate-center" style="font-size: 2em;margin-bottom: 1em">
    动态壁纸
  </div>
  <vue-custom-scrollbar id="containerWrapper" :settings="settingsScroller" style="height: 80vh;">
    <a-row :gutter="[20,20]" id="bingImages" style="margin-right: 1em">

      <a-col class="image-wrapper " v-for="item in list" :span="6" style="position: relative">
<!--        <div style="position: absolute;left: 20px;top: 10px;display: inline-block;z-index: 999">-->
<!--          <a-progress type="circle" :width="30" :percent="100" :strokeWidth="12"  >-->
<!--            <template #format>-->

<!--            </template>-->
<!--          </a-progress>-->
<!--        </div>-->
        <div @click="previewVideo(item)" class="play-icon pointer">
          <Icon icon="bofang" style="font-size:3em;margin-top: 8px"></Icon>
        </div>
        <div>

        </div>
        <div @click="previewVideo(item)" style="border-radius: 6px;overflow: hidden;position: relative">
          <div :style="{width:getWidth(item)+'%'}" style="background: rgb(0 0 0 / 20%);height: 100%; position: absolute;z-index: 3;right: 0;">

          </div>
          <img  @contextmenu.stop="visibleMenu=true" class="image-item pointer"
               :src="getCover(item)" style="position: relative">
        </div>

        <div style="position: absolute;right: 0;top: -10px ;padding: 10px;z-index: 999">
              <div  v-if="getWidth(item)===100 && item.percent===undefined " style="" @click.stop="clickDownload(item)" class="bottom-actions pointer"
                    >
                <Icon icon="xiazai"></Icon>
              </div>
              <div v-if="item.percent && item.percent!==100" style="padding: 10px;">
                <a-spin style="color: white" />
              </div>
        </div>
      </a-col>
    </a-row>
  </vue-custom-scrollbar>

  <div v-show="previewVideoVisible" style="position: fixed;left: 0;right: 0;top: 0;bottom: 0;z-index:9999999">
    <div style="position: fixed;right: 2em;top: 2em;z-index: 9999999999;">
      <div @click="startDownload()" class="btn pointer" style="background: rgba(0,0,0,0.76);min-width: 4em;margin-right: 1em;">
        <Icon icon="xiazai" style="font-size: 2em"></Icon>
      </div>
      <div @click="closePreview" class="btn pointer" style="background: rgba(0,0,0,0.76);min-width: 4em;">
        <Icon icon="guanbi1" style="font-size: 2em"></Icon>
      </div>
    </div>

    <div id="mse"></div>
  </div>

<!--  <a-modal wrap-class-name="full-modal" :footer="null" @onCancel="closePreview" v-model:visible="previewVideoVisible"-->
<!--           style="overflow: hidden;margin: -24px" width="100%">-->


<!--  </a-modal>-->
</template>

<script>
import { appStore } from '../../store'
import { mapActions,mapWritableState } from 'pinia'
import Player from 'xgplayer/dist/simple_player'
import {Modal} from 'ant-design-vue'
import Template from '../../../user/pages/Template.vue'
import {message} from 'ant-design-vue'
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

export default {
  name: 'Lively',
  components: { Template },

  data () {
    return {
      settingsScroller: {
        useBothWheelAxes: true,
        swipeEasing: true,
        suppressScrollY: false,
        suppressScrollX: true,
        wheelPropagation: true
      },
      currentItem:{},//当前项目
      list: lively,
      previewVideoVisible: false
    }
  },
  mounted () {

  },
  computed:{
    ...mapWritableState(appStore,['appData'])
  },
  methods: {
    ...mapActions(appStore, ['addToMyPaper','saveAppData']),
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
    getWidth(item){
      let fs=require('fs-extra')
      if(this.appData.papers.settings.savePath===''){
        return 100
      }else{
        if(item.percent===undefined && fs.existsSync(require('path').join(this.appData.papers.settings.savePath,'lively',item.name))){
          return 0
        }
        if(item.percent){
          return 100-item.percent
        }else{
          return 100
        }
      }
    },
    isInActive () {
      return false
    },
    closePreview () {
      this.previewVideoVisible=false
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
        this.appData.papers.settings.savePath = savePath[0]
        this.saveAppData('papers')
        this.doStartDownload(this.currentItem)
      } else {
      }
    },
    startDownload(){
      if(this.appData.papers.settings.savePath===''){
        Modal.confirm({
          content:'您尚未设置壁纸保存目录，请设置目录，设置目录后下载将自动开始。',
          onOk:async () => {
            await this.queryStart()
          }
        })
      }else{
        this.doStartDownload(this.currentItem)
      }
    },
    doStartDownload(item){
      message.info('开始下载壁纸')
      item.percent=0
      tsbApi.download.start({
        url:this.getVideo(item),
        savePath: this.appData.papers.settings.savePath+'/lively/'+item.name,
        updated:(args)=>{
          console.log(args)
          item.percent=(args.downloadInfo.receivedBytes/args.downloadInfo.totalBytes*100).toFixed(0)
          console.log(item.percent,'下载进度')
          //https://www.electronjs.org/zh/docs/latest/api/download-item#%E4%BA%8B%E4%BB%B6%E5%90%8D-updated
        },
        done:(args)=>{
          item.percent=100
          message.success('动态壁纸下载完成')
        },
        willDownload:(args)=>{
      }
      })
      this.previewVideoVisible=false
    },
    previewVideo (item) {
      this.previewVideoVisible = true
      if (window.$xgplayer) {
        window.$xgplayer.destroy()
      }
      this.currentItem=item

      window.$xgplayer = new Player({
        id: 'mse',
        url: this.getVideo(item),
        // fitVideoSize: 'fixWidth',
        fitVideoSize: 'fixWidth',
        // width:300,
        // height:300,
        fluid: true,
        videoInit: true,
        autoplay: true
      })

    },
    clickDownload(item){
     this.currentItem=item;
     this.startDownload()
    }
  }
}
</script>

<style scoped>
.play-icon {
  position: absolute;
  z-index: 999;
  background: rgba(0, 0, 0, 0.51);
  text-align: center;
  width: 4em;
  height: 4em;
  left: 50%;
  top: 50%;
  border-radius: 100px;
  transform: translate(-50%,-50%);
}
</style>
