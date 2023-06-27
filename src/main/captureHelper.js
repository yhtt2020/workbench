const path = require('path')
const fs =  require('fs-extra')
const { app } = require('electron')
/**
 * 截图并保存到本地
 * @type {{capture(*, string=, number=): Promise<null|string|boolean>}}
 */
const captureHelper = {
  async capture (webContents, dirname = '/capture', filename = Date.now()) {
    let dir = path.join(app.getPath('userData'), dirname)
    fs.ensureDirSync(dir)
    let imagePath = path.join(app.getPath('userData'), dirname, filename + '.jpg')
    if (webContents.isDestroyed()) {
      return null
    }
    let capturedImage = await webContents.capturePage()
    if (capturedImage.isEmpty()) {
      //如果截图为空，则直接返回路径，而不进行覆盖，以提升截图成功率
      console.warn('截图失败')
      return imagePath
    }
    try {
      fs.writeFileSync(imagePath, capturedImage.toJPEG(50))
    } catch (err) {
      console.error(err)
      return false
    }
    return imagePath
  }
}

module.exports = captureHelper
