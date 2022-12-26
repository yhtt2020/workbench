const { ipcRenderer } = require('electron')

class Kdbx {
  name
  dbName
  filePath
  constructor () {
    this.name = 'file'
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
    return ipcRenderer.invoke('kdbxCredentialStoreGetCredentials').then(function (results) {
      return results
        .filter(function (result) {
          return result.domain === domain
        })
        .map(function (result) {
          return {
            ...result,
            manager: 'file'
          }
        })
    })
  }

  saveCredential (domain, username, password, name = '') {
    ipcRenderer.invoke('kdbxCredentialStoreSetPassword', { domain, username, password, name })
  }

  deleteCredential (domain, username) {
    ipcRenderer.invoke('kdbxCredentialStoreDeletePassword', { domain, username })
  }

  getAllCredentials () {
    return ipcRenderer.invoke('kdbxCredentialStoreGetCredentials').then(function (results) {
      return results.map(function (result) {
        return {
          ...result,
          manager: 'file'
        }
      })
    })
  }
}

module.exports=Kdbx
