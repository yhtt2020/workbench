<template>
  <div style="text-align: center;padding-top: 70px">
    <a-avatar :size="80" src="/icons/logo128.png"></a-avatar>
    <h3 style="margin-top: 15px">欢迎使用 {{appName}}</h3>
    <p>版本：{{appVersion}}</p>
    <div style="position: absolute;right: 10px;top: 10px">
      <a-tag @click="reName" title="当前设备ID" style="max-width: 150px" class="text-more"> <desktop-outlined/> {{this.getClientName()}}</a-tag>

    </div>
    <p>
      <a-button @click="startApp()" type="primary">打开上次空间</a-button>
    </p>

  </div>
  <div style="position: absolute;bottom: 20px;text-align: center;width: calc( 100% - 200px) ">
    <div>

      <a-checkbox @change="switchShowOnStart" v-model:checked="showOnStart">每次启动的时候选择</a-checkbox>
    </div>
    <div v-if="hideTrialTip==='false'" class="tip" style="">
      <a-row @click="showTrial" type="flex" style="cursor: pointer">
        <a-col flex="60px">
          <a-avatar shape="square" src="/icons/bilibili.svg" :size="50"/>
        </a-col>
        <a-col flex="1">
          <h3>快速学习空间功能</h3>
          <div>
            通过视频教程，系统学习掌握空间的使用技巧。强烈推荐。
            <span class="clickable"> <close-outlined @click.stop="hideTrial()" style="position: absolute;right: 5px;top: 5px;cursor: pointer"/></span>

          </div>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script>
import { CloseOutlined,DesktopOutlined } from '@ant-design/icons-vue'
const {configModel} = window.$models
const appName= window.globalArgs['app-name']
const appVersion=window.globalArgs['app-version']
import {Modal} from "ant-design-vue"
export default {
  name: 'Welcome',
  components: { CloseOutlined ,DesktopOutlined},
  async mounted () {
    this.showOnStart = await configModel.getShowOnStart()
    this.clientId=tsbApi.runtime.clientId
    this.clientName=tsbApi.runtime.clientName
    this.hideTrialTip=localStorage.getItem('hideTrialTip')||'false'

  },
  data(){
    return {
      appName,
      appVersion,
      showOnStart:false,
      hideTrialTip:'true',

      clientId:'',
      clientName:'',
    }
  },
  methods:{
    hideTrial(){
      localStorage.setItem('hideTrialTip','true')
      this.hideTrialTip='true'
    },
    reName(){
    },
    getClientName(){
      if(this.clientName){
        return this.clientName
      }else{
        return this.clientId
      }
    },
    showTrial(){
      this.$router.push({name:'trial'})
    },
    switchShowOnStart () {
      configModel.setShowOnStart(this.showOnStart)
    },
    startApp(){
      window.ipc.send('startApp')
    }
  }
}
</script>

<style scoped lang="scss">
.text-more {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.tip {
  &:hover{
      box-shadow: 0 0 8px rgba(101, 96, 96, 0.3);
   }
  border-radius: 4px;
  border: 1px solid #f1f1f1;
  background: #f5f5f5;
  display: inline-block;
  width: 500px;
  margin-top: 10px;
  text-align: left;
  padding: 10px
}
.clickable{
  &:hover{
    opacity: 0.6;
  }
}
</style>
