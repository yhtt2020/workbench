<template>
  <!-- 剪贴板音频组件 -->
  <div>
    <audio @timeupdate="updateProgress" controls ref="audioRef" style="display: none">
      <source :src="fileUrl" type="audio/mpeg" />
    </audio>
    <div class="audio-right flex items-center ">
      <div class="flex dialog-audio-play" @click="playAudio">
        <Icon :icon="audioStatus !== 'pause' ? 'bofang' : 'zanting'" style="font-size: 2em;"></Icon>
      </div>

      <div class="progress-bar-bg rounded-lg" id="progressBarBg" @click="setAudio($event)">
        <div class="progress-bar" id="progressBar"></div>
      </div>

      <div class="audio-time" style="min-height: 10px">
        <span class="audio-length-current" id="audioCurTime">{{ audioStart }}</span>  / 
        <span class="audio-length-total">{{ duration }}</span>
      </div>

      <div class="volume pl-3">
        <div @click.stop="() => { return false } " class="volume-progress" v-if="audioHuds">
          <div class="volume-bar-bg" id="volumeBarBg" @click="handleShowMuteIcon($event)">
            <div class="volume-bar" id="volumeBar"></div>
          </div>
        </div>
        <div class="flex items-center" @click.stop="audioHuds = !audioHuds">
          <Icon :icon="audioIcon" style="font-size: 2em;color: var(--primary-text);"></Icon>
        </div>
      </div>

    </div>
  </div>
</template>

<script>

export default{
  props: {
    fileUrl: {
      type: String
    }
  },

  data(){
    return{
      audioStatus: 'play',
      audioStart: '0:00',
      duration: '0:00',
      audioVolume: 0,
      audioHuds: false
    }
  },

  computed: {
    audioIcon() {
      if (this.audioHuds) {
        return this.audioVolume < 0.01 ?   'jingyin' : 'yinliang'
      } else {
        return 'yinliang'
      }
    }
  },

  mounted() {
    this.fetch()
  },

  methods:{
    fetch(){
      let that = this
      var myVid = this.$refs.audioRef
      myVid.loop = false
      // 监听音频播放完毕
      myVid.addEventListener(
        'ended',
        function () {
          that.audioStatus = 'play' // 显示播放icon
          document.getElementById('progressBar').style.width = '0%' // 进度条初始化
        },
        false
      )
      if (myVid != null) {
        myVid.oncanplay = function () {
          that.duration = that.transTime(myVid.duration) // 计算音频时长
        }
        myVid.volume = 0.5 // 设置音量50%
      }
    },
    // 播放暂停控制
    playAudio() {
      let recordAudio = this.$refs.audioRef // 获取audio元素
      if (recordAudio.paused) {
        recordAudio.play()
        this.audioStatus = 'pause'
      } else {
        recordAudio.pause()
        this.audioStatus = 'play'
      }
    },
    // 更新进度条与当前播放时间
    updateProgress(e) {
      var value = e.target.currentTime / e.target.duration
      if (document.getElementById('progressBar')) {
        document.getElementById('progressBar').style.width = value * 100 + '%'
        if (e.target.currentTime === e.target.duration) {
          this.audioStatus = 'pause'
        }
      } else {
        this.audioStatus = 'pause'
      }

      this.audioStart = this.transTime(this.$refs.audioRef.currentTime)
    },
    /**
     * 音频播放时间换算
     * @param {number} value - 音频当前播放时间，单位秒
     */
    transTime(time) {
      var duration = parseInt(time)
      var minute = parseInt(duration / 60)
      var sec = (duration % 60) + ''
      var isM0 = ':'
      if (minute === 0) {
        minute = '00'
      } else if (minute < 10) {
        minute = '0' + minute
      }
      if (sec.length === 1) {
        sec = '0' + sec
      }
      return minute + isM0 + sec
    },

    // 调节音频音量
    handleShowMuteIcon(e){
      let hdiv = document.getElementById('volumeBarBg').clientHeight
      let audio = this.$refs.audioRef
      // 只有音乐开始播放后才可以调节，已经播放过但暂停了的也可以
      let ratemin = e.offsetY / hdiv
      let rate = ratemin * 100
      document.getElementById('volumeBar').style.height = rate + '%'
      audio.volume = ratemin
      this.audioVolume = rate / 100
    },

    //音频进度调节
    setAudio(e){
      if(this.audioStatus === 'pause' || this.audioHuds === false){
        let wdiv = document.getElementById('progressBarBg').clientWidth
        let audio = this.$refs.audioRef
        // 只有音乐开始播放后才可以调节，已经播放过但暂停了的也可以
        let ratemin = e.offsetX / wdiv
        let rate = ratemin * 100
        document.getElementById('progressBar').style.width = rate + '%'
        audio.currentTime = audio.duration * ratemin
        this.audioStatus = 'pause'
        audio.play()
      }
    }
  }

}
</script>

<style lang="scss" scoped>
.volume{
  position: relative;
  .volume-progress {
    position: absolute;
    top: -120px;
    width: 32px;
    height: 110px;
    background: var(--main-bg);
    border-radius: 4px;
  }
  .volume-bar-bg {
    margin: 0 auto;
    width: 6px;
    height: 100%;
    background: rgba(92,94,102, 0.5);
    border-radius: 100px;
    flex: 1;
    position: relative;
    transform: rotate(180deg);
    cursor: pointer;
    .volume-bar {
      width: 6px;
      height: 50%;
      background: var(--active-bg);
      border-radius: 100px;
    }
  }
  .checked {
    color: var(--active-bg);
  }
}

.audio-right {
  width: 100%;
  height: 49px;
  line-height: 49px;
  background:var(--main-bg);
  border-radius: 6px;
  display: flex;
  padding: 0 15px;
  .dialog-audio-play {
    cursor: pointer;
    color:var(--primary-text);
    font-size: 20px;
  }
  .progress-bar-bg {
    background-color: rgba(92,94,102, 0.5);
    flex: 1;
    position: relative;
    height: 10px;
    margin-top: -1px;
    cursor: pointer;
    margin: 0 10px;
  }
  .progress-bar {
    background: var(--active-bg);
    width: 0%;
    height: 10px;
    border-radius: 5px;
  }

  .audio-time {
    overflow: hidden;
    font-size: 14px;
    .audio-length-total {
      float: right;
      color: var(--primary-text);
    }
    .audio-length-current {
      float: left;
      color: var(--primary-text);
    }
  }
}
</style>