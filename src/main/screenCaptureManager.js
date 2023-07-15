const desktopCapturer = require('electron').desktopCapturer

class ScreenCaptureManager {
  async getSource () {
     let sources=await desktopCapturer.getSources({
      types: ['screen', 'window'], // 设定需要捕获的是"屏幕"，还是"窗口"
      thumbnailSize: {
        height: 300, // 窗口或屏幕的截图快照高度
        width: 300 // 窗口或屏幕的截图快照宽度
      },
      fetchWindowIcons: true // 如果视频源是窗口且有图标，则设置该值可以捕获到的窗口图标
    })
    return sources
    // .then(sources => {
    //
    //   sources.forEach(source => {
    //
    //     // 如果视频源是窗口且有图标，且fetchWindowIcons设为true，则为捕获到的窗口图标
    //
    //     // console.log(source.appIcon)
    //
    //     // 显示器Id
    //
    //     console.log(source.display_id)
    //
    //     // 视频源的mediaSourceId，可通过该mediaSourceId获取视频源
    //
    //     console.log(source.id)
    //
    //     // 窗口名，通常来说与任务管理器看到的进程名一致
    //
    //     console.log(source.name)
    //
    //     // 窗口或屏幕在调用本API瞬间抓捕到的截图快照
    //
    //     // console.log(source.thumbnail)
    //
    //   })})

  }
}
module.exports=ScreenCaptureManager
