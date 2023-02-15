<template>
  <div v-if="!status.music.notInit" style="text-align: center;margin-left: -7em">


    <a-avatar :class="{'playing':status.music.playing}" :size="120" :src="status.music.cover"
              style="margin: 20px;border: 3px solid #6b6b6b"></a-avatar>
    <div style="font-size: 2.2em">{{ status.music.title }}</div>
    <div style="font-size: 1.1em;color: #7c7c7c" class="singer">
      {{ status.music.singer }}
    </div>
    <div style="width: 400px;margin: auto" class="player">
      <a-slider v-model:value="status.music.percent"/>
    </div>
    <div style="font-size: 2em">
      {{ status.music.progress }} / {{ status.music.total }}
    </div>
    <div style="text-align: center;margin-top: 2em">
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
    if(this.status.music.notInit){
      this.$router.push({
        name:'app',
        params:{
          theme:'#242424',
          name:'wyyMusic',
          url:'https://music.163.com',
          preload:'wyyMusic',
          background:true,
        }
      })
    }
    window.updateMusicStatusHandler = this.updateStatus
  },
  data () {
    return {
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
    doAction (action) {
      console.log('发送消息')
      require('electron').ipcRenderer.send('wyyAction', { action })
    },
    updateStatus (status) {
      this.status.music = status
      this.status.music.cover = status.cover.replace('34y34', '120y120')//修正封面
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


</style>
