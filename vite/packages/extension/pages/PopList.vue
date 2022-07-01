<script lang="ts">
import extension from '../../../src/util/extension'
import {PlusOutlined,AppstoreAddOutlined,FolderOpenOutlined,ChromeOutlined,EyeOutlined,EllipsisOutlined} from '@ant-design/icons-vue '
const path=eval('require')('path')
const fs=eval('require')('fs')
export default {
  components:{
    PlusOutlined,AppstoreAddOutlined,FolderOpenOutlined,ChromeOutlined,EyeOutlined,EllipsisOutlined
  },
  data() {
    return {
      exts:[],
      userDataPath:'',
      extensionPath:'',
      ipc:null,
    }
  },
  async mounted(){
    this.ipc= eval('require')('electron').ipcRenderer
    this.exts=[]
    this.extensionPath=path.join(window.globalArgs['user-data-path'],'extensions')
    await  this.loadAllExtensions( this.extensionPath).then(data=>{
     console.log(data)
      this.exts=[...data]
     console.log(this.exts,this.exts.length)
    })

  },
  methods: {

    loadAllExtensions:extension.loadAllExtensions,

    openShop(name='chrome'){
      ipc.send('openExtShop',{
        name
      })
    },
    close(){
      eval('require')('electron').ipcRenderer.send('closeSelf')
    },
    setup(){
      let args={
        manifestPath:this.manifestPath,
        crxInfo:{
          id:this.crxInfo.id,
          publicKey:this.crxInfo.publicKey
        }
      }
      eval('require')('electron').ipcRenderer.send('doInstallCrx',args)
      eval('require')('electron').ipcRenderer.send('closeSelf',args)
    }
  }
}
</script>

<template>
  <div class="card-container" style="padding:0px;overflow: hidden">

    <h3 style="padding:10px;border-bottom: 1px solid #f1f1f1">快速管理插件
      <a-dropdown>
        <template #overlay>
          <a-menu>
            <a-menu-item key="1" @click="openShop('crx')"><appstore-add-outlined /> 安装crx插件</a-menu-item>
            <a-menu-item key="2"><folder-open-outlined /> 加载解压缩的插件</a-menu-item>
          </a-menu>
        </template>
        <a-button type="text" style="position: absolute;right: 10px" size="small"> <plus-outlined />安装 </a-button>
      </a-dropdown>

    </h3>
    <div class="scroller-wrapper plugins-list" style="padding: 10px">
      <a-empty description="暂无插件" v-if="exts.length===0" style="margin-top: 80px"></a-empty>
      <a-row class="item-line" v-else v-for="ext in exts">
        <a-col style="width: 50px;text-align: center">
          <a-avatar :src="'file://'+ext.displayIcon"></a-avatar>
        </a-col>
        <a-col style="width: 130px">
          <div>
            <strong> {{ext.localeName}} </strong>
          </div>
        </a-col>
        <a-col style="width: 120px;text-align: right">
          <div>
            <a-button type="text"> <eye-outlined /></a-button> &nbsp; <a-button type="text"><ellipsis-outlined /></a-button>
          </div>
        </a-col>
      </a-row>
    </div>

    <div style="text-align: right;padding-top:5px;width: 100%;border-top: 1px solid #f1f1f1">
      <a-row type="flex">
        <a-col style="text-align: center" flex="50"><a-button @click="openShop('chrome')" type="text"><ChromeOutlined/> 去Chrome商店安装</a-button></a-col>
<!--        <a-col style="text-align: center" flex="50"><a-button @click="setup" type="primary">去Edge商店安装</a-button></a-col>-->
      </a-row>
    </div>
  </div>
</template>

<style scoped lang="scss">
    html,body{
      overflow: hidden;
    }
    .plugins-list{
      overflow-y: auto;
      height: calc(100vh - 110px);
    }
    .scroller-wrapper{
      &::-webkit-scrollbar {
        width: 6px;
        height: 6px;
      }

      &::-webkit-scrollbar-track {
        background: #ffffff;
        border-radius: 2px;
      }

      &::-webkit-scrollbar-thumb {
        background: rgb(176, 176, 176);
        border-radius: 20px;
      }

      &::-webkit-scrollbar-thumb:hover {
        background: #747474;
      }

      &::-webkit-scrollbar-corner {
        background: #f6f6f6;
      }
    }
    .item-line{
      border-radius: 4px;
      &:hover{
        background: #f1f1f1;
      }
      padding: 8px;
    }
</style>
