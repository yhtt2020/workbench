const path = require('path')
const fs = require('fs-extra')
const { app } = require('electron')
const { exec } = require('child_process')
const iconv = require('iconv-lite')

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
  /**
   * 获取桌面上的图标
   * @returns {Promise<*[]>}
   */
  static async getDeskFiles(withIcon=true){

    let apps=[]
    let path = require('path')
    async function getDesktopFiles (_dir) {
      const fs = require('fs')
      var filepaths = []
      //read directory
      let files = fs.readdirSync(_dir)
      for (const _file of files) {
        let _p = _dir + '/' + _file
        //changes slashing for file paths
        let _path = _p.replace(/\\\\/g, '/')
        let name = path.parse(_path).name
        let icon = ''
        try {
          if (_path.endsWith('.lnk')) {
            let urlFile = require('electron').shell.readShortcutLink(_path)
            _path = urlFile.target
          } else if (_path.endsWith('.url')) {
            icon = await SystemHelper.readUrlIconInfo(_path)
          }
        } catch (e) {
          console.warn('存在失败的', e, _file)
          _path = '/icons/winapp.png'
        }

        filepaths.push({
          name: name,
          path: _path,
          ext: path.parse(_path).ext,
          icon: icon
        })

        //console.log(_file);

      }
      return filepaths

    }

    let filepaths =await getDesktopFiles(app.getPath('desktop'))

    for (let file of filepaths) {
      try {
        let icon=''
        if(withIcon){
          if(!file.icon){
            icon = await SystemHelper.extractFileIcon(file.path)
          }else{
            icon=file.icon
          }

          apps.push({
            name: file.name,
            ext: file.ext,
            path: file.path,
            icon:  icon
          })
        }else{
          apps.push({
            name: file.name,
            ext: file.ext,
            path: file.path,
            icon: ''
          })
        }
      } catch (e) {
        console.warn('存在导入失败的', e, file)
      }

    }
    return apps
  }

  /**
   * 读取Url文件的图标信息
   * @param filePath
   * @returns {Promise<string>}
   */
  static async readUrlIconInfo(filePath){
    const fs = require('fs');

    const fileContent = fs.readFileSync(filePath, 'utf-8');

    const urlPattern = /(IconFile=)(.*)/;
    const urlMatch = fileContent.match(urlPattern);

    if (urlMatch && urlMatch.length >= 3) {
      const url = urlMatch[2];
      return url
    } else {
      return ''
    }
  }
  static async extractFileIcon (uri) {
    if(uri.endsWith('.url')){
     return await this.readUrlIconInfo(uri)
    }
    let savePath = path.join(app.getPath('userData'), 'icons')
    fs.ensureDirSync(savePath)
    let hash = SystemHelper.sha(uri)
    let filePath = path.join(savePath, hash + '.png')
    if (fs.existsSync(filePath)) {
       return filePath
    }
    let error = false
    if(process.platform==='win32'){
      try {
        // let icon = fileIcon.getFileIcon(uri,256)  //await require('electron').app.getFileIcon(uri)
        const exePath = getResPathJoin('extracticon.exe')
        const cmd = `"${exePath}" "${uri}" "${filePath}"`
        console.log(cmd, '输出的cmd')
        await runExec(cmd)
      } catch (e) {
        console.error('意外报错', e)
        error = true
      }
    }

    if (!fs.existsSync(filePath) || error) {
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
