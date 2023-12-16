<template>
<!--  <div class="line-title">-->
<!--    网络资源-->
<!--  </div>-->
<!--  <div class="line">导入网络资源</div>-->
<!--  <div class="line">-->
<!--    <a-input-group compact>-->


<!--      <a-input style="width: calc(100% - 80px)" placeholder="资源地址：图片、视频">-->

<!--      </a-input>-->
<!--      <a-button type="primary" @click="importNetworkFile">导入</a-button>-->
<!--    </a-input-group>-->
<!--  </div>-->
  <div class="line-title">
    数据库修复
  </div>
  <div class="line">
    <a-button @click="clearFix">
      清空并修复数据库
    </a-button>
  </div>

  <a-divider></a-divider>
  <div class="line-title">本地资源</div>
  <div class="line" style="text-align: center">
    <a-button type="primary" @click="importFile">选择文件导入</a-button>
  </div>
  <div class="line" style="text-align: center;margin-bottom: 1em">或者</div>
  <div class="line">
    <div style="border-radius: 1em;background: #282828;border: 1px dashed #505050;text-align: center;padding: 2em"
         @dragover.prevent="dragOver" @drop.prevent="drop">
      <a-row :gutter="20">
        <a-col>
          <Icon style="font-size: 3em" icon="line-dragdroptuofang"></Icon>
        </a-col>
        <a-col>
          将文件拖放到此处快速导入<br>
          支持图片、视频
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script>
import {mapActions, mapWritableState} from 'pinia'
import {paperStore} from '../../store/paper'
import {message, Modal} from 'ant-design-vue'

const fs = window.$models.fs
const path = require('path')
export default {
  name: 'Import',
  data() {
    return {}
  },
  props: {
    loadStaticPaper: {
      type: Function
    },
    // getLoadLively:{
    //   type:Function
    // }
  },
  computed: {
    ...mapWritableState(paperStore, ['settings','myPapers'])
  },
  mounted() {
  },
  methods: {
    clearFix(){
      this.myPapers=[];
      this.activePapers=[];
      const videoList = fs.readdirSync(path.join(this.settings.savePath, 'lively'));
      const localPaper =  fs.readdirSync(path.join(path.join(this.settings.savePath), 'static'));
      for(const item of videoList){ 
        fs.removeSync(path.join(path.join(this.settings.savePath, 'lively'),`${item}`));
      };
      for(const item of localPaper){ 
        fs.removeSync(path.join(path.join(path.join(this.settings.savePath), 'static'),`${item}`));
      }
    },
    //选择本地按钮的导入方式
    async importFile() {
      if (this.settings.savePath) {
        let openPath = await tsbApi.dialog.showOpenDialog({
          title: '选择导入的代码',
          filters: [{name: '图片', extensions: ['png', 'jpg', 'jpeg', 'bmp', 'gif']}, {
            name: '视频',
            extensions: ['mp4', 'mpeg', 'avi', 'rmvb']
          }, {name: '全部', extensions: ['*']}],
          properties: ['multiSelections']
        })
        if (!openPath) {
          return
        } else {
          const imgReg = /.(jpg|jpeg|gif|bmp|png)$/  // 匹配图片正则
          const videoReg = /.(mp4|mpeg|avi|rmvb)$/ // 匹配视频正则
          const staticDir = path.join(path.join(this.settings.savePath), 'static')
          const livelyDir = path.join(path.join(this.settings.savePath), 'lively')
          for (let i = 0; i < openPath.length; i++) {
            if (imgReg.test(openPath[i])) {
              // 将选中的文件复制到指定的文件夹中
              fs.copySync(openPath[i], `${staticDir}\\${openPath[i].split("\\")[openPath[i].split("\\").length - 1]}`)
              this.loadStaticPaper()
            } else if (videoReg.test(openPath[i])) {
              // 将动态的文件复制到指定存放的动态文件目录中
              fs.copySync(openPath[i], `${livelyDir}\\${openPath[i].split("\\")[openPath[i].split("\\").length - 1]}`)
              // this.getLoadLively()
            }
          }
        }
      } else {
        this.setDirPrompt()
      }
    },
    // 选择网络资源的导入方式
    importNetworkFile() {
    },
    // 选择文件拖拽的导入方式
    dragOver() {
    },
    drop(e) {
      if (this.settings.savePath) {
        const imgReg = /.(jpg|jpeg|gif|bmp|png)$/  // 匹配图片正则
        const videoReg = /.(mp4|mpeg|avi|rmvb)$/ // 匹配视频正则
        const staticDir = path.join(path.join(this.settings.savePath), 'static')
        const livelyDir = path.join(path.join(this.settings.savePath), 'lively')
        let importFile = e.dataTransfer.files
        let fileArr = []
        if (importFile && importFile.length >= 0) {
          for (let i = 0; i < importFile.length; i++) {
            fileArr.push(importFile[i].path)
          }
        }
        fileArr.forEach(el => {
          if (imgReg.test(el)) {
            fs.copySync(el, `${staticDir}\\${el.split("\\")[el.split("\\").length - 1]}`)
            this.loadStaticPaper()
          } else if (videoReg.test(el)) {
            // 将动态壁纸复制到指定动态壁纸文件夹中
            fs.copySync(el, `${livelyDir}\\${el.split("\\")[el.split("\\").length - 1]}`)
            // this.getLoadLively()
          }
        })
      } else {
        this.setDirPrompt()
      }
    },
    // 设置指定目录的创建
    setDirPrompt() {
      Modal.confirm({
        content: '未设置壁纸保存目录,需要设置壁纸保存文件夹',
        okText: '确定',
        onOk: async () => {
          let savePath = await tsbApi.dialog.showOpenDialog({
            title: '选择目录', message: '请选择下载壁纸的目录',
            properties: ['openDirectory', 'createDirectory',]
          })
          this.settings.savePath = savePath[0]
          // 创建指定文件夹
          const staticDir = path.join(path.join(this.settings.savePath), 'static')
          const livelyDir = path.join(path.join(this.settings.savePath), 'lively')
          fs.ensureDirSync(staticDir)
          fs.ensureDirSync(livelyDir)
        }
      });
    },

  }
}
</script>

<style scoped>

</style>
