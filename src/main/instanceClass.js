/**
 * 实例类，主要是将窗体之类的对象进行再一次封装，方便对其进行二次操作
 */

class Instance {
  type = 'window'
  name
  object = null
  initOption
  createOptions //首次初始化时的options

  constructor (initOption) {
    this.initOption = initOption
    this.createOptions=initOption.createOptions
    this.name = initOption.name
  }

  destroy () {

  }

  close () {
    windowManager.close(this.name)
  }
}

/**
 * 窗体类
 */
class WindowInstance extends Instance {
  window

  constructor (initOption) {
    super(initOption)
    this.window = initOption.window
  }

  create () {
    //todo 将窗体实例创建的方法搬过来
  }

  close () {
    this.window.close()
    this.destroy()
  }
}


class FrameWindowInstance extends Instance{
  type='frameWindow'
  frame
  window
  constructor (iniOption) {
    super(iniOption)
    this.frame=iniOption.frame
    this.window=this.frame
    this.view=iniOption.view
  }

  close () {
    this.frame.removeBrowserView(this.view)
    this.view.webContents.destroy()
    this.frame.close()
  }

}


/**
 * view类
 */
class ViewInstance extends Instance {
  type = 'view'
  view
  parent

  constructor (initOption,parent) {
    super(initOption)
    this.view = initOption.view
    this.parent=parent
  }

  create () {
    //todo 将窗体实例创建的方法搬过来
  }

  close () {
    if(mainWindow){
      mainWindow.removeBrowserView(this.view)
    }
    if(this.view.webContents && !this.view.webContents.isDestroyed())
    {
      this.view.webContents.destroy()
    }
    this.parent.restoreAttachMod()
    windowManager.attachedView=null
    windowManager.attachedInstance=null
    windowManager.attachStatus=null
    this.destroy()
  }
}

module.exports={
  WindowInstance,ViewInstance,FrameWindowInstance
}
