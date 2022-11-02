<template>


  <h3>导出工具</h3>
  <a-tabs>
    <a-tab-pane key="appjson" tab="导出app.json">
      <p>以下为自动根据设置导出的app.json文件，您可以直接复制，或者保存为文件。此文件可用于应用市场上架。为了方便起见，您甚至可以直接一键上架到应用市场。</p>
      <p><a-button style="margin-right: 30px" type="primary">复制</a-button><a-button style="margin-right: 30px">保存</a-button>
        <a-button style="margin-right: 30px">一键上架到应用市场</a-button></p>
      <div id="code" style="background: white;border-radius: 4px"></div>
    </a-tab-pane>
    <a-tab-pane key="offline" tab="导出离线应用包">
      <p>离线应用包一般用于离线安装应用，或者将应用上传到线上。</p>
      <p><a-button style="margin-right: 30px">导出</a-button>
        <a-button style="margin-right: 30px">一键上架到应用市场</a-button></p>
    </a-tab-pane>
  </a-tabs>

</template>

<script>
import { mapWritableState, mapActions } from 'pinia'
import { appStore } from '../../store'
import { CodeTwoTone } from '@ant-design/icons-vue'
import {basicSetup, EditorView} from "codemirror"
import {json} from "@codemirror/lang-json"

export default {
  name: 'develop',
  components: {
    CodeTwoTone
  },
  data(){
    return {
      editor:{},
      json:''
    }
  },
  mounted(){
    let jsonstr={
      "name": "应用市场",
      "version": "1.0.0",
      "theme_color": "#3c78d8",
      "author": "想天软件",
      "site": "https://apps.vip",
      "logo": "https://up.apps.vip/logo/favicon.svg",
      "type": "web",
      "url": "https://a.apps.vip/appStore/index.html",
      "preload": '/pages/guide/preload.js',
      "package": "com.thisky.appStore",
      "summary": "应用市场，助您发现更大的世界。",
      "attribute": {
        isOffical: 1,
        integration: 2
      },
      "settings": {
        bounds: {
          width: 1180,
          height: 864,
        },
        showInSideBar: true
      }
    }
    this.json=JSON.stringify(jsonstr ,null, '\t')
    this.editor = new EditorView({
      doc:this.json,
      extensions: [
        basicSetup,json()
      ],
      parent:document.getElementById('code')
    })
  },
  computed: {
    ...mapWritableState(appStore, ['app', 'debugMod'])
  },
  methods: {
    ...mapActions(appStore, ['toggleDebug'])
  }
}
</script>

<style scoped>

</style>
