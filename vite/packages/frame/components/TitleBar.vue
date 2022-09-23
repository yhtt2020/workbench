<template>
  <div id="titleBar" @contextmenu="showMenu"   class="windows"
       style="display: flex;justify-content: flex-start;flex-direction: row;">
    <div class="control-actions" style="width: 120px;display: flex;justify-content: flex-start;flex-direction: row;margin-left: 10px">
      <div id="goHome" @click="home" title="首页" class="action">
        <span class="action-icon-wrapper"><home-outlined class="action-icon-ant" /></span>
      </div>
      <div id="goBack" @click="goBack" title="返回" class="action" style="opacity: 0.5">
        <span class="action-icon-wrapper">
           <left-outlined class="action-icon-ant"/>
        </span>
      </div>
      <div id="goForward" @click="goForward" title="前进" class="action" style="display: none">
        <span class="action-icon-wrapper"><right-outlined  class="action-icon-ant"/></span>
      </div>
      <div id="refresh" @click="refresh" title="刷新" class="action">
        <span class="action-icon-wrapper"><redo-outlined  class="action-icon-ant"/></span>
      </div>

    </div>
    <div id="addressWrapper" style="flex: auto;      line-height: 40px;">
      <input id="address" readonly
             style=" width: calc(100% - 20px);border:1px solid #cacaca;border-radius: 4px;padding: 5px;margin:5px">
    </div>

    <div id="title" style="flex: auto; line-height: 30px;text-align: center">
      <img onerror="this.src='../../icons/default.svg'"
           :src="app.logo"
           style="margin-top:-3px;border-radius: 100px ;background-color: white;width: 20px;height: 20px;vertical-align: middle;border:2px solid white"
           id="appLogo"><span :title="'网址：' + encodeURI(this.app.url) + '（双击复制）'" style="color: white;margin-left: 10px;font-size: 14px" id="appName" @dblclick="copyAddress">{{ app.name }}</span>


    </div>
    <div style="display: flex;width: auto;padding-right: 10px">
      <div class="action">
        <span @click="showMenu" class="action-icon-wrapper">
         <ellipsis-outlined class="action-icon-ant"/>
        </span>
      </div>
      </div>

    <div id="windows-control"  v-if="platform==='win32'" style="width: 140px;display: flex">
      <div class="windows-caption-buttons">
        <div class="element caption-minimise"  @click="minimize" v-show="!windowIsMaximized">
          <svg>
            <line x1="1" y1="5.5" x2="11" y2="5.5"/>
          </svg>
        </div>
        <div class="element caption-maximize"  @click="maximize" v-show="!(this.windowIsMaximized || this.windowIsFullscreen)">
          <svg>
            <rect x="1.5" y="1.5" width="9" height="9"/>
          </svg>
        </div>
        <div class="element caption-restore" @click="restore" v-show="this.windowIsMaximized || this.windowIsFullscreen">
          <svg>
            <rect x="1.5" y="3.5" width="7" height="7"/>
            <polyline points="3.5,3.5 3.5,1.5 10.5,1.5 10.5,8.5 8.5,8.5"/>
          </svg>
        </div>
        <div class="element caption-close" @click="close">
          <svg>
            <path d="M1,1 l 10,10 M1,11 l 10,-10"/>
          </svg>
        </div>
      </div>
    </div>
  </div>
  <div style="background-color: white;position: fixed;top: 41px;left: 0;right: 0;bottom: 0">
    <div hidden
         style="margin: auto;width: 200px;height: 200px;margin-top: calc( (100vh - 41px) / 2 - 100px);text-align: center">
      <div id="loadingEl" class="lds-ellipsis">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  </div>
</template>

