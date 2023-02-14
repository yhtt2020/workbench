<template>
  <div style="text-align: center">


    <a-avatar :size="120" :src="cover"  style="margin: 20px;border: 3px solid #6b6b6b"></a-avatar>
    <div style="font-size: 1.5em">{{title}}歌名</div>
    <div  style="font-size: 1.3em" class="singer">
      {{ singer }}
    </div>
    <div style="width: 400px;margin: auto"  class="player">
     <a-slider v-model:value="percent"/>
    </div>
    <div style="font-size: 2em">
      {{progress}} / {{total}}
    </div>
    <div style="text-align: center">
      <div style="width: 250px;margin: auto">
        <a-row>
          <a-col :span="8">
            <Icon style="font-size: 4em;vertical-align: middle" icon="#icon-zanting"></Icon>
          </a-col>
          <a-col :span="8">
            <Icon style="font-size:4em;vertical-align: middle" icon="#icon-bofang"></Icon>
          </a-col>
          <a-col :span="8">
            <Icon style="font-size: 4em;vertical-align: middle" icon="#icon-tingzhi"></Icon>
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
    ...mapWritableState(appStore, ['apps'])
  },
  mounted () {
    window.updateMusicStatusHandler=this.updateStatus
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
      title:'',
      prompt:'',
      progress:'',
      total:'',
      singer:'',
      cover:'',
      percent:0
    }
  },
  methods: {
    updateStatus(status){
      this.title=status.title
      this.progress=status.progress
      this.total=status.total
      this.singer=status.singer
      this.cover=status.cover.replace('34y34','120y120')
      console.log(status,'更新音乐状态')
      this.getPercent()
    },
    getPercent(){
      let currentText=this.progress.split(':')
      let current
      if(currentText.length===2){
        current=new Date('2023/1/1 00:'+currentText[0]+':'+currentText[1])
      }
      let totalText=this.total.split(':')
      let total
      if(totalText.length===2){
        total=new Date('2023/1/1 00:'+totalText[0]+':'+totalText[1])
      }

      let totalSeconds=total.getHours()*60*60+total.getMinutes()*60+total.getSeconds()
      let currentSeconds=current.getHours()*60*60+current.getMinutes()*60+current.getSeconds()
      console.log(currentSeconds)
      console.log(totalSeconds)
      this.percent=(currentSeconds/totalSeconds*100).toFixed(0)
    },

    ...mapActions(appStore, ['addApps']),

    changeTab (data) {
      console.log(data,'data')
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
.ant-slider-track{
  background: #1a1a1a;
}
.ant-slider-track{
  height: 8px;
  border-radius: 100px;
}
.ant-slider-rail{
  height: 8px;
  border-radius: 100px;
}
.ant-slider-handle{
  border-color: #333;
  width: 20px;
  height: 20px;
}
</style>
<style scoped lang="scss">

.prompt{

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
