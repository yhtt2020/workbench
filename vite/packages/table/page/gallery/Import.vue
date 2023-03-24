<template>
  <div class="line-title">
    网络资源
  </div>
 <div class="line">导入网络资源</div>
<div class="line">
  <a-input-group compact>


  <a-input style="width: calc(100% - 80px)" placeholder="资源地址：图片、视频">

  </a-input>
  <a-button type="primary" @click="importNetworkFile">导入</a-button>
  </a-input-group>
</div>
  <a-divider></a-divider>
  <div class="line-title">本地资源</div>
  <div class="line" style="text-align: center">
      <a-button type="primary" @click="importFile">选择文件导入</a-button>
  </div>
  <div  class="line" style="text-align: center;margin-bottom: 1em">或者</div>
  <div class="line">
    <div style="border-radius: 1em;background: #282828;border: 1px dashed #505050;text-align: center;padding: 2em" @dragover.prevent="dragOver" @drop.prevent="drop">
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
import { paperStore } from '../../store/paper'
import {message,Modal} from 'ant-design-vue'
export default {
  name: 'Import',
  data(){
     return{
       copyPath:''
     }
  },
  computed:{
    ...mapWritableState(paperStore,['settings','myPapers'])
  },
  mounted(){},
  methods:{
    ...mapActions(paperStore,['addToMyPaper','saveFirstPath']),
    // 选择本地需要导入的文件
    async importFile(){
      if(this.settings.savePath){
        let openPath = await tsbApi.dialog.showOpenDialog({
          title: '选择导入的代码',
          filters: [{ name: '图片', extensions: ['png','jpg','jpeg','bmp','gif'] },{name:'视频',extensions:['mp4','mpeg','avi','rmvb']},{name:'全部',extensions:['*']}],
          properties:['multiSelections']
        })
        if(!openPath){
          return
        }else{
          const fs = require('fs-extra')
          const path = require('path')
          const imgReg = /.(jpg|jpeg|gif|bmp|png)$/  // 匹配图片正则
          const videoReg =   /.(mp4|mpeg|avi|rmvb)$/ // 匹配视频正则
          let myFile = {
            src:[]
          }
          // 通过文件读取选择文件
          let imgFile = fs.readdirSync(path.join(this.settings.savePath,'static'))
          let videoFile = fs.readdirSync(path.join(this.settings.savePath,'lively'))
          if(imgFile.length === 0 || videoFile.length === 0){
            return
          }else{
            openPath.forEach(el => {
              if(imgReg.test(el)){
                myFile.src.push(`file://${el}`)
              }else if(videoReg.test(el)){
                myFile.src.push(`file://${el}`)
              }
            })
          }
          myFile.src.forEach(el=>{
            let image = {
              src:el
            }
            this.addToMyPaper(image)
          })
        }
      }else{
        Modal.confirm({
         content:'选择壁纸保存地址',
         okText:'确定',
         onOk:async()=>{
          let savePath =  await tsbApi.dialog.showOpenDialog({
           title: '选择目录', message: '请选择下载壁纸的目录', 
           properties: ['openDirectory', 'createDirectory',]
          })
          this.createDir()
          if(savePath){
            if(this.settings.savePath = savePath[0]){
              this.settings.savePath = savePath[0]
            }else{
              return 
            }
          }else{
            return
          }
         }
        });
      }
    },
    // 导入网络资源文件
    importNetworkFile(){
       
    },
    // 文件拖拽
    dragOver(){},
    drop(e){
      if(this.settings.savePath){
        let importFile = e.dataTransfer.files
        let fileArr = []
        if(importFile && importFile.length >= 0){
          for(let i = 0; i<importFile.length;i++){
          fileArr.push(importFile[i].path)
          }
        }
      }else{
        Modal.confirm({
         content:'选择壁纸保存地址',
         okText:'确定',
         onOk:async()=>{
          let savePath =  await tsbApi.dialog.showOpenDialog({
           title: '选择目录', message: '请选择下载壁纸的目录', 
           properties: ['openDirectory', 'createDirectory',]
          })
          if(savePath){
            if(this.settings.savePath = savePath[0]){
              this.settings.savePath = savePath[0]
            }else{
              this.createDir()
            }
          }else{
            return
          }
         }
        });
      }
    },
    // 创建指定目录
    createDir(){
      const fs = require('fs-extra');
      const path = require('path')
      const fullPath = path.join(this.settings.savePath);
      const staticDirectory = path.join(fullPath,'static')
      const livelyDirectory = path.join(fullPath,'lively')
      fs.ensureDirSync(staticDirectory)
      fs.ensureDirSync(livelyDirectory)
    },
  }
}
</script>

<style scoped>

</style>
