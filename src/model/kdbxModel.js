const logger = require('../util/logger')
const StorageFile = require('./kee/storageFile')
const storageFile = new StorageFile()
const FileModel = require('./kee/fileModel')
const { ipcRenderer } = require('electron')
const fileModel = new FileModel()
const  kdbxweb = require('kdbxweb')

class KdbxModel {
  db//密码库
  path
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
        this.path=path
        callback(undefined,dbInfo)
      })
    })
  }
  async save (callback) {
    const data=await this.db.save()
    storageFile.save(this.path, undefined, data, () => {
      if(callback) callback()
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

  /**
   *
   * @param passwords
   * @param groupName
   * @param existAction jump push
   */
  importPasswords(passwords,groupName,existAction='jump'){
    const db=this.db
    let result={
      handleCount:0,//处理数量
      jumpCount:0,//跳过数量
      createCount:0,//创建数量
      pushCount:0//推版本数量
    }
    let importGroup
    console.log('开始导入',1)
    if(groupName){
      console.log('准备查找同名组',2)
      //如果存在同名组，则使用该组
      for (const g of db.getDefaultGroup().allGroups()) {
        if(g.name===groupName){
          importGroup=g
        }
      }
      if(!importGroup)//如果不存在，则自动创建
      {
        console.log('同名组不存在，自动创建组',3)
        importGroup = db.createGroup(db.getDefaultGroup(), groupName)
      }else{
        console.log('已经存在同名组，使用同名组',4)
      }
    }else{
      console.log('创建到根组下',5)
      importGroup=db.getDefaultGroup()
    }


    let groupEntries=importGroup.allEntries()
    console.log('获取全部的密码=',groupEntries,6)
    passwords.forEach(password=>{
      let importEntry
      //判断是否已经存在密码了
      console.log('开始查找组内同密码',7)
      let existsEntry=false
      for (const entry of groupEntries) {
        let fields=entry.fields
        let pwd=fields.get('Password')
        let domain=fields.get('URL')
        let passwordEntry=pwd?pwd.getText():{}
        if (domain===password.domain && passwordEntry===password.password){
          existsEntry=entry
        } //找到一个同域名，同用户名的密码
      }
      if(existsEntry){
        console.log('存在同密码',8)
        if(existAction==='jump'){
          console.log('存在同密码，用户选择跳过',9)
          //如果是跳过，跳过++
          result.handleCount++
          result.jumpCount++
          return
        }
        console.log('存在相同密码，更新版本',10)
        importEntry=existsEntry
        result.pushCount++
      }else{
        console.log('不存在同密码，创建',11)
        importEntry=db.createEntry(importGroup)
        result.createCount++
      }
      importEntry.pushHistory()
      importEntry.fields.set('URL',password.domain)
      importEntry.fields.set('UserName',password.username)
      importEntry.fields.set('Title',password.title)
      importEntry.fields.set('Password',kdbxweb.ProtectedValue.fromString(password.password))
      importEntry.times.update()
      console.log('更新密码版本成功=',importEntry,12)
      result.handleCount++
    })
    console.log('导入完成',13)
    console.log('改完后的db.en')
    for(const ent of db.getDefaultGroup().allEntries()){
      console.log(ent)
    }
    this.save()
    return result
  }
}

module.exports = KdbxModel
