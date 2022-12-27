/**
 * 此服务是提供给使用了文件形式的密码库的响应，和kechain不同的是，此形式只将凭证存储在加密存储中，而不将密码库整个存储进去。
 * 当用户登录后，保存凭证将使用安全存储进行，而且此凭证与原先的keychain的密码是分离的。
 * 至于有效时间，则由用户应用中来处理，一旦失效，则用户需要再次提供凭证。
 *
 *
 * **/
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
const KdbxModel = require('./src/model/kdbxModel.js')

/**
 * 用于处理凭证的服务，为了区分和密码所以单列了
 */
class CredentialService {
  storageFile

  constructor (credentialStorageFile) {
    this.storageFile = credentialStorageFile
  }

  /**
   * 写回凭证
   * @param content 凭证内容
   */
  saveAll (content) {
    fs.writeFileSync(this.storageFile, safeStorage.encryptString(JSON.stringify(content)))
  }

  /**
   * 获取全部的凭证
   * @returns {any|{credentials: *[], version: number}}
   */
  getAll () {
    let file
    try {
      file = fs.readFileSync(this.storageFile)
    } catch (e) {
      if (e.code !== 'ENOENT') {
        console.warn(e)
        throw new Error(e)
      }
    }
    try {
      if (file) {
        const creds = JSON.parse(safeStorage.decryptString(file))
        return creds
      } else {
        return {
          version: 1,
          credentials: []
        }
      }
    } catch (e) {
      console.warn(e)
      return {
        version: 1,
        credentials: []
      }
    }
  }

  /**
   * 获得当前凭证库中的一个凭证（从加密文件中获取）
   * @returns {boolean|*}
   */
  get (filePath) {
    let creds = this.getAll()
    let currentDbCred = creds.credentials.find(cred => {
      return cred.filePath === filePath
    })
    if (!currentDbCred) {
      console.warn('不存在记录的凭证，打开失败')
      return false
    }
    return currentDbCred
  }

  /**
   * 写回一个凭证
   * @param crd 将一个标准的凭证写回到文件中，自动去重
   */
  set (crd) {
    const fileContent = this.getAll()
    // delete duplicate credentials
    for (let i = 0; i < fileContent.credentials.length; i++) {
      if (fileContent.credentials[i].filePath === crd.filePath) {
        fileContent.credentials.splice(i, 1)
        i--
      }
    }
    fileContent.credentials.push(crd)
    this.saveAll(fileContent)
  }
}

let credentialService //凭证的管理器，此服务只用于文件形式密码库的管理

class KdbxService {
  kdbxFilePath = path.join(userDataPath, 'kdbxStore')
  kdbxModel = new KdbxModel()
  dbFile = ''
  currentCredential = {}
  credentialService = credentialService

  constructor (props) {
    credentialService=new CredentialService(this.kdbxFilePath)
    this.credentialService=credentialService
  }

  /**
   * 做好密码库的准备，主要做了以下操作
   * 1.从先前有效的凭证中取出凭证
   * 2.准备好凭证
   * @returns {Promise<*[]>}
   */
  async prepareDb () {
    const pm = settings.get('passwordManager')
    let filePath = pm.filePath
    if (!fs.existsSync(filePath)) {
      console.warn('当前密码库不存在')
      return []
    }
    this.dbFile = filePath
    this.currentCredential = this.credentialService.get(filePath) //获取当前凭证
  }

  /**
   * 从配置中重载一下密码管理器
   * @returns {Promise<[]|undefined>}
   */
  async reload () {
    return await this.prepareDb()
  }

  async openDb(){
    let currentCredential = this.currentCredential
    let openDb=new Promise(resolve => {
      this.kdbxModel.openFile(currentCredential.password, currentCredential.filePath, currentCredential.keyFile, (err, data) => {
        if (err) {
          console.warn('打开失败', err)
          return
        }
        resolve(data)
      })
    })
    return await openDb
  }

  /**
   * 此方法是真正的获取密码方法
   * @returns {Promise<unknown>}
   */
  async getAllPasswords () {
    await this.openDb()
    let allCredentials = this.kdbxModel.getAllCredentials()
    allCredentials = allCredentials.filter(crd => {
      crd.name = crd.title
      //排除掉已删除的密码
      return crd.originData.parentGroup.uuid.id!==this.kdbxModel.db.meta.recycleBinUuid.id
    })
    return allCredentials
    // const gotCreds = new Promise(resolve => {
    //   this.kdbxModel.openFile(currentCredential.password, currentCredential.filePath, currentCredential.keyFile, (err, data) => {
    //     if (err) {
    //       console.warn('打开失败', err)
    //       return
    //     }
    //     let allCredentials = this.kdbxModel.getAllCredentials()
    //     allCredentials = allCredentials.filter(crd => {
    //       crd.name = crd.title
    //       //排除掉已删除的密码
    //       return crd.originData.parentGroup.uuid.id!==this.kdbxModel.db.meta.recycleBinUuid.id
    //     })
    //     resolve(allCredentials)
    //   })
    // })
    // return await gotCreds
  }

  /**
   * 设置密码，如果密码存在或已被删除，则自动更新一个版本，并移动回正式组。
   * @param account
   * @returns {Promise<void>}
   */
  async setPassword(account){
    await this.openDb()
    let allCredentials = this.kdbxModel.getAllCredentials()
    let found = allCredentials.find(crd => {
      return (crd.domain = account.domain && crd.username===account.username)
    })
    if(found){
      if(found.originData.parentGroup.uuid.id===this.kdbxModel.db.meta.recycleBinUuid.id)
      {
        // 已删除的密码要复原
        this.kdbxModel.recoveryEntry(found.originData)
      }
      this.kdbxModel.updateEntry(found.originData,account)
    }else{
      this.kdbxModel.createEntry(account)
    }

    return await this.kdbxModel.save()
  }
}

const kdbxService = new KdbxService()
app.whenReady().then(() => {
  kdbxService.prepareDb()
})

ipc.handle('kdbxCredentialStoreSetPassword', async function (event, account) {
  return kdbxService.setPassword(account)// credentialStoreSetPassword(account)
})

ipc.handle('kdbxCredentialStoreDeletePassword', async function (event, account) {
  //删除一个密码 //todo
  const fileContent = readSavedPasswordFile()
  for (let i = 0; i < fileContent.credentials.length; i++) {
    if (fileContent.credentials[i].domain === account.domain && fileContent.credentials[i].username === account.username) {
      fileContent.credentials.splice(i, 1)
      i--
    }
  }
  return writeSavedKdbxPasswordFile(fileContent)
})

ipc.handle('kdbxCredentialStoreGetCredentials', async function (event) {
  //获取全部密码，已实现
  return await kdbxService.getAllPasswords()
})

/**
 * 存入一下新的凭证
 */
ipc.handle('setKdbxCredential', async function (event, args) {
  //存入一个认证过的凭证
  credentialService.set({
    filePath: args.filePath,
    name: args.name,
    password: args.password,
    keyFile: args.keyFile
  })
})
