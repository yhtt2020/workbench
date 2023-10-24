<template>
  <div class=" fixed inset-0 " style="z-index:1" v-if="singleLively">
    <video class="fullscreen-video" playsinline="" autoplay="" muted="" loop="" ref="backgroundVideo">
      <source :src="videoPath" type="video/mp4" id="bgVid">
    </video>
  </div>
  <div id="displayMiddle"
       style="margin-top: -6em;min-height: 15em; z-index:9999999">
    <div v-if="settings.showTime && loaded" class="time" style="">
      <span style="font-size: 3.5em">{{ hours }}:{{ minutes }}</span>
      <div style="margin-top: -0.5em"> {{ year }}年{{ month }}月{{ day }}日 {{ week }}</div>
    </div>
    <div id="tip" class="flex items-center justify-center" style="color: white;font-size: 20px;margin-top: 2em">
      <!--      <Icon icon="jiesuo" style="font-size: 30px;vertical-align: text-top"></Icon>-->
      <div class="flex flex-row tip-items">
        <div @click.stop="enter" class="tip-item">
          <div>
            <iconify class="tip-icon" icon="akar-icons:lock-off"></iconify>
          </div>
          <div class="tip-text">
            解锁
          </div>
        </div>
        <!--        <div>-->
        <!--          <div>-->
        <!--            <iconify ></iconify>-->
        <!--          </div>-->
        <!--          <div>-->
        <!--            切换-->
        <!--          </div>-->
        <!--        </div>-->
        <div @click.stop="enterGallery" class="tip-item">
          <div>
            <iconify class="tip-icon" icon="akar-icons:star"></iconify>
          </div>
          <div class="tip-text">
            壁纸库
          </div>
        </div>
        <div @click.stop="enterSetting" class="tip-item">
          <div>
            <iconify class="tip-icon" icon="akar-icons:gear"></iconify>
          </div>
          <div class="tip-text">
            设置
          </div>
        </div>

      </div>
      <!--      <span class="ml-2">点击屏幕中间解锁，右键进入壁纸设置</span>-->
    </div>

    <div class="mt-10 card half count-downtime" v-if="countDowntime.hours">
      <div class="left-time">
        <Icon
          style="width: 3em; height: 3em;cursor:pointer;color: #FBAE17"
          icon="zanting"
          @click="closeCountDown" v-show="!countDownBtn"
        ></Icon>
        <Icon
          style="width: 3em; height: 3em;cursor:pointer;color: #FBAE17"
          icon="bofang"
          @click="startCountDown" v-show="countDownBtn"
        ></Icon>
        <Icon
          style="width: 2em; height: 2em;cursor:pointer"
          icon="guanbi1"
          @click="deleteCountDown"
        ></Icon>
      </div>
      <div class="right-time">
        <span style="color: #FBAE17;text-align: center; font-size: 1.5em;margin-right: 1em">计时</span>
        <span
          style="color: #FBAE17;font-size: 4em;font-weight:bolder"> {{
            countDowntime.hours + ':' + countDowntime.minutes + ':' + countDowntime.seconds
          }}</span>
      </div>
    </div>
  </div>

  <div class="fixed inset-0 home-blur" style="z-index: 999999999999;" v-if="visible">

    <div v-if="clockEvent[0]"
         class="fixed text-4xl text-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2  rounded-lg flex flex-col justify-evenly items-center"
         style="width: 480px;height: 320px;background:  #282828">
      <div>
        {{ clockEvent[0].dateValue.hours }}:{{
          clockEvent[0].dateValue.minutes
        }}
      </div>
      <div>
        {{ clockEvent[0].eventValue }}
      </div>
      <div style="width: 100px;height: 48px;"
           class="flex justify-center items-center text-base bg-blue-500 rounded-lg pointer" @click="handleOk">
        好的
      </div>

    </div>
  </div>
</template>

<script>
import Spotlight from 'spotlight.js'
import { appStore } from '../store'
import { countDownStore } from '../store/countDown'
import { cardStore } from '../store/card'
import { mapActions, mapState, mapWritableState } from 'pinia'
import { message, Modal } from 'ant-design-vue'
import { paperStore } from '../store/paper'
import axios from 'axios'
import { Icon as iconify } from '@iconify/vue'

