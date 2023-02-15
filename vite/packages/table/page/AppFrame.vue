<template>
  <div class="drag" :style="{background:app.theme||'#424242'}" style="height: 4em">
    <a-row>
      <a-col :span="6">
        <div @click="goBack" class="app-btn no-drag">
          <div class="btn-wrapper">
            <Icon icon="#icon-xiangzuo" style="font-size: 1.5em;vertical-align: middle"></Icon>
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
            <Icon icon="#icon-touping" style="font-size: 1.5em;vertical-align: middle"></Icon>
            投屏
          </div>
        </div>
      </a-col>
    </a-row>
  </div>
  <div id="frame" :style="{background:app.theme||'#424242'}" style="height: calc(100vh - 4em)">

  </div>
</template>

<script>
export default {
  name: 'AppFrame',
  data () {
    return { app: {} }
  },
  mounted () {
    let app = this.$route.params
    let frame = document.getElementById('frame')
    let position = {
      x: frame.offsetLeft,
      y: frame.offsetTop,
      width: frame.offsetWidth,
      height: frame.offsetHeight
    }
    let args = {
      position,
      app
    }
    this.app = app
    ipc.send('executeTableApp', args)
  }, methods: {
    goBack () {
      if (this.app.background) {
        ipc.send('hideTableApp', { app: JSON.parse(JSON.stringify(this.app)) })
      } else {
        ipc.send('closeTableApp', { app: JSON.parse(JSON.stringify(this.app)) })
      }
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
