import {toRaw} from "vue";

const {clipboard, nativeImage} =require('electron')
declare interface Options{
  duration:number,
  textChange,
  imageChange
}
export class ClipboardObserver {
  timer
  beforeText: string
  beforeImage: any
  duration = 500
  textChange: (text: string, beforeText: string) => void
  imageChange: (image: any, beforeImage: any) => void

  constructor(options: Options) {
    const {duration, textChange, imageChange} = options
    this.duration = duration
    this.textChange = textChange
    this.imageChange = imageChange
  }

  start(): void {
    this.setClipboardDefaultValue()
    this.setTimer()
  }

  stop(): void {
    this.clearTimer()
  }

  clearTimer(): void {
    clearInterval(this.timer)
    this.timer=null
  }

  setClipboardDefaultValue(): void {
    if (this.textChange) {
      this.beforeText = clipboard.readText()
    }
    if (this.imageChange) {
      this.beforeImage = clipboard.readImage()
    }
  }

  isRunning(){
    return !!this.timer
  }
  setTimer(): void {
    this.timer = setInterval(() => {
      if(this.textChange){
        const text = clipboard.readText()
        if (this.isDiffText(this.beforeText, text)) {
          this.textChange(text, this.beforeText)
          this.beforeText = text
        }
      }

      if (this.imageChange) {
        const image = clipboard.readImage()
        if (this.isDiffImage(this.beforeImage, image)) {
          this.imageChange(image, this.beforeImage)
          this.beforeImage = image
        }
      }

    }, this.duration)
  }

  /**
   * 判断内容是否不一致
   * @param beforeText
   * @param afterText
   * @returns
   */
  isDiffText(beforeText: string, afterText: string): boolean {
    return afterText && beforeText !== afterText;
  }

  /**
   * 判断图片是否不一致
   * @param beforeImage
   * @param afterImage
   * @returns
   */
  isDiffImage(beforeImage: any, afterImage: any): boolean {
    if(!beforeImage){
      return false
    }
    let hasAfterImage= afterImage && !afterImage.isEmpty()
    if(!hasAfterImage){
      return false
    }
    let beforeURL=toRaw(beforeImage).toDataURL()
    let afterURL= afterImage.toDataURL()
    let diff=beforeURL !==afterURL
    return diff
  }
}
