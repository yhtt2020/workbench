<template>
  <div>
    <div style="text-align: center;margin-left: -7em">

      <div v-if="tab==='player'">
        <a-avatar :class="{'playing':status.music.playing}" :size="120" :src="status.music.cover"
                  style="margin: 20px;border: 3px solid #6b6b6b"></a-avatar>
        <div style="font-size: 2.2em">{{ status.music.title }}</div>
        <div style="font-size: 1.1em;color: #7c7c7c" class="singer">
          {{ status.music.singer }}
        </div>
      </div>
      <div v-show="tab==='prompt'">
        <div>
          <div v-html="prompt" id="prompt" class="listlyric j-flag"></div>
        </div>

      </div>
      <div v-show="tab==='player'" style="width: 400px;margin: auto" class="player">
        <a-slider v-model:value="status.music.percent"/>
      </div>
      <div style="font-size: 2em">
        {{ status.music.progress }} / {{ status.music.total }}
      </div>
      <div :style="{zoom:tab==='player'?1:0.5}" style="text-align: center;margin-top: 2em">
        <div style="width: 250px;margin: auto">
          <a-row>
            <a-col @click="doAction('prev')" :span="8" style="padding-top: 1em">
              <Icon class="player-icon" icon="#icon-shangyishou"></Icon>

            </a-col>
            <a-col @click="doAction('pause')" v-if="status.music.playing" :span="8">

              <Icon class="player-icon" style="font-size: 6em" icon="#icon-zanting"></Icon>

            </a-col>
            <a-col @click="doAction('play')" v-else :span="8">

              <Icon class="player-icon" style="font-size: 6em" icon="#icon-bofang"></Icon>

            </a-col>
            <a-col @click="doAction('next')" :span="8" style="padding-top: 1em">
              <Icon class="player-icon" icon="#icon-xiayishou"></Icon>
            </a-col>
          </a-row>
        </div>


      </div>
    </div>
  </div>
  <div @click="showPrompt" style="position:fixed;right: 3em;top: 43vh">
    <Icon icon="#icon-zimu" style="font-size: 4em"></Icon>
  </div>

</template>

<script>
import { mapWritableState, mapActions } from 'pinia'
import { appStore } from '../store'
import SecondPanel from '../components/SecondPanel.vue'

let fs = require('fs')
export default {
  name: 'Apps',
  components: { SecondPanel },
  computed: {
    ...mapWritableState(appStore, ['apps', 'status'])
  },
  mounted () {
    if (this.status.music.notInit) {

    }
    window.updateMusicStatusHandler = this.updateStatus
  },
  data () {
    return {
      scrollTop: 0,
      prompt: '',
      tab: 'player',
      currentIndex: 'my',
      menus: [{
        title: '我的应用',
        index: 'my',
        icon: ''
      }, {
        title: '轻应用',
        index: 'qing'
      },
        {
          title: '应用市场',
          icon: '',
          index: 'store'
        }
      ],
    }
  },
  methods: {
    showPrompt () {
      if (this.tab === 'prompt') {
        this.tab = 'player'
      } else {
        this.tab = 'prompt'
        this.doAction('prompt')
      }

    },
    doAction (action) {
      console.log('发送消息')
      require('electron').ipcRenderer.send('wyyAction', { action })
    },
    updateStatus (status) {
      this.status.music = status
      this.status.music.cover = status.cover.replace('34y34', '120y120')//修正封面
      this.prompt = status.prompt
      this.scrollTop = status.scrollTop
      //document.getElementById('prompt').scrollTop=this.scrollTop
      if (document.getElementById('prompt')) {
        document.getElementById('prompt').scrollTop = this.scrollTop
      }
      this.getPercent()
    },
    getPercent () {
      let currentText = this.status.music.progress.split(':')
      let current
      if (currentText.length === 2) {
        current = new Date('2023/1/1 00:' + currentText[0] + ':' + currentText[1])
      }
      let totalText = this.status.music.total.split(':')
      let total
      if (totalText.length === 2) {
        total = new Date('2023/1/1 00:' + totalText[0] + ':' + totalText[1])
      }

      let totalSeconds = total.getHours() * 60 * 60 + total.getMinutes() * 60 + total.getSeconds()
      let currentSeconds = current.getHours() * 60 * 60 + current.getMinutes() * 60 + current.getSeconds()
      this.status.music.percent = (currentSeconds / totalSeconds * 100).toFixed(0)
    },

    ...mapActions(appStore, ['addApps']),

    changeTab (data) {
      console.log(data, 'data')
      this.currentIndex = data.index
    },
    async drop (e) {
      let files = e.dataTransfer.files

      let filesArr = []
      if (files && files.length > 0) {
        for (let i = 0; i < files.length; i++) {
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
<style>
.ant-slider-track {
  background: #1a1a1a;
}

.ant-slider-track {
  height: 8px;
  border-radius: 100px;
}

.ant-slider-rail {
  height: 8px;
  border-radius: 100px;
}

.ant-slider-handle {
  border-color: #333;
  width: 20px;
  height: 20px;
}

.z-sel {
  color: #fff !important;
  font-size: 14px !important;
  -webkit-transition: color 0.7s linear;
  -moz-transition: color 0.7s linear;
  -o-transition: color 0.7s linear;
  transition: color 0.7s linear;
}

.listlyric p {
  color: #989898;
  word-wrap: break-word;
  text-align: center;
  line-height: 32px;
  height: auto !important;
  height: 32px;
  min-height: 32px;
  -webkit-transition: color 0.7s linear;
  -moz-transition: color 0.7s linear;
  -o-transition: color 0.7s linear;
  transition: color 0.7s linear;
  font-size: 12px;
  margin-bottom: 0;

}
</style>
<style scoped lang="scss">
.player-icon {
  font-size: 4em;
  vertical-align: middle;
}

.prompt {

}

.app-content {
  background: #3b3b3b;
  height: calc(100vh - 2em);
  margin-left: 11em;
  border-radius: 8px;
}

.app {
  display: inline-block;
  width: 5em;
  text-align: center;
  vertical-align: text-top;
  padding: 0.5em;
  margin: 0.5em;
  cursor: pointer;

  &:hover {
    background: #969696;
    border-radius: 4px;

  }

  .name {
    font-size: 0.8em;
    word-break: break-all;
  }
}

.listlyric {
  text-align: center;
  zoom: 1.4;
  top: 0;
  z-index: 4;
  margin: auto;
  height: 219px;
  width: 354px;
  overflow: hidden;
  scroll-behavior: smooth;
  margin-bottom: 1em;
}


</style>
