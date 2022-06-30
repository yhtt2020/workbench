<script lang="ts">
import tools from '../../../src/util/tools'
export default {
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
      savePath:''
    }
  },
  mounted(){
   let args=  tools.getWindowArgs(window).globalArgs
    this.userDataPath=args['user-data-path']
   eval('require')('electron').ipcRenderer.invoke('getPopArgs').then(data=>{
     this.manifest=data.manifest
     this.manifestPath=data.manifestPath
     this.crxInfo=data.crxInfo
     this.id=data.id
     this.savePath= 'file://'+this.userDataPath+'/temp_extensions/'+this.id+'/'
     this.extensionPath=this.userDataPath+'/temp_extensions/'+this.id+'/'
     let icons=Object.values(this.manifest.icons)
     this.icon=icons[icons.length-1]
     this.convertToText()
     this.getName()
    })

  },
  methods: {
    close(){
      eval('require')('electron').ipcRenderer.send('closeSelf')
    },
    convertToText(){
      this.permissionText= this.manifest.permissions.map(p=>{
        switch (p){
          case 'activeTab':
            return '激活标签'
          case 'contextMenus':
            return '网页菜单'
          case 'storage':
            return '存储'
          case "clipboardWrite":
            return '读写剪切板'
          case 'unlimitedStorage':
            return '完全存储'
          case "notifications":
            return '消息通知'
          case 'webRequest':
            return '网络请求'
          case 'webRequestBlocking':
            return '网络请求拦截'
          case 'tabs':
            return '标签管理'
          case 'cookies':
            return 'cookies管理'
          case 'declarativeContent':
            return '声明内容'
          case '<all_urls>':
            return '全部网页'
          case 'webNavigation':
            return '网页导航'
          case 'background':
            return '后台'
          case 'pageCapture':
            return '网页截图'
          case 'printerProvider':
            return '打印'
          case 'identity':
            return '身份'
          default :
            return p
        }
      })
    },
    getName(){
      const fs=eval('require')('fs')
      const path=eval('require')('path')
      let name=this.manifest['name']
      let cnName='zh_CN'
      let localePath=path.resolve(this.extensionPath,'_locales')
      if(name.startsWith('__MSG_')){
        name=name.substring(6,name.length-2)
        let messageName=''
        if(fs.existsSync(path.join(localePath,cnName)))
        {
          messageName=path.join(localePath,cnName,'messages.json')
          //存在中文语言包
        }else{
          messageName=path.join(localePath,this.manifest['default_locale'],'messages.json')
        }
        let locale= JSON.parse(fs.readFileSync(messageName,'utf8'))
        this.name=locale[name]['message']

      }else{
        this.name=name
      }
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
  <div class="card-container" style="padding:20px;overflow: hidden">
   <a-row>
     <a-col style="width: 50px">
       <a-avatar :src="savePath+icon"></a-avatar>
     </a-col>
     <a-col style="width: 350px">
       <p>
         <strong> 安装扩展 {{name}} 到 想天浏览器？ </strong>
       </p>
      <p>
        该扩展需要：
        <ul style="max-height: 170px;overflow-y: auto" class="permissions">
       <li v-for="p in permissionText">
         {{p}}
       </li>
     </ul>

      </p>
       <p>
       </p>
     </a-col>
   </a-row>
    <div style="text-align: right;position: fixed;bottom: 15px;right: 15px">
      <a-button @click="close">取消</a-button> &nbsp;&nbsp;&nbsp;
      <a-button @click="setup" type="primary">安装</a-button>
    </div>
  </div>
</template>

<style scoped lang="scss">
    html,body{
      overflow: hidden;
    }
    .permissions{
      padding-left: 0;
      li{
        margin-left: 25px;
        line-height: 20px;
      }
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
