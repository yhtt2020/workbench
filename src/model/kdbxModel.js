const logger = require('../util/logger')
const StorageFile = require('./kee/storageFile')
const storageFile = new StorageFile()
const FileModel = require('./kee/fileModel')
const fileModel = new FileModel()

class KdbxModel {

  constructor () {
    this.logger = logger
    this.storageFile = new StorageFile()
    this.kdbxwebInit=require('./kee/kdbxwebInit')
    this.kdbxwebInit.init()
  }
  openFile (password, path, keyFileData, callback) {
    storageFile.load(path, undefined, (err, buffer) => {
      fileModel.open(password, buffer, undefined, callback)
    })
  }
  create (name = 'kdb', path, pwd, callback) {
    fileModel.create(name, path, pwd, (err,buffer) => {
      console.log('chuangjian')
      storageFile.saveToFile(path,buffer,callback)
    })
  }
}

module.exports = KdbxModel
