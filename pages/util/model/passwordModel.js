const settings = require('../../../js/util/settings/settings.js')
const Bitwarden = require('../../../js/passwordManager/bitwarden.js')
const OnePassword = require('../../../js/passwordManager/onePassword.js')
const Keychain = require('../../../js/passwordManager/keychain.js')
const { ipcRenderer } = require('electron')
const tools=require('../util').tools
const PasswordModel = {
  managers: [
    new Bitwarden(),
    new OnePassword(),
    new Keychain()
  ],
  activeManager: {},

  //获取设置 用于使用不同的密码管理器
  getSettings: function () {

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

    let result=await PasswordModel.activeManager.getAllCredentials().catch((err)=>{return []})
    // passwords.forEach((pwd)=>{
    //   console.log(pwd)
    // })
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
