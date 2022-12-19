/**
 * 此服务是提供给使用了文件形式的密码库的响应，和kechain不同的是，此形式只将凭证存储在加密存储中，而不将密码库整个存储进去。
 * 当用户登录后，保存凭证将使用安全存储进行，而且此凭证与原先的keychain的密码是分离的。
 * 至于有效时间，则由用户应用中来处理，一旦失效，则用户需要再次提供凭证。
 * **/
// const keytar = require('keytar')
// const safeStorage = require('electron').safeStorage
const kdbxFilePath = path.join(userDataPath, 'kdbxStore')
const KdbxModel=require('./src/model/kdbxModel.js')
const kdbxModel=new KdbxModel()
/*
file format:
{
  version: 1,
  credentials: [
    {
      dbname:'',//中文
      filePath:'',//路径
      password:''//明文存储,
      keyfile:''//路径
    }
  ]
}
*/

function readSavedKdbxPasswordFile () {
  let file
  try {
    file = fs.readFileSync(kdbxFilePath)
  } catch (e) {
    if (e.code !== 'ENOENT') {
      console.warn(e)
      throw new Error(e)
    }
  }
  try{
    if (file) {
      const creds=JSON.parse(safeStorage.decryptString(file))
      return creds
    } else {
      return {
        version: 1,
        credentials: []
      }
    }
  }catch (e) {
    console.warn(e)
    return {
      version: 1,
      credentials: []
    }
  }

}


function writeSavedKdbxPasswordFile (content) {
  fs.writeFileSync(kdbxFilePath, safeStorage.encryptString(JSON.stringify(content)))
}

function kdbxCredentialStoreSetPassword (crd) {
  const fileContent = readSavedKdbxPasswordFile()

  // delete duplicate credentials
  for (let i = 0; i < fileContent.credentials.length; i++) {
    if (fileContent.credentials[i].filePath === crd.filePath) {
      fileContent.credentials.splice(i, 1)
      i--
    }
  }

  fileContent.credentials.push(crd)
  writeSavedKdbxPasswordFile(fileContent)
}

ipc.handle('kdbxCredentialStoreSetPassword', async function (event, account) {
  return credentialStoreSetPassword(account)
})

ipc.handle('kdbxCredentialStoreDeletePassword', async function (event, account) {
  const fileContent = readSavedPasswordFile()

  // delete matching credentials
  for (let i = 0; i < fileContent.credentials.length; i++) {
    if (fileContent.credentials[i].domain === account.domain && fileContent.credentials[i].username === account.username) {
      fileContent.credentials.splice(i, 1)
      i--
    }
  }

  return writeSavedKdbxPasswordFile(fileContent)
})

ipc.handle('kdbxCredentialStoreGetCredentials', async function (event) {
  console.log()
  const pm=settings.get('passwordManager')
  console.log('pm=',pm)
  let filePath=pm.filePath
  if(!fs.existsSync(filePath)){
    dialog.showMessageBoxSync({
      message:'密码库文件不存在，请确认密码库存在。'
    })
    return []
  }
  let creds=readSavedKdbxPasswordFile()
  console.log('获取全部密码的范围内取creds',creds)
  let currentDbCred=creds.credentials.find(cred=>{
    return cred.filePath===filePath
  })
  if(!currentDbCred){
    console.warn('不存在记录的凭证，打开失败')
    return
  }
  const gotCreds=new Promise(resolve => {
    kdbxModel.openFile(currentDbCred.password,currentDbCred.filePath,currentDbCred.keyFile, (err,data)=>{
      if(err){
        console.warn('打开失败',err)
        return
      }
      let allCredentials=kdbxModel.getAllCredentials()
      allCredentials=allCredentials.map(crd=>{
        crd.name=crd.title
        return crd
      })
      resolve(allCredentials)
    })
  })
  return await gotCreds
})

ipc.handle('setKdbxCredential',async function(event,args){
  console.log('存入凭证',args)
  kdbxCredentialStoreSetPassword({
    filePath:args.filePath,
    name:args.name,
    password:args.password,
    keyFile:args.keyFile
  })
})
