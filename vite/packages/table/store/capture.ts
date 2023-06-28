import {defineStore} from "pinia";
import dbStorage from "./dbStorage";
import {message} from "ant-design-vue";
import filenamify from "filenamify";

import { formatSeconds, timeStamp } from '../util'
// @ts-ignore
export const captureStore = defineStore("captureStore", {
  state: () => ({
    sources: [],
    settings: {
      //截图保存位置
      imageSavePath: '',
      //录屏保存位置
      videoSavePath: '',
      videoBitsPerSecond:1.5e6
    },
    images:[],
    videos:[],
    currentSource:{},//当前的源
  }),
  actions: {
    bindCaptureIPC() {
      console.log('绑定capture事件')
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
    filterName (name) {
      return filenamify(name)
    },
    /**
     * 截图回调
     * @param image
     * @param cb
     */
    callback (image,cb) {
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
          if(cb){
            cb(path)
          }
        }
      })

    },
    /**
     * 截图
     */
    screenShoot(cb){
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
            this.callback(canvas.toDataURL('image/png'),cb)
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
    }

  },
  persist: {
    enabled: true,
    strategies: [{
      // 自定义存储的 key，默认是 store.$id
      // 可以指定任何 extends Storage 的实例，默认是 sessionStorage
      storage: dbStorage,
      // state 中的字段名，按组打包储存
    }]
  }
})