<script>
import { LeftOutlined,RightOutlined,RedoOutlined,HomeOutlined,EllipsisOutlined } from '@ant-design/icons-vue'
export default {
  name: 'TitleBar',
  components:{
    LeftOutlined,
    RightOutlined,
    RedoOutlined,
    HomeOutlined,
    EllipsisOutlined
  },
  data(){
    return {
      platform:'darwin',
      currentUrl:'',
      app: {  },


      windowIsMaximized:false,
      windowIsFullscreen:false
    }
  },
  mounted () {
    this.platform=process.platform
    if (this.platform === 'darwin') {
      document.body.classList.add('mac')
    } else if (this.platform === 'win32') {
      document.body.classList.add('windows')
    }
    // var linuxClose = document.querySelector('#linux-control-buttons #close-button')
    // var linuxMinimize = document.querySelector('#linux-control-buttons #minimize-button')
    // var linuxMaximize = document.querySelector('#linux-control-buttons #maximize-button')

    ipc.on('updateView', (event, args) => {
      document.getElementById('address').value = args.url
      if (args.canGoBack) {
        document.getElementById('goBack').style.opacity = 1
      } else {
        document.getElementById('goBack').style.opacity = 0.5
      }
      if (args.canGoForward) {
        document.getElementById('goForward').style.display = 'inline-block'
      } else {
        document.getElementById('goForward').style.display = 'none'
      }
      this.currentUrl = args.url
    })

    ipc.on('init', (event, args) => {
      windowId = args.windowId
      window.app=args.app
      this.app=args.app
      window.id = args.app.id
      document.getElementById('address').value = args.url
      document.getElementById('addressWrapper').style.display = 'none'
      document.title = args.title
      document.body.style.backgroundColor = args.app.userThemeColor ? args.app.userThemeColor : args.app.themeColor

      //暂时取消应用市场的窗体返回图标
      if(args.app.package === 'com.thisky.appStore'){
        document.getElementById('goBack').hidden = true
        document.getElementById('goForward').hidden = true
        document.getElementById('goHome').hidden = true
        document.getElementById('refresh').style.marginLeft = '30px'
      }

    })
    ipc.on('maximize',  (e) =>{
      this.windowIsMaximized = true
    })
    ipc.on('unmaximize',  (e) =>{
      this.windowIsMaximized = false
    })
    ipc.on('enter-full-screen',  (e) =>{
      this.windowIsFullscreen = true
    })
    ipc.on('leave-full-screen',  (e) =>{
      this.windowIsFullscreen = false
    })

  },
  methods: {
    showMenu(){
      ipc.send('createAppMenu',{id:window.id,app:window.app})
    },
    goBack () {
      ipc.send('saAppGoBack', {
        id: window.id
      })
    },

    goForward () {
      ipc.send('saAppGoForward', {
        id: window.id
      })
    },

    refresh () {
      ipc.send('saAppRefresh', {
        id: window.id
      })
    },

    home () {
      ipc.send('saAppHome', {
        id: window.id
      })
    },

    resetSize () {
      ipc.send('saAppResetSize', {
        id: window.id
      })
    },
    minimize(){
      ipc.invoke('minimizeAppWindow', { id: window.id })
    },
    maximize(){
      ipc.invoke('maximizeAppWindow', { id: window.id })
    },
    restore(){
      if (this.windowIsFullscreen) {
        ipc.invoke('setFullScreenAppWindow', { flag: false, id: window.id })
      } else {
        ipc.invoke('unmaximizeAppWindow', { id: window.id })
      }
    },
    close(){
      ipc.invoke('closeAppWindow', { id: window.id })
    },
    copyAddress(){
      clipboard.writeText(this.currentUrl)
    }
  }
}
</script>

<style>
body.mac #titleBar {
  width: calc(100vw - 65px);
  margin-left: 65px;
}

#titleBar {
  user-select: none;
}

body.mac #title {
  margin-left: -123px;
}

body {
  -webkit-app-region: drag;
}

/* Windows caption buttions */
body {
  --control-space-top: 0px;
  --control-space-left: 0.3em;
  --control-space-right: 0.3em;
}

body.windows:not(.separate-titlebar) {
  --control-space-right: 138px;
}

/*.windows-caption-buttons {*/
/*  display: none;*/
/*}*/

body.windows:not(.separate-titlebar) .windows-caption-buttons {
  display: flex;
  position: absolute;
  top: var(--control-space-top);
  right: 0;
  z-index: 10;
}

.control-actions {
  -webkit-app-region: none;
}

.windows-caption-buttons .element {
  -webkit-app-region: none;
  line-height: 36px;
  width: 36px;
  stroke: #000;
  padding: 0 5px;
  box-sizing: content-box;
  fill: transparent;
  text-align: center;
}

body:not(.task-overlay-is-shown).dark-theme .windows-caption-buttons .element {
  stroke: #fff;
}

body:not(.task-overlay-is-shown).dark-theme .action-icon path {
  fill: #fff;
}

.windows-caption-buttons .element > svg {
  width: 12px;
  height: 12px;
}

.windows-caption-buttons .element {
  transition: background-color 0.1s linear, color 0.1s linear;
}

.windows-caption-buttons .element:hover {
  background-color: rgba(196, 196, 196, 0.4);
  transition: none;
}

.windows-caption-buttons .element:active {
  background-color: rgba(168, 168, 168, 0.5);
}

.windows-caption-buttons .element.caption-close:hover {
  background-color: #e81123;
}

.windows-caption-buttons .element.caption-close:hover > svg,
.windows-caption-buttons .element.caption-close:active > svg {
  stroke: #fff;
  stroke-width: 1.1px;
}

.windows-caption-buttons .element.caption-close:active {
  background-color: rgba(232, 17, 35, 0.6);
}

</style>
