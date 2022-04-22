const path = require('path')
const fs = require('fs')

const outFile = path.resolve(__dirname, '../main.build.js')

const modules = [
  'dist/localization.build.js',
  'main/ipcMessageMain.js',
  'main/menu.js',
  'main/touchbar.js',
  'main/registryConfig.js',
  'main/main.js',
  'main/sidePanel.js',
  'main/bindIPC.js',
  'main/appManager.js',
  'main/popManager.js',
  'main/siteCard.js',
  'main/downloadCard.js',
  'main/userScript.js',
  'main/handleAxios.js',
  'main/group.js',
  'main/update.js',
  'js/util/settings/settingsMain.js',
  'main/filtering.js',
  'main/viewManager.js',
  'main/download.js',
  'main/UASwitcher.js',
  'main/permissionManager.js',
  'main/prompt.js',
  'main/remoteMenu.js',
  'main/remoteActions.js',
  'main/keychainService.js',
  'js/util/proxy.js',
  'main/mobileMod.js',
  'main/wizard.js',
  'main/messageCenter.js',
  'main/fav.js',
  'main/globalSearch.js'
]

function buildMain () {
  // build localization support first, since it is included in the bundle
  require('./buildLocalization.js')()

  /* concatenate modules */
  let output = ''
  modules.forEach(function (script) {
    output += fs.readFileSync(path.resolve(__dirname, '../', script)) + ';\n'
  })

  fs.writeFileSync(outFile, output, 'utf-8')
}

if (module.parent) {
  module.exports = buildMain
} else {
  buildMain()
}
