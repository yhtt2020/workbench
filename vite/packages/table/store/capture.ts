import {defineStore} from "pinia";
import dbStorage from "./dbStorage";
import {message} from "ant-design-vue";
import filenamify from "filenamify";

import {timeStamp} from '../util'

const fs = require('fs')
// @ts-ignore
export const captureStore = defineStore("captureStore", {
  state: () => ({
    sources: [],
    settings: {
      //截图保存位置
      imageSavePath: '',
      //录屏保存位置
      videoSavePath: '',
      videoBitsPerSecond: 1.5e6
    },
    images: [],
    videos: [],
    currentSource: {},//当前的源
    recording: false,//正在录屏
    recordedSeconds: 0,//已录制时长，单位秒
    recorder: {},//录像机
    recordingTimer: null,//录制计时器
  }),
  actions: {
    bindCaptureIPC() {
      ipc.on('gotRecordSource', (event, args) => {
        console.log('回传消息=', args)
        this.sources = args.sources
      })
    },
    getSource() {
      ipc.send('getRecordSource')
    },
    /**
     * 过滤名称
     * @param name
     */
    filterName(name) {
      return filenamify(name)
    },
    /**
     * 截图回调
     * @param image
     * @param cb
     */
    callback(image, cb) {
      let time = timeStamp(Date.now())
      const filename = this.filterName(this.currentSource.name) + '_' + time.year + '年' + time.month + '月' + time.day + '日' + time.hours + '时' + time.minutes + '分' + time.seconds + '秒' + '.png'
      const path = require('path').join(this.settings.imageSavePath, filename)
      const base64 = image.replace(/^data:image\/\w+;base64,/, '')//去掉图片base64码前面部分data:image/png;base64
      const dataBuffer = new Buffer(base64, 'base64') //把base64码转成buffer对象，
      require('fs').writeFile(path, dataBuffer, (err) => {//用fs写入文件
        if (err) {
          console.log(err)
          message.error('文件保存失败', err)
        } else {
          if (cb) {
            cb(path)
          }
        }
      })

    },
    /**
     * 截图
     */
    screenShoot(cb) {
      //ipc.send('captureImage',{source:this.currentSource})
      const handleStream = (stream) => {
        //document.body.style.cursor = oldCursor
        // document.body.style.opacity = '1'
        // Create hidden video tag
        let video = document.createElement('video')
        video.autoplay = 'autoplay'
        video.style.cssText = 'position:absolute;top:-10000px;left:-10000px;'
        // Event connected to stream

        let loaded = false
        video.onplaying = () => {
          if (loaded) {
            return
          }
          loaded = true
          // Set video ORIGINAL height (screenshot)
          video.style.height = video.videoHeight + 'px' // videoHeight
          video.style.width = video.videoWidth + 'px' // videoWidth

          // Create canvas
          let canvas = document.createElement('canvas')
          canvas.width = video.videoWidth
          canvas.height = video.videoHeight
          let ctx = canvas.getContext('2d')
          // Draw video on canvas
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

          if (this.callback) {
            // Save screenshot to png - base64
            this.callback(canvas.toDataURL('image/png'), cb)
          } else {
            // console.log('Need callback!')
          }

          // Remove hidden video tag
          video.remove()
          try {
            stream.getTracks()[0].stop()
          } catch (e) {
            // nothing
          }
        }
        video.srcObject = stream
        document.body.appendChild(video)
      }

      // mac 和 windows 获取 chromeMediaSourceId 的方式不同
      if (require('os').platform() === 'win32') {
        try {
          navigator.getUserMedia({
            audio: false,
            video: {
              mandatory: {
                chromeMediaSource: 'desktop',
                chromeMediaSourceId: this.currentSource.id + '',
                minWidth: 1280,
                minHeight: 720,
                maxWidth: 8000,
                maxHeight: 8000,
              },
            },
          }, handleStream, () => {

          })
        } catch (e) {
          message.error('截图失败，请确认协议和域名，必须运行在localhost或者tsbapp协议下')
        }

      } else {
        // navigator.getUserMedia({
        //   audio: false,
        //   video: {
        //     mandatory: {
        //       chromeMediaSource: 'desktop',
        //       chromeMediaSourceId: `screen:${curScreen.id}`,
        //       minWidth: 1280,
        //       minHeight: 720,
        //       maxWidth: 8000,
        //       maxHeight: 8000,
        //     },
        //   },
        // }, handleStream, handleError)
      }
    },


    /*录屏*/
    /**
     * 开始录屏
     */
    async startRecording() {
      let videoSource
      try {


        videoSource = await navigator.mediaDevices.getUserMedia({
          audio: false, // 强行表示不录制音频，音频额外获取
          video: {
            mandatory: {
              chromeMediaSource: 'desktop',
              chromeMediaSourceId: this.currentSource.id
            }
          }
        })
        // Windows音频流获取
      } catch (e) {
        message.error('开始录制视频失败，请确认协议和域名，必须运行在localhost或者tsbapp协议下')
      }
      const audioSource = await navigator.mediaDevices.getUserMedia({
        audio: {
          mandatory: {
            // 无需指定mediaSourceId就可以录音了，录得是系统音频
            chromeMediaSource: 'desktop',
          },
        },

        // 如果想要录制音频，必须同样把视频的选项带上，否则会失败
        video: {
          mandatory: {
            chromeMediaSource: 'desktop',
          },
        },
      });

// 接着手工移除点不用的视频源，即可完成音频流的获取
      (audioSource.getVideoTracks() || []).forEach(track => audioSource.removeTrack(track))
      // 合并音频流与视频流

      const combinedSource = new MediaStream([...audioSource.getAudioTracks(), ...videoSource.getVideoTracks()])

      let types = [
        'video/webm',
        'audio/webm',
        'video/webm;codecs=vp9',
        'video/webm;codecs=vp8',
        'video/webm;codecs=daala',
        'video/webm;codecs=h264',
        'audio/webm;codecs=opus',
        'video/mpeg'
      ]
      for (let i in types) {
        // 可以自行测试需要的编码的MIME Type是否支持
        console.log('Is ' + types[i] + ' supported? ' + (MediaRecorder.isTypeSupported(types[i]) ? 'Yes' : 'No :('))

      }

      const recorder = new MediaRecorder(combinedSource, {
        mimeType: 'video/webm;codecs=vp9',
        // 支持手动设置码率，这里设了1.5Mbps的码率，以限制码率较大的情况
        // 由于本身还是动态码率，这个值并不准确
        videoBitsPerSecond: this.settings.videoBitsPerSecond,

      })

      const timeslice = 5000
      let fileBits = []
// 当数据可用时，会回调该函数，有以下四种情况：
// 1. 手动停止MediaRecorder时
// 2. 设置了timeslice，每到一次timeslice时间间隔时
// 3. 媒体流内所有轨道均变成非活跃状态时
// 4. 调用recorder.requestData()转移缓冲区数据时
      recorder.ondataavailable = (event) => {
        fileBits.push(event.data)
      }
      recorder.onstop = () => {
        // 录屏停止并获取录屏文件
        // 触发时机一定在ondataavailable之后
        const videoFile = new Blob(fileBits, {type: 'video/webm;codecs=vp9'})
        var reader = new FileReader()
        reader.onload = () => {
          var buffer = new Buffer(reader.result)
          //temp文件夹应已存在
          const time = timeStamp(Date.now())
          const fileName = this.filterName(this.currentSource.name) + '_' + time.year + '年' + time.month + '月' + time.day + '日' + time.hours + '时' + time.minutes + '分' + time.seconds + '秒' + '.webm'
          const savePath = require('path').join(this.settings.videoSavePath, fileName)
          fs.writeFile(savePath, buffer, {}, (err, res) => {
            if (err) {
              console.error(err)
              return
            }
            message.success('保存录屏成功')
          })
        }
        reader.readAsArrayBuffer(videoFile)
      }

      if (timeslice === 0) {

        // 开始录制，并一直存储数据到缓冲区，直到停止

        recorder.start()

      } else {

        // 开始录制，并且每timeslice毫秒，触发一次ondataavailable，输出并清空缓冲区（非常重要）

        recorder.start(timeslice)
        this.recording = true
        this.recordedSeconds = 0
        this.setRecordingTimer()

        this.recorder = recorder
      }

    },
    /**
     * 设置一个录制定时器
     * @param start 是否是启动，否则自动清理定时器
     */
    setRecordingTimer(start = true) {
      if (!start) {
        //如果是取消
        if (this.recordingTimer) {
          clearInterval(this.recordingTimer)
          return
        }
      }
      this.recordedSeconds = 0
      this.recordingTimer = setInterval(() => {
        this.recordedSeconds++
      }, 1000)
    },
    /**
     * 终止录屏
     */
    stopRecording() {
      try {
        this.setRecordingTimer(false)
        this.recorder.stop()
      } catch (e) {

      }
      this.recording = false
    },
    async reloadAll(){
      this.loadVideos()
      this.loadImages()
    },
    async loadImages() {
      this.images = this.genFileList(this.settings.imageSavePath, ['.jpg', '.png', '.bmp', '.jpeg'])
    },
    async loadVideos() {
      this.videos = this.genFileList(this.settings.videoSavePath, ['.mp4', '.avi', '.mpg', 'rmvb', 'webm'])
    },
    // 从目录开始
    genFileList(path, extMap) {
      let filesList = []
      this.readFile(path, filesList, extMap)
      return filesList
    },
    // 遍历读取文件
    readFile(path, filesList, extMap) {
      let files = fs.readdirSync(path) // 需要用到同步读取
      files.forEach((file) => {
        let states = fs.statSync(path + '/' + file)
        // ❤❤❤ 判断是否是目录，是就继续递归
        if (states.isDirectory()) {
          this.readFile(path + '/' + file, filesList, extMap)
        } else {
          // 不是就将文件push进数组，此处可以正则匹配是否是 .js 先忽略
          if (extMap.indexOf(require('path').extname(file)) > -1) {
            const stat = fs.statSync(path + '/' + file)
            filesList.push({
              stat: stat,
              filename: file,
              path: path + '/' + file
            })
          }
        }
      })
    },

  },
  persist: {
    enabled: true,
    strategies: [{
      // 自定义存储的 key，默认是 store.$id
      // 可以指定任何 extends Storage 的实例，默认是 sessionStorage
      storage: dbStorage,
      paths: ['settings', 'images', 'videos']
      // state 中的字段名，按组打包储存
    }]
  }
})
