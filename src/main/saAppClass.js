const fs= require('fs-extra')
const path=require('path')
const app=require('electron').app
const nativeImage=require('electron').nativeImage
const svg2img=require('svg2img')

const localCacheManager = require('../../js/main/localCacheManager')

const logoPath=path.join(app.getPath('userData'),'app','logo')
const defaultLogo=path.join(__dirname,'icons','logo1024.png')

let defaultNotificationIcon = path.join(__dirname, '/icons/logo1024.png')
if (process.platform === 'win32') {
  defaultNotificationIcon = path.join(__dirname, '/icons/logo128.png')
}
class SaApp {
  instance //saApp  { info:saApp,window:window,view:view}
  logo
  constructor (saApp) {
    this.instance=saApp
    this.logo=this.getLogoUri()
  }

  /**
   * 获得logo的本地图形的uri
   * @returns {Promise<string>}
   */
  async getLogoUri () {
    fs.ensureDirSync(logoPath)//确认目录
     function isWebLogo (url) {
      return (url.startsWith('http://') || url.startsWith('https://'))
    }
    let logoLocal = path.join(logoPath, String(this.instance.info.id)+'.png')
    const logo = this.instance.info.logo
    if (!fs.existsSync(logoLocal)) {
      //如果不存在，则需要生成一下图标
      if (isWebLogo(logo)) {
        //如果是网络图标，先下载到本地再说
        let header=await localCacheManager.fetchContentWithType(logo,logoLocal+'.tmp')
        let ext = header.substr(header.lastIndexOf('/') + 1)
        if (ext === 'svg+xml') {
          ext = 'svg'
        }
        if(ext==='svg'){
          fs.copyFileSync(logoLocal+'.tmp',logoLocal+'.svg')
          await svg2img(logoLocal+'.svg',{
            format:"png",
            resvg:{
              fitTo:{
                mode:'width',
                value:256
              }
            }
          }, (err,buffer)=>{
            fs.writeFileSync(logoLocal, buffer);
            fs.unlinkSync(logoLocal+'.tmp')
          })
          fs.unlinkSync(logoLocal+'.svg')
          return logoLocal
        }else{
          let image=nativeImage.createFromPath(logoLocal+'.tmp')
          //如果可以成功创建bitmap证明后面可以用作消息通知的图标
          if(image.isEmpty()){
            fs.unlinkSync(logoLocal+'.tmp')
            return defaultNotificationIcon
          }else{
            fs.writeFileSync(logoLocal,image.toPNG())
            fs.unlinkSync(logoLocal+'.tmp')
            return logoLocal
          }
        }
      }
    }else{
      return logoLocal
    }
  }
}

module.exports=SaApp
