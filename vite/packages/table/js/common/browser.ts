const browser={
  /**
   * 在用户选择的浏览器内打开，根据工作台设置自动选择浏览器
   * @param url
   */
  async openInUserSelect(url:string){
    //获取到用户设置
    let settings=await tsbApi.settings.get('openUrlBrowser')
    if(settings==='system'){
      browser.openInSystem(url)
    }else{
      browser.openInInner(url)
    }
  },
  /**
   * 在系统默认浏览器内打开
   */
  openInSystem(url:string){
    console.log('在系统默认浏览器打开',url)
    require('electron').shell.openExternal((url))
  },
  /**
   * 在想天浏览器内打开
   * @constructor
   */
  openInInner(url:string){
    console.log('在想天浏览器打开',url)
    ipc.send('addTab',{url:url})
  },
  /**
   * 在工作台内打开
   */
  openInTable(url:string){

  },
}

export default browser
