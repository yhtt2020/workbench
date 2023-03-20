class Base {
  moduleName = '' //模块名，用于挂载

  constructor (moduleName) {
    this.moduleName = moduleName
  }

  /**
   * 挂载IPC
   */
  bindIPC(){

  }

  on (channel, cb) {
    this._on('api.' + this.moduleName + '.' + channel, (event, args) => {
      let instance = windowManager.get(args['_name'])
      cb(event, args['args'], instance)
    })
  }

  _on (channel, cb) {
    require('electron').ipcMain.on(channel, cb)
  }
}

module.exports = Base
