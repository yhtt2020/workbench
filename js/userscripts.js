/* implements userscript support */

var webviews = require('webviews.js')
var settings = require('util/settings/settings.js')
var bangsPlugin = require('searchbar/bangsPlugin.js')
var tabEditor = require('navbar/tabEditor.js')
var searchbarPlugins = require('searchbar/searchbarPlugins.js')
var urlParser = require('util/urlParser.js')

var statistics = require('js/statistics.js')
const path = require('path')
const crypto = require('crypto')

//匹配到的网站的脚本数存储


function parseTampermonkeyFeatures (content) {
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
}

// checks if a URL matches a wildcard pattern
function urlMatchesPattern (url, pattern) {
  var idx = -1
  var parts = pattern.split('*')
  for (var i = 0; i < parts.length; i++) {
    idx = url.indexOf(parts[i], idx)
    if (idx === -1) {
      return false
    }
    idx += parts[i].length
  }
  return idx !== -1
}

const userscripts = {
  scripts: [], // {options: {}, content}
  loadScripts: function () {
    userscripts.scripts = []

    var path = require('path')
    var scriptDir = path.join(window.globalArgs['user-data-path'], 'userscripts')

    fs.readdir(scriptDir, function (err, files) {
      if (err || files.length === 0) {
        return
      }

      // store the scripts in memory
      files.forEach(function (filename) {
        if (filename.endsWith('.js')) {
          fs.readFile(path.join(scriptDir, filename), 'utf-8', function (err, file) {
            if (err || !file) {
              return
            }

            var domain = filename.slice(0, -3)
            if (domain.startsWith('www.')) {
              domain = domain.slice(4)
            }
            if (!domain) {
              return
            }

            var tampermonkeyFeatures = parseTampermonkeyFeatures(file)
            if (tampermonkeyFeatures) {
              var scriptName = tampermonkeyFeatures['name:local'] || tampermonkeyFeatures.name
              if (scriptName) {
                scriptName = scriptName[0]
              } else {
                scriptName = filename
              }
              userscripts.scripts.push({ options: tampermonkeyFeatures, content: file, name: scriptName })
            } else {
              // legacy script
              if (domain === 'global') {
                userscripts.scripts.push({
                  options: {
                    match: ['*']
                  },
                  content: file,
                  name: filename
                })
              } else {
                userscripts.scripts.push({
                  options: {
                    match: ['*://' + domain]
                  },
                  content: file,
                  name: filename
                })
              }
            }
          })
        }
      })
    })
  },
  getMatchingScripts: function (src) {
    return userscripts.scripts.filter(function (script) {
      if (
        (!script.options.match && !script.options.include) ||
        (script.options.match && script.options.match.some(pattern => urlMatchesPattern(src, pattern))) ||
        (script.options.include && script.options.include.some(pattern => urlMatchesPattern(src, pattern)))) {
        if (!script.options.exclude || !script.options.exclude.some(pattern => urlMatchesPattern(src, pattern))) {
          return true
        }
      }
    })
  },
  runScript: async function (tabId, script) {
    const crypto = require('crypto')
    function hash(str){
      const shasum = crypto.createHash('sha1')
      shasum.update(str);
      return shasum.digest('hex')
    }
    //新增 判断js缓存目录是否存在，不存在则自动创建缓存目录
    var scriptDir = path.join(window.globalArgs['user-data-path'], 'userscripts')
    const cachePath = scriptDir + '/cache/'
    if (!fs.existsSync(cachePath)) {
      fs.mkdirSync(cachePath)
    }
    const hex=hash(script.name)
    const jsCachePath = scriptDir + '/cache/' + hex

    if (!fs.existsSync(jsCachePath)) {
      fs.mkdirSync(jsCachePath)
    }

    if (urlParser.isInternalURL(tabs.get(tabId).url)) {
      return
    }
    //todo 兼容每个脚本的require导入外部js

    let excuted=[]

    if (!!script.options.require) {
      //如果存在require 则同步下载所有js，下载完成后再执行主体js

      for (const js of script.options.require) {
        console.log('用户脚本要求require外部js：'+js)
        const jsHex =hash(js)
        const jsCache = jsCachePath + '/' + jsHex + '.js'
        if (!fs.existsSync(jsCache)) {
          //使用axios下载js到本地
          const axios = require('axios')
          let { data } = await axios({
            url: js,
            headers: {
              'Content-Type': 'multipart/form-data',
            },
            responseType: 'arraybuffer',
          })
          //const data=downloadResult.data
          await fs.promises.writeFile(jsCache, data, 'binary')
          webviews.callAsync(tabId, 'executeJavaScript', [fs.readFileSync(jsCache,{encoding:'utf8'})])
          console.log('外部require缓存未命中，根据自定义脚本的规则下载并require外部js：' +js)
          excuted.push(jsCache)
        } else {
          webviews.callAsync(tabId, 'executeJavaScript',[fs.readFileSync(jsCache,{encoding:'utf8'})])
          excuted.push(jsCache)
          console.log('外部require缓存命中，require已缓存的外部js：' +js)
        }
        if(excuted.length===script.options.require.length){
          console.log('excuted all then excute mainjs')
          webviews.callAsync(tabId, 'executeJavaScript', [script.content, false, null])
        }
      }
    }else{
      console.log('no require ')
      webviews.callAsync(tabId, 'executeJavaScript', [script.content, false, null])
    }

  },
  prepareGMEnv(tabId,script){
    //1.注册函数 //todo 兼容油猴常用函数
    //兼容GM_addStyle
    console.log(script)
    if(!!script.options){
      if(!!script.options.grant){
        script.options.grant.forEach((grant)=>{
          if($matchedScriptsForSiteGM[tabId]['grant'].includes(grant)){
            console.log(grant+'已被其他脚本注册，无需重复注册')
          }
          //todo 实现油猴函数的代理
          switch(grant){
            case 'GM_addStyle':
              const jsGM_addStyle=`
function GM_addStyle(str){
var style=str;
var ele=document.createElement("style");
ele.innerHTML=style;
document.getElementsByTagName('head')[0].appendChild(ele)
console.log(ele)
return ele
}
              `
              webviews.callAsync(tabId, 'executeJavaScript', [jsGM_addStyle])
              $matchedScriptsForSiteGM[tabId]['grant'].push(grant)
              console.log('注册'+grant+'函数成功')
              break
            case 'GM_setValue':
              const jsGM_setValue=`
         function GM_setValue(name, value){
         localStorage.setItem(name,value)
          }
              `
              window.$matchedScriptsForSiteGM.values={}
              webviews.callAsync(tabId, 'executeJavaScript', [jsGM_setValue])
              $matchedScriptsForSiteGM[tabId]['grant'].push(grant)
              console.log('注册'+grant+'函数成功')
              //todo GM_setValue
              break
            case 'GM_getValue':
              const jsGM_getValue=`
             function GM_getValue(name, defaultValue){
              const value= localStorage.getItem(name)
               if(!!!value)
                 return defaultValue
                 }
              `
              window.$matchedScriptsForSiteGM.values={}
              webviews.callAsync(tabId, 'executeJavaScript', [jsGM_getValue])
              console.log('注册'+grant+'函数成功')
              //todo GM_getValue
              break
            default:
              console.log(grant+'函数暂不支持，请等待系统更新后支持')
          }
          $matchedScriptsForSiteGM[tabId]['grant'].push(grant)
        })
      }
    }
  },
  onPageLoad: function (tabId) {
    if (userscripts.scripts.length === 0) {
      return
    }

    var src = tabs.get(tabId).url
    const matchedScripts=userscripts.getMatchingScripts(src)
    //往窗体的变量中添加匹配数
    $matchedScriptsForSite[tabId]=matchedScripts
    $toolbar.updateScriptsCountTip(tabId)

    matchedScripts.forEach(function (script) {
      //todo 准备油猴环境
      if(!!!$matchedScriptsForSiteGM[tabId]){
        $matchedScriptsForSiteGM[tabId]={
          grant:[]
        }
      }
      userscripts.prepareGMEnv(tabId,script)
      // TODO run different types of scripts at the correct time
      if (!script.options['run-at'] || script.options['run-at'].some(i => ['document-start', 'document-body', 'document-end', 'document-idle'].includes(i))) {
        userscripts.runScript(tabId, script)
      }
    })
  },
  initialize: function () {
    statistics.registerGetter('userscriptCount', function () {
      return userscripts.scripts.length
    })

    settings.listen('userscriptsEnabled', function (value) {
      window.$matchedScriptsForSite= {}
      window.$matchedScriptsForSiteGM={}
      if (value === true) {
        userscripts.loadScripts()
      } else {
        userscripts.scripts = []
      }
    })
    webviews.bindEvent('dom-ready', userscripts.onPageLoad)

    bangsPlugin.registerCustomBang({
      phrase: '!run',
      snippet: l('runUserscript'),
      isAction: false,
      showSuggestions: function (text, input, event) {
        searchbarPlugins.reset('bangs')

        var isFirst = true
        userscripts.scripts.forEach(function (script) {
          if (script.name.toLowerCase().startsWith(text.toLowerCase())) {
            searchbarPlugins.addResult('bangs', {
              title: script.name,
              fakeFocus: isFirst && text,
              click: function () {
                tabEditor.hide()
                //todo bang这边是否需要执行
                userscripts.runScript(tabs.getSelected(), script)
              }
            })
            isFirst = false
          }
        })
      },
      fn: function (text) {
        if (!text) {
          return
        }
        var matchingScript = userscripts.scripts.find(script => script.name.toLowerCase().startsWith(text.toLowerCase()))
        if (matchingScript) {
          userscripts.runScript(tabs.getSelected(), matchingScript)
        }
      }
    })
  }
}

module.exports = userscripts
