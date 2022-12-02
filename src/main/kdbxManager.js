const dialog = require('electron').dialog
const { app, ipcMain: ipc } = require('electron')
app.whenReady().then(() => {
  ipc.on('selectKdbx', (event, args) => {
    event.returnValue = dialog.showSaveDialogSync({
      title: '选择保存位置',
      defaultPath: (args.name ? args.name : '') + '.kdbx',
      properties: [
        'createDirectory', 'showOverwriteConfirmation'
      ]
    })
  })
  ipc.on('selectKey', (event, args) => {
    event.returnValue = dialog.showOpenDialogSync({
      title: '选择秘钥文件',
      filters: [
        {
          name: 'key秘钥',
          extensions: ['key']
        },
        {
          name: '全部文件',
          extensions: '*'
        }],
      properties: ['openFile']
    })
  })
})

class KdbxManager {

}

module.exports = KdbxManager
