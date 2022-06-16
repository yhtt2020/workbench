const { exists, mkdirSync, readFile, unlink, writeFile } = require("fs");
const ipc = require('electron').ipcRenderer
let favStorePath = ''
ipc.on('getUserDataPath', (event, args) => {
  favStorePath = args
  console.log(favStorePath, '哈哈啊哈哈啊哈哈')
  ipc.send('canCloseInterval')
})

const fileHelpers = {
  //异步封装   判断文件是否存在函数
  asyncFileExists(filePath) {
    return new Promise((resolve) => {
      exists(filePath, (fileExists) => {
        resolve({ fileExists, filePath });
      });
    });
  },

  //异步封装 写入'utf8' string文件
  asyncWriteFile(filePath, fileContent) {
    return new Promise((resolve, reject) => {
      writeFile(filePath, fileContent, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  },

  //异步封装 删除文件
  asyncDeleteFile(filePath) {
    return new Promise((resolve, reject) => {
      unlink(filePath, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  },

  //同步 创建文件夹
  syncCreateFolder(filePath) {
    mkdirSync(filePath);
  },

  //异步封装 读string返回的文件    非buffer类型
  asyncReadFile(filePath) {
    return new Promise((resolve, reject) => {
      this.asyncFileExists(filePath).then(res => {
        if(res) {
          readFile(filePath, (err, data) => {
            if(err) {
              reject(err)
            } else {
              resolve(data.toString('utf8'))
            }
          })
        } else {
          reject(`File "${filePath} does not exist"`)
        }
      }).catch(error => reject(error))
    })
  },

  //---------------------------------收藏夹书签的耦合api>
  //创建一个url后缀类型的文件
  addUrlFile(title, url, folderPath) {
    const ext = '.url'
    let urlTpl = `
      [DEFAULT]
      [InternetShortcut]
      URL=${url}
    `
    fs.writeFileSync((favStorePath + folderPath + '/' + title + ext).replaceAll('//', '/'), urlTpl, 'utf-8')
  },

  //创建书签文件夹
  addBookmarkFolder(folderPath) {
    if(!fs.existsSync((favStorePath + folderPath).replaceAll('//', '/'))) {
      mkdirSync((favStorePath + folderPath).replaceAll('//', '/'))
    }
  },

  //创建书签根目录和改变favStorePath
  addRootFolder(fileName) {
    if(!fs.existsSync((favStorePath + '/' + fileName).replaceAll('//', '/'))) {
      mkdirSync((favStorePath + '/' + fileName).replaceAll('//', '/'))
      favStorePath = `${favStorePath}/${fileName}`
    }
  },

  //递归处理原始书签(edge、chrome)
  recurBookmark(bookmarkObj, prevFolderName = null) {
    let currentFloderName
    if(bookmarkObj.type === 'url') {
      currentFloderName = prevFolderName ?? '/'
      fileHelpers.addUrlFile(bookmarkObj.name.replaceAll('/', '!'), bookmarkObj.url, currentFloderName)
    } else {
      currentFloderName = prevFolderName ? `${prevFolderName}/${bookmarkObj.name}` : `/${bookmarkObj.name}`
      fileHelpers.addBookmarkFolder(currentFloderName)
      bookmarkObj.children.forEach(v => {
        fileHelpers.recurBookmark(v, currentFloderName)
      })
    }
  }

};

module.exports = fileHelpers
