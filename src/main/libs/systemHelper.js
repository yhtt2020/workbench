const path = require('path')
const fs = require('fs-extra')
const { app } = require('electron')

module.exports= class SystemHelper {
  static async extractFileIcon (uri) {
    console.log(uri,'路径')
    let icon = await require('electron').app.getFileIcon(uri)
    console.log(icon,'获取到的')
    if (!icon) {
      return ''
    }
    let savePath = path.join(app.getPath('userData'), 'icons')
    fs.ensureDirSync(savePath)
    let hash = SystemHelper.sha(uri)
    let filePath = path.join(savePath, hash + '.png')
    fs.writeFileSync(filePath, icon.toPNG())
    return filePath
  }

  static sha (text) {
    const crypto = require('crypto')
    const sha = crypto.createHash('sha1')
    sha.update(text)
    return sha.digest('hex')
  }
}
