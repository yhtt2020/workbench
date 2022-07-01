<script lang="ts">
import tools from '../../../src/util/tools'
import {PlusOutlined,AppstoreAddOutlined,FolderOpenOutlined} from '@ant-design/icons-vue '
export default {
  components:{
    PlusOutlined,AppstoreAddOutlined,FolderOpenOutlined
  },
  data() {
    return {
      manifest:{
        icon:'',
        permissions:[]
      },
      userDataPath:'',
      manifestPath:'',
      crxInfo:[],
      id:'',
      name:'',
      permissionText:[],
      savePath:'',
      ipc:null,
    }
  },
  mounted(){
    this.ipc= eval('require')('electron').ipcRenderer
  },
  methods: {
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
      <a-row>
        <a-col style="width: 50px">
          <a-avatar :src="savePath+icon"></a-avatar>
        </a-col>
        <a-col style="width: 120px">
          <p>
            <strong> 谷歌翻译 </strong>
          </p>
        </a-col>
        <a-col style="width: 130px;text-align: right">
          <p>
            眼睛 按钮
          </p>
        </a-col>
      </a-row>
    </div>

    <div style="text-align: right;padding-top:10px;width: 100%;border-top: 1px solid #f1f1f1">
      <a-row type="flex">
        <a-col style="text-align: center" flex="50"><a-button @click="openShop('chrome')" type="primary">去Chrome商店安装</a-button></a-col>
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
      height: calc(100vh - 115px);
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

</style>
