const logger = require('../util/logger')
const StorageFile = require('./kee/storageFile')
const storageFile = new StorageFile()
const FileModel = require('./kee/fileModel')
const { ipcRenderer } = require('electron')
const fileModel = new FileModel()

class KdbxModel {
  db//密码库
  name //密码库名称
  constructor () {
    this.logger = logger
    this.storageFile = new StorageFile()
    this.kdbxwebInit=require('./kee/kdbxwebInit')
    this.kdbxwebInit.init()
  }
  openFile (password, path, keyFileData, callback) {
    storageFile.load(path, undefined, (err, buffer) => {
      fileModel.open(password, buffer, keyFileData, (err,dbInfo)=>{
        if(err){
          callback(err)
          return
        }
        console.log(dbInfo,'dbInfo')
        this.db=dbInfo.db
        this.name=dbInfo.name
        callback(undefined,dbInfo)
      })
    })
  }
  create (name = 'kdb', path, pwd, callback) {
    fileModel.create(name, path, pwd, (buffer) => {
      storageFile.save(path,undefined,buffer,()=>{
        callback()
      })
    })
  }

  /**
   * 获得一个标准的文件形式的密码管理器
   * @param filePath 文件地址
   * @returns {{filePath, name: string}}
   */
  getManager(filePath){
    return {
      name:'file',
      filePath:filePath
    }
  }

  getAllCredentials () {
    console.log(this.db)
    let credentials=[]
    for(const entry of this.db.getDefaultGroup().allEntries()){
      let fields=entry.fields
      let pwd=fields.get('Password')
      console.log(pwd,'pwd')
      credentials.push({
        domain:fields.get('URL'),
        username:fields.get('UserName'),
        password:pwd?pwd.getText():{},
        title:fields.get('Title'),
        id:entry.uuid
      })
    }
    console.log(credentials,'creds')
    return credentials
  }

}

module.exports = KdbxModel
