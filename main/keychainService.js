/*
Wrapper for node-keytar
Runs in the main process because of https://github.com/atom/node-keytar/issues/250
*/

const keytar = require('keytar')
const safeStorage = require('electron').safeStorage
const passwordFilePath = path.join(userDataPath, 'passwordStore')

/*
file format:
{
  version: 1,
  credentials: [
    {
      domain:,
      username:,
      password:
    }
  ]
}
*/

function readSavedPasswordFile () {
  let file
  try {
    file = fs.readFileSync(passwordFilePath)
  } catch (e) {
    if (e.code !== 'ENOENT') {
      console.warn(e)
      throw new Error(e)
    }
  }
  if (file) {
    return JSON.parse(safeStorage.decryptString(file))
  } else {
    return {
      version: 1,
      credentials: []
    }
  }
}

function writeSavedPasswordFile (content) {
  fs.writeFileSync(passwordFilePath, safeStorage.encryptString(JSON.stringify(content)))
}

function credentialStoreSetPassword (account) {
  const fileContent = readSavedPasswordFile()

  // delete duplicate credentials
  for (let i = 0; i < fileContent.credentials.length; i++) {
    if (fileContent.credentials[i].domain === account.domain && fileContent.credentials[i].username === account.username) {
      fileContent.credentials.splice(i, 1)
      i--
    }
  }

  fileContent.credentials.push(account)
  writeSavedPasswordFile(fileContent)
}

ipc.handle('credentialStoreSetPassword', async function (event, account) {
  return credentialStoreSetPassword(account)
})

ipc.handle('keychainSetPassword', function (event, service, account, password) {
  return keytar.setPassword(service, account, password)
})

ipc.handle('keychainDeletePassword', function (event, service, account) {
  return keytar.deletePassword(service, account)
})

ipc.handle('keychainFindCredentials', function (event, service) {
  return keytar.findCredentials(service)
})

ipc.handle('keychainFindPassword', function (event, service) {
  return keytar.setPassword(service)
})
