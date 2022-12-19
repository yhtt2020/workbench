const logger = require('../../util/logger')
const fs = require('fs')

class StorageFile {
  constructor () {
    this.logger = require('../../util/logger')
  }

  /**
   * 从文件中读取密码库
   * @param path 标准的文件绝对路径
   * @param opts 读取文件的额外参数
   * @param callback 回调(err,data)=>{}
   */
  load (path, opts, callback) {
    this.logger.debug('Load' + path)
    const ts = this.logger.ts()

    const onError = (e) => {
      logger.error('Error reading local file', path, e)
      if (callback) {
        callback(e, null)
      }
    }
    fs.readFile(path, undefined, (err, contents) => {
      if (err) {
        return onError(err)
      }
      const data = typeof contents === 'string' ? contents : new Uint8Array(contents)
      fs.stat(path, (err, stat) => {
        if (err) {
          return onError(err)
        }
        const rev = stat.mtime.getTime().toString()
        this.logger.debug('Loaded', path, rev, this.logger.ts(ts))

        if (callback) {
          callback(null, data.buffer, { rev })
        }
      })
    })
  }

  async save (path, opts, data, callback) {
    const ts = this.logger.ts()
    const onError = (e) => {
      if (Object.prototype.hasOwnProperty.call(e, 'code') && e.code === 'EISDIR') {
        e.isDir = true
      }
      this.logger.error('Error writing local file', path, e)
      if (callback) {
        callback(e)
      }
    }
    fs.writeFile(path, Buffer.from(data), (err) => {
      if (err) {
        return onError(err)
      }
      fs.stat(path, (err, stat) => {
        const newRev = stat.mtime.getTime().toString()
        this.logger.debug('Saved', path, this.logger.ts(ts))
        if (callback) {
          callback(undefined, { rev: newRev })
        }
      })
    })
  }
}

module.exports = StorageFile
