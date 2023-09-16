const path = require('path')
const fs = require('fs-extra')
const { app } = require('electron')
const { exec } = require('child_process')
const iconv=require('iconv-lite')
function getResPath () {
  const isDevelopmentMode = process.argv.some(arg => arg === '--development-mode')
  if (isDevelopmentMode) {
    return __dirname + `/../../../res`
  } else {
    return path.dirname(__dirname) + `/../../../res`
  }
}

/**
 * 获取到res目录，并拼接
 * @param paths
 */
function getResPathJoin (...paths) {
  return require('path').join(getResPath(), ...paths)
}

/**
 * 执行一个cmd命令
 * @param cmdStr
 * @param cmdPath
 */
async function runExec (cmdStr, cmdPath) {
  let promise = new Promise((resolve, reject) => {
    // 执行命令行，如果命令不需要路径，或就是项目根目录，则不需要cwd参数：
    let workerProcess = exec(cmdStr, { cwd: cmdPath, encoding: 'buffer' })
    // 不受child_process默认的缓冲区大小的使用方法，没参数也要写上{}：workerProcess = exec(cmdStr, {})

    // 打印正常的后台可执行程序输出
    workerProcess.stdout.on('data', function (data) {
      console.log('stdout: ' + iconv.decode(Buffer.from(data, 'binary'), 'GBK'))
      resolve(iconv.decode(Buffer.from(data, 'binary'), 'GBK'))
    })
//退出之后的输出
    workerProcess.on('close', function (code) {
      resolve(code)
      console.log('out code：' + code)
    })

    // 打印错误的后台可执行程序输出
    workerProcess.stderr.on('data', function (data) {
      console.log('stderr: ' + iconv.decode(Buffer.from(data, 'binary'), 'GBK'))
      reject(iconv.decode(Buffer.from(data, 'binary'), 'GBK'))
    })
  })
  return promise

}

module.exports = class SystemHelper {

  static async extractFileIcon (uri) {
    let savePath = path.join(app.getPath('userData'), 'icons')
    fs.ensureDirSync(savePath)
    let hash = SystemHelper.sha(uri)
    let filePath = path.join(savePath, hash + '.png')
    if(fs.existsSync(filePath)){
      return filePath
    }
    // let icon = fileIcon.getFileIcon(uri,256)  //await require('electron').app.getFileIcon(uri)
    const exePath = getResPathJoin('extracticon.exe')
    const cmd=`${exePath} "${uri}" "${filePath}"`
    await runExec(cmd)
    if (!fs.existsSync(filePath)) {
      let icon = await app.getFileIcon(uri)
      if (!icon) {
        return ''
      }
      fs.writeFileSync(filePath, icon.toPNG())
    }
    return filePath

  }

  static sha (text) {
    const crypto = require('crypto')
    const sha = crypto.createHash('sha1')
    sha.update(text)
    return sha.digest('hex')
  }
}
