const { ipcRenderer } = require('electron')

class Keychain {
  constructor () {
    this.name = 'Built-in password manager'
    this.keychainServiceName = 'com.thisky.browser'
  }

  getDownloadLink () {
    return null
  }

  getLocalPath () {
    return null
  }

  getSetupMode () {
    return null
  }

  async checkIfConfigured () {
    return true
  }

  isUnlocked () {
    return true
  }

  async getSuggestions (domain) {
    return ipcRenderer.invoke('credentialStoreGetCredentials').then(function (results) {
      return results
        .filter(function (result) {
          return result.domain === domain
        })
        .map(function (result) {
          return {
            ...result,
            manager: 'Keychain'
          }
        })
    })
  }

  saveCredential (domain, username, password, name = '',uuid) {
    ipcRenderer.invoke('credentialStoreSetPassword', { domain, username, password, name , uuid })
  }

  //创建密码
  createCredential(domain,username,password,name){
    ipcRenderer.invoke('credentialStoreCreatePassword', { domain, username, password, name  })
  }

  deleteCredential (domain, username,uuid) {
    ipcRenderer.invoke('credentialStoreDeletePassword', { domain, username,uuid })
  }

  getAllCredentials () {
    return ipcRenderer.invoke('credentialStoreGetCredentials').then(function (results) {
      return results.map(function (result) {
        return {
          ...result,
          manager: 'Keychain'
        }
      })
    })
  }
}

module.exports = Keychain
