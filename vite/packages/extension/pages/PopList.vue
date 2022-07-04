<script lang="ts">
import extension from '../../../src/util/extension'
import { createVNode } from 'vue';
import {
  PlusOutlined,
  AppstoreAddOutlined,
  FolderOpenOutlined,
  ChromeOutlined,
  EyeOutlined,
  EllipsisOutlined,
  EyeInvisibleOutlined,
  GoogleOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons-vue '
import { Modal } from 'ant-design-vue';
const path = eval('require')('path')
const fs = eval('require')('fs')
export default {
  components: {
    PlusOutlined,
    AppstoreAddOutlined,
    FolderOpenOutlined,
    ChromeOutlined,
    GoogleOutlined,
    EyeOutlined,
    EllipsisOutlined,
    EyeInvisibleOutlined,
    DeleteOutlined,
    ExclamationCircleOutlined
  },
  data() {
    return {
      exts: [],
      userDataPath: '',
      extensionPath: '',
      ipc: null,
      installedExts: []//已经加载的插件，这里和实际目录下的插件不一定对的起来，并且如果做了插件开关，这里的也可能少于实际的插件数。
    }
  },
  async mounted() {
    const {injectBrowserAction} = eval('require')('electron-chrome-extensions/dist/browser-action.js')
    injectBrowserAction()
    this.ipc = eval('require')('electron').ipcRenderer
    this.ipc.on('show', () => {
      this.getList()
    })
    this.ipc.on('reload', () => {
      this.getList()
    })
    this.getList()
  },
  methods: {
    remove(ext){
      Modal.confirm({
        title: '确认卸载插件？',
        icon: createVNode(ExclamationCircleOutlined),
        content: '插件被卸载后，将不可恢复，您必须重新安装方可再次使用。',
        okText: '删除',
        okType: 'danger',
        cancelText: '取消',
        onOk:() =>{
          this.ipc.send('removeExtension',{baseName:ext.baseName})
        },
        onCancel() {
        },
      });
    },
    async getList() {
      this.installedExts = await this.ipc.invoke('getInstalledExtensions')
      this.exts = []
      this.extensionPath = path.join(window.globalArgs['user-data-path'], 'extensions')
      await this.loadAllExtensions(this.extensionPath).then(data => {
        this.exts = [...data]
        this.exts.forEach((ext) => {
          let installed = this.installedExts.find(installedExt => {
            return installedExt.path.indexOf(ext.baseName) > -1
          })
          if (installed) {
            ext.id = installed.id //id不靠谱
            ext.hide = installed.hide
            ext.installed = true
            ext.enable= true
          } else {
            ext.installed = false
          }
        })
      })
    },
    getId() {

    },
    hide(ext) {
      // let id= this.getEl(index).getAttribute('id')\
      ext.hide = true
      this.ipc.send('hideExtension', {baseName: ext.baseName})
    },
    show(ext) {
      ext.hide = false
      this.ipc.send('showExtension', {baseName: ext.baseName})
    },
    onClick(index) {
      this.getEl(index).click()
    },
    getEl(index) {
      let actionListEl = document.getElementById('actions')
      let shadow = actionListEl.shadowRoot
      let btnEl = document.querySelector("#actions").shadowRoot.childNodes[index + 1]
      return btnEl
    },
    // onContextMenu(index){
    //  // this.getEl(index).contextmenu()
    //   this.getEl(index).dispatchEvent(new MouseEvent('contextmenu', { 'bubbles': true ,clientXArg:333,clientYArg:333 }))
    //   //document.getElementById(id).context()
    // },
    loadAllExtensions: extension.loadAllExtensions,

    openShop(name = 'chrome') {
      ipc.send('openExtShop', {
        name
      })
    },
    close() {
      eval('require')('electron').ipcRenderer.send('closeSelf')
    },
    setup() {
      let args = {
        manifestPath: this.manifestPath,
        crxInfo: {
          id: this.crxInfo.id,
          publicKey: this.crxInfo.publicKey
        }
      }
      eval('require')('electron').ipcRenderer.send('doInstallCrx', args)
      eval('require')('electron').ipcRenderer.send('closeSelf', args)
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
            <a-menu-item key="1" @click="openShop('crx')">
              <appstore-add-outlined/>
              安装crx插件
            </a-menu-item>
            <a-menu-item key="2">
              <folder-open-outlined/>
              加载解压缩的插件
            </a-menu-item>
          </a-menu>
        </template>
        <a-button type="text" style="position: absolute;right: 10px" size="small">
          <plus-outlined/>
          安装
        </a-button>
      </a-dropdown>

    </h3>
    <div id="extensionList" class="scroller-wrapper plugins-list" style="padding: 10px;padding-top: 0;padding-bottom: 0">

      <browser-action-list style="display: none" partition="persist:webcontent" id="actions"></browser-action-list>

      <a-empty description="暂无插件" v-if="exts.length===0" style="margin-top: 80px"></a-empty>
      <a-row style="border-bottom: 1px dashed rgba(211,211,211,0.57)" class="item-line" v-else
             v-for="(ext,index) in exts">
        <!--         @contextmenu="onContextMenu(index)"-->
        <a-col style="width: 50px;text-align: center">
          <a-avatar shape="square" :src="'file://'+ext.displayIcon"></a-avatar>
        </a-col>
        <a-col style="width: 210px">
          <div style="padding-right: 10px">
            <strong> {{ ext.localeName }} </strong>
          </div>
        </a-col>
        <a-col style="padding-top: 5px">
          <a-switch title="是否启用" v-model:checked="ext.enable" size="small"></a-switch>
        </a-col>
        <a-col style="width: 120px;text-align: right">
          <div>
            <a-button title="当前：显示到工具栏" v-if="!ext.hide" type="text" @click.stop="hide(ext)">
              <eye-outlined/>
            </a-button>
            <a-button title="当前：不显示到工具栏" style="color: red" v-else type="text" @click.stop="show(ext)">
              <EyeInvisibleOutlined/>
            </a-button>
            <a-dropdown @click.stop="()=>{}">
              <template #overlay>
                <a-menu>
                  <a-menu-item key="remove" @click="remove(ext)">
                    <delete-outlined/>
                    卸载
                  </a-menu-item>
                </a-menu>
              </template>
              <a-button type="text">
                <ellipsis-outlined/>
              </a-button>
            </a-dropdown>
          </div>
        </a-col>
      </a-row>
    </div>

    <div style="text-align: right;padding-top:0px;width: 100%;border-top: 1px solid #f1f1f1">
      <a-row type="flex">
        <a-col style="text-align: center" flex="50">
          <a-button @click="openShop('chrome')" type="text">
            <GoogleOutlined/>
            去Chrome商店安装
          </a-button>
        </a-col>
        <a-col style="text-align: center" flex="50">
          <a-button @click="openShop('crxsoso')" type="text">
            <ChromeOutlined/>
            去Crx搜搜安装
          </a-button>
        </a-col>
        <!--        <a-col style="text-align: center" flex="50"><a-button @click="setup" type="primary">去Edge商店安装</a-button></a-col>-->
      </a-row>
    </div>
  </div>
</template>
<style>
html, body {
  overflow: hidden !important;
}
</style>
<style scoped lang="scss">

.plugins-list {
  overflow-y: auto;
  height: calc(100vh - 90px);
}

.scroller-wrapper {
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

.plugins-list {

  .item-line {
    &:last-child {
      border-bottom: none !important;
    }

    &:nth-child(even) {
      background: rgba(241, 241, 241, 0.3);
    }

    border-radius: 4px;

    &:hover {
      background: #f1f1f1;
    }

    padding: 8px;
  }
}

</style>
