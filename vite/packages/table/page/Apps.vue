<template>
  <div @dragover.prevent="dragOver" @drop.prevent="drop" style="background: #3b3b3b;height: calc(100vh - 2em)">
    <div v-if="apps.length===0" style="font-size: 2em;padding-top: 6em;text-align: center;">
      <Icon style="color: #ccc;font-size: 2em;vertical-align: middle" icon="#icon-line-dragdroptuofang"></Icon> 将应用拖放到此处，即可用于快捷启动
    </div>
    <div v-if="apps.length===0" style="text-align: center">
      <div @click="loadDeskIconApps" class="btn" style="font-size: 1.5em">导入桌面应用</div>
    </div>
    <div style="padding: 1em">
      <div @click="open(app)" class="app" v-for="app in apps">
        <a-avatar :size="32" shape="square" :src="app.icon"></a-avatar><br>
        <div class="name">
          {{app.name}}
        </div>
      </div>
    </div>


  </div>

</template>

<script>
import {mapWritableState,mapActions} from 'pinia'
import {appStore} from '../store'
let fs=require('fs')
export default {
  name: 'Apps',
  computed:{
    ...mapWritableState(appStore,['apps'])
  },
  data(){
    return {
      desktopApps:[],
      dropFiles:[]
    }
  },
  methods:{
    open(app){
     require('electron').shell.openPath(app.path)
   },
    ...mapActions(appStore,['addApps']),
    async loadDeskIconApps () {
      const desktopApps = await ipc.sendSync('getDeskApps')
      this.desktopApps=desktopApps
      this.addApps(this.desktopApps)
    },
    dragOver(){

    },
    async drop (e) {
      let files = e.dataTransfer.files;

      let filesArr=[]
      if (files && files.length > 0) {
        for(let i=0;i<files.length;i++){
          filesArr.push(files[i].path)
          console.log('path:', files[i])
        }
      }
      this.dropFiles = await ipc.sendSync('getFilesIcon', { files: JSON.parse(JSON.stringify(filesArr)) })
      this.addApps(this.dropFiles)
    }
  }
}
</script>

<style scoped lang="scss">
.app{
  display: inline-block;
  width: 5em;
  text-align: center;
  vertical-align: text-top;
  padding: 0.5em;
  margin: 0.5em;
  cursor: pointer;
  &:hover{
    background: #969696;
    border-radius: 4px;

  }
  .name{
    font-size: 0.8em;
    word-break: break-all;
  }
}
</style>
