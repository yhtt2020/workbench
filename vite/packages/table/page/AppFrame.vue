<template>
  <div class="drag" :style="{background:app.theme||'#424242'}" style="height: 4em">
    <a-row>
      <a-col :span="6">
        <div @click="goBack" class="app-btn no-drag">
          <div class="btn-wrapper">
            <Icon icon="xiangzuo" style="font-size: 1.5em;vertical-align: middle"></Icon>
            返回
          </div>
        </div>
      </a-col>
      <a-col :span="12" style="text-align: center;line-height: 3">
        <!--        <span style="font-size: 1.2em">您可以通过按下esc键隐藏/显示外框。</span>-->
      </a-col>
      <a-col :span="6" style="text-align: right">
        <div class="app-btn no-drag">
          <div class="btn-wrapper">
            <Icon icon="touping" style="font-size: 1.5em;vertical-align: middle"></Icon>
            投屏
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

export default {
  name: 'AppFrame',
  data () {
    return { app: {} }
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
    console.log(this.fullScreen)
    if(app.type==='system'){
      //系统应用则跳转
      this.$router.replace({
        ...JSON.parse(app.route)
      })
    }else{
      //非系统应用，则打开内嵌网页
      this.$nextTick(()=>{
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
    handleLeave () {
      if(this.app.type!=='system'){
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
</style>
