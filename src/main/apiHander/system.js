const Base = require('./base')
const SystemHelper = require('../libs/systemHelper')
const bookmarkHelper = require('../libs/bookmarkHelper')
const {nativeTheme} = require('electron')
class system extends Base {
  constructor () {
    super('system')
  }

  bindIPC () {


    this.on('extractFileIcon', async (event, args) => {
      try {
        event.returnValue = await SystemHelper.extractFileIcon(args.uri)
      } catch (e) {
        console.error('获取文件图标失败', e)
        return event.returnValue = ''
      }
    })
    this.on('getRealPath', async (event, args) => {
      try {
        event.returnValue = await SystemHelper.readUrlInfo(args.uri)
      } catch (e) {
        console.error('获取文件真实路径失败', e)
        return event.returnValue = ''
      }
    })

    this.on('restart',async(event,args)=>{
      require('electron').app.relaunch()
      require('electron').app.exit(0)
    })

    this.on('isDarkMode',(event,args)=>{
      event.returnValue = nativeTheme.themeSource
    })
    this.on('setLocalPaper',(event,args)=>{
      console.log('setLocalPaper',args)
      return require('wallpaper').set(args.uri.replace('file://',''))
    })
    this.on('setDarkMode',(event,args)=>{
      nativeTheme.themeSource = args.mode===true?'dark':'light'
    })
    this.on('shouldUseDarkMode',(event,args)=>{
      event.returnValue = nativeTheme.shouldUseDarkColors
    })

    this.on('getBookmarks', async (event, args) => {
      event.returnValue = await bookmarkHelper.getBookmarks(args.browser)
    })
    this.on('getBookmarks', async (event, args) => {
      let query = []
      if (typeof args.browser === 'string') {
        query.push(args.browser)
      }else{
        query=args.browser
      }
      let result = {}
      for (const b of query) {
        try{
          if (b === 'edge') {
            result.edge = await bookmarkHelper.importEdgeBookmark()
          }
          if (b === 'chrome') {
            result.chrome =  await bookmarkHelper.importChromeBookmark()
          }
        }catch (e) {
          console.error(b+'浏览器收藏夹无法导入')
        }
      }
      event.reply(args.cbId,{result:result})
    })
  }
}

module.exports = system
