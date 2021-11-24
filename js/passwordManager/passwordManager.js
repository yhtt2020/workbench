const { ipcRenderer } = require('electron')

const settings = require('util/settings/settings.js')
const webviews = require('webviews.js')
const keybindings = require('keybindings.js')
const statistics = require('js/statistics.js')

const Bitwarden = require('js/passwordManager/bitwarden.js')
const OnePassword = require('js/passwordManager/onePassword.js')
const Keychain = require('js/passwordManager/keychain.js')

const PasswordManagers = {
  // List of supported password managers. Each password manager is expected to
  // have getSuggestions(domain) method that returns a Promise with credentials
  // suggestions matching given domain name.
  managers: [
    new Bitwarden(),
    new OnePassword(),
    new Keychain()
  ],
  // Returns an active password manager, which is the one that is selected in app's
  // settings.
  getActivePasswordManager: function () {
    if (PasswordManagers.managers.length === 0) {
      return null
    }

    const managerSetting = settings.get('passwordManager')
    if (managerSetting == null) {
      return PasswordManagers.managers.find(mgr => mgr.name === 'Built-in password manager')
    }

    return PasswordManagers.managers.find(mgr => mgr.name === managerSetting.name)
  },
  getConfiguredPasswordManager: async function () {
    const manager = PasswordManagers.getActivePasswordManager()
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
        password = await PasswordManagers.promptForMasterPassword(manager)
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
  // Binds IPC events.
  initialize: function () {
    // Called when page preload script detects a form with username and password.
    webviews.bindIPC('password-autofill', function (tab, args, frameId) {
      // We expect hostname of the source page/frame as a parameter.
      if (args.length === 0) {
        return
      }
      const hostname = args[0]

      PasswordManagers.getConfiguredPasswordManager().then(async (manager) => {
        if (!manager) {
          ipc.send('message',{type:'success',config:{content:"没有可用的密码管理器。"}})
          return
        }

        if (!manager.isUnlocked()) {
          await PasswordManagers.unlock(manager)
        }

        // 去除域名里的www，根域名用同一套帐号
        var domain = hostname
        if (domain.startsWith('www.')) {
          domain = domain.slice(4)
        }

        manager.getSuggestions(domain).then(credentials => {
          console.log(credentials)
          // 增加对找回密码数量的提示，减少认知成本
          if(credentials.length===0){
            ipc.send('message',{type:'error',config:{content:"暂未找到保存密码。"}})
          }else{
            ipc.send('message',{type:'success',config:{content:`找到 ${credentials.length} 个密码，点击输入框选择。`}})
          }

          if (credentials != null) {
            webviews.callAsync(tab, 'getURL', function (err, topLevelURL) {
              if (err) {
                console.warn(err)
                return
              }
              var topLevelDomain = new URL(topLevelURL).hostname
              if (topLevelDomain.startsWith('www.')) {
                topLevelDomain = topLevelDomain.slice(4)
              }
              if (domain !== topLevelDomain) {
                ipc.send('message',{type:'error',config:{content:"自动填充密码不支持第三方框架。"}})
                console.warn("autofill isn't supported for 3rd-party frames")
                return
              }
              webviews.callAsync(tab, 'sendToFrame', [frameId, 'password-autofill-match', {
                credentials,
                hostname
              }])
            })
          }
        }).catch(e => {
          ipc.send('message',{type:'error',config:{content:"获取自动填充密码失败。"}})
          console.error('Failed to get password suggestions: ' + e.message)
        })
      })
    })

    webviews.bindIPC('password-autofill-check', function (tab, args, frameId) {
      if (PasswordManagers.getActivePasswordManager()) {
        webviews.callAsync(tab, 'sendToFrame', [frameId, 'password-autofill-enabled'])
      }
    })

    keybindings.defineShortcut('fillPassword', function () {
      webviews.callAsync(tabs.getSelected(), 'send', ['password-autofill-shortcut'])
    })

    statistics.registerGetter('passwordManager', function () {
      return PasswordManagers.getActivePasswordManager().name
    })
  }
}

module.exports = PasswordManagers
