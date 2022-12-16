const logger = require('../../util/logger')
const fs = require('fs')

class StorageFile {
  constructor () {
    this.logger = require('../../util/logger')
  }

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
      console.log(data, ';111')
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
    console.log(data)
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
