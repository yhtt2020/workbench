

const browser={
  /**
   * 在用户选择的浏览器内打开，根据工作台设置自动选择浏览器
   * @param url
   */
  async openInUserSelect(url:string){

    if (!window.$usePlat('client')){
      return  window.open(url,'_blank')
    }
    //获取到用户设置
    let settings=await tsbApi.settings.get('openUrlBrowser')
    if(settings==='system' || !settings){
      browser.openInSystem(url)
    }else if(settings==='inner'){
      browser.openInInner(url)
    } else {
      browser.openInTable(url,{})
    }
  },
  /**
   * 在系统默认浏览器内打开
   */
  openInSystem(url:string){
    if (!window.$usePlat('client')){
      window.open(url,'_blank')
      return
    }
    console.log('在系统默认浏览器打开',url)
    win32.openURL(url)
  },
  /**
   * 在想天浏览器内打开
   * @constructor
   */
  openInInner(url:string){
    if (!window.$usePlat('client')){
      window.open(url,'_blank')
      return
    }
    ipc.send('addTab',{url:url})
  },
  /**
   * 在工作台内打开
   */
  openInTable(url:string,options:{}){
    if (!window.$usePlat('client')){
      window.open(url,'_blank')
      return
    }
    window.$app.$router.push({
      name:"browser",
      params:{
        url:url,
        ...options
      }
    })
  },
  openInMobMod(url:string,options:{partition:string,newName:string}){
    ipc.send('enableEmulation',{
      partition:'persist:webcontent',
      newName:'手机模式',
      ...options,
      url: url,
    })
  }
}

export default browser
