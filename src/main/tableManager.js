global.tableWin = null
let app = require('electron').app

class TableManager {

  async init () {
    if (global.tableWin === null) {
      tableWin = await windowManager.create({
        windowOption: {
          alwaysOnTop: true,
          width: 960,
          height: 540,
          frame: false,
          backgroundColor: '#fff',

        },
        webPreferences: {
          devTools: true,
          preload: require('path').join(__dirname, '../../src/preload/tablePreload.js'),
          nodeIntegration: true,
          sandbox:false,
          contextIsolation: false,
          additionalArguments: [
            '--user-data-path=' + userDataPath,
            '--app-version=' + app.getVersion(),
            '--app-name=' + app.getName(),
            ...((isDevelopmentMode ? ['--development-mode'] : []))
          ]
        }
      })

      tableWin.window.webContents.loadURL(render.getUrl('table.html'))
      tableWin.window.on('close', () => globalSearch = null)

    } else {
      if (tableWin.window.isFocused()) {
        tableWin.window.hide()
      } else {
        tableWin.window.show()
        tableWin.window.focus()
      }
    }
  }
}

module.exports = TableManager
