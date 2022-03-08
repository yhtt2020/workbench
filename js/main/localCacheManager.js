const axios = require("axios");
const fs=require('fs')
const config = {
  expireTime: 24 * 60 * 60, //默认缓存有效期为24小时
  cacheExts: [
    'js',
    'jpg', 'jpeg', 'svg', 'png'
  ]
}
let el={
   error(error){
    console.log(error)
}
}
if(typeof electronLog!=='undefined'){
  el=electronLog
}
let userDataPath=''
if(typeof window !=='undefined'){
  //如果是主进程下，有app对象\
  userDataPath=window.globalArgs['user-data-path']
}else{
  userDataPath=require('electron').app.getPath('userData')
}
const  cachePath=userDataPath + '/localCache'
let localCacheManager = {
  cachePath:cachePath,
  tmpPath: cachePath+'/tmp',
  urlToFilePath(url) {
    try {
      let ext = localCacheManager.getUrlExt(url)
      let downloadDir = localCacheManager.cachePath + '/' + ext
      localCacheManager.prepareDir(downloadDir)
      let fileName = localCacheManager.getHash(url) + '.' + ext
      let filePath = downloadDir + '/' + fileName
      return filePath
    } catch (e) {
      el.error(e)
    }

  },
  /**
   * 获取一个url的后缀名
   * @param url
   * @returns {*}
   */
  getUrlExt(url) {
    let urlSpliced = url.split('.')
    console.log(urlSpliced,url)
    return urlSpliced[urlSpliced.length-1]
  },
  /**
   * 无缓存下载文件，即时更新文件到本地
   */
  async getWithoutCache(url){
    try{
      let ext = localCacheManager.getUrlExt(url)
      console.log(ext)
      if (config.cacheExts.indexOf(ext) === -1)
        return
      let downloadDir = localCacheManager.cachePath + '/' + ext
      localCacheManager.prepareDir(downloadDir)
      let fileName = localCacheManager.getHash(url) + '.' + ext
      let filePath = downloadDir + '/' + fileName
      await localCacheManager.fetchUrl(url, filePath)
      if (fs.existsSync(filePath)) {
        return filePath
      } else {
        return false
      }
    }catch (e) {
      el.error(e)
    }
  },
  /**
   * 获取一个url地址上的文件，使用缓存方式，会判断文件是否存在，如果存在，则下载到缓存文件夹，并返回本地地址
   * 默认要求是必须在cacheExts配置中的，否则不做缓存，防止因为部分格式为被识别导致意外错误，如需缓存不存在的ext，请在cacheExt中添加特殊的类型
   * @param url 文件的url地址
   * @param expireTime 过期实际，默认为config设置的时间
   */
  async get(url, expireTime = config.expireTime) {
    try {
      let ext = localCacheManager.getUrlExt(url)
      if (config.cacheExts.indexOf(ext) === -1)
        return
      let downloadDir = localCacheManager.cachePath + '/' + ext
      localCacheManager.prepareDir(downloadDir)
      let fileName = localCacheManager.getHash(url) + '.' + ext
      let filePath = downloadDir + '/' + fileName
      let stat = fs.statSync(filePath)
      const cTime = stat.ctime
      if (new Date().getTime() - cTime.getTime() > expireTime / 1000) {
        //缓存已失效
        await localCacheManager.fetchUrl(url, filePath)
        if (fs.existsSync(filePath)) {
          return filePath
        } else {
          return false
        }
      } else {
        return filePath
      }
    } catch (e) {
      el.error(e)
    }
  },
  /**
   * 如果不存在目录，则自动创建
   * @param dir
   */
  prepareDir(dir = localCacheManager.tmpPath) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir+'/',{
        recursive:true
      })
    }
  },
  getFileMd5(path) {

  },
  /**
   * 获取一个文本的hash
   * @param text
   * @returns {string}
   */
  getHash(text) {
    const crypto = require('crypto')
    const shasum = crypto.createHash('sha1')
    shasum.update(text);
    return shasum.digest('hex')
  },
  /**
   * 从网络的地址下载一个文件保存到本地
   * @param url
   * @param path
   * @returns {Promise<void>}
   */
  async fetchUrl(url, path = localCacheManager.tmpPath) {
    //直接下载到本地，不考虑缓存

    let {data} = await axios({
      url: url,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      responseType: 'arraybuffer',
    })
    await fs.promises.writeFile(path, data, 'binary')
  },
  async downloadFile(url, path) {

  },
  /**
   * 清理某个url的缓存文件
   * @param url
   * @returns {boolean}
   */
  clearCache(url) {
    let filePath = localCacheManager.urlToFilePath(url)
    if (fs.existsSync(filePath)) {
      fs.rmSync(filePath)
      if (!fs.existsSync(filePath)) {
        return true
      }
    }
    return false
  }
}
  module.exports = localCacheManager
