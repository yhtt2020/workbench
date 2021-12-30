const path = require('path')
const fs = require('fs')

const userScriptModel = {

  pathName: '',
  scriptsPath: '',
  parseTampermonkeyFeatures (content) {
    var parsedFeatures = {}
    var foundFeatures = false

    var lines = content.split('\n')

    var isInFeatures = false
    for (var i = 0; i < lines.length; i++) {
      if (lines[i].trim() === '// ==UserScript==') {
        isInFeatures = true
        continue
      }
      if (lines[i].trim() === '// ==/UserScript==') {
        isInFeatures = false
        break
      }
      if (isInFeatures && lines[i].startsWith('//')) {
        foundFeatures = true
        var feature = lines[i].replace('//', '').trim()
        var featureName = feature.split(' ')[0]
        var featureValue = feature.replace(featureName + ' ', '').trim()
        featureName = featureName.replace('@', '')

        // special case: find the localized name for the current locale
        if (featureName.startsWith('name:') && featureName.split(':')[1].substring(0, 2) === navigator.language.substring(0, 2)) {
          featureName = 'name:local'
        }
        if (parsedFeatures[featureName]) {
          parsedFeatures[featureName].push(featureValue)
        } else {
          parsedFeatures[featureName] = [featureValue]
        }
      }
    }
    if (foundFeatures) {
      return parsedFeatures
    } else {
      return null
    }
  },
  /**
   * 删除脚本
   */
  deleteScript (filename) {
    const filePath = userScriptModel.scriptsPath+filename
    fs.rmSync(filePath)
    return !fs.existsSync(filePath)
  },
  init (userDataPath) {
    userScriptModel.scriptsPath = userDataPath + '/userscripts/'
    let scripts = []
    const pathName = userScriptModel.scriptsPath
    const files = fs.readdirSync(pathName)
    for (var i = 0; i < files.length; i++) {
      let filename = files[i]
      if (filename.endsWith('.js')) {
        const data = fs.statSync(path.join(pathName, files[i]))
        if (data.isFile()) {
          let script = {}
          script.name = '自定义脚本'
          script.filename = filename
          script.size = data.size
          script.createTime = data.ctime
          script.content = fs.readFileSync(path.join(pathName, filename), 'utf-8')
          const features = userScriptModel.parseTampermonkeyFeatures(script.content)
          console.log(features)
          // author: ['AC']
          // description: ['去掉百度的推广链接']
          // grant: ['none']
          // icon: ['https://coding.net/u/zb227/p/zbImg/git/raw/master/img0/icon.jpg']
          // include: (2) ['http://www.baidu.com/*', 'https://www.baidu.com/*']
          // name: ['AC-百度去广告']
          // namespace: ['ACNoAdd']
          // run-at: ['document-end']
          // version: ['5.0']
          script.feature = !!!features.description ? '-' : features.description.join('')
          script.author = !!!features.author ? '-' : features.author.join('')
          script.name = !!!features.name ? '-' : features.name.join('')

          script.version = !!!features.version ? '-' : features.version.join('')
          script.include = !!!features.include ? '-' : features.include.join('<br>')
          script.runat = !!!features['run-at'] ? '-' : features['run-at'].join('<br>')
          script.match=!!!features.match?'-':features['match'].join('<br>')
          script.description = `
<h4>脚本属性</h4>
              文件名：${script.filename}<br>
              作者：${script.author}<br>
              描述：${script.feature}<br>
              版本号：${script.version}<br>
              运行位置：${script.runat}<br>
              包括：${script.include}<br>
              匹配：${script.match}
              `
          scripts.push(script)
        }

      }
    }

    return scripts
  }
}
module.exports = userScriptModel
