<template>


  <h3>导出工具</h3>
  <a-tabs>
    <a-tab-pane key="appjson" tab="导出app.json">
      <p>以下为自动根据设置导出的app.json文件，您可以直接复制，或者保存为文件。此文件可用于应用市场上架。为了方便起见，您甚至可以直接一键上架到应用市场。</p>
      <p v-if="!this.devApp.local_dir">
        注意： 请设置开发应用的项目路径后使用保存和导出功能。<router-link :to="{path:'/dev/'}">前往设置</router-link>
      </p>
      <p>
        <a-button style="margin-right: 30px" type="primary" @click="copyJson">复制</a-button>
        <a-tooltip :overlayStyle="{'max-width':'500px'}" :title="this.devApp.local_dir?'保存到 \n'+this.devApp.local_dir:''">
          <a-button @click="overwrite" :disabled="!this.devApp.local_dir" style="margin-right: 30px">保存到…</a-button>
        </a-tooltip>
        <a-button disabled style="margin-right: 30px">一键上架到应用市场</a-button>
      </p>
      <div id="code" style="background: white;border-radius: 4px"></div>
    </a-tab-pane>
    <a-tab-pane key="offline" tab="导出离线应用包">
      <p>离线应用包一般用于离线安装应用，或者将应用上传到线上。</p>
      <p>
        <a-button  disabled style="margin-right: 30px">导出</a-button>
        <a-button disabled style="margin-right: 30px">一键上架到应用市场</a-button>
      </p>
    </a-tab-pane>
  </a-tabs>

</template>

<script>
import { mapWritableState, mapActions } from 'pinia'
import { appStore } from '../../store'
import { CodeTwoTone } from '@ant-design/icons-vue'
import { basicSetup, EditorView } from 'codemirror'
import { json } from '@codemirror/lang-json'
import _ from 'lodash-es'

const { clipboard } = require('electron')
import { message, Modal } from 'ant-design-vue'
const path=require('path')
export default {
  name: 'develop',
  components: {
    CodeTwoTone
  },
  data () {
    return {
      editor: {},
      json: ''
    }
  },
  mounted () {
    this.json = this.getJson()
    this.editor = new EditorView({
      doc: this.json,
      extensions: [
        basicSetup, json()
      ],
      parent: document.getElementById('code')
    })
  },
  computed: {
    ...mapWritableState(appStore, ['app', 'debugMod', 'devApp'])
  },
  methods: {
    overwrite () {
      Modal.confirm({
        content: '是否覆盖到' + path.join(this.devApp.local_dir, 'manifest.json') + '？',
        onOk: () => {

        }
      })
    },
    copyJson () {
      clipboard.writeText(this.getJson())
      message.success('复制成功。')
    },
    getJson () {
      let devApp = _.cloneDeep(this.devApp)
      delete devApp.nanoid
      delete devApp.assign_apps
      delete devApp.create_time
      delete devApp.update_time
      delete devApp.use_debug_url
      delete devApp.theme_colors
      delete devApp.local_dir
      delete devApp.assignAppsInfo
      return JSON.stringify(devApp, null, '\t')
    },
    refresh () {
      this.json = this.getJson()
    },
    ...mapActions(appStore, ['toggleDebug'])
  }
}
</script>

<style scoped>

</style>
