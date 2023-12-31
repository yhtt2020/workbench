const path = require('path')
const fs = require('fs')

const outFile = path.resolve(__dirname, '../main.build.js')

const modules = [
  'dist/localization.build.js',
  'main/start.js',
  'main/menu.js',
  'main/touchbar.js',
  'main/registryConfig.js',
  'main/main.js',
  'main/extension.js',
  'main/render.js',
  'main/capture.js',
  'main/sidePanel.js',
  'main/bindIPC.js',
  'main/appManager.js',
  'main/appStore.js',
  'main/popManager.js',
  'main/siteCard.js',
  'main/downloadCard.js',
  'main/tray.js',
  'main/userScript.js',
  'main/group.js',
  'main/update.js',
  'main/filtering.js',
  'main/viewManager.js',
  'main/download.js',
  'main/UASwitcher.js',
  'main/permissionManager.js',
  'main/prompt.js',
  'main/remoteMenu.js',
  'main/remoteActions.js',
  'main/keychainService.js',
  'main/kdbxService.js',
  'main/handleAxios.js',
  'main/api.js',
  'js/util/proxy.js',
  'main/mobileMod.js',
  'main/wizard.js',
  'main/messageCenter.js',
  'main/fav.js',

  'js/util/statsh/statshMain.js',
  // 'src/main/windowManager.js',//加入浏览器api处理者
  'main/handleApi.js',//加入浏览器api处理者
  'main/globalSearch.js',
]

function buildMain () {
  // build localization support first, since it is included in the bundle
  require('./buildLocalization.js')()

  /* concatenate modules */
  let output = ''
  modules.forEach(function (script) {
    output += fs.readFileSync(path.resolve(__dirname, '../', script)) + ';\n'
  })

  output+='})'//拼接回后面部分

  fs.writeFileSync(outFile, output, 'utf-8')
}

if (module.parent) {
  module.exports = buildMain
} else {
  buildMain()
}
