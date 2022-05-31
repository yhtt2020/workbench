import { Stats, exists, lstat, mkdirSync, readFile, readdir, unlink, writeFile } from "fs";


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
  }

};

module.exports = fileHelpers
