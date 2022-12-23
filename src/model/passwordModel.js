window.ipc=require('electron').ipcRenderer
const settings = require('../../js/util/settings/settings.js')
// const Bitwarden = require('../../js/passwordManager/bitwarden.js')
// const OnePassword = require('../../js/passwordManager/onePassword.js')
const Keychain = require('../../js/passwordManager/keychain.js')
const { ipcRenderer } = require('electron')
const tools=require('../util/util').tools
const KdbxModel=require('./kdbxModel.js')
const bitwarden={}// new Bitwarden()
const onePassword={}//new OnePassword()
const keychain=new Keychain()
const kdbxModel=new KdbxModel()
const PasswordModel = {
  managers: [
    bitwarden,
    onePassword,
    keychain,
    kdbxModel
  ],
  activeManager: {},
  managerMap:{
    bitwarden,onePassword,keychain,kdbxModel
  },
  kdbxModel:kdbxModel,

  openFile (password, path, keyFileData, callback) {
    PasswordModel.kdbxModel.openFile(password, path, keyFileData, (err,data)=>{
      if(err){
        console.warn('打开失败',err)
        callback(err,data)
      }
      ipc.invoke('setKdbxCredential',{
        filePath:path,
        name:data.name,
        password:password,
        keyFile:keyFileData
      })
      callback(undefined,data)
    })
  },
  create (name = 'kdb', path, pwd, callback){
    PasswordModel.kdbxModel.create(name,path,pwd,callback)
  },

  save(cb){
    PasswordModel.kdbxModel.save((err,data)=>{
      if(err){
        throw err
      }else{
        cb(true)
      }
    })
  },
  loadCurrent(callback){
    const pm=settings.get('passwordManager')
    if(pm.name==='file')
    {
      if(!pm.filePath){
        return false
      }
      //todo 获取安全存储内的主密码
      const password= '123'
      passwordModel.openFile(password,pm.filePath,undefined,callback)//todo 加入key
    }
  },

  /**
   * 设置密码管理器，{name:''} name值候选 `Built-in password manager` 'file' 'Bitwarden' '1Password'
   * @param manager
   */
  setPasswordManager(manager){
    settings.set('passwordManager', {
      name:manager.name,
      filePath:manager.filePath
    })
    if(manager.name==='file'){
      PasswordModel.activeManager=PasswordModel.managerMap.kdbxModel
    }
  },

  /**批量导入密码到密码库内
   *
   * @param passwords
   */

  importPasswords(passwords,groupName,existAction){
    // if(PasswordModel.activeManager!==PasswordModel.managerMap.kdbxModel)//不支持文件密码库以外的导入，均返回失败
    //   console.log('当前密码非文件管理器（未打开）',1)
    //   return false

    //todo jude密码库一打开
    return  passwordModel.kdbxModel.importPasswords(passwords,groupName,existAction)

  },

  getAllPasswords(){
   return PasswordModel.activeManager.getAllCredentials()
  },

  getActivePasswordManager: function () {
    if (PasswordModel.managers.length === 0) {
      return null
    }

    const managerSetting = settings.get('passwordManager')
    if (managerSetting == null) {
      return PasswordModel.managers.find(mgr => mgr.name === 'Built-in password manager')
    }


    return PasswordModel.managers.find(mgr => mgr.name === managerSetting.name)
  },
  getConfiguredPasswordManager: async function () {
    const manager = PasswordModel.getActivePasswordManager()
    if (!manager) {
      return null
    }
    const configured = await manager.checkIfConfigured()
    if (!configured) {
      return null
    }
    return manager
  },
  // Shows a prompt dialog for password store's master password.
  promptForMasterPassword: async function (manager) {
    return new Promise((resolve, reject) => {
      const { password } = ipcRenderer.sendSync('prompt', {
        text: l('passwordManagerUnlock').replace('%p', manager.name),
        values: [{ placeholder: l('password'), id: 'password', type: 'password' }],
        ok: l('dialogConfirmButton'),
        cancel: l('dialogSkipButton'),
        height: 160
      })
      if (password === null || password === '') {
        reject(new Error('No password provided'))
      } else {
        resolve(password)
      }
    })
  },
  unlock: async function (manager) {
    let success = false
    while (!success) {
      let password
      try {
        password = await PasswordModel.promptForMasterPassword(manager)
      } catch (e) {
        // dialog was canceled
        break
      }
      try {
        success = await manager.unlockStore(password)
      } catch (e) {
        // incorrect password, prompt again
      }
    }
    return success
  },
  initialize: async function () {
    //获取到真实在用的密码管理器
    PasswordModel.activeManager = await PasswordModel.getConfiguredPasswordManager()
  },
  async getAllPwds(){
    await PasswordModel.initialize()
    const domain=tools.getDomainFromUrl(siteUrl)
    const rootDomain=tools.getRootDomain(siteUrl)
    let pwds= {
      item:[],
      rootItem:[]
    }
    return pwds
  },
  getSiteCredit :async function(siteUrl,includeRoot=false) {
    await PasswordModel.initialize()
    const domain=tools.getDomainFromUrl(siteUrl)
    const rootDomain=tools.getRootDomain(siteUrl)
    let pwds= {
      item:[],
      rootItem:[]
    }

    let result
    try {
      result = await PasswordModel.activeManager.getAllCredentials()
    } catch (err) {
      result = []
    }

    if(!!!result){
      return []
    }
    result.forEach((pwd)=>{
      if(pwd.domain===domain){
        pwds.item.push(pwd)
      }
      if(includeRoot){
        if(pwd.domain){
          if(pwd.domain.indexOf(rootDomain)>-1){
            pwds.rootItem.push(pwd)
          }
        }

      }
    })
    return pwds
  },

}
module.exports = PasswordModel
