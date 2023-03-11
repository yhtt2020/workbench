<template>
  <div class="drag" :style="{background:app.theme||'#424242'}" style="height: 4em">
    <a-row>
      <a-col :span="6">
        <div @click="goBack" class="app-btn no-drag">
          <div  class="btn-wrapper">
            <Icon icon="xiangzuo" style="font-size: 1.5em;vertical-align: middle"></Icon>
          </div>

        </div>
        <div @click="refresh" class="app-btn no-drag">
        <div class="btn-wrapper">
          <Icon icon="shuaxin" style="font-size: 1.5em;vertical-align: middle"></Icon>
        </div>
        </div>
      </a-col>
      <a-col :span="10" style="text-align: center;line-height: 3">
        <div class="no-drag"  v-if="showScale">
          <a-row>
            <a-col :span="6">
              网页缩放
            </a-col>
            <a-col :span="10">
              <a-slider @change="setScale" :marks="marks" :step="10" v-model:value="scale" :min="50" :max="300" style="width: 100px"></a-slider>
            </a-col>
            <a-col :span="8">
              <a-button-group >
                <a-button @click="()=>{if(this.scale+10<=300){this.scale=this.scale+10;this.setScale(this.scale)}}"><plus-outlined /></a-button>
                <a-button @click="()=>{if(this.scale-10>=20) {this.scale=this.scale-10;this.setScale(this.scale)}}"><minus-outlined /></a-button></a-button-group>
            </a-col>
          </a-row>
        </div>

        <!--        <span style="font-size: 1.2em">您可以通过按下esc键隐藏/显示外框。</span>-->
      </a-col>
      <a-col :span="8" style="text-align: right">
        <div @click="switchScale" class="app-btn no-drag">
          <Icon icon="wenzidaxiao2" style="font-size: 1.5em;vertical-align: middle"></Icon>
          <div class="scale">{{ scale }}%</div>
        </div>
        <div class="app-btn no-drag">
          <div v-if="fullScreen" @click="toggleFullScreen" class="btn-wrapper">
            <Icon icon="quxiaoquanping_huaban" style="font-size: 1.5em;vertical-align: middle"></Icon>
          </div>
          <div v-else @click="toggleFullScreen" class="btn-wrapper">
            <Icon icon="quanping_huaban" style="font-size: 1.4em;vertical-align: middle"></Icon>
          </div>
        </div>
        <div class="app-btn no-drag">
          <div class="btn-wrapper">
            <Icon icon="touping" style="font-size: 1.5em;vertical-align: middle"></Icon>
          </div>
        </div>
      </a-col>
    </a-row>
  </div>
  <div v-if="fullScreen" id="frame" :style="{background:app.theme||'#424242'}" style="height: calc(100vh - 4em)">
    <router-view></router-view>
  </div>
  <div v-else id="frame" :style="{background:app.theme||'#424242'}" style="height: calc(100vh - 15em)">
    <router-view></router-view>
  </div>
</template>

<script>
import { appStore } from '../store'
import { mapWritableState } from 'pinia'
import {PlusOutlined,MinusOutlined} from '@ant-design/icons-vue'
export default {
  name: 'AppFrame',
  data () {
    return {
      app: {},
      showScale: false,
      scale:100,
      marks:{
        100: '100',
        200:'200',
      }
    }
  },
  components:{
    PlusOutlined,MinusOutlined
  },
  computed: {
    ...mapWritableState(appStore, ['fullScreen'])
  },
  mounted () {
    let app = this.$route.params
    if (typeof app.fullScreen === 'undefined') {
      app.fullScreen = true //默认全屏
    } else {
      app.fullScreen = !(app.fullScreen === 'false')
    }
    if (app.fullScreen) {
      this.fullScreen = app.fullScreen
    }
    if (app.type === 'system') {
      //系统应用则跳转
      this.$router.replace({
        ...JSON.parse(app.route)
      })
    } else {
      //非系统应用，则打开内嵌网页
      this.$nextTick(() => {
        let frame = document.getElementById('frame')
        let position = {
          x: Number(frame.getBoundingClientRect().x.toFixed(0)),
          y: Number(frame.getBoundingClientRect().y.toFixed(0)),
          width: frame.offsetWidth,
          height: frame.offsetHeight
        }
        let args = {
          position,
          app
        }
        this.app = app
        ipc.send('executeTableApp', args)
      })
    }
  },
  beforeUnmount () {
    this.handleLeave()
  },
  methods: {
    switchScale () {
      this.showScale=!this.showScale
    },
    setScale(value){
      ipc.send('setTableAppScale',{ app: JSON.parse(JSON.stringify(this.app)),scale:value})
    },
    toggleFullScreen () {
      this.fullScreen = !this.fullScreen
      this.$nextTick(() => {
        this.syncBounds()
      })
    },
    syncBounds () {
      let frame = document.getElementById('frame')
      let position = {
        x: Number(frame.getBoundingClientRect().x.toFixed(0)),
        y: Number(frame.getBoundingClientRect().y.toFixed(0)),
        width: frame.offsetWidth,
        height: frame.offsetHeight
      }
      let args = {
        bounds: position,
        app: this.app
      }
      console.log('发送消息')
      ipc.send('syncTableAppBounds', JSON.parse(JSON.stringify(args)))
    },
    handleLeave () {
      if (this.app.type !== 'system') {
        //非系统应用，隐藏应用
        if (this.app.background) {
          ipc.send('hideTableApp', { app: JSON.parse(JSON.stringify(this.app)) })
        } else {
          ipc.send('closeTableApp', { app: JSON.parse(JSON.stringify(this.app)) })
        }
        this.fullScreen = false
      }
    },
    goBack () {
      this.$router.go(-1)
    },
    refresh(){
      ipc.send('refreshTableApp', { app: JSON.parse(JSON.stringify(this.app)) })
    }
  }
}
</script>

<style scoped lang="scss">
.app-btn {
  display: inline-block;
  cursor: pointer;

  &:hover .btn-wrapper {
    color: #1e1e1e;
    background: #969696;
  }
}

.btn-wrapper {
  font-size: 1.2em;
  border-radius: 0.5em;
  padding: 0.4em 0.8em;
  margin: 0.3em 0.4em;
}

.scale {
  display: inline-block;
  width: 3em;
  font-weight: bold;
}
</style>
