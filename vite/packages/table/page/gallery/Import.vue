<template>
  <div class="line-title">
    网络资源
  </div>
 <div class="line">导入网络资源</div>
<div class="line">
  <a-input-group compact>


  <a-input style="width: calc(100% - 80px)" placeholder="资源地址：图片、视频">

  </a-input>
  <a-button type="primary">导入</a-button>
  </a-input-group>
</div>
  <a-divider></a-divider>
  <div class="line-title">本地资源</div>
  <div class="line" style="text-align: center">
      <a-button type="primary">选择文件导入</a-button>
  </div>
  <div  class="line" style="text-align: center;margin-bottom: 1em">或者</div>
  <div class="line">
    <div style="border-radius: 1em;background: #282828;border: 1px dashed #505050;text-align: center;padding: 2em">
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
import { appStore } from '../../store'
import {mapWritableState,mapActions} from 'pinia'
import { paperStore } from '../../store/paper'
export default {
  name: 'Import',
  data(){
     return{
       copyPath:''
     }
  },
  computed:{
    ...mapWritableState(paperStore,['settings'])
  },
  methods:{
    // 选择本地需要导入的文件
    async importFile(){
      let openPath = await tsbApi.dialog.showOpenDialog({
        title: '选择导入的代码',
        filters: [{ name: '图片', extensions: ['png','jpg','jpeg','bmp','gif'] },{name:'视频',extensions:['mp4','mpeg','avi','rmvb']},{name:'全部',extensions:['*']}],
      })
      if(!openPath){
        return 
      }else{
        let savePath = await tsbApi.dialog.showOpenDialog({
          title: '选择目录', message: '请选择下载壁纸的目录', properties: [
          'openDirectory', 'createDirectory',
          ]
        })
        if (!savePath){
          return
        }else{
          console.log(this.settings.savePath);
          console.log(openPath[0]);
          // this.settings.savePath = openPath[0]
          // const fs = require('fs')
          // fs.copyFileSync(openPath[0],this.settings.savePath)
          // 最后引入文件

        }
      }
    },
    // 导入网络资源文件
    importNetworkFile(){
       
    },
    // 文件拖拽
    dragOver(){},
    drop(e){
      let importFile = e.dataTransfer.files
    },
    
  }
}
</script>

<style scoped>

</style>
