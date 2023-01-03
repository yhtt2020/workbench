/* Uses Electron's safeStorage to encrypt a password file - encryption key gets stored in the system keychain */

const keytar = require('keytar')
const safeStorage = require('electron').safeStorage
const passwordFilePath = path.join(userDataPath, 'passwordStore')
const { nanoid }=require('nanoid')
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
    let fileDb=JSON.parse(safeStorage.decryptString(file))
    fileDb.credentials.forEach(pwd=>{
      if(!pwd.uuid){
        pwd.uuid=nanoid(8)
      }
    })
    console.log(fileDb)
    writeSavedPasswordFile(fileDb)
    return fileDb
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
  let found=false
  // delete duplicate credentials
  for (let i = 0; i < fileContent.credentials.length; i++) {
    found=false
    if(account.uuid && fileContent.credentials[i].uuid===account.uuid){
      found=true
    }

    if (fileContent.credentials[i].domain === account.domain && fileContent.credentials[i].username === account.username) {
     found=true
    }
    if(found){
      found=fileContent.credentials[i]//找到密码
      fileContent.credentials.splice(i, 1)
      i--
    }

  }
  if(!found){
    //是创建的场景，则自动附上uuid
    account.uuid= nanoid(8)
  }

  if (account.newUsername) {
    // 如果存在新账号名，因为是以账号名和域名双条件判断的，所以这里必须用一个新字段去替换，否则会无法查到
    account.username = account.newUsername
    delete account.newUsername
  }

  fileContent.credentials.push(account)
  writeSavedPasswordFile(fileContent)
}

ipc.handle('credentialStoreSetPassword', async function (event, account) {
  return credentialStoreSetPassword(account)
})

ipc.handle('credentialStoreDeletePassword', async function (event, account,uuid) {
  const fileContent = readSavedPasswordFile()

  // delete matching credentials
  for (let i = 0; i < fileContent.credentials.length; i++) {
    let found=false
    if(uuid && fileContent.credentials[i].uuid===uuid){
      //通过uuid匹配
      found=true
    }
    if (fileContent.credentials[i].domain === account.domain && fileContent.credentials[i].username === account.username) {
      found=true
    }
    if(found){
      fileContent.credentials.splice(i, 1)
      i--
    }
  }

  return writeSavedPasswordFile(fileContent)
})

ipc.handle('credentialStoreGetCredentials', async function () {
  return readSavedPasswordFile().credentials
})

/* On startup, migrate everything from keychain */

setTimeout(function () {
  if (!settings.get('v1_23_keychainMigrationComplete')) {
    keytar.findCredentials('com.thisky.browser').then(function (results) {
      results.forEach(function (result) {
        credentialStoreSetPassword({
          domain: JSON.parse(result.account).domain,
          username: JSON.parse(result.account).username,
          password: result.password
        })
      })
      settings.set('v1_23_keychainMigrationComplete', true)
    })
  }
}, 5000)
ipc.on('setPwdCount',(e,a)=>{
  sendIPCToMainWindow('setPwdCount',{count:a.count,url:a.url})
})
