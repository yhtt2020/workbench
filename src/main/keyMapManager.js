const { globalShortcut,ipcMain : ipc,Notification } = require('electron')
const keyMapModule = require('../../js/util/keyMap.js')
/**
 * 工作台专用快捷键设置处理
 */
class KeyMapManager {
  regResult = {}
  regEvents={}


  /**
   * 绑定修改快捷键的事件
   */
  bindIPC(){
    ipc.on('setKeyMap',async (event, args) => {
      const { key, shortcut } = args
      let rs
      try {
       // console.log(this.regEvents,'当前的绑定事件')
        const gotEvent = this.regEvents[key]
        if (!gotEvent) {
          console.warn('未设置快捷键事件：', key, shortcut)
        }
        rs =  globalShortcut.register(shortcut, async () => {
          await gotEvent()
        })
      } catch (e) {
        event.returnValue = false
      }
      if (rs) {
        //如果注册事件成功
        //成功则更改快捷键设置
        const oldKey = this.getKeyMap(key)
        if (this.regResult[key]) {
          //如果之前注册是成功的，则取消，否则则不需要取消
          globalShortcut.unregister(oldKey)
         // console.log('解绑老案件',oldKey)
        }
        this.setKeyMap(key, shortcut)//设置新快捷键
        this.regResult[key] = true
        event.returnValue = true
        //console.log('注册快捷键成功：',key,shortcut)
      } else {
        event.returnValue = false
      }
    })
  }
  /**
   * 获得一个键位
   * @param name
   * @param defaultKeys 提供默认的key，可选，如果不提供，则从类的defaultKeys里取
   * @returns {*}
   */
  getKeyMap (name,defaultKeys) {
    const keyMap = keyMapModule.userKeyMap(settings.get('keyMap'))
   // console.log(keyMap,'全局快捷键设置')
    let key=''
    //console.log(keyMap[name],'用户设置键位')
    if (keyMap) {
      if (keyMap[name]) {
        key = keyMap[name]
      }
    }
    return key
  }

  /**
   * 设置一个键位
   * @param name
   * @param key
   */
  setKeyMap (name, key) {
    const keyMap = keyMapModule.userKeyMap(settings.get('keyMap'))
    keyMap[name] = key
    settings.set('keyMap', keyMap)
  }

  /**
   *
   * @param key 键名，例如table，注意，默认快捷键和键名在js/util/keyMap.js中定义，未定义则无法记忆,
   * @param fn 功能，可写匿名函数
   * @param onFailure
   */
  async reg (key, fn, onFailure) {
    let mappedKey = this.getKeyMap(key)//默认快捷键为alt+space
    let registerResult = globalShortcut.register(mappedKey, async () => {
      await fn()
    })
    this.regEvents[key]=fn
    if (registerResult === false) {
      await onFailure(mappedKey)
      console.warn('注册全局快捷键失败：', key,mappedKey)
    } else {
     // console.log('注册快捷键成功：',key,mappedKey)
      this.regResult[key] = true
    }
  }

  /**
   * 统一注册，如果注册失败，则通过消息通知用户，注意，默认快捷键和键名在js/util/keyMap.js中定义，未定义则无法记忆
   * @param key 快捷键名称
   * @param fn 功能
   * @param onFailure 失败回调，自带key参数
   * @param message 失败通知后的补充说明
   * @returns {Promise<void>}
   */
  async regWithNotification(key, fn,onFailure,message=''){
    await this.reg(key, async () => {
      await fn()
    }, async (key) => {
      let notification = new Notification({
        title: '全局快捷键注册结果',
        body: '快捷键[' + key + ']被占用，请修改快捷键后使用。' + message,
        timeoutType: 'never'
      })
      notification.show()
      await onFailure(key)
    })
  }
}

module.exports=KeyMapManager
