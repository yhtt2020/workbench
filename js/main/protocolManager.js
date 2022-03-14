let protocol=require('electron').protocol
/**
 * 协议管理工具，主要用于注册协议，分析协议，处理协议，appManager内部含有一个对象实例
 * @type {{initialize(): void}}
 */
protocolManager={
  sidePanel:null,
  electronLog:null,
  initialize(sidePanel,electronLog){
    protocolManager.sidePanel=sidePanel
    protocolManager.electronLog=electronLog
    protocol.registerFileProtocol('tsb', (request, callback) => {
        protocolManager.handleProtocol(request.url)
    })
  },
  /**
   * 处理协议，传递一个实际的协议
   * @param url
   */
  handleProtocol(url){
    try{
      const urlObj = new URL(url); // sunan://222?aa=bb&cc=dd
      const { searchParams } = urlObj;
      if(urlObj.hostname==='app')
      {
        //是app协议
        let action=urlObj.pathname.split('/')[1]
        if(action==='redirect'){
          protocolManager.sidePanel.send('appRedirect',{
            package:searchParams.get('package'),
            url:searchParams.get('url'),
            background:searchParams.get('background')!==null?searchParams.get('background'):true}
          )
          // console.log('是重定向协议')
          // console.log('url=',searchParams.get('url'))
        }
      }
    }catch(e){
      protocolManager.electronLog.error(e)
    }
  },

  /**
   * type image,text,link,file
   * @param type image,text,link,file
   * @param args 参数，需要夹带进来的参数，需要参考语雀开发文档
   * @param target 指定目标应用，如果不指定，系统会自动处理，当存在一个可处理的应用的时候，执行该应用，多个的时候让用户选择应用，默认应用列表请查阅文档
   * https://duanshuo.yuque.com/hfru7g/gta7yy/mblfzu/
   */
  handleFileAssign(type,args,target=''){
    //转发给sidebar去处理文件关联事件
    const defaultTarget={
      'image':'com.thisky.imageEditor'
    }
    if(target===''){
      if(defaultTarget[type]){
        fileDefaultTarget=defaultTarget[type]
      }
    }
    protocolManager.SidePanel.send('handleFileAssign',{type,args,target,fileDefaultTarget})
  },
  /**
   * 处理行为
   * @param appWindow
   * @param action
   * @param option
   */
  handleAction(window,action,option){
    console.log('action',action,'option',option)
   switch(action){
        case 'redirect':
          window.view.webContents.loadURL(option.url)
          break
        case 'fileAssign':
          window.view.webContents.send('fileAssign',{filePath:option.filePath})
          console.log(option)
      }
  }
}
module.exports=protocolManager