const spotConfig = {
  control: '',
  play: true,

  infinite: true,

  title: false,
  autoplay: true,
}
export default {
  name: 'Lock',
  components: {
    iconify
  },
  data () {
    return {
      playing: [],
      singleLively: false,
      loaded: false,
      year: 0,
      month: 0,
      day: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      week: '',
      timer: null,
      date: '2023年2月11日 周四',
      time: ' 14:51 ',
      visible: false,
      wallPaper: 'https://ts1.cn.mm.bing.net/th/id/R-C.653b2eb4ae081875675c6d25a69834b0?rik=p%2fCn01vlMrCUxQ&riu=http%3a%2f%2fimg.pconline.com.cn%2fimages%2fupload%2fupc%2ftx%2fwallpaper%2f1208%2f02%2fc0%2f12659156_1343874598199.jpg&ehk=d8OPA9%2bWy7YX9FLF95st3Rmd8lG6XtopCz0uNZAbebs%3d&risl=&pid=ImgRaw&r=0',
      lively: [
        {
          name: 'abstract-20072.mp4'
        },
        {
          name: 'bible-105673.mp4'
        },
        {
          name: 'car-135728.mp4'
        },
        {
          name: 'cat-65438.mp4'
        },
        {
          name: 'energy-field-74933.mp4'
        },
        {
          name: 'highland-cows-65903.mp4'
        },
        {
          name: 'ink-67358.mp4'
        },
        {
          name: 'lonely-tree-38108.mp4'
        },
        {
          name: 'mountains-31175.mp4'
        },
        {
          name: 'sasuke-146064.mp4'
        },
        {
          name: 'stock.mp4'
        },
        {
          name: 'trees-24540.mp4'
        },
        {
          name: 'trees-98970.mp4'
        }
      ]
    }
  },
  mounted () {
    this.$nextTick(() => {
      $('#displayMiddle').css('top', 'calc(50vh - ' + $('#displayMiddle').height() / 2 + 'px)')
    })
    $('#displayMiddle').fadeIn(1000)
    // setTimeout(() => {
    //   $('#tip').fadeOut(1000)
    // }, 3000)
    if (this.settings.playType === 'my') {
      this.playAll()
    } else {
      this.playActive()
    }
    this.tick()
    if (!this.timer) {
      this.timer = setInterval(() => {
        this.tick()
      }, 1000)
    }
  },
  beforeUnmount () {
    clearInterval(this.timer)
  },
  computed: {
    ...mapState(paperStore, ['myPapers', 'settings', 'activePapers']),
    ...mapWritableState(cardStore, ['clockEvent', 'appDate',]),
    ...mapWritableState(countDownStore, ['countDowndate', 'countDowntime', 'countDownBtn']),
    videoPath () {
      return this.playing[0]['src-mp4']
    },
    config () {
      return {
        ...spotConfig,
        ...{
          autoslide: this.settings.interval,
          progress: this.settings.showProgress,
        }
      }
    }
  },
  methods: {
    ...mapActions(countDownStore, ['setCountDown', 'stopCountDown', 'openCountDown', 'dCountDown']),
    ...mapActions(cardStore, ['removeClock', 'changeClock']),
    enter (closeSpot = true) {
      if (closeSpot && !this.singleLively) {
        window.Spotlight.close()
      }
      console.log('处罚顶层返回')
      this.$router.go(-1)
    },
    enterSetting () {
      if (!this.singleLively) {
        window.Spotlight.close()
      }
      this.$router.go(-1)
      setTimeout(() => {
        this.$router.push({
          name: 'papersSetting'
        })
      }, 200)
    },
    enterGallery () {
      if (!this.singleLively) {
        window.Spotlight.close()
      }
      this.$router.go(-1)
      setTimeout(() => {
        this.$router.push({
          path: '/gallery'
        })
      }, 200)
    },
    handleOk () {
      this.visible = false
      this.removeClock(0)
      this.$refs.clock.currentTime = 0
      this.$refs.clock.pause()
    },
    tick () {
      let weeks = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日']
      var date = new Date()
      this.year = date.getFullYear()
      this.month = date.getMonth() + 1
      this.day = date.getDate()
      this.hours = date.getHours()

      this.minutes = date.getMinutes()
      if (this.minutes < 10) {
        this.minutes = '0' + this.minutes
      }
      this.seconds = date.getSeconds()
      this.week = weeks[date.getDay() - 1]
      this.loaded = true
    },

    playAll () {
      let LockArr = []
      if (this.settings.wallSource == 'my') {
        // 我的收藏
        if (this.myPapers.length === 0) {
          this.$router.replace({
            name: 'my'
          })
          Modal.error({ content: '请添加我的壁纸后重新锁屏。' })
          return
        }
        this.myPapers.map(el => {
          if (this.fileImageExtension(el)) {
            LockArr.push({
              'src-mp4': el.srcProtocol,
              media: 'video',
              poster: el.path,
              controls: false,
            })
          } else {
            LockArr.push({
              src: el.path
            })
          }
        })
        // 处理视频播放
        if (LockArr.length === 1) {
          if (LockArr[0].media === 'video') {
            this.singleLively = true
            this.playing = LockArr
            return
          }
        } else {
          this.singleLively = false
        }
        window.Spotlight.show(LockArr, this.config)
      } else if (this.settings.wallSource == 'bing') {
        // 必应壁纸
        let url = 'https://cn.bing.com/HPImageArchive.aspx?format=js&idx=1&n=8'
        axios.get(url).then(imagesResult => {
          if (imagesResult.status === 200) {
            let arr = imagesResult.data.images
            arr.forEach(item => {
              LockArr.push({
                src: 'https://cn.bing.com' + item.url,
                path: 'https://cn.bing.com' + item.url,
              })
            })
            window.Spotlight.show(LockArr, this.config)
          } else {
            Modal.error({ content: '网络加载错误，请检查设备后重试' })
            return
          }
        }, rej => {
          Modal.error({ content: '网络加载错误，请检查设备后重试' })
          return
        }).catch((err) => {
          console.log(err)
        })

      } else {
        // 拾光壁纸
        const url = `https://api.nguaduot.cn/timeline/v2?cate=landscape&order=date&no=99999999&date=20500101&score=99999999&client=thisky`
        axios.get(url).then(async res => {
          if (res.data.data.length !== 1) {
            let arr = res.data.data
            arr.forEach(item => {
              LockArr.push({
                src: item.imgurl,
                path: item.imgurl,
              })
            })
            window.Spotlight.show(LockArr, this.config)
          } else {
            return
          }
        }, rej => {
          Modal.error({ content: '网络加载错误，请检查设备后重试' })
          return
        }).catch((err) => {
          console.log(err)
        })
      }
    },
    playActive () {
      console.log('playActive')
      if (this.activePapers.length === 0) {
        this.$router.replace({
          name: 'my'
        })
        Modal.error({ content: '请激活壁纸后重新使用激活壁纸模式。' })
        return
      }
      let lockActive = []

      this.activePapers.map((el) => {
        if (this.fileImageExtension(el)) {
          lockActive.push({
            'src-mp4': el.srcProtocol,
            media: 'video',
            poster: el.path,
            controls: false,
          })
        } else {
          lockActive.push({
            src: el.path
          })
        }
      })
      if (lockActive.length === 1) {
        if (lockActive[0].media === 'video') {
          this.playing = lockActive
          this.singleLively = true
          return
        }
      } else {
        this.singleLively = false
      }
      window.Spotlight.show(lockActive, this.config)
    },
    closeCountDown () {
      this.stopCountDown()
    },
    startCountDown () {
      this.openCountDown()
    },
    deleteCountDown () {
      this.dCountDown()
    },
    // 判断文件是否为图片
    fileImageExtension (filePath) {
      const fileExtensions = filePath.src.split('.').pop()
      const extensions = ['mp4', 'mpeg', 'avi', 'rmvb']
      if (extensions.indexOf(fileExtensions) !== -1) {
        return true
      } else {
        return false
      }
    },
  },
  watch: {
    'appDate.minutes': {
      handler (newVal, oldVal) {
        try {
          if (
            this.appDate.minutes === this.clockEvent[0].dateValue.minutes &&
            this.appDate.hours === this.clockEvent[0].dateValue.hours && this.clockEvent[0].flag === undefined
          ) {
            this.visible = true
            setTimeout(() => {
              this.$refs.clock.play()
            }, 500)
          }
        } catch (err) {

        }
      },
      immediate: true,
    }
  }
}
</script>
<style>
.spl-header {
  display: none;
}
</style>
<style lang="scss" scoped>
.time {
  font-size: 1.5em;
  color: white;
  text-shadow: 0 0 2em #000;
  text-align: center
}

#displayMiddle {
  display: none;
  position: fixed;
  left: calc(25%);
  width: 50%;
  text-align: center;
  z-index: 9999999;
  /*background: rgba(0, 0, 0, 0.3);*/
  padding: 1em;
  border-radius: 2em;
}

.count-downtime {
  display: flex;
  flex-direction: row;
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translateX(-50%);
  align-items: center;
  justify-content: space-between;
  height: 15%;
  width: 30em;
  z-index: 999999;

  .left-time {
    flex: 1;
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .right-time {
    flex: 3;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

#displayMiddle {
  z-index: 9999
}

.tip-items {
  gap: 40px;

  .tip-item {
    &:hover {
      opacity: 0.7;
    }

    cursor: pointer;

    .tip-icon {
      font-size: 34px;
    }

    .tip-text {
      font-size: 16px;
    }
  }
}
</style>
